// AdMob Yöneticisi: Android uygulamasında (Capacitor) gerçek reklam, tarayıcıda reklamsız simülasyon
window.Ads = {
  ready: false,
  lastInterstitial: 0,
  INTERSTITIAL_GAP_MS: 90000, // İki geçiş reklamı arası en az 90 sn

  plugin() {
    const C = window.Capacitor;
    if (!C || typeof C.isNativePlatform !== 'function' || !C.isNativePlatform()) return null;
    return (C.Plugins && C.Plugins.AdMob) || null;
  },

  async init() {
    const ad = this.plugin();
    if (!ad) return;
    try {
      await ad.initialize({ initializeForTesting: window.GAME_CONFIG.ADMOB.IS_TEST });
      this.ready = true;
      this.loadRewarded();
      this.loadInterstitial();
    } catch (e) { console.warn('[Ads] init', e); }
  },

  loadRewarded() {
    const ad = this.plugin();
    if (!ad) return;
    ad.prepareRewardVideoAd({ adId: window.GAME_CONFIG.ADMOB.REWARDED_REVIVE })
      .catch((e) => console.warn('[Ads] rewarded load', e));
  },

  loadInterstitial() {
    const ad = this.plugin();
    if (!ad) return;
    ad.prepareInterstitial({ adId: window.GAME_CONFIG.ADMOB.INTERSTITIAL_STAGE })
      .catch((e) => console.warn('[Ads] interstitial load', e));
  },

  // Ödüllü reklam: ödül kazanılırsa true döner. Tarayıcıda direkt true.
  async showRewarded() {
    const ad = this.plugin();
    if (!ad) return true;
    try {
      const reward = await ad.showRewardVideoAd();
      this.loadRewarded();
      return !!reward;
    } catch (e) {
      console.warn('[Ads] rewarded show', e);
      this.loadRewarded();
      return false;
    }
  },

  // Geçiş reklamı (bölüm sonu / yeniden başlatma), sıklık sınırlı
  async showInterstitial() {
    const ad = this.plugin();
    if (!ad || !this.ready) return;
    const now = Date.now();
    if (now - this.lastInterstitial < this.INTERSTITIAL_GAP_MS) return;
    try {
      await ad.showInterstitial();
      this.lastInterstitial = Date.now();
    } catch (e) { console.warn('[Ads] interstitial show', e); }
    this.loadInterstitial();
  }
};
window.addEventListener('load', () => window.Ads.init());
