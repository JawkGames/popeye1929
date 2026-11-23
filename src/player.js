// Oyuncu Uçağı, Göreceli Dokunmatik Sürükleme (Relative Touch Drag), Silah Yükseltmeleri ve Wingman Sistemi
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
    this.weaponLevel = 1; // Başlangıçta 1 mermi, her konservede mermi sayısı artar (1..8)
    this.powerBonus = 0;  // Maksimum mermi sayısından sonra alınan konserveler hasarı artırır
    this.fireTimer = 0;
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

    // Klavye Durumu (Masaüstü Yön Tuşları / WASD)
    this.keys = { left: false, right: false, up: false, down: false };

    // Yardımcı Uçaklar (Wingman / Companion)
    this.wingmen = [];
    this.wingmanFireTimer = 0;
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

    // Pointer Events (Hem Mobil Dokunmatik hem Masaüstü Mouse Drag)
    canvas.addEventListener('pointerdown', (e) => {
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
    const toAdd = Math.min(2, wCfg.MAX_COUNT - this.wingmen.length);
    for (let i = 0; i < toAdd; i++) {
      const slotIdx = this.wingmen.length;
      const offset = wCfg.OFFSETS[slotIdx];
      this.wingmen.push({
        slotIdx,
        x: this.x + offset.x,
        y: this.y + offset.y,
        vx: 0,
        bobPhase: slotIdx * 1.4
      });
    }
    return true;
  }

  // Her silah konservesi alındığında mermi sayısını kesin olarak artırır!
  // Örn: 1X'te 2X alınca 2 mermi olur; tekrar 2X alınca 3 mermiye (3X), sonra 4 mermiye (4X) çıkar.
  // Daha yüksek bir konserve (örn. 4X veya 6X) alınırsa doğrudan o mermi sayısına sıçrar veya üstüne ekler.
  upgradeWeapon(canTier) {
    const maxLevel = 8;
    if (canTier > this.weaponLevel) {
      this.weaponLevel = Math.min(maxLevel, canTier);
      return { upgraded: true, level: this.weaponLevel };
    } else if (this.weaponLevel < maxLevel) {
      this.weaponLevel = Math.min(maxLevel, this.weaponLevel + 1);
      return { upgraded: true, level: this.weaponLevel };
    } else {
      // 8 mermiye ulaştıktan sonra alınan her silah konservesi mermi hasarını +%15 artırır
      this.powerBonus += 0.15;
      return { upgraded: false, level: this.weaponLevel, powerBonus: this.powerBonus };
    }
  }

  update(dt) {
    if (this.dead) return;

    this.thrusterPulse += dt * 24;
    if (this.invulnTimer > 0) this.invulnTimer -= dt;
    if (this.shieldTimer > 0) {
      this.shieldTimer -= dt;
      this.shieldAngle += dt * 3.2;
    }
    if (this.hitFlash > 0) this.hitFlash = Math.max(0, this.hitFlash - dt * 5);

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

    this.fireTimer -= dt;
    if (this.fireTimer <= 0) {
      this.fireTimer = this.cfg.FIRE_INTERVAL;
      this.fireMainWeapon();
    }

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
        this.wingmanFireTimer = wCfg.FIRE_INTERVAL;
        for (let i = 0; i < this.wingmen.length; i++) {
          const wm = this.wingmen[i];
          this.game.spawnPlayerBullet(
            wm.x,
            wm.y - 20,
            0,
            -860,
            wCfg.DAMAGE * (1 + this.powerBonus),
            'bullet_player',
            18,
            34
          );
        }
      }
    }
  }

  fireMainWeapon() {
    const wData = window.GAME_CONFIG.WEAPONS[this.weaponLevel] || window.GAME_CONFIG.WEAPONS[1];
    const spd = wData.speed;
    const dmg = wData.damage * (1 + this.powerBonus);
    const baseY = this.y - 36;
    const count = wData.count;

    if (count === 1) {
      // 1X: Tek merkez plazma mermisi
      this.game.spawnPlayerBullet(this.x, baseY, 0, -spd, dmg, 'bullet_player', 22, 46);
    } else if (count === 2) {
      // 2X: 2 adet paralel mermi
      this.game.spawnPlayerBullet(this.x - 14, baseY, 0, -spd, dmg, 'bullet_player', 22, 46);
      this.game.spawnPlayerBullet(this.x + 14, baseY, 0, -spd, dmg, 'bullet_player', 22, 46);
    } else {
      // 3X..8X: Tam olarak count (3, 4, 5, 6, 7, 8) adet mermi yelpazesi
      const stepDeg = wData.spreadDeg || 7;
      const half = (count - 1) * 0.5;
      for (let i = 0; i < count; i++) {
        const rel = i - half; // Örn 3 mermi için -1, 0, +1; 4 mermi için -1.5, -0.5, +0.5, +1.5
        const deg = rel * stepDeg;
        const rad = (deg * Math.PI) / 180;
        const ox = rel * 11;
        const isCenterSuper = (count >= 5 && Math.abs(rel) < 0.6);
        this.game.spawnPlayerBullet(
          this.x + ox,
          baseY - (Math.abs(rel) < 1 ? 4 : 0),
          Math.sin(rad) * spd,
          -Math.cos(rad) * spd,
          isCenterSuper ? dmg * 1.2 : dmg,
          isCenterSuper ? 'bullet_super' : 'bullet_player',
          isCenterSuper ? 34 : 22,
          isCenterSuper ? 34 : 46,
          rad
        );
      }
    }
  }

  takeDamage(amount) {
    if (this.dead || this.invulnTimer > 0) return false;
    if (this.shieldTimer > 0) {
      this.game.spawnVfx(this.x, this.y - 10, 'spark_crit', 70, 0.22);
      return false;
    }

    this.hp = Math.max(0, this.hp - amount);
    this.invulnTimer = this.cfg.INVULN_TIME;
    this.hitFlash = 1.0;
    this.game.resetCombo();
    this.game.addScreenShake(10, 0.28);
    this.game.spawnVfx(this.x, this.y, 'spark_crit', 84, 0.28);

    if (this.weaponLevel > 4) this.weaponLevel -= 1;

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

    if (this.invulnTimer > 0 && Math.floor(this.invulnTimer * 16) % 2 === 0) {
      ctx.save();
      ctx.globalAlpha = 0.55;
    }

    const flScale = 0.88 + Math.sin(this.thrusterPulse) * 0.16;

    for (let i = 0; i < this.wingmen.length; i++) {
      const wm = this.wingmen[i];
      window.Atlas.draw(ctx, 'thruster_blue', wm.x, wm.y + 22, 16, 26 * flScale);
      window.Atlas.draw(ctx, 'wingman', wm.x, wm.y, 44, 44, {
        rotation: Math.max(-0.22, Math.min(0.22, wm.vx * 0.0008))
      });
    }

    window.Atlas.draw(ctx, 'thruster_blue', this.x - 10, this.y + 42, 22, 38 * flScale);
    window.Atlas.draw(ctx, 'thruster_blue', this.x + 10, this.y + 42, 22, 38 * flScale);

    let frameKey = 'player_center';
    if (this.vx < -this.cfg.BANK_THRESHOLD) frameKey = 'player_left';
    else if (this.vx > this.cfg.BANK_THRESHOLD) frameKey = 'player_right';

    window.Atlas.draw(ctx, frameKey, this.x, this.y, this.cfg.WIDTH, this.cfg.HEIGHT, {
      hitFlash: this.hitFlash
    });

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
