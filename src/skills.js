// 48 Benzersiz Yetenek Sistemi: Her Yetenek %100 Kendine Özel Ispanak Konservesi Görseline Sahiptir (rear_shot kaldırıldı)
window.SkillSystem = {
  SKILLS: [
    // --- 1..7: ATIŞ SAYISI VE YÖNÜ ---
    {
      id: 'front_shot', can: 'can_multishot', color: '#57e2ff', max: 1,
      tr: { name: 'ÖN EKSTRA NAMLU', tag: 'ÇOKLU ATIŞ', desc: 'İleriye +1 paralel mermi şeridi ekler ve silah kademesini yükseltir.' },
      en: { name: 'FRONT EXTRA BARREL', tag: 'MULTI-SHOT', desc: 'Adds +1 forward parallel bullet stream and upgrades weapon tier.' }
    },
    {
      id: 'diagonal_shot', can: 'can_diagonal', color: '#57e2ff', max: 1,
      tr: { name: 'ÇAPRAZ YAYLIM', tag: 'ÇOKLU ATIŞ', desc: 'Sağ ve sol 22° çapraz açılara +2 keskin mermi hattı ekler.' },
      en: { name: 'DIAGONAL VOLLEY', tag: 'MULTI-SHOT', desc: 'Adds +2 angled streams firing at 22° left and right.' }
    },
    {
      id: 'side_shot', can: 'can_side', color: '#ffa834', max: 1,
      tr: { name: 'YAN KANAT TOPLARI', tag: 'ÇOKLU ATIŞ', desc: 'Sağ ve sol 60° yan kanatlara +2 koruyucu atış hattı ekler.' },
      en: { name: 'SIDE WING CANNONS', tag: 'MULTI-SHOT', desc: 'Fires +2 side streams at 60° from both wings.' }
    },
    {
      id: 'multishot_burst', can: 'can_burst', color: '#ff4d6d', max: 1,
      tr: { name: 'SERİ İKİLİ YAYLIM', tag: 'ARCHERO ÖZEL', desc: 'Her atışta peş peşe ekstra bir mermi dalgası daha ateşler!' },
      en: { name: 'MULTISHOT BURST', tag: 'ARCHERO PERK', desc: 'Fires an immediate second wave of bullets with every shot!' }
    },
    {
      id: 'fan_spread', can: 'can_spread', color: '#57e2ff', max: 1,
      tr: { name: 'GENİŞ YELPAZE BARAJI', tag: 'ÇOKLU ATIŞ', desc: 'Ön yaylıma geniş açılı +2 yelpaze mermisi daha ekler.' },
      en: { name: 'WIDE FAN BARRAGE', tag: 'MULTI-SHOT', desc: 'Adds +2 wide-angle fan projectiles to main volley.' }
    },
    {
      id: 'omni_nova_ring', can: 'can_nova', color: '#ffe047', max: 1,
      tr: { name: '360° YILDIZ HALKASI', tag: 'ALAN SALDIRISI', desc: 'Her 2.2 sn\'de uçağın etrafına 10 yönde plazma halkası saçar.' },
      en: { name: '360° NOVA RING', tag: 'AREA BLAST', desc: 'Emits a 10-way radial ring of plasma bolts every 2.2s.' }
    },
    {
      id: 'double_caliber_step', can: 'can_double_cal', color: '#ff4d6d', max: 1,
      tr: { name: 'ÇİFTE NAMLU EVRİMİ', tag: 'SİLAH EVRİMİ', desc: 'Ana silah merdivenini tek seferde +2 kademe birden yükseltir!' },
      en: { name: 'TWIN BARREL EVOLUTION', tag: 'EVOLUTION', desc: 'Advances main weapon ladder by +2 tiers instantly!' }
    },

    // --- 8..15: MERMİ FİZİĞİ (DELİCİ, SEKEN, GÜDÜMLÜ, ŞARAPNEL) ---
    {
      id: 'piercing_shot', can: 'can_pierce', color: '#d580ff', max: 1,
      tr: { name: 'İÇİNDEN GEÇEN ATIŞ', tag: 'DELİCİ FİZİK', desc: 'Mermiler düşmanların içinden delip geçer ve arkadakileri de vurur!' },
      en: { name: 'PIERCING SHOTS', tag: 'PIERCE', desc: 'Bullets pierce directly through enemies to hit targets behind!' }
    },
    {
      id: 'bouncy_walls', can: 'can_bouncy', color: '#70f0ff', max: 1,
      tr: { name: 'DUVARDAN SEKEN MERMİ', tag: 'SEKME FİZİĞİ', desc: 'Mermiler ekranın sağ ve sol duvarlarından sekerek geri döner!' },
      en: { name: 'BOUNCY WALLS', tag: 'BOUNCE', desc: 'Projectiles bounce off the left and right screen edges!' }
    },
    {
      id: 'ricochet_shot', can: 'can_ricochet', color: '#ffe047', max: 1,
      tr: { name: 'ZİNCİRLEME SEKME', tag: 'RICOCHET', desc: 'Düşmana çarpan mermi yakındaki başka bir düşmana doğru seker!' },
      en: { name: 'RICOCHET ROUNDS', tag: 'RICOCHET', desc: 'Bullets bounce from hit enemies directly toward nearby foes!' }
    },
    {
      id: 'homing_bullets', can: 'can_homing', color: '#ff70a6', max: 1,
      tr: { name: 'GÜDÜMLÜ MERMİLER', tag: 'AKILLI ATIŞ', desc: 'Mermiler havada en yakın düşmana doğru kavis çizerek yönelir.' },
      en: { name: 'HOMING ROUNDS', tag: 'SMART AIM', desc: 'Bullets curve in mid-air to track the nearest enemy ship.' }
    },
    {
      id: 'split_shrapnel', can: 'can_shrapnel', color: '#ffa834', max: 1,
      tr: { name: 'ŞARAPNEL BÖLÜNMESİ', tag: 'PARÇALANMA', desc: 'Düşmana isabet eden mermiler etrafa 3 küçük şarapnel saçar.' },
      en: { name: 'CLUSTER SHRAPNEL', tag: 'SPLITTER', desc: 'Bullets burst into 3 secondary shrapnel bolts on impact.' }
    },
    {
      id: 'giant_bullets', can: 'can_giant', color: '#ff6b5b', max: 1,
      tr: { name: 'DEV KALİBRE MERMİ', tag: 'AĞIR MÜHİMMAT', desc: 'Mermi boyutunu %35 ve vuruş hasarını +%25 büyütür.' },
      en: { name: 'GIANT CALIBER', tag: 'HEAVY AMMO', desc: 'Increases projectile size by 35% and impact damage by +25%.' }
    },
    {
      id: 'bullet_speed_up', can: 'can_supersonic', color: '#57e2ff', max: 1,
      tr: { name: 'SÜPERSONİK NAMLU', tag: 'HIZ & MENZİL', desc: 'Mermi uçuş hızını %40 ve delme hasarını +%20 artırır.' },
      en: { name: 'SUPERSONIC VELOCITY', tag: 'VELOCITY', desc: 'Increases projectile flight speed by 40% and damage by +20%.' }
    },
    {
      id: 'knockback_impact', can: 'can_knockback', color: '#ffa834', max: 1,
      tr: { name: 'SARSICI İTME GÜCÜ', tag: 'KONTROL', desc: 'Mermiler yaklaşan düşmanları geriye doğru iter ve +%20 hasar verir.' },
      en: { name: 'HEAVY KNOCKBACK', tag: 'IMPACT', desc: 'Shots push advancing enemy ships backward and deal +20% damage.' }
    },

    // --- 16..24: ÖZEL SİLAHLAR ---
    {
      id: 'laser_beam', can: 'can_laser', color: '#00f2ff', max: 1,
      tr: { name: 'MERKEZ LAZER IŞINI', tag: 'LAZER SİLAHI', desc: 'Uçağın burnundan ekranı boydan boya kesen yakıcı lazer ışını çıkarır!' },
      en: { name: 'HYPER LASER BEAM', tag: 'LASER WEAPON', desc: 'Fires a continuous piercing laser beam straight across the screen!' }
    },
    {
      id: 'twin_laser', can: 'can_twin_laser', color: '#b86bff', max: 1,
      tr: { name: 'ÇİFT KANAT LAZERİ', tag: 'LAZER SİLAHI', desc: 'Sağ ve sol kanatlardan ikili sürekli kesici lazer ışını ateşler!' },
      en: { name: 'TWIN WING LASERS', tag: 'LASER WEAPON', desc: 'Projects dual continuous cutting laser beams from both wings!' }
    },
    {
      id: 'laser_overcharge', can: 'can_mega_laser', color: '#ffe047', max: 1,
      tr: { name: 'MEGA LAZER REAKTÖRÜ', tag: 'LAZER GÜCÜ', desc: 'Lazer ışınlarını açar veya mevcut lazerin kalınlık ve hasarını +%60 artırır!' },
      en: { name: 'MEGA LASER CORE', tag: 'LASER POWER', desc: 'Unlocks laser beam or boosts active laser width and damage by +60%!' }
    },
    {
      id: 'homing_missiles', can: 'can_missile', color: '#ff5252', max: 1,
      tr: { name: 'GÜDÜMLÜ FÜZE BATARYASI', tag: 'FÜZE SİSTEMİ', desc: 'En yakın düşmanı kovalayıp patlayan ikili güdümlü mikro füzeler fırlatır!' },
      en: { name: 'HOMING MISSILE PODS', tag: 'MISSILE TECH', desc: 'Launches twin heat-seeking micro-missiles that hunt down enemies!' }
    },
    {
      id: 'sawblade_disc', can: 'can_saw', color: '#a8e6ff', max: 1,
      tr: { name: 'DÖNER TESTERE DİSK', tag: 'DELİCİ SİLAH', desc: 'Düşmanların içinden geçerek biçen çelik testere diskleri fırlatır!' },
      en: { name: 'BUZZSAW LAUNCHER', tag: 'SLICER WEAPON', desc: 'Fires spinning serrated buzzsaw discs that slice through enemies!' }
    },
    {
      id: 'sonic_wave', can: 'can_sonic_wave', color: '#d580ff', max: 1,
      tr: { name: 'SONİK HİLAL DALGASI', tag: 'DALGA SİLAHI', desc: 'Genişleyerek ilerleyen ve tüm hattı süpüren dev enerji hilali atar!' },
      en: { name: 'SONIC CRESCENT WAVE', tag: 'WAVE WEAPON', desc: 'Unleashes expanding energy crescent waves that sweep the lane!' }
    },
    {
      id: 'spinach_barrage', can: 'can_barrage', color: '#ffe047', max: 1,
      tr: { name: 'ISPANAK ROKET YAĞMURU', tag: 'AĞIR DESTEK', desc: 'Her 3.2 sn\'de ekranı döven 5\'li güdümlü roket salvosu ateşler!' },
      en: { name: 'SPINACH ROCKET SALVO', tag: 'ARTILLERY', desc: 'Launches a 5-missile artillery barrage every 3.2 seconds!' }
    },
    {
      id: 'auto_shoulder_cannon', can: 'can_rear', color: '#57e2ff', max: 1,
      tr: { name: 'OTONOM OMUZ TARETİ', tag: 'OTOMATİK TOP', desc: 'En yakın hedefe kendi başına nişan alıp seri ateş eden taret ekler.' },
      en: { name: 'AUTO SHOULDER TURRET', tag: 'AUTO TURRET', desc: 'Mounts an autonomous turret that locks onto the closest target.' }
    },
    {
      id: 'plasma_nuke_cannon', can: 'can_plasma_nuke', color: '#ff8533', max: 1,
      tr: { name: 'AĞIR PLAZMA TOPU', tag: 'AĞIR SİLAH', desc: 'Her 1.6 sn\'de çarptığı yerde büyük alan patlaması yapan plazma güllesi atar.' },
      en: { name: 'HEAVY PLASMA MORTAR', tag: 'HEAVY CANNON', desc: 'Fires a massive explosive plasma shell every 1.6 seconds.' }
    },

    // --- 25..32: ELEMENTLER VE VURUŞ ETKİLERİ ---
    {
      id: 'fire_rounds', can: 'can_fire', color: '#ff6333', max: 1,
      tr: { name: 'EJDER ATEŞİ (NAPALM)', tag: 'ATEŞ ELEMENTİ', desc: 'Mermileri alev topuna çevirir; düşmanları tutuşturup 3 sn boyunca yakar!' },
      en: { name: 'DRAGON NAPALM SHOTS', tag: 'FIRE ELEMENT', desc: 'Ignites enemies on hit, burning them for heavy damage over 3s!' }
    },
    {
      id: 'ice_rounds', can: 'can_ice', color: '#5ce1ff', max: 1,
      tr: { name: 'BUZUL DONDURUCU ATIŞ', tag: 'BUZ ELEMENTİ', desc: 'Mermileri buz kristaline çevirir; düşmanları ve ateşlerini %40 yavaşlatır!' },
      en: { name: 'FROST CRYO SHARDS', tag: 'ICE ELEMENT', desc: 'Chills enemies on hit, slowing their movement and fire rate by 40%!' }
    },
    {
      id: 'acid_rounds', can: 'can_acid', color: '#7dff4d', max: 1,
      tr: { name: 'KOROZİF ASİT MERMİSİ', tag: 'ASİT ELEMENTİ', desc: 'Zehirli ıspanak asidi düşman zırhını eritir ve +%30 ekstra hasar verir!' },
      en: { name: 'VENOM ACID ROUNDS', tag: 'ACID ELEMENT', desc: 'Corrosive spinach acid melts enemy armor for +30% bonus damage!' }
    },
    {
      id: 'chain_lightning', can: 'can_lightning', color: '#ffe84d', max: 1,
      tr: { name: 'ZİNCİRLEME YILDIRIM', tag: 'ELEKTRİK', desc: 'Mermi isabetlerinde düşmandan düşmana sıçrayan elektrik arkı çakar!' },
      en: { name: 'CHAIN LIGHTNING', tag: 'ELECTRIC', desc: 'Shots unleash high-voltage lightning arcs jumping between enemies!' }
    },
    {
      id: 'lightning_storm', can: 'can_storm', color: '#70f0ff', max: 1,
      tr: { name: 'YILDIRIM FIRTINASI', tag: 'GÖKYÜZÜ GÜCÜ', desc: 'Her 1.8 sn\'de ekrandaki düşmanların tepesine doğrudan yıldırım indirir!' },
      en: { name: 'THUNDERSTORM CALL', tag: 'STORM POWER', desc: 'Strikes random enemies on screen with sky lightning every 1.8s!' }
    },
    {
      id: 'explosive_shots', can: 'can_explosive', color: '#ff9433', max: 1,
      tr: { name: 'PATLAYICI ÇEKİRDEK', tag: 'ALAN HASARI', desc: 'Her mermi isabetinde çevredeki düşmanları da sarsan patlama oluşturur!' },
      en: { name: 'EXPLOSIVE ROUNDS', tag: 'BLAST CORE', desc: 'Bullets detonate on impact, dealing splash damage to nearby enemies!' }
    },
    {
      id: 'headshot_kill', can: 'can_headshot', color: '#ff4d6d', max: 1,
      tr: { name: 'İNFAZCI (HEADSHOT)', tag: 'ANINDA İNFAZ', desc: 'Canı %20\'nin altına düşen normal düşmanları anında infaz eder!' },
      en: { name: 'EXECUTIONER HEADSHOT', tag: 'INSTANT KILL', desc: 'Instantly executes non-boss enemies below 20% health!' }
    },
    {
      id: 'boss_hunter', can: 'can_boss_hunter', color: '#ff5252', max: 1,
      tr: { name: 'DRETNOT AVCISI', tag: 'BOSS HASARI', desc: 'Dev Boss\'lara ve Elit kruvazörlere karşı +%40 ekstra yıkıcı hasar verir!' },
      en: { name: 'DREADNOUGHT SLAYER', tag: 'BOSS DAMAGE', desc: 'Deals +40% bonus damage against Bosses and Elite Cruisers!' }
    },

    // --- 33..41: HIZ, HASAR, KRİTİK VE YÖRÜNGE BİRİMLERİ ---
    {
      id: 'rapid_fire_1', can: 'can_rapid1', color: '#ffa834', max: 1,
      tr: { name: 'HIZLI ATIŞ: TURBO TETİK', tag: 'ATIŞ HIZI', desc: 'Tüm silahların ve yardımcı uçakların ateş etme hızını +%25 artırır!' },
      en: { name: 'RAPID FIRE: TURBO', tag: 'ATTACK SPEED', desc: 'Increases fire rate of all weapons and wingmen by +25%!' }
    },
    {
      id: 'rapid_fire_2', can: 'can_rapid2', color: '#ff6333', max: 1,
      tr: { name: 'HİPER GATLİNG NAMLU', tag: 'ATIŞ HIZI', desc: 'Ateş etme hızını +%30 artırır ve namlu soğumasını hızlandırır!' },
      en: { name: 'HYPER GATLING BARREL', tag: 'ATTACK SPEED', desc: 'Boosts overall attack speed by an additional +30%!' }
    },
    {
      id: 'damage_up_1', can: 'can_damage1', color: '#ff4d6d', max: 1,
      tr: { name: 'SAF ATEŞ GÜCÜ', tag: 'HASAR ARTIŞI', desc: 'Tüm mermi, lazer ve özel silahların hasarını +%30 artırır!' },
      en: { name: 'RAW FIREPOWER', tag: 'DAMAGE UP', desc: 'Increases damage of all bullets, lasers, and special weapons by +30%!' }
    },
    {
      id: 'crit_chance', can: 'can_crit', color: '#ffe047', max: 1,
      tr: { name: 'KRİTİK NİŞANGÂH', tag: 'KRİTİK ŞANS', desc: '+%22 Kritik Vuruş şansı kazandırır (Kritik vuruşlar 2.2x hasar verir)!' },
      en: { name: 'CRITICAL TARGETING', tag: 'CRIT CHANCE', desc: 'Grants +22% Critical Hit chance (Crits deal 2.2x damage)!' }
    },
    {
      id: 'crit_damage', can: 'can_crit_dmg', color: '#ffb833', max: 1,
      tr: { name: 'YIKICI KRİTİK DARBE', tag: 'KRİTİK HASAR', desc: 'Kritik hasar çarpanını +0.8x artırır ve +%12 kritik şans ekler!' },
      en: { name: 'DEVASTATING CRITS', tag: 'CRIT DAMAGE', desc: 'Increases Critical Damage multiplier by +0.8x and Crit Chance by +12%!' }
    },
    {
      id: 'berserker_rage', can: 'can_berserker', color: '#ff3b3b', max: 1,
      tr: { name: 'TEMEL REİS ÖFKESİ', tag: 'ÖFKE MODU', desc: 'Eksik can oranına göre hasarını ve ateş hızını +%65\'e kadar artırır!' },
      en: { name: 'SAILOR BERSERK FURY', tag: 'BERSERKER', desc: 'Increases damage and fire rate up to +65% based on missing HP!' }
    },
    {
      id: 'wingman_add', can: 'can_wingman', color: '#70f0ff', max: 1,
      tr: { name: 'YARDIMCI UÇAK FİLOSU', tag: 'YARDIMCI BİRİM', desc: '+2 Wingman yardımcı uçak ekler ve tüm yardımcı uçak hasarını +%30 artırır!' },
      en: { name: 'WINGMAN SQUADRON', tag: 'COMPANION', desc: 'Adds +2 Wingman drones and boosts all wingman damage by +30%!' }
    },
    {
      id: 'orbital_orbs', can: 'can_orbital_orbs', color: '#57ffda', max: 1,
      tr: { name: 'YÖRÜNGE KALKAN KÜRELERİ', tag: 'YÖRÜNGE KORUMA', desc: 'Uçağın etrafında dönerek düşman mermilerini silen 3 enerji küresi ekler!' },
      en: { name: 'ORBITAL SHIELD ORBS', tag: 'ORBITAL GUARD', desc: 'Spawns 3 orbiting energy spheres that block enemy bullets & ram foes!' }
    },
    {
      id: 'orbital_anchors', can: 'can_anchor', color: '#ffd147', max: 8,
      tr: { name: 'YÖRÜNGE DÖNER ÇAPA', tag: 'YÖRÜNGE SİLAHI', desc: 'Uçağın etrafında geniş yörüngede dönen +1 dev savaş çapası ekler (Aldıkça 8 yöne tamamlanır)!' },
      en: { name: 'ORBITING BATTLE ANCHOR', tag: 'ORBITAL BLADE', desc: 'Adds +1 giant spinning battle anchor orbiting your jet (Stacks up to 8 directions)!' }
    },

    // --- 42..48: SAVUNMA, CAN, VAMPİRİK ONARIM VE XP ---
    {
      id: 'max_hp_boost', can: 'can_max_hp', color: '#6dff5c', max: 1,
      tr: { name: 'ÇELİK GÖVDE & CAN', tag: 'MAKSİMUM CAN', desc: 'Maksimum Canı +45 artırır ve anında +50 Can iyileştirir!' },
      en: { name: 'IRON HULL & VITALITY', tag: 'MAX HEALTH', desc: 'Increases Max HP by +45 and immediately restores +50 HP!' }
    },
    {
      id: 'full_feast_heal', can: 'can_heal', color: '#5fd82b', max: 1,
      tr: { name: 'ÇİFTE ISPANAK ZİYAFETİ', tag: 'TAM ONARIM', desc: 'Canı tamamen (%100) doldurur ve 6 saniyelik enerji kalkanı açar!' },
      en: { name: 'SPINACH POWER FEAST', tag: 'HEAL & SHIELD', desc: 'Fully restores 100% HP and activates a 6-second Energy Shield!' }
    },
    {
      id: 'vampiric_leech', can: 'can_vampiric', color: '#ff5277', max: 1,
      tr: { name: 'VAMPİRİK GÖVDE ONARIMI', tag: 'CAN ÇALMA', desc: 'Yok ettiğin her düşman uçağının canını otomatik olarak yeniler!' },
      en: { name: 'VAMPIRIC LEECH REPAIR', tag: 'LIFESTEAL', desc: 'Every enemy destroyed restores HP to your fighter!' }
    },
    {
      id: 'hull_regen', can: 'can_regen', color: '#7dff4d', max: 1,
      tr: { name: 'OTOMATİK TAMİR BOTLARI', tag: 'SÜREKLİ ONARIM', desc: 'Uçak gövdesini saniyede +3 HP sürekli olarak kendiliğinden onarır!' },
      en: { name: 'NANO REPAIR DRONES', tag: 'HP REGEN', desc: 'Continuously regenerates +3 fighter hull HP every second!' }
    },
    {
      id: 'dodge_cloak', can: 'can_phantom', color: '#70f0ff', max: 1,
      tr: { name: 'HAYALET MANEVRA (DODGE)', tag: 'SIYRILMA', desc: 'Gelen mermilerden %22 ihtimalle "SIYRILDI!" diyerek hiç hasar almaz!' },
      en: { name: 'PHANTOM EVASION', tag: 'DODGE MATRIX', desc: 'Grants 22% Dodge chance to completely evade incoming hits!' }
    },
    {
      id: 'periodic_shield', can: 'can_dodge', color: '#57ffda', max: 1,
      tr: { name: 'PERİYODİK ENERJİ KALKANI', tag: 'OTOMATİK KALKAN', desc: 'Her 10 saniyede bir otomatik olarak 3.5 sn koruyucu enerji kalkanı açar!' },
      en: { name: 'AUTO PHASE BARRIER', tag: 'AUTO SHIELD', desc: 'Automatically deploys a 3.5s energy shield every 10 seconds!' }
    },
    {
      id: 'xp_overdrive', can: 'can_xp_overdrive', color: '#57ffda', max: 1,
      tr: { name: 'KOMUTAN BİLGELİĞİ (XP+)', tag: 'HIZLI SEVİYE', desc: 'Kazanılan XP miktarını +%40 artırır ve tüm silah hasarını +%20 güçlendirir!' },
      en: { name: 'COMMANDER WISDOM (XP+)', tag: 'FAST LEVEL', desc: 'Boosts all XP gained by +40% and increases weapon damage by +20%!' }
    }
  ],

  getSkillById(id) {
    for (let i = 0; i < this.SKILLS.length; i++) {
      if (this.SKILLS[i].id === id) return this.SKILLS[i];
    }
    return null;
  },

  rollThreeChoices(player) {
    const available = [];
    for (let i = 0; i < this.SKILLS.length; i++) {
      const sk = this.SKILLS[i];
      const cur = (player.skills && player.skills[sk.id]) || 0;
      const maxLvl = sk.max || 1;
      if (cur < maxLvl) {
        available.push(sk);
      }
    }

    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = available[i];
      available[i] = available[j];
      available[j] = tmp;
    }

    return available.slice(0, 3);
  },

  applySkill(player, skillId) {
    if (!player.skills) player.skills = {};
    const sk = this.getSkillById(skillId);
    const maxLvl = (sk && sk.max) || 1;
    const cur = player.skills[skillId] || 0;
    player.skills[skillId] = Math.min(maxLvl, cur + 1);

    const cfg = window.GAME_CONFIG;
    const maxWep = cfg.WEAPON_LADDER.length - 1;

    switch (skillId) {
      case 'front_shot':
        if (player.weaponLevel < maxWep) player.weaponLevel++;
        else player.powerBonus += 0.25;
        break;

      case 'double_caliber_step':
        player.weaponLevel = Math.min(maxWep, player.weaponLevel + 2);
        player.powerBonus += 0.20;
        break;

      case 'fan_spread':
      case 'side_shot':
        if (player.weaponLevel < maxWep) player.weaponLevel++;
        break;

      case 'rapid_fire_1':
        player.bonusFireRate += 0.25;
        break;

      case 'rapid_fire_2':
        player.bonusFireRate += 0.30;
        if (player.weaponLevel < maxWep) player.weaponLevel++;
        break;

      case 'damage_up_1':
        player.powerBonus += 0.30;
        if (player.weaponLevel < maxWep) player.weaponLevel++;
        break;

      case 'crit_chance':
        player.critChance = Math.min(0.75, player.critChance + 0.22);
        player.critMult += 0.20; // Kart açıklamasıyla eşit: kritik vuruşlar 2.2x
        break;

      case 'crit_damage':
        player.critChance = Math.min(0.75, player.critChance + 0.12);
        player.critMult += 0.80;
        break;

      case 'wingman_add':
        player.addWingmen();
        player.addWingmen();
        player.wingBonus += 0.30;
        break;

      case 'max_hp_boost':
        player.maxHp += 45;
        player.hp = Math.min(player.maxHp, player.hp + 50);
        break;

      case 'full_feast_heal':
        player.hp = player.maxHp;
        player.shieldTimer = Math.max(player.shieldTimer, 6.0);
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
        player.powerBonus += 0.20;
        break;
    }

    return player.skills[skillId];
  }
};
