// Ana Oyun Motoru: Sonsuz Paralaks Arka Plan, Object Pool Güncellemeleri, Çarpışma ve Vuruş Hissi (Game Juice)
window.PopeyeShmupGame = class PopeyeShmupGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.W = window.GAME_CONFIG.WIDTH;
    this.H = window.GAME_CONFIG.HEIGHT;

    this.state = 'LOADING'; // LOADING, MENU, PLAYING, PAUSED, GAMEOVER
    this.score = 0;
    this.combo = 1;
    this.comboTimer = 0;
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
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const targetRatio = this.W / this.H;
    const winRatio = winW / Math.max(1, winH);

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
  }

  initPools() {
    // 1) Oyuncu Mermi Havuzu
    this.playerBulletPool = new window.ObjectPool(
      () => ({ x: 0, y: 0, vx: 0, vy: 0, dmg: 10, frame: 'bullet_player', w: 20, h: 42, rot: 0 }),
      (b, x, y, vx, vy, dmg, frame, w, h, rot) => {
        b.x = x; b.y = y; b.vx = vx; b.vy = vy;
        b.dmg = dmg; b.frame = frame || 'bullet_player';
        b.w = w || 20; b.h = h || 42; b.rot = rot || 0;
      },
      80
    );

    // 2) Düşman Mermi Havuzu
    this.enemyBulletPool = new window.ObjectPool(
      () => ({ x: 0, y: 0, vx: 0, vy: 0, dmg: 12, frame: 'bullet_enemy_dart', w: 20, h: 32, rot: 0 }),
      (b, x, y, vx, vy, dmg, frame, w, h, rot) => {
        b.x = x; b.y = y; b.vx = vx; b.vy = vy;
        b.dmg = dmg; b.frame = frame || 'bullet_enemy_dart';
        b.w = w || 20; b.h = h || 32; b.rot = rot || 0;
      },
      120
    );

    // 3) Düşman Havuzu
    this.enemyPool = new window.ObjectPool(
      () => ({
        type: 'scout_pod', x: 0, y: 0, w: 64, h: 64, radius: 26,
        hp: 30, maxHp: 30, score: 100, damage: 15,
        fireRate: 2.0, fireTimer: 1.0, bulletSpeed: 300,
        hitFlash: 0, rotation: 0, isBoss: false
      }),
      null,
      36
    );

    // 4) Konserve ve Altın Havuzu
    this.pickupPool = new window.ObjectPool(
      () => ({ x: 0, y: 0, vy: 135, type: 'can_hp', age: 0, startX: 0 }),
      (p, x, y, type) => {
        p.x = x; p.y = y; p.startX = x;
        p.vy = window.GAME_CONFIG.PICKUPS.FALL_SPEED;
        p.type = type || 'can_hp';
        p.age = 0;
      },
      24
    );

    // 5) VFX ve Patlama Havuzu
    this.vfxPool = new window.ObjectPool(
      () => ({ x: 0, y: 0, type: 'spark', frame: 'spark_small', size: 48, age: 0, duration: 0.25, rot: 0 }),
      (v, x, y, type, frame, size, duration) => {
        v.x = x; v.y = y; v.type = type; v.frame = frame;
        v.size = size || 48; v.age = 0; v.duration = duration || 0.25;
        v.rot = Math.random() * Math.PI * 2;
      },
      64
    );

    // 6) Uçuşan Kombo / Puan Yazıları Havuzu
    this.floatTextPool = new window.ObjectPool(
      () => ({ text: '', x: 0, y: 0, color: '#fff', size: 18, age: 0, duration: 0.85 }),
      (ft, text, x, y, color, size) => {
        ft.text = text; ft.x = x; ft.y = y;
        ft.color = color || '#ffe047'; ft.size = size || 18;
        ft.age = 0; ft.duration = 0.85;
      },
      24
    );

    // 7) Sonsuz Modüler Metalik Üs Duvarları Havuzu (Sol ve Sağ Paralaks Kule/Platformlar)
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

    // Ekran boyunca kesintisiz modüler sol ve sağ üs duvarlarını diz
    for (let i = 0; i < 4; i++) {
      const yPos = this.H - i * 290;
      this.wallPool.acquire('left', leftFrames[i % 2], 78, yPos, 175, 220, 92);
      this.wallPool.acquire('right', rightFrames[i % 2], this.W - 78, yPos - 135, 175, 220, 92);
    }
    this.wallSpawnLeftY = -280;
    this.wallSpawnRightY = -415;
    this.wallStep = 0;
  }

  startGame() {
    this.score = 0;
    this.combo = 1;
    this.comboTimer = 0;
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
    const mult = Math.min(25, this.combo);
    const total = Math.round(basePoints * (1 + (mult - 1) * 0.15));
    this.score += total;
    this.combo++;
    this.comboTimer = 3.8;
    if (x !== undefined && y !== undefined) {
      this.addFloatText(`+${total}`, x, y, this.combo > 5 ? '#ffe047' : '#ffffff', 16);
    }
  }

  resetCombo() {
    this.combo = 1;
    this.comboTimer = 0;
  }

  addFloatText(text, x, y, color = '#ffe047', size = 18) {
    this.floatTextPool.acquire(text, x, y, color, size);
  }

  spawnPlayerBullet(x, y, vx, vy, dmg, frame, w, h, rot = 0) {
    this.playerBulletPool.acquire(x, y, vx, vy, dmg, frame, w, h, rot);
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

  triggerSuperSpinachBomb(showLabel = true) {
    this.addScreenShake(18, 0.75);
    this.enemyBulletPool.clear();

    if (showLabel) {
      this.addFloatText(window.I18N.t('PICKUP_BOMB'), this.player.x, this.player.y - 55, '#ffe047', 22);
    }

    // Ekrana halka halinde patlamalar yay
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      this.spawnExplosion(
        this.W * 0.5 + Math.cos(ang) * 140,
        this.H * 0.45 + Math.sin(ang) * 180,
        115
      );
    }

    // Aktif tüm düşmanlara ağır ıspanak şok hasarı ver
    const bombDmg = window.GAME_CONFIG.PICKUPS.BOMB_DAMAGE;
    const list = this.enemyPool.activeList;
    for (let i = list.length - 1; i >= 0; i--) {
      const e = list[i];
      if (!e._active) continue;
      this.damageEnemy(e, bombDmg);
    }
  }

  damageEnemy(e, dmg) {
    if (e.isBoss && e.dying) return;
    e.hp -= dmg;
    e.hitFlash = 1.0;

    if (e.hp <= 0) {
      if (e.isBoss) {
        this.waveDirector.onBossKilled(e);
        return;
      }

      e._active = false;
      this.spawnExplosion(e.x, e.y, Math.max(72, e.w * 1.1));
      this.addScreenShake(5, 0.14);
      this.addScore(e.score, e.x, e.y);

      // Garantili konserve veya rastgele altın/konserve düşüşü
      if (e.guaranteedCan) {
        this.spawnPickup(e.x, e.y, e.guaranteedCan);
      } else {
        const roll = Math.random();
        if (roll < 0.14) {
          const cans = this.waveDirector.getAvailableCanPool();
          this.spawnPickup(e.x, e.y, cans[Math.floor(Math.random() * cans.length)]);
        } else if (roll < 0.48) {
          this.spawnPickup(e.x, e.y, 'coin_gold');
        }
      }
    }
  }

  applyPickup(p) {
    const player = this.player;
    const cfg = window.GAME_CONFIG.PICKUPS;

    switch (p.type) {
      case 'coin_gold':
        this.addScore(cfg.COIN_SCORE, p.x, p.y);
        break;

      case 'can_hp':
        player.hp = Math.min(player.maxHp, player.hp + cfg.SPINACH_HEAL);
        this.addScore(cfg.SCORE_BONUS);
        this.addFloatText(window.I18N.t('PICKUP_HP'), player.x, player.y - 45, '#6dff5c', 20);
        break;

      case 'can_2x':
        if (player.upgradeWeapon(2)) {
          this.addFloatText(window.I18N.t('PICKUP_2X'), player.x, player.y - 45, '#57e2ff', 20);
        } else {
          this.addScore(500, p.x, p.y);
        }
        break;

      case 'can_3x':
        if (player.upgradeWeapon(3)) {
          this.addFloatText(window.I18N.t('PICKUP_3X'), player.x, player.y - 45, '#57e2ff', 20);
        } else {
          this.addScore(500, p.x, p.y);
        }
        break;

      case 'can_4x':
        if (player.upgradeWeapon(4)) {
          this.addFloatText(window.I18N.t('PICKUP_4X'), player.x, player.y - 45, '#ffa834', 20);
        } else {
          this.addScore(500, p.x, p.y);
        }
        break;

      case 'can_6x':
        if (player.upgradeWeapon(6)) {
          this.addFloatText(window.I18N.t('PICKUP_6X'), player.x, player.y - 45, '#ff4d6d', 22);
        } else {
          this.addScore(650, p.x, p.y);
        }
        break;

      case 'can_wingman':
        if (player.addWingmen()) {
          this.addFloatText(window.I18N.t('PICKUP_WINGMAN'), player.x, player.y - 45, '#70f0ff', 20);
        } else {
          this.addScore(600);
          this.addFloatText(window.I18N.t('MAX_POWER'), player.x, player.y - 45, '#ffe047', 18);
        }
        break;

      case 'can_shield':
        player.shieldTimer = window.GAME_CONFIG.PLAYER.SHIELD_DURATION;
        this.addFloatText(window.I18N.t('PICKUP_SHIELD'), player.x, player.y - 45, '#57ffda', 20);
        break;

      case 'can_bomb':
        this.triggerSuperSpinachBomb(true);
        break;
    }
  }

  update(dt) {
    // Yıldızlar ve Modüler Üs Duvarları her zaman sonsuz akar
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      s.y += s.speed * dt;
      if (s.y > this.H + 5) {
        s.y = -5;
        s.x = Math.random() * this.W;
      }
    }

    // Sonsuz Modüler Metalik Üs Duvarlarını Kaydır ve Alttan Çıkınca Üstten Geri Dönüştür
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

    // Ekran Titremesi (Screen Shake)
    if (this.shakeTime > 0) {
      this.shakeTime = Math.max(0, this.shakeTime - dt);
      if (this.shakeTime === 0) this.shakeIntensity = 0;
    }

    // Kombo zamanlayıcısı
    if (this.combo > 1) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 1;
      }
    }

    // 1) Oyuncu ve Dalga Yöneticisi
    this.player.update(dt);
    this.waveDirector.update(dt);

    // 2) Oyuncu Mermileri & Düşman Çarpışma Kontrolü
    const enemies = this.enemyPool.activeList;
    this.playerBulletPool.updateAll(dt, (b) => {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.y < -40 || b.x < -40 || b.x > this.W + 40) return false;

      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        if (!e._active) continue;
        const dx = b.x - e.x;
        const dy = b.y - e.y;
        const hitR = e.radius + 12;
        if (dx * dx + dy * dy <= hitR * hitR) {
          this.spawnVfx(b.x, b.y, 'spark_small', 40, 0.14);
          this.damageEnemy(e, b.dmg);
          return false;
        }
      }
      return true;
    });

    // 3) Düşman Hareketleri, Ateşleri ve Oyuncuyla Gövde Çarpışması
    this.enemyPool.updateAll(dt, (e) => {
      if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt * 6.5);

      if (!e.isBoss) {
        window.Formations.updateEnemyPath(e, dt, this.player);
        e.fireTimer -= dt;
        if (e.fireTimer <= 0) {
          e.fireTimer = e.fireRate;
          this.waveDirector.fireEnemyWeapon(e);
        }
      }

      // Oyuncu ile çarpışma
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

    // 4) Düşman Mermileri & Oyuncu Çarpışması
    this.enemyBulletPool.updateAll(dt, (b) => {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.y > this.H + 40 || b.y < -40 || b.x < -40 || b.x > this.W + 40) return false;

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

    // 5) Konserve ve Altın Toplanabilirleri (Mıknatıs Çekimi + Toplama)
    const pCfg = window.GAME_CONFIG.PICKUPS;
    this.pickupPool.updateAll(dt, (p) => {
      p.age += dt;
      p.y += p.vy * dt;
      p.x = p.startX + Math.sin(p.age * 3.0) * 18;

      if (!this.player.dead) {
        const dx = this.player.x - p.x;
        const dy = this.player.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < pCfg.MAGNET_RADIUS) {
          p.x += (dx / Math.max(1, dist)) * pCfg.MAGNET_SPEED * dt;
          p.y += (dy / Math.max(1, dist)) * pCfg.MAGNET_SPEED * dt;
          p.startX = p.x;
        }
        if (dist < 42) {
          this.applyPickup(p);
          return false;
        }
      }
      return p.y < this.H + 60;
    });

    // 6) VFX ve 4 Kareli Patlama Animasyonu
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

    // 7) Uçuşan Yazılar
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

    // 1) Derin Uzay Arka Planı
    const grad = ctx.createLinearGradient(0, 0, 0, this.H);
    grad.addColorStop(0, '#071426');
    grad.addColorStop(0.5, '#0b1e36');
    grad.addColorStop(1, '#061120');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.W, this.H);

    // Ekran Titremesi (Screen Shake) Uygulaması
    if (this.shakeTime > 0 && this.shakeIntensity > 0) {
      const sx = (Math.random() - 0.5) * this.shakeIntensity * 2;
      const sy = (Math.random() - 0.5) * this.shakeIntensity * 2;
      ctx.translate(sx, sy);
    }

    // 2) Paralaks Yıldız Katmanları
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 3) Sonsuz Modüler Metalik Üs Duvarları (Sol ve Sağ Kenar Paralaks)
    const walls = this.wallPool.activeList;
    for (let i = 0; i < walls.length; i++) {
      const w = walls[i];
      window.Atlas.draw(ctx, w.frame, w.x, w.y, w.w, w.h);
    }

    // 4) Toplanabilir Konserveler ve Altınlar
    const pickups = this.pickupPool.activeList;
    for (let i = 0; i < pickups.length; i++) {
      const p = pickups[i];
      const isCoin = p.type === 'coin_gold';
      const sz = isCoin ? 34 : 52;
      window.Atlas.draw(ctx, p.type, p.x, p.y, sz, sz, {
        rotation: Math.sin(p.age * 4.5) * 0.16
      });
    }

    // 5) Oyuncu Mermileri
    const pBullets = this.playerBulletPool.activeList;
    for (let i = 0; i < pBullets.length; i++) {
      const b = pBullets[i];
      window.Atlas.draw(ctx, b.frame, b.x, b.y, b.w, b.h, { rotation: b.rot });
    }

    // 6) Düşman Gemileri ve Dev Boss
    const enemies = this.enemyPool.activeList;
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      window.Atlas.draw(ctx, e.type, e.x, e.y, e.w, e.h, {
        rotation: e.rotation,
        hitFlash: e.hitFlash
      });
    }

    // 7) Oyuncu Uçağı ve Wingman'ler
    this.player.draw(ctx);

    // 8) Düşman Mermileri
    const eBullets = this.enemyBulletPool.activeList;
    for (let i = 0; i < eBullets.length; i++) {
      const b = eBullets[i];
      window.Atlas.draw(ctx, b.frame, b.x, b.y, b.w, b.h, { rotation: b.rot });
    }

    // 9) VFX, Kıvılcımlar ve Patlamalar
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

    // 10) Uçuşan Puan ve Güçlendirme Yazıları
    const fTexts = this.floatTextPool.activeList;
    for (let i = 0; i < fTexts.length; i++) {
      const ft = fTexts[i];
      const alpha = Math.max(0, 1 - ft.age / ft.duration);
      ctx.save();
      ctx.globalAlpha = alpha;
      this.ui.drawTextOutlined(ctx, ft.text, ft.x, ft.y, ft.size, ft.color, 'center', 4);
      ctx.restore();
    }

    // 11) Üst HUD ve Arayüz
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
