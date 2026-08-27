(() => {
  "use strict";

  const MESSAGE_SOURCE = "arcadia-sm-kart-zx";
  const PORT_URL = "games/sm-kart-zx/index.html";
  const DRIVE_DEAD_ZONE = 0.24;
  const STEER_DEAD_ZONE = 0.18;
  const RACE_STATE_SAMPLE_PERIOD = 320;
  const TITLE_REVEAL_DELAY = 1550;
  const INTRO_ADVANCE_DELAY = 4600;
  const LOAD_TIMEOUT = 45_000;

  class ArcadiaSMKartZX {
    constructor(options = {}) {
      this.frame = options.frame;
      this.loading = options.loading;
      this.loadingText = options.loadingText;
      this.startButton = options.startButton;
      this.restartButton = options.restartButton;
      this.pauseButton = options.pauseButton;
      this.controls = options.controls;
      this.joystick = options.joystick;
      this.joystickKnob = options.joystickKnob;
      this.jumpButton = options.jumpButton;
      this.itemButton = options.itemButton;
      this.onReady = options.onReady || (() => {});
      this.onTitleReady = options.onTitleReady || (() => {});
      this.onStart = options.onStart || (() => {});
      this.onPauseChange = options.onPauseChange || (() => {});
      this.onItemState = options.onItemState || (() => {});
      this.onAudioState = options.onAudioState || (() => {});
      this.onRecover = options.onRecover || (() => {});
      this.ready = false;
      this.loadFailed = false;
      this.titleReady = false;
      this.started = false;
      this.paused = false;
      this.itemReady = false;
      this.audioRunning = false;
      this.audioContextCount = 0;
      this.joystickPointerId = null;
      this.joystickValue = { x: 0, y: 0 };
      this.inputState = new Map();
      this.introTimer = null;
      this.titleTimer = null;
      this.raceStateTimer = null;
      this.raceActive = false;
      this.raceLitSamples = 0;
      this.raceQuietSamples = 0;
      this.loadTimeoutTimer = null;
      this.itemArmTimer = null;
      this.itemSampleTimer = null;
      this.itemBaseline = null;
      this.itemQuietSamples = 0;
      this.loadSequence = 0;
      this.version = "1";
      this.boundMessage = (event) => this.handleMessage(event);
      this.boundVisibility = () => {
        if (document.hidden) this.releaseAll();
      };
      this.bindControls();
      window.addEventListener("message", this.boundMessage);
      document.addEventListener("visibilitychange", this.boundVisibility);
    }

    bindControls() {
      this.joystick?.addEventListener("pointerdown", (event) => {
        if (!this.started) return;
        event.preventDefault();
        this.resumeAudio();
        this.joystickPointerId = event.pointerId;
        try {
          this.joystick.setPointerCapture?.(event.pointerId);
        } catch {
          // Some embedded browsers omit pointer capture; document-level pointer events still release input.
        }
        this.updateJoystick(event);
      });
      this.joystick?.addEventListener("pointermove", (event) => {
        if (event.pointerId !== this.joystickPointerId) return;
        event.preventDefault();
        this.updateJoystick(event);
      });
      const releaseJoystick = (event) => {
        if (event.pointerId !== this.joystickPointerId) return;
        event.preventDefault();
        this.joystickPointerId = null;
        this.resetJoystick();
      };
      this.joystick?.addEventListener("pointerup", releaseJoystick);
      this.joystick?.addEventListener("pointercancel", releaseJoystick);
      document.addEventListener("pointerup", releaseJoystick);
      document.addEventListener("pointercancel", releaseJoystick);

      this.jumpButton?.addEventListener("pointerdown", (event) => {
        if (!this.started) return;
        event.preventDefault();
        this.resumeAudio();
        if (!this.inputState.get("accelerate")) this.tap("accelerate", 86);
        this.tap("jump", 92);
      });

      this.itemButton?.addEventListener("pointerdown", (event) => {
        if (!this.started || !this.itemReady) return;
        event.preventDefault();
        this.resumeAudio();
        this.setInput("item", true);
        this.itemButton.classList.add("is-pressed");
      });
      const releaseItem = (event) => {
        if (!this.inputState.get("item")) return;
        event?.preventDefault?.();
        this.setInput("item", false);
        this.itemButton?.classList.remove("is-pressed");
      };
      this.itemButton?.addEventListener("pointerup", releaseItem);
      this.itemButton?.addEventListener("pointercancel", releaseItem);
      this.itemButton?.addEventListener("pointerleave", releaseItem);

      this.startButton?.addEventListener("pointerdown", () => {
        if (this.ready) this.resumeAudio();
      });
    }

    load(version = "1") {
      this.version = version;
      this.loadSequence += 1;
      this.clearTimers();
      this.releaseAll();
      this.ready = false;
      this.loadFailed = false;
      this.titleReady = false;
      this.started = false;
      this.paused = false;
      this.audioRunning = false;
      this.audioContextCount = 0;
      this.raceActive = false;
      this.raceLitSamples = 0;
      this.raceQuietSamples = 0;
      this.itemBaseline = null;
      this.setItemReady(false);
      this.setLoading(true, "Loading Super Mario Kart ZX...");
      this.controls?.classList.remove("is-active");
      this.startButton?.classList.add("hidden");
      this.restartButton?.classList.add("hidden");
      if (this.pauseButton) {
        this.pauseButton.disabled = true;
        this.pauseButton.textContent = "Pause";
      }
      if (window.location.protocol === "file:") {
        this.loadFailed = true;
        if (this.frame) this.frame.src = "about:blank";
        this.setLoading(
          true,
          "Mario Kart needs web mode. Close this tab and double-click Launch ARCADIA.cmd in the ARCADIA folder.",
          true
        );
        return;
      }
      if (this.frame) {
        this.frame.src = `${PORT_URL}?arcadia=${encodeURIComponent(version)}&run=${this.loadSequence}`;
        this.loadTimeoutTimer = window.setTimeout(() => {
          if (this.ready) return;
          this.loadFailed = true;
          this.setLoading(true, "Mario Kart could not finish loading. Check your connection, then tap Restart.", true);
          this.restartButton?.classList.remove("hidden");
        }, LOAD_TIMEOUT);
      }
    }

    stop() {
      this.clearTimers();
      this.releaseAll();
      this.ready = false;
      this.loadFailed = false;
      this.titleReady = false;
      this.started = false;
      this.paused = false;
      this.audioRunning = false;
      this.audioContextCount = 0;
      this.raceActive = false;
      this.raceLitSamples = 0;
      this.raceQuietSamples = 0;
      this.itemBaseline = null;
      this.setItemReady(false);
      this.controls?.classList.remove("is-active");
      if (this.frame) this.frame.src = "about:blank";
    }

    restart(version = "1") {
      this.load(version);
    }

    handleMessage(event) {
      if (event.origin !== window.location.origin || event.source !== this.frame?.contentWindow) return;
      const data = event.data;
      if (!data || data.source !== MESSAGE_SOURCE) return;
      if (data.type === "status" && data.text && !this.loadFailed) this.setLoading(true, data.text);
      if (data.type === "error") this.handleLoadError(data.text);
      if (data.type === "ready") this.handleReady();
      if (data.type === "audio") this.handleAudioState(data);
      if (data.type === "black-screen") this.handleBlackScreen();
    }

    handleAudioState(data = {}) {
      const wasRunning = this.audioRunning;
      this.audioRunning = Boolean(data.running);
      this.audioContextCount = Math.max(0, Number(data.contexts) || 0);
      if (wasRunning !== this.audioRunning) {
        this.onAudioState(this.audioRunning, {
          contexts: this.audioContextCount,
          states: Array.isArray(data.states) ? data.states.slice() : []
        });
      }
    }

    handleBlackScreen() {
      if (!this.started || this.loadFailed) return;
      this.onRecover();
      this.load(this.version);
      this.setLoading(true, "Recovering the Mario Kart display...");
    }

    handleLoadError(text = "") {
      window.clearTimeout(this.loadTimeoutTimer);
      this.loadTimeoutTimer = null;
      this.loadFailed = true;
      const message = /wasm|runner\.data|game\.unx|network|fetch|abort/i.test(text)
        ? "Mario Kart could not download its game files. Check your connection, then tap Restart."
        : "Mario Kart hit a loading error. Tap Restart to try again.";
      this.setLoading(true, message, true);
      this.restartButton?.classList.remove("hidden");
    }

    handleReady() {
      if (this.ready) return;
      this.loadFailed = false;
      window.clearTimeout(this.loadTimeoutTimer);
      this.loadTimeoutTimer = null;
      this.ready = true;
      this.setLoading(false);
      this.onReady();
      this.introTimer = window.setTimeout(() => {
        if (!this.ready || this.titleReady) return;
        this.advanceToTitle();
      }, INTRO_ADVANCE_DELAY);
    }

    async advanceToTitle() {
      if (!this.ready) return;
      await this.resumeAudio();
      this.tap("start", 110);
      window.clearTimeout(this.titleTimer);
      this.titleTimer = window.setTimeout(() => {
        this.titleReady = true;
        this.startButton?.classList.remove("hidden");
        this.restartButton?.classList.remove("hidden");
        this.onTitleReady();
      }, TITLE_REVEAL_DELAY);
    }

    async start() {
      if (!this.titleReady || this.started) return false;
      await this.resumeAudio();
      this.tap("accelerate", 110);
      this.started = true;
      this.paused = false;
      this.startButton?.classList.add("hidden");
      this.controls?.classList.add("is-active");
      this.startRaceStateDetector();
      if (this.pauseButton) {
        this.pauseButton.disabled = false;
        this.pauseButton.textContent = "Pause";
      }
      this.onStart();
      return true;
    }

    async togglePause() {
      if (!this.started) return false;
      await this.resumeAudio();
      this.tap("start", 100);
      this.paused = !this.paused;
      this.pauseButton.textContent = this.paused ? "Resume" : "Pause";
      if (this.paused) this.releaseAll();
      this.onPauseChange(this.paused);
      return this.paused;
    }

    async resumeAudio() {
      try {
        const resume = this.frame?.contentWindow?.arcadiaSMKResumeAudio;
        if (typeof resume === "function") return await resume();
      } catch {}
      this.post({ type: "resume-audio" });
      return false;
    }

    post(payload) {
      this.frame?.contentWindow?.postMessage({ source: MESSAGE_SOURCE, ...payload }, window.location.origin);
    }

    setInput(name, pressed) {
      if (!this.ready) return;
      if (Boolean(this.inputState.get(name)) === Boolean(pressed)) return;
      this.inputState.set(name, Boolean(pressed));
      try {
        const input = this.frame?.contentWindow?.arcadiaSMKInput;
        if (typeof input === "function") {
          input(name, Boolean(pressed));
          return;
        }
      } catch {}
      this.post({ type: "input", name, pressed: Boolean(pressed) });
    }

    tap(name, duration = 90) {
      if (!this.ready) return;
      try {
        const tap = this.frame?.contentWindow?.arcadiaSMKTap;
        if (typeof tap === "function") {
          tap(name, duration);
          return;
        }
      } catch {}
      this.post({ type: "tap", name, duration });
    }

    releaseAll() {
      this.clearSteeringInput();
      for (const [name, pressed] of this.inputState) {
        if (pressed) this.setInput(name, false);
      }
      this.inputState.clear();
      try {
        this.frame?.contentWindow?.arcadiaSMKReleaseAll?.();
      } catch {
        this.post({ type: "release-all" });
      }
      this.itemButton?.classList.remove("is-pressed");
    }

    updateJoystick(event) {
      const rect = this.joystick.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const radius = rect.width * 0.34;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy);
      const scale = distance > radius ? radius / distance : 1;
      const x = dx * scale;
      const y = dy * scale;
      this.joystickValue = { x: x / radius, y: y / radius };
      this.joystickKnob.style.transform = `translate(${x}px, ${y}px)`;
      this.applyJoystickInput();
    }

    applyJoystickInput() {
      const { x, y } = this.joystickValue;
      this.applySteeringInput(x);
      const forward = y < -DRIVE_DEAD_ZONE;
      const reverse = y > DRIVE_DEAD_ZONE;
      this.setInput("up", forward);
      this.setInput("down", reverse);
      this.setInput("accelerate", this.raceActive && forward && !this.paused);
      this.setInput("back", this.raceActive && reverse && !this.paused);
      if (this.raceActive && forward) this.scheduleItemDetector();
    }

    applySteeringInput(value) {
      const direction = value < -STEER_DEAD_ZONE ? "left" : value > STEER_DEAD_ZONE ? "right" : null;
      this.setInput("left", direction === "left");
      this.setInput("right", direction === "right");
    }

    clearSteeringInput() {
      this.setInput("left", false);
      this.setInput("right", false);
    }

    resetJoystick() {
      this.joystickValue = { x: 0, y: 0 };
      if (this.joystickKnob) this.joystickKnob.style.transform = "translate(0, 0)";
      this.clearSteeringInput();
      for (const name of ["up", "down", "accelerate", "back"]) this.setInput(name, false);
    }

    startRaceStateDetector() {
      window.clearInterval(this.raceStateTimer);
      this.raceStateTimer = window.setInterval(() => this.detectRaceState(), RACE_STATE_SAMPLE_PERIOD);
      this.detectRaceState();
    }

    detectRaceState() {
      if (!this.started) return;
      const sample = this.sampleItemHud();
      if (!sample) return;
      if (sample.hasHolder) {
        this.raceLitSamples += 1;
        this.raceQuietSamples = 0;
        if (this.raceLitSamples >= 2) this.setRaceActive(true);
        return;
      }
      this.raceLitSamples = 0;
      this.raceQuietSamples += 1;
      if (this.raceQuietSamples >= 2) this.setRaceActive(false);
    }

    setRaceActive(active) {
      const next = Boolean(active);
      if (this.raceActive === next) return;
      this.raceActive = next;
      if (!next) {
        this.setInput("accelerate", false);
        this.setInput("back", false);
        this.setItemReady(false);
      }
      this.applyJoystickInput();
    }

    scheduleItemDetector() {
      if (this.itemBaseline || this.itemArmTimer || this.itemSampleTimer) return;
      this.itemArmTimer = window.setTimeout(() => {
        this.itemArmTimer = null;
        this.detectItemState();
        this.itemSampleTimer = window.setInterval(() => this.detectItemState(), 360);
      }, 900);
    }

    sampleItemHud() {
      try {
        const source = this.frame?.contentDocument?.getElementById("canvas");
        if (!source || !source.width || !source.height) return null;
        const sample = document.createElement("canvas");
        sample.width = 84;
        sample.height = 60;
        const context = sample.getContext("2d", { willReadFrequently: true });
        context.imageSmoothingEnabled = false;
        const sourceWidth = Math.max(28, Math.round(source.width * 0.07));
        const sourceHeight = Math.max(20, Math.round(source.height * 0.0893));
        const sourceX = Math.round(source.width * 0.5 - sourceWidth / 2);
        const sourceY = Math.round(source.height * 0.009);
        context.drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 84, 60);
        const pixels = context.getImageData(0, 0, 84, 60).data;
        let cyanPixels = 0;
        let lightPixels = 0;
        let darkPixels = 0;
        for (let index = 0; index < pixels.length; index += 4) {
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          if (green > 115 && blue > 135 && blue > red * 1.25) cyanPixels += 1;
          if (red > 180 && green > 180 && blue > 180) lightPixels += 1;
          if (red < 24 && green < 28 && blue < 24) darkPixels += 1;
        }
        const hasHolder = cyanPixels >= 160 && lightPixels >= 260 && darkPixels >= 1400;
        return { pixels, hasHolder };
      } catch {
        return null;
      }
    }

    detectItemState() {
      if (!this.started) return;
      const current = this.sampleItemHud();
      if (!current?.hasHolder) {
        this.itemBaseline = null;
        this.itemQuietSamples = 0;
        this.setItemReady(false);
        return;
      }
      if (!this.itemBaseline) {
        this.itemBaseline = new Uint8ClampedArray(current.pixels);
        this.itemQuietSamples = 0;
        this.setItemReady(false);
        return;
      }
      let difference = 0;
      let comparedChannels = 0;
      for (let y = 6; y < 54; y += 1) {
        for (let x = 18; x < 66; x += 1) {
          const index = (y * 84 + x) * 4;
          difference += Math.abs(current.pixels[index] - this.itemBaseline[index]);
          difference += Math.abs(current.pixels[index + 1] - this.itemBaseline[index + 1]);
          difference += Math.abs(current.pixels[index + 2] - this.itemBaseline[index + 2]);
          comparedChannels += 3;
        }
      }
      difference /= comparedChannels;
      if (difference > 14) {
        this.itemQuietSamples = 0;
        this.setItemReady(true);
      } else if (difference < 6) {
        this.itemQuietSamples += 1;
        if (this.itemQuietSamples >= 3) this.setItemReady(false);
      }
    }

    setItemReady(ready) {
      this.itemReady = Boolean(ready);
      this.itemButton?.classList.toggle("is-ready", this.itemReady);
      this.itemButton?.classList.toggle("hidden", !this.itemReady);
      if (this.itemButton) this.itemButton.disabled = !this.itemReady;
      this.onItemState(this.itemReady);
    }

    setLoading(active, text = "", isError = false) {
      this.loading?.classList.toggle("hidden", !active);
      this.loading?.classList.toggle("is-error", active && isError);
      if (text && this.loadingText) this.loadingText.textContent = text;
    }

    clearTimers() {
      for (const timer of [this.introTimer, this.titleTimer, this.itemArmTimer, this.loadTimeoutTimer]) {
        window.clearTimeout(timer);
      }
      window.clearInterval(this.itemSampleTimer);
      window.clearInterval(this.raceStateTimer);
      this.introTimer = null;
      this.titleTimer = null;
      this.raceStateTimer = null;
      this.loadTimeoutTimer = null;
      this.itemArmTimer = null;
      this.itemSampleTimer = null;
    }
  }

  window.ArcadiaSMKartZX = ArcadiaSMKartZX;
})();
