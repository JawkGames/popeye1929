// Ana Oyun Motoru: Sonsuz Paralaks, Object Pool, XP/Seviye Atlama, 50 Archero Yetenek Fiziği ve Çarpışma Motoru
window.PopeyeShmupGame = class PopeyeShmupGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.W = window.GAME_CONFIG.WIDTH;
    this.H = window.GAME_CONFIG.HEIGHT;

    this.state = 'LOADING'; // LOADING, MENU, PLAYING, LEVELUP, PAUSED, GAMEOVER
    this.score = 0;

    // XP ve Seviye Sistemi (Kombo barı yerine)
    this.level = 1;
    this.xp = 0;
    this.xpToNext = window.GAME_CONFIG.XP.START_NEEDED;
    this.pendingLevelUps = 0;
    this.levelUpChoices = [];

    this.shakeTime = 0;
    this.shakeIntensity = 0;
    this.lastTimestamp = 0;

    this.setupCanvasScaling();
    window.addEventListener('resize', () => this.setupCanvasScaling());

    this.initPools();
    this.initParallaxStars();

    this.player = new window.PlayerController(this);
    this.waveDirector = new window.WaveDirector(this);
    this.ui = new window.UIManager(this);

    window.Atlas.loadAll().then(() => {
      this.state = 'MENU';
      this.resetParallaxWalls();
      requestAnimationFrame((ts) => this.loop(ts));
    });
  }

  setupCanvasScaling() {
    const cfg = window.GAME_CONFIG;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const winW = Math.max(1, window.innerWidth);
    const winH = Math.max(1, window.innerHeight);

    let virtH = Math.round(cfg.WIDTH * winH / winW);
    virtH = Math.max(cfg.MIN_HEIGHT, Math.min(cfg.MAX_HEIGHT, virtH));
    const oldH = this.H || virtH;
    cfg.HEIGHT = virtH;
    this.H = virtH;
    cfg.PLAYER.START_Y = virtH - 145;

    const targetRatio = this.W / this.H;
    const winRatio = winW / winH;
    let cssW, cssH;
    if (winRatio < targetRatio) {
      cssW = winW;
      cssH = Math.round(winW / targetRatio);
    } else {
      cssH = winH;
      cssW = Math.round(winH * targetRatio);
    }

    this.canvas.style.width = `${cssW}px`;
    this.canvas.style.height = `${cssH}px`;
    this.canvas.width = Math.round(this.W * dpr);
    this.canvas.height = Math.round(this.H * dpr);
    this.dpr = dpr;

    if (this.ui && this.ui.layout) this.ui.layout();
    if (this.player && oldH !== virtH) {
      this.player.y = Math.max(110, Math.min(virtH - 55, this.player.y + (virtH - oldH)));
    }
  }

  initPools() {
    // 1) Oyuncu Mermi Havuzu (Delici, Seken, Güdümlü, Bumerang, Şarapnel destekli)
    this.playerBulletPool = new window.ObjectPool(
      () => ({
        x: 0, y: 0, vx: 0, vy: 0, dmg: 10, frame: 'bullet_player', w: 20, h: 42, rot: 0,
        pierce: 0, wallBounces: 0, ricochets: 0, homing: 0, split: false, explosive: false,
        knockback: 0, burn: 0, chill: 0, lightning: 0, boomerang: false, spinSpeed: 0, growRate: 0,
        age: 0, lastHitEnemy: null
      }),
      (b, x, y, vx, vy, dmg, frame, w, h, rot, opts) => {
        b.x = x; b.y = y; b.vx = vx; b.vy = vy;
        b.dmg = dmg; b.frame = frame || 'bullet_player';
        b.w = w || 20; b.h = h || 42; b.rot = rot || 0;
        b.pierce = (opts && opts.pierce) || 0;
        b.wallBounces = (opts && opts.wallBounces) || 0;
        b.ricochets = (opts && opts.ricochets) || 0;
        b.homing = (opts && opts.homing) || 0;
        b.split = Boolean(opts && opts.split);
        b.explosive = Boolean(opts && opts.explosive);
        b.knockback = (opts && opts.knockback) || 0;
        b.burn = (opts && opts.burn) || 0;
        b.chill = (opts && opts.chill) || 0;
        b.lightning = (opts && opts.lightning) || 0;
        b.boomerang = Boolean(opts && opts.boomerang);
        b.spinSpeed = (opts && opts.spinSpeed) || 0;
        b.growRate = (opts && opts.growRate) || 0;
        b.age = 0;
        b.lastHitEnemy = null;
      },
      120
    );

    this.enemyBulletPool = new window.ObjectPool(
      () => ({ x: 0, y: 0, vx: 0, vy: 0, dmg: 12, frame: 'bullet_enemy_dart', w: 20, h: 32, rot: 0 }),
      (b, x, y, vx, vy, dmg, frame, w, h, rot) => {
        b.x = x; b.y = y; b.vx = vx; b.vy = vy;
        b.dmg = dmg; b.frame = frame || 'bullet_enemy_dart';
        b.w = w || 20; b.h = h || 32; b.rot = rot || 0;
      },
      120
    );

    this.enemyPool = new window.ObjectPool(
      () => ({
        type: 'scout_pod', x: 0, y: 0, w: 64, h: 64, radius: 26,
        hp: 30, maxHp: 30, score: 100, damage: 15,
        fireRate: 2.0, fireTimer: 1.0, bulletSpeed: 300,
        hitFlash: 0, rotation: 0, isBoss: false,
        burnTimer: 0, burnDps: 0, chillTimer: 0
      }),
      null,
      36
    );

    this.pickupPool = new window.ObjectPool(
      () => ({ x: 0, y: 0, vy: 130, type: 'can_hp', age: 0 }),
      (p, x, y, type) => {
        p.x = Math.max(46, Math.min(this.W - 46, x));
        p.y = y;
        p.vy = window.GAME_CONFIG.PICKUPS.FALL_SPEED;
        p.type = type || 'can_hp';
        p.age = 0;
      },
      32
    );

    this.vfxPool = new window.ObjectPool(
      () => ({ x: 0, y: 0, type: 'spark', frame: 'spark_small', size: 48, age: 0, duration: 0.25, rot: 0 }),
      (v, x, y, type, frame, size, duration) => {
        v.x = x; v.y = y; v.type = type; v.frame = frame;
        v.size = size || 48; v.age = 0; v.duration = duration || 0.25;
        v.rot = Math.random() * Math.PI * 2;
      },
      64
    );

    this.floatTextPool = new window.ObjectPool(
      () => ({ text: '', x: 0, y: 0, color: '#fff', size: 18, age: 0, duration: 0.85 }),
      (ft, text, x, y, color, size) => {
        ft.text = text; ft.x = x; ft.y = y;
        ft.color = color || '#ffe047'; ft.size = size || 18;
        ft.age = 0; ft.duration = 0.85;
      },
      24
    );

    this.wallPool = new window.ObjectPool(
      () => ({ side: 'left', frame: 'wall_left_radar', x: 0, y: 0, w: 180, h: 200, speed: 95 }),
      (w, side, frame, x, y, width, height, speed) => {
        w.side = side; w.frame = frame;
        w.x = x; w.y = y; w.w = width; w.h = height; w.speed = speed;
      },
      14
    );
  }

  initParallaxStars() {
    this.stars = [];
    for (let i = 0; i < 85; i++) {
      const layer = (i % 3) + 1;
      this.stars.push({
        x: Math.random() * this.W,
        y: Math.random() * this.H,
        r: layer === 1 ? 1.1 : (layer === 2 ? 1.7 : 2.3),
        speed: layer * 38,
        alpha: 0.35 + layer * 0.2,
        color: layer === 3 ? '#bfe3ff' : '#ffffff'
      });
    }
  }

  resetParallaxWalls() {
    this.wallPool.clear();
    const leftFrames = ['wall_left_radar', 'wall_left_reactor'];
    const rightFrames = ['wall_right_tower', 'wall_right_coil'];

    for (let i = 0; i < 4; i++) {
      const yPos = this.H - i * 290;
      this.wallPool.acquire('left', leftFrames[i % 2], 78, yPos, 175, 220, 92);
      this.wallPool.acquire('right', rightFrames[i % 2], this.W - 78, yPos - 135, 175, 220, 92);
    }
    this.wallStep = 0;
  }

  startGame() {
    this.score = 0;
    this.level = 1;
    this.xp = 0;
    this.xpToNext = window.GAME_CONFIG.XP.START_NEEDED;
    this.pendingLevelUps = 0;
    this.levelUpChoices = [];

    this.playerBulletPool.clear();
    this.enemyBulletPool.clear();
    this.enemyPool.clear();
    this.pickupPool.clear();
    this.vfxPool.clear();
    this.floatTextPool.clear();
    this.resetParallaxWalls();

    this.player.reset();
    this.waveDirector.reset();
    this.state = 'PLAYING';
  }

  togglePause() {
    if (this.state === 'PLAYING') this.state = 'PAUSED';
    else if (this.state === 'PAUSED') this.state = 'PLAYING';
  }

  onPlayerDeath() {
    this.spawnExplosion(this.player.x, this.player.y, 130);
    this.addScreenShake(16, 0.7);
    this.state = 'GAMEOVER';
  }

  reviveWithAd() {
    this.enemyBulletPool.clear();
    this.player.reviveFull();
    this.triggerSuperSpinachBomb(false);
    this.state = 'PLAYING';
  }

  addScreenShake(intensity, duration) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
    this.shakeTime = Math.max(this.shakeTime, duration);
  }

  addScore(basePoints, x, y) {
    const total = Math.round(basePoints);
    this.score += total;
    if (x !== undefined && y !== undefined) {
      this.addFloatText(`+${total}`, x, y, '#ffffff', 15);
    }
  }

  resetCombo() {
    // Kombo kaldırıldı, yerine XP ve Seviye Atlama sistemi eklendi
  }

  // =========================================================================
  // XP KAZANMA VE 3'LÜ ISPANAK KUTUSU SEVİYE ATLAMA SİSTEMİ
  // =========================================================================
  addXp(amount) {
    if (this.player.dead) return;
    const xpMult = 1 + this.player.hasSkill('xp_overdrive') * 0.35;
    this.xp += amount * xpMult;

    while (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.level++;
      this.xpToNext = Math.round(
        window.GAME_CONFIG.XP.START_NEEDED + (this.level - 1) * window.GAME_CONFIG.XP.STEP_INC
      );
      this.pendingLevelUps++;
    }

    if (this.pendingLevelUps > 0 && this.state === 'PLAYING') {
      this.openLevelUpModal();
    }
  }

  openLevelUpModal() {
    if (this.pendingLevelUps <= 0) return;
    this.pendingLevelUps--;
    this.player.dragging = false;
    this.levelUpChoices = window.SkillSystem.rollThreeChoices(this.player);
    this.state = 'LEVELUP';
  }

  selectLevelUpSkill(index) {
    if (this.state !== 'LEVELUP') return;
    const chosen = this.levelUpChoices[index];
    if (!chosen) return;

    window.SkillSystem.applySkill(this.player, chosen.id);
    const isTr = window.I18N.lang === 'TR';
    const info = isTr ? chosen.tr : chosen.en;
    this.addFloatText(info.name + '!', this.player.x, this.player.y - 50, chosen.color || '#ffe047', 20);
    this.player.invulnTimer = Math.max(this.player.invulnTimer, 0.85);

    if (this.pendingLevelUps > 0) {
      this.openLevelUpModal();
    } else {
      this.state = 'PLAYING';
    }
  }

  addFloatText(text, x, y, color = '#ffe047', size = 18) {
    this.floatTextPool.acquire(text, x, y, color, size);
  }

  spawnPlayerBullet(x, y, vx, vy, dmg, frame, w, h, rot = 0, opts = null) {
    this.playerBulletPool.acquire(x, y, vx, vy, dmg, frame, w, h, rot, opts);
  }

  spawnEnemyBullet(x, y, vx, vy, dmg, frame, w, h, rot = 0) {
    this.enemyBulletPool.acquire(x, y, vx, vy, dmg, frame, w, h, rot);
  }

  spawnPickup(x, y, type) {
    this.pickupPool.acquire(x, y, type);
  }

  spawnVfx(x, y, frame, size = 48, duration = 0.18) {
    this.vfxPool.acquire(x, y, 'spark', frame, size, duration);
  }

  spawnExplosion(x, y, size = 84) {
    this.vfxPool.acquire(x, y, 'explosion', 'exp_1', size, 0.42);
  }

  findNearestEnemy(x, y, excludeEnemy = null, maxDist = 9999) {
    const enemies = this.enemyPool.activeList;
    let best = null;
    let bestDistSq = maxDist * maxDist;
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (!e._active || e === excludeEnemy || e.y < 0) continue;
      const dx = e.x - x;
      const dy = e.y - y;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestDistSq) {
        bestDistSq = d2;
        best = e;
      }
    }
    return best;
  }

  triggerSuperSpinachBomb(showLabel = true) {
    this.addScreenShake(18, 0.75);
    this.enemyBulletPool.clear();

    if (showLabel) {
      this.addFloatText(window.I18N.t('PICKUP_BOMB'), this.player.x, this.player.y - 55, '#ffe047', 22);
    }

    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      this.spawnExplosion(
        this.W * 0.5 + Math.cos(ang) * 140,
        this.H * 0.45 + Math.sin(ang) * 180,
        115
      );
    }

    const bombDmg = window.GAME_CONFIG.PICKUPS.BOMB_DAMAGE;
    const list = this.enemyPool.activeList;
    for (let i = list.length - 1; i >= 0; i--) {
      const e = list[i];
      if (!e._active) continue;
      this.damageEnemy(e, bombDmg);
    }
  }

  damageEnemy(e, dmg, isDot = false) {
    if (!e._active || (e.isBoss && e.dying)) return;

    let finalDmg = dmg;

    // Boss & Elit Kruvazör Avcısı (boss_hunter)
    if ((e.isBoss || e.type === 'elite_cruiser') && this.player.hasSkill('boss_hunter') > 0) {
      finalDmg *= (1 + this.player.hasSkill('boss_hunter') * 0.35);
    }

    // Kritik Vuruş Hesabı
    if (!isDot && Math.random() < this.player.critChance) {
      finalDmg *= this.player.critMult;
      this.spawnVfx(e.x, e.y, 'spark_crit', 52, 0.16);
    }

    e.hp -= finalDmg;
    e.hitFlash = 1.0;

    // İnfazcı / Headshot (headshot_kill): Canı %20 altına inen normal düşmanı anında yok eder
    const hsLvl = this.player.hasSkill('headshot_kill');
    if (hsLvl > 0 && !e.isBoss && e.type !== 'elite_cruiser' && e.hp > 0) {
      if (e.hp / e.maxHp <= 0.14 + hsLvl * 0.04) {
        e.hp = 0;
        this.addFloatText(window.I18N.t('HEADSHOT_TXT'), e.x, e.y - 20, '#ff4d6d', 16);
      }
    }

    if (e.hp <= 0) {
      if (e.isBoss) {
        this.waveDirector.onBossKilled(e);
        this.addXp(window.GAME_CONFIG.ENEMIES.boss_dreadnought.xp || 350);
        return;
      }

      e._active = false;
      this.spawnExplosion(e.x, e.y, Math.max(72, e.w * 1.1));
      this.addScreenShake(5, 0.14);
      this.addScore(e.score, e.x, e.y);

      // Vampirik Can Çalma (vampiric_leech)
      const vampLvl = this.player.hasSkill('vampiric_leech');
      if (vampLvl > 0 && !this.player.dead) {
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + vampLvl * 1.8);
      }

      // Doğrudan XP + Konserve/Altın/XP Kristali Düşüşü
      const eCfg = window.GAME_CONFIG.ENEMIES[e.type];
      this.addXp((eCfg && eCfg.xp) || 22);

      const drop = this.waveDirector.rollDrop();
      if (drop) {
        this.spawnPickup(e.x, e.y, drop);
      } else if (Math.random() < 0.38) {
        this.spawnPickup(e.x, e.y, 'xp_gem');
      }
    }
  }

  onBulletHitEnemy(b, e) {
    // 1) Geri İtme (knockback_impact)
    if (b.knockback > 0 && !e.isBoss) {
      e.y = Math.max(-40, e.y - b.knockback * 11);
    }

    // 2) Yakıcı Napalm (fire_rounds)
    if (b.burn > 0) {
      e.burnTimer = 3.0;
      e.burnDps = b.dmg * 0.35 * b.burn;
    }

    // 3) Buzul Dondurma (ice_rounds)
    if (b.chill > 0) {
      e.chillTimer = 2.8 + b.chill * 0.5;
    }

    // 4) Patlayıcı Çekirdek (explosive_shots veya füze)
    if (b.explosive) {
      this.spawnExplosion(e.x, e.y, 76);
      const enemies = this.enemyPool.activeList;
      for (let i = enemies.length - 1; i >= 0; i--) {
        const other = enemies[i];
        if (!other._active || other === e) continue;
        const dx = other.x - e.x;
        const dy = other.y - e.y;
        if (dx * dx + dy * dy <= 95 * 95) {
          this.damageEnemy(other, b.dmg * 0.55, true);
        }
      }
    }

    // 5) Zincirleme Yıldırım (chain_lightning)
    if (b.lightning > 0) {
      const nextTarget = this.findNearestEnemy(e.x, e.y, e, 220);
      if (nextTarget) {
        this.spawnVfx((e.x + nextTarget.x) * 0.5, (e.y + nextTarget.y) * 0.5, 'proj_lightning', 72, 0.18);
        this.damageEnemy(nextTarget, b.dmg * (0.45 + b.lightning * 0.15), true);
      }
    }

    // 6) Şarapnel Bölünmesi (split_shrapnel)
    if (b.split) {
      b.split = false;
      const angles = [-0.55, 0, 0.55];
      for (let i = 0; i < angles.length; i++) {
        const ang = -Math.PI * 0.5 + angles[i];
        this.spawnPlayerBullet(
          e.x, e.y,
          Math.cos(ang) * 720, Math.sin(ang) * 720,
          b.dmg * 0.38, 'bullet_player', 14, 28, angles[i],
          { pierce: 0 }
        );
      }
    }
  }

  applyWeaponCan(kind, color) {
    const player = this.player;
    const tr = window.I18N.lang === 'TR';
    const res = player.applyWeaponCan(kind);
    let label;
    if (res === 'wing') label = tr ? 'UÇAKLAR GÜÇLENDİ!' : 'WINGMEN POWER UP!';
    else if (res === 'score') label = tr ? 'MAX GÜÇ!' : 'MAX POWER!';
    else if (kind === '3x') label = tr ? 'KALIN MERMİ!' : 'HEAVY SHOT!';
    else if (kind === '4x') label = tr ? 'ATIŞ HIZI!' : 'FIRE RATE!';
    else if (kind === '6x') label = tr ? 'SÜPER GÜÇ!' : 'SUPER POWER!';
    else label = `${player.weaponLevel}X ${tr ? 'ATIŞ!' : 'SHOT!'}`;
    this.addFloatText(label, player.x, player.y - 45, res === 'score' ? '#ffe047' : color, 20);
    this.addScore(res === 'score' ? 600 : 300);
    this.addXp(window.GAME_CONFIG.XP.CAN_XP);
  }

  applyPickup(p) {
    const player = this.player;
    const cfg = window.GAME_CONFIG.PICKUPS;
    const xpCfg = window.GAME_CONFIG.XP;

    switch (p.type) {
      case 'xp_gem':
        this.addXp(xpCfg.GEM_VALUE);
        this.addScore(40);
        break;

      case 'coin_gold':
        this.addScore(cfg.COIN_SCORE, p.x, p.y);
        this.addXp(xpCfg.COIN_XP);
        break;

      case 'can_hp':
        player.hp = Math.min(player.maxHp, player.hp + cfg.SPINACH_HEAL);
        this.addScore(cfg.SCORE_BONUS);
        this.addXp(xpCfg.CAN_XP);
        this.addFloatText(window.I18N.t('PICKUP_HP'), player.x, player.y - 45, '#6dff5c', 20);
        break;

      case 'can_2x':
        this.applyWeaponCan('2x', '#57e2ff');
        break;

      case 'can_3x':
        this.applyWeaponCan('3x', '#57e2ff');
        break;

      case 'can_4x':
        this.applyWeaponCan('4x', '#ffa834');
        break;

      case 'can_6x':
        this.applyWeaponCan('6x', '#ff4d6d');
        break;

      case 'can_wingman':
        this.addXp(xpCfg.CAN_XP);
        if (player.addWingmen()) {
          this.addFloatText(window.I18N.t('PICKUP_WINGMAN'), player.x, player.y - 45, '#70f0ff', 20);
        } else {
          this.addScore(600);
          this.addFloatText(window.I18N.t('MAX_POWER'), player.x, player.y - 45, '#ffe047', 18);
        }
        break;

      case 'can_shield':
        player.shieldTimer = window.GAME_CONFIG.PLAYER.SHIELD_DURATION;
        this.addXp(xpCfg.CAN_XP);
        this.addFloatText(window.I18N.t('PICKUP_SHIELD'), player.x, player.y - 45, '#57ffda', 20);
        break;

      case 'can_bomb':
        this.addXp(xpCfg.CAN_XP);
        this.triggerSuperSpinachBomb(true);
        break;
    }
  }

  update(dt) {
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      s.y += s.speed * dt;
      if (s.y > this.H + 5) {
        s.y = -5;
        s.x = Math.random() * this.W;
      }
    }

    const leftFrames = ['wall_left_radar', 'wall_left_reactor'];
    const rightFrames = ['wall_right_tower', 'wall_right_coil'];
    this.wallPool.updateAll(dt, (w) => {
      w.y += w.speed * dt;
      if (w.y > this.H + 160) {
        this.wallStep++;
        w.y = -150;
        if (w.side === 'left') {
          w.frame = leftFrames[this.wallStep % leftFrames.length];
        } else {
          w.frame = rightFrames[this.wallStep % rightFrames.length];
        }
      }
      return true;
    });

    if (this.state !== 'PLAYING') return;

    if (this.shakeTime > 0) {
      this.shakeTime = Math.max(0, this.shakeTime - dt);
      if (this.shakeTime === 0) this.shakeIntensity = 0;
    }

    this.player.update(dt);
    this.waveDirector.update(dt);

    const enemies = this.enemyPool.activeList;

    // Oyuncu Mermileri: Güdümlü, Bumerang, Duvar Sekmesi, Delici ve Ricochet Fiziği
    this.playerBulletPool.updateAll(dt, (b) => {
      b.age += dt;
      if (b.spinSpeed !== 0) b.rot += b.spinSpeed * dt;
      if (b.growRate > 0) b.w += b.growRate * dt;

      // Bumerang Çapa Geri Dönüş Fiziği
      if (b.boomerang) {
        b.vy += 980 * dt;
        const dx = this.player.x - b.x;
        b.vx += dx * 3.5 * dt;
        if (b.age > 0.6 && Math.hypot(this.player.x - b.x, this.player.y - b.y) < 38) {
          return false;
        }
      }

      // Güdümlü Mermi / Füze Kavis Fiziği
      if (b.homing > 0) {
        const target = this.findNearestEnemy(b.x, b.y, b.lastHitEnemy, 420);
        if (target) {
          const spd = Math.hypot(b.vx, b.vy) || 700;
          const desiredAng = Math.atan2(target.y - b.y, target.x - b.x);
          const curAng = Math.atan2(b.vy, b.vx);
          let diff = desiredAng - curAng;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          const newAng = curAng + Math.max(-b.homing * dt, Math.min(b.homing * dt, diff));
          b.vx = Math.cos(newAng) * spd;
          b.vy = Math.sin(newAng) * spd;
          if (b.spinSpeed === 0) b.rot = newAng + Math.PI * 0.5;
        }
      }

      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // Duvardan Seken Mermi (bouncy_walls)
      if (b.wallBounces > 0) {
        if (b.x < 18 && b.vx < 0) {
          b.x = 18;
          b.vx = -b.vx;
          b.rot = -b.rot;
          b.wallBounces--;
        } else if (b.x > this.W - 18 && b.vx > 0) {
          b.x = this.W - 18;
          b.vx = -b.vx;
          b.rot = -b.rot;
          b.wallBounces--;
        }
      }

      if (b.y < -60 || b.y > this.H + 80 || b.x < -60 || b.x > this.W + 60) return false;

      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        if (!e._active || e === b.lastHitEnemy) continue;
        const dx = b.x - e.x;
        const dy = b.y - e.y;
        const hitR = e.radius + Math.max(12, b.w * 0.35);
        if (dx * dx + dy * dy <= hitR * hitR) {
          this.spawnVfx(b.x, b.y, 'spark_small', 40, 0.14);
          this.onBulletHitEnemy(b, e);
          this.damageEnemy(e, b.dmg);

          // Zincirleme Sekme (ricochet_shot)
          if (b.ricochets > 0) {
            const nextE = this.findNearestEnemy(e.x, e.y, e, 260);
            if (nextE) {
              b.ricochets--;
              b.lastHitEnemy = e;
              const spd = Math.hypot(b.vx, b.vy) || 820;
              const ang = Math.atan2(nextE.y - b.y, nextE.x - b.x);
              b.vx = Math.cos(ang) * spd;
              b.vy = Math.sin(ang) * spd;
              if (b.spinSpeed === 0) b.rot = ang + Math.PI * 0.5;
              return true;
            }
          }

          // İçinden Geçen Delici Atış (piercing_shot)
          if (b.pierce > 0) {
            b.pierce--;
            b.lastHitEnemy = e;
            return true;
          }

          return false;
        }
      }
      return true;
    });

    // Yörünge Küreleri ve Döner Çapalar Çarpışma Kontrolü
    const orbitals = this.player.getOrbitalPositions();

    this.enemyPool.updateAll(dt, (e) => {
      if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt * 6.5);

      // Yanma (Napalm DoT)
      if (e.burnTimer > 0) {
        e.burnTimer -= dt;
        this.damageEnemy(e, e.burnDps * dt, true);
        if (!e._active) return false;
      }

      // Buzul Yavaşlatma (chillTimer)
      const moveDt = e.chillTimer > 0 ? dt * 0.58 : dt;
      if (e.chillTimer > 0) e.chillTimer -= dt;

      if (!e.isBoss) {
        window.Formations.updateEnemyPath(e, moveDt, this.player);
        e.fireTimer -= moveDt;
        if (e.fireTimer <= 0) {
          e.fireTimer = e.fireRate;
          this.waveDirector.fireEnemyWeapon(e);
        }
      }

      // Yörünge birimlerinin düşmanlara teması
      for (let o = 0; o < orbitals.length; o++) {
        const ob = orbitals[o];
        const odx = e.x - ob.x;
        const ody = e.y - ob.y;
        const orSum = e.radius + ob.r;
        if (odx * odx + ody * ody <= orSum * orSum) {
          this.damageEnemy(e, ob.dmg * dt * 8, true);
          if (!e._active) return false;
        }
      }

      if (!this.player.dead) {
        const dx = e.x - this.player.x;
        const dy = e.y - this.player.y;
        const sumR = e.radius + this.player.cfg.HITBOX_RADIUS;
        if (dx * dx + dy * dy <= sumR * sumR) {
          this.player.takeDamage(e.damage);
          if (!e.isBoss) {
            this.damageEnemy(e, 999);
            return false;
          }
        }
      }

      return e.y < this.H + 120;
    });

    this.enemyBulletPool.updateAll(dt, (b) => {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.y > this.H + 40 || b.y < -40 || b.x < -40 || b.x > this.W + 40) return false;

      // Yörünge Kalkan Küreleri düşman mermilerini yok eder
      for (let o = 0; o < orbitals.length; o++) {
        const ob = orbitals[o];
        if (!ob.blocksBullets) continue;
        const odx = b.x - ob.x;
        const ody = b.y - ob.y;
        if (odx * odx + ody * ody <= (ob.r + 10) * (ob.r + 10)) {
          this.spawnVfx(b.x, b.y, 'spark_small', 28, 0.12);
          return false;
        }
      }

      if (!this.player.dead) {
        const dx = b.x - this.player.x;
        const dy = b.y - this.player.y;
        const r = this.player.shieldTimer > 0 ? 48 : (this.player.cfg.HITBOX_RADIUS + 8);
        if (dx * dx + dy * dy <= r * r) {
          this.player.takeDamage(b.dmg);
          return false;
        }
      }
      return true;
    });

    // Konserve, Altın ve XP Kristalleri (Sabit dikey hattında iner, değince alınır)
    const touchR = window.GAME_CONFIG.PICKUPS.TOUCH_RADIUS || 54;
    this.pickupPool.updateAll(dt, (p) => {
      p.age += dt;
      p.y += p.vy * dt;

      if (!this.player.dead) {
        const dx = this.player.x - p.x;
        const dy = this.player.y - p.y;
        if (dx * dx + dy * dy <= touchR * touchR) {
          this.applyPickup(p);
          return false;
        }
      }
      return p.y < this.H + 60;
    });

    this.vfxPool.updateAll(dt, (v) => {
      v.age += dt;
      if (v.age >= v.duration) return false;
      if (v.type === 'explosion') {
        const prog = v.age / v.duration;
        if (prog < 0.22) v.frame = 'exp_1';
        else if (prog < 0.50) v.frame = 'exp_2';
        else if (prog < 0.78) v.frame = 'exp_3';
        else v.frame = 'exp_4';
      }
      return true;
    });

    this.floatTextPool.updateAll(dt, (ft) => {
      ft.age += dt;
      ft.y -= 48 * dt;
      return ft.age < ft.duration;
    });
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    const grad = ctx.createLinearGradient(0, 0, 0, this.H);
    grad.addColorStop(0, '#071426');
    grad.addColorStop(0.5, '#0b1e36');
    grad.addColorStop(1, '#061120');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.W, this.H);

    if (this.shakeTime > 0 && this.shakeIntensity > 0) {
      const sx = (Math.random() - 0.5) * this.shakeIntensity * 2;
      const sy = (Math.random() - 0.5) * this.shakeIntensity * 2;
      ctx.translate(sx, sy);
    }

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const walls = this.wallPool.activeList;
    for (let i = 0; i < walls.length; i++) {
      const w = walls[i];
      window.Atlas.draw(ctx, w.frame, w.x, w.y, w.w, w.h);
    }

    const pickups = this.pickupPool.activeList;
    for (let i = 0; i < pickups.length; i++) {
      const p = pickups[i];
      const isSmall = (p.type === 'coin_gold' || p.type === 'xp_gem');
      const sz = isSmall ? 34 : 52;
      window.Atlas.draw(ctx, p.type, p.x, p.y, sz, sz);
    }

    const pBullets = this.playerBulletPool.activeList;
    for (let i = 0; i < pBullets.length; i++) {
      const b = pBullets[i];
      window.Atlas.draw(ctx, b.frame, b.x, b.y, b.w, b.h, { rotation: b.rot });
    }

    const enemies = this.enemyPool.activeList;
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      window.Atlas.draw(ctx, e.type, e.x, e.y, e.w, e.h, {
        rotation: e.rotation,
        hitFlash: e.hitFlash
      });
    }

    this.player.draw(ctx);

    const eBullets = this.enemyBulletPool.activeList;
    for (let i = 0; i < eBullets.length; i++) {
      const b = eBullets[i];
      window.Atlas.draw(ctx, b.frame, b.x, b.y, b.w, b.h, { rotation: b.rot });
    }

    const vfxs = this.vfxPool.activeList;
    for (let i = 0; i < vfxs.length; i++) {
      const v = vfxs[i];
      const prog = v.age / v.duration;
      const scale = v.type === 'explosion' ? (0.75 + prog * 0.55) : (1.1 - prog * 0.4);
      const alpha = prog > 0.7 ? (1 - (prog - 0.7) / 0.3) : 1;
      window.Atlas.draw(ctx, v.frame, v.x, v.y, v.size * scale, v.size * scale, {
        rotation: v.rot,
        alpha
      });
    }

    const fTexts = this.floatTextPool.activeList;
    for (let i = 0; i < fTexts.length; i++) {
      const ft = fTexts[i];
      const alpha = Math.max(0, 1 - ft.age / ft.duration);
      ctx.save();
      ctx.globalAlpha = alpha;
      this.ui.drawTextOutlined(ctx, ft.text, ft.x, ft.y, ft.size, ft.color, 'center', 4);
      ctx.restore();
    }

    this.ui.draw(ctx);

    ctx.restore();
  }

  loop(timestamp) {
    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    const dt = Math.min(0.05, Math.max(0.001, (timestamp - this.lastTimestamp) / 1000));
    this.lastTimestamp = timestamp;

    this.update(dt);
    this.draw();

    requestAnimationFrame((ts) => this.loop(ts));
  }
};

window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new window.PopeyeShmupGame();
});
