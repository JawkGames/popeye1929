// Kademeli Dalga (Wave) Yöneticisi, 6 Düşman Tipi ve Çok Fazlı Kabasakal (Bluto) Boss Savaşı
window.WaveDirector = class WaveDirector {
  constructor(game) {
    this.game = game;
    this.reset();
  }

  reset() {
    this.stage = 1;
    this.stageTime = 0;
    this.waveTimer = 0.6;
    this.canTimer = 7.5;
    this.waveIndex = 0;
    this.bossSpawned = false;
    this.bossWarningTimer = 0;
    this.bossActive = null;

    // Uçaklardan veya zamandan konserve/altın düşmez; yalnızca öldürülen uçaklardan XP kristali çıkar
    this.scheduledCans = [];
  }

  // Düşman öldürünce konserve/altın düşmez, yalnızca XP kristali (xp_gem) düşer
  rollDrop() {
    return 'xp_gem';
  }

  getDifficultyMult() {
    return 1 + (this.stage - 1) * 0.35;
  }

  update(dt) {
    // Boss uyarısı veya aktif boss savaşı
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

    // Garantili zaman çizelgesi konservelerini kontrol et
    for (let i = 0; i < this.scheduledCans.length; i++) {
      const sc = this.scheduledCans[i];
      if (!sc.spawned && this.stageTime >= sc.time) {
        sc.spawned = true;
        const rx = 80 + Math.random() * (window.GAME_CONFIG.WIDTH - 160);
        this.game.spawnPickup(rx, -40, sc.type);
      }
    }

    const tl = window.GAME_CONFIG.TIMELINE;

    // 150. saniyede Bölüm Sonu Boss Uyarısını Başlat
    if (this.stageTime >= tl.PHASE_3_END && !this.bossSpawned) {
      this.bossSpawned = true;
      this.bossWarningTimer = tl.BOSS_WARNING_DURATION;
      this.game.addScreenShake(12, 1.2);
      return;
    }

    // Kademeli Dalga Üretimi (0-30s Başlangıç, 30-90s Gelişme, 90-150s Tırmanış)
    this.waveTimer -= dt;
    if (this.waveTimer <= 0) {
      this.spawnNextWave();
    }
  }

  getAvailableCanPool() {
    const tl = window.GAME_CONFIG.TIMELINE;
    if (this.stageTime < tl.PHASE_1_END) {
      return ['can_hp', 'can_2x', 'can_hp'];
    } else if (this.stageTime < tl.PHASE_2_END) {
      return ['can_hp', 'can_2x', 'can_3x', 'can_4x', 'can_wingman', 'can_shield'];
    }
    return ['can_hp', 'can_3x', 'can_4x', 'can_6x', 'can_wingman', 'can_shield', 'can_bomb'];
  }

  spawnNextWave() {
    const tl = window.GAME_CONFIG.TIMELINE;
    const W = window.GAME_CONFIG.WIDTH;
    this.waveIndex++;

    if (this.stageTime < tl.PHASE_1_END) {
      // FAZ 1 (0 - 30 sn): Başlangıç — Temel keşif düşmanları, V-formasyonu ve yumuşak sinüs dalgaları
      this.waveTimer = 3.2;
      const mode = this.waveIndex % 3;

      if (mode === 0) {
        // 5'li V-Formasyonu (Scout Pod)
        const cx = 140 + Math.random() * (W - 280);
        for (let i = -2; i <= 2; i++) {
          this.spawnEnemy('scout_pod', cx + i * 52, -45 - Math.abs(i) * 42, {
            pattern: 'v_formation',
            anchorX: cx + i * 52,
            phase: i * 0.6,
            speed: 145
          });
        }
      } else if (mode === 1) {
        // Sinüs dalgası kolonu (4 adet Scout Pod)
        const anchorX = 130 + Math.random() * (W - 260);
        for (let i = 0; i < 4; i++) {
          this.spawnEnemy('scout_pod', anchorX, -45 - i * 64, {
            pattern: 'sine_wave',
            anchorX,
            amp: 75,
            freq: 2.6,
            phase: i * 0.8,
            speed: 155
          });
        }
      } else {
        // Hafif çapraz makas geçişi (4 Scout Pod)
        const fromLeft = (this.waveIndex % 2 === 0);
        for (let i = 0; i < 4; i++) {
          this.spawnEnemy('scout_pod', fromLeft ? -40 : W + 40, 80, {
            pattern: 'scissor_cross',
            age: -i * 0.32,
            duration: 4.4,
            p0: { x: fromLeft ? -40 : W + 40, y: 60 },
            p1: { x: fromLeft ? W * 0.85 : W * 0.15, y: 240 },
            p2: { x: fromLeft ? W * 0.15 : W * 0.85, y: 520 },
            p3: { x: fromLeft ? W + 60 : -60, y: 820 }
          });
        }
      }
    } else if (this.stageTime < tl.PHASE_2_END) {
      // FAZ 2 (30 - 90 sn): Gelişme — Zırhlı Fang Avcılar, Biyo-Mekanik Kalamarlar ve 3'lü ateş eden Ağır Gunship
      this.waveTimer = 3.5;
      const mode = this.waveIndex % 4;

      if (mode === 0) {
        // Çift taraflı Çapraz Makas Geçişi (Fang Fighter)
        for (let i = 0; i < 3; i++) {
          this.spawnEnemy('fang_fighter', -40, 80, {
            pattern: 'scissor_cross',
            age: -i * 0.38,
            duration: 4.2,
            p0: { x: -40, y: 40 },
            p1: { x: W * 0.85, y: 240 },
            p2: { x: W * 0.25, y: 480 },
            p3: { x: W + 60, y: 780 }
          });
          this.spawnEnemy('fang_fighter', W + 40, 80, {
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
        // Biyo-Mekanik Kalamar Filosu (Squid Mech) — Geniş S-Dalgası
        for (let i = 0; i < 4; i++) {
          const ax = 140 + (i % 2) * 260;
          this.spawnEnemy('squid_mech', ax, -50 - i * 75, {
            pattern: 'sine_wave',
            anchorX: ax,
            amp: 95,
            freq: 2.3,
            phase: i * 1.1,
            speed: 130
          });
        }
      } else if (mode === 2) {
        // Taktiksel Duruş & 3'lü Yaylım Ateşi (2 Heavy Gunship + 2 Fang eskort)
        this.spawnEnemy('heavy_gunship', -60, 120, {
          pattern: 'tactical_hover',
          startX: -60, startY: 90,
          targetX: 155, targetY: 220,
          hoverDuration: 4.5,
          exitDir: -1,
          phase: 0,
          speed: 140
        });
        this.spawnEnemy('heavy_gunship', W + 60, 120, {
          pattern: 'tactical_hover',
          startX: W + 60, startY: 90,
          targetX: W - 155, targetY: 220,
          hoverDuration: 4.5,
          exitDir: 1,
          phase: 1.5,
          speed: 140
        });
      } else {
        // Loop-the-Loop Çember Manevrası (4 Fang Fighter)
        const fromLeft = (this.waveIndex % 2 === 0);
        for (let i = 0; i < 4; i++) {
          this.spawnEnemy('fang_fighter', fromLeft ? -40 : W + 40, -40, {
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
      // FAZ 3 (90 - 150 sn): Tırmanış — Yoğun kombo dalgaları, İntihar Dalışları ve Elit Çapa Kruvazörü (Mini-Boss)
      this.waveTimer = 3.4;
      const mode = this.waveIndex % 4;

      if (mode === 0) {
        // Elit Çapa Kruvazörü (Mini-Boss) + 2 Kalamar Eskort
        this.spawnEnemy('elite_cruiser', W * 0.5, -80, {
          pattern: 'tactical_hover',
          startX: W * 0.5, startY: -80,
          targetX: W * 0.5, targetY: 195,
          hoverDuration: 6.5,
          exitDir: (Math.random() < 0.5 ? -1 : 1),
          phase: 0,
          speed: 120,
          guaranteedCan: 'can_4x'
        });
        this.spawnEnemy('squid_mech', 110, -60, {
          pattern: 'tactical_hover',
          startX: -50, startY: 80,
          targetX: 110, targetY: 250,
          hoverDuration: 4.8,
          exitDir: -1,
          phase: 1,
          speed: 140
        });
        this.spawnEnemy('squid_mech', W - 110, -60, {
          pattern: 'tactical_hover',
          startX: W + 50, startY: 80,
          targetX: W - 110, targetY: 250,
          hoverDuration: 4.8,
          exitDir: 1,
          phase: 2,
          speed: 140
        });
      } else if (mode === 1) {
        // Hızlı İntihar Dalışı Filosu (5 Kamikaze Torpedo Dart)
        for (let i = 0; i < 5; i++) {
          const sx = 75 + i * 96;
          this.spawnEnemy('kamikaze_dart', sx, -40 - i * 35, {
            pattern: 'kamikaze_dive',
            age: -i * 0.22,
            lockedAngle: Math.PI * 0.5,
            speed: 225
          });
        }
      } else if (mode === 2) {
        // Çift Loop-the-Loop + V-Formasyonu Karma Baskını
        for (let i = 0; i < 3; i++) {
          this.spawnEnemy('fang_fighter', 80, -40, {
            pattern: 'loop_the_loop',
            age: -i * 0.3,
            startX: 90, startY: -40,
            loopCenterX: 175, loopCenterY: 250,
            loopRadius: 95, loopDir: 1, speed: 190
          });
          this.spawnEnemy('fang_fighter', W - 80, -40, {
            pattern: 'loop_the_loop',
            age: -i * 0.3,
            startX: W - 90, startY: -40,
            loopCenterX: W - 175, loopCenterY: 250,
            loopRadius: 95, loopDir: -1, speed: 190
          });
        }
      } else {
        // Ağır Ateş Hattı (2 Heavy Gunship + 3 Scout Pod)
        for (let i = -1; i <= 1; i += 2) {
          this.spawnEnemy('heavy_gunship', W * 0.5 + i * 145, -60, {
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
          this.spawnEnemy('scout_pod', W * 0.5 + i * 55, -50 - Math.abs(i) * 35, {
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
    e.damage = Math.round(base.damage * window.GAME_CONFIG.ENEMY_DAMAGE_MULT);
    e.fireRate = base.fireRate / Math.min(1.45, 1 + (this.stage - 1) * 0.12);
    e.fireTimer = 0.8 + Math.random() * e.fireRate;
    e.bulletSpeed = base.bulletSpeed;
    e.hitFlash = 0;
    e.rotation = 0;
    e.isBoss = false;

    // Formasyon parametreleri
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
    e.guaranteedCan = opts.guaranteedCan || null;

    return e;
  }

  fireEnemyWeapon(e) {
    if (e.y < 20 || e.y > window.GAME_CONFIG.HEIGHT - 140) return;
    const p = this.game.player;
    const spd = e.bulletSpeed;

    if (e.type === 'scout_pod') {
      // Tekli düz plazma atışı
      this.game.spawnEnemyBullet(e.x, e.y + 24, 0, spd, e.damage, 'bullet_enemy_dart', 18, 32, 0);
    } else if (e.type === 'fang_fighter') {
      // Oyuncuya hedefli hızlı dart mermisi
      const ang = Math.atan2(p.y - e.y, p.x - e.x);
      this.game.spawnEnemyBullet(
        e.x, e.y + 26,
        Math.cos(ang) * spd, Math.sin(ang) * spd,
        e.damage, 'bullet_enemy_dart', 20, 34, ang - Math.PI * 0.5
      );
    } else if (e.type === 'squid_mech') {
      // İkili organik enerji küresi
      this.game.spawnEnemyBullet(e.x - 16, e.y + 28, -38, spd, e.damage, 'bullet_enemy_orb', 22, 22, 0);
      this.game.spawnEnemyBullet(e.x + 16, e.y + 28, 38, spd, e.damage, 'bullet_enemy_orb', 22, 22, 0);
    } else if (e.type === 'heavy_gunship') {
      // 3'lü Yelpaze Mermi Atışı
      const angles = [-0.28, 0, 0.28];
      for (let i = 0; i < angles.length; i++) {
        const a = Math.PI * 0.5 + angles[i];
        this.game.spawnEnemyBullet(
          e.x + angles[i] * 40, e.y + 32,
          Math.cos(a) * spd, Math.sin(a) * spd,
          e.damage, 'bullet_enemy_dart', 22, 36, angles[i]
        );
      }
    } else if (e.type === 'elite_cruiser') {
      // 5'li Radyal Ağır Yaylım + Hedefli Küre
      const angles = [-0.44, -0.22, 0, 0.22, 0.44];
      for (let i = 0; i < angles.length; i++) {
        const a = Math.PI * 0.5 + angles[i];
        this.game.spawnEnemyBullet(
          e.x, e.y + 40,
          Math.cos(a) * spd, Math.sin(a) * spd,
          e.damage, 'bullet_enemy_orb', 24, 24, 0
        );
      }
    }
  }

  // =========================================================================
  // BÖLÜM SONU BOSS SAVAŞI: KABASAKAL DEMİR DRETNOTU (Çok Fazlı)
  // =========================================================================
  spawnBoss() {
    const base = window.GAME_CONFIG.ENEMIES.boss_dreadnought;
    const mult = this.getDifficultyMult();

    const boss = this.game.enemyPool.acquire();
    boss.type = 'boss_dreadnought';
    boss.isBoss = true;
    boss.x = window.GAME_CONFIG.WIDTH * 0.5;
    boss.y = -130;
    boss.w = base.w;
    boss.h = base.h;
    boss.radius = base.radius;
    boss.maxHp = Math.round(base.hp * mult * window.GAME_CONFIG.BOSS_POWER);
    boss.hp = boss.maxHp;
    boss.score = base.score;
    boss.damage = base.damage * window.GAME_CONFIG.BOSS_POWER;
    boss.hitFlash = 0;
    boss.rotation = 0;

    boss.age = 0;
    boss.phase = 1; // Faz 1 (%100-%65), Faz 2 (%65-%30), Faz 3 (<%30)
    boss.attackTimer = 1.8;
    boss.subAttackTimer = 0.9;
    boss.droneTimer = 7.5;
    boss.dying = false;
    boss.deathTimer = 0;

    this.bossActive = boss;
  }

  updateBoss(b, dt) {
    if (b.dying) {
      b.deathTimer -= dt;
      // Zincirleme büyük patlamalar
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

    // Sahneye yukarıdan görkemli giriş
    if (b.y < 155) {
      b.y += 110 * dt;
      return;
    }

    // Can yüzdesine göre Faz Geçişi
    const hpRatio = b.hp / b.maxHp;
    const newPhase = hpRatio > 0.65 ? 1 : (hpRatio > 0.30 ? 2 : 3);
    if (newPhase !== b.phase) {
      b.phase = newPhase;
      this.game.addScreenShake(14, 0.55);
      this.game.spawnExplosion(b.x - 55, b.y + 20, 95);
      this.game.spawnExplosion(b.x + 55, b.y + 20, 95);
      // Faz geçişinde XP kristali düşür
      this.game.spawnPickup(b.x, b.y + 60, 'xp_gem', 45);
    }

    // Faz hızına göre sağ-sol devriye hareketi
    const moveSpeed = b.phase === 1 ? 1.15 : (b.phase === 2 ? 1.65 : 2.25);
    b.x = window.GAME_CONFIG.WIDTH * 0.5 + Math.sin(b.age * moveSpeed) * 135;
    b.y = 155 + Math.cos(b.age * 1.8) * 16;

    // Ana Top Saldırıları (Sol ve Sağ Ateşli Namlular: b.x - 46, b.x + 46, b.y + 78)
    b.attackTimer -= dt;
    if (b.attackTimer <= 0) {
      const leftBarrelX = b.x - 46;
      const rightBarrelX = b.x + 46;
      const barrelY = b.y + 78;

      if (b.phase === 1) {
        b.attackTimer = 1.45;
        // Faz 1: İki namludan 5'li yelpaze yaylım ateşi
        for (let i = -2; i <= 2; i++) {
          const ang = Math.PI * 0.5 + i * 0.19;
          this.game.spawnEnemyBullet(
            leftBarrelX, barrelY,
            Math.cos(ang) * 300, Math.sin(ang) * 300,
            20 * window.GAME_CONFIG.BOSS_POWER, 'bullet_enemy_dart', 22, 38, i * 0.19
          );
          this.game.spawnEnemyBullet(
            rightBarrelX, barrelY,
            Math.cos(ang) * 300, Math.sin(ang) * 300,
            20 * window.GAME_CONFIG.BOSS_POWER, 'bullet_enemy_dart', 22, 38, i * 0.19
          );
        }
      } else if (b.phase === 2) {
        b.attackTimer = 1.15;
        // Faz 2: Çapraz plazma küre perdesi + oyuncuya kilitli mızrak atışı
        for (let i = -3; i <= 3; i++) {
          const ang = Math.PI * 0.5 + i * 0.18 + Math.sin(b.age * 3) * 0.12;
          const bx = (i % 2 === 0) ? leftBarrelX : rightBarrelX;
          this.game.spawnEnemyBullet(
            bx, barrelY,
            Math.cos(ang) * 330, Math.sin(ang) * 330,
            22 * window.GAME_CONFIG.BOSS_POWER, 'bullet_enemy_orb', 26, 26, 0
          );
        }
      } else {
        b.attackTimer = 0.78;
        // Faz 3 (Öfke Fazı): Yoğun döner spiral + hedefli çift lazer yağmuru
        for (let i = -3; i <= 3; i++) {
          const ang = Math.PI * 0.5 + i * 0.21 + Math.cos(b.age * 5) * 0.18;
          this.game.spawnEnemyBullet(
            leftBarrelX, barrelY,
            Math.cos(ang) * 355, Math.sin(ang) * 355,
            24 * window.GAME_CONFIG.BOSS_POWER, 'bullet_enemy_dart', 22, 38, ang - Math.PI * 0.5
          );
          this.game.spawnEnemyBullet(
            rightBarrelX, barrelY,
            Math.cos(ang) * 355, Math.sin(ang) * 355,
            24 * window.GAME_CONFIG.BOSS_POWER, 'bullet_enemy_orb', 24, 24, 0
          );
        }
      }
    }

    // Faz 2 ve Faz 3'te Yardımcı Dron Çağırma
    if (b.phase >= 2) {
      b.droneTimer -= dt;
      if (b.droneTimer <= 0) {
        b.droneTimer = b.phase === 2 ? 6.5 : 4.8;
        this.spawnEnemy('kamikaze_dart', b.x - 105, b.y + 30, {
          pattern: 'kamikaze_dive',
          lockedAngle: Math.PI * 0.5,
          speed: 220
        });
        this.spawnEnemy('kamikaze_dart', b.x + 105, b.y + 30, {
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
    b._active = false;
    this.bossActive = null;

    // Büyük final patlaması ve XP kristali yağmuru (konserve/altın düşmez)
    for (let i = 0; i < 10; i++) {
      const ang = (i / 10) * Math.PI * 2;
      const dist = 35 + (i % 3) * 35;
      this.game.spawnExplosion(bx + Math.cos(ang) * dist, by + Math.sin(ang) * dist, 125);
      this.game.spawnPickup(bx + Math.cos(ang) * dist * 0.8, by + Math.sin(ang) * dist * 0.5, 'xp_gem', 35);
    }

    this.game.addScore(b.score, bx, by);
    this.game.addFloatText(window.I18N.t('STAGE_CLEAR') + ' +10,000', bx, by - 40, '#ffe047', 28);

    // Sonsuz Döngü: Zorluk artarak yeni STAGE başlar
    this.stage++;
    this.stageTime = 0;
    this.bossSpawned = false;
    this.waveTimer = 3.0;
    for (let i = 0; i < this.scheduledCans.length; i++) {
      this.scheduledCans[i].spawned = false;
    }
  }
};
