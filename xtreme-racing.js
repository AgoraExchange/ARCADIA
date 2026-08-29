(() => {
  "use strict";

  const GAME_URL = "games/xtreme-racing/index.html";
  const GAME_SOURCE = "arcadia-xtreme-racing";
  const PARENT_SOURCE = "arcadia-parent";
  const LOAD_TIMEOUT = 90_000;

  class ArcadiaXtremeRacing {
    constructor(options = {}) {
      Object.assign(this, options);
      this.ready = false;
      this.started = false;
      this.paused = false;
      this.raceActive = false;
      this.loadTimer = 0;
      this.version = "1";
      this.boundMessage = (event) => this.handleMessage(event);
      window.addEventListener("message", this.boundMessage);
    }

    load(version = "1") {
      this.version = String(version || "1");
      this.ready = false;
      this.started = false;
      this.paused = false;
      this.raceActive = false;
      this.frame?.classList.remove("is-active");
      this.startButton?.classList.add("hidden");
      this.restartButton?.classList.add("hidden");
      if (this.pauseButton) {
        this.pauseButton.disabled = true;
        this.pauseButton.textContent = "Pause";
      }
      this.setLoading(true, "Building the XTREME RACING circuit...");
      if (this.loadTimer) window.clearTimeout(this.loadTimer);
      this.loadTimer = window.setTimeout(() => {
        if (this.ready) return;
        this.setLoading(true, "XTREME RACING could not finish loading. Tap Restart to try again.", true);
        this.restartButton?.classList.remove("hidden");
        this.onError?.();
      }, LOAD_TIMEOUT);
      if (this.frame) this.frame.src = `${GAME_URL}?arcadia=${encodeURIComponent(this.version)}`;
    }

    start(options = {}) {
      if (!this.ready || this.started) return false;
      this.started = true;
      this.paused = false;
      this.frame?.classList.add("is-active");
      this.startButton?.classList.add("hidden");
      this.restartButton?.classList.remove("hidden");
      if (this.pauseButton) this.pauseButton.disabled = false;
      this.post("start", options);
      this.onStart?.();
      return true;
    }

    restart(options = {}) {
      if (!this.ready) {
        this.load(this.version);
        return false;
      }
      this.started = true;
      this.paused = false;
      this.raceActive = false;
      this.frame?.classList.add("is-active");
      this.startButton?.classList.add("hidden");
      this.restartButton?.classList.remove("hidden");
      if (this.pauseButton) {
        this.pauseButton.disabled = false;
        this.pauseButton.textContent = "Pause";
      }
      this.post("restart", options);
      return true;
    }

    togglePause() {
      if (!this.ready || !this.started) return this.paused;
      this.paused = !this.paused;
      this.post("pause", { paused: this.paused });
      if (this.pauseButton) this.pauseButton.textContent = this.paused ? "Resume" : "Pause";
      this.onPauseChange?.(this.paused);
      return this.paused;
    }

    setMuted(options = {}) {
      if (!this.ready) return;
      this.post("mute", options);
    }

    stop() {
      if (this.loadTimer) window.clearTimeout(this.loadTimer);
      this.loadTimer = 0;
      this.ready = false;
      this.started = false;
      this.paused = false;
      this.raceActive = false;
      this.frame?.classList.remove("is-active");
      if (this.frame) this.frame.src = "about:blank";
      this.setLoading(false);
    }

    post(type, detail = {}) {
      this.frame?.contentWindow?.postMessage({ source: PARENT_SOURCE, type, ...detail }, window.location.origin);
    }

    handleMessage(event) {
      if (event.source !== this.frame?.contentWindow || event.origin !== window.location.origin) return;
      const message = event.data;
      if (!message || message.source !== GAME_SOURCE) return;
      if (message.type === "ready") {
        this.ready = true;
        if (this.loadTimer) window.clearTimeout(this.loadTimer);
        this.loadTimer = 0;
        this.setLoading(false);
        this.startButton?.classList.remove("hidden");
        this.restartButton?.classList.add("hidden");
        this.onReady?.();
        return;
      }
      if (message.type === "state") {
        this.paused = Boolean(message.paused);
        if (this.pauseButton) this.pauseButton.textContent = this.paused ? "Resume" : "Pause";
        if (message.racing && !this.raceActive) {
          this.raceActive = true;
          this.onRaceStart?.();
        }
        this.onPauseChange?.(this.paused);
        return;
      }
      if (message.type === "finish") {
        this.raceActive = false;
        this.onFinish?.({
          place: Math.max(1, Math.min(8, Math.round(Number(message.place) || 8))),
          raceTime: Math.max(0, Number(message.raceTime) || 0),
          bestLap: Math.max(0, Number(message.bestLap) || 0),
          lapTimes: Array.isArray(message.lapTimes) ? message.lapTimes.map(Number).filter(Number.isFinite) : [],
          racer: String(message.racer || "Racer")
        });
      }
    }

    setLoading(visible, message = "", failed = false) {
      if (!this.loading) return;
      this.loading.classList.toggle("hidden", !visible);
      this.loading.classList.toggle("is-error", Boolean(failed));
      if (message && this.loadingText) this.loadingText.textContent = message;
    }
  }

  window.ArcadiaXtremeRacing = ArcadiaXtremeRacing;
})();
