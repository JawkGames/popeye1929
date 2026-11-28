// Oyuncu Uçağı, Göreceli Dokunmatik Sürükleme (Relative Touch Drag), Silah Merdiveni, Wingman ve 50 Archero Yetenek Motoru
window.PlayerController = class PlayerController {
  constructor(game) {
    this.game = game;
    this.cfg = window.GAME_CONFIG.PLAYER;
    this.reset();
    this.initInput();
  }

  reset() {
    this.x = this.cfg.START_X;
    this.y = this.cfg.START_Y;
    this.prevX = this.x;
    this.prevY = this.y;
    this.vx = 0;
    this.vy = 0;
    this.hp = this.cfg.MAX_HP;
    this.maxHp = this.cfg.MAX_HP;
    this.weaponLevel = 1; // Silah merdiveni (1..8)
    this.powerBonus = 0;  // Hasar çarpanı bonusu
    this.rateLvl = 0;     // 4X konservesi atış hızı kademesi
    this.bonusFireRate = 0; // Yeteneklerden gelen atış hızı bonusu
    this.wingBonus = 0;   // Yardımcı uçak hasar bonusu
    this.critChance = 0.05;
    this.critMult = 2.0;

    // 50 Çeşit Archero Yetenek Haritası (skillId -> seviye)
    this.skills = {};

    // Özel Silah Zamanlayıcıları
    this.fireTimer = 0;
    this.burstQueue = 0;
    this.burstTimer = 0;
    this.laserTickTimer = 0;
    this.missileTimer = 1.2;
    this.sawTimer = 1.5;
    this.anchorTimer = 1.8;
    this.waveTimer = 1.6;
    this.novaTimer = 2.2;
    this.barrageTimer = 3.2;
    this.turretTimer = 0.4;
    this.nukeTimer = 1.7;
    this.stormTimer = 1.9;
    this.autoShieldTimer = 10.0;
    this.orbitAngle = 0;

    this.invulnTimer = 0;
    this.shieldTimer = 0;
    this.shieldAngle = 0;
    this.thrusterPulse = 0;
    this.hitFlash = 0;
    this.dead = false;

    // Göreceli Dokunmatik (Relative Drag) Durumu
    this.dragging = false;
    this.pointerId = null;
    this.dragStartScreenX = 0;
    this.dragStartScreenY = 0;
    this.shipStartDragX = this.x;
    this.shipStartDragY = this.y;

    // Klavye Durumu
    this.keys = { left: false, right: false, up: false, down: false };

    // Yardımcı Uçaklar (Wingman / Companion)
    this.wingmen = [];
    this.wingmanFireTimer = 0;
  }

  hasSkill(id) {
    return (this.skills && this.skills[id]) || 0;
  }

  initInput() {
    const canvas = this.game.canvas;

    const toVirtualCoords = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = window.GAME_CONFIG.WIDTH / Math.max(1, rect.width);
      const scaleY = window.GAME_CONFIG.HEIGHT / Math.max(1, rect.height);
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    };

    canvas.addEventListener('pointerdown', (e) => {
      if (window.AudioManager) window.AudioManager.init();
      const pt = toVirtualCoords(e.clientX, e.clientY);
      if (this.game.ui && this.game.ui.handlePointerDown(pt.x, pt.y)) {
        return;
      }
      if (this.game.state === 'MENU') {
        this.game.startGame();
      }
      if (this.game.state !== 'PLAYING') return;

      this.dragging = true;
      this.pointerId = e.pointerId;
      this.dragStartScreenX = pt.x;
      this.dragStartScreenY = pt.y;
      this.shipStartDragX = this.x;
      this.shipStartDragY = this.y;
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.dragging || (this.pointerId !== null && e.pointerId !== this.pointerId)) return;
      if (this.game.state !== 'PLAYING' || this.dead) return;

      const pt = toVirtualCoords(e.clientX, e.clientY);
      const dx = (pt.x - this.dragStartScreenX) * this.cfg.DRAG_SENSITIVITY;
      const dy = (pt.y - this.dragStartScreenY) * this.cfg.DRAG_SENSITIVITY;

      this.x = this.clampX(this.shipStartDragX + dx);
      this.y = this.clampY(this.shipStartDragY + dy);

      if (this.x === 38 || this.x === window.GAME_CONFIG.WIDTH - 38) {
        this.dragStartScreenX = pt.x;
        this.shipStartDragX = this.x;
      }
      if (this.y === 110 || this.y === window.GAME_CONFIG.HEIGHT - 55) {
        this.dragStartScreenY = pt.y;
        this.shipStartDragY = this.y;
      }
    });

    const endDrag = (e) => {
      if (this.pointerId !== null && e.pointerId !== undefined && e.pointerId !== this.pointerId) return;
      this.dragging = false;
      this.pointerId = null;
    };

    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    window.addEventListener('keydown', (e) => {
      // Seviye atlama ekranında 1, 2, 3 tuşlarıyla hızlı yetenek seçimi
      if (this.game.state === 'LEVELUP') {
        if (e.key === '1') this.game.selectLevelUpSkill(0);
        else if (e.key === '2') this.game.selectLevelUpSkill(1);
        else if (e.key === '3') this.game.selectLevelUpSkill(2);
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') this.keys.up = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') this.keys.down = true;
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        if (this.game.state === 'PLAYING' || this.game.state === 'PAUSED') {
          this.game.togglePause();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') this.keys.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') this.keys.down = false;
    });
  }

  clampX(x) {
    return Math.max(38, Math.min(window.GAME_CONFIG.WIDTH - 38, x));
  }

  clampY(y) {
    return Math.max(110, Math.min(window.GAME_CONFIG.HEIGHT - 55, y));
  }

  addWingmen() {
    const wCfg = window.GAME_CONFIG.WINGMAN;
    if (this.wingmen.length >= wCfg.MAX_COUNT) {
      return false;
    }
    const slotIdx = this.wingmen.length;
    const offset = wCfg.OFFSETS[slotIdx];
    this.wingmen.push({
      slotIdx,
      x: this.x + offset.x,
      y: this.y + offset.y,
      vx: 0,
      bobPhase: slotIdx * 1.4
    });
    return true;
  }

  applyWeaponCan(kind) {
    const cfg = window.GAME_CONFIG;
    const maxLevel = cfg.WEAPON_LADDER.length - 1;
    let changed = false;
    const stepUp = () => { if (this.weaponLevel < maxLevel) { this.weaponLevel++; changed = true; } };
    const rateUp = () => { if (this.rateLvl < cfg.FIRE_RATE_MAX) { this.rateLvl++; changed = true; } };
    const dmgUp = () => { this.powerBonus += cfg.DAMAGE_STEP; changed = true; };

    if (kind === '2x') stepUp();
    else if (kind === '3x') { stepUp(); if (this.powerBonus < cfg.DAMAGE_STEP * 4) dmgUp(); }
    else if (kind === '4x') rateUp();
    else if (kind === '6x') { stepUp(); rateUp(); if (this.powerBonus < cfg.DAMAGE_STEP * 4) dmgUp(); }

    if (changed) return 'up';
    if (this.wingmen.length > 0) { this.wingBonus += cfg.WINGMAN_BOOST; return 'wing'; }
    return 'score';
  }

  getTotalDamageMult() {
    let mult = 1 + this.powerBonus;
    if (this.hasSkill('giant_bullets') > 0) mult += this.hasSkill('giant_bullets') * 0.25;
    if (this.hasSkill('bullet_speed_up') > 0) mult += this.hasSkill('bullet_speed_up') * 0.20;
    if (this.hasSkill('acid_rounds') > 0) mult += this.hasSkill('acid_rounds') * 0.30;
    if (this.hasSkill('knockback_impact') > 0) mult += this.hasSkill('knockback_impact') * 0.20;
    if (this.hasSkill('berserker_rage') > 0) {
      const missingRatio = Math.max(0, 1 - this.hp / Math.max(1, this.maxHp));
      mult += missingRatio * 0.65 * this.hasSkill('berserker_rage');
    }
    return mult;
  }

  getTotalFireRateMult() {
    let mult = 1 + this.rateLvl * window.GAME_CONFIG.FIRE_RATE_STEP + this.bonusFireRate;
    if (this.hasSkill('berserker_rage') > 0) {
      const missingRatio = Math.max(0, 1 - this.hp / Math.max(1, this.maxHp));
      mult += missingRatio * 0.65 * this.hasSkill('berserker_rage');
    }
    return mult;
  }

  getMainProjectileFrame(thick) {
    if (this.hasSkill('fire_rounds') > 0) return 'proj_fireball';
    if (this.hasSkill('ice_rounds') > 0) return 'proj_ice';
    if (this.hasSkill('acid_rounds') > 0) return 'proj_acid';
    return thick ? 'bullet_super' : 'bullet_player';
  }

  buildBulletOpts(extra = null) {
    return {
      pierce: (extra && extra.pierce !== undefined) ? extra.pierce : (this.hasSkill('piercing_shot') ? 2 : 0),
      wallBounces: (extra && extra.wallBounces !== undefined) ? extra.wallBounces : (this.hasSkill('bouncy_walls') ? 2 : 0),
      ricochets: (extra && extra.ricochets !== undefined) ? extra.ricochets : (this.hasSkill('ricochet_shot') ? 2 : 0),
      homing: (extra && extra.homing !== undefined) ? extra.homing : (this.hasSkill('homing_bullets') ? 3.2 : 0),
      split: (extra && extra.split !== undefined) ? extra.split : (this.hasSkill('split_shrapnel') > 0),
      explosive: (extra && extra.explosive !== undefined) ? extra.explosive : (this.hasSkill('explosive_shots') > 0),
      knockback: this.hasSkill('knockback_impact'),
      burn: this.hasSkill('fire_rounds'),
      chill: this.hasSkill('ice_rounds'),
      lightning: this.hasSkill('chain_lightning'),
      boomerang: Boolean(extra && extra.boomerang),
      spinSpeed: (extra && extra.spinSpeed) || 0,
      growRate: (extra && extra.growRate) || 0
    };
  }

  update(dt) {
    if (this.dead) return;

    this.thrusterPulse += dt * 24;
    this.orbitAngle += dt * 3.8;
    if (this.invulnTimer > 0) this.invulnTimer -= dt;
    if (this.shieldTimer > 0) {
      this.shieldTimer -= dt;
      this.shieldAngle += dt * 3.2;
    }
    if (this.hitFlash > 0) this.hitFlash = Math.max(0, this.hitFlash - dt * 5);

    // Otomatik Gövde Onarımı (hull_regen: saniyede +3 HP)
    const regenLvl = this.hasSkill('hull_regen');
    if (regenLvl > 0 && this.hp < this.maxHp) {
      this.hp = Math.min(this.maxHp, this.hp + regenLvl * 3.0 * dt);
    }

    // Periyodik Otomatik Enerji Kalkanı (periodic_shield)
    const autoShLvl = this.hasSkill('periodic_shield');
    if (autoShLvl > 0) {
      this.autoShieldTimer -= dt;
      if (this.autoShieldTimer <= 0) {
        this.autoShieldTimer = Math.max(6.5, 11.5 - autoShLvl * 1.1);
        this.shieldTimer = Math.max(this.shieldTimer, 3.5);
      }
    }

    // Klavye hareketi
    let kx = 0;
    let ky = 0;
    if (this.keys.left) kx -= 1;
    if (this.keys.right) kx += 1;
    if (this.keys.up) ky -= 1;
    if (this.keys.down) ky += 1;
    if (kx !== 0 || ky !== 0) {
      const len = Math.hypot(kx, ky);
      this.x = this.clampX(this.x + (kx / len) * this.cfg.KEYBOARD_SPEED * dt);
      this.y = this.clampY(this.y + (ky / len) * this.cfg.KEYBOARD_SPEED * dt);
    }

    const rawVx = (this.x - this.prevX) / Math.max(0.001, dt);
    this.vx = this.vx * 0.72 + rawVx * 0.28;
    this.prevX = this.x;
    this.prevY = this.y;

    const rateMult = this.getTotalFireRateMult();

    // Ana Silah Otomatik Ateş
    this.fireTimer -= dt;
    if (this.fireTimer <= 0) {
      this.fireTimer = this.cfg.FIRE_INTERVAL / rateMult;
      this.fireMainWeapon();
      const burstLvl = this.hasSkill('multishot_burst');
      if (burstLvl > 0) {
        this.burstQueue = Math.min(2, burstLvl);
        this.burstTimer = 0.055;
      }
    }

    // Multishot Seri İkinci/Üçüncü Dalga
    if (this.burstQueue > 0) {
      this.burstTimer -= dt;
      if (this.burstTimer <= 0) {
        this.burstQueue--;
        this.burstTimer = 0.055;
        this.fireMainWeapon();
      }
    }

    // Özel Archero Silahlarını Güncelle (Lazer, Füze, Testere, Çapa, Yıldırım vb.)
    this.updateSpecialWeapons(dt, rateMult);

    // Yardımcı Uçaklar (Wingman)
    if (this.wingmen.length > 0) {
      const wCfg = window.GAME_CONFIG.WINGMAN;
      const lerpFactor = 1 - Math.exp(-wCfg.FOLLOW_LERP * dt);

      for (let i = 0; i < this.wingmen.length; i++) {
        const wm = this.wingmen[i];
        const offset = wCfg.OFFSETS[wm.slotIdx];
        wm.bobPhase += dt * 4.2;
        const targetX = this.x + offset.x + Math.sin(wm.bobPhase) * 5;
        const targetY = this.y + offset.y + Math.cos(wm.bobPhase * 0.8) * 4;
        const oldX = wm.x;
        wm.x += (targetX - wm.x) * lerpFactor;
        wm.y += (targetY - wm.y) * lerpFactor;
        wm.vx = (wm.x - oldX) / Math.max(0.001, dt);
      }

      this.wingmanFireTimer -= dt;
      if (this.wingmanFireTimer <= 0) {
        this.wingmanFireTimer = wCfg.FIRE_INTERVAL / rateMult;
        const thick = this.weaponLevel >= window.GAME_CONFIG.WINGMAN_THICK_LEVEL;
        const bOpts = this.buildBulletOpts();
        for (let i = 0; i < this.wingmen.length; i++) {
          const wm = this.wingmen[i];
          this.game.spawnPlayerBullet(
            wm.x,
            wm.y - 20,
            0,
            -860,
            wCfg.DAMAGE * (thick ? 1.7 : 1) * (this.getTotalDamageMult() + this.wingBonus),
            thick ? 'bullet_super' : 'bullet_player',
            thick ? 28 : 18,
            thick ? 28 : 34,
            0,
            bOpts
          );
        }
      }
    }
  }

  fireMainWeapon() {
    const cfg = window.GAME_CONFIG;
    const lanes = cfg.WEAPON_LADDER[this.weaponLevel] || 'T';
    const baseY = this.y - 36;
    const n = lanes.length;
    const half = (n - 1) * 0.5;
    const gap = n <= 2 ? 14 : 15;

    const dmgMult = this.getTotalDamageMult();
    const sizeScale = 1 + this.hasSkill('giant_bullets') * 0.35;
    const spdScale = 1 + this.hasSkill('bullet_speed_up') * 0.40;
    const bOpts = this.buildBulletOpts();
    if (window.AudioManager) {
      window.AudioManager.playShoot(this.weaponLevel >= 3 || this.hasSkill('fire_rounds') > 0);
    }

    // 1) Ana Silah Merdiveni Şeritleri
    for (let i = 0; i < n; i++) {
      const thick = lanes[i] === 'K';
      const w = thick ? cfg.WEAPON_THICK : cfg.WEAPON_THIN;
      const rel = i - half;
      const rad = (rel * (n >= 5 ? 4 : 3) * Math.PI) / 180;
      const spd = w.speed * spdScale;
      const dmg = w.damage * dmgMult;
      const frame = this.getMainProjectileFrame(thick);

      this.game.spawnPlayerBullet(
        this.x + rel * gap,
        baseY - (Math.abs(rel) < 1 ? 4 : 0),
        Math.sin(rad) * spd,
        -Math.cos(rad) * spd,
        dmg,
        frame,
        w.w * sizeScale,
        w.h * sizeScale,
        rad,
        bOpts
      );
    }

    const baseSpd = cfg.WEAPON_THIN.speed * spdScale;
    const baseDmg = cfg.WEAPON_THIN.damage * dmgMult * 0.85;
    const baseFrame = this.getMainProjectileFrame(false);
    const bw = 20 * sizeScale;
    const bh = 42 * sizeScale;

    // 2) Çapraz Yaylım (diagonal_shot)
    const diagLvl = this.hasSkill('diagonal_shot');
    for (let d = 1; d <= diagLvl; d++) {
      const deg = 14 + d * 8;
      const rad = (deg * Math.PI) / 180;
      this.game.spawnPlayerBullet(this.x - 16, baseY, -Math.sin(rad) * baseSpd, -Math.cos(rad) * baseSpd, baseDmg, baseFrame, bw, bh, -rad, bOpts);
      this.game.spawnPlayerBullet(this.x + 16, baseY, Math.sin(rad) * baseSpd, -Math.cos(rad) * baseSpd, baseDmg, baseFrame, bw, bh, rad, bOpts);
    }

    // 3) Geniş Yelpaze Barajı (fan_spread)
    const fanLvl = this.hasSkill('fan_spread');
    for (let f = 1; f <= fanLvl; f++) {
      const deg = 18 + f * 9;
      const rad = (deg * Math.PI) / 180;
      this.game.spawnPlayerBullet(this.x - 20, baseY + 4, -Math.sin(rad) * baseSpd, -Math.cos(rad) * baseSpd, baseDmg, baseFrame, bw, bh, -rad, bOpts);
      this.game.spawnPlayerBullet(this.x + 20, baseY + 4, Math.sin(rad) * baseSpd, -Math.cos(rad) * baseSpd, baseDmg, baseFrame, bw, bh, rad, bOpts);
    }

    // 4) Yan Kanat Topları (side_shot)
    const sideLvl = this.hasSkill('side_shot');
    if (sideLvl > 0) {
      const rad = (62 * Math.PI) / 180;
      const sDmg = baseDmg * (0.8 + sideLvl * 0.25);
      this.game.spawnPlayerBullet(this.x - 28, this.y - 6, -Math.sin(rad) * baseSpd, -Math.cos(rad) * baseSpd, sDmg, baseFrame, bw, bh, -rad, bOpts);
      this.game.spawnPlayerBullet(this.x + 28, this.y - 6, Math.sin(rad) * baseSpd, -Math.cos(rad) * baseSpd, sDmg, baseFrame, bw, bh, rad, bOpts);
    }
  }

  updateSpecialWeapons(dt, rateMult) {
    const dmgMult = this.getTotalDamageMult();

    // 1) Sürekli Lazer Işını (laser_beam & twin_laser)
    const centerLaser = this.hasSkill('laser_beam');
    const twinLaser = this.hasSkill('twin_laser');
    const overLaser = this.hasSkill('laser_overcharge');
    if (centerLaser > 0 || twinLaser > 0) {
      this.laserTickTimer -= dt;
      if (this.laserTickTimer <= 0) {
        this.laserTickTimer = 0.085;
        const beamScale = 1 + overLaser * 0.45;
        const tickDmg = (9 + (centerLaser + twinLaser + overLaser) * 4.5) * dmgMult;
        const beams = [];
        if (centerLaser > 0) {
          beams.push({ x: this.x, halfW: (18 + centerLaser * 4) * beamScale });
        }
        if (twinLaser > 0) {
          const hw = (13 + twinLaser * 3) * beamScale;
          beams.push({ x: this.x - 32, halfW: hw });
          beams.push({ x: this.x + 32, halfW: hw });
        }
        const enemies = this.game.enemyPool.activeList;
        for (let i = enemies.length - 1; i >= 0; i--) {
          const e = enemies[i];
          if (!e._active || e.y > this.y) continue;
          for (let b = 0; b < beams.length; b++) {
            if (Math.abs(e.x - beams[b].x) <= e.radius + beams[b].halfW) {
              this.game.spawnVfx(beams[b].x, e.y + 12, 'spark_small', 32, 0.10);
              this.game.damageEnemy(e, tickDmg);
              break;
            }
          }
        }
      }
    }

    // 2) Güdümlü Füze Bataryası (homing_missiles: ikili güdümlü mikro füze)
    const misLvl = this.hasSkill('homing_missiles');
    if (misLvl > 0) {
      this.missileTimer -= dt * rateMult;
      if (this.missileTimer <= 0) {
        this.missileTimer = Math.max(0.55, 1.35 - misLvl * 0.15);
        const count = 2;
        for (let i = 0; i < count; i++) {
          const side = (i % 2 === 0) ? -1 : 1;
          const vx = side * (75 + i * 30);
          this.game.spawnPlayerBullet(
            this.x + side * 24, this.y - 10, vx, -520,
            34 * dmgMult * (1 + misLvl * 0.18),
            'proj_missile', 28, 46, 0,
            this.buildBulletOpts({ homing: 4.8, explosive: true, pierce: 0 })
          );
        }
      }
    }

    // 3) Döner Testere Disk (sawblade_disc)
    const sawLvl = this.hasSkill('sawblade_disc');
    if (sawLvl > 0) {
      this.sawTimer -= dt * rateMult;
      if (this.sawTimer <= 0) {
        this.sawTimer = Math.max(0.75, 1.65 - sawLvl * 0.16);
        this.game.spawnPlayerBullet(
          this.x, this.y - 34, 0, -560,
          28 * dmgMult * (1 + sawLvl * 0.2),
          'proj_sawblade', 46, 46, 0,
          this.buildBulletOpts({ pierce: 99, spinSpeed: 15, wallBounces: 2 + sawLvl })
        );
      }
    }

    // 4) Sonik Hilal Dalgası (sonic_wave)
    const waveLvl = this.hasSkill('sonic_wave');
    if (waveLvl > 0) {
      this.waveTimer -= dt * rateMult;
      if (this.waveTimer <= 0) {
        this.waveTimer = Math.max(0.85, 1.85 - waveLvl * 0.16);
        this.game.spawnPlayerBullet(
          this.x, this.y - 38, 0, -680,
          30 * dmgMult * (1 + waveLvl * 0.2),
          'proj_wave', 64, 42, 0,
          this.buildBulletOpts({ pierce: 99, growRate: 52 })
        );
      }
    }

    // 6) 360° Yıldız Halkası (omni_nova_ring)
    const novaLvl = this.hasSkill('omni_nova_ring');
    if (novaLvl > 0) {
      this.novaTimer -= dt;
      if (this.novaTimer <= 0) {
        this.novaTimer = Math.max(1.4, 2.4 - novaLvl * 0.2);
        const total = 8 + novaLvl * 2;
        const bOpts = this.buildBulletOpts();
        for (let i = 0; i < total; i++) {
          const ang = (i / total) * Math.PI * 2;
          this.game.spawnPlayerBullet(
            this.x, this.y,
            Math.cos(ang) * 640, Math.sin(ang) * 640,
            22 * dmgMult, 'bullet_super', 26, 26, ang + Math.PI * 0.5, bOpts
          );
        }
      }
    }

    // 7) Ispanak Roket Yağmuru (spinach_barrage)
    const barLvl = this.hasSkill('spinach_barrage');
    if (barLvl > 0) {
      this.barrageTimer -= dt;
      if (this.barrageTimer <= 0) {
        this.barrageTimer = Math.max(2.0, 3.5 - barLvl * 0.3);
        const count = 4 + barLvl;
        for (let i = 0; i < count; i++) {
          const rx = 60 + (i / Math.max(1, count - 1)) * (window.GAME_CONFIG.WIDTH - 120);
          this.game.spawnPlayerBullet(
            rx, window.GAME_CONFIG.HEIGHT - 20, 0, -640,
            32 * dmgMult, 'proj_missile', 28, 46, 0,
            this.buildBulletOpts({ homing: 3.2, explosive: true })
          );
        }
      }
    }

    // 8) Otonom Omuz Tareti (auto_shoulder_cannon)
    const turLvl = this.hasSkill('auto_shoulder_cannon');
    if (turLvl > 0) {
      this.turretTimer -= dt * rateMult;
      if (this.turretTimer <= 0) {
        this.turretTimer = Math.max(0.18, 0.45 - turLvl * 0.06);
        const target = this.game.findNearestEnemy(this.x, this.y);
        if (target) {
          const ang = Math.atan2(target.y - this.y, target.x - this.x);
          this.game.spawnPlayerBullet(
            this.x, this.y - 18,
            Math.cos(ang) * 920, Math.sin(ang) * 920,
            19 * dmgMult, 'bullet_player', 20, 40, ang + Math.PI * 0.5,
            this.buildBulletOpts()
          );
        }
      }
    }

    // 9) Ağır Plazma Topu (plasma_nuke_cannon)
    const nukeLvl = this.hasSkill('plasma_nuke_cannon');
    if (nukeLvl > 0) {
      this.nukeTimer -= dt;
      if (this.nukeTimer <= 0) {
        this.nukeTimer = Math.max(1.0, 1.85 - nukeLvl * 0.18);
        this.game.spawnPlayerBullet(
          this.x, this.y - 36, 0, -540,
          58 * dmgMult * (1 + nukeLvl * 0.25),
          'orb_drone', 44, 44, 0,
          this.buildBulletOpts({ explosive: true, pierce: 1 })
        );
      }
    }

    // 10) Yıldırım Fırtınası (lightning_storm)
    const stormLvl = this.hasSkill('lightning_storm');
    if (stormLvl > 0) {
      this.stormTimer -= dt;
      if (this.stormTimer <= 0) {
        this.stormTimer = Math.max(1.1, 2.0 - stormLvl * 0.2);
        const enemies = this.game.enemyPool.activeList;
        let strikes = Math.min(enemies.length, 1 + stormLvl);
        for (let i = 0; i < enemies.length && strikes > 0; i++) {
          const e = enemies[i];
          if (!e._active || e.y < 20) continue;
          strikes--;
          this.game.spawnVfx(e.x, e.y - 35, 'proj_lightning', 66, 0.24);
          this.game.spawnVfx(e.x, e.y, 'spark_crit', 56, 0.20);
          this.game.damageEnemy(e, 45 * dmgMult * (1 + stormLvl * 0.2));
        }
      }
    }
  }

  getOrbitalPositions() {
    const res = [];
    const orbLvl = this.hasSkill('orbital_orbs');
    if (orbLvl > 0) {
      const count = 3;
      for (let i = 0; i < count; i++) {
        const ang = this.orbitAngle + (i / count) * Math.PI * 2;
        res.push({
          x: this.x + Math.cos(ang) * 66,
          y: this.y + Math.sin(ang) * 66,
          r: 20,
          frame: 'orb_drone',
          size: 32,
          rot: ang,
          blocksBullets: true,
          dmg: 22 * this.getTotalDamageMult()
        });
      }
    }

    // Döner Çapa (orbital_anchors): Tek başlar, aldıkça artar (1..8)
    // Sıralama: +90° (Sağ), -90° (Sol), 0° (Üst), 180° (Alt), +45° (Sağ-Üst), -135° (Karşısı Sol-Alt), -45° (Sol-Üst), +135° (Karşısı Sağ-Alt)
    const ancLvl = this.hasSkill('orbital_anchors');
    if (ancLvl > 0) {
      const ANCHOR_ANGLES_DEG = [90, -90, 0, 180, 45, -135, -45, 135];
      const count = Math.min(ANCHOR_ANGLES_DEG.length, ancLvl);
      const orbitDist = 128; // Uçaktan biraz daha uzakta geniş koruma yörüngesi
      for (let i = 0; i < count; i++) {
        const offsetRad = (ANCHOR_ANGLES_DEG[i] - 90) * (Math.PI / 180);
        const ang = this.orbitAngle * 1.35 + offsetRad;
        res.push({
          x: this.x + Math.cos(ang) * orbitDist,
          y: this.y + Math.sin(ang) * orbitDist,
          r: 28,
          frame: 'proj_anchor_new',
          size: 54,
          rot: ang + Math.PI * 0.5,
          blocksBullets: false,
          dmg: 34 * this.getTotalDamageMult()
        });
      }
    }
    return res;
  }

  takeDamage(amount) {
    if (this.dead || this.invulnTimer > 0) return false;
    if (this.shieldTimer > 0) {
      if (window.AudioManager) window.AudioManager.playPlayerHit(true);
      this.game.spawnVfx(this.x, this.y - 10, 'spark_crit', 70, 0.22);
      return false;
    }

    // Hayalet Manevra (dodge_cloak: %22 sıyrılma şansı)
    const dodgeLvl = this.hasSkill('dodge_cloak');
    if (dodgeLvl > 0 && Math.random() < Math.min(0.48, dodgeLvl * 0.22)) {
      this.invulnTimer = 0.45;
      this.game.addFloatText(window.I18N.t('DODGE_TXT'), this.x, this.y - 40, '#70f0ff', 20);
      return false;
    }

    if (window.AudioManager) window.AudioManager.playPlayerHit(false);

    this.hp = Math.max(0, this.hp - amount);
    this.invulnTimer = this.cfg.INVULN_TIME;
    this.hitFlash = 1.0;
    this.game.addScreenShake(10, 0.28);
    this.game.spawnVfx(this.x, this.y, 'spark_crit', 84, 0.28);

    if (this.hp <= 0) {
      this.dead = true;
      this.game.onPlayerDeath();
    }
    return true;
  }

  reviveFull() {
    this.dead = false;
    this.hp = this.maxHp;
    this.invulnTimer = 2.5;
    this.shieldTimer = 4.0;
    this.x = this.cfg.START_X;
    this.y = this.cfg.START_Y;
  }

  draw(ctx) {
    if (this.dead) return;

    // 1) Sürekli Lazer Işınlarını Çiz (laser_beam & twin_laser — ek yersiz tek parça kesintisiz ışın)
    const centerLaser = this.hasSkill('laser_beam');
    const twinLaser = this.hasSkill('twin_laser');
    const overLaser = this.hasSkill('laser_overcharge');
    if (centerLaser > 0 || twinLaser > 0) {
      const pulse = 0.88 + Math.sin(this.thrusterPulse * 1.8) * 0.14;
      const bScale = (1 + overLaser * 0.35) * pulse;
      const drawBeam = (bx, bw) => {
        const beamBottom = this.y - 34;
        const beamTop = -12;
        const beamH = Math.max(20, beamBottom - beamTop);
        const beamCy = beamTop + beamH * 0.5;
        window.Atlas.draw(ctx, 'proj_laser', bx, beamCy, bw, beamH, { alpha: 0.94 });
      };
      if (centerLaser > 0) drawBeam(this.x, (32 + centerLaser * 6) * bScale);
      if (twinLaser > 0) {
        const tw = (22 + twinLaser * 4) * bScale;
        drawBeam(this.x - 32, tw);
        drawBeam(this.x + 32, tw);
      }
    }

    if (this.invulnTimer > 0 && Math.floor(this.invulnTimer * 16) % 2 === 0) {
      ctx.save();
      ctx.globalAlpha = 0.55;
    }

    const flScale = 0.88 + Math.sin(this.thrusterPulse) * 0.16;

    // 2) Yardımcı Uçaklar (Wingman)
    for (let i = 0; i < this.wingmen.length; i++) {
      const wm = this.wingmen[i];
      window.Atlas.draw(ctx, 'thruster_blue', wm.x, wm.y + 22, 16, 26 * flScale);
      window.Atlas.draw(ctx, 'wingman', wm.x, wm.y, 44, 44, {
        rotation: Math.max(-0.22, Math.min(0.22, wm.vx * 0.0008))
      });
    }

    // 3) Motor Alevleri ve Oyuncu Uçağı
    window.Atlas.draw(ctx, 'thruster_blue', this.x - 10, this.y + 42, 22, 38 * flScale);
    window.Atlas.draw(ctx, 'thruster_blue', this.x + 10, this.y + 42, 22, 38 * flScale);

    let frameKey = 'player_center';
    if (this.vx < -this.cfg.BANK_THRESHOLD) frameKey = 'player_left';
    else if (this.vx > this.cfg.BANK_THRESHOLD) frameKey = 'player_right';

    window.Atlas.draw(ctx, frameKey, this.x, this.y, this.cfg.WIDTH, this.cfg.HEIGHT, {
      hitFlash: this.hitFlash
    });

    // 4) Yörünge Küreleri ve Döner Çapalar (orbital_orbs & orbital_anchors)
    const orbitals = this.getOrbitalPositions();
    for (let i = 0; i < orbitals.length; i++) {
      const ob = orbitals[i];
      window.Atlas.draw(ctx, ob.frame, ob.x, ob.y, ob.size, ob.size, {
        rotation: ob.rot
      });
    }

    // 5) Enerji Kalkanı
    if (this.shieldTimer > 0) {
      const shieldAlpha = this.shieldTimer < 1.5
        ? 0.45 + Math.sin(this.thrusterPulse * 1.5) * 0.35
        : 0.78;
      window.Atlas.draw(ctx, 'shield_ring', this.x, this.y, 118, 118, {
        rotation: this.shieldAngle,
        alpha: shieldAlpha
      });
    }

    if (this.invulnTimer > 0 && Math.floor(this.invulnTimer * 16) % 2 === 0) {
      ctx.restore();
    }
  }
};
