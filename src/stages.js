// 15 Bölümlü (Zeminli ve Zeminsiz) Özel Çevre, Atmosfer, Zemin Dokusu ve Kenar Nesnesi Motoru
window.StageThemes = {
  TOTAL_STAGES: 15,

  // 15 Bölümün Çevre, Zemin, Hava Parçacığı ve Kenar Nesnesi Tanımları
  STAGES: [
    // 1: Uzay Üssü & Asteroit Kuşağı (Zeminsiz - Level 01 tarzı)
    {
      id: 1, nameTR: 'UZAY ÜSSÜ', nameEN: 'SPACE OUTPOST',
      hasGround: false, groundType: 'none',
      skyTop: [6, 16, 32], skyMid: [11, 28, 54], skyBot: [5, 13, 26],
      nebula: 'rgba(0, 175, 255, 0.12)',
      starColors: ['#ffffff', '#9be8ff', '#d0e8ff'],
      particleType: 'stars',
      leftProps: ['wall_left_radar', 'wall_left_reactor', 'env_asteroid'],
      rightProps: ['wall_right_tower', 'wall_right_coil', 'env_asteroid'],
      bossKey: 'boss_dreadnought'
    },
    // 2: Hurda Metal & Paslı Tersane (Zeminli - Level 02 tarzı)
    {
      id: 2, nameTR: 'HURDA TERSANESİ', nameEN: 'RUSTED SCRAPYARD',
      hasGround: true, groundType: 'scrapyard',
      skyTop: [42, 30, 24], skyMid: [54, 38, 30], skyBot: [34, 24, 18],
      plateColor: '#483b36', seamColor: '#241c18', accentColor: '#d97b24',
      particleType: 'sparks',
      leftProps: ['env2_scrap', 'env_girder'],
      rightProps: ['env2_scrap', 'env_girder'],
      bossKey: 'boss_1'
    },
    // 3: Endüstriyel Buhar & Boru Fabrikası (Zeminli - Level 03/05 tarzı)
    {
      id: 3, nameTR: 'BUHAR FABRİKASI', nameEN: 'STEAM FOUNDRY',
      hasGround: true, groundType: 'foundry',
      skyTop: [36, 40, 46], skyMid: [48, 52, 60], skyBot: [28, 32, 38],
      plateColor: '#4a5058', seamColor: '#22262b', accentColor: '#e6b82e',
      particleType: 'steam',
      leftProps: ['env2_furnace', 'env_girder'],
      rightProps: ['env2_furnace', 'wall_right_tower'],
      bossKey: 'boss_2'
    },
    // 4: Dev Matkap & Maden Kuyusu (Zeminsiz - Level 04 tarzı)
    {
      id: 4, nameTR: 'MADEN KUYUSU', nameEN: 'DEEP DRILL CHASM',
      hasGround: false, groundType: 'chasm_chains',
      skyTop: [12, 16, 24], skyMid: [20, 26, 38], skyBot: [8, 11, 18],
      nebula: 'rgba(255, 190, 40, 0.08)',
      starColors: ['#ffe082', '#b0bec5', '#ffffff'],
      particleType: 'dust',
      leftProps: ['env2_drill', 'env_asteroid'],
      rightProps: ['env2_drill', 'wall_left_reactor'],
      bossKey: 'boss_3'
    },
    // 5: Karlı & Buzullu Kutup Vadisi (Zeminli - Karlı/Buzlu Özel Bölüm)
    {
      id: 5, nameTR: 'BUZUL VADİSİ', nameEN: 'FROZEN GLACIER',
      hasGround: true, groundType: 'snow_glacier',
      skyTop: [18, 44, 72], skyMid: [28, 66, 102], skyBot: [14, 36, 60],
      plateColor: '#265885', seamColor: '#133352', accentColor: '#8ceeff',
      particleType: 'snow',
      leftProps: ['env2_glacier'],
      rightProps: ['env2_glacier'],
      bossKey: 'boss_4'
    },
    // 6: Uydu & Hologram Gözlemevi (Zeminli - Level 07 tarzı)
    {
      id: 6, nameTR: 'UYDU GÖZLEMEVİ', nameEN: 'SATELLITE DECK',
      hasGround: true, groundType: 'holo_deck',
      skyTop: [14, 26, 44], skyMid: [24, 42, 68], skyBot: [10, 20, 34],
      plateColor: '#2d3e52', seamColor: '#15202b', accentColor: '#29b6f6',
      particleType: 'stars',
      leftProps: ['env2_satellite', 'wall_left_radar'],
      rightProps: ['env2_satellite', 'wall_right_coil'],
      bossKey: 'boss_5'
    },
    // 7: Neon Siber Gece Şehri (Zeminsiz - Level 08 tarzı)
    {
      id: 7, nameTR: 'NEON SİBER ŞEHİR', nameEN: 'CYBERPUNK CITY',
      hasGround: false, groundType: 'neon_grid',
      skyTop: [12, 8, 34], skyMid: [26, 14, 64], skyBot: [8, 5, 24],
      nebula: 'rgba(255, 0, 200, 0.16)',
      starColors: ['#00f2ff', '#ff40e8', '#ffffff'],
      particleType: 'neon',
      leftProps: ['env2_neon1', 'env2_neon2'],
      rightProps: ['env2_neon2', 'env2_neon1'],
      bossKey: 'boss_6'
    },
    // 8: Erimiş Bakır & Tesla Reaktörü (Zeminli - Level 09 tarzı)
    {
      id: 8, nameTR: 'BAKIR REAKTÖRÜ', nameEN: 'COPPER REACTOR',
      hasGround: true, groundType: 'copper_reactor',
      skyTop: [34, 24, 22], skyMid: [48, 32, 28], skyBot: [26, 18, 16],
      plateColor: '#3d3532', seamColor: '#1e1917', accentColor: '#ff7b24',
      particleType: 'sparks',
      leftProps: ['env2_copper', 'wall_left_reactor'],
      rightProps: ['env2_copper', 'wall_right_coil'],
      bossKey: 'boss_7'
    },
    // 9: Mor Nebula & Kozmik Asteroit Boşluğu (Zeminsiz - Level 11 tarzı)
    {
      id: 9, nameTR: 'MOR NEBULA', nameEN: 'VIOLET NEBULA',
      hasGround: false, groundType: 'none',
      skyTop: [32, 10, 56], skyMid: [68, 22, 108], skyBot: [22, 6, 40],
      nebula: 'rgba(235, 80, 255, 0.24)',
      starColors: ['#ffccff', '#70f8ff', '#ffffff'],
      particleType: 'stars',
      leftProps: ['env2_meteor', 'env_asteroid'],
      rightProps: ['env2_meteor', 'env_asteroid'],
      bossKey: 'boss_8'
    },
    // 10: Zümrüt Kristal Mağarası (Zeminli - Level 12 tarzı)
    {
      id: 10, nameTR: 'KRİSTAL MAĞARA', nameEN: 'CRYSTAL CAVERN',
      hasGround: true, groundType: 'crystal_cave',
      skyTop: [8, 38, 36], skyMid: [16, 68, 62], skyBot: [6, 28, 26],
      plateColor: '#164a46', seamColor: '#0b2926', accentColor: '#26ffc9',
      particleType: 'crystals',
      leftProps: ['env2_crystal'],
      rightProps: ['env2_crystal'],
      bossKey: 'boss_9'
    },
    // 11: Biyo-Organik Asit Ormanı (Zeminli - Level 13 tarzı)
    {
      id: 11, nameTR: 'BİYO-ASİT ORMANI', nameEN: 'BIO-ACID SWAMP',
      hasGround: true, groundType: 'bio_swamp',
      skyTop: [24, 38, 18], skyMid: [38, 58, 26], skyBot: [18, 28, 12],
      plateColor: '#385228', seamColor: '#1f2e15', accentColor: '#9dff2e',
      particleType: 'spores',
      leftProps: ['env2_bioroot'],
      rightProps: ['env2_bioroot'],
      bossKey: 'boss_10'
    },
    // 12: Boyutlar Arası Mor Damarlı Geçit (Zeminsiz - Level 14 tarzı)
    {
      id: 12, nameTR: 'BOYUT GEÇİDİ', nameEN: 'DIMENSIONAL RIFT',
      hasGround: false, groundType: 'rift_veins',
      skyTop: [26, 12, 42], skyMid: [46, 20, 74], skyBot: [18, 8, 30],
      nebula: 'rgba(180, 50, 255, 0.20)',
      starColors: ['#d580ff', '#ff70c8', '#ffffff'],
      particleType: 'spores',
      leftProps: ['env2_tendril'],
      rightProps: ['env2_tendril'],
      bossKey: 'boss_11'
    },
    // 13: Antik Rünlü Taş Tapınak (Zeminli - Level 15 tarzı)
    {
      id: 13, nameTR: 'ANTİK RÜN TAPINAĞI', nameEN: 'ANCIENT RUNE RUINS',
      hasGround: true, groundType: 'rune_stone',
      skyTop: [24, 34, 46], skyMid: [36, 50, 66], skyBot: [18, 26, 36],
      plateColor: '#3a4b5c', seamColor: '#1d2730', accentColor: '#40f2ff',
      particleType: 'crystals',
      leftProps: ['env2_obelisk'],
      rightProps: ['env2_obelisk'],
      bossKey: 'boss_12'
    },
    // 14: Volkanik Lav & Magma Kanyonu (Zeminli - Level 16 tarzı)
    {
      id: 14, nameTR: 'VOLKANİK LAV KANYONU', nameEN: 'VOLCANIC LAVA CANYON',
      hasGround: true, groundType: 'lava_canyon',
      skyTop: [52, 16, 8], skyMid: [88, 28, 10], skyBot: [38, 10, 4],
      plateColor: '#4a1c10', seamColor: '#ff6a00', accentColor: '#ffbe24',
      particleType: 'sparks',
      leftProps: ['env2_lava'],
      rightProps: ['env2_lava'],
      bossKey: 'boss_13'
    },
    // 15: Karadelik & Omega Karanlık Kuleler (Zeminsiz - Level 17/18 tarzı)
    {
      id: 15, nameTR: 'OMEGA KARADELİK', nameEN: 'OMEGA BLACK HOLE',
      hasGround: false, groundType: 'black_hole',
      skyTop: [8, 12, 26], skyMid: [18, 28, 56], skyBot: [4, 6, 16],
      nebula: 'rgba(70, 130, 255, 0.22)',
      starColors: ['#9be8ff', '#ffe066', '#ffffff'],
      particleType: 'stars',
      leftProps: ['env2_teslaspire', 'env2_blackhole'],
      rightProps: ['env2_teslaspire', 'env2_blackhole'],
      bossKey: 'boss_14'
    }
  ],

  getStage(stageNum) {
    const idx = (Math.max(1, stageNum) - 1) % this.STAGES.length;
    return this.STAGES[idx];
  },

  // Zeminli ve Özel Atmosferli Bölümlerin Akan Zemin/Efekt Çizimi
  drawStageBackdrop(ctx, W, H, stageNum, scrollY) {
    const st = this.getStage(stageNum);
    const tileH = 240;
    const offset = Math.floor(scrollY) % tileH;

    ctx.save();

    if (st.groundType === 'scrapyard') {
      // Level 02 Tarzı: Paslı perçinli metal plakalar ve sarı-siyah ikaz şeritleri
      for (let y = offset - tileH; y < H + tileH; y += tileH) {
        ctx.strokeStyle = st.seamColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(40, y, W - 80, tileH);
        ctx.beginPath();
        ctx.moveTo(W * 0.5, y);
        ctx.lineTo(W * 0.5, y + tileH);
        ctx.stroke();

        // İkaz şeridi (///)
        ctx.fillStyle = '#1b1410';
        ctx.fillRect(50, y + 110, W - 100, 18);
        ctx.fillStyle = st.accentColor;
        for (let hx = 56; hx < W - 110; hx += 28) {
          ctx.fillRect(hx, y + 112, 14, 14);
        }
      }
    } else if (st.groundType === 'foundry') {
      // Level 03/05 Tarzı: Endüstriyel boru ızgaraları ve fabrika zemini
      for (let y = offset - tileH; y < H + tileH; y += tileH) {
        ctx.strokeStyle = st.seamColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(36, y, W - 72, tileH);
        // Yatay çelik borular
        ctx.fillStyle = '#363b42';
        ctx.fillRect(40, y + 60, W - 80, 16);
        ctx.fillRect(40, y + 170, W - 80, 16);
        ctx.strokeRect(40, y + 60, W - 80, 16);
        ctx.strokeRect(40, y + 170, W - 80, 16);
      }
    } else if (st.groundType === 'chasm_chains') {
      // Level 04 Tarzı: Karanlık maden kuyusu içinde sarkan dikey demir zincirler
      ctx.strokeStyle = 'rgba(120, 135, 155, 0.32)';
      ctx.lineWidth = 4;
      for (let y = (Math.floor(scrollY * 0.7) % 40) - 40; y < H + 40; y += 40) {
        ctx.strokeRect(118, y, 10, 24);
        ctx.strokeRect(W - 128, y + 18, 10, 24);
      }
    } else if (st.groundType === 'snow_glacier') {
      // Bölüm 5: Karlı ve buz çatlaklı kutup vadisi zemini
      for (let y = offset - tileH; y < H + tileH; y += tileH) {
        ctx.strokeStyle = 'rgba(160, 235, 255, 0.28)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(90, y + 30);
        ctx.lineTo(220, y + 95);
        ctx.lineTo(175, y + 180);
        ctx.moveTo(390, y + 50);
        ctx.lineTo(295, y + 140);
        ctx.lineTo(360, y + 210);
        ctx.stroke();

        ctx.fillStyle = 'rgba(220, 248, 255, 0.12)';
        ctx.beginPath();
        ctx.ellipse(190, y + 110, 75, 32, 0.2, 0, Math.PI * 2);
        ctx.ellipse(350, y + 185, 65, 26, -0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (st.groundType === 'holo_deck') {
      // Level 07 Tarzı: Uydu gözlemevi terası ve mavi veri hatları
      for (let y = offset - tileH; y < H + tileH; y += tileH) {
        ctx.strokeStyle = 'rgba(41, 182, 246, 0.22)';
        ctx.lineWidth = 2;
        ctx.strokeRect(65, y + 12, W - 130, tileH - 24);
        ctx.beginPath();
        ctx.moveTo(W * 0.5, y);
        ctx.lineTo(W * 0.5, y + tileH);
        ctx.stroke();
      }
    } else if (st.groundType === 'neon_grid') {
      // Level 08 Tarzı: Siber şehir otoyolu neon çizgileri
      for (let y = offset - tileH; y < H + tileH; y += tileH) {
        ctx.fillStyle = 'rgba(0, 242, 255, 0.22)';
        ctx.fillRect(165, y + 20, 4, 90);
        ctx.fillStyle = 'rgba(255, 0, 200, 0.22)';
        ctx.fillRect(W - 169, y + 110, 4, 90);
      }
    } else if (st.groundType === 'copper_reactor') {
      // Level 09 Tarzı: Erimiş bakır olukları ve reaktör ızgarası
      for (let y = offset - tileH; y < H + tileH; y += tileH) {
        ctx.strokeStyle = '#1c1614';
        ctx.lineWidth = 3;
        ctx.strokeRect(48, y, W - 96, tileH);
        ctx.fillStyle = 'rgba(255, 115, 25, 0.35)';
        ctx.fillRect(95, y + 85, W - 190, 12);
      }
    } else if (st.groundType === 'crystal_cave') {
      // Level 12 Tarzı: Zümrüt kristal mağara zemini ve ışık huzmeleri
      for (let y = offset - tileH; y < H + tileH; y += tileH) {
        ctx.fillStyle = 'rgba(38, 255, 201, 0.10)';
        ctx.beginPath();
        ctx.moveTo(120, y);
        ctx.lineTo(260, y + tileH);
        ctx.lineTo(390, y + tileH);
        ctx.lineTo(240, y);
        ctx.closePath();
        ctx.fill();
      }
    } else if (st.groundType === 'bio_swamp') {
      // Level 13 Tarzı: Biyo-organik asit göletleri ve kök damarları
      for (let y = offset - tileH; y < H + tileH; y += tileH) {
        ctx.fillStyle = 'rgba(157, 255, 46, 0.18)';
        ctx.beginPath();
        ctx.ellipse(205, y + 80, 62, 34, 0.15, 0, Math.PI * 2);
        ctx.ellipse(335, y + 185, 54, 28, -0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (st.groundType === 'rift_veins') {
      // Level 14 Tarzı: Boyutlar arası mor enerji ağları
      ctx.strokeStyle = 'rgba(195, 75, 255, 0.32)';
      ctx.lineWidth = 3;
      for (let y = offset - tileH; y < H + tileH; y += tileH) {
        ctx.beginPath();
        ctx.moveTo(60, y + 30);
        ctx.quadraticCurveTo(270, y + 90, W - 60, y + 40);
        ctx.moveTo(70, y + 150);
        ctx.quadraticCurveTo(270, y + 210, W - 70, y + 160);
        ctx.stroke();
      }
    } else if (st.groundType === 'rune_stone') {
      // Level 15 Tarzı: Antik rün çemberli taş tapınak zemini
      for (let y = offset - tileH; y < H + tileH; y += tileH) {
        ctx.strokeStyle = '#1b242e';
        ctx.lineWidth = 3;
        ctx.strokeRect(50, y, W - 100, tileH);
        ctx.strokeStyle = 'rgba(64, 242, 255, 0.25)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(W * 0.5, y + tileH * 0.5, 58, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (st.groundType === 'lava_canyon') {
      // Level 16 Tarzı: Akan parlak lav nehri ve bazalt kayalar
      for (let y = offset - tileH; y < H + tileH; y += tileH) {
        ctx.fillStyle = 'rgba(255, 105, 15, 0.38)';
        ctx.beginPath();
        ctx.ellipse(W * 0.5 - 25, y + 70, 95, 42, 0.1, 0, Math.PI * 2);
        ctx.ellipse(W * 0.5 + 30, y + 185, 88, 38, -0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 200, 35, 0.28)';
        ctx.beginPath();
        ctx.ellipse(W * 0.5 - 25, y + 70, 52, 20, 0.1, 0, Math.PI * 2);
        ctx.ellipse(W * 0.5 + 30, y + 185, 46, 18, -0.1, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (st.groundType === 'black_hole') {
      // Level 17 Tarzı: Merkezde dönen dev Karadelik girdabı
      const bhY = 260;
      const g = ctx.createRadialGradient(W * 0.5, bhY, 28, W * 0.5, bhY, 155);
      g.addColorStop(0, '#000000');
      g.addColorStop(0.28, '#020612');
      g.addColorStop(0.45, 'rgba(70, 145, 255, 0.55)');
      g.addColorStop(0.75, 'rgba(110, 75, 235, 0.22)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(W * 0.5, bhY, 155, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#68b8ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(W * 0.5, bhY, 44, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
};
