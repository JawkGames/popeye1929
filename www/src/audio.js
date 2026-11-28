// Arcade Ses Efektleri (Shuffle-Bag Varyasyonlu Vuruş, Ateş, Patlama, XP, Boss) ve Dinamik Bölüm/Boss Müzik Motoru
window.AudioManager = {
  ctx: null,
  // 3 Kademeli Ses Modu: 0 = Tümü Açık, 1 = Müzik Kapalı (Sağ Çapraz /), 2 = Tüm Sesler Kapalı (Kırmızı Çarpı X)
  soundMode: 0,
  muted: false,      // SFX kapalı mı (soundMode === 2 veya reklam açıkken)
  musicMuted: false, // Müzik kapalı mı (soundMode >= 1 veya reklam açıkken)
  adPaused: false,
  noiseBuffer: null,
  lastShootTime: 0,
  lastHitTime: 0,
  lastExpTime: 0,

  // Shuffle-Bag (Karışık Torba) Varyasyon Havuzları (Aynı ses üst üste birebir aynı tonda çalmaz)
  bags: {
    shoot:     { all: [0.94, 0.98, 1.0, 1.04, 1.08], pool: [] },
    hit:       { all: [0.88, 0.95, 1.02, 1.10, 1.18], pool: [] },
    explosion: { all: [0.85, 0.93, 1.0, 1.07, 1.15], pool: [] },
    bossShoot: { all: [0.90, 0.97, 1.03, 1.10], pool: [] }
  },

  // Müzik Sequencer Durumu
  musicStep: 0,
  musicTimer: 0,
  currentStageThemes: [
    // Mod 0 (Stage 1, 6, 11): Klasik Uzay Arcade (A Minor)
    { tempo: 0.145, bass: [110, 110, 130.8, 146.8, 110, 110, 164.8, 146.8], lead: [440, 0, 523.2, 659.2, 587.3, 0, 523.2, 440, 392, 0, 440, 523.2, 659.2, 587.3, 523.2, 392] },
    // Mod 1 (Stage 2, 7, 12): Endüstriyel / Siber (D Minor)
    { tempo: 0.138, bass: [73.4, 73.4, 87.3, 98.0, 73.4, 110, 87.3, 82.4], lead: [293.6, 349.2, 440, 0, 392, 349.2, 329.6, 0, 293.6, 440, 523.2, 0, 440, 392, 349.2, 293.6] },
    // Mod 2 (Stage 3, 8, 13): Fabrika / Antik Tapınak (E Minor)
    { tempo: 0.142, bass: [82.4, 82.4, 98.0, 110, 123.4, 110, 98.0, 82.4], lead: [329.6, 0, 392, 493.8, 0, 440, 392, 329.6, 293.6, 329.6, 392, 0, 493.8, 440, 392, 0] },
    // Mod 3 (Stage 4, 9, 14): Maden / Lav Kanyonu (C Minor)
    { tempo: 0.135, bass: [65.4, 65.4, 77.7, 98.0, 65.4, 65.4, 103.8, 98.0], lead: [261.6, 311.1, 392, 523.2, 0, 466.1, 392, 311.1, 261.6, 0, 349.2, 392, 466.1, 392, 311.1, 0] },
    // Mod 4 (Stage 5, 10, 15): Buzul / Kristal / Karadelik (F# Minor)
    { tempo: 0.140, bass: [92.5, 92.5, 110, 123.4, 138.6, 123.4, 110, 92.5], lead: [370, 440, 554.3, 0, 493.8, 440, 370, 0, 329.6, 370, 440, 554.3, 659.2, 554.3, 440, 370] }
  ],
  bossTheme: {
    tempo: 0.112,
    bass: [82.4, 82.4, 87.3, 82.4, 98.0, 82.4, 116.5, 110],
    lead: [329.6, 349.2, 329.6, 493.8, 329.6, 349.2, 523.2, 493.8, 329.6, 349.2, 329.6, 587.3, 523.2, 493.8, 440, 349.2]
  },

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    try {
      this.ctx = new AudioCtx();
      // Patlama ve vuruşlar için 1 saniyelik gürültü tamponu oluştur
      const sr = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, sr, sr);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < sr; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } catch (e) {}
  },

  pullBag(bagKey) {
    const bag = this.bags[bagKey];
    if (!bag) return 1.0;
    if (bag.pool.length === 0) {
      bag.pool = bag.all.slice();
      for (let i = bag.pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = bag.pool[i];
        bag.pool[i] = bag.pool[j];
        bag.pool[j] = tmp;
      }
    }
    return bag.pool.pop();
  },

  toggleMute() {
    this.init();
    this.soundMode = (this.soundMode + 1) % 3;
    this.musicMuted = this.soundMode >= 1;
    this.muted = this.soundMode >= 2;
    return this.soundMode;
  },

  isSfxMuted() {
    return this.adPaused || this.muted || this.soundMode >= 2;
  },

  isMusicMuted() {
    return this.adPaused || this.musicMuted || this.soundMode >= 1;
  },

  // 1) Oyuncu Ateş Sesi
  playShoot(isHeavy = false) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (now - this.lastShootTime < 0.072) return;
    this.lastShootTime = now;

    const pitch = this.pullBag('shoot');
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = isHeavy ? 'sawtooth' : 'triangle';

    const startFreq = (isHeavy ? 520 : 740) * pitch;
    const endFreq = (isHeavy ? 110 : 165) * pitch;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.065);

    gain.gain.setValueAtTime(0.085, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.068);
  },

  // 2) Mermi İsabet / Vuruş Sesi
  playHit(isCrit = false) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (now - this.lastHitTime < 0.042) return;
    this.lastHitTime = now;

    const pitch = this.pullBag('hit');
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = isCrit ? 'square' : 'sine';

    osc.frequency.setValueAtTime((isCrit ? 420 : 260) * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(55 * pitch, now + 0.048);

    gain.gain.setValueAtTime(isCrit ? 0.12 : 0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.052);
  },

  // 3) Düşman / Boss Patlama Sesi
  playExplosion(isBig = false) {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;
    if (!isBig && now - this.lastExpTime < 0.065) return;
    this.lastExpTime = now;

    const pitch = this.pullBag('explosion');
    const dur = isBig ? 0.42 : 0.22;

    // Gürültü + Alçak Geçiren Filtre
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime((isBig ? 950 : 750) * pitch, now);
    filter.frequency.exponentialRampToValueAtTime(65, now + dur);

    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(isBig ? 0.22 : 0.13, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(this.ctx.destination);
    noise.start(now);
    noise.stop(now + dur);

    // Alt Bas Darbesi
    const sub = this.ctx.createOscillator();
    const sGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime((isBig ? 140 : 115) * pitch, now);
    sub.frequency.exponentialRampToValueAtTime(28, now + dur);
    sGain.gain.setValueAtTime(isBig ? 0.24 : 0.14, now);
    sGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    sub.connect(sGain);
    sGain.connect(this.ctx.destination);
    sub.start(now);
    sub.stop(now + dur);
  },

  // 4) XP Kristali Toplama Sesi (Bar doldukça tonu yükselir)
  playXp(xpRatio = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const baseFreq = 520 + Math.min(1, Math.max(0, xpRatio)) * 380;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, now + 0.085);

    gain.gain.setValueAtTime(0.10, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.095);
  },

  // 5) Seviye Atlama (Level Up) Fanfarı
  playLevelUp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    for (let i = 0; i < notes.length; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const t = now + i * 0.075;
      osc.frequency.setValueAtTime(notes[i], t);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.19);
    }
  },

  // 6) Yetenek Seçim Onay Sesi
  playSkillPick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [659.25, 880, 1174.66];
    for (let i = 0; i < notes.length; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const t = now + i * 0.055;
      osc.frequency.setValueAtTime(notes[i], t);
      gain.gain.setValueAtTime(0.13, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    }
  },

  // 7) Boss Uyarı Sireni
  playBossWarning() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const t = now + i * 0.35;
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.linearRampToValueAtTime(640, t + 0.16);
      osc.frequency.linearRampToValueAtTime(320, t + 0.30);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.33);
    }
  },

  // 8) Boss Top Ateşi Sesi
  playBossShoot() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const pitch = this.pullBag('bossShoot');

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(58 * pitch, now + 0.13);

    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.135);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  },

  // 9) Oyuncu Hasar / Kalkan Sesi
  playPlayerHit(shielded = false) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    if (shielded) {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(1180, now + 0.11);
      gain.gain.setValueAtTime(0.12, now);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(175, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);
      gain.gain.setValueAtTime(0.18, now);
    }
    gain.gain.exponentialRampToValueAtTime(0.001, now + (shielded ? 0.12 : 0.23));
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + (shielded ? 0.13 : 0.24));
  },

  // 10) Dinamik Bölüm ve Boss Arka Plan Müziği (Oyun PLAYING durumundayken akar, durunca durur)
  updateMusic(dt, stageNum, isBossActive) {
    if (this.isMusicMuted() || !this.ctx || this.ctx.state !== 'running') return;

    const theme = isBossActive
      ? this.bossTheme
      : this.currentStageThemes[(Math.max(1, stageNum) - 1) % this.currentStageThemes.length];

    this.musicTimer -= dt;
    if (this.musicTimer > 0) return;
    this.musicTimer = theme.tempo;

    const now = this.ctx.currentTime;
    const step = this.musicStep;
    this.musicStep = (this.musicStep + 1) % 16;

    // Bas Hattı
    const bassFreq = theme.bass[step % theme.bass.length];
    if (bassFreq > 0) {
      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bOsc.type = isBossActive ? 'sawtooth' : 'triangle';
      bOsc.frequency.setValueAtTime(bassFreq, now);
      bGain.gain.setValueAtTime(0.048, now);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + theme.tempo * 0.9);
      bOsc.connect(bGain);
      bGain.connect(this.ctx.destination);
      bOsc.start(now);
      bOsc.stop(now + theme.tempo * 0.92);
    }

    // Melodi / Lead Hattı
    const leadFreq = theme.lead[step % theme.lead.length];
    if (leadFreq > 0) {
      const lOsc = this.ctx.createOscillator();
      const lGain = this.ctx.createGain();
      lOsc.type = 'square';
      lOsc.frequency.setValueAtTime(leadFreq, now);
      lGain.gain.setValueAtTime(0.024, now);
      lGain.gain.exponentialRampToValueAtTime(0.001, now + theme.tempo * 0.78);
      lOsc.connect(lGain);
      lGain.connect(this.ctx.destination);
      lOsc.start(now);
      lOsc.stop(now + theme.tempo * 0.8);
    }
  }
};
