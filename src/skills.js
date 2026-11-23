// Archero Tarzı 50 Çeşit Yetenek (Skill), Özel Silah ve Yörünge Sistemi
window.SkillSystem = {
  // 50 Farklı Yetenek Tanımı
  SKILLS: [
    // --- 1..8: ATIŞ SAYISI VE YÖNÜ ---
    {
      id: 'front_shot', can: 'can_2x', badge: 'bullet_player', color: '#57e2ff', max: 5,
      tr: { name: 'ÖN EKSTRA NAMLU', tag: 'ÇOKLU ATIŞ', desc: 'İleriye +1 paralel mermi şeridi ekler ve silah kademesini yükseltir.' },
      en: { name: 'FRONT EXTRA BARREL', tag: 'MULTI-SHOT', desc: 'Adds +1 forward parallel bullet stream and upgrades weapon tier.' }
    },
    {
      id: 'diagonal_shot', can: 'can_3x', badge: 'bullet_player', color: '#57e2ff', max: 4,
      tr: { name: 'ÇAPRAZ YAYLIM', tag: 'ÇOKLU ATIŞ', desc: 'Sağ ve sol 22° çapraz açılara +2 keskin mermi hattı ekler.' },
      en: { name: 'DIAGONAL VOLLEY', tag: 'MULTI-SHOT', desc: 'Adds +2 angled streams firing at 22° left and right.' }
    },
    {
      id: 'side_shot', can: 'can_4x', badge: 'bullet_player', color: '#ffa834', max: 3,
      tr: { name: 'YAN KANAT TOPLARI', tag: 'ÇOKLU ATIŞ', desc: 'Sağ ve sol 60° yan kanatlara +2 koruyucu atış hattı ekler.' },
      en: { name: 'SIDE WING CANNONS', tag: 'MULTI-SHOT', desc: 'Fires +2 side streams at 60° from both wings.' }
    },
    {
      id: 'rear_shot', can: 'can_2x', badge: 'bullet_super', color: '#70f0ff', max: 2,
      tr: { name: 'ARKA KUYRUK TOPU', tag: 'ÇOKLU ATIŞ', desc: 'Kuyruktan geriye doğru koruyucu plazma mermisi ateşler.' },
      en: { name: 'REAR TAIL CANNON', tag: 'MULTI-SHOT', desc: 'Fires protective plasma shots backward from the tail.' }
    },
    {
      id: 'multishot_burst', can: 'can_6x', badge: 'bullet_super', color: '#ff4d6d', max: 3,
      tr: { name: 'SERİ İKİLİ YAYLIM', tag: 'ARCHERO ÖZEL', desc: 'Her atışta peş peşe ekstra bir mermi dalgası daha ateşler!' },
      en: { name: 'MULTISHOT BURST', tag: 'ARCHERO PERK', desc: 'Fires an immediate second wave of bullets with every shot!' }
    },
    {
      id: 'fan_spread', can: 'can_3x', badge: 'bullet_super', color: '#57e2ff', max: 4,
      tr: { name: 'GENİŞ YELPAZE BARAJI', tag: 'ÇOKLU ATIŞ', desc: 'Ön yaylıma geniş açılı +2 yelpaze mermisi daha ekler.' },
      en: { name: 'WIDE FAN BARRAGE', tag: 'MULTI-SHOT', desc: 'Adds +2 wide-angle fan projectiles to main volley.' }
    },
    {
      id: 'omni_nova_ring', can: 'can_skill_gold', badge: 'proj_wave', color: '#ffe047', max: 4,
      tr: { name: '360° YILDIZ HALKASI', tag: 'ALAN SALDIRISI', desc: 'Her 2.4 sn\'de uçağın etrafına 10 yönde plazma halkası saçar.' },
      en: { name: '360° NOVA RING', tag: 'AREA BLAST', desc: 'Emits a 10-way radial ring of plasma bolts every 2.4s.' }
    },
    {
      id: 'double_caliber_step', can: 'can_6x', badge: 'can_6x', color: '#ff4d6d', max: 3,
      tr: { name: 'ÇİFTE NAMLU EVRİMİ', tag: 'SİLAH EVRİMİ', desc: 'Ana silah merdivenini tek seferde +2 kademe birden yükseltir!' },
      en: { name: 'TWIN BARREL EVOLUTION', tag: 'EVOLUTION', desc: 'Advances main weapon ladder by +2 tiers instantly!' }
    },

    // --- 9..16: MERMİ FİZİĞİ (DELİCİ, SEKEN, GÜDÜMLÜ, ŞARAPNEL) ---
    {
      id: 'piercing_shot', can: 'can_skill_purple', badge: 'proj_laser', color: '#d580ff', max: 4,
      tr: { name: 'İÇİNDEN GEÇEN ATIŞ', tag: 'DELİCİ FİZİK', desc: 'Mermiler düşmanların içinden delip geçer ve arkadakileri de vurur!' },
      en: { name: 'PIERCING SHOTS', tag: 'PIERCE', desc: 'Bullets pierce directly through enemies to hit targets behind!' }
    },
    {
      id: 'bouncy_walls', can: 'can_skill_purple', badge: 'spark_crit', color: '#70f0ff', max: 3,
      tr: { name: 'DUVARDAN SEKEN MERMİ', tag: 'SEKME FİZİĞİ', desc: 'Mermiler ekranın sağ ve sol duvarlarından sekerek geri döner!' },
      en: { name: 'BOUNCY WALLS', tag: 'BOUNCE', desc: 'Projectiles bounce off the left and right screen edges!' }
    },
    {
      id: 'ricochet_shot', can: 'can_skill_red', badge: 'proj_lightning', color: '#ffe047', max: 4,
      tr: { name: 'ZİNCİRLEME SEKME', tag: 'RICOCHET', desc: 'Düşmana çarpan mermi yakındaki başka bir düşmana doğru seker!' },
      en: { name: 'RICOCHET ROUNDS', tag: 'RICOCHET', desc: 'Bullets bounce from hit enemies directly toward nearby foes!' }
    },
    {
      id: 'homing_bullets', can: 'can_skill_purple', badge: 'proj_missile', color: '#ff70a6', max: 4,
      tr: { name: 'GÜDÜMLÜ MERMİLER', tag: 'AKILLI ATIŞ', desc: 'Mermiler havada en yakın düşmana doğru kavis çizerek yönelir.' },
      en: { name: 'HOMING ROUNDS', tag: 'SMART AIM', desc: 'Bullets curve in mid-air to track the nearest enemy ship.' }
    },
    {
      id: 'split_shrapnel', can: 'can_skill_red', badge: 'spark_small', color: '#ffa834', max: 4,
      tr: { name: 'ŞARAPNEL BÖLÜNMESİ', tag: 'PARÇALANMA', desc: 'Düşmana isabet eden mermiler etrafa 3 küçük şarapnel saçar.' },
      en: { name: 'CLUSTER SHRAPNEL', tag: 'SPLITTER', desc: 'Bullets burst into 3 secondary shrapnel bolts on impact.' }
    },
    {
      id: 'giant_bullets', can: 'can_skill_red', badge: 'bullet_super', color: '#ff6b5b', max: 4,
      tr: { name: 'DEV KALİBRE MERMİ', tag: 'AĞIR MÜHİMMAT', desc: 'Mermi boyutunu %35 ve vuruş hasarını +%20 büyütür.' },
      en: { name: 'GIANT CALIBER', tag: 'HEAVY AMMO', desc: 'Increases projectile size by 35% and impact damage by +20%.' }
    },
    {
      id: 'bullet_speed_up', can: 'can_4x', badge: 'thruster_blue', color: '#57e2ff', max: 4,
      tr: { name: 'SÜPERSONİK NAMLU', tag: 'HIZ & MENZİL', desc: 'Mermi uçuş hızını %40 ve delme hasarını +%15 artırır.' },
      en: { name: 'SUPERSONIC VELOCITY', tag: 'VELOCITY', desc: 'Increases projectile flight speed by 40% and damage by +15%.' }
    },
    {
      id: 'knockback_impact', can: 'can_skill_red', badge: 'proj_wave', color: '#ffa834', max: 3,
      tr: { name: 'SARSICI İTME GÜCÜ', tag: 'KONTROL', desc: 'Mermiler yaklaşan düşmanları geriye doğru iter ve+%15 hasar verir.' },
      en: { name: 'HEAVY KNOCKBACK', tag: 'IMPACT', desc: 'Shots push advancing enemy ships backward and deal +15% damage.' }
    },

    // --- 17..26: ÖZEL SİLAHLAR (LAZER, FÜZE, TESTERE, BUMERANG ÇAPA, SONİK DALGA) ---
    {
      id: 'laser_beam', can: 'can_skill_purple', badge: 'proj_laser', color: '#00f2ff', max: 5,
      tr: { name: 'MERKEZ LAZER IŞINI', tag: 'LAZER SİLAHI', desc: 'Uçağın burnundan ekranı boydan boya kesen yakıcı lazer ışını çıkarır!' },
      en: { name: 'HYPER LASER BEAM', tag: 'LASER WEAPON', desc: 'Fires a continuous piercing laser beam straight across the screen!' }
    },
    {
      id: 'twin_laser', can: 'can_skill_purple', badge: 'proj_laser', color: '#b86bff', max: 4,
      tr: { name: 'ÇİFT KANAT LAZERİ', tag: 'LAZER SİLAHI', desc: 'Sağ ve sol kanatlardan ikili sürekli kesici lazer ışını ateşler!' },
      en: { name: 'TWIN WING LASERS', tag: 'LASER WEAPON', desc: 'Projects dual continuous cutting laser beams from both wings!' }
    },
    {
      id: 'laser_overcharge', can: 'can_skill_gold', badge: 'proj_laser', color: '#ffe047', max: 4,
      tr: { name: 'MEGA LAZER REAKTÖRÜ', tag: 'LAZER GÜCÜ', desc: 'Lazer ışınlarının kalınlığını ve yakma hasarını +%50 artırır (yoksa lazer açar).' },
      en: { name: 'MEGA LASER CORE', tag: 'LASER POWER', desc: 'Boosts laser beam width and burn damage by +50% (or unlocks laser).' }
    },
    {
      id: 'homing_missiles', can: 'can_skill_red', badge: 'proj_missile', color: '#ff5252', max: 5,
      tr: { name: 'GÜDÜMLÜ FÜZE BATARYASI', tag: 'FÜZE SİSTEMİ', desc: 'En yakın düşmanı kovalayıp patlayan güdümlü mikro füzeler fırlatır!' },
      en: { name: 'HOMING MISSILE PODS', tag: 'MISSILE TECH', desc: 'Launches heat-seeking micro-missiles that hunt down enemies!' }
    },
    {
      id: 'sawblade_disc', can: 'can_skill_red', badge: 'proj_sawblade', color: '#a8e6ff', max: 5,
      tr: { name: 'DÖNER TESTERE DİSK', tag: 'DELİCİ SİLAH', desc: 'Düşmanların içinden geçerek biçen çelik testere diskleri fırlatır!' },
      en: { name: 'BUZZSAW LAUNCHER', tag: 'SLICER WEAPON', desc: 'Fires spinning serrated buzzsaw discs that slice through enemies!' }
    },
    {
      id: 'boomerang_anchor', can: 'can_skill_gold', badge: 'proj_anchor', color: '#ffd147', max: 5,
      tr: { name: 'BUMERANG SAVAŞ ÇAPASI', tag: 'BUMERANG', desc: 'İleri gidip uçağa geri dönen ve yolundaki her şeyi iki kez biçen dev çapa!' },
      en: { name: 'BOOMERANG ANCHOR', tag: 'BOOMERANG', desc: 'Hurls a giant battle anchor that flies out and returns through foes!' }
    },
    {
      id: 'sonic_wave', can: 'can_skill_purple', badge: 'proj_wave', color: '#d580ff', max: 5,
      tr: { name: 'SONİK HİLAL DALGASI', tag: 'DALGA SİLAHI', desc: 'Genişleyerek ilerleyen ve tüm hattı süpüren dev enerji hilali atar!' },
      en: { name: 'SONIC CRESCENT WAVE', tag: 'WAVE WEAPON', desc: 'Unleashes expanding energy crescent waves that sweep the lane!' }
    },
    {
      id: 'spinach_barrage', can: 'can_bomb', badge: 'proj_missile', color: '#ffe047', max: 4,
      tr: { name: 'ISPANAK ROKET YAĞMURU', tag: 'AĞIR DESTEK', desc: 'Her 3.5 sn\'de ekranı döven 5\'li güdümlü roket salvosu ateşler!' },
      en: { name: 'SPINACH ROCKET SALVO', tag: 'ARTILLERY', desc: 'Launches a 5-missile artillery barrage every 3.5 seconds!' }
    },
    {
      id: 'auto_shoulder_cannon', can: 'can_skill_red', badge: 'orb_drone', color: '#57e2ff', max: 4,
      tr: { name: 'OTONOM OMUZ TARETİ', tag: 'OTOMATİK TOP', desc: 'En yakın hedefe kendi başına nişan alıp seri ateş eden taret ekler.' },
      en: { name: 'AUTO SHOULDER TURRET', tag: 'AUTO TURRET', desc: 'Mounts an autonomous turret that locks onto the closest target.' }
    },
    {
      id: 'plasma_nuke_cannon', can: 'can_skill_gold', badge: 'exp_2', color: '#ff8533', max: 4,
      tr: { name: 'AĞIR PLAZMA TOPU', tag: 'AĞIR SİLAH', desc: 'Her 1.8 sn\'de çarptığı yerde büyük alan patlaması yapan plazma güllesi atar.' },
      en: { name: 'HEAVY PLASMA MORTAR', tag: 'HEAVY CANNON', desc: 'Fires a massive explosive plasma shell every 1.8 seconds.' }
    },

    // --- 27..34: ELEMENTLER VE VURUŞ ETKİLERİ (ATEŞ, BUZ, ASİT, YILDIRIM, PATLAMA) ---
    {
      id: 'fire_rounds', can: 'can_skill_red', badge: 'proj_fireball', color: '#ff6333', max: 4,
      tr: { name: 'EJDER ATEŞİ (NAPALM)', tag: 'ATEŞ ELEMENTİ', desc: 'Mermileri alev topuna çevirir; düşmanları tutuşturup 3 sn boyunca yakar!' },
      en: { name: 'DRAGON NAPALM SHOTS', tag: 'FIRE ELEMENT', desc: 'Ignites enemies on hit, burning them for heavy damage over 3s!' }
    },
    {
      id: 'ice_rounds', can: 'can_3x', badge: 'proj_ice', color: '#5ce1ff', max: 4,
      tr: { name: 'BUZUL DONDURUCU ATIŞ', tag: 'BUZ ELEMENTİ', desc: 'Mermileri buz kristaline çevirir; düşmanları ve ateşlerini %40 yavaşlatır!' },
      en: { name: 'FROST CRYO SHARDS', tag: 'ICE ELEMENT', desc: 'Chills enemies on hit, slowing their movement and fire rate by 40%!' }
    },
    {
      id: 'acid_rounds', can: 'can_hp', badge: 'proj_acid', color: '#7dff4d', max: 4,
      tr: { name: 'KOROZİF ASİT MERMİSİ', tag: 'ASİT ELEMENTİ', desc: 'Zehirli ıspanak asidi düşman zırhını eritir ve +%25 ekstra hasar verir!' },
      en: { name: 'VENOM ACID ROUNDS', tag: 'ACID ELEMENT', desc: 'Corrosive spinach acid melts enemy armor for +25% bonus damage!' }
    },
    {
      id: 'chain_lightning', can: 'can_skill_purple', badge: 'proj_lightning', color: '#ffe84d', max: 5,
      tr: { name: 'ZİNCİRLEME YILDIRIM', tag: 'ELEKTRİK', desc: 'Mermi isabetlerinde düşmandan düşmana sıçrayan elektrik arkı çakar!' },
      en: { name: 'CHAIN LIGHTNING', tag: 'ELECTRIC', desc: 'Shots unleash high-voltage lightning arcs jumping between enemies!' }
    },
    {
      id: 'lightning_storm', can: 'can_skill_gold', badge: 'proj_lightning', color: '#70f0ff', max: 4,
      tr: { name: 'YILDIRIM FIRTINASI', tag: 'GÖKYÜZÜ GÜCÜ', desc: 'Her 2.0 sn\'de ekrandaki düşmanların tepesine doğrudan yıldırım indirir!' },
      en: { name: 'THUNDERSTORM CALL', tag: 'STORM POWER', desc: 'Strikes random enemies on screen with sky lightning every 2.0s!' }
    },
    {
      id: 'explosive_shots', can: 'can_skill_red', badge: 'exp_1', color: '#ff9433', max: 4,
      tr: { name: 'PATLAYICI ÇEKİRDEK', tag: 'ALAN HASARI', desc: 'Her mermi isabetinde çevredeki düşmanları da sarsan patlama oluşturur!' },
      en: { name: 'EXPLOSIVE ROUNDS', tag: 'BLAST CORE', desc: 'Bullets detonate on impact, dealing splash damage to nearby enemies!' }
    },
    {
      id: 'headshot_kill', can: 'can_skill_gold', badge: 'spark_crit', color: '#ff4d6d', max: 3,
      tr: { name: 'İNFAZCI (HEADSHOT)', tag: 'ANINDA İNFAZ', desc: 'Canı %20\'nin altına düşen normal düşmanları anında infaz eder!' },
      en: { name: 'EXECUTIONER HEADSHOT', tag: 'INSTANT KILL', desc: 'Instantly executes non-boss enemies below 20% health!' }
    },
    {
      id: 'boss_hunter', can: 'can_skill_red', badge: 'proj_anchor', color: '#ff5252', max: 4,
      tr: { name: 'DRETNOT AVCISI', tag: 'BOSS HASARI', desc: 'Dev Boss\'lara ve Elit kruvazörlere karşı +%35 ekstra yıkıcı hasar verir!' },
      en: { name: 'DREADNOUGHT SLAYER', tag: 'BOSS DAMAGE', desc: 'Deals +35% bonus damage against Bosses and Elite Cruisers!' }
    },

    // --- 35..42: HIZ, HASAR, KRİTİK VE YÖRÜNGE BİRİMLERİ ---
    {
      id: 'rapid_fire_1', can: 'can_4x', badge: 'bullet_player', color: '#ffa834', max: 5,
      tr: { name: 'HIZLI ATIŞ: TURBO TETİK', tag: 'ATIŞ HIZI', desc: 'Tüm silahların ve yardımcı uçakların ateş etme hızını +%22 artırır!' },
      en: { name: 'RAPID FIRE: TURBO', tag: 'ATTACK SPEED', desc: 'Increases fire rate of all weapons and wingmen by +22%!' }
    },
    {
      id: 'rapid_fire_2', can: 'can_6x', badge: 'thruster_blue', color: '#ff6333', max: 4,
      tr: { name: 'HİPER GATLİNG NAMLU', tag: 'ATIŞ HIZI', desc: 'Ateş etme hızını +%28 artırır ve namlu soğumasını hızlandırır!' },
      en: { name: 'HYPER GATLING BARREL', tag: 'ATTACK SPEED', desc: 'Boosts overall attack speed by an additional +28%!' }
    },
    {
      id: 'damage_up_1', can: 'can_skill_red', badge: 'bullet_super', color: '#ff4d6d', max: 5,
      tr: { name: 'SAF ATEŞ GÜCÜ', tag: 'HASAR ARTIŞI', desc: 'Tüm mermi, lazer ve özel silahların hasarını +%25 artırır!' },
      en: { name: 'RAW FIREPOWER', tag: 'DAMAGE UP', desc: 'Increases damage of all bullets, lasers, and special weapons by +25%!' }
    },
    {
      id: 'crit_chance', can: 'can_skill_gold', badge: 'spark_crit', color: '#ffe047', max: 4,
      tr: { name: 'KRİTİK NİŞANGÂH', tag: 'KRİTİK ŞANS', desc: '+%18 Kritik Vuruş şansı kazandırır (Kritik vuruşlar 2.2x hasar verir)!' },
      en: { name: 'CRITICAL TARGETING', tag: 'CRIT CHANCE', desc: 'Grants +18% Critical Hit chance (Crits deal 2.2x damage)!' }
    },
    {
      id: 'crit_damage', can: 'can_skill_gold', badge: 'exp_1', color: '#ffb833', max: 4,
      tr: { name: 'YIKICI KRİTİK DARBE', tag: 'KRİTİK HASAR', desc: 'Kritik hasar çarpanını +0.7x artırır ve +%10 kritik şans ekler!' },
      en: { name: 'DEVASTATING CRITS', tag: 'CRIT DAMAGE', desc: 'Increases Critical Damage multiplier by +0.7x and Crit Chance by +10%!' }
    },
    {
      id: 'berserker_rage', can: 'can_skill_red', badge: 'hud_heart', color: '#ff3b3b', max: 3,
      tr: { name: 'TEMEL REİS ÖFKESİ', tag: 'ÖFKE MODU', desc: 'Eksik can oranına göre hasarını ve ateş hızını +%65\'e kadar artırır!' },
      en: { name: 'SAILOR BERSERK FURY', tag: 'BERSERKER', desc: 'Increases damage and fire rate up to +65% based on missing HP!' }
    },
    {
      id: 'wingman_add', can: 'can_wingman', badge: 'wingman', color: '#70f0ff', max: 4,
      tr: { name: 'YARDIMCI UÇAK FİLOSU', tag: 'YARDIMCI BİRİM', desc: '+1 Wingman yardımcı uçak ekler ve tüm yardımcı uçak hasarını +%25 artırır!' },
      en: { name: 'WINGMAN SQUADRON', tag: 'COMPANION', desc: 'Adds +1 Wingman drone and boosts all wingman damage by +25%!' }
    },
    {
      id: 'orbital_orbs', can: 'can_shield', badge: 'orb_drone', color: '#57ffda', max: 4,
      tr: { name: 'YÖRÜNGE KALKAN KÜRELERİ', tag: 'YÖRÜNGE KORUMA', desc: 'Uçağın etrafında dönerek düşman mermilerini silen +2 enerji küresi ekler!' },
      en: { name: 'ORBITAL SHIELD ORBS', tag: 'ORBITAL GUARD', desc: 'Spawns +2 orbiting energy spheres that block enemy bullets & ram foes!' }
    },
    {
      id: 'orbital_anchors', can: 'can_skill_gold', badge: 'proj_anchor', color: '#ffd147', max: 4,
      tr: { name: 'DÖNER ÇAPA TESTERESİ', tag: 'YÖRÜNGE SİLAHI', desc: 'Uçağın çevresinde hızla dönüp yaklaşan düşmanları doğrayan +2 dev çapa!' },
      en: { name: 'ORBITING BATTLE ANCHORS', tag: 'ORBITAL BLADE', desc: 'Spawns +2 spinning battle anchors orbiting your jet to shred enemies!' }
    },

    // --- 44..50: SAVUNMA, CAN, VAMPİRİK ONARIM VE XP ---
    {
      id: 'max_hp_boost', can: 'can_hp', badge: 'hud_heart', color: '#6dff5c', max: 5,
      tr: { name: 'ÇELİK GÖVDE & CAN', tag: 'MAKSİMUM CAN', desc: 'Maksimum Canı +35 artırır ve anında +40 Can iyileştirir!' },
      en: { name: 'IRON HULL & VITALITY', tag: 'MAX HEALTH', desc: 'Increases Max HP by +35 and immediately restores +40 HP!' }
    },
    {
      id: 'full_feast_heal', can: 'can_hp', badge: 'shield_ring', color: '#5fd82b', max: 5,
      tr: { name: 'ÇİFTE ISPANAK ZİYAFETİ', tag: 'TAM ONARIM', desc: 'Canı anında +70 doldurur ve 5 saniyelik enerji kalkanı açar!' },
      en: { name: 'SPINACH POWER FEAST', tag: 'HEAL & SHIELD', desc: 'Restores +70 HP instantly and activates a 5-second Energy Shield!' }
    },
    {
      id: 'vampiric_leech', can: 'can_skill_purple', badge: 'hud_heart', color: '#ff5277', max: 4,
      tr: { name: 'VAMPİRİK GÖVDE ONARIMI', tag: 'CAN ÇALMA', desc: 'Yok ettiğin her düşman uçağının canını otomatik olarak yeniler!' },
      en: { name: 'VAMPIRIC LEECH REPAIR', tag: 'LIFESTEAL', desc: 'Every enemy destroyed restores HP to your fighter!' }
    },
    {
      id: 'hull_regen', can: 'can_hp', badge: 'can_hp', color: '#7dff4d', max: 4,
      tr: { name: 'OTOMATİK TAMİR BOTLARI', tag: 'SÜREKLİ ONARIM', desc: 'Uçak gövdesini saniyede sürekli olarak kendiliğinden onarır!' },
      en: { name: 'NANO REPAIR DRONES', tag: 'HP REGEN', desc: 'Continuously regenerates fighter hull HP every second!' }
    },
    {
      id: 'dodge_cloak', can: 'can_shield', badge: 'wingman', color: '#70f0ff', max: 3,
      tr: { name: 'HAYALET MANEVRA (DODGE)', tag: 'SIYRILMA', desc: 'Gelen mermilerden +%16 ihtimalle "SIYRILDI!" diyerek hiç hasar almaz!' },
      en: { name: 'PHANTOM EVASION', tag: 'DODGE MATRIX', desc: 'Grants +16% Dodge chance to completely evade incoming hits!' }
    },
    {
      id: 'periodic_shield', can: 'can_shield', badge: 'shield_ring', color: '#57ffda', max: 4,
      tr: { name: 'PERİYODİK ENERJİ KALKANI', tag: 'OTOMATİK KALKAN', desc: 'Her 11 saniyede bir otomatik olarak 3.5 sn koruyucu enerji kalkanı açar!' },
      en: { name: 'AUTO PHASE BARRIER', tag: 'AUTO SHIELD', desc: 'Automatically deploys a 3.5s energy shield every 11 seconds!' }
    },
    {
      id: 'xp_overdrive', can: 'can_skill_gold', badge: 'xp_gem', color: '#57ffda', max: 4,
      tr: { name: 'KOMUTAN BİLGELİĞİ (XP+)', tag: 'HIZLI SEVİYE', desc: 'Kazanılan XP miktarını +%35 artırır ve tüm silah hasarını +%15 güçlendirir!' },
      en: { name: 'COMMANDER WISDOM (XP+)', tag: 'FAST LEVEL', desc: 'Boosts all XP gained by +35% and increases weapon damage by +15%!' }
    }
  ],

  getSkillById(id) {
    for (let i = 0; i < this.SKILLS.length; i++) {
      if (this.SKILLS[i].id === id) return this.SKILLS[i];
    }
    return null;
  },

  // Seviye atlandığında oyuncuya sunulacak 3 farklı (henüz maksimuma ulaşmamış) ıspanak kutusu seçer
  rollThreeChoices(player) {
    const available = [];
    for (let i = 0; i < this.SKILLS.length; i++) {
      const sk = this.SKILLS[i];
      const cur = (player.skills && player.skills[sk.id]) || 0;
      if (cur < sk.max) {
        available.push(sk);
      }
    }

    // Karıştır ve ilk 3'ü seç
    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = available[i];
      available[i] = available[j];
      available[j] = tmp;
    }

    const picked = available.slice(0, 3);
    while (picked.length < 3) {
      picked.push(this.SKILLS[picked.length % this.SKILLS.length]);
    }
    return picked;
  },

  // Seçilen yeteneği oyuncuya uygular
  applySkill(player, skillId) {
    if (!player.skills) player.skills = {};
    player.skills[skillId] = (player.skills[skillId] || 0) + 1;
    const lvl = player.skills[skillId];
    const cfg = window.GAME_CONFIG;
    const maxWep = cfg.WEAPON_LADDER.length - 1;

    switch (skillId) {
      case 'front_shot':
        if (player.weaponLevel < maxWep) player.weaponLevel++;
        else player.powerBonus += 0.20;
        break;

      case 'double_caliber_step':
        player.weaponLevel = Math.min(maxWep, player.weaponLevel + 2);
        player.powerBonus += 0.15;
        break;

      case 'rapid_fire_1':
        player.bonusFireRate += 0.22;
        break;

      case 'rapid_fire_2':
        player.bonusFireRate += 0.28;
        break;

      case 'damage_up_1':
        player.powerBonus += 0.25;
        break;

      case 'crit_chance':
        player.critChance = Math.min(0.75, player.critChance + 0.18);
        break;

      case 'crit_damage':
        player.critChance = Math.min(0.75, player.critChance + 0.10);
        player.critMult += 0.70;
        break;

      case 'wingman_add':
        player.addWingmen();
        player.wingBonus += 0.25;
        break;

      case 'max_hp_boost':
        player.maxHp += 35;
        player.hp = Math.min(player.maxHp, player.hp + 40);
        break;

      case 'full_feast_heal':
        player.hp = Math.min(player.maxHp, player.hp + 70);
        player.shieldTimer = Math.max(player.shieldTimer, 5.0);
        break;

      case 'laser_overcharge':
        if (!player.skills.laser_beam && !player.skills.twin_laser) {
          player.skills.laser_beam = 1;
        }
        break;

      case 'periodic_shield':
        player.shieldTimer = Math.max(player.shieldTimer, 3.5);
        break;

      case 'xp_overdrive':
        player.powerBonus += 0.15;
        break;
    }

    return lvl;
  }
};
