(() => {
  "use strict";

  const MESSAGE_SOURCE = "arcadia-sm-kart-zx";
  const PORT_URL = "games/sm-kart-zx/index.html";
  const DRIVE_DEAD_ZONE = 0.24;
  const MENU_STEER_DEAD_ZONE = 0.18;
  const STEER_ENTER_DEAD_ZONE = 0.16;
  const STEER_EXIT_DEAD_ZONE = 0.1;
  const FULL_STEER_THRESHOLD = 0.7;
  const STEER_PULSE_PERIOD = 64;
  const STEER_MIN_HOLD = 22;
  const STEER_MAX_HOLD = 58;
  const RACE_STATE_SAMPLE_PERIOD = 320;
  const RESULT_CONFIRM_SAMPLES = 2;
  const RESULT_ADVANCE_DELAYS = [5200, 6800];
  const PROGRESS_SAMPLE_PERIOD = 1800;
  const TITLE_REVEAL_DELAY = 1550;
  const INTRO_ADVANCE_DELAY = 4600;
  const LOAD_TIMEOUT = 45_000;
  const KART_CUP_NAMES = ["mushroom", "flower", "star", "special", "super"];

  function getSteeringProfile(value, activeDirection = null) {
    const horizontal = Math.max(-1, Math.min(1, Number(value) || 0));
    const magnitude = Math.abs(horizontal);
    const candidate = horizontal < 0 ? "left" : horizontal > 0 ? "right" : null;
    const threshold = candidate && candidate === activeDirection
      ? STEER_EXIT_DEAD_ZONE
      : STEER_ENTER_DEAD_ZONE;
    if (!candidate || magnitude < threshold) {
      return { direction: null, strength: 0, continuous: false, heldFor: 0 };
    }

    const strength = Math.min(
      1,
      Math.max(0, (magnitude - STEER_ENTER_DEAD_ZONE) / (1 - STEER_ENTER_DEAD_ZONE))
    );
    const curvedStrength = Math.pow(strength, 0.72);
    const continuous = magnitude >= FULL_STEER_THRESHOLD;
    const heldFor = continuous
      ? STEER_PULSE_PERIOD
      : Math.round(STEER_MIN_HOLD + curvedStrength * (STEER_MAX_HOLD - STEER_MIN_HOLD));
    return { direction: candidate, strength, continuous, heldFor };
  }

  function detectRaceResultPlace(source) {
    if (!source?.width || !source?.height) return 0;
    try {
      const header = document.createElement("canvas");
      header.width = 160;
      header.height = 28;
      const headerContext = header.getContext("2d", { willReadFrequently: true });
      headerContext.imageSmoothingEnabled = false;
      headerContext.drawImage(
        source,
        Math.round(120 * source.width / 400),
        Math.round(4 * source.height / 224),
        Math.max(1, Math.round(160 * source.width / 400)),
        Math.max(1, Math.round(28 * source.height / 224)),
        0,
        0,
        160,
        28
      );
      const headerPixels = headerContext.getImageData(0, 0, 160, 28).data;
      let redPixels = 0;
      let whitePixels = 0;
      for (let index = 0; index < headerPixels.length; index += 4) {
        const red = headerPixels[index];
        const green = headerPixels[index + 1];
        const blue = headerPixels[index + 2];
        if (red >= 145 && red > green * 1.3 && red > blue * 1.18) redPixels += 1;
        if (red >= 175 && green >= 175 && blue >= 175) whitePixels += 1;
      }
      if (redPixels < 30 || whitePixels < 35) return 0;

      const sample = document.createElement("canvas");
      sample.width = 16;
      sample.height = 120;
      const context = sample.getContext("2d", { willReadFrequently: true });
      context.imageSmoothingEnabled = false;
      const scaleX = source.width / 400;
      const scaleY = source.height / 224;
      context.drawImage(
        source,
        Math.round(380 * scaleX),
        Math.round(64 * scaleY),
        Math.max(1, Math.round(16 * scaleX)),
        Math.max(1, Math.round(120 * scaleY)),
        0,
        0,
        16,
        120
      );
      const pixels = context.getImageData(0, 0, 16, 120).data;
      for (let row = 0; row < 8; row += 1) {
        let cyanPixels = 0;
        for (let y = row * 16; y < row * 16 + 8; y += 1) {
          for (let x = 0; x < 16; x += 1) {
            const index = (y * 16 + x) * 4;
            const red = pixels[index];
            const green = pixels[index + 1];
            const blue = pixels[index + 2];
            if (green >= 150 && blue >= 190 && red <= 70 && blue >= green * 0.85) cyanPixels += 1;
          }
        }
        if (cyanPixels >= 9) return row + 1;
      }
    } catch {}
    return 0;
  }

  function parseKartProgress(text) {
    if (typeof text !== "string" || !text.trim()) return null;
    const values = (text.match(/[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) || []).map(Number);
    if (!values.length || !values.every(Number.isFinite)) return null;
    const revolutions = Math.max(0, Math.min(20, Math.round(values[0])));
    const classCount = 3 + revolutions;
    const trophyCount = classCount * KART_CUP_NAMES.length;
    if (values.length < 1 + trophyCount) return null;

    const cups = {};
    let index = 1;
    for (let classIndex = 0; classIndex < classCount; classIndex += 1) {
      const cc = 50 + classIndex * 50;
      cups[cc] = {};
      for (const cup of KART_CUP_NAMES) {
        cups[cc][cup] = Math.max(0, Math.min(3, Math.round(values[index++] || 0)));
      }
    }

    const baseClasses = [50, 100, 150];
    const countedTrophies = baseClasses.reduce((total, cc) => (
      total + KART_CUP_NAMES.slice(0, 4).filter((cup) => cups[cc]?.[cup] > 0).length
    ), 0);
    const gold100 = KART_CUP_NAMES.slice(0, 4).filter((cup) => cups[100]?.[cup] === 1).length;
    const gold150 = KART_CUP_NAMES.slice(0, 4).filter((cup) => cups[150]?.[cup] === 1).length;
    const specialUnlocked = countedTrophies >= 6 || gold100 >= 3;
    const class150Unlocked = countedTrophies >= 7 || gold100 >= 4;
    const superUnlocked = countedTrophies >= 11 || gold100 + gold150 >= 8;
    const completedClasses = Object.keys(cups).map(Number).filter((cc) => {
      const requiredCups = cc === 50 ? 3 : cc === 100 ? 4 : 5;
      return KART_CUP_NAMES.slice(0, requiredCups).every((cup) => cups[cc]?.[cup] > 0);
    });
    const totalTrophies = Object.values(cups).reduce((total, classCups) => (
      total + Object.values(classCups).filter((trophy) => trophy > 0).length
    ), 0);
    const goldTrophies = Object.values(cups).reduce((total, classCups) => (
      total + Object.values(classCups).filter((trophy) => trophy === 1).length
    ), 0);

    return {
      revolutions,
      cups,
      completedClasses,
      totalTrophies,
      goldTrophies,
      unlockedClasses: [
        50,
        100,
        ...(class150Unlocked ? [150] : []),
        ...Object.keys(cups).map(Number).filter((cc) => cc > 150)
      ],
      specialUnlocked,
      superUnlocked,
      highCcUnlocked: revolutions > 0
    };
  }

  class ArcadiaSMKartZX {
    constructor(options = {}) {
      this.frame = options.frame;
      this.loading = options.loading;
      this.loadingText = options.loadingText;
      this.continueButton = options.continueButton;
      this.startButton = options.startButton;
      this.restartButton = options.restartButton;
      this.pauseButton = options.pauseButton;
      this.controls = options.controls;
      this.joystick = options.joystick;
      this.joystickKnob = options.joystickKnob;
      this.jumpButton = options.jumpButton;
      this.backButton = options.backButton;
      this.classButton = options.classButton;
      this.onReady = options.onReady || (() => {});
      this.onTitleReady = options.onTitleReady || (() => {});
      this.onStart = options.onStart || (() => {});
      this.onPauseChange = options.onPauseChange || (() => {});
      this.onAudioState = options.onAudioState || (() => {});
      this.onReplayUnavailable = options.onReplayUnavailable || (() => {});
      this.onRaceResult = options.onRaceResult || (() => {});
      this.onProgress = options.onProgress || (() => {});
      this.onRecoveryState = options.onRecoveryState || (() => {});
      this.onRecover = options.onRecover || (() => {});
      this.ready = false;
      this.loadFailed = false;
      this.titleReady = false;
      this.started = false;
      this.paused = false;
      this.audioRunning = false;
      this.audioContextCount = 0;
      this.joystickPointerId = null;
      this.joystickValue = { x: 0, y: 0 };
      this.inputState = new Map();
      this.steeringTimer = null;
      this.steeringReleaseTimer = null;
      this.steeringDirection = null;
      this.steeringStrength = 0;
      this.steeringContinuous = false;
      this.introTimer = null;
      this.titleTimer = null;
      this.introGateOpen = false;
      this.advancingToTitle = false;
      this.raceStateTimer = null;
      this.raceActive = false;
      this.raceLitSamples = 0;
      this.raceQuietSamples = 0;
      this.resultArmed = false;
      this.resultCandidate = 0;
      this.resultCandidateSamples = 0;
      this.resultAdvanceActive = false;
      this.resultAdvanceTimers = [];
      this.progressTimer = null;
      this.progressSignature = "";
      this.progress = null;
      this.starBoosterActive = false;
      this.loadTimeoutTimer = null;
      this.loadSequence = 0;
      this.version = "1";
      this.boundMessage = (event) => this.handleMessage(event);
      this.boundVisibility = () => {
        if (document.hidden) this.releaseAll();
      };
      this.bindControls();
      this.updateBackControl();
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
        if (this.raceActive && !this.paused) this.tap("jump", 92);
        else this.tap("accelerate", 92);
      });

      this.backButton?.addEventListener("pointerdown", (event) => {
        if (!this.started) return;
        event.preventDefault();
        this.resumeAudio();
        this.tap("back", 130);
      });

      this.classButton?.addEventListener("pointerdown", (event) => {
        if (!this.started || this.raceActive || !this.progress?.highCcUnlocked) return;
        event.preventDefault();
        this.resumeAudio();
        this.tap("item", 120);
        this.classButton.classList.add("is-pressed");
        window.setTimeout(() => this.classButton?.classList.remove("is-pressed"), 140);
      });

      this.continueButton?.addEventListener("pointerdown", () => {
        if (!this.ready || this.titleReady) return;
        this.continueButton.classList.add("is-activating");
        this.resumeAudio();
      });
      this.continueButton?.addEventListener("click", () => this.continueToTitle());

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
      this.introGateOpen = false;
      this.advancingToTitle = false;
      this.audioRunning = false;
      this.audioContextCount = 0;
      this.raceActive = false;
      this.raceLitSamples = 0;
      this.raceQuietSamples = 0;
      this.resultArmed = false;
      this.resultCandidate = 0;
      this.resultCandidateSamples = 0;
      this.resultAdvanceActive = false;
      this.progressSignature = "";
      this.progress = null;
      this.setClassControlVisible(false);
      this.updateBackControl();
      this.setLoading(true, "Loading Super Mario Kart ZX...");
      this.showContinuePrompt(false);
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
      this.introGateOpen = false;
      this.advancingToTitle = false;
      this.audioRunning = false;
      this.audioContextCount = 0;
      this.raceActive = false;
      this.raceLitSamples = 0;
      this.raceQuietSamples = 0;
      this.resultArmed = false;
      this.resultCandidate = 0;
      this.resultCandidateSamples = 0;
      this.resultAdvanceActive = false;
      this.progressSignature = "";
      this.progress = null;
      this.setClassControlVisible(false);
      this.updateBackControl();
      this.showContinuePrompt(false);
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
      if (data.type === "canvas-tap") this.handleCanvasTap(data);
      if (data.type === "runtime-error") this.handleRuntimeError(data.text);
      if (data.type === "renderer-recovery") this.handleRecoveryState(true, data);
      if (data.type === "renderer-recovered") this.handleRecoveryState(false, data);
      if (data.type === "black-screen") this.handleBlackScreen();
    }

    handleRecoveryState(recovering, data = {}) {
      if (!this.started || this.loadFailed) return;
      if (recovering) this.setLoading(true, "Restoring the next Mario Kart race...");
      else this.setLoading(false);
      this.onRecoveryState(Boolean(recovering), {
        attempt: Math.max(0, Number(data.attempt) || 0),
        attempts: Math.max(0, Number(data.attempts) || 0)
      });
    }

    handleCanvasTap(data = {}) {
      if (!this.started || this.paused || this.raceActive || this.loadFailed) return;
      if (data.pointerType === "mouse") return;
      this.resumeAudio();
      this.onReplayUnavailable();
    }

    handleRuntimeError(text = "") {
      if (!this.ready) {
        this.handleLoadError(text);
        return;
      }
      console.warn("Mario Kart recovered from a post-load runtime exception:", text);
    }

    handleAudioState(data = {}) {
      const wasRunning = this.audioRunning;
      this.audioRunning = Boolean(data.running);
      this.audioContextCount = Math.max(0, Number(data.contexts) || 0);
      if (this.audioRunning && this.ready && this.introGateOpen && !this.titleReady) {
        this.advanceToTitle();
      }
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
      this.setLoading(true, "The renderer could not be restored. Reloading Mario Kart...");
    }

    handleLoadError(text = "") {
      if (this.ready) {
        this.handleRuntimeError(text);
        return;
      }
      window.clearTimeout(this.loadTimeoutTimer);
      this.loadTimeoutTimer = null;
      this.loadFailed = true;
      this.showContinuePrompt(false);
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
      this.applyStarBoosterState();
      this.startProgressDetector();
      this.onReady();
      this.introTimer = window.setTimeout(() => {
        if (!this.ready || this.titleReady) return;
        this.introGateOpen = true;
        if (this.audioRunning) this.advanceToTitle();
        else this.showContinuePrompt(true);
      }, INTRO_ADVANCE_DELAY);
    }

    async advanceToTitle() {
      if (!this.ready || this.titleReady || this.advancingToTitle) return false;
      this.advancingToTitle = true;
      window.clearTimeout(this.introTimer);
      this.introTimer = null;
      const audioReady = await this.resumeAudio();
      if (!audioReady) {
        this.advancingToTitle = false;
        this.showContinuePrompt(true);
        return false;
      }
      this.showContinuePrompt(false);
      this.tap("start", 110);
      window.clearTimeout(this.titleTimer);
      this.titleTimer = window.setTimeout(() => {
        this.titleReady = true;
        this.advancingToTitle = false;
        this.startButton?.classList.remove("hidden");
        this.restartButton?.classList.remove("hidden");
        this.onTitleReady();
      }, TITLE_REVEAL_DELAY);
      return true;
    }

    async continueToTitle() {
      if (!this.ready || this.titleReady) return false;
      this.introGateOpen = true;
      const audioReady = await this.resumeAudio();
      this.continueButton?.classList.remove("is-activating");
      if (!audioReady) {
        this.showContinuePrompt(true, "Tap Again for Sound");
        return false;
      }
      return this.advanceToTitle();
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
      this.updateClassControl();
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
      this.updateBackControl();
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

    setStarBooster(active) {
      this.starBoosterActive = Boolean(active);
      return this.applyStarBoosterState();
    }

    applyStarBoosterState() {
      if (!this.ready) return false;
      try {
        const setBooster = this.frame?.contentWindow?.arcadiaSMKSetStarBooster;
        if (typeof setBooster === "function") {
          setBooster(this.starBoosterActive);
          return true;
        }
      } catch {}
      this.post({ type: "star-booster", active: this.starBoosterActive });
      return true;
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
    }

    updateJoystick(event) {
      const rect = this.joystick.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const knobRect = this.joystickKnob?.getBoundingClientRect();
      const knobDiameter = Math.max(knobRect?.width || 0, knobRect?.height || 0, rect.width * 0.36);
      const radius = Math.max(1, (Math.min(rect.width, rect.height) - knobDiameter) / 2);
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
      if (this.raceActive && !this.paused) this.applyRaceSteeringInput(x);
      else this.applyMenuSteeringInput(x);
      const forward = y < -DRIVE_DEAD_ZONE;
      const reverse = y > DRIVE_DEAD_ZONE;
      this.setInput("up", forward);
      this.setInput("down", reverse);
      this.setInput("accelerate", this.raceActive && forward && !this.paused);
      this.setInput("back", this.raceActive && reverse && !this.paused);
    }

    applyMenuSteeringInput(value) {
      this.clearSteeringTimers();
      this.steeringDirection = null;
      this.steeringStrength = 0;
      this.steeringContinuous = false;
      const direction = value < -MENU_STEER_DEAD_ZONE
        ? "left"
        : value > MENU_STEER_DEAD_ZONE
          ? "right"
          : null;
      this.setInput("left", direction === "left");
      this.setInput("right", direction === "right");
    }

    applyRaceSteeringInput(value) {
      const profile = getSteeringProfile(value, this.steeringDirection);
      if (!profile.direction) {
        this.clearSteeringInput();
        return;
      }

      const directionChanged = profile.direction !== this.steeringDirection;
      const modeChanged = profile.continuous !== this.steeringContinuous;
      this.steeringStrength = profile.strength;

      if (directionChanged || modeChanged) {
        this.clearSteeringInput();
        this.steeringDirection = profile.direction;
        this.steeringStrength = profile.strength;
        this.steeringContinuous = profile.continuous;
        if (profile.continuous) this.setInput(profile.direction, true);
        else this.runSteeringPulse();
      }
    }

    runSteeringPulse() {
      const direction = this.steeringDirection;
      if (!direction || this.steeringContinuous) return;
      this.clearSteeringTimers();
      const profile = getSteeringProfile(this.joystickValue.x, direction);
      if (!profile.direction || profile.direction !== direction) {
        this.clearSteeringInput();
        return;
      }
      if (profile.continuous) {
        this.steeringContinuous = true;
        this.steeringStrength = profile.strength;
        this.setInput(direction, true);
        return;
      }

      this.steeringStrength = profile.strength;
      this.setInput(direction, true);
      this.steeringReleaseTimer = window.setTimeout(() => {
        this.steeringReleaseTimer = null;
        if (this.steeringDirection === direction && !this.steeringContinuous) {
          this.setInput(direction, false);
        }
      }, profile.heldFor);
      this.steeringTimer = window.setTimeout(() => {
        this.steeringTimer = null;
        if (this.steeringDirection === direction && !this.steeringContinuous) {
          this.runSteeringPulse();
        }
      }, STEER_PULSE_PERIOD);
    }

    clearSteeringTimers() {
      window.clearTimeout(this.steeringTimer);
      window.clearTimeout(this.steeringReleaseTimer);
      this.steeringTimer = null;
      this.steeringReleaseTimer = null;
    }

    clearSteeringInput() {
      this.clearSteeringTimers();
      this.steeringDirection = null;
      this.steeringStrength = 0;
      this.steeringContinuous = false;
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
      this.detectRaceResult();
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
      if (next) {
        this.resultArmed = true;
        this.resultCandidate = 0;
        this.resultCandidateSamples = 0;
        this.resultAdvanceActive = false;
        for (const timer of this.resultAdvanceTimers) window.clearTimeout(timer);
        this.resultAdvanceTimers = [];
      } else {
        this.setInput("accelerate", false);
        this.setInput("back", false);
      }
      this.updateBackControl();
      this.updateClassControl();
      this.applyJoystickInput();
    }

    detectRaceResult() {
      if (!this.started || !this.resultArmed) return;
      let source = null;
      try {
        source = this.frame?.contentDocument?.getElementById("canvas");
      } catch {}
      const place = detectRaceResultPlace(source);
      if (!place) {
        this.resultCandidate = 0;
        this.resultCandidateSamples = 0;
        return;
      }
      if (place !== this.resultCandidate) {
        this.resultCandidate = place;
        this.resultCandidateSamples = 1;
        return;
      }
      this.resultCandidateSamples += 1;
      if (this.resultCandidateSamples < RESULT_CONFIRM_SAMPLES) return;
      this.resultArmed = false;
      this.onRaceResult({ place, detectedAt: Date.now() });
      window.setTimeout(() => this.syncProgress(), 500);
    }

    async advanceAfterRaceResult() {
      if (!this.started || this.resultAdvanceActive) return false;
      this.resultAdvanceActive = true;
      this.updateClassControl();
      await this.resumeAudio();
      this.tap("accelerate", 120);
      for (const delay of RESULT_ADVANCE_DELAYS) {
        const timer = window.setTimeout(() => {
          if (!this.started || this.raceActive) return;
          this.resumeAudio();
          this.tap("accelerate", 130);
        }, delay);
        this.resultAdvanceTimers.push(timer);
      }
      const finishTimer = window.setTimeout(() => {
        this.resultAdvanceActive = false;
        this.resultAdvanceTimers = [];
        this.syncProgress();
        this.updateClassControl();
      }, RESULT_ADVANCE_DELAYS[RESULT_ADVANCE_DELAYS.length - 1] + 1800);
      this.resultAdvanceTimers.push(finishTimer);
      return true;
    }

    startProgressDetector() {
      window.clearInterval(this.progressTimer);
      this.syncProgress();
      this.progressTimer = window.setInterval(() => this.syncProgress(), PROGRESS_SAMPLE_PERIOD);
    }

    syncProgress() {
      if (!this.ready) return null;
      let text = "";
      try {
        text = this.frame?.contentWindow?.arcadiaSMKReadProgress?.() || "";
      } catch {}
      const progress = parseKartProgress(text);
      if (!progress) return null;
      const signature = JSON.stringify(progress);
      this.progress = progress;
      this.updateClassControl();
      if (signature === this.progressSignature) return progress;
      this.progressSignature = signature;
      this.onProgress(progress);
      return progress;
    }

    setClassControlVisible(visible) {
      if (!this.classButton) return;
      const active = Boolean(visible);
      this.classButton.classList.toggle("hidden", !active);
      this.classButton.disabled = !active;
    }

    updateClassControl() {
      this.setClassControlVisible(
        this.started
        && !this.raceActive
        && !this.resultAdvanceActive
        && Boolean(this.progress?.highCcUnlocked)
      );
    }

    updateBackControl() {
      if (!this.backButton) return;
      const itemMode = this.started && this.raceActive && !this.paused;
      const label = this.backButton.querySelector("small");
      if (label) label.textContent = itemMode ? "ITEM" : "BACK";
      this.backButton.setAttribute(
        "aria-label",
        itemMode ? "Use collected item" : "Go back or cancel"
      );
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
        return { hasHolder };
      } catch {
        return null;
      }
    }

    setLoading(active, text = "", isError = false) {
      this.loading?.classList.toggle("hidden", !active);
      this.loading?.classList.toggle("is-error", active && isError);
      if (text && this.loadingText) this.loadingText.textContent = text;
    }

    showContinuePrompt(active, label = "Tap to Continue") {
      if (!this.continueButton) return;
      this.continueButton.classList.toggle("hidden", !active);
      this.continueButton.classList.remove("is-activating");
      const text = this.continueButton.querySelector("strong");
      if (text) text.textContent = label;
    }

    clearTimers() {
      for (const timer of [this.introTimer, this.titleTimer, this.loadTimeoutTimer]) {
        window.clearTimeout(timer);
      }
      window.clearInterval(this.raceStateTimer);
      window.clearInterval(this.progressTimer);
      for (const timer of this.resultAdvanceTimers) window.clearTimeout(timer);
      this.clearSteeringTimers();
      this.introTimer = null;
      this.titleTimer = null;
      this.raceStateTimer = null;
      this.progressTimer = null;
      this.resultAdvanceTimers = [];
      this.loadTimeoutTimer = null;
    }
  }

  ArcadiaSMKartZX.detectRaceResultPlace = detectRaceResultPlace;
  ArcadiaSMKartZX.parseProgress = parseKartProgress;
  ArcadiaSMKartZX.getSteeringProfile = getSteeringProfile;
  window.ArcadiaSMKartZX = ArcadiaSMKartZX;
})();
