// Ana Oyun Motoru: Değişen Gezegenli Uzay Arka Planı, Alt Mıknatıslı XP Kristalleri, 50 Yetenek ve Çarpışma Motoru
window.PopeyeShmupGame = class PopeyeShmupGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.W = window.GAME_CONFIG.WIDTH;
    this.H = window.GAME_CONFIG.HEIGHT;

    this.state = 'MENU'; // LOADING, MENU, PLAYING, LEVELUP, PAUSED, GAMEOVER
    this.loadProgress = 0;
    this.score = 0;

    // XP ve Seviye Sistemi
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

    // Uygulama arka plana atıldığında oyunu ve sesi otomatik duraklat
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state === 'PLAYING') {
        this.state = 'PAUSED';
        this.shakeTime = 0;
        this.shakeIntensity = 0;
      }
    });

    this.initPools();
    this.initCosmicBackground();

    this.player = new window.PlayerController(this);
    this.waveDirector = new window.WaveDirector(this);
    this.ui = new window.UIManager(this);

    this.resetParallaxWalls();
    requestAnimationFrame((ts) => this.loop(ts));

    this.atlasDone = false;
    window.Atlas.loadAll((prog) => {
      this.loadProgress = prog;
    }).then(() => {
      this.loadProgress = 1;
      this.atlasDone = true;
    });

    this.initLoadingScreen();
  }

  // 9:16 Açılış Görseli: Başta siyah-beyaz, yükleme doldukça soldan sağa renklenir (--p: -6% -> 106%)
  initLoadingScreen() {
    const el = document.getElementById('acilis');
    const cub = document.getElementById('ac_gri');
    if (!el || !cub) return;

    const t0 = performance.now();
    const minDur = 1900; // Soldan sağa renklenme geçişinin net görünmesi için minimum süre (ms)

    const tickLoad = () => {
      const elapsed = performance.now() - t0;
      const timeProg = Math.min(1, elapsed / minDur);
      const assetProg = this.atlasDone ? 1 : Math.max(0.15, this.loadProgress || 0);
      const p = Math.min(timeProg, assetProg);

      cub.style.setProperty('--p', (p * 112 - 6).toFixed(1) + '%');

      if (p < 1 || (!this.atlasDone && elapsed < 12000)) {
        setTimeout(tickLoad, 40);
        return;
      }

      cub.style.setProperty('--p', '106%');
      setTimeout(() => {
        el.classList.add('bit');
        setTimeout(() => {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 500);
      }, 280);
    };

    tickLoad();
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

    const acilisEl = document.getElementById('acilis');
    if (acilisEl) {
      acilisEl.style.width = `${cssW}px`;
      acilisEl.style.height = `${cssH}px`;
    }

    if (this.ui && this.ui.layout) this.ui.layout();
    if (this.player && oldH !== virtH) {
      this.player.y = Math.max(110, Math.min(virtH - 55, this.player.y + (virtH - oldH)));
    }
  }

  initPools() {
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
      140
    );

    this.enemyPool = new window.ObjectPool(
      () => ({
        type: 'scout_pod', x: 0, y: 0, w: 64, h: 64, radius: 26,
        hp: 30, maxHp: 30, score: 100, damage: 15,
        fireRate: 2.0, fireTimer: 1.0, bulletSpeed: 300,
        bulletFrame: 'bullet_enemy_dart', attackStyle: 'single',
        hitFlash: 0, rotation: 0, isBoss: false,
        burnTimer: 0, burnDps: 0, chillTimer: 0
      }),
      null,
      36
    );

    // XP Kristalleri Havuzu (En alta gelince yok olmaz; mıknatısla oyuncuya çekilir ve yapışır)
    this.pickupPool = new window.ObjectPool(
      () => ({ x: 0, y: 0, vy: 140, type: 'xp_gem', xpVal: 22, age: 0, magnetized: false }),
      (p, x, y, type, xpVal) => {
        p.x = Math.max(46, Math.min(this.W - 46, x));
        p.y = y;
        p.vy = window.GAME_CONFIG.PICKUPS.FALL_SPEED;
        p.type = 'xp_gem';
        p.xpVal = xpVal || window.GAME_CONFIG.XP.GEM_VALUE;
        p.age = 0;
        p.magnetized = false;
      },
      36
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
      () => ({ side: 'left', frame: 'wall_left_radar', x: 0, y: 0, w: 180, h: 200, speed: 95, flipX: false }),
      (w, side, frame, x, y, width, height, speed, flipX) => {
        w.side = side; w.frame = frame;
        w.x = x; w.y = y; w.w = width; w.h = height; w.speed = speed;
        w.flipX = Boolean(flipX);
      },
      14
    );
  }

  // =========================================================================
  // 15 BÖLÜMLÜ ZEMİNLİ VE ZEMİNSİZ ÇEVRE, ATMOSFER VE NESNE MOTORU
  // =========================================================================
  initCosmicBackground() {
    this.groundScrollY = 0;

    // Çok renkli paralaks yıldızlar / kar / kıvılcım / spor parçacıkları
    this.stars = [];
    for (let i = 0; i < 95; i++) {
      const layer = (i % 3) + 1;
      this.stars.push({
        x: Math.random() * this.W,
        y: Math.random() * this.H,
        r: layer === 1 ? 1.3 : (layer === 2 ? 2.0 : 2.8),
        speed: layer * 42,
        alpha: 0.38 + layer * 0.2,
        colorIdx: i % 3,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }

    this.nebulae = [
      { x: 140, y: 240, r: 190, speed: 18 },
      { x: 400, y: 650, r: 220, speed: 22 }
    ];
  }

  // Bölüm değiştiğinde o bölümün özel kenar nesnelerini (buzul, vinç, neon bina, kristal, lav, obelisk vb.) diz
  applyStageEnvironment(stageNum) {
    this.resetParallaxWalls(stageNum);
  }

  resetParallaxWalls(stageNum) {
    this.wallPool.clear();
    const stNum = stageNum || (this.waveDirector ? this.waveDirector.stage : 1);
    const st = window.StageThemes ? window.StageThemes.getStage(stNum) : null;
    const leftFrames = (st && st.leftProps) || ['wall_left_radar', 'wall_left_reactor'];
    const rightFrames = (st && st.rightProps) || ['wall_right_tower', 'wall_right_coil'];

    for (let i = 0; i < 4; i++) {
      const yPos = this.H - i * 290;
      const lf = leftFrames[i % leftFrames.length];
      const rf = rightFrames[i % rightFrames.length];
      // Sağ kenardaki yeni çevre nesnelerini (stageEnv) yatay aynalayarak koy ki merkeze doğru uyumlu baksın
      const flipRight = rf.indexOf('env2_') === 0;
      this.wallPool.acquire('left', lf, 66, yPos, 155, 200, 92, false);
      this.wallPool.acquire('right', rf, this.W - 66, yPos - 135, 155, 200, 92, flipRight);
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
    this.themeIdx = 0;
    this.targetThemeIdx = 0;
    this.themeBlend = 1;

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
    this.shakeTime = 0;
    this.shakeIntensity = 0;
    if (this.state === 'PLAYING') this.state = 'PAUSED';
    else if (this.state === 'PAUSED') this.state = 'PLAYING';
  }

  // Sol Alt (◀) ve Sağ Alt (▶) Ok Butonlarıyla 15 Bölüm ve Boss Arasında İleri/Geri Geçiş
  stepBossStage(dir) {
    const cur = (this.waveDirector && this.waveDirector.stage) || 1;
    let nextStage = cur + dir;
    if (nextStage < 1) nextStage = 15;
    if (nextStage > 15) nextStage = 1;
    this.warpToBoss(nextStage);
  }

  // Doğrudan İlgili Bölümün (1..15) Çevresine ve Boss Savaşına Işınlanma
  warpToBoss(stageNum) {
    const st = ((Math.max(1, Math.floor(stageNum)) - 1) % 15) + 1;
    this.shakeTime = 0;
    this.shakeIntensity = 0;
    this.pendingLevelUps = 0;

    this.enemyPool.clear();
    this.enemyBulletPool.clear();
    this.pickupPool.clear();

    if (this.player.dead || this.state === 'MENU' || this.state === 'GAMEOVER') {
      this.player.reset();
    } else {
      this.player.hp = this.player.maxHp;
      this.player.invulnTimer = 1.5;
    }

    // İlgili bölümün Boss'unu ve özel çevre nesnelerini sahneye yükle
    this.waveDirector.stage = st;
    this.waveDirector.stageTime = window.GAME_CONFIG.TIMELINE.PHASE_3_END;
    this.waveDirector.bossSpawned = true;
    this.waveDirector.bossWarningTimer = 0;
    this.waveDirector.bossActive = null;
    this.resetParallaxWalls(st);
    this.waveDirector.spawnBoss();
    if (this.waveDirector.bossActive) {
      this.waveDirector.bossActive.y = 125;
    }

    this.state = 'PLAYING';
    const stInfo = window.StageThemes ? window.StageThemes.getStage(st) : null;
    const isTr = window.I18N.lang === 'TR';
    const stTitle = stInfo ? (isTr ? stInfo.nameTR : stInfo.nameEN) : '';
    this.addFloatText(`STAGE ${st}: ${stTitle}`, this.W * 0.5, 250, '#ffe047', 20);
  }

  onPlayerDeath() {
    this.spawnExplosion(this.player.x, this.player.y, 130);
    this.shakeTime = 0;
    this.shakeIntensity = 0;
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

  addScore(basePoints) {
    this.score += Math.round(basePoints || 0);
  }

  resetCombo() {}

  // =========================================================================
  // XP KAZANMA VE 3'LÜ ISPANAK KUTUSU SEVİYE ATLAMA SİSTEMİ
  // =========================================================================
  addXp(amount) {
    if (this.player.dead) return;
    const xpMult = 1 + this.player.hasSkill('xp_overdrive') * 0.40;
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
    this.shakeTime = 0;
    this.shakeIntensity = 0;
    this.levelUpChoices = window.SkillSystem.rollThreeChoices(this.player);
    if (this.levelUpChoices.length === 0) {
      // 50 yeteneğin tamamı alındıysa doğrudan can ve skor ödülü ver
      this.player.hp = this.player.maxHp;
      this.addScore(1000, this.player.x, this.player.y - 40);
      return;
    }
    if (window.AudioManager) window.AudioManager.playLevelUp();
    this.state = 'LEVELUP';
  }

  selectLevelUpSkill(index) {
    if (this.state !== 'LEVELUP') return;
    const chosen = this.levelUpChoices[index];
    if (!chosen) return;

    if (window.AudioManager) window.AudioManager.playSkillPick();
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

  spawnPickup(x, y, type, xpVal) {
    this.pickupPool.acquire(x, y, 'xp_gem', xpVal);
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

    if ((e.isBoss || e.type === 'elite_cruiser' || e.type === 'e2_5' || e.type === 'e2_10' || e.type === 'e2_15' || e.type === 'e2_20') && this.player.hasSkill('boss_hunter') > 0) {
      finalDmg *= 1.40;
    }

    let isCrit = false;
    if (!isDot && Math.random() < this.player.critChance) {
      finalDmg *= this.player.critMult;
      isCrit = true;
      this.spawnVfx(e.x, e.y, 'spark_crit', 52, 0.16);
    }
    if (!isDot && window.AudioManager) {
      window.AudioManager.playHit(isCrit);
    }

    e.hp -= finalDmg;
    e.hitFlash = 1.0;

    const hsLvl = this.player.hasSkill('headshot_kill');
    if (hsLvl > 0 && !e.isBoss && e.hp > 0) {
      if (e.hp / e.maxHp <= 0.20) {
        e.hp = 0;
        this.addFloatText(window.I18N.t('HEADSHOT_TXT'), e.x, e.y - 20, '#ff4d6d', 16);
      }
    }

    if (e.hp <= 0) {
      if (e.isBoss) {
        if (window.AudioManager) window.AudioManager.playExplosion(true);
        this.waveDirector.onBossKilled(e);
        return;
      }

      e._active = false;
      if (window.AudioManager) {
        window.AudioManager.playExplosion(e.w >= 95);
      }
      this.spawnExplosion(e.x, e.y, Math.max(72, e.w * 1.1));
      this.addScreenShake(5, 0.14);
      this.addScore(e.score, e.x, e.y);

      const vampLvl = this.player.hasSkill('vampiric_leech');
      if (vampLvl > 0 && !this.player.dead) {
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + 2.2);
      }

      // Vurulan uçaklardan yalnızca XP elması çıkar
      const eCfg = window.GAME_CONFIG.ENEMIES[e.type];
      const xpVal = (eCfg && eCfg.xp) || window.GAME_CONFIG.XP.GEM_VALUE;
      this.spawnPickup(e.x, e.y, 'xp_gem', xpVal);
    }
  }

  onBulletHitEnemy(b, e) {
    if (b.knockback > 0 && !e.isBoss) {
      e.y = Math.max(-40, e.y - 14);
    }

    if (b.burn > 0) {
      e.burnTimer = 3.0;
      e.burnDps = b.dmg * 0.45;
    }

    if (b.chill > 0) {
      e.chillTimer = 3.2;
    }

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

    if (b.lightning > 0) {
      const nextTarget = this.findNearestEnemy(e.x, e.y, e, 240);
      if (nextTarget) {
        this.spawnVfx((e.x + nextTarget.x) * 0.5, (e.y + nextTarget.y) * 0.5, 'proj_lightning', 72, 0.18);
        this.damageEnemy(nextTarget, b.dmg * 0.65, true);
      }
    }

    if (b.split) {
      b.split = false;
      const angles = [-0.55, 0, 0.55];
      for (let i = 0; i < angles.length; i++) {
        const ang = -Math.PI * 0.5 + angles[i];
        this.spawnPlayerBullet(
          e.x, e.y,
          Math.cos(ang) * 720, Math.sin(ang) * 720,
          b.dmg * 0.42, 'bullet_player', 14, 28, angles[i],
          { pierce: 0 }
        );
      }
    }
  }

  applyPickup(p) {
    const xpVal = p.xpVal || window.GAME_CONFIG.XP.GEM_VALUE;
    if (window.AudioManager) {
      window.AudioManager.playXp(this.xp / Math.max(1, this.xpToNext));
    }
    this.addXp(xpVal);
  }

  update(dt) {
    // Oyun durduğunda (LEVELUP skill seçim ekranı, PAUSED, GAMEOVER) arka akan plan ve müzik tamamen durur
    if (this.state !== 'PLAYING') return;

    if (window.AudioManager) {
      window.AudioManager.updateMusic(dt, this.waveDirector.stage, Boolean(this.waveDirector.bossActive));
    }

    this.groundScrollY += 92 * dt;

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      s.y += s.speed * dt;
      s.twinklePhase += dt * 3.5;
      if (s.y > this.H + 5) {
        s.y = -5;
        s.x = Math.random() * this.W;
      }
    }

    for (let i = 0; i < this.nebulae.length; i++) {
      const nb = this.nebulae[i];
      nb.y += nb.speed * dt;
      if (nb.y - nb.r > this.H + 40) {
        nb.y = -nb.r - 40;
        nb.x = 80 + Math.random() * (this.W - 160);
      }
    }

    const st = window.StageThemes ? window.StageThemes.getStage(this.waveDirector.stage) : null;
    const leftFrames = (st && st.leftProps) || ['wall_left_radar', 'wall_left_reactor'];
    const rightFrames = (st && st.rightProps) || ['wall_right_tower', 'wall_right_coil'];
    this.wallPool.updateAll(dt, (w) => {
      w.y += w.speed * dt;
      if (w.y > this.H + 160) {
        this.wallStep++;
        w.y = -150;
        if (w.side === 'left') {
          w.frame = leftFrames[this.wallStep % leftFrames.length];
          w.flipX = false;
        } else {
          w.frame = rightFrames[this.wallStep % rightFrames.length];
          w.flipX = w.frame.indexOf('env2_') === 0;
        }
      }
      return true;
    });

    if (this.shakeTime > 0) {
      this.shakeTime = Math.max(0, this.shakeTime - dt);
      if (this.shakeTime === 0) this.shakeIntensity = 0;
    }

    this.player.update(dt);
    this.waveDirector.update(dt);

    const enemies = this.enemyPool.activeList;

    this.playerBulletPool.updateAll(dt, (b) => {
      b.age += dt;
      if (b.spinSpeed !== 0) b.rot += b.spinSpeed * dt;
      if (b.growRate > 0) b.w += b.growRate * dt;

      if (b.boomerang) {
        b.vy += 980 * dt;
        const dx = this.player.x - b.x;
        b.vx += dx * 3.5 * dt;
        if (b.age > 0.6 && Math.hypot(this.player.x - b.x, this.player.y - b.y) < 38) {
          return false;
        }
      }

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

    const orbitals = this.player.getOrbitalPositions();

    this.enemyPool.updateAll(dt, (e) => {
      if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt * 6.5);

      if (e.burnTimer > 0) {
        e.burnTimer -= dt;
        this.damageEnemy(e, e.burnDps * dt, true);
        if (!e._active) return false;
      }

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

    // XP Elmasları: En alta ulaştığında yok olmaz, mıknatısla oyuncuya çekilir ve otomatik yapışır!
    const touchR = window.GAME_CONFIG.PICKUPS.TOUCH_RADIUS || 56;
    const bottomMagnetY = this.H - 115;

    this.pickupPool.updateAll(dt, (p) => {
      p.age += dt;

      if (!p.magnetized) {
        p.y += p.vy * dt;
        if (p.y >= bottomMagnetY) {
          p.magnetized = true;
        }
      }

      if (!this.player.dead) {
        const dx = this.player.x - p.x;
        const dy = this.player.y - p.y;
        const distSq = dx * dx + dy * dy;

        if (p.magnetized) {
          const dist = Math.max(1, Math.sqrt(distSq));
          const pullSpeed = 780;
          p.x += (dx / dist) * pullSpeed * dt;
          p.y += (dy / dist) * pullSpeed * dt;
        }

        if (distSq <= touchR * touchR) {
          this.applyPickup(p);
          return false;
        }
      } else {
        return false;
      }

      return true;
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

    // 1) Aktif Bölümün (1..15) Gökyüzü veya Zemin Gradyanı
    const st = window.StageThemes ? window.StageThemes.getStage(this.waveDirector.stage) : null;
    const topC = (st && st.skyTop) || [6, 16, 32];
    const midC = (st && st.skyMid) || [11, 28, 54];
    const botC = (st && st.skyBot) || [5, 13, 26];

    const grad = ctx.createLinearGradient(0, 0, 0, this.H);
    grad.addColorStop(0,   `rgb(${topC[0]},${topC[1]},${topC[2]})`);
    grad.addColorStop(0.5, `rgb(${midC[0]},${midC[1]},${midC[2]})`);
    grad.addColorStop(1,   `rgb(${botC[0]},${botC[1]},${botC[2]})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.W, this.H);

    // Sadece aktif oynanışta ekran sarsıntısı uygula
    if (this.state === 'PLAYING' && this.shakeTime > 0 && this.shakeIntensity > 0) {
      const sx = (Math.random() - 0.5) * this.shakeIntensity * 2;
      const sy = (Math.random() - 0.5) * this.shakeIntensity * 2;
      ctx.translate(sx, sy);
    }

    // 2) Bölümün Zeminli/Zeminsiz Özel Dokusu (Hurda Güverte, Fabrika Boruları, Karlı Vadi, Lav Nehri, Karadelik vb.)
    if (window.StageThemes) {
      window.StageThemes.drawStageBackdrop(ctx, this.W, this.H, this.waveDirector.stage, this.groundScrollY);
    }

    // 3) Zeminsiz / Nebula Bölümlerde Atmosferik Nebula Bulutları
    if (st && st.nebula) {
      for (let i = 0; i < this.nebulae.length; i++) {
        const nb = this.nebulae[i];
        const nGrad = ctx.createRadialGradient(nb.x, nb.y, 10, nb.x, nb.y, nb.r);
        nGrad.addColorStop(0, st.nebula);
        nGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = nGrad;
        ctx.beginPath();
        ctx.arc(nb.x, nb.y, nb.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4) Bölüme Uygun Atmosfer Parçacıkları (Yıldızlar, Kar Taneleri, Kıvılcımlar, Kristal/Spor Parıltıları)
    const pType = (st && st.particleType) || 'stars';
    const starCols = (st && st.starColors) || ['#ffffff', '#9be8ff', '#ffe066'];
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      if (pType === 'snow') {
        ctx.fillStyle = '#e8faff';
      } else if (pType === 'sparks') {
        ctx.fillStyle = (i % 2 === 0) ? '#ff942e' : '#ffe066';
      } else if (pType === 'spores') {
        ctx.fillStyle = (i % 2 === 0) ? '#9dff2e' : '#d580ff';
      } else if (pType === 'crystals') {
        ctx.fillStyle = (i % 2 === 0) ? '#26ffc9' : '#70f8ff';
      } else {
        ctx.fillStyle = starCols[s.colorIdx % starCols.length];
      }
      ctx.globalAlpha = Math.max(0.2, Math.min(0.95, s.alpha + Math.sin(s.twinklePhase) * 0.18));
      ctx.beginPath();
      ctx.arc(s.x, s.y, pType === 'snow' ? s.r * 1.25 : s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 5) Bölümün Özel Sol ve Sağ Kenar Çevre Nesneleri
    const walls = this.wallPool.activeList;
    for (let i = 0; i < walls.length; i++) {
      const w = walls[i];
      window.Atlas.draw(ctx, w.frame, w.x, w.y, w.w, w.h, w.flipX ? { scaleX: -1 } : null);
    }

    // 6) XP Kristalleri
    const pickups = this.pickupPool.activeList;
    for (let i = 0; i < pickups.length; i++) {
      const p = pickups[i];
      window.Atlas.draw(ctx, p.type, p.x, p.y, 34, 34);
    }

    // 7) Oyuncu Mermileri
    const pBullets = this.playerBulletPool.activeList;
    for (let i = 0; i < pBullets.length; i++) {
      const b = pBullets[i];
      window.Atlas.draw(ctx, b.frame, b.x, b.y, b.w, b.h, { rotation: b.rot });
    }

    // 8) Düşman Gemileri ve Dev Bosslar
    const enemies = this.enemyPool.activeList;
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      window.Atlas.draw(ctx, e.type, e.x, e.y, e.w, e.h, {
        rotation: e.rotation,
        hitFlash: e.hitFlash
      });
    }

    // 9) Oyuncu Uçağı, Lazerler, Yörüngeler ve Wingman'ler
    this.player.draw(ctx);

    // 10) Düşman Mermileri
    const eBullets = this.enemyBulletPool.activeList;
    for (let i = 0; i < eBullets.length; i++) {
      const b = eBullets[i];
      window.Atlas.draw(ctx, b.frame, b.x, b.y, b.w, b.h, { rotation: b.rot });
    }

    // 11) VFX ve Patlamalar
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

    // 12) Uçuşan Yazılar
    const fTexts = this.floatTextPool.activeList;
    for (let i = 0; i < fTexts.length; i++) {
      const ft = fTexts[i];
      const alpha = Math.max(0, 1 - ft.age / ft.duration);
      ctx.save();
      ctx.globalAlpha = alpha;
      this.ui.drawTextOutlined(ctx, ft.text, ft.x, ft.y, ft.size, ft.color, 'center', 4);
      ctx.restore();
    }

    // 13) HUD ve Seviye Atlama Ekranı
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

const bootPopeye1929 = () => {
  if (!window.gameInstance) {
    window.gameInstance = new window.PopeyeShmupGame();
  }
};

// Android Geri Tuşu Yönetimi (MainActivity.java -> window.geriTus())
window._lastBackPress = 0;
window.geriTus = () => {
  const g = window.gameInstance;
  if (!g) return 'cik';
  if (g.state === 'PLAYING') {
    g.togglePause();
    return 'dur';
  }
  if (g.state === 'PAUSED') {
    g.togglePause();
    return 'devam';
  }
  if (g.state === 'LEVELUP') {
    return 'bekle';
  }
  if (g.state === 'GAMEOVER') {
    g.state = 'MENU';
    return 'menu';
  }
  const now = Date.now();
  if (now - window._lastBackPress < 2000) {
    return 'cik';
  }
  window._lastBackPress = now;
  g.addFloatText(
    window.I18N && window.I18N.lang === 'EN' ? 'PRESS BACK AGAIN TO EXIT' : 'ÇIKMAK İÇİN TEKRAR GERİ BASIN',
    g.W * 0.5,
    g.H - 110,
    '#ffe047',
    15
  );
  return 'uyari';
};

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', bootPopeye1929);
} else {
  bootPopeye1929();
}
