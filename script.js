(() => {
  "use strict";

  const STORAGE_KEY = "arcadia_player_v1";
  const VERSION_KEY = "arcadia_app_version";
  const APP_VERSION = "2026.07.03.3";
  const PATCH_NOTES = [
    "Theme song folders added for lobby and game music.",
    "Lobby music now loops on the dashboard and Snake music starts with the run.",
    "Landscape background video added for laptop and wider screens.",
    "Background and uploaded image assets organized into asset folders.",
    "iPhone background video starts after Enter Arcadia.",
    "Controller connection flow added after splash.",
    "Developer Mode patch console added."
  ];
  const BASE_XP_PER_LEVEL = 500;
  const XP_LEVEL_STEP = 150;
  const GRID_SIZE = 20;
  const GAME_TICK_MS = 112;
  const THEME_SONGS = {
    lobby: [
      "assets/themesong/lobby/lobby1.mp3",
      "assets/themesong/lobby/lobby2.mp3",
      "assets/themesong/lobby/lobby3.mp3"
    ],
    games: {
      snake: "assets/themesong/games/snake.mp3"
    }
  };

  const $ = (id) => document.getElementById(id);
  const defaultState = {
    playerName: "",
    profileImage: "",
    xp: 0,
    coins: 0,
    level: 1,
    owned: [],
    equippedNameplate: null,
    equippedBooster: null,
    boosterCooldowns: {},
    boosterPurchases: 0,
    boosterUses: 0,
    boosterLevelTarget: null,
      stats: {
      gamesPlayed: 0,
      snakeRuns: 0,
      snakeBest: 0,
      snakeXpEarned: 0,
      snakeTotalScore: 0,
      snakeApples: 0
    },
    achievements: []
  };

  const games = [
    {
      id: "snake",
      title: "Snake",
      gameNo: "01",
      tags: ["snake", "classic", "arcade", "high score"],
      description: "Eat pellets, grow longer, and beat your score.",
      status: "Play",
      available: true,
      image: "assets/images/games/snakegame.png",
      mark: "S"
    },
    {
      id: "breakout",
      title: "Neon Breakout",
      gameNo: "02",
      tags: ["breakout", "brick", "paddle"],
      description: "Break neon bricks and chase clean combos.",
      status: "Coming Soon",
      available: false,
      mark: "B"
    },
    {
      id: "invaders",
      title: "Star Invaders",
      gameNo: "03",
      tags: ["space", "shooter", "aliens"],
      description: "A space blaster game for future score runs.",
      status: "Coming Soon",
      available: false,
      mark: "I"
    },
    {
      id: "runner",
      title: "Turbo Tunnel",
      gameNo: "04",
      tags: ["runner", "speed", "reflex"],
      description: "A fast neon tunnel challenge built for streaks.",
      status: "Coming Soon",
      available: false,
      mark: "T"
    }
  ];

  const achievements = [
    { id: "first_run", title: "Inserted Coin", text: "Complete your first Snake run." },
    { id: "snake_10", title: "Grid Runner", text: "Score 10 or higher in Snake." },
    { id: "snake_25", title: "Snake Master", text: "Score 25 or higher in Snake." },
    { id: "level_2", title: "Arcade Regular", text: "Reach level 2." },
    { id: "level_5", title: "High Score Hero", text: "Reach level 5." },
    { id: "booster_buyer", title: "Power Shopper", text: "Purchase your first booster." },
    { id: "booster_used", title: "Boosted Run", text: "Use a booster in any game." },
    { id: "booster_climb", title: "Two-Level Boost", text: "Use a booster to reach your current booster target." }
  ];

  const rivalNames = ["NOVA", "PIXEL", "ACE", "VOLT", "GLITCH", "BYTE", "JUNO", "ZERO"];

  const storeItems = [
    {
      id: "neon_badge",
      title: "Neon Nameplate",
      category: "player",
      type: "cosmetic",
      slot: "nameplate",
      level: 1,
      cost: 150,
      tags: ["nameplate", "profile", "player", "neon"],
      text: "Add a brighter glow to your player profile."
    },
    {
      id: "xp_boost_2",
      title: "2X XP Booster",
      category: "boosters",
      type: "booster",
      boost: "xp_boost_2",
      multiplier: 2,
      level: 3,
      cost: 600,
      tags: ["booster", "xp", "coins", "2x"],
      text: "Double XP and coins from your next completed run."
    },
    {
      id: "xp_boost_3",
      title: "3X XP Booster",
      category: "boosters",
      type: "booster",
      boost: "xp_boost_3",
      multiplier: 3,
      level: 5,
      cost: 1400,
      tags: ["booster", "xp", "coins", "3x"],
      text: "Triple XP and coins from your next completed run."
    }
  ];

  let state = loadState();
  let audioCtx = null;
  let currentScreen = "boot";
  let snakeTimer = null;
  let snake = createSnakeState();
  let touchStart = null;
  let headerSeenXp = Number(state.xp) || 0;
  let dashboardRewardTimer = null;
  let activeStoreTab = "player";
  let storeCountdownTimer = null;
  let themeAudio = null;
  let activeTheme = "";
  let themeFadeTimer = null;
  const toastQueue = [];
  const activeToasts = new Set();
  const toastCooldowns = new Map();

  const el = {
    bootScreen: $("bootScreen"),
    bgVideo: $("bgVideo"),
    nameScreen: $("nameScreen"),
    homeScreen: $("homeScreen"),
    profileScreen: $("profileScreen"),
    gameScreen: $("gameScreen"),
    skipBootBtn: $("skipBootBtn"),
    playerForm: $("playerForm"),
    playerName: $("playerName"),
    openProfileBtn: $("openProfileBtn"),
    backFromProfileBtn: $("backFromProfileBtn"),
    playerHandle: $("playerHandle"),
    playerLevel: $("playerLevel"),
    headerCoins: $("headerCoins"),
    headerXpTrack: $("headerXpTrack"),
    headerXpFill: $("headerXpFill"),
    headerXpText: $("headerXpText"),
    gameSearch: $("gameSearch"),
    clearSearchBtn: $("clearSearchBtn"),
    gameGrid: $("gameGrid"),
    gameCount: $("gameCount"),
    profileAvatar: $("profileAvatar"),
    profilePhotoInput: $("profilePhotoInput"),
    profileHero: $("profileHero"),
    profileName: $("profileName"),
    profileStatus: $("profileStatus"),
    profileShareBtn: $("profileShareBtn"),
    developerModeBtn: $("developerModeBtn"),
    levelNumber: $("levelNumber"),
    xpText: $("xpText"),
    xpFill: $("xpFill"),
    profileXp: $("profileXp"),
    profileCoins: $("profileCoins"),
    profileGames: $("profileGames"),
    profileSnakeBest: $("profileSnakeBest"),
    profileFavorite: $("profileFavorite"),
    profileAchievements: $("profileAchievements"),
    achievementCount: $("achievementCount"),
    achievementList: $("achievementList"),
    leaderboardPreview: $("leaderboardPreview"),
    storePreviewCoins: $("storePreviewCoins"),
    storeSearch: $("storeSearch"),
    storeGrid: $("storeGrid"),
    snakeCanvas: $("snakeCanvas"),
    snakeScore: $("snakeScore"),
    snakeBest: $("snakeBest"),
    snakeLiveBest: $("snakeLiveBest"),
    snakeStreak: $("snakeStreak"),
    snakeXpPreview: $("snakeXpPreview"),
    snakeCoinPreview: $("snakeCoinPreview"),
    startSnakeBtn: $("startSnakeBtn"),
    pauseSnakeBtn: $("pauseSnakeBtn"),
    topPauseSnakeBtn: $("topPauseSnakeBtn"),
    restartSnakeBtn: $("restartSnakeBtn"),
    exitGameBtn: $("exitGameBtn"),
    toastStack: $("toastStack"),
    gameOverModal: $("gameOverModal"),
    connectionModal: $("connectionModal"),
    connectionKicker: $("connectionKicker"),
    connectionTitle: $("connectionTitle"),
    connectionMessage: $("connectionMessage"),
    connectionActionBtn: $("connectionActionBtn"),
    developerModal: $("developerModal"),
    checkUpdatesBtn: $("checkUpdatesBtn"),
    openRenameBtn: $("openRenameBtn"),
    closeDeveloperBtn: $("closeDeveloperBtn"),
    renameModal: $("renameModal"),
    renameForm: $("renameForm"),
    renamePlayerName: $("renamePlayerName"),
    closeRenameBtn: $("closeRenameBtn"),
    newBestBadge: $("newBestBadge"),
    resultScore: $("resultScore"),
    resultXp: $("resultXp"),
    resultCoins: $("resultCoins"),
    resultBest: $("resultBest"),
    resultAchievements: $("resultAchievements"),
    resultMessage: $("resultMessage"),
    retrySnakeBtn: $("retrySnakeBtn"),
    closeResultBtn: $("closeResultBtn")
  };

  function syncAppHeight() {
    const h = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    document.documentElement.style.setProperty("--app-height", `${h}px`);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(defaultState);
      return mergeState(JSON.parse(raw));
    } catch {
      return clone(defaultState);
    }
  }

  function mergeState(saved) {
    const legacyCoins = Number.isFinite(Number(saved?.coins))
      ? Number(saved.coins)
      : Number.isFinite(Number(saved?.tickets))
        ? Number(saved.tickets)
        : 0;
    const { tickets: _legacyTickets, ...savedState } = saved || {};
    return {
      ...clone(defaultState),
      ...savedState,
      profileImage: typeof saved?.profileImage === "string" ? saved.profileImage : "",
      coins: legacyCoins,
      equippedNameplate: typeof saved?.equippedNameplate === "string" ? saved.equippedNameplate : null,
      equippedBooster: typeof saved?.equippedBooster === "string"
        ? saved.equippedBooster
        : typeof saved?.activeBoost === "string"
          ? saved.activeBoost
          : null,
      boosterCooldowns: saved?.boosterCooldowns && typeof saved.boosterCooldowns === "object" ? saved.boosterCooldowns : {},
      boosterPurchases: Number.isFinite(Number(saved?.boosterPurchases)) ? Number(saved.boosterPurchases) : 0,
      boosterUses: Number.isFinite(Number(saved?.boosterUses)) ? Number(saved.boosterUses) : 0,
      boosterLevelTarget: Number.isFinite(Number(saved?.boosterLevelTarget)) ? Number(saved.boosterLevelTarget) : null,
      stats: { ...clone(defaultState.stats), ...(saved?.stats || {}) },
      owned: Array.isArray(saved?.owned) ? saved.owned : [],
      achievements: Array.isArray(saved?.achievements) ? saved.achievements : []
    };
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(Number(value) || 0);
  }

  function formatCompactNumber(value) {
    const number = Number(value) || 0;
    if (Math.abs(number) < 1000) return formatNumber(number);
    const compact = number / 1000;
    return `${compact >= 10 || Number.isInteger(compact) ? Math.floor(compact) : Math.floor(compact * 10) / 10}k`;
  }

  function deriveLevel(xp) {
    let level = 1;
    let remaining = Math.max(0, Number(xp) || 0);
    while (remaining >= xpNeededForLevel(level)) {
      remaining -= xpNeededForLevel(level);
      level += 1;
    }
    return level;
  }

  function xpForLevel(level) {
    const completedLevels = Math.max(0, Math.max(1, level) - 1);
    return completedLevels * BASE_XP_PER_LEVEL + (XP_LEVEL_STEP * completedLevels * (completedLevels - 1)) / 2;
  }

  function xpNeededForLevel(level) {
    return BASE_XP_PER_LEVEL + (Math.max(1, level) - 1) * XP_LEVEL_STEP;
  }

  function xpIntoLevel() {
    return state.xp - xpForLevel(state.level);
  }

  function showScreen(name) {
    const previousScreen = currentScreen;
    if (dashboardRewardTimer) {
      clearTimeout(dashboardRewardTimer);
      dashboardRewardTimer = null;
    }
    currentScreen = name;
    el.bootScreen.classList.toggle("hidden", name !== "boot");
    el.nameScreen.classList.toggle("hidden", name !== "name");
    el.homeScreen.classList.toggle("hidden", name !== "home");
    el.profileScreen.classList.toggle("hidden", name !== "profile");
    el.gameScreen.classList.toggle("hidden", name !== "game");
    if (name !== "game") stopSnake();
    renderAll();
    if (name === "home") {
      playLobbyTheme({ transition: previousScreen === "game" });
    } else if (previousScreen === "game" && name !== "game") {
      stopGameTheme();
    }
  }

  function playTone(kind = "tap") {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (kind === "fail") {
        playFailTone();
        return;
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;
      const tones = {
        tap: [440, 0.04],
        eat: [860, 0.07],
        win: [980, 0.12],
        level: [1260, 0.22]
      };
      const [freq, duration] = tones[kind] || tones.tap;
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, now);
      if (kind === "level") osc.frequency.exponentialRampToValueAtTime(640, now + duration);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.075, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // Optional browser audio.
    }
  }

  function playFailTone() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      const notes = [
        { start: 0, freq: 250, end: 170, duration: 0.24 },
        { start: 0.25, freq: 190, end: 118, duration: 0.34 }
      ];

      notes.forEach((note) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        const start = now + note.start;
        const end = start + note.duration;

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(note.freq, start);
        osc.frequency.exponentialRampToValueAtTime(note.end, end);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(780, start);
        filter.frequency.exponentialRampToValueAtTime(260, end);
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(0.13, start + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, end);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(start);
        osc.stop(end + 0.03);
      });
    } catch {
      // Optional browser audio.
    }
  }

  function playToneAt(frequency, duration = 0.055, type = "square", volume = 0.06) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // Optional browser audio.
    }
  }

  function getThemeAudio() {
    if (!themeAudio) {
      themeAudio = new Audio();
      themeAudio.loop = true;
      themeAudio.preload = "auto";
      themeAudio.volume = 0.58;
    }
    return themeAudio;
  }

  function fadeThemeOut(duration = 520, stopAtEnd = true) {
    const audio = getThemeAudio();
    if (themeFadeTimer) {
      clearInterval(themeFadeTimer);
      themeFadeTimer = null;
    }
    if (!audio.src || audio.paused) {
      if (stopAtEnd) activeTheme = "";
      return Promise.resolve();
    }

    const startVolume = audio.volume || 0.58;
    const startedAt = performance.now();
    return new Promise((resolve) => {
      themeFadeTimer = setInterval(() => {
        const pct = Math.min(1, (performance.now() - startedAt) / duration);
        audio.volume = Math.max(0, startVolume * (1 - pct));
        if (pct < 1) return;
        clearInterval(themeFadeTimer);
        themeFadeTimer = null;
        if (stopAtEnd) {
          audio.pause();
          audio.currentTime = 0;
          activeTheme = "";
        }
        resolve();
      }, 32);
    });
  }

  function playThemeTransitionBeep() {
    playToneAt(1320, 0.045, "square", 0.08);
    setTimeout(() => playToneAt(760, 0.055, "square", 0.065), 58);
  }

  async function playTheme(src, key, options = {}) {
    const audio = getThemeAudio();
    if (!src) return;
    if (activeTheme === key && !audio.paused && !options.restart) return;

    if (audio.src && !audio.paused && options.transition) {
      playThemeTransitionBeep();
      await fadeThemeOut(520);
    }

    if (themeFadeTimer) {
      clearInterval(themeFadeTimer);
      themeFadeTimer = null;
    }

    audio.loop = true;
    audio.volume = 0.58;
    if (!audio.src.endsWith(src)) {
      audio.src = src;
      audio.load();
    } else if (options.restart) {
      audio.currentTime = 0;
    }
    activeTheme = key;

    try {
      await audio.play();
    } catch {
      activeTheme = "";
    }
  }

  function pickLobbyTheme() {
    const tracks = THEME_SONGS.lobby;
    return tracks[Math.floor(Math.random() * tracks.length)] || tracks[0];
  }

  function playLobbyTheme(options = {}) {
    const audio = getThemeAudio();
    if (activeTheme.startsWith("lobby-") && !audio.paused) return;
    playTheme(pickLobbyTheme(), `lobby-${Date.now()}`, options);
  }

  function prepareGameTheme() {
    if (!activeTheme) return;
    playThemeTransitionBeep();
    fadeThemeOut(520);
  }

  function playGameTheme(gameId, options = {}) {
    playTheme(THEME_SONGS.games[gameId], `game-${gameId}`, { transition: false, ...options });
  }

  function stopGameTheme(reason = "stop") {
    if (!activeTheme.startsWith("game-")) return;
    if (reason === "death") {
      fadeThemeOut(260);
      return;
    }
    playThemeTransitionBeep();
    fadeThemeOut(420);
  }

  function showToast(title, text, kind = "tap", duration = 3000) {
    const key = `${title}::${text}`;
    const now = Date.now();
    const lastShown = toastCooldowns.get(key) || 0;
    const alreadyQueued = toastQueue.some((item) => item.key === key);

    if (activeToasts.has(key) || alreadyQueued || now - lastShown < 6000) return;

    toastCooldowns.set(key, now);
    toastQueue.push({ key, title, text, kind, duration });
    drainToastQueue();
  }

  function drainToastQueue() {
    while (activeToasts.size < 2 && toastQueue.length) {
      renderToast(toastQueue.shift());
    }
  }

  function renderToast(item) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<strong>${item.title}</strong><small>${item.text}</small>`;
    el.toastStack.appendChild(toast);
    activeToasts.add(item.key);
    playTone(item.kind);
    setTimeout(() => {
      toast.remove();
      activeToasts.delete(item.key);
      drainToastQueue();
    }, item.duration);
  }

  function playXpRewardSound(strong = false, progressRatio = 0.15, durationMs = 900) {
    const clamped = Math.max(0, Math.min(1, progressRatio));
    const count = Math.max(3, strong ? Math.round(10 + clamped * 18) : Math.round(4 + clamped * 9));
    const total = Math.max(360, durationMs - (strong ? 120 : 20));
    const weights = [];
    let weightTotal = 0;

    for (let i = 0; i < count; i += 1) {
      const t = count <= 1 ? 1 : i / (count - 1);
      const weight = 1.38 - t * 0.92;
      weights.push(weight);
      weightTotal += weight;
    }

    for (let i = 0; i < count; i += 1) {
      const t = count <= 1 ? 1 : i / (count - 1);
      const freq = 360 + t * (strong ? 620 : 360) + (i % 3) * 38;
      setTimeout(() => {
        if (currentScreen === "home") playToneAt(freq, strong ? 0.06 : 0.05, i % 2 ? "square" : "triangle", strong ? 0.072 : 0.055);
      }, Math.min(total, weights.slice(0, i).reduce((sum, value) => sum + value, 0) / weightTotal * total));
    }

    if (strong) {
      setTimeout(() => {
        if (currentScreen === "home") playTone("level");
      }, durationMs + 70);
    }
  }

  function getBackgroundVideoSrc() {
    if (!el.bgVideo) return "";
    const landscapeSrc = el.bgVideo.dataset.landscapeSrc;
    const mobileSrc = el.bgVideo.dataset.mobileSrc || landscapeSrc;
    const prefersLandscape = window.matchMedia("(orientation: landscape)").matches || window.matchMedia("(min-width: 760px)").matches;
    return prefersLandscape && landscapeSrc ? landscapeSrc : mobileSrc;
  }

  function syncBackgroundVideoSource() {
    const nextSrc = getBackgroundVideoSrc();
    if (!nextSrc || !el.bgVideo) return;
    const currentSrc = el.bgVideo.getAttribute("src") || el.bgVideo.currentSrc;
    if (currentSrc && currentSrc.endsWith(nextSrc)) return;
    el.bgVideo.setAttribute("src", nextSrc);
    el.bgVideo.load();
  }

  async function startBackgroundVideo() {
    if (!el.bgVideo) return;
    syncBackgroundVideoSource();
    el.bgVideo.muted = true;
    el.bgVideo.loop = true;
    el.bgVideo.playsInline = true;
    try {
      await el.bgVideo.play();
      document.body.classList.add("video-live");
    } catch {
      document.body.classList.remove("video-live");
    }
  }

  function showConnectionPrompt() {
    const hasPlayer = Boolean(state.playerName);
    el.bootScreen.classList.add("hidden");
    el.connectionKicker.textContent = hasPlayer ? "Controller Link" : "Controller Ready";
    el.connectionTitle.textContent = hasPlayer ? "CONNECTED" : "Controller Connected. Player Not Found";
    el.connectionMessage.classList.toggle("connection-ready", hasPlayer);
    el.connectionMessage.textContent = hasPlayer
      ? `${state.playerName.toUpperCase()} READY`
      : "Create a player profile to save XP, coins, high scores, and badges.";
    el.connectionActionBtn.textContent = hasPlayer ? "Enter Arcadia" : "Create Player";
    el.connectionModal.classList.remove("hidden");
  }

  async function enterArcadia() {
    playTone("tap");
    await startBackgroundVideo();
    el.connectionModal.classList.add("hidden");
    showScreen(state.playerName ? "home" : "name");
  }

  function renderAll() {
    state.level = deriveLevel(state.xp);
    renderHeader(currentScreen === "home");
    renderGames();
    renderProfile();
    renderAchievements();
    renderLeaderboard();
    renderStore();
    renderSnakeStats();
  }

  function progressForXp(totalXp) {
    const level = deriveLevel(totalXp);
    const current = Math.max(0, totalXp - xpForLevel(level));
    const needed = xpNeededForLevel(level);
    const pct = Math.max(0, Math.min(100, (current / needed) * 100));
    return { level, current, needed, pct };
  }

  function setHeaderProgress(progress) {
    el.playerLevel.textContent = `Level ${progress.level}`;
    el.headerXpFill.style.width = `${progress.pct}%`;
    el.headerXpTrack.setAttribute("aria-valuenow", String(Math.round(progress.current)));
    el.headerXpTrack.setAttribute("aria-valuemax", String(progress.needed));
    el.headerXpText.textContent = `${formatNumber(progress.current)} / ${formatNumber(progress.needed)} XP to Level ${progress.level + 1}`;
  }

  function renderHeader(animateProgress = false) {
    const name = state.playerName || "PLAYER";
    const initial = name.trim()[0]?.toUpperCase() || "P";
    const target = progressForXp(state.xp);
    const from = progressForXp(headerSeenXp);
    const xpDelta = Math.max(0, (Number(state.xp) || 0) - headerSeenXp);
    const neonNameplate = state.equippedNameplate === "neon_badge";
    el.playerHandle.textContent = name.toUpperCase();
    el.headerCoins.textContent = formatCompactNumber(state.coins);
    el.openProfileBtn.classList.toggle("nameplate-neon", neonNameplate);
    el.profileHero.classList.toggle("nameplate-neon", neonNameplate);
    el.profileAvatar.textContent = initial;
    el.profileAvatar.classList.toggle("has-image", Boolean(state.profileImage));
    el.profileAvatar.style.backgroundImage = state.profileImage ? `url("${state.profileImage}")` : "";
    el.profileName.textContent = name.toUpperCase();

    if (animateProgress && xpDelta > 0) {
      const strong = target.level > from.level || xpDelta >= target.needed * 0.35;
      const progressRatio = target.level > from.level ? 1 : xpDelta / Math.max(1, target.needed);
      const animationDuration = Math.round(520 + Math.min(1, progressRatio) * 1180 + (target.level > from.level ? 520 : 0));
      setHeaderProgress(from);
      dashboardRewardTimer = setTimeout(() => {
        if (currentScreen !== "home") return;
        el.headerXpTrack.classList.remove("xp-surge", "xp-surge-strong");
        void el.headerXpTrack.offsetWidth;
        el.headerXpTrack.classList.add(strong ? "xp-surge-strong" : "xp-surge");
        el.headerXpFill.style.transitionDuration = `${animationDuration}ms`;
        playXpRewardSound(strong, progressRatio, animationDuration);
        el.playerLevel.textContent = `Level ${target.level}`;
        el.headerXpTrack.setAttribute("aria-valuemax", String(target.needed));
        el.headerXpText.textContent = `${formatNumber(target.current)} / ${formatNumber(target.needed)} XP to Level ${target.level + 1}`;
        if (target.level > from.level) {
          requestAnimationFrame(() => {
            el.headerXpFill.style.width = "100%";
            setTimeout(() => {
              el.headerXpFill.style.transition = "none";
              el.headerXpFill.style.width = "0%";
              void el.headerXpFill.offsetWidth;
              el.headerXpFill.style.transition = "";
              el.headerXpFill.style.transitionDuration = `${Math.max(520, animationDuration * 0.42)}ms`;
              requestAnimationFrame(() => {
                el.headerXpFill.style.width = `${target.pct}%`;
                el.headerXpTrack.setAttribute("aria-valuenow", String(Math.round(target.current)));
              });
            }, Math.max(520, animationDuration * 0.58));
          });
          showToast("Level Up", `You reached level ${target.level}.`, "level", 4000);
        } else {
          requestAnimationFrame(() => {
            el.headerXpFill.style.width = `${target.pct}%`;
            el.headerXpTrack.setAttribute("aria-valuenow", String(Math.round(target.current)));
          });
        }
        setTimeout(() => {
          el.headerXpTrack.classList.remove("xp-surge", "xp-surge-strong");
          el.headerXpFill.style.transitionDuration = "";
        }, animationDuration + 220);
        headerSeenXp = Number(state.xp) || 0;
        dashboardRewardTimer = null;
      }, 1500);
      return;
    }

    setHeaderProgress(target);
    if (currentScreen === "home") headerSeenXp = Number(state.xp) || 0;
  }

  function renderGames() {
    const term = (el.gameSearch?.value || "").trim().toLowerCase();
    const filtered = games.filter((game) => {
      const haystack = `${game.title} ${game.description} ${game.tags.join(" ")}`.toLowerCase();
      return haystack.includes(term);
    });

    el.gameGrid.innerHTML = "";
    filtered.forEach((game) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `game-card ${game.available ? "" : "locked"}`;
      const art = game.image
        ? `<div class="game-art image-art"><img src="${game.image}" alt="${game.title} preview" loading="lazy" /></div>`
        : `<div class="game-art"><strong>${game.mark}</strong></div>`;
      card.innerHTML = `
        ${art}
        <div class="game-info">
          <h3>${game.title}</h3>
          <p>${game.description}</p>
        </div>
        <div class="game-meta">
          <span>Game ${game.gameNo}</span>
          <span class="${game.available ? "play-pill" : ""}">${game.available ? game.status : "Coming Soon"}</span>
        </div>
      `;
      card.addEventListener("click", () => {
        if (!game.available) {
        showToast("Coming Soon", `${game.title} is not open yet.`);
          return;
        }
        openSnake();
      });
      el.gameGrid.appendChild(card);
    });

    const available = filtered.filter((game) => game.available).length;
    el.gameCount.textContent = `${available} Available`;
  }

  function renderProfile() {
    const current = xpIntoLevel();
    const needed = xpNeededForLevel(state.level);
    const pct = Math.max(0, Math.min(100, (current / needed) * 100));
    const favorite = getFavoriteGame();
    el.profileStatus.textContent = `Level ${state.level} arcade player. Keep playing to climb the scoreboard.`;
    el.levelNumber.textContent = state.level;
    el.xpText.textContent = `${formatNumber(current)} / ${formatNumber(needed)} XP`;
    el.xpFill.style.width = `${pct}%`;
    el.profileXp.textContent = formatNumber(state.xp);
    el.profileCoins.textContent = formatNumber(state.coins);
    el.profileGames.textContent = formatNumber(state.stats.gamesPlayed);
    el.profileSnakeBest.textContent = formatNumber(favorite.best);
    el.profileFavorite.textContent = favorite.title;
    el.profileAchievements.textContent = `${state.achievements.length}/${achievements.length}`;
  }

  function getFavoriteGame() {
    const gameStats = [
      {
        id: "snake",
        title: "Snake",
        runs: Number(state.stats.snakeRuns) || 0,
        xp: Number(state.stats.snakeXpEarned) || 0,
        best: Number(state.stats.snakeBest) || 0
      }
    ];

    return gameStats.sort((a, b) => {
      if (b.runs !== a.runs) return b.runs - a.runs;
      if (b.xp !== a.xp) return b.xp - a.xp;
      return b.best - a.best;
    })[0];
  }

  function renderAchievements() {
    el.achievementList.innerHTML = "";
    achievements.forEach((achievement) => {
      const unlocked = state.achievements.includes(achievement.id);
      const text = achievement.id === "booster_climb" && state.boosterLevelTarget
        ? `Use a booster to reach level ${state.boosterLevelTarget}.`
        : achievement.text;
      const card = document.createElement("div");
      card.className = `achievement-card ${unlocked ? "unlocked" : "locked"}`;
      card.innerHTML = `
        <p class="system-line">${unlocked ? "Unlocked" : "Locked"}</p>
        <h3>${achievement.title}</h3>
        <p>${text}</p>
      `;
      el.achievementList.appendChild(card);
    });
    el.achievementCount.textContent = `${state.achievements.length} / ${achievements.length}`;
  }

  function renderLeaderboard() {
    const rows = buildLeaderboardRows();

    el.leaderboardPreview.innerHTML = rows.map((row, index) => `
      <div class="score-row ${row.isUser ? "you" : ""}">
        <span class="rank">#${index + 1}</span>
        <strong>${row.player}</strong>
        <small>Level ${row.level} - ${formatNumber(row.xp)} XP - ${formatCompactNumber(row.coins)} Coins</small>
      </div>
    `).join("");
  }

  function buildLeaderboardRows() {
    const userLevel = Math.max(1, state.level);
    const userXp = Number(state.xp) || 0;
    const userCoins = Number(state.coins) || 0;
    const tick = Math.floor(Date.now() / 45000);
    const userSecond = tick % 4 === 2;
    const rivals = rivalNames.slice(0, 4).map((name, index) => {
      const wave = Math.sin((tick + index * 1.73) * 0.91);
      let levelOffset = Math.round(wave * 2) - 1;
      if (userSecond && index === 0) levelOffset = 1 + (tick % 2);
      if (!userSecond && index === 0) levelOffset = Math.min(levelOffset, -1);
      const level = Math.max(1, userLevel + levelOffset);
      const levelFloor = xpForLevel(level);
      const needed = xpNeededForLevel(level);
      const xp = levelFloor + Math.floor(needed * (0.18 + Math.abs(wave) * 0.68));
      const coinFactor = 0.42 + Math.abs(Math.cos(tick * 0.7 + index)) * 0.9;
      return {
        player: name,
        level,
        xp,
        coins: Math.max(40, Math.floor((userCoins + 220 + index * 145) * coinFactor)),
        isUser: false
      };
    });

    const rows = [
      { player: state.playerName || "YOU", level: userLevel, xp: userXp, coins: userCoins, isUser: true },
      ...rivals
    ];

    return rows.sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      if (b.xp !== a.xp) return b.xp - a.xp;
      return b.coins - a.coins;
    }).slice(0, 5);
  }

  function renderStore() {
    el.storePreviewCoins.textContent = `${formatNumber(state.coins)} Coins`;
    const term = (el.storeSearch?.value || "").trim().toLowerCase();
    document.querySelectorAll(".store-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.storeTab === activeStoreTab);
    });
    el.storeGrid.innerHTML = "";
    const filtered = storeItems.filter((item) => {
      const haystack = `${item.title} ${item.text} ${item.category} ${item.type} ${(item.tags || []).join(" ")}`.toLowerCase();
      return item.category === activeStoreTab && haystack.includes(term);
    });

    if (!filtered.length) {
      el.storeGrid.innerHTML = `<div class="store-empty">No rewards found.</div>`;
      return;
    }

    filtered.forEach((item) => {
      const owned = state.owned.includes(item.id);
      const locked = state.level < item.level;
      const affordable = state.coins >= item.cost;
      const equipped = item.slot === "nameplate" && state.equippedNameplate === item.id;
      const boosterEquipped = item.type === "booster" && state.equippedBooster === item.boost;
      const cooldown = item.type === "booster" ? getBoosterCooldownRemaining(item) : 0;
      const card = document.createElement("div");
      card.className = `store-card ${locked ? "locked" : ""} ${equipped || boosterEquipped ? "equipped" : ""}`;
      card.innerHTML = `
        <p class="system-line">${locked ? `Level ${item.level}` : item.type === "booster" ? cooldown ? `Cooldown ${formatCountdown(cooldown)}` : "Reusable Booster" : "Player Cosmetic"}</p>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
        <div class="store-card-foot">
          <span>${owned ? item.type === "booster" ? cooldown ? formatCountdown(cooldown) : "Ready" : "Owned" : `${formatNumber(item.cost)} Coins`}</span>
          ${renderStoreAction(item, { owned, locked, affordable, equipped, boosterEquipped, cooldown })}
        </div>
      `;
      const action = card.querySelector("[data-store-action]");
      if (action) action.addEventListener("click", () => handleStoreAction(item));
      el.storeGrid.appendChild(card);
    });
  }

  function renderStoreAction(item, status) {
    if (status.locked) return `<button class="arcade-btn secondary" data-store-action type="button">Locked</button>`;
    if (item.type === "cosmetic" && status.owned) {
      return `
        <button class="equip-toggle ${status.equipped ? "on" : ""}" data-store-action type="button" aria-pressed="${status.equipped}">
          <span></span><b>${status.equipped ? "Equipped" : "Equip"}</b>
        </button>
      `;
    }
    if (item.type === "booster" && status.owned) {
      if (status.cooldown) {
        return `<button class="arcade-btn secondary" data-store-action type="button">Cooldown</button>`;
      }
      return `
        <button class="equip-toggle ${status.boosterEquipped ? "on" : ""}" data-store-action type="button" aria-pressed="${status.boosterEquipped}">
          <span></span><b>${status.boosterEquipped ? "Equipped" : "Equip"}</b>
        </button>
      `;
    }
    return `<button class="arcade-btn ${status.affordable ? "primary" : "secondary"}" data-store-action type="button">${status.affordable ? "Purchase" : "Need Coins"}</button>`;
  }

  function handleStoreAction(item) {
    if (item.type === "cosmetic" && state.owned.includes(item.id)) {
      toggleCosmetic(item);
      return;
    }
    if (item.type === "booster" && state.owned.includes(item.id)) {
      toggleBooster(item);
      return;
    }
    buyStoreItem(item);
  }

  function toggleCosmetic(item) {
    if (item.slot !== "nameplate") return;
    state.equippedNameplate = state.equippedNameplate === item.id ? null : item.id;
    saveState();
    renderAll();
    showToast(state.equippedNameplate === item.id ? "Nameplate Equipped" : "Nameplate Removed", item.title, "win");
  }

  function toggleBooster(item) {
    const cooldown = getBoosterCooldownRemaining(item);
    if (cooldown) {
      showToast("Booster Cooling Down", `${item.title} ready in ${formatCountdown(cooldown)}.`);
      return;
    }
    state.equippedBooster = state.equippedBooster === item.boost ? null : item.boost;
    saveState();
    renderAll();
    showToast(state.equippedBooster === item.boost ? "Booster Equipped" : "Booster Unequipped", item.title, "win");
  }

  function buyStoreItem(item) {
    if (state.level < item.level) {
      showToast("Reward Locked", `Reach level ${item.level} to unlock this reward.`);
      return;
    }
    if (item.type === "cosmetic" && state.owned.includes(item.id)) {
      showToast("Already Owned", "This reward is already on your player card.");
      return;
    }
    if (item.type === "booster" && state.owned.includes(item.id)) {
      showToast("Already Owned", "Equip this booster when it is ready.");
      return;
    }
    if (state.coins < item.cost) {
      showToast("Need More Coins", `${formatNumber(item.cost - state.coins)} more coins required.`);
      return;
    }

    state.coins -= item.cost;
    if (item.type === "cosmetic") {
      state.owned.push(item.id);
      if (item.slot === "nameplate") state.equippedNameplate = item.id;
    }
    if (item.type === "booster") {
      state.owned.push(item.id);
      state.equippedBooster = item.boost;
      state.boosterPurchases += 1;
      state.boosterLevelTarget = Math.max(Number(state.boosterLevelTarget) || 0, state.level + 2);
    }
    saveState();
    renderAll();
    showToast("Purchase Complete", item.type === "booster" ? `${item.title} unlocked and equipped.` : `${item.title} unlocked.`, "win");
  }

  function openSnake() {
    prepareGameTheme();
    showScreen("game");
    resetSnake();
  }

  function createSnakeState() {
    return {
      running: false,
      paused: false,
      score: 0,
      streak: 0,
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      body: [
        { x: 8, y: 10 },
        { x: 7, y: 10 },
        { x: 6, y: 10 }
      ],
      food: { x: 14, y: 10 },
      particles: [],
      popups: [],
      runStartedAt: 0
    };
  }

  function resetSnake() {
    stopSnake();
    snake = createSnakeState();
    placeFood();
    renderSnakeStats();
    drawSnake();
  }

  function syncSnakeButtons() {
    el.startSnakeBtn.textContent = snake.running ? "End Game" : "Start Game";
    el.pauseSnakeBtn.textContent = snake.paused ? "Resume" : "Pause";
    el.topPauseSnakeBtn.textContent = snake.paused ? "Resume" : "Pause";
  }

  function startSnake() {
    resetSnake();
    snake.running = true;
    snake.paused = false;
    snake.runStartedAt = Date.now();
    syncSnakeButtons();
    playTone("tap");
    playGameTheme("snake", { restart: true });
    snakeTimer = setInterval(tickSnake, GAME_TICK_MS);
  }

  function stopSnake() {
    if (snakeTimer) {
      clearInterval(snakeTimer);
      snakeTimer = null;
    }
    snake.running = false;
    snake.paused = false;
    syncSnakeButtons();
  }

  function handlePrimarySnakeAction() {
    if (snake.running) {
      endSnakeRun("manual");
      return;
    }
    startSnake();
  }

  function togglePause() {
    if (!snake.running) return;
    snake.paused = !snake.paused;
    syncSnakeButtons();
    drawSnake();
  }

  function changeDirection(dir) {
    const vectors = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 }
    };
    const next = vectors[dir];
    if (!next || snake.paused) return;
    if (next.x + snake.direction.x === 0 && next.y + snake.direction.y === 0) return;
    snake.nextDirection = next;
  }

  function tickSnake() {
    if (snake.paused) return;

    snake.direction = snake.nextDirection;
    const head = snake.body[0];
    const next = { x: head.x + snake.direction.x, y: head.y + snake.direction.y };
    const hitWall = next.x < 0 || next.y < 0 || next.x >= GRID_SIZE || next.y >= GRID_SIZE;
    const hitSelf = snake.body.some((part) => part.x === next.x && part.y === next.y);

    if (hitWall || hitSelf) {
      endSnakeRun();
      return;
    }

    snake.body.unshift(next);
    if (next.x === snake.food.x && next.y === snake.food.y) {
      snake.score += 1;
      snake.streak += 1;
      state.stats.snakeApples += 1;
      addFoodParticles(next);
      snake.popups.push({ x: next.x, y: next.y, life: 12, text: "+1" });
      playTone("eat");
      placeFood();
    } else {
      snake.body.pop();
    }

    updateEffects();
    renderSnakeStats();
    drawSnake();
  }

  function updateEffects() {
    snake.particles = snake.particles
      .map((p) => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 1 }))
      .filter((p) => p.life > 0);
    snake.popups = snake.popups
      .map((p) => ({ ...p, y: p.y - 0.08, life: p.life - 1 }))
      .filter((p) => p.life > 0);
  }

  function addFoodParticles(cell) {
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10;
      snake.particles.push({
        x: cell.x + 0.5,
        y: cell.y + 0.5,
        vx: Math.cos(angle) * 0.08,
        vy: Math.sin(angle) * 0.08,
        life: 12
      });
    }
  }

  function placeFood() {
    let food;
    do {
      food = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    } while (snake.body.some((part) => part.x === food.x && part.y === food.y));
    snake.food = food;
  }

  function previewEarned() {
    return applyRewardBooster(calculateSnakeXp());
  }

  function runElapsedSeconds() {
    if (!snake.runStartedAt) return 0;
    return Math.max(0, Math.floor((Date.now() - snake.runStartedAt) / 1000));
  }

  function getStoreItem(id) {
    return storeItems.find((item) => item.id === id || item.boost === id);
  }

  function getBoosterCooldownRemaining(item) {
    const cooldownUntil = Number(state.boosterCooldowns?.[item.boost]) || 0;
    return Math.max(0, cooldownUntil - Date.now());
  }

  function formatCountdown(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  function getEquippedBoosterItem() {
    if (!state.equippedBooster) return null;
    const item = getStoreItem(state.equippedBooster);
    if (!item || getBoosterCooldownRemaining(item) > 0) return null;
    return item;
  }

  function snakeRunMultiplier() {
    return 1 + snake.score * 0.1;
  }

  function calculateSnakeXp() {
    if (snake.score <= 0) return 0;
    const base = snake.score * 14;
    const survivalBonus = Math.floor(runElapsedSeconds() / 20);
    const newBestBonus = snake.score > state.stats.snakeBest && snake.score >= 5 ? 35 + snake.score * 4 : 0;
    return Math.round((base + survivalBonus + newBestBonus) * snakeRunMultiplier());
  }

  function applyRewardBooster(value) {
    const booster = getEquippedBoosterItem();
    return booster ? Math.round(value * booster.multiplier) : value;
  }

  function previewCoins(newBest = snake.score > state.stats.snakeBest) {
    const playTimeBonus = Math.floor(runElapsedSeconds() / 15);
    let earned = Math.max(2, snake.score * 3 + snake.streak + playTimeBonus);
    if (newBest) earned += 25;
    return applyRewardBooster(earned);
  }

  function drawSnake() {
    const ctx = el.snakeCanvas.getContext("2d");
    const size = el.snakeCanvas.width;
    const cell = size / GRID_SIZE;
    const now = performance.now();

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#05030b";
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "rgba(196, 113, 255, 0.16)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i += 1) {
      const p = i * cell;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, size);
      ctx.moveTo(0, p);
      ctx.lineTo(size, p);
      ctx.stroke();
    }

    snake.body.forEach((part, index) => {
      const x = part.x * cell + 3;
      const y = part.y * cell + 3;
      const g = ctx.createLinearGradient(x, y, x + cell, y + cell);
      g.addColorStop(0, index === 0 ? "#49f4ff" : "#57ff9a");
      g.addColorStop(1, index === 0 ? "#ff2fad" : "#1fd36f");
      ctx.fillStyle = g;
      ctx.shadowColor = index === 0 ? "#ff2fad" : "#57ff9a";
      ctx.shadowBlur = index === 0 ? 20 : 9;
      ctx.fillRect(x, y, cell - 6, cell - 6);
    });

    const pulse = 0.24 + Math.sin(now / 120) * 0.08;
    ctx.shadowBlur = 22;
    ctx.shadowColor = "#ffd35a";
    ctx.fillStyle = "#ffd35a";
    ctx.beginPath();
    ctx.arc((snake.food.x + 0.5) * cell, (snake.food.y + 0.5) * cell, cell * pulse, 0, Math.PI * 2);
    ctx.fill();

    snake.particles.forEach((p) => {
      ctx.globalAlpha = Math.max(0, p.life / 12);
      ctx.fillStyle = "#ffd35a";
      ctx.beginPath();
      ctx.arc(p.x * cell, p.y * cell, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    snake.popups.forEach((p) => {
      ctx.globalAlpha = Math.max(0, p.life / 12);
      ctx.font = "700 18px Segoe UI";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(p.text, p.x * cell + 6, p.y * cell);
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    if (snake.paused) {
      ctx.fillStyle = "rgba(5, 3, 11, 0.68)";
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 42px Arial Black";
      ctx.textAlign = "center";
      ctx.fillText("PAUSED", size / 2, size / 2);
      ctx.textAlign = "left";
    }
  }

  function renderSnakeStats() {
    const preview = previewEarned();
    const liveBest = Math.max(Number(state.stats.snakeBest) || 0, Number(snake.score) || 0);
    el.snakeScore.textContent = formatNumber(snake.score);
    el.snakeBest.textContent = formatNumber(liveBest);
    el.snakeLiveBest.textContent = formatNumber(liveBest);
    el.snakeStreak.textContent = formatNumber(snake.streak);
    el.snakeXpPreview.textContent = formatNumber(preview);
    el.snakeCoinPreview.textContent = formatNumber(previewCoins());
  }

  function endSnakeRun(reason = "crash") {
    if (!snake.running) return;
    stopSnake();
    playTone(reason === "manual" ? "tap" : "fail");
    stopGameTheme(reason === "crash" ? "death" : "stop");

    const previousBest = state.stats.snakeBest;
    const newBest = snake.score > previousBest;
    const oldAchievements = new Set(state.achievements);
    const boosterUsed = getEquippedBoosterItem();
    let earned = applyRewardBooster(calculateSnakeXp());
    let coinsEarned = previewCoins(newBest);

    state.stats.gamesPlayed += 1;
    state.stats.snakeRuns += 1;
    state.stats.snakeTotalScore += snake.score;
    state.stats.snakeBest = Math.max(previousBest, snake.score);

    if (boosterUsed) {
      state.boosterCooldowns[boosterUsed.boost] = Date.now() + 10 * 60 * 1000;
      state.equippedBooster = null;
      state.boosterUses += 1;
      if (!state.boosterLevelTarget || state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
      showToast("Booster Used", `${boosterUsed.title} applied. Cooldown started.`, "win");
    }

    state.xp += earned;
    state.stats.snakeXpEarned += earned;
    state.coins += coinsEarned;
    state.level = deriveLevel(state.xp);
    unlockEarnedAchievements();
    if (boosterUsed && state.level >= state.boosterLevelTarget) {
      state.boosterLevelTarget = state.level + 2;
    }
    saveState();
    renderAll();

    const newAchievements = achievements.filter((item) => !oldAchievements.has(item.id) && state.achievements.includes(item.id));
    if (newBest) showToast("New High Score", `Snake best is now ${formatNumber(snake.score)}.`, "win");
    showToast("XP Earned", `+${formatNumber(earned)} XP.`, "win");
    showToast("Coins Earned", `+${formatNumber(coinsEarned)} coins.`, "win");
    el.resultScore.textContent = formatNumber(snake.score);
    el.resultXp.textContent = formatNumber(earned);
    el.resultCoins.textContent = formatNumber(coinsEarned);
    el.resultBest.textContent = formatNumber(state.stats.snakeBest);
    el.newBestBadge.classList.toggle("hidden", !newBest);
    el.resultAchievements.innerHTML = newAchievements.map((item) => `<span>${item.title}</span>`).join("");
    el.resultMessage.textContent = newBest
      ? "New personal best. Keep the streak going."
      : reason === "manual"
        ? "Run ended. Your score has been saved."
        : "Run complete. Retry and beat your score.";
    el.gameOverModal.classList.remove("hidden");
  }

  function unlockEarnedAchievements() {
    const checks = [
      ["first_run", state.stats.gamesPlayed >= 1],
      ["snake_10", state.stats.snakeBest >= 10],
      ["snake_25", state.stats.snakeBest >= 25],
      ["level_2", state.level >= 2],
      ["level_5", state.level >= 5],
      ["booster_buyer", state.boosterPurchases >= 1],
      ["booster_used", state.boosterUses >= 1],
      ["booster_climb", state.boosterUses >= 1 && state.boosterLevelTarget && state.level >= state.boosterLevelTarget]
    ];

    checks.forEach(([id, passed]) => {
      if (!passed || state.achievements.includes(id)) return;
      state.achievements.push(id);
      const achievement = achievements.find((item) => item.id === id);
      showToast("Achievement Unlocked", achievement?.title || id, "win");
    });
  }

  async function shareProfile() {
    const text = `Check out my ARCADIA profile. Level ${state.level}, ${formatNumber(state.xp)} XP, ${formatNumber(state.coins)} coins, Snake best ${formatNumber(state.stats.snakeBest)}. Bet you can't top that.`;
    const data = { title: "ARCADIA", text, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        showToast("Copied", "Profile share text copied.", "win");
      }
    } catch {
      showToast("Share Canceled", "No worries. Keep playing.");
    }
  }

  async function searchForUpdates() {
    el.developerModal.classList.add("hidden");
    await startBackgroundVideo();
    try {
      if (navigator.serviceWorker?.getRegistration) {
        const registration = await navigator.serviceWorker.getRegistration();
        await registration?.update();
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
    } catch {
      // Cache access can be blocked in some browser modes.
    }

    const previousVersion = localStorage.getItem(VERSION_KEY);
    localStorage.setItem(VERSION_KEY, APP_VERSION);
    if (previousVersion !== APP_VERSION) {
      showToast("Update Successful", `Patches include: ${PATCH_NOTES.join(" ")}`, "win", 5000);
      return;
    }
    showToast("No Updates Found", "ARCADIA is already running the latest patch.", "tap", 5000);
  }

  function openRenameModal() {
    el.renamePlayerName.value = state.playerName || "";
    el.renameModal.classList.remove("hidden");
    el.renamePlayerName.focus();
  }

  function renamePlayer(name) {
    const nextName = name.trim().replace(/\s+/g, " ").slice(0, 16);
    if (!nextName) return;
    state.playerName = nextName;
    saveState();
    renderAll();
    el.renameModal.classList.add("hidden");
    showToast("Profile Updated", `${state.playerName} is now linked.`, "win", 5000);
  }

  function loadImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function loadImageElement(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async function saveProfilePhoto(file) {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const src = await loadImageFile(file);
      const img = await loadImageElement(src);
      const size = 320;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - side) / 2;
      const sy = (img.naturalHeight - side) / 2;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
      state.profileImage = canvas.toDataURL("image/jpeg", 0.82);
      saveState();
      renderAll();
      showToast("Profile Photo Set", "Your player card has been updated.", "win");
    } catch {
      showToast("Photo Error", "That image could not be loaded.");
    }
  }

  function bindEvents() {
    syncAppHeight();
    window.addEventListener("resize", syncAppHeight);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", syncAppHeight);
    storeCountdownTimer = setInterval(() => {
      if (currentScreen !== "profile" || activeStoreTab !== "boosters") return;
      if (!storeItems.some((item) => item.type === "booster" && getBoosterCooldownRemaining(item) > 0)) return;
      renderStore();
    }, 1000);

    el.skipBootBtn.addEventListener("click", () => {
      playTone("tap");
      showConnectionPrompt();
    });

    el.connectionActionBtn.addEventListener("click", enterArcadia);

    el.playerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = el.playerName.value.trim().replace(/\s+/g, " ");
      if (!name) return;
      state.playerName = name.slice(0, 16);
      saveState();
      startBackgroundVideo();
      showScreen("home");
      showToast("Player Linked", `${state.playerName} entered ARCADIA.`, "win");
    });

    el.openProfileBtn.addEventListener("click", () => showScreen("profile"));
    el.backFromProfileBtn.addEventListener("click", () => showScreen("home"));
    el.exitGameBtn.addEventListener("click", () => showScreen("home"));
    el.profileShareBtn.addEventListener("click", shareProfile);
    el.profileAvatar.addEventListener("click", () => el.profilePhotoInput.click());
    el.profilePhotoInput.addEventListener("change", () => {
      const file = el.profilePhotoInput.files?.[0];
      el.profilePhotoInput.value = "";
      saveProfilePhoto(file);
    });
    el.developerModeBtn.addEventListener("click", () => el.developerModal.classList.remove("hidden"));
    el.closeDeveloperBtn.addEventListener("click", () => el.developerModal.classList.add("hidden"));
    el.checkUpdatesBtn.addEventListener("click", searchForUpdates);
    el.openRenameBtn.addEventListener("click", openRenameModal);
    el.closeRenameBtn.addEventListener("click", () => el.renameModal.classList.add("hidden"));
    el.renameForm.addEventListener("submit", (event) => {
      event.preventDefault();
      renamePlayer(el.renamePlayerName.value);
    });

    el.gameSearch.addEventListener("input", renderGames);
    el.clearSearchBtn.addEventListener("click", () => {
      el.gameSearch.value = "";
      renderGames();
      el.gameSearch.focus();
    });
    el.storeSearch.addEventListener("input", renderStore);
    document.querySelectorAll(".store-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        activeStoreTab = tab.dataset.storeTab || "player";
        renderStore();
      });
    });

    el.startSnakeBtn.addEventListener("click", handlePrimarySnakeAction);
    el.pauseSnakeBtn.addEventListener("click", togglePause);
    el.topPauseSnakeBtn.addEventListener("click", togglePause);
    el.restartSnakeBtn.addEventListener("click", startSnake);
    el.retrySnakeBtn.addEventListener("click", () => {
      el.gameOverModal.classList.add("hidden");
      startSnake();
    });
    el.closeResultBtn.addEventListener("click", () => {
      el.gameOverModal.classList.add("hidden");
      showScreen("home");
    });

    document.addEventListener("keydown", (event) => {
      const keyMap = {
        ArrowUp: "up",
        w: "up",
        W: "up",
        ArrowDown: "down",
        s: "down",
        S: "down",
        ArrowLeft: "left",
        a: "left",
        A: "left",
        ArrowRight: "right",
        d: "right",
        D: "right"
      };
      if (keyMap[event.key] && currentScreen === "game") {
        event.preventDefault();
        changeDirection(keyMap[event.key]);
      }
      if (event.key === " " && currentScreen === "game") {
        event.preventDefault();
        snake.running ? togglePause() : startSnake();
      }
    });

    el.snakeCanvas.addEventListener("pointerdown", (event) => {
      touchStart = { x: event.clientX, y: event.clientY };
    });

    el.snakeCanvas.addEventListener("pointerup", (event) => {
      if (!touchStart) return;
      const dx = event.clientX - touchStart.x;
      const dy = event.clientY - touchStart.y;
      touchStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
      changeDirection(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
    });

    window.addEventListener("resize", () => {
      if (!document.body.classList.contains("video-live")) return;
      startBackgroundVideo();
    });
  }

  function init() {
    bindEvents();
    drawSnake();
    setTimeout(() => {
      if (currentScreen === "boot") {
        showConnectionPrompt();
      }
    }, 2200);
  }

  init();
})();
