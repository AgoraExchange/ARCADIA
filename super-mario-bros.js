(() => {
  "use strict";

  const MESSAGE_SOURCE = "arcadia-super-mario-bros";
  const GAME_PATH = "games/super-mario-bros/index.html";

  class ArcadiaSuperMarioBros {
    constructor(options = {}) {
      Object.assign(this, options);
      this.ready = false;
      this.started = false;
      this.paused = true;
      this.loadToken = 0;
      this.loadTimer = null;
      this.joystickPointerId = null;
      this.heldInputs = new Set();
      this.actionPressedAt = new Map();
      this.actionReleaseTimers = new Map();
      this.boundMessage = this.handleMessage.bind(this);
      window.addEventListener("message", this.boundMessage);
      this.bindJoystick();
      this.bindJumpButton(this.jumpButton);
      this.bindActionButton(this.sprintButton, "sprint");
    }

    frameApi() {
      try {
        return this.frame?.contentWindow?.ArcadiaMario || null;
      } catch {
        return null;
      }
    }

    updateUi() {
      this.loading?.classList.toggle("hidden", this.ready);
      this.titleOverlay?.classList.toggle("hidden", this.started);
      this.worldLabel?.classList.toggle("is-active", this.ready);
      if (this.worldLabel) this.worldLabel.disabled = !this.ready;
      this.startButton?.classList.toggle("hidden", !this.ready || this.started);
      this.restartButton?.classList.toggle("hidden", !this.ready);
      this.controls?.classList.toggle("is-active", this.started);
      if (this.pauseButton) {
        this.pauseButton.disabled = !this.started;
        this.pauseButton.textContent = this.paused && this.started ? "Resume" : "Pause";
      }
    }

    load(version = Date.now()) {
      this.loadToken += 1;
      this.ready = false;
      this.started = false;
      this.paused = true;
      this.releaseInputs();
      if (this.loadingText) this.loadingText.textContent = "Loading all 32 levels...";
      this.updateUi();
      window.clearTimeout(this.loadTimer);
      this.loadTimer = window.setTimeout(() => {
        if (this.ready || !this.loadingText) return;
        this.loadingText.textContent = "Still loading the Mushroom Kingdom...";
      }, 9000);
      this.frame.src = `${GAME_PATH}?v=${encodeURIComponent(version)}-${this.loadToken}`;
    }

    restart(version) {
      this.load(version);
    }

    stop() {
      window.clearTimeout(this.loadTimer);
      this.releaseInputs();
      this.frameApi()?.pause?.();
      this.ready = false;
      this.started = false;
      this.paused = true;
      if (this.frame) this.frame.src = "about:blank";
      this.updateUi();
    }

    start(options = {}) {
      const api = this.frameApi();
      if (!this.ready || !api?.start?.(options)) return false;
      this.started = true;
      this.paused = false;
      this.updateUi();
      this.onStart?.();
      return true;
    }

    setWorldLabel(map) {
      const label = `WORLD ${map || "1-1"}`;
      if (this.worldLabelText) this.worldLabelText.textContent = label;
      else if (this.worldLabel) this.worldLabel.textContent = label;
    }

    currentMap() {
      return String(this.frameApi()?.getState?.().map || "1-1");
    }

    pause() {
      if (!this.started || this.paused) return false;
      this.releaseInputs();
      this.paused = Boolean(this.frameApi()?.pause?.());
      this.updateUi();
      this.onPauseChange?.(this.paused);
      return this.paused;
    }

    resume() {
      if (!this.started || !this.paused) return false;
      this.paused = Boolean(this.frameApi()?.resume?.());
      this.updateUi();
      this.onPauseChange?.(this.paused);
      return !this.paused;
    }

    selectLevel(map, options = {}) {
      const level = String(map || "");
      const resume = Boolean(this.started && options.resume);
      this.releaseInputs();
      if (!this.ready || !this.frameApi()?.selectLevel?.(level, { resume })) return false;
      this.paused = !resume;
      this.setWorldLabel(level);
      this.updateUi();
      this.onMapChange?.({ map: level, selected: true });
      return true;
    }

    togglePause() {
      if (!this.started) return;
      const api = this.frameApi();
      if (!api) return;
      this.paused = Boolean(api.togglePause());
      this.updateUi();
      this.onPauseChange?.(this.paused);
    }

    setInput(name, pressed) {
      if (!this.started || this.paused) pressed = false;
      if (this.heldInputs.has(name) === pressed) return;
      const api = this.frameApi();
      if (api?.setInput) api.setInput(name, pressed);
      else this.frame?.contentWindow?.postMessage({ source: "arcadia", type: "input", name, pressed }, window.location.origin);
      if (pressed) this.heldInputs.add(name);
      else this.heldInputs.delete(name);
    }

    releaseInputs() {
      this.actionReleaseTimers.forEach((timer) => window.clearTimeout(timer));
      this.actionReleaseTimers.clear();
      this.actionPressedAt.clear();
      [...this.heldInputs].forEach((name) => this.setInput(name, false));
      this.heldInputs.clear();
      this.frameApi()?.releaseInputs?.();
      if (this.joystickKnob) this.joystickKnob.style.transform = "translate(0px, 0px)";
    }

    pressJump() {
      if (!this.started || this.paused) return false;
      const api = this.frameApi();
      if (api?.pressJump) return Boolean(api.pressJump());
      this.frame?.contentWindow?.postMessage({ source: "arcadia", type: "jump" }, window.location.origin);
      return true;
    }

    bindJumpButton(button) {
      if (!button) return;
      const release = (event) => {
        event?.preventDefault?.();
        button.classList.remove("is-pressed");
      };
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        button.setPointerCapture?.(event.pointerId);
        this.pressJump();
        button.classList.add("is-pressed");
      });
      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("lostpointercapture", release);
    }

    bindActionButton(button, input, minimumHoldMs = 0) {
      if (!button) return;
      const release = (event) => {
        event?.preventDefault?.();
        button.classList.remove("is-pressed");
        window.clearTimeout(this.actionReleaseTimers.get(input));
        const pressedAt = Number(this.actionPressedAt.get(input)) || Date.now();
        const remaining = Math.max(0, minimumHoldMs - (Date.now() - pressedAt));
        const finishRelease = () => {
          this.actionReleaseTimers.delete(input);
          this.actionPressedAt.delete(input);
          this.setInput(input, false);
        };
        if (remaining > 0) {
          this.actionReleaseTimers.set(input, window.setTimeout(finishRelease, remaining));
        } else {
          finishRelease();
        }
      };
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        button.setPointerCapture?.(event.pointerId);
        window.clearTimeout(this.actionReleaseTimers.get(input));
        this.actionReleaseTimers.delete(input);
        this.actionPressedAt.set(input, Date.now());
        this.setInput(input, true);
        button.classList.add("is-pressed");
      });
      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("lostpointercapture", release);
    }

    bindJoystick() {
      if (!this.joystick) return;
      const move = (event) => {
        if (event.pointerId !== this.joystickPointerId) return;
        event.preventDefault();
        const rect = this.joystick.getBoundingClientRect();
        const radius = Math.max(1, Math.min(rect.width, rect.height) / 2);
        let x = (event.clientX - (rect.left + rect.width / 2)) / radius;
        let y = (event.clientY - (rect.top + rect.height / 2)) / radius;
        const magnitude = Math.hypot(x, y);
        if (magnitude > 1) {
          x /= magnitude;
          y /= magnitude;
        }
        if (this.joystickKnob) {
          const travel = radius * 0.43;
          this.joystickKnob.style.transform = `translate(${x * travel}px, ${y * travel}px)`;
        }
        const horizontal = Math.abs(x) >= 0.26;
        this.setInput("left", horizontal && x < 0);
        this.setInput("right", horizontal && x > 0);
        this.setInput("down", y >= 0.56);
      };
      const release = (event) => {
        if (event?.pointerId !== undefined && event.pointerId !== this.joystickPointerId) return;
        event?.preventDefault?.();
        this.joystickPointerId = null;
        ["left", "right", "down"].forEach((name) => this.setInput(name, false));
        if (this.joystickKnob) this.joystickKnob.style.transform = "translate(0px, 0px)";
      };
      this.joystick.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        this.joystickPointerId = event.pointerId;
        this.joystick.setPointerCapture?.(event.pointerId);
        move(event);
      });
      this.joystick.addEventListener("pointermove", move);
      this.joystick.addEventListener("pointerup", release);
      this.joystick.addEventListener("pointercancel", release);
      this.joystick.addEventListener("lostpointercapture", release);
    }

    handleMessage(event) {
      if (event.origin !== window.location.origin || event.source !== this.frame?.contentWindow) return;
      const message = event.data;
      if (message?.source !== MESSAGE_SOURCE) return;
      if (message.type === "ready") {
        window.clearTimeout(this.loadTimer);
        this.ready = true;
        this.paused = true;
        this.setWorldLabel(message.map);
        this.updateUi();
        this.onReady?.(message);
      }
      if (message.type === "started") {
        this.started = true;
        this.paused = false;
        this.setWorldLabel(message.map);
        this.updateUi();
      }
      if (message.type === "pause-state") {
        this.paused = Boolean(message.paused);
        this.updateUi();
      }
      if (message.type === "level-complete") {
        this.setWorldLabel(message.nextLevel || message.level);
        this.onLevelComplete?.(message);
      }
      if (message.type === "map-change") {
        this.setWorldLabel(message.map);
        this.onMapChange?.(message);
      }
      if (message.type === "error") {
        window.clearTimeout(this.loadTimer);
        if (this.loadingText) this.loadingText.textContent = "Loading error - tap Restart to try again.";
        this.onError?.(message);
      }
    }
  }

  window.ArcadiaSuperMarioBros = ArcadiaSuperMarioBros;
})();
