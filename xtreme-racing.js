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
      this.controlScheme = "floating";
      this.steerPointerId = null;
      this.loadTimer = 0;
      this.progressTimer = 0;
      this.progress = 0;
      this.version = "1";
      this.boundMessage = (event) => this.handleMessage(event);
      window.addEventListener("message", this.boundMessage);
      this.bindControls();
      this.settingsButton?.addEventListener("click", () => this.openSettings());
    }

    load(version = "1") {
      this.version = String(version || "1");
      this.ready = false;
      this.started = false;
      this.paused = false;
      this.raceActive = false;
      this.frame?.classList.remove("is-active");
      this.controls?.classList.remove("is-active");
      this.releaseInputs(false);
      this.startButton?.classList.add("hidden");
      this.restartButton?.classList.add("hidden");
      if (this.settingsButton) this.settingsButton.disabled = true;
      if (this.pauseButton) {
        this.pauseButton.disabled = true;
        this.pauseButton.textContent = "Pause";
      }
      this.setLoading(true, "Building the XTREME RACING circuit...");
      this.progress = 0;
      this.setProgress(3, "Preparing the race engine...");
      if (this.progressTimer) window.clearInterval(this.progressTimer);
      this.progressTimer = window.setInterval(() => {
        if (this.ready || this.progress >= 18) return;
        this.setProgress(this.progress + 1, "Loading the XTREME RACING files...");
      }, 520);
      if (this.loadTimer) window.clearTimeout(this.loadTimer);
      this.loadTimer = window.setTimeout(() => {
        if (this.ready) return;
        if (this.progressTimer) window.clearInterval(this.progressTimer);
        this.progressTimer = 0;
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
      this.controls?.classList.add("is-active");
      this.startButton?.classList.add("hidden");
      this.restartButton?.classList.remove("hidden");
      if (this.pauseButton) this.pauseButton.disabled = false;
      if (this.settingsButton) this.settingsButton.disabled = false;
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
      this.controls?.classList.add("is-active");
      this.startButton?.classList.add("hidden");
      this.restartButton?.classList.remove("hidden");
      if (this.pauseButton) {
        this.pauseButton.disabled = false;
        this.pauseButton.textContent = "Pause";
      }
      if (this.settingsButton) this.settingsButton.disabled = false;
      this.post("restart", options);
      return true;
    }

    togglePause() {
      if (!this.ready || !this.started) return this.paused;
      this.paused = !this.paused;
      if (this.paused) this.releaseInputs();
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
      if (this.progressTimer) window.clearInterval(this.progressTimer);
      this.progressTimer = 0;
      this.ready = false;
      this.started = false;
      this.paused = false;
      this.raceActive = false;
      this.releaseInputs();
      this.frame?.classList.remove("is-active");
      this.controls?.classList.remove("is-active");
      if (this.frame) this.frame.src = "about:blank";
      this.setLoading(false);
      if (this.settingsButton) this.settingsButton.disabled = true;
    }

    post(type, detail = {}) {
      this.frame?.contentWindow?.postMessage({ source: PARENT_SOURCE, type, ...detail }, window.location.origin);
    }

    openSettings() {
      if (!this.ready || !this.started) return;
      if (this.raceActive && !this.paused) {
        this.paused = true;
        this.releaseInputs();
        this.post("pause", { paused: true });
        if (this.pauseButton) this.pauseButton.textContent = "Resume";
        this.onPauseChange?.(true);
      }
      this.post("open-controls");
    }

    bindControls() {
      const finishJoystick = (event) => {
        if (this.steerPointerId !== null && event?.pointerId !== undefined && event.pointerId !== this.steerPointerId) return;
        this.steerPointerId = null;
        if (this.joystickKnob) this.joystickKnob.style.transform = "translate(0px, 0px)";
        this.post("input", { name: "steer", value: 0 });
        this.post("input", { name: "steering", value: false });
      };
      const moveJoystick = (event) => {
        if (!this.raceActive || this.paused || this.controlScheme === "tilt") return;
        const rect = this.joystick?.getBoundingClientRect();
        if (!rect) return;
        const radius = Math.max(1, rect.width * 0.37);
        const rawX = (event.clientX - (rect.left + rect.width / 2)) / radius;
        const steer = Math.max(-1, Math.min(1, rawX));
        const knobX = steer * radius;
        if (this.joystickKnob) this.joystickKnob.style.transform = `translate(${knobX.toFixed(1)}px, 0px)`;
        this.post("input", { name: "steer", value: steer });
        this.post("input", { name: "steering", value: true });
      };

      this.joystick?.addEventListener("pointerdown", (event) => {
        if (!this.raceActive || this.paused || this.controlScheme === "tilt") return;
        event.preventDefault();
        this.steerPointerId = event.pointerId;
        try { this.joystick.setPointerCapture(event.pointerId); } catch { /* capture is optional */ }
        moveJoystick(event);
      });
      this.joystick?.addEventListener("pointermove", (event) => {
        if (event.pointerId !== this.steerPointerId) return;
        event.preventDefault();
        moveJoystick(event);
      });
      this.joystick?.addEventListener("pointerup", finishJoystick);
      this.joystick?.addEventListener("pointercancel", finishJoystick);
      this.joystick?.addEventListener("lostpointercapture", finishJoystick);

      const bindButton = (button, name) => {
        if (!button) return;
        const release = (event) => {
          if (event?.pointerId !== undefined && button.dataset.pointerId && String(event.pointerId) !== button.dataset.pointerId) return;
          delete button.dataset.pointerId;
          button.classList.remove("is-pressed");
          this.post("input", { name, value: false });
        };
        button.addEventListener("pointerdown", (event) => {
          if (!this.raceActive || this.paused) return;
          event.preventDefault();
          button.dataset.pointerId = String(event.pointerId);
          button.classList.add("is-pressed");
          try { button.setPointerCapture(event.pointerId); } catch { /* capture is optional */ }
          this.post("input", { name, value: true });
        });
        button.addEventListener("pointerup", release);
        button.addEventListener("pointercancel", release);
        button.addEventListener("lostpointercapture", release);
      };
      bindButton(this.driftButton, "drift");
      bindButton(this.itemButton, "item");
    }

    setControlScheme(scheme) {
      const next = scheme === "tilt" ? "tilt" : "floating";
      if (next === this.controlScheme) return;
      this.controlScheme = next;
      if (this.controls) this.controls.dataset.scheme = next;
      if (next === "tilt") this.releaseInputs();
    }

    releaseInputs(notifyFrame = true) {
      this.steerPointerId = null;
      if (this.joystickKnob) this.joystickKnob.style.transform = "translate(0px, 0px)";
      for (const button of [this.driftButton, this.itemButton]) {
        if (!button) continue;
        delete button.dataset.pointerId;
        button.classList.remove("is-pressed");
      }
      if (notifyFrame && this.ready) this.post("release-input");
    }

    handleMessage(event) {
      if (event.source !== this.frame?.contentWindow || event.origin !== window.location.origin) return;
      const message = event.data;
      if (!message || message.source !== GAME_SOURCE) return;
      if (message.type === "ready") {
        this.ready = true;
        if (this.loadTimer) window.clearTimeout(this.loadTimer);
        this.loadTimer = 0;
        if (this.progressTimer) window.clearInterval(this.progressTimer);
        this.progressTimer = 0;
        this.setProgress(100, "Circuit ready!");
        this.setLoading(false);
        this.startButton?.classList.remove("hidden");
        this.restartButton?.classList.add("hidden");
        this.onReady?.();
        return;
      }
      if (message.type === "progress") {
        this.setProgress(message.percent, message.label);
        return;
      }
      if (message.type === "state") {
        this.paused = Boolean(message.paused);
        this.setControlScheme(message.controlScheme);
        if (this.pauseButton) this.pauseButton.textContent = this.paused ? "Resume" : "Pause";
        if (message.racing && !this.raceActive) {
          this.raceActive = true;
          this.onRaceStart?.();
        } else if (!message.racing && this.raceActive) {
          this.raceActive = false;
          this.releaseInputs();
        }
        this.onPauseChange?.(this.paused);
        return;
      }
      if (message.type === "finish") {
        this.raceActive = false;
        this.releaseInputs();
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

    setProgress(percent, label = "") {
      const next = Math.max(this.progress, Math.max(0, Math.min(100, Math.round(Number(percent) || 0))));
      this.progress = next;
      if (this.progressBar) this.progressBar.style.width = `${next}%`;
      if (this.progressPercent) this.progressPercent.textContent = `${next}%`;
      if (this.progressTrack) this.progressTrack.setAttribute("aria-valuenow", String(next));
      if (label && this.progressStep) {
        const clean = String(label).replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
        this.progressStep.textContent = `${clean}...`;
      }
    }
  }

  window.ArcadiaXtremeRacing = ArcadiaXtremeRacing;
})();
