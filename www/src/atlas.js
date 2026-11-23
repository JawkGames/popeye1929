// Toplu Sprite Sheet / Texture Atlas Yöneticisi ve Koordinat Dilimleyici (Slicing Engine)
window.Atlas = {
  sheets: {},
  loaded: false,
  flashCanvas: null,
  flashCtx: null,

  // 5 Toplu Sprite Sheet Dosyası
  SHEET_PATHS: {
    ships: 'assets/ships_atlas.png',
    items: 'assets/items_ui_atlas.png',
    vfx: 'assets/vfx_atlas.png',
    env: 'assets/env_atlas.png',
    skills: 'assets/skills_weapons_atlas.png'
  },

  // Koordinat Dilimleme Tablosu (x, y, w, h)
  FRAMES: {
    // 1. Oyuncu, Yardımcı Uçak, 6 Düşman ve Dev Boss (ships_atlas.png)
    player_center:    { sheet: 'ships', x: 0,   y: 0,   w: 256, h: 256 },
    player_left:      { sheet: 'ships', x: 256, y: 0,   w: 256, h: 256 },
    player_right:     { sheet: 'ships', x: 512, y: 0,   w: 256, h: 256 },
    wingman:          { sheet: 'ships', x: 768, y: 0,   w: 256, h: 256 },

    scout_pod:        { sheet: 'ships', x: 0,   y: 256, w: 170, h: 256 },
    fang_fighter:     { sheet: 'ships', x: 170, y: 256, w: 170, h: 256 },
    squid_mech:       { sheet: 'ships', x: 340, y: 256, w: 170, h: 256 },
    heavy_gunship:    { sheet: 'ships', x: 510, y: 256, w: 170, h: 256 },
    kamikaze_dart:    { sheet: 'ships', x: 680, y: 256, w: 170, h: 256 },
    elite_cruiser:    { sheet: 'ships', x: 850, y: 256, w: 170, h: 256 },

    boss_dreadnought: { sheet: 'ships', x: 256, y: 512, w: 512, h: 512 },

    // 2. İkonlar, Güçlendirme Konserveleri ve UI (items_ui_atlas.png)
    can_hp:           { sheet: 'items', x: 0,   y: 0,   w: 256, h: 256 },
    can_2x:           { sheet: 'items', x: 256, y: 0,   w: 256, h: 256 },
    can_3x:           { sheet: 'items', x: 512, y: 0,   w: 256, h: 256 },
    can_4x:           { sheet: 'items', x: 768, y: 0,   w: 256, h: 256 },
    can_6x:           { sheet: 'items', x: 0,   y: 256, w: 256, h: 256 },
    can_wingman:      { sheet: 'items', x: 256, y: 256, w: 256, h: 256 },
    can_shield:       { sheet: 'items', x: 512, y: 256, w: 256, h: 256 },
    can_bomb:         { sheet: 'items', x: 768, y: 256, w: 256, h: 256 },
    hud_portrait:     { sheet: 'items', x: 0,   y: 512, w: 256, h: 256 },
    coin_gold:        { sheet: 'items', x: 256, y: 512, w: 256, h: 256 },
    hud_heart:        { sheet: 'items', x: 512, y: 512, w: 256, h: 256 },
    ui_button:        { sheet: 'items', x: 768, y: 512, w: 256, h: 256 },

    // 3. Mermi, Vuruş, Alev, Kalkan ve Patlama Efektleri (vfx_atlas.png)
    bullet_player:     { sheet: 'vfx', x: 0,   y: 0,   w: 256, h: 256 },
    bullet_super:      { sheet: 'vfx', x: 256, y: 0,   w: 256, h: 256 },
    bullet_enemy_dart: { sheet: 'vfx', x: 512, y: 0,   w: 256, h: 256 },
    bullet_enemy_orb:  { sheet: 'vfx', x: 768, y: 0,   w: 256, h: 256 },
    spark_small:       { sheet: 'vfx', x: 0,   y: 256, w: 256, h: 256 },
    spark_crit:        { sheet: 'vfx', x: 256, y: 256, w: 256, h: 256 },
    thruster_blue:     { sheet: 'vfx', x: 512, y: 256, w: 256, h: 256 },
    shield_ring:       { sheet: 'vfx', x: 768, y: 256, w: 256, h: 256 },
    exp_1:             { sheet: 'vfx', x: 0,   y: 512, w: 256, h: 256 },
    exp_2:             { sheet: 'vfx', x: 256, y: 512, w: 256, h: 256 },
    exp_3:             { sheet: 'vfx', x: 512, y: 512, w: 256, h: 256 },
    exp_4:             { sheet: 'vfx', x: 768, y: 512, w: 256, h: 256 },

    // 4. Modüler Çevre ve Arka Plan Üs Parçaları (env_atlas.png)
    wall_left_radar:   { sheet: 'env', x: 0,   y: 0,   w: 341, h: 342 },
    wall_left_reactor: { sheet: 'env', x: 341, y: 0,   w: 341, h: 342 },
    env_asteroid:      { sheet: 'env', x: 682, y: 0,   w: 341, h: 342 },
    wall_right_tower:  { sheet: 'env', x: 0,   y: 342, w: 341, h: 342 },
    wall_right_coil:   { sheet: 'env', x: 341, y: 342, w: 341, h: 342 },
    env_girder:        { sheet: 'env', x: 682, y: 342, w: 341, h: 342 },

    // 5. Archero Yetenek Silahları, Özel Konserveler, XP Kristali ve 3'lü Kart Çerçevesi (skills_weapons_atlas.png)
    proj_laser:        { sheet: 'skills', x: 0,   y: 0,   w: 256, h: 256 },
    proj_missile:      { sheet: 'skills', x: 256, y: 0,   w: 256, h: 256 },
    proj_sawblade:     { sheet: 'skills', x: 512, y: 0,   w: 256, h: 256 },
    proj_anchor:       { sheet: 'skills', x: 768, y: 0,   w: 256, h: 256 },
    proj_fireball:     { sheet: 'skills', x: 0,   y: 256, w: 256, h: 256 },
    proj_ice:          { sheet: 'skills', x: 256, y: 256, w: 256, h: 256 },
    proj_acid:         { sheet: 'skills', x: 512, y: 256, w: 256, h: 256 },
    proj_lightning:    { sheet: 'skills', x: 768, y: 256, w: 256, h: 256 },
    can_skill_red:     { sheet: 'skills', x: 0,   y: 512, w: 256, h: 256 },
    can_skill_purple:  { sheet: 'skills', x: 256, y: 512, w: 256, h: 256 },
    can_skill_gold:    { sheet: 'skills', x: 512, y: 512, w: 256, h: 256 },
    orb_drone:         { sheet: 'skills', x: 768, y: 512, w: 256, h: 256 },
    ui_skill_card:     { sheet: 'skills', x: 0,   y: 768, w: 256, h: 256 },
    xp_gem:            { sheet: 'skills', x: 256, y: 768, w: 256, h: 256 },
    proj_wave:         { sheet: 'skills', x: 512, y: 768, w: 256, h: 256 },
    badge_levelup:     { sheet: 'skills', x: 768, y: 768, w: 256, h: 256 }
  },

  loadAll(onProgress) {
    this.flashCanvas = document.createElement('canvas');
    this.flashCanvas.width = 256;
    this.flashCanvas.height = 256;
    this.flashCtx = this.flashCanvas.getContext('2d');

    const keys = Object.keys(this.SHEET_PATHS);
    let doneCount = 0;

    return Promise.all(keys.map((key) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          this.sheets[key] = img;
          doneCount++;
          if (onProgress) onProgress(doneCount / keys.length);
          resolve();
        };
        img.onerror = () => {
          doneCount++;
          if (onProgress) onProgress(doneCount / keys.length);
          resolve();
        };
        img.src = this.SHEET_PATHS[key];
      });
    })).then(() => {
      this.loaded = true;
    });
  },

  draw(ctx, frameKey, cx, cy, dw, dh, opts = null) {
    const f = this.FRAMES[frameKey];
    if (!f) return;
    const img = this.sheets[f.sheet];
    if (!img) return;

    const rot = (opts && opts.rotation) || 0;
    const alpha = (opts && opts.alpha !== undefined) ? opts.alpha : 1;
    const scaleX = (opts && opts.scaleX !== undefined) ? opts.scaleX : 1;
    const scaleY = (opts && opts.scaleY !== undefined) ? opts.scaleY : 1;
    const flash = (opts && opts.hitFlash) || 0;

    ctx.save();
    ctx.translate(cx, cy);
    if (rot !== 0) ctx.rotate(rot);
    if (scaleX !== 1 || scaleY !== 1) ctx.scale(scaleX, scaleY);
    if (alpha !== 1) ctx.globalAlpha = alpha;

    ctx.drawImage(img, f.x, f.y, f.w, f.h, -dw * 0.5, -dh * 0.5, dw, dh);

    if (flash > 0.02 && this.flashCtx) {
      const fw = Math.min(256, Math.max(32, Math.ceil(dw)));
      const fh = Math.min(256, Math.max(32, Math.ceil(dh)));
      const fctx = this.flashCtx;
      fctx.clearRect(0, 0, fw, fh);
      fctx.globalCompositeOperation = 'source-over';
      fctx.drawImage(img, f.x, f.y, f.w, f.h, 0, 0, fw, fh);
      fctx.globalCompositeOperation = 'source-in';
      fctx.fillStyle = '#ffffff';
      fctx.fillRect(0, 0, fw, fh);

      ctx.globalAlpha = Math.min(0.88, flash) * alpha;
      ctx.drawImage(this.flashCanvas, 0, 0, fw, fh, -dw * 0.5, -dh * 0.5, dw, dh);
    }

    ctx.restore();
  }
};
