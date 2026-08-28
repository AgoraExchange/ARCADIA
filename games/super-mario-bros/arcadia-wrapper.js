(() => {
  "use strict";

  const SOURCE = "arcadia-super-mario-bros";
  const GAME_WIDTH = 832;
  const GAME_HEIGHT = 464;
  const CAMPAIGN_MAP = /^([1-8])-([1-4])$/;
  const INPUTS = new Set(["left", "right", "up", "down", "sprint"]);
  const heldInputs = new Set();
  let userWrapper = null;
  let game = null;
  let started = false;
  let lastClearKey = "";
  let lastClearAt = 0;

  function post(type, detail = {}) {
    window.parent.postMessage({ source: SOURCE, type, ...detail }, window.location.origin);
  }

  function currentMap() {
    try {
      return String(game?.AreaSpawner?.getMapName?.() || "1-1");
    } catch {
      return "1-1";
    }
  }

  function resizeGame() {
    const scale = Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT);
    document.documentElement.style.setProperty("--arcadia-mario-scale", String(Math.max(0.1, scale)));
  }

  function setInput(name, pressed) {
    if (!game || !INPUTS.has(name) || heldInputs.has(name) === pressed) return;
    const trigger = pressed ? "onkeydown" : "onkeyup";
    try {
      game.InputWriter.callEvent(trigger, name, { preventDefault() {} });
      if (pressed) heldInputs.add(name);
      else heldInputs.delete(name);
    } catch (error) {
      post("runtime-warning", { message: String(error?.message || error) });
    }
  }

  function releaseInputs() {
    [...heldInputs].forEach((name) => setInput(name, false));
  }

  function setPaused(paused) {
    if (!game) return false;
    releaseInputs();
    if (paused) {
      game.GamesRunner.pause();
      game.AudioPlayer.pauseAll();
    } else if (started) {
      game.GamesRunner.play();
      game.AudioPlayer.resumeAll();
    }
    const isPaused = Boolean(game.GamesRunner.getPaused());
    post("pause-state", { paused: isPaused });
    return isPaused;
  }

  function unlockAudio(muted = false) {
    if (!game) return false;
    try {
      game.AudioPlayer.setMuted(Boolean(muted));
      if (muted) return true;
      game.AudioPlayer.setVolume(1);
      game.AudioPlayer.resumeAll();
      const theme = game.AudioPlayer.getTheme?.();
      if (theme?.play) {
        const result = theme.play();
        result?.catch?.(() => undefined);
      } else {
        game.AudioPlayer.playTheme();
      }
      return true;
    } catch {
      return false;
    }
  }

  function start(options = {}) {
    if (!game) return false;
    started = true;
    unlockAudio(Boolean(options.muted));
    game.GamesRunner.play();
    post("started", { map: currentMap() });
    post("pause-state", { paused: false });
    return true;
  }

  function selectLevel(map, options = {}) {
    const level = String(map || "");
    if (!game || !CAMPAIGN_MAP.test(level)) return false;
    const shouldResume = Boolean(started && options.resume);
    releaseInputs();
    try {
      game.setMap(level);
      lastClearKey = "";
      lastClearAt = 0;
      if (shouldResume) {
        game.GamesRunner.play();
        unlockAudio(Boolean(game.AudioPlayer.getMuted?.()));
      } else {
        game.GamesRunner.pause();
        game.AudioPlayer.pauseAll();
      }
      post("pause-state", { paused: !shouldResume });
      return currentMap() === level;
    } catch (error) {
      post("runtime-warning", { message: String(error?.message || error) });
      return false;
    }
  }

  function installMapChangeHook() {
    const original = game.setMap;
    if (typeof original !== "function") return;
    game.setMap = function arcadiaSetMap(...args) {
      const result = original.apply(this, args);
      post("map-change", { map: currentMap() });
      return result;
    };
  }

  function installLevelCompletionHook() {
    const original = game.collideLevelTransport;
    if (typeof original !== "function") return;
    game.collideLevelTransport = function arcadiaLevelTransport(player, detector) {
      const from = currentMap();
      const to = detector?.transport && typeof detector.transport === "object"
        ? String(detector.transport.map || "")
        : "";
      const fromMatch = CAMPAIGN_MAP.exec(from);
      const toMatch = CAMPAIGN_MAP.exec(to);
      if (started && fromMatch && toMatch && from !== to) {
        const now = Date.now();
        const key = `${from}>${to}`;
        if (key !== lastClearKey || now - lastClearAt > 6000) {
          lastClearKey = key;
          lastClearAt = now;
          post("level-complete", {
            level: from,
            nextLevel: to,
            world: Number(fromMatch[1]),
            stage: Number(fromMatch[2])
          });
        }
      }
      return original.call(this, player, detector);
    };
  }

  function fail(error) {
    const message = String(error?.message || error || "Unknown loading error");
    const fatal = document.getElementById("fatalError");
    if (fatal) {
      fatal.textContent = `SUPER MARIO BROS COULD NOT START\n${message}`;
      fatal.classList.remove("hidden");
    }
    post("error", { message });
  }

  function boot() {
    try {
      const ui = PlayMarioJas.PlayMarioJas.settings.ui;
      ui.sizeDefault = "Arcadia";
      ui.sizes = {
        Arcadia: { width: GAME_WIDTH, height: GAME_HEIGHT, full: false }
      };
      ui.schemas = [];

      userWrapper = new UserWrappr.UserWrappr(
        PlayMarioJas.PlayMarioJas.prototype.proliferate(
          { GameStartrConstructor: PlayMarioJas.PlayMarioJas },
          ui,
          true
        )
      );
      game = userWrapper.GameStarter;
      window.UserWrapper = userWrapper;
      window.FSM = game;
      installMapChangeHook();
      installLevelCompletionHook();
      game.GamesRunner.pause();
      game.AudioPlayer.pauseAll();
      resizeGame();
      document.getElementById("bootMessage")?.remove();
      post("ready", { map: currentMap(), width: GAME_WIDTH, height: GAME_HEIGHT });
    } catch (error) {
      fail(error);
    }
  }

  window.ArcadiaMario = {
    start,
    selectLevel,
    setInput,
    releaseInputs,
    pause() { return setPaused(true); },
    resume() { return setPaused(false); },
    togglePause() { return setPaused(!game?.GamesRunner?.getPaused?.()); },
    setMuted(muted) {
      game?.AudioPlayer?.setMuted?.(Boolean(muted));
    },
    getState() {
      return {
        ready: Boolean(game),
        started,
        paused: Boolean(game?.GamesRunner?.getPaused?.()),
        map: currentMap()
      };
    }
  };

  window.addEventListener("resize", resizeGame, { passive: true });
  window.addEventListener("orientationchange", resizeGame, { passive: true });
  window.addEventListener("pagehide", () => setPaused(true));
  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || event.data?.source !== "arcadia") return;
    const { type, name, pressed, muted } = event.data;
    if (type === "input") setInput(name, Boolean(pressed));
    if (type === "release-inputs") releaseInputs();
    if (type === "pause") setPaused(true);
    if (type === "resume") setPaused(false);
    if (type === "mute") game?.AudioPlayer?.setMuted?.(Boolean(muted));
  });

  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot, { once: true });
})();
