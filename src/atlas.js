// Toplu Sprite Sheet / Texture Atlas Yöneticisi ve Koordinat Dilimleyici (Slicing Engine)
window.Atlas = {
  sheets: {},
  loaded: false,
  flashCanvas: null,
  flashCtx: null,

  // 10 Toplu Sprite Sheet Dosyası (Tek tek görsel yok, tamamı toplu atlas)
  SHEET_PATHS: {
    ships: 'assets/ships_atlas.png',
    items: 'assets/items_ui_atlas.png',
    vfx: 'assets/vfx_atlas.png',
    env: 'assets/env_atlas.png',
    skills: 'assets/skills_weapons_atlas.png',
    enemies2: 'assets/enemies_bullets_atlas.png',
    bosses2: 'assets/bosses_atlas.png',
    stageEnv: 'assets/stage_env_atlas.png',
    hudBar: 'assets/hud_bar_atlas.png',
    uiIcons: 'assets/ui_icons_atlas.png',
    skillCans: 'assets/skill_cans_atlas.png',
    skillCans2: 'assets/skill_cans_atlas2.png',
    skillCans3: 'assets/skill_cans_atlas3.png',
    weaponsVfxNew: 'assets/weapons_vfx_new_atlas.png'
  },

  // Koordinat Dilimleme Tablosu (x, y, w, h)
  FRAMES: {
    // 1. Oyuncu, Yardımcı Uçak, Bölüm 1'in 6 Düşmanı ve İlk Boss (ships_atlas.png)
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

    // 3. Mermi, Vuruş, Alev, Kalkan ve Patlama Efektleri (Yeni parlak weapons_vfx_new_atlas.png + vfx_atlas.png)
    bullet_player:     { sheet: 'weaponsVfxNew', x: 0,   y: 0,   w: 256, h: 256 },
    bullet_super:      { sheet: 'weaponsVfxNew', x: 256, y: 0,   w: 256, h: 256 },
    bullet_enemy_dart: { sheet: 'vfx', x: 512, y: 0,   w: 256, h: 256 },
    bullet_enemy_orb:  { sheet: 'vfx', x: 768, y: 0,   w: 256, h: 256 },
    spark_small:       { sheet: 'weaponsVfxNew', x: 0,   y: 768, w: 256, h: 256 },
    spark_crit:        { sheet: 'weaponsVfxNew', x: 256, y: 768, w: 256, h: 256 },
    thruster_blue:     { sheet: 'weaponsVfxNew', x: 512, y: 768, w: 256, h: 256 },
    shield_ring:       { sheet: 'weaponsVfxNew', x: 768, y: 768, w: 256, h: 256 },
    exp_1:             { sheet: 'vfx', x: 0,   y: 512, w: 256, h: 256 },
    exp_2:             { sheet: 'vfx', x: 256, y: 512, w: 256, h: 256 },
    exp_3:             { sheet: 'vfx', x: 512, y: 512, w: 256, h: 256 },
    exp_4:             { sheet: 'vfx', x: 768, y: 512, w: 256, h: 256 },

    // 4. Bölüm 1 Modüler Çevre Parçaları (env_atlas.png)
    wall_left_radar:   { sheet: 'env', x: 0,   y: 0,   w: 341, h: 342 },
    wall_left_reactor: { sheet: 'env', x: 341, y: 0,   w: 341, h: 342 },
    env_asteroid:      { sheet: 'env', x: 682, y: 0,   w: 341, h: 342 },
    wall_right_tower:  { sheet: 'env', x: 0,   y: 342, w: 341, h: 342 },
    wall_right_coil:   { sheet: 'env', x: 341, y: 342, w: 341, h: 342 },
    env_girder:        { sheet: 'env', x: 682, y: 342, w: 341, h: 342 },

    // 5. 15 Bölüm İçin Yeni Çevre Nesneleri (stage_env_atlas.png, 4x4 = 16 nesne)
    env2_scrap:        { sheet: 'stageEnv', x: 0,   y: 0,   w: 256, h: 256 },
    env2_furnace:      { sheet: 'stageEnv', x: 256, y: 0,   w: 256, h: 256 },
    env2_drill:        { sheet: 'stageEnv', x: 512, y: 0,   w: 256, h: 256 },
    env2_glacier:      { sheet: 'stageEnv', x: 768, y: 0,   w: 256, h: 256 },
    env2_satellite:    { sheet: 'stageEnv', x: 0,   y: 256, w: 256, h: 256 },
    env2_neon1:        { sheet: 'stageEnv', x: 256, y: 256, w: 256, h: 256 },
    env2_neon2:        { sheet: 'stageEnv', x: 512, y: 256, w: 256, h: 256 },
    env2_copper:       { sheet: 'stageEnv', x: 768, y: 256, w: 256, h: 256 },
    env2_meteor:       { sheet: 'stageEnv', x: 0,   y: 512, w: 256, h: 256 },
    env2_crystal:      { sheet: 'stageEnv', x: 256, y: 512, w: 256, h: 256 },
    env2_bioroot:      { sheet: 'stageEnv', x: 512, y: 512, w: 256, h: 256 },
    env2_tendril:      { sheet: 'stageEnv', x: 768, y: 512, w: 256, h: 256 },
    env2_obelisk:      { sheet: 'stageEnv', x: 0,   y: 768, w: 256, h: 256 },
    env2_lava:         { sheet: 'stageEnv', x: 256, y: 768, w: 256, h: 256 },
    env2_blackhole:    { sheet: 'stageEnv', x: 512, y: 768, w: 256, h: 256 },
    env2_teslaspire:   { sheet: 'stageEnv', x: 768, y: 768, w: 256, h: 256 },

    // 6. Archero Yetenek Silahları, Özel Konserveler, XP Kristali ve 3'lü Kart Çerçevesi (Yeni weapons_vfx_new_atlas.png + skills_weapons_atlas.png)
    proj_laser:        { sheet: 'weaponsVfxNew', x: 512, y: 48,  w: 256, h: 160 },
    proj_missile:      { sheet: 'weaponsVfxNew', x: 768, y: 0,   w: 256, h: 256 },
    proj_sawblade:     { sheet: 'weaponsVfxNew', x: 0,   y: 256, w: 256, h: 256 },
    proj_anchor:       { sheet: 'skillCans',     x: 0,   y: 0,   w: 256, h: 256 },
    proj_fireball:     { sheet: 'weaponsVfxNew', x: 256, y: 256, w: 256, h: 256 },
    proj_ice:          { sheet: 'weaponsVfxNew', x: 512, y: 256, w: 256, h: 256 },
    proj_acid:         { sheet: 'weaponsVfxNew', x: 768, y: 256, w: 256, h: 256 },
    proj_lightning:    { sheet: 'weaponsVfxNew', x: 0,   y: 512, w: 256, h: 256 },
    can_skill_red:     { sheet: 'skills', x: 0,   y: 512, w: 256, h: 256 },
    can_skill_purple:  { sheet: 'skills', x: 256, y: 512, w: 256, h: 256 },
    can_skill_gold:    { sheet: 'skills', x: 512, y: 512, w: 256, h: 256 },
    orb_drone:         { sheet: 'weaponsVfxNew', x: 512, y: 512, w: 256, h: 256 },
    ui_skill_card:     { sheet: 'skills', x: 0,   y: 768, w: 256, h: 256 },
    xp_gem:            { sheet: 'skills', x: 256, y: 768, w: 256, h: 256 },
    proj_wave:         { sheet: 'weaponsVfxNew', x: 256, y: 512, w: 256, h: 256 },
    badge_levelup:     { sheet: 'skills', x: 768, y: 768, w: 256, h: 256 },

    // 7. 20 Yeni Düşman + 10 Yeni Düşman Mermisi (enemies_bullets_atlas.png)
    e2_1:  { sheet: 'enemies2', x: 0,   y: 0,   w: 200, h: 220 },
    e2_2:  { sheet: 'enemies2', x: 200, y: 0,   w: 200, h: 220 },
    e2_3:  { sheet: 'enemies2', x: 400, y: 0,   w: 200, h: 220 },
    e2_4:  { sheet: 'enemies2', x: 600, y: 0,   w: 200, h: 220 },
    e2_5:  { sheet: 'enemies2', x: 800, y: 0,   w: 200, h: 220 },
    e2_6:  { sheet: 'enemies2', x: 0,   y: 220, w: 200, h: 220 },
    e2_7:  { sheet: 'enemies2', x: 200, y: 220, w: 200, h: 220 },
    e2_8:  { sheet: 'enemies2', x: 400, y: 220, w: 200, h: 220 },
    e2_9:  { sheet: 'enemies2', x: 600, y: 220, w: 200, h: 220 },
    e2_10: { sheet: 'enemies2', x: 800, y: 220, w: 200, h: 220 },
    e2_11: { sheet: 'enemies2', x: 0,   y: 440, w: 200, h: 220 },
    e2_12: { sheet: 'enemies2', x: 200, y: 440, w: 200, h: 220 },
    e2_13: { sheet: 'enemies2', x: 400, y: 440, w: 200, h: 220 },
    e2_14: { sheet: 'enemies2', x: 600, y: 440, w: 200, h: 220 },
    e2_15: { sheet: 'enemies2', x: 800, y: 440, w: 200, h: 220 },
    e2_16: { sheet: 'enemies2', x: 0,   y: 660, w: 200, h: 220 },
    e2_17: { sheet: 'enemies2', x: 200, y: 660, w: 200, h: 220 },
    e2_18: { sheet: 'enemies2', x: 400, y: 660, w: 200, h: 220 },
    e2_19: { sheet: 'enemies2', x: 600, y: 660, w: 200, h: 220 },
    e2_20: { sheet: 'enemies2', x: 800, y: 660, w: 200, h: 220 },

    ebul_1:  { sheet: 'enemies2', x: 0,   y: 880,  w: 200, h: 120 },
    ebul_2:  { sheet: 'enemies2', x: 200, y: 880,  w: 200, h: 120 },
    ebul_3:  { sheet: 'enemies2', x: 400, y: 880,  w: 200, h: 120 },
    ebul_4:  { sheet: 'enemies2', x: 600, y: 880,  w: 200, h: 120 },
    ebul_5:  { sheet: 'enemies2', x: 800, y: 880,  w: 200, h: 120 },
    ebul_6:  { sheet: 'enemies2', x: 0,   y: 1000, w: 200, h: 120 },
    ebul_7:  { sheet: 'enemies2', x: 200, y: 1000, w: 200, h: 120 },
    ebul_8:  { sheet: 'enemies2', x: 400, y: 1000, w: 200, h: 120 },
    ebul_9:  { sheet: 'enemies2', x: 600, y: 1000, w: 200, h: 120 },
    ebul_10: { sheet: 'enemies2', x: 800, y: 1000, w: 200, h: 120 },

    // 8. 14 Yeni Kademeli Boss (Bölüm 2..15 için boss_1..boss_14, bosses_atlas.png 5x3 grid)
    boss_1:  { sheet: 'bosses2', x: 0,    y: 0,   w: 256, h: 280 },
    boss_2:  { sheet: 'bosses2', x: 256,  y: 0,   w: 256, h: 280 },
    boss_3:  { sheet: 'bosses2', x: 512,  y: 0,   w: 256, h: 280 },
    boss_4:  { sheet: 'bosses2', x: 768,  y: 0,   w: 256, h: 280 },
    boss_5:  { sheet: 'bosses2', x: 1024, y: 0,   w: 256, h: 280 },
    boss_6:  { sheet: 'bosses2', x: 0,    y: 280, w: 256, h: 280 },
    boss_7:  { sheet: 'bosses2', x: 256,  y: 280, w: 256, h: 280 },
    boss_8:  { sheet: 'bosses2', x: 512,  y: 280, w: 256, h: 280 },
    boss_9:  { sheet: 'bosses2', x: 768,  y: 280, w: 256, h: 280 },
    boss_10: { sheet: 'bosses2', x: 1024, y: 280, w: 256, h: 280 },
    boss_11: { sheet: 'bosses2', x: 0,    y: 560, w: 256, h: 280 },
    boss_12: { sheet: 'bosses2', x: 256,  y: 560, w: 256, h: 280 },
    boss_13: { sheet: 'bosses2', x: 512,  y: 560, w: 256, h: 280 },
    boss_14: { sheet: 'bosses2', x: 768,  y: 560, w: 256, h: 280 },

    // 9. Dişli Çerçeveli Popeye Can & Seviye (XP) Bar Sistemi (hud_bar_atlas.png)
    hud_bar_full:  { sheet: 'hudBar', x: 0, y: 0,   w: 1024, h: 382 },
    hud_bar_empty: { sheet: 'hudBar', x: 0, y: 382, w: 1024, h: 382 },

    // 10. 16'lı (4x4) Özel Arayüz İkonları, Butonlar, Panel ve Rozetler (ui_icons_atlas.png)
    icon_pause:          { sheet: 'uiIcons', x: 0,   y: 0,   w: 256, h: 256 },
    icon_sound_on:       { sheet: 'uiIcons', x: 256, y: 0,   w: 256, h: 256 },
    icon_sound_off:      { sheet: 'uiIcons', x: 512, y: 0,   w: 256, h: 256 },
    icon_fullscreen:     { sheet: 'uiIcons', x: 768, y: 0,   w: 256, h: 256 },
    icon_lang:           { sheet: 'uiIcons', x: 0,   y: 256, w: 256, h: 256 },
    icon_video_ad:       { sheet: 'uiIcons', x: 256, y: 256, w: 256, h: 256 },
    icon_restart:        { sheet: 'uiIcons', x: 512, y: 256, w: 256, h: 256 },
    icon_play:           { sheet: 'uiIcons', x: 768, y: 256, w: 256, h: 256 },
    btn_green:           { sheet: 'uiIcons', x: 0,   y: 512, w: 256, h: 256 },
    btn_blue:            { sheet: 'uiIcons', x: 256, y: 512, w: 256, h: 256 },
    btn_gold:            { sheet: 'uiIcons', x: 512, y: 512, w: 256, h: 256 },
    panel_modal:         { sheet: 'uiIcons', x: 768, y: 512, w: 256, h: 256 },
    emblem_gameover:     { sheet: 'uiIcons', x: 0,   y: 768, w: 256, h: 256 },
    emblem_victory:      { sheet: 'uiIcons', x: 256, y: 768, w: 256, h: 256 },
    emblem_boss_warn:    { sheet: 'uiIcons', x: 512, y: 768, w: 256, h: 256 },
    emblem_shield_heart: { sheet: 'uiIcons', x: 768, y: 768, w: 256, h: 256 },

    // 11. 16'lı (4x4)Yeni Ağır Döner Savaş Çapası ve İçinden Güç Çıkan Tekil Ispanak Konserveleri (skill_cans_atlas.png)
    proj_anchor_new:     { sheet: 'skillCans', x: 0,   y: 0,   w: 256, h: 256 },
    can_anchor:          { sheet: 'skillCans', x: 256, y: 0,   w: 256, h: 256 },
    can_multishot:       { sheet: 'skillCans', x: 512, y: 0,   w: 256, h: 256 },
    can_spread:          { sheet: 'skillCans', x: 768, y: 0,   w: 256, h: 256 },
    can_rear:            { sheet: 'skillCans', x: 0,   y: 256, w: 256, h: 256 },
    can_pierce:          { sheet: 'skillCans', x: 256, y: 256, w: 256, h: 256 },
    can_missile:         { sheet: 'skillCans', x: 512, y: 256, w: 256, h: 256 },
    can_laser:           { sheet: 'skillCans', x: 768, y: 256, w: 256, h: 256 },
    can_saw:             { sheet: 'skillCans', x: 0,   y: 512, w: 256, h: 256 },
    can_fire:            { sheet: 'skillCans', x: 256, y: 512, w: 256, h: 256 },
    can_ice:             { sheet: 'skillCans', x: 512, y: 512, w: 256, h: 256 },
    can_acid:            { sheet: 'skillCans', x: 768, y: 512, w: 256, h: 256 },
    can_lightning:       { sheet: 'skillCans', x: 0,   y: 768, w: 256, h: 256 },
    can_crit:            { sheet: 'skillCans', x: 256, y: 768, w: 256, h: 256 },
    can_heal:            { sheet: 'skillCans', x: 512, y: 768, w: 256, h: 256 },
    can_dodge:           { sheet: 'skillCans', x: 768, y: 768, w: 256, h: 256 },

    // 12. 2. Sayfa 16 Benzersiz Ispanak Yetenek Konservesi (skill_cans_atlas2.png)
    can_diagonal:        { sheet: 'skillCans2', x: 0,   y: 0,   w: 256, h: 256 },
    can_side:            { sheet: 'skillCans2', x: 256, y: 0,   w: 256, h: 256 },
    can_burst:           { sheet: 'skillCans2', x: 512, y: 0,   w: 256, h: 256 },
    can_nova:            { sheet: 'skillCans2', x: 768, y: 0,   w: 256, h: 256 },
    can_double_cal:      { sheet: 'skillCans2', x: 0,   y: 256, w: 256, h: 256 },
    can_bouncy:          { sheet: 'skillCans2', x: 256, y: 256, w: 256, h: 256 },
    can_ricochet:        { sheet: 'skillCans2', x: 512, y: 256, w: 256, h: 256 },
    can_homing:          { sheet: 'skillCans2', x: 768, y: 256, w: 256, h: 256 },
    can_shrapnel:        { sheet: 'skillCans2', x: 0,   y: 512, w: 256, h: 256 },
    can_giant:           { sheet: 'skillCans2', x: 256, y: 512, w: 256, h: 256 },
    can_supersonic:      { sheet: 'skillCans2', x: 512, y: 512, w: 256, h: 256 },
    can_knockback:       { sheet: 'skillCans2', x: 768, y: 512, w: 256, h: 256 },
    can_twin_laser:      { sheet: 'skillCans2', x: 0,   y: 768, w: 256, h: 256 },
    can_mega_laser:      { sheet: 'skillCans2', x: 256, y: 768, w: 256, h: 256 },
    can_sonic_wave:      { sheet: 'skillCans2', x: 512, y: 768, w: 256, h: 256 },
    can_barrage:         { sheet: 'skillCans2', x: 768, y: 768, w: 256, h: 256 },

    // 13. 3. Sayfa 17 Benzersiz Ispanak Yetenek Konservesi (skill_cans_atlas3.png)
    can_plasma_nuke:     { sheet: 'skillCans3', x: 0,   y: 0,   w: 256, h: 256 },
    can_storm:           { sheet: 'skillCans3', x: 256, y: 0,   w: 256, h: 256 },
    can_explosive:       { sheet: 'skillCans3', x: 512, y: 0,   w: 256, h: 256 },
    can_headshot:        { sheet: 'skillCans3', x: 768, y: 0,   w: 256, h: 256 },
    can_boss_hunter:     { sheet: 'skillCans3', x: 0,   y: 256, w: 256, h: 256 },
    can_rapid1:          { sheet: 'skillCans3', x: 256, y: 256, w: 256, h: 256 },
    can_rapid2:          { sheet: 'skillCans3', x: 512, y: 256, w: 256, h: 256 },
    can_damage1:         { sheet: 'skillCans3', x: 768, y: 256, w: 256, h: 256 },
    can_crit_dmg:        { sheet: 'skillCans3', x: 0,   y: 512, w: 256, h: 256 },
    can_berserker:       { sheet: 'skillCans3', x: 256, y: 512, w: 256, h: 256 },
    can_wingman:         { sheet: 'skillCans3', x: 512, y: 512, w: 256, h: 256 },
    can_orbital_orbs:    { sheet: 'skillCans3', x: 768, y: 512, w: 256, h: 256 },
    can_max_hp:          { sheet: 'skillCans3', x: 0,   y: 768, w: 256, h: 256 },
    can_vampiric:        { sheet: 'skillCans3', x: 256, y: 768, w: 256, h: 256 },
    can_regen:           { sheet: 'skillCans3', x: 512, y: 768, w: 256, h: 256 },
    can_phantom:         { sheet: 'skillCans3', x: 768, y: 768, w: 256, h: 256 },
    can_xp_overdrive:    { sheet: 'skillCans3', x: 0,   y: 1024,w: 256, h: 256 }
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
        img.decoding = 'async';
        let settled = false;
        const finish = (ok) => {
          if (settled) return;
          settled = true;
          if (ok) this.sheets[key] = img;
          doneCount++;
          if (onProgress) onProgress(doneCount / keys.length);
          resolve();
        };
        img.onload = () => finish(true);
        img.onerror = () => finish(false);
        img.src = this.SHEET_PATHS[key];
      });
    })).then(() => {
      this.loaded = true;
    });
  },

  draw(ctx, frameKey, cx, cy, dw, dh, opts = null) {
    const f = this.FRAMES[frameKey];
    if (!f) return false;
    const img = this.sheets[f.sheet];
    if (!img || !img.complete || !img.naturalWidth) return false;

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
    return true;
  }
};
