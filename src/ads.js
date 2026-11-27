// AdMob Yöneticisi: Android uygulamasında (Capacitor) gerçek reklam, tarayıcıda reklamsız simülasyon
window.Ads = {
  ready: false,
  initializing: false,
  rewardedLoaded: false,
  interstitialLoaded: false,
  lastInterstitial: 0,
  INTERSTITIAL_GAP_MS: 90000, // İki geçiş reklamı arası en az 90 sn

  plugin() {
    const C = window.Capacitor;
    if (!C || typeof C.isNativePlatform !== 'function' || !C.isNativePlatform()) return null;
    return (C.Plugins && C.Plugins.AdMob) || null;
  },

  async init() {
    if (this.ready || this.initializing) return;
    const ad = this.plugin();
    if (!ad) return;
    this.initializing = true;
    try {
      await ad.initialize({ initializeForTesting: Boolean(window.GAME_CONFIG.ADMOB.IS_TEST) });
      this.ready = true;
      this.loadRewarded();
      this.loadInterstitial();
    } catch (e) {
      console.warn('[Ads] init', e);
    } finally {
      this.initializing = false;
    }
  },

  async loadRewarded() {
    const ad = this.plugin();
    if (!ad) return false;
    try {
      await ad.prepareRewardVideoAd({ adId: window.GAME_CONFIG.ADMOB.REWARDED_REVIVE });
      this.rewardedLoaded = true;
      return true;
    } catch (e) {
      this.rewardedLoaded = false;
      console.warn('[Ads] rewarded load', e);
      return false;
    }
  },

  async loadInterstitial() {
    const ad = this.plugin();
    if (!ad) return false;
    try {
      await ad.prepareInterstitial({ adId: window.GAME_CONFIG.ADMOB.INTERSTITIAL_STAGE });
      this.interstitialLoaded = true;
      return true;
    } catch (e) {
      this.interstitialLoaded = false;
      console.warn('[Ads] interstitial load', e);
      return false;
    }
  },

  // Reklam açıkken oyun sesini geçici sustur (AdMob & Google Play politikası uyumu)
  pauseAudioForAd() {
    const am = window.AudioManager;
    if (!am) return false;
    const wasMuted = am.muted;
    am.muted = true;
    return wasMuted;
  },

  restoreAudioAfterAd(wasMuted) {
    const am = window.AudioManager;
    if (!am) return;
    am.muted = Boolean(wasMuted);
  },

  // Ödüllü reklam: ödül kazanılırsa true döner. Tarayıcıda direkt true.
  async showRewarded() {
    const ad = this.plugin();
    if (!ad) return true;
    if (!this.ready) await this.init();
    if (!this.rewardedLoaded) {
      const ok = await this.loadRewarded();
      if (!ok) return false;
    }
    const wasMuted = this.pauseAudioForAd();
    try {
      const reward = await ad.showRewardVideoAd();
      this.rewardedLoaded = false;
      this.loadRewarded();
      return Boolean(reward);
    } catch (e) {
      console.warn('[Ads] rewarded show', e);
      this.rewardedLoaded = false;
      this.loadRewarded();
      return false;
    } finally {
      this.restoreAudioAfterAd(wasMuted);
    }
  },

  // Geçiş reklamı (bölüm sonu / yeniden başlatma), 90 sn sıklık sınırlı
  async showInterstitial() {
    const ad = this.plugin();
    if (!ad) return;
    if (!this.ready) await this.init();
    const now = Date.now();
    if (now - this.lastInterstitial < this.INTERSTITIAL_GAP_MS) return;
    if (!this.interstitialLoaded) {
      const ok = await this.loadInterstitial();
      if (!ok) return;
    }
    const wasMuted = this.pauseAudioForAd();
    try {
      await ad.showInterstitial();
      this.lastInterstitial = Date.now();
    } catch (e) {
      console.warn('[Ads] interstitial show', e);
    } finally {
      this.restoreAudioAfterAd(wasMuted);
      this.interstitialLoaded = false;
      this.loadInterstitial();
    }
  }
};

if (document.readyState === 'complete') {
  window.Ads.init();
} else {
  window.addEventListener('load', () => window.Ads.init());
}
