// Konsept Görsele Birebir Uygun HUD, Tam Ekran (Web), TR/EN Dil ve Menü Arayüzü
window.UIManager = class UIManager {
  constructor(game) {
    this.game = game;
    this.isNativeAndroid = Boolean(
      window.Capacitor &&
      typeof window.Capacitor.isNativePlatform === 'function' &&
      window.Capacitor.isNativePlatform()
    );

    // Sağ üst buton alanları (ui_button sprite'ı ile çizilir)
    this.btnPause = { x: 500, y: 38, w: 46, h: 46 };
    this.btnLang  = { x: 446, y: 38, w: 46, h: 46 };
    this.btnFull  = { x: 500, y: 92, w: 46, h: 46 };

    // Modal butonları
    this.btnPrimary = { x: 270, y: 540, w: 280, h: 68 };
    this.btnSecondary = { x: 270, y: 630, w: 280, h: 64 };
    this.layout();
  }

  // Ekran yüksekliği değişince orta menü öğelerini dikeyde ortalar (üst butonlar köşede kalır)
  layout() {
    this.midOff = Math.round((window.GAME_CONFIG.HEIGHT - window.GAME_CONFIG.BASE_HEIGHT) * 0.5);
    this.btnPrimary.y = 540 + this.midOff;
    this.btnSecondary.y = 630 + this.midOff;
  }

  hitRect(px, py, b) {
    return (
      px >= b.x - b.w * 0.5 &&
      px <= b.x + b.w * 0.5 &&
      py >= b.y - b.h * 0.5 &&
      py <= b.y + b.h * 0.5
    );
  }

  handlePointerDown(px, py) {
    // 1) Dil Değiştirme Butonu (TR / EN)
    if (this.hitRect(px, py, this.btnLang)) {
      window.I18N.toggleLang();
      return true;
    }

    // 2) Tam Ekran Butonu (Sadece Web sürümünde görünür ve çalışır, Android AAB'de gizli)
    if (!this.isNativeAndroid && this.hitRect(px, py, this.btnFull)) {
      this.toggleFullscreen();
      return true;
    }

    // 3) Duraklatma (Pause) Butonu
    if (this.hitRect(px, py, this.btnPause)) {
      if (this.game.state === 'PLAYING' || this.game.state === 'PAUSED') {
        this.game.togglePause();
        return true;
      }
    }

    // 4) Menü / Pause / Game Over Modal Butonları
    if (this.game.state === 'MENU') {
      if (this.hitRect(px, py, this.btnPrimary)) {
        this.game.startGame();
        return true;
      }
    } else if (this.game.state === 'PAUSED') {
      if (this.hitRect(px, py, this.btnPrimary)) {
        this.game.togglePause();
        return true;
      }
      if (this.hitRect(px, py, this.btnSecondary)) {
        this.game.startGame();
        return true;
      }
    } else if (this.game.state === 'GAMEOVER') {
      if (this.hitRect(px, py, this.btnPrimary)) {
        // Ödüllü Reklam ile Canlanma (Simüle / AdMob Kancası)
        this.game.reviveWithAd();
        return true;
      }
      if (this.hitRect(px, py, this.btnSecondary)) {
        this.game.startGame();
        return true;
      }
    }

    return false;
  }

  toggleFullscreen() {
    const doc = document;
    const elem = doc.documentElement;
    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      const req = elem.requestFullscreen || elem.webkitRequestFullscreen;
      if (req) {
        req.call(elem).then(() => {
          // Dikey oyun: tam ekranda dikey kilidi koru
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('portrait').catch(() => {});
          }
        }).catch(() => {});
      }
    } else {
      const exit = doc.exitFullscreen || doc.webkitExitFullscreen;
      if (exit) exit.call(doc).catch(() => {});
    }
  }

  formatNumber(n) {
    return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  drawSlantedBar(ctx, x, y, w, h, slant, bgColor, fillColor, fillRatio, borderColor) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + slant, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w - slant, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.fillStyle = bgColor;
    ctx.fill();

    if (fillRatio > 0) {
      const fw = Math.max(0, Math.min(1, fillRatio)) * w;
      ctx.save();
      ctx.clip();
      ctx.fillStyle = fillColor;
      ctx.fillRect(x, y, fw, h);
      // Üst parlama şeridi
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(x, y, fw, h * 0.4);
      ctx.restore();
    }

    ctx.lineWidth = 2.2;
    ctx.strokeStyle = borderColor || '#c8dcf0';
    ctx.stroke();
    ctx.restore();
  }

  drawTextOutlined(ctx, text, x, y, size, fill, align = 'left', strokeWidth = 4) {
    ctx.save();
    ctx.font = `900 ${size}px "Arial Black", Impact, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = '#07111e';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  drawSpriteButton(ctx, rect, label, textColor = '#ffffff', fontSize = 18) {
    // Mevcut boş buton görseli (ui_button) kullanılarak çizilir
    window.Atlas.draw(ctx, 'ui_button', rect.x, rect.y, rect.w, rect.h);
    if (label) {
      this.drawTextOutlined(ctx, label, rect.x, rect.y, fontSize, textColor, 'center', 4);
    }
  }

  draw(ctx) {
    const p = this.game.player;
    const wd = this.game.waveDirector;

    // =========================================================================
    // 1) SOL ÜST KONSEPT HUD (Ispanak Konservesi Portresi, Can, Skor, Kombo, Stage)
    // =========================================================================
    const hudX = 74;

    // Can Barı (Yeşil -> Sarı -> Kırmızı)
    const hpRatio = Math.max(0, p.hp / p.maxHp);
    const hpColor = hpRatio > 0.5 ? '#5fd82b' : (hpRatio > 0.25 ? '#f5b82e' : '#f03c2e');
    this.drawSlantedBar(ctx, hudX, 18, 152, 20, 7, 'rgba(13, 32, 54, 0.88)', hpColor, hpRatio, '#b5d4ef');
    window.Atlas.draw(ctx, 'hud_heart', hudX + 4, 28, 26, 26);

    // SKOR Barı
    this.drawSlantedBar(ctx, hudX - 4, 43, 156, 24, 6, 'rgba(16, 40, 68, 0.90)', 'rgba(34, 82, 132, 0.55)', 1, '#8fb8de');
    this.drawTextOutlined(ctx, window.I18N.t('SCORE'), hudX + 8, 55, 13, '#d7ebff', 'left', 3.5);
    this.drawTextOutlined(ctx, this.formatNumber(this.game.score), hudX + 144, 55, 15, '#ffffff', 'right', 3.5);

    // KOMBO Barı
    const comboRatio = this.game.combo > 1 ? Math.max(0, this.game.comboTimer / 3.8) : 0;
    this.drawSlantedBar(ctx, hudX - 8, 71, 146, 20, 5, 'rgba(16, 36, 62, 0.88)', 'rgba(245, 166, 35, 0.45)', comboRatio, '#7aa4cc');
    this.drawTextOutlined(ctx, window.I18N.t('COMBO'), hudX + 6, 81, 11, '#f7c244', 'left', 3);
    this.drawTextOutlined(ctx, String(this.game.combo), hudX + 130, 81, 13, '#ffe066', 'right', 3);

    // Popeye Konserve Portresi (Sol Üst Köşe, hafif eğimli konsept duruşu)
    window.Atlas.draw(ctx, 'hud_portrait', 40, 54, 72, 84, { rotation: -0.09 });

    // STAGE 1 & Aktif Silah Rozeti
    this.drawTextOutlined(
      ctx,
      `${window.I18N.t('STAGE')} ${wd.stage}`,
      14,
      114,
      14,
      '#eaf4ff',
      'left',
      4
    );

    const weaponBadge = `${p.weaponLevel}X` + (p.wingmen.length > 0 ? ` +${p.wingmen.length}W` : '');
    this.drawTextOutlined(ctx, weaponBadge, 102, 114, 13, '#57e2ff', 'left', 3.5);

    // =========================================================================
    // 2) SAĞ ÜST BUTONLAR (Duraklatma, Dil TR/EN, Web Tam Ekran)
    // =========================================================================
    // Pause Butonu (||)
    this.drawSpriteButton(ctx, this.btnPause, '||', '#eaf4ff', 17);

    // Dil Butonu (TR / EN)
    this.drawSpriteButton(ctx, this.btnLang, window.I18N.lang, '#ffe066', 14);

    // Tam Ekran Butonu (Sadece Web sürümünde)
    if (!this.isNativeAndroid) {
      window.Atlas.draw(ctx, 'ui_button', this.btnFull.x, this.btnFull.y, this.btnFull.w, this.btnFull.h);
      // Tam ekran köşe ikonu çizimi
      ctx.save();
      ctx.strokeStyle = '#d8ecff';
      ctx.lineWidth = 2.4;
      const fx = this.btnFull.x;
      const fy = this.btnFull.y;
      const s = 9;
      ctx.beginPath();
      // Sol üst
      ctx.moveTo(fx - s, fy - s + 5); ctx.lineTo(fx - s, fy - s); ctx.lineTo(fx - s + 5, fy - s);
      // Sağ üst
      ctx.moveTo(fx + s - 5, fy - s); ctx.lineTo(fx + s, fy - s); ctx.lineTo(fx + s, fy - s + 5);
      // Sol alt
      ctx.moveTo(fx - s, fy + s - 5); ctx.lineTo(fx - s, fy + s); ctx.lineTo(fx - s + 5, fy + s);
      // Sağ alt
      ctx.moveTo(fx + s - 5, fy + s); ctx.lineTo(fx + s, fy + s); ctx.lineTo(fx + s, fy + s - 5);
      ctx.stroke();
      ctx.restore();
    }

    // =========================================================================
    // 3) BOSS CAN BARI VE "WARNING" UYARI EKRANI
    // =========================================================================
    if (wd.bossWarningTimer > 0) {
      const pulse = 0.55 + Math.sin(wd.bossWarningTimer * 14) * 0.45;
      ctx.save();
      ctx.fillStyle = `rgba(190, 18, 28, ${0.75 * pulse})`;
      ctx.translate(0, this.midOff);
      ctx.fillRect(0, 390, window.GAME_CONFIG.WIDTH, 96);
      ctx.fillStyle = '#ffe047';
      ctx.fillRect(0, 390, window.GAME_CONFIG.WIDTH, 6);
      ctx.fillRect(0, 480, window.GAME_CONFIG.WIDTH, 6);
      this.drawTextOutlined(
        ctx,
        window.I18N.t('WARNING_BOSS'),
        window.GAME_CONFIG.WIDTH * 0.5,
        438,
        20,
        '#ffffff',
        'center',
        5
      );
      ctx.restore();
    }

    if (wd.bossActive && !wd.bossActive.dying) {
      const b = wd.bossActive;
      const bRatio = Math.max(0, b.hp / b.maxHp);
      const bx = 135;
      const by = 132;
      const bw = 270;
      this.drawTextOutlined(ctx, window.I18N.t('BOSS_NAME'), 270, by - 11, 12, '#ff6b5b', 'center', 3.5);
      this.drawSlantedBar(ctx, bx, by, bw, 16, 6, 'rgba(25, 10, 16, 0.92)', '#e82c2c', bRatio, '#ffb8b0');
    }

    // =========================================================================
    // 4) BAŞLANGIÇ MENÜSÜ / DURAKLATMA / GAME OVER EKRANLARI
    // =========================================================================
    if (this.game.state === 'MENU') {
      this.drawMenuOverlay(ctx);
    } else if (this.game.state === 'PAUSED') {
      this.drawPauseOverlay(ctx);
    } else if (this.game.state === 'GAMEOVER') {
      this.drawGameOverOverlay(ctx);
    }
  }

  drawMenuOverlay(ctx) {
    const W = window.GAME_CONFIG.WIDTH;
    const H = window.GAME_CONFIG.HEIGHT;
    ctx.save();
    ctx.fillStyle = 'rgba(4, 12, 24, 0.72)';
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.translate(0, this.midOff);

    // Üst konsept boss & konserve vitrini
    window.Atlas.draw(ctx, 'boss_dreadnought', W * 0.5, 210, 210, 175);
    window.Atlas.draw(ctx, 'can_hp', W * 0.5 - 135, 345, 62, 68, { rotation: -0.18 });
    window.Atlas.draw(ctx, 'can_6x', W * 0.5 + 135, 345, 62, 68, { rotation: 0.18 });

    this.drawTextOutlined(ctx, 'POPEYE 1929', W * 0.5, 345, 36, '#ffe047', 'center', 7);
    this.drawTextOutlined(ctx, window.I18N.t('SUBTITLE'), W * 0.5, 386, 15, '#68e4ff', 'center', 4);

    // Açıklama satırları
    const lines = window.I18N.t('CONTROL_HINT').split('\n');
    for (let i = 0; i < lines.length; i++) {
      this.drawTextOutlined(ctx, lines[i], W * 0.5, 438 + i * 24, 13, '#dbeeff', 'center', 3.5);
    }

    ctx.restore();
    // Başla Butonu (Sprite tabanlı)
    this.drawSpriteButton(ctx, this.btnPrimary, window.I18N.t('START_BTN'), '#ffe047', 21);

    // Sürüm Etiketi
    this.drawTextOutlined(
      ctx,
      window.GAME_CONFIG.VERSION,
      W - 14,
      H - 16,
      12,
      '#8fb8de',
      'right',
      3
    );
    ctx.restore();
  }

  drawPauseOverlay(ctx) {
    const W = window.GAME_CONFIG.WIDTH;
    const H = window.GAME_CONFIG.HEIGHT;
    ctx.save();
    ctx.fillStyle = 'rgba(4, 12, 24, 0.78)';
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.translate(0, this.midOff);

    window.Atlas.draw(ctx, 'hud_portrait', W * 0.5, 320, 110, 126);
    this.drawTextOutlined(ctx, window.I18N.t('PAUSED'), W * 0.5, 430, 30, '#ffe047', 'center', 6);
    ctx.restore();

    this.drawSpriteButton(ctx, this.btnPrimary, window.I18N.t('RESUME_BTN'), '#6dff5c', 20);
    this.drawSpriteButton(ctx, this.btnSecondary, window.I18N.t('RESTART_BTN'), '#ffffff', 18);

    this.drawTextOutlined(ctx, window.GAME_CONFIG.VERSION, W - 14, H - 16, 12, '#8fb8de', 'right', 3);
    ctx.restore();
  }

  drawGameOverOverlay(ctx) {
    const W = window.GAME_CONFIG.WIDTH;
    const H = window.GAME_CONFIG.HEIGHT;
    ctx.save();
    ctx.fillStyle = 'rgba(14, 6, 14, 0.82)';
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.translate(0, this.midOff);

    window.Atlas.draw(ctx, 'can_hp', W * 0.5, 305, 96, 108);
    this.drawTextOutlined(ctx, window.I18N.t('GAME_OVER'), W * 0.5, 405, 32, '#ff5c4d', 'center', 6);
    this.drawTextOutlined(
      ctx,
      `${window.I18N.t('FINAL_SCORE')}: ${this.formatNumber(this.game.score)}`,
      W * 0.5,
      455,
      22,
      '#ffe047',
      'center',
      5
    );
    ctx.restore();

    this.drawSpriteButton(ctx, this.btnPrimary, window.I18N.t('REVIVE_AD_BTN'), '#6dff5c', 15);
    this.drawSpriteButton(ctx, this.btnSecondary, window.I18N.t('RESTART_BTN'), '#ffffff', 18);
    ctx.restore();
  }
};
