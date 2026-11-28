// Kademeli Dalga (Wave) Yöneticisi: Bölüm 1 + 5'li Kademeli 20 Yeni Düşman Grubu + 10 Yeni Dev Boss
window.WaveDirector = class WaveDirector {
  constructor(game) {
    this.game = game;
    this.reset();
  }

  reset() {
    this.stage = 1;
    this.cycle = 0; // 15 bölüm bitince tur sayacı artar; zorluk kaldığı yerden büyümeye devam eder
    this.stageTime = 0;
    this.waveTimer = 0.6;
    this.waveIndex = 0;
    this.bossSpawned = false;
    this.bossWarningTimer = 0;
    this.bossActive = null;
  }

  // Aktif bölüme (Stage 1..15) göre lineer güçlenen 5'li düşman kadrosunu döndürür (asla geriye düşmez):
  // Stage 1: Klasik kadro (scout_pod..elite_cruiser)
  // Stage 2..4: Grup 1 (e2_1..e2_5) -> Grup 2'ye kademeli geçiş
  // Stage 5..7: Grup 2 (e2_6..e2_10) -> Grup 3'e kademeli geçiş
  // Stage 8..10: Grup 3 (e2_11..e2_15) -> Grup 4'e kademeli geçiş
  // Stage 11..15: Grup 4 (e2_16..e2_20) elit filo kombinasyonları
  getStageRoster() {
    // 2. tur ve sonrasında (bölüm 16+) her zaman en güçlü elit kadro uçar
    const rosterStage = this.cycle > 0 ? 15 : this.stage;
    if (rosterStage === 1) {
      return {
        tier1: 'scout_pod',
        tier2: 'fang_fighter',
        tier3: 'squid_mech',
        tier4: 'heavy_gunship',
        tier5: 'elite_cruiser',
        diver: 'kamikaze_dart'
      };
    }

    const LINEAR_ROSTERS = {
      2:  { tier1: 'e2_1',  tier2: 'e2_2',  tier3: 'e2_3',  tier4: 'e2_4',  tier5: 'e2_5',  diver: 'e2_3'  },
      3:  { tier1: 'e2_6',  tier2: 'e2_2',  tier3: 'e2_3',  tier4: 'e2_4',  tier5: 'e2_5',  diver: 'e2_3'  },
      4:  { tier1: 'e2_6',  tier2: 'e2_7',  tier3: 'e2_8',  tier4: 'e2_4',  tier5: 'e2_10', diver: 'e2_8'  },
      5:  { tier1: 'e2_6',  tier2: 'e2_7',  tier3: 'e2_8',  tier4: 'e2_9',  tier5: 'e2_10', diver: 'e2_8'  },
      6:  { tier1: 'e2_11', tier2: 'e2_7',  tier3: 'e2_8',  tier4: 'e2_9',  tier5: 'e2_10', diver: 'e2_8'  },
      7:  { tier1: 'e2_11', tier2: 'e2_12', tier3: 'e2_13', tier4: 'e2_9',  tier5: 'e2_15', diver: 'e2_13' },
      8:  { tier1: 'e2_11', tier2: 'e2_12', tier3: 'e2_13', tier4: 'e2_14', tier5: 'e2_15', diver: 'e2_13' },
      9:  { tier1: 'e2_16', tier2: 'e2_12', tier3: 'e2_13', tier4: 'e2_14', tier5: 'e2_15', diver: 'e2_13' },
      10: { tier1: 'e2_16', tier2: 'e2_17', tier3: 'e2_18', tier4: 'e2_14', tier5: 'e2_20', diver: 'e2_18' },
      11: { tier1: 'e2_16', tier2: 'e2_17', tier3: 'e2_18', tier4: 'e2_19', tier5: 'e2_20', diver: 'e2_18' },
      12: { tier1: 'e2_16', tier2: 'e2_17', tier3: 'e2_18', tier4: 'e2_19', tier5: 'e2_20', diver: 'e2_18' },
      13: { tier1: 'e2_17', tier2: 'e2_18', tier3: 'e2_18', tier4: 'e2_19', tier5: 'e2_20', diver: 'e2_18' },
      14: { tier1: 'e2_17', tier2: 'e2_18', tier3: 'e2_19', tier4: 'e2_19', tier5: 'e2_20', diver: 'e2_18' },
      15: { tier1: 'e2_18', tier2: 'e2_18', tier3: 'e2_19', tier4: 'e2_19', tier5: 'e2_20', diver: 'e2_19' }
    };

    return LINEAR_ROSTERS[Math.min(15, Math.max(2, rosterStage))];
  }

  // Her bölümde (1..15) o bölüme özel Dev Boss'u seçer
  getStageBossKey() {
    if (window.StageThemes) {
      const st = window.StageThemes.getStage(this.stage);
      if (st && st.bossKey) return st.bossKey;
    }
    if (this.stage === 1) return 'boss_dreadnought';
    const bIdx = ((this.stage - 2) % 14) + 1;
    return `boss_${bIdx}`;
  }

  // Oynanan toplam bölüm numarası (1..15, sonraki turlarda 16, 17, ...)
  getTotalStage() {
    return this.cycle * 15 + this.stage;
  }

  // Düşman ve Boss can çarpanı: oyuncunun silah/yetenek gelişimine ayak uyduran hızlanan eğri
  getDifficultyMult() {
    const d = window.GAME_CONFIG.DIFFICULTY;
    const n = this.getTotalStage() - 1;
    return (1 + d.HP_LINEAR * n) * Math.pow(d.HP_GROWTH, n);
  }

  // Normal düşman vuruş hasarı çarpanı
  getEnemyDamageMult() {
    const c = window.GAME_CONFIG;
    return Math.min(c.ENEMY_DAMAGE_MAX, c.ENEMY_DAMAGE_MULT + c.ENEMY_DAMAGE_STEP * (this.getTotalStage() - 1));
  }

  // Boss can çarpanı (ilk bölümde düşük başlar, bölüm ilerledikçe artar)
  getBossHpPower() {
    const d = window.GAME_CONFIG.DIFFICULTY;
    return Math.min(d.BOSS_HP_MAX, d.BOSS_HP_START + d.BOSS_HP_STEP * (this.getTotalStage() - 1));
  }

  // Boss mermi/çarpma hasar çarpanı
  getBossDamagePower() {
    const d = window.GAME_CONFIG.DIFFICULTY;
    return Math.min(d.BOSS_DMG_MAX, d.BOSS_DMG_START + d.BOSS_DMG_STEP * (this.getTotalStage() - 1));
  }

  update(dt) {
    if (this.bossWarningTimer > 0) {
      this.bossWarningTimer -= dt;
      if (this.bossWarningTimer <= 0 && !this.bossActive) {
        this.spawnBoss();
      }
      return;
    }

    if (this.bossActive) {
      this.updateBoss(this.bossActive, dt);
      return;
    }

    this.stageTime += dt;
    const tl = window.GAME_CONFIG.TIMELINE;

    if (this.stageTime >= tl.PHASE_3_END && !this.bossSpawned) {
      this.bossSpawned = true;
      this.bossWarningTimer = tl.BOSS_WARNING_DURATION;
      this.game.addScreenShake(12, 1.2);
      if (window.AudioManager) window.AudioManager.playBossWarning();
      return;
    }

    this.waveTimer -= dt;
    if (this.waveTimer <= 0) {
      this.spawnNextWave();
    }
  }

  spawnNextWave() {
    const tl = window.GAME_CONFIG.TIMELINE;
    const W = window.GAME_CONFIG.WIDTH;
    const roster = this.getStageRoster();
    this.waveIndex++;

    if (this.stageTime < tl.PHASE_1_END) {
      // FAZ 1: Tier 1 ve Tier 2 düşmanlar
      this.waveTimer = 3.0;
      const mode = this.waveIndex % 3;

      if (mode === 0) {
        const cx = 140 + Math.random() * (W - 280);
        for (let i = -2; i <= 2; i++) {
          this.spawnEnemy(roster.tier1, cx + i * 52, -45 - Math.abs(i) * 42, {
            pattern: 'v_formation',
            anchorX: cx + i * 52,
            phase: i * 0.6,
            speed: 150
          });
        }
      } else if (mode === 1) {
        const anchorX = 130 + Math.random() * (W - 260);
        for (let i = 0; i < 4; i++) {
          this.spawnEnemy(i % 2 === 0 ? roster.tier1 : roster.tier2, anchorX, -45 - i * 64, {
            pattern: 'sine_wave',
            anchorX,
            amp: 75,
            freq: 2.6,
            phase: i * 0.8,
            speed: 155
          });
        }
      } else {
        const fromLeft = (this.waveIndex % 2 === 0);
        for (let i = 0; i < 4; i++) {
          this.spawnEnemy(roster.tier2, fromLeft ? -40 : W + 40, 80, {
            pattern: 'scissor_cross',
            age: -i * 0.32,
            duration: 4.3,
            p0: { x: fromLeft ? -40 : W + 40, y: 60 },
            p1: { x: fromLeft ? W * 0.85 : W * 0.15, y: 240 },
            p2: { x: fromLeft ? W * 0.15 : W * 0.85, y: 520 },
            p3: { x: fromLeft ? W + 60 : -60, y: 820 }
          });
        }
      }
    } else if (this.stageTime < tl.PHASE_2_END) {
      // FAZ 2: Tier 2, Tier 3 ve Tier 4 düşmanlar
      this.waveTimer = 3.3;
      const mode = this.waveIndex % 4;

      if (mode === 0) {
        for (let i = 0; i < 3; i++) {
          this.spawnEnemy(roster.tier2, -40, 80, {
            pattern: 'scissor_cross',
            age: -i * 0.38,
            duration: 4.2,
            p0: { x: -40, y: 40 },
            p1: { x: W * 0.85, y: 240 },
            p2: { x: W * 0.25, y: 480 },
            p3: { x: W + 60, y: 780 }
          });
          this.spawnEnemy(roster.tier3, W + 40, 80, {
            pattern: 'scissor_cross',
            age: -i * 0.38,
            duration: 4.2,
            p0: { x: W + 40, y: 40 },
            p1: { x: W * 0.15, y: 240 },
            p2: { x: W * 0.75, y: 480 },
            p3: { x: -60, y: 780 }
          });
        }
      } else if (mode === 1) {
        for (let i = 0; i < 4; i++) {
          const ax = 140 + (i % 2) * 260;
          this.spawnEnemy(roster.tier3, ax, -50 - i * 75, {
            pattern: 'sine_wave',
            anchorX: ax,
            amp: 95,
            freq: 2.3,
            phase: i * 1.1,
            speed: 135
          });
        }
      } else if (mode === 2) {
        this.spawnEnemy(roster.tier4, -60, 120, {
          pattern: 'tactical_hover',
          startX: -60, startY: 90,
          targetX: 155, targetY: 220,
          hoverDuration: 4.5,
          exitDir: -1,
          phase: 0,
          speed: 145
        });
        this.spawnEnemy(roster.tier4, W + 60, 120, {
          pattern: 'tactical_hover',
          startX: W + 60, startY: 90,
          targetX: W - 155, targetY: 220,
          hoverDuration: 4.5,
          exitDir: 1,
          phase: 1.5,
          speed: 145
        });
      } else {
        const fromLeft = (this.waveIndex % 2 === 0);
        for (let i = 0; i < 4; i++) {
          this.spawnEnemy(roster.tier2, fromLeft ? -40 : W + 40, -40, {
            pattern: 'loop_the_loop',
            age: -i * 0.34,
            startX: fromLeft ? 60 : W - 60,
            startY: -40,
            loopCenterX: W * 0.5,
            loopCenterY: 270,
            loopRadius: 115,
            loopDir: fromLeft ? 1 : -1,
            speed: 185
          });
        }
      }
    } else {
      // FAZ 3: Tier 3, Tier 4, Diver ve Tier 5 (Elit Kruvazör)
      this.waveTimer = 3.3;
      const mode = this.waveIndex % 4;

      if (mode === 0) {
        this.spawnEnemy(roster.tier5, W * 0.5, -80, {
          pattern: 'tactical_hover',
          startX: W * 0.5, startY: -80,
          targetX: W * 0.5, targetY: 195,
          hoverDuration: 6.2,
          exitDir: (Math.random() < 0.5 ? -1 : 1),
          phase: 0,
          speed: 125
        });
        this.spawnEnemy(roster.tier3, 110, -60, {
          pattern: 'tactical_hover',
          startX: -50, startY: 80,
          targetX: 110, targetY: 250,
          hoverDuration: 4.8,
          exitDir: -1,
          phase: 1,
          speed: 145
        });
        this.spawnEnemy(roster.tier3, W - 110, -60, {
          pattern: 'tactical_hover',
          startX: W + 50, startY: 80,
          targetX: W - 110, targetY: 250,
          hoverDuration: 4.8,
          exitDir: 1,
          phase: 2,
          speed: 145
        });
      } else if (mode === 1) {
        for (let i = 0; i < 5; i++) {
          const sx = 75 + i * 96;
          this.spawnEnemy(roster.diver, sx, -40 - i * 35, {
            pattern: 'kamikaze_dive',
            age: -i * 0.22,
            lockedAngle: Math.PI * 0.5,
            speed: 225
          });
        }
      } else if (mode === 2) {
        for (let i = 0; i < 3; i++) {
          this.spawnEnemy(roster.tier2, 80, -40, {
            pattern: 'loop_the_loop',
            age: -i * 0.3,
            startX: 90, startY: -40,
            loopCenterX: 175, loopCenterY: 250,
            loopRadius: 95, loopDir: 1, speed: 190
          });
          this.spawnEnemy(roster.tier3, W - 80, -40, {
            pattern: 'loop_the_loop',
            age: -i * 0.3,
            startX: W - 90, startY: -40,
            loopCenterX: W - 175, loopCenterY: 250,
            loopRadius: 95, loopDir: -1, speed: 190
          });
        }
      } else {
        for (let i = -1; i <= 1; i += 2) {
          this.spawnEnemy(roster.tier4, W * 0.5 + i * 145, -60, {
            pattern: 'tactical_hover',
            startX: W * 0.5 + i * 240, startY: 40,
            targetX: W * 0.5 + i * 135, targetY: 210,
            hoverDuration: 5.0,
            exitDir: i,
            phase: i,
            speed: 145
          });
        }
        for (let i = -1; i <= 1; i++) {
          this.spawnEnemy(roster.tier1, W * 0.5 + i * 55, -50 - Math.abs(i) * 35, {
            pattern: 'v_formation',
            anchorX: W * 0.5 + i * 55,
            phase: i,
            speed: 165
          });
        }
      }
    }
  }

  spawnEnemy(type, x, y, opts = {}) {
    const base = window.GAME_CONFIG.ENEMIES[type];
    if (!base) return null;
    const mult = this.getDifficultyMult();

    const e = this.game.enemyPool.acquire();
    e.type = type;
    e.x = x;
    e.y = y;
    e.w = base.w;
    e.h = base.h;
    e.radius = base.radius;
    e.maxHp = Math.round(base.hp * mult);
    e.hp = e.maxHp;
    e.score = base.score;
    e.damage = Math.round(base.damage * this.getEnemyDamageMult());
    e.fireRate = base.fireRate / Math.min(1.45, 1 + (this.getTotalStage() - 1) * 0.10);
    e.fireTimer = 0.8 + Math.random() * e.fireRate;
    e.bulletSpeed = base.bulletSpeed;
    e.bulletFrame = base.bullet || 'bullet_enemy_dart';
    e.attackStyle = base.style || 'single';
    e.hitFlash = 0;
    e.rotation = 0;
    e.isBoss = false;
    e.entering = false;
    e.dying = false;
    e.burnTimer = 0;
    e.burnDps = 0;
    e.chillTimer = 0;

    e.pattern = opts.pattern || 'v_formation';
    e.age = opts.age || 0;
    e.speed = opts.speed || 150;
    e.anchorX = opts.anchorX !== undefined ? opts.anchorX : x;
    e.amp = opts.amp || 60;
    e.freq = opts.freq || 2.5;
    e.phase = opts.phase || 0;
    e.duration = opts.duration || 4.0;
    e.p0 = opts.p0 || { x, y };
    e.p1 = opts.p1 || { x, y: y + 200 };
    e.p2 = opts.p2 || { x, y: y + 400 };
    e.p3 = opts.p3 || { x, y: y + 800 };
    e.startX = opts.startX !== undefined ? opts.startX : x;
    e.startY = opts.startY !== undefined ? opts.startY : y;
    e.targetX = opts.targetX !== undefined ? opts.targetX : x;
    e.targetY = opts.targetY !== undefined ? opts.targetY : 200;
    e.hoverDuration = opts.hoverDuration || 4.0;
    e.exitDir = opts.exitDir || 1;
    e.loopCenterX = opts.loopCenterX || 270;
    e.loopCenterY = opts.loopCenterY || 260;
    e.loopRadius = opts.loopRadius || 100;
    e.loopDir = opts.loopDir || 1;
    e.lockedAngle = opts.lockedAngle || Math.PI * 0.5;

    return e;
  }

  fireEnemyWeapon(e) {
    if (e.y < 20 || e.y > window.GAME_CONFIG.HEIGHT - 140) return;
    const p = this.game.player;
    const spd = e.bulletSpeed;
    const bFrame = e.bulletFrame || 'bullet_enemy_dart';
    const style = e.attackStyle || 'single';

    if (style === 'none' || spd <= 0) return;

    if (style === 'single') {
      this.game.spawnEnemyBullet(e.x, e.y + 24, 0, spd, e.damage, bFrame, 24, 34, 0);
    } else if (style === 'aimed') {
      const ang = Math.atan2(p.y - e.y, p.x - e.x);
      this.game.spawnEnemyBullet(
        e.x, e.y + 26,
        Math.cos(ang) * spd, Math.sin(ang) * spd,
        e.damage, bFrame, 24, 36, ang - Math.PI * 0.5
      );
    } else if (style === 'aimed2') {
      const ang = Math.atan2(p.y - e.y, p.x - e.x);
      for (let s = -1; s <= 1; s += 2) {
        const a = ang + s * 0.12;
        this.game.spawnEnemyBullet(
          e.x + s * 14, e.y + 26,
          Math.cos(a) * spd, Math.sin(a) * spd,
          e.damage, bFrame, 24, 34, a - Math.PI * 0.5
        );
      }
    } else if (style === 'twin') {
      this.game.spawnEnemyBullet(e.x - 18, e.y + 28, -36, spd, e.damage, bFrame, 26, 26, 0);
      this.game.spawnEnemyBullet(e.x + 18, e.y + 28, 36, spd, e.damage, bFrame, 26, 26, 0);
    } else if (style === 'spread3') {
      const angles = [-0.28, 0, 0.28];
      for (let i = 0; i < angles.length; i++) {
        const a = Math.PI * 0.5 + angles[i];
        this.game.spawnEnemyBullet(
          e.x + angles[i] * 36, e.y + 32,
          Math.cos(a) * spd, Math.sin(a) * spd,
          e.damage, bFrame, 26, 36, angles[i]
        );
      }
    } else if (style === 'spread4') {
      const angles = [-0.36, -0.12, 0.12, 0.36];
      for (let i = 0; i < angles.length; i++) {
        const a = Math.PI * 0.5 + angles[i];
        this.game.spawnEnemyBullet(
          e.x, e.y + 34,
          Math.cos(a) * spd, Math.sin(a) * spd,
          e.damage, bFrame, 26, 34, angles[i]
        );
      }
    } else if (style === 'spread5') {
      const angles = [-0.44, -0.22, 0, 0.22, 0.44];
      for (let i = 0; i < angles.length; i++) {
        const a = Math.PI * 0.5 + angles[i];
        this.game.spawnEnemyBullet(
          e.x, e.y + 40,
          Math.cos(a) * spd, Math.sin(a) * spd,
          e.damage, bFrame, 28, 28, angles[i]
        );
      }
    } else if (style === 'ring6' || style === 'ring8') {
      const count = style === 'ring8' ? 8 : 6;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        this.game.spawnEnemyBullet(
          e.x, e.y + 20,
          Math.cos(a) * (spd * 0.85), Math.sin(a) * (spd * 0.85),
          e.damage, bFrame, 26, 26, a - Math.PI * 0.5
        );
      }
    }
  }

  // =========================================================================
  // BÖLÜM SONU BOSS SAVAŞI (boss_dreadnought + 10 Yeni Dev Boss: boss_1..boss_10)
  // =========================================================================
  spawnBoss() {
    const bossKey = this.getStageBossKey();
    const base = window.GAME_CONFIG.ENEMIES[bossKey] || window.GAME_CONFIG.ENEMIES.boss_dreadnought;
    const mult = this.getDifficultyMult();

    const boss = this.game.enemyPool.acquire();
    boss.type = bossKey;
    boss.isBoss = true;
    boss.x = window.GAME_CONFIG.WIDTH * 0.5;
    boss.y = -130;
    boss.w = base.w;
    boss.h = base.h;
    boss.radius = base.radius;
    // 2. tur ve sonrasında Boss taban canı son bölüm Boss'unun altına düşmez
    const baseHp = this.cycle > 0 ? Math.max(base.hp, window.GAME_CONFIG.ENEMIES.boss_14.hp) : base.hp;
    boss.maxHp = Math.round(baseHp * mult * this.getBossHpPower());
    boss.hp = boss.maxHp;
    boss.score = base.score;
    boss.xpReward = base.xp || 360;
    boss.damage = Math.round(base.damage * this.getBossDamagePower());
    boss.bulletPower = this.getBossDamagePower();
    boss.bullet1 = base.bullet1 || 'bullet_enemy_dart';
    boss.bullet2 = base.bullet2 || 'bullet_enemy_orb';
    boss.hitFlash = 0;
    boss.rotation = 0;
    boss.burnTimer = 0;
    boss.burnDps = 0;
    boss.chillTimer = 0;

    boss.age = 0;
    boss.phase = 1;
    boss.attackTimer = 1.8;
    boss.droneTimer = 7.5;
    boss.dying = false;
    boss.deathTimer = 0;
    boss.entering = true; // Yerine oturana kadar hasar almaz

    this.bossActive = boss;
  }

  updateBoss(b, dt) {
    if (b.dying) {
      b.deathTimer -= dt;
      if (Math.random() < dt * 16) {
        const ox = (Math.random() - 0.5) * b.w * 0.85;
        const oy = (Math.random() - 0.5) * b.h * 0.75;
        this.game.spawnExplosion(b.x + ox, b.y + oy, 95 + Math.random() * 55);
        this.game.addScreenShake(9, 0.15);
      }
      if (b.deathTimer <= 0) {
        this.completeBossDefeat(b);
      }
      return;
    }

    b.age += dt;

    if (b.y < 155) {
      b.y += 110 * dt;
      return;
    }
    b.entering = false;

    const hpRatio = b.hp / b.maxHp;
    const newPhase = hpRatio > 0.65 ? 1 : (hpRatio > 0.30 ? 2 : 3);
    if (newPhase !== b.phase) {
      b.phase = newPhase;
      this.game.addScreenShake(14, 0.55);
      this.game.spawnExplosion(b.x - 55, b.y + 20, 95);
      this.game.spawnExplosion(b.x + 55, b.y + 20, 95);
      const phaseXp = Math.round((b.xpReward || 360) * 0.22);
      this.game.spawnPickup(b.x, b.y + 60, 'xp_gem', phaseXp);
    }

    const moveSpeed = b.phase === 1 ? 1.15 : (b.phase === 2 ? 1.65 : 2.25);
    b.x = window.GAME_CONFIG.WIDTH * 0.5 + Math.sin(b.age * moveSpeed) * 135;
    b.y = 155 + Math.cos(b.age * 1.8) * 16;

    b.attackTimer -= dt;
    if (b.attackTimer <= 0) {
      if (window.AudioManager) window.AudioManager.playBossShoot();
      const leftBarrelX = b.x - 52;
      const rightBarrelX = b.x + 52;
      const barrelY = b.y + 76;
      const b1 = b.bullet1 || 'bullet_enemy_dart';
      const b2 = b.bullet2 || 'bullet_enemy_orb';

      if (b.phase === 1) {
        b.attackTimer = 1.45;
        for (let i = -2; i <= 2; i++) {
          const ang = Math.PI * 0.5 + i * 0.19;
          this.game.spawnEnemyBullet(
            leftBarrelX, barrelY,
            Math.cos(ang) * 305, Math.sin(ang) * 305,
            20 * b.bulletPower, b1, 26, 38, i * 0.19
          );
          this.game.spawnEnemyBullet(
            rightBarrelX, barrelY,
            Math.cos(ang) * 305, Math.sin(ang) * 305,
            20 * b.bulletPower, b1, 26, 38, i * 0.19
          );
        }
      } else if (b.phase === 2) {
        b.attackTimer = 1.15;
        for (let i = -3; i <= 3; i++) {
          const ang = Math.PI * 0.5 + i * 0.18 + Math.sin(b.age * 3) * 0.12;
          const bx = (i % 2 === 0) ? leftBarrelX : rightBarrelX;
          this.game.spawnEnemyBullet(
            bx, barrelY,
            Math.cos(ang) * 335, Math.sin(ang) * 335,
            22 * b.bulletPower, b2, 30, 30, 0
          );
        }
      } else {
        b.attackTimer = 0.78;
        for (let i = -3; i <= 3; i++) {
          const ang = Math.PI * 0.5 + i * 0.21 + Math.cos(b.age * 5) * 0.18;
          this.game.spawnEnemyBullet(
            leftBarrelX, barrelY,
            Math.cos(ang) * 360, Math.sin(ang) * 360,
            24 * b.bulletPower, b1, 26, 38, ang - Math.PI * 0.5
          );
          this.game.spawnEnemyBullet(
            rightBarrelX, barrelY,
            Math.cos(ang) * 360, Math.sin(ang) * 360,
            24 * b.bulletPower, b2, 28, 28, 0
          );
        }
      }
    }

    if (b.phase >= 2) {
      b.droneTimer -= dt;
      if (b.droneTimer <= 0) {
        b.droneTimer = b.phase === 2 ? 6.5 : 4.8;
        const roster = this.getStageRoster();
        this.spawnEnemy(roster.diver, b.x - 105, b.y + 30, {
          pattern: 'kamikaze_dive',
          lockedAngle: Math.PI * 0.5,
          speed: 220
        });
        this.spawnEnemy(roster.diver, b.x + 105, b.y + 30, {
          pattern: 'kamikaze_dive',
          lockedAngle: Math.PI * 0.5,
          speed: 220
        });
      }
    }
  }

  onBossKilled(b) {
    if (b.dying) return;
    b.dying = true;
    b.deathTimer = 2.4;
    this.game.enemyBulletPool.clear();
    this.game.addScreenShake(18, 2.4);
  }

  completeBossDefeat(b) {
    const bx = b.x;
    const by = b.y;
    const gemXp = Math.max(38, Math.round((b.xpReward || 380) / 10));
    b._active = false;
    this.bossActive = null;

    for (let i = 0; i < 10; i++) {
      const ang = (i / 10) * Math.PI * 2;
      const dist = 35 + (i % 3) * 35;
      this.game.spawnExplosion(bx + Math.cos(ang) * dist, by + Math.sin(ang) * dist, 125);
      this.game.spawnPickup(bx + Math.cos(ang) * dist * 0.8, by + Math.sin(ang) * dist * 0.5, 'xp_gem', gemXp);
    }

    // Her 2 Boss yenildiğinde ana silah merdivenini (1X -> 8X) +1 kademe yükselt
    const p = this.game.player;
    const maxWep = window.GAME_CONFIG.WEAPON_LADDER.length - 1;
    if (p && !p.dead && p.weaponLevel < maxWep && this.stage % 2 === 1) {
      p.weaponLevel++;
      this.game.addFloatText(`${window.I18N.t('WEAPON_EVOLVE')} (${p.weaponLevel}X)`, p.x, p.y - 65, '#57e2ff', 21);
    }

    this.game.addScore(b.score, bx, by);
    // Bölüm arası geçiş reklamı: yalnızca hazırsa gösterilir, reklam kapanana kadar oyun bekletilir
    if (window.Ads) window.Ads.showInterstitial();
    this.game.addFloatText(window.I18N.t('STAGE_CLEAR'), bx, by - 40, '#ffe047', 26);

    // Yeni Bölüme Geçiş (1..15): Yeni çevre nesneleri, yeni zemin/atmosfer ve yeni Boss!
    // 15. bölümden sonra çevre başa döner ama zorluk artmaya devam eder (bölüm 16, 17, ...)
    if (this.stage >= 15) this.cycle++;
    this.stage = (this.stage % 15) + 1;
    this.stageTime = 0;
    this.bossSpawned = false;
    this.waveTimer = 2.8;
    if (this.game.applyStageEnvironment) {
      this.game.applyStageEnvironment(this.stage);
    }
    const stInfo = window.StageThemes ? window.StageThemes.getStage(this.stage) : null;
    if (stInfo) {
      const isTr = window.I18N.lang === 'TR';
      const stTitle = isTr ? stInfo.nameTR : stInfo.nameEN;
      this.game.addFloatText(`${window.I18N.t('STAGE')} ${this.getTotalStage()}: ${stTitle}`, this.game.W * 0.5, 250, '#68e4ff', 20);
    }
  }
};
