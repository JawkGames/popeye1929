// Ses Yöneticisi: Sentez (kodla üretilen) ses kullanılmaz.
// Kullanıcı ses dosyaları eklendiğinde Karışık Torba (Shuffle-Bag) sırasıyla çalar.
window.AudioManager = {
  muted: false,
  bags: {},
  clips: {},

  registerClip(key, url) {
    const audio = new Audio(url);
    audio.preload = 'auto';
    this.clips[key] = audio;
  },

  registerBag(bagKey, clipKeys) {
    this.bags[bagKey] = {
      all: clipKeys.slice(),
      pool: []
    };
  },

  play(key, volume = 0.8) {
    if (this.muted) return;
    const clip = this.clips[key];
    if (!clip) return;
    try {
      const node = clip.cloneNode();
      node.volume = Math.max(0, Math.min(1, volume));
      node.play().catch(() => {});
    } catch (e) {}
  },

  playBag(bagKey, volume = 0.8) {
    if (this.muted) return;
    const bag = this.bags[bagKey];
    if (!bag || !bag.all || bag.all.length === 0) return;
    if (bag.pool.length === 0) {
      bag.pool = bag.all.slice();
      for (let i = bag.pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = bag.pool[i];
        bag.pool[i] = bag.pool[j];
        bag.pool[j] = tmp;
      }
    }
    const nextKey = bag.pool.pop();
    this.play(nextKey, volume);
  },

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
};
