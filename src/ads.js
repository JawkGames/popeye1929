// AdMob Yöneticisi: Android uygulamasında (Capacitor) gerçek reklam, tarayıcıda reklamsız simülasyon
// Akış: 1) Kullanıcı izni (UMP / GDPR) -> 2) AdMob başlatma -> 3) Reklamları önceden yükleme
// Tam ekran reklam açıkken oyun bekletilir ve sesi kısılır; reklam KAPANINCA (dismiss) oyun devam eder.
window.Ads = {
  ready: false,
  initializing: null,          // Devam eden init() Promise'i (aynı anda tek başlatma)
  listenersBound: false,
  rewardedLoaded: false,
  interstitialLoaded: false,
  loadingRewarded: null,
  loadingInterstitial: null,
  lastInterstitial: 0,
  INTERSTITIAL_GAP_MS: 90000,  // İki geçiş reklamı arası en az 90 sn
  SHOW_TIMEOUT_MS: 6000,       // Reklam bu sürede ekrana gelmezse akış serbest bırakılır
  privacyOptionsRequired: false, // true ise menüde "Gizlilik Seçenekleri" butonu gösterilir
  active: null,                // O an ekranda olan tam ekran reklamın durumu

  plugin() {
    const C = window.Capacitor;
    if (!C || typeof C.isNativePlatform !== 'function' || !C.isNativePlatform()) return null;
    return (C.Plugins && C.Plugins.AdMob) || null;
  },

  cfg() {
    return window.GAME_CONFIG.ADMOB;
  },

  // Kullanıcı izni (UMP): Avrupa/İngiltere kullanıcılarına izin formu gösterilir.
  // Reklam istenebilir durumdaysa true döner.
  async gatherConsent(ad) {
    if (typeof ad.requestConsentInfo !== 'function') return true;
    let info = await ad.requestConsentInfo();
    if (info && info.isConsentFormAvailable && info.status === 'REQUIRED' && typeof ad.showConsentForm === 'function') {
      info = await ad.showConsentForm();
    }
    this.privacyOptionsRequired = Boolean(info && info.privacyOptionsRequirementStatus === 'REQUIRED');
    return !info || info.canRequestAds !== false;
  },

  // Menüdeki "Gizlilik Seçenekleri" butonu: kullanıcı iznini sonradan değiştirebilir (GDPR şartı)
  async showPrivacyOptions() {
    const ad = this.plugin();
    if (!ad || typeof ad.showPrivacyOptionsForm !== 'function') return;
    try {
      await ad.showPrivacyOptionsForm();
    } catch (e) {
      console.warn('[Ads] privacy options', e);
    }
  },

  init() {
    if (this.ready) return Promise.resolve(true);
    if (this.initializing) return this.initializing;
    const ad = this.plugin();
    if (!ad) return Promise.resolve(false);

    this.initializing = (async () => {
      try {
        let canRequest = false;
        try {
          canRequest = await this.gatherConsent(ad);
        } catch (e) {
          // İzin bilgisi alınamadı (ör. çevrimdışı): reklam başlatılmaz, sonraki reklam isteğinde yeniden denenir
          console.warn('[Ads] consent', e);
          return false;
        }
        if (!canRequest) return false;

        this.bindListeners(ad);
        try {
          await ad.initialize({ initializeForTesting: Boolean(this.cfg().IS_TEST) });
        } catch (e) {
          // Eklenti başlatmayı yapıp yalnızca banner alanını bulamadığında da hata döner; tam ekran reklamlar yine çalışır
          console.warn('[Ads] init', e);
        }
        this.ready = true;
        // Uygulama açılır açılmaz geçiş reklamı çıkmasın: ilk geçiş reklamı en erken 90 sn sonra gösterilebilir
        this.lastInterstitial = Date.now();
        this.loadRewarded();
        this.loadInterstitial();
        return true;
      } finally {
        this.initializing = null;
      }
    })();
    return this.initializing;
  },

  // Reklam olayları: ödül, kapanma ve gösterim hatası (kapanma olayı gelmeden oyun devam ettirilmez)
  bindListeners(ad) {
    if (this.listenersBound || typeof ad.addListener !== 'function') return;
    this.listenersBound = true;
    const on = (name, fn) => {
      try {
        const h = ad.addListener(name, fn);
        if (h && typeof h.catch === 'function') h.catch(() => {});
      } catch (e) {}
    };
    on('onRewardedVideoAdShowed', () => this.markShown('rewarded'));
    on('onRewardedVideoAdReward', () => {
      if (this.active && this.active.kind === 'rewarded') this.active.rewarded = true;
    });
    on('onRewardedVideoAdDismissed', () => this.finishActive('rewarded'));
    on('onRewardedVideoAdFailedToShow', () => this.finishActive('rewarded', true));
    on('interstitialAdShowed', () => this.markShown('interstitial'));
    on('interstitialAdDismissed', () => this.finishActive('interstitial'));
    on('interstitialAdFailedToShow', () => this.finishActive('interstitial', true));

    // Güvenlik ağı: kapanma olayı kaçarsa, uygulama yeniden görünür olduktan kısa süre sonra akışı serbest bırak
    document.addEventListener('visibilitychange', () => {
      const a = this.active;
      if (!a) return;
      if (document.hidden) {
        a.wasHidden = true;
      } else if (a.wasHidden) {
        setTimeout(() => {
          if (this.active === a) this.finishActive(a.kind);
        }, 1500);
      }
    });
  },

  loadRewarded() {
    if (this.rewardedLoaded) return Promise.resolve(true);
    if (this.loadingRewarded) return this.loadingRewarded;
    const ad = this.plugin();
    if (!ad || !this.ready) return Promise.resolve(false);
    this.loadingRewarded = ad.prepareRewardVideoAd({ adId: this.cfg().REWARDED_REVIVE })
      .then(() => { this.rewardedLoaded = true; return true; })
      .catch((e) => { this.rewardedLoaded = false; console.warn('[Ads] rewarded load', e); return false; })
      .then((ok) => { this.loadingRewarded = null; return ok; });
    return this.loadingRewarded;
  },

  loadInterstitial() {
    if (this.interstitialLoaded) return Promise.resolve(true);
    if (this.loadingInterstitial) return this.loadingInterstitial;
    const ad = this.plugin();
    if (!ad || !this.ready) return Promise.resolve(false);
    this.loadingInterstitial = ad.prepareInterstitial({ adId: this.cfg().INTERSTITIAL_STAGE })
      .then(() => { this.interstitialLoaded = true; return true; })
      .catch((e) => { this.interstitialLoaded = false; console.warn('[Ads] interstitial load', e); return false; })
      .then((ok) => { this.loadingInterstitial = null; return ok; });
    return this.loadingInterstitial;
  },

  // Reklam açıkken oyun sesini geçici sustur (AdMob & Google Play politikası uyumu)
  pauseAudioForAd() {
    const am = window.AudioManager;
    if (!am) return;
    am.adPaused = true;
    am.muted = true;
  },

  restoreAudioAfterAd() {
    const am = window.AudioManager;
    if (!am) return;
    am.adPaused = false;
    am.muted = (am.soundMode >= 2);
    am.musicMuted = (am.soundMode >= 1);
  },

  // Tam ekran reklam başlat: oyunu beklet, sesi kıs; reklam kapanınca resolve olur
  beginActive(kind) {
    return new Promise((resolve) => {
      const a = { kind, rewarded: false, shown: false, wasHidden: false, resolve, timer: null };
      this.active = a;
      this.pauseAudioForAd();
      if (window.gameInstance) window.gameInstance.adHold = true;
      // Reklam hiç ekrana gelmezse oyun kilitli kalmasın
      a.timer = setTimeout(() => {
        if (this.active === a && !a.shown && !a.wasHidden) this.finishActive(kind, true);
      }, this.SHOW_TIMEOUT_MS);
    });
  },

  markShown(kind) {
    const a = this.active;
    if (!a || a.kind !== kind) return;
    a.shown = true;
    if (a.timer) { clearTimeout(a.timer); a.timer = null; }
  },

  finishActive(kind, failed) {
    const a = this.active;
    if (!a || a.kind !== kind) return;
    this.active = null;
    if (a.timer) clearTimeout(a.timer);
    this.restoreAudioAfterAd();
    if (window.gameInstance) {
      window.gameInstance.adHold = false;
      window.gameInstance.lastTimestamp = 0; // Reklam süresi oyun zamanına sayılmasın
    }
    if (kind === 'rewarded') {
      this.rewardedLoaded = false;
      this.loadRewarded();
    } else {
      this.interstitialLoaded = false;
      if (a.shown || !failed) this.lastInterstitial = Date.now();
      this.loadInterstitial();
    }
    a.resolve(kind === 'rewarded' ? Boolean(a.rewarded) : Boolean(a.shown || !failed));
  },

  // Ödüllü reklam: reklam kapandığında, ödül kazanıldıysa true döner. Tarayıcıda direkt true.
  async showRewarded() {
    const ad = this.plugin();
    if (!ad) return true;
    if (this.active) return false;
    if (!this.ready) await this.init();
    if (!this.ready) return false;
    if (!this.rewardedLoaded) {
      const ok = await this.loadRewarded();
      if (!ok) return false;
    }
    if (this.active) return false;

    const done = this.beginActive('rewarded');
    ad.showRewardVideoAd()
      .then(() => {
        // Eklenti bu Promise'i ödül kazanıldığı anda çözer; reklam hâlâ ekrandadır, kapanma olayı beklenir
        if (this.active && this.active.kind === 'rewarded') this.active.rewarded = true;
      })
      .catch((e) => {
        console.warn('[Ads] rewarded show', e);
        this.finishActive('rewarded', true);
      });
    return done;
  },

  // Geçiş reklamı (bölüm sonu / yeniden başlatma): yalnızca ÖNCEDEN yüklenmişse gösterilir
  // (oyunun ortasında gecikmeli reklam açılmaz). Gösterildiyse reklam kapanınca true döner.
  async showInterstitial() {
    const ad = this.plugin();
    if (!ad) return false;
    if (!this.ready) { this.init(); return false; }
    if (this.active) return false;
    if (Date.now() - this.lastInterstitial < this.INTERSTITIAL_GAP_MS) return false;
    if (!this.interstitialLoaded) { this.loadInterstitial(); return false; }

    const done = this.beginActive('interstitial');
    ad.showInterstitial().catch((e) => {
      console.warn('[Ads] interstitial show', e);
      this.finishActive('interstitial', true);
    });
    return done;
  }
};

if (document.readyState === 'complete') {
  window.Ads.init();
} else {
  window.addEventListener('load', () => window.Ads.init());
}
