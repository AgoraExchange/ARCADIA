(() => {
  "use strict";

  const STORAGE_KEY = "arcadia_player_v1";
  const VERSION_KEY = "arcadia_app_version";
  const APP_VERSION = "9.7.5.26";
  const VERSION_URL = "app-version.json";
  const DEV_ACCESS_CODE = "80sarcadia";
  const PATCH_NOTES = [
    "Star Invaders now uses a lightweight 8-bit blaster tone instead of MP3 rapid-fire audio.",
    "Star Invaders powerups added with health, damage boosts, wingmen, and rare rocket support.",
    "Star Invaders blast sound optimized for rapid-fire performance.",
    "Stack game card cover image updated.",
    "Stack added as the fourth playable ARCADIA game.",
    "Stack includes slicing, perfect placement combos, tower growth, and speed scaling.",
    "Star Invaders blast sound effect added for every shot.",
    "Operator Gate now shakes and flashes red when the access code is wrong.",
    "Developer Operator Gate added with gated Dev Mode tools.",
    "Dev Mode can now edit player level and coins for testing.",
    "Version labels now use the ARCADIA release and deploy date format.",
    "Developer Mode version text now has a static fallback for cached mobile browsers.",
    "Home-screen app update checks now refresh the live PWA cache without deleting player data.",
    "Developer Mode now shows the installed ARCADIA version.",
    "Block Grid and Star Invaders now use Pause controls instead of Rules buttons.",
    "Developer Mode audio toggles added for sound effects and soundtrack music.",
    "Star Invaders added with joystick, shooting, enemies, bosses, and meteors.",
    "Block Grid start, grab, and place sound effects added.",
    "Block Grid start reveal animation added before pieces appear.",
    "Block Grid theme music added and starts only when the run starts.",
    "Block Grid tray now stays empty until Start Game.",
    "Block Grid drag-and-drop placement with neon board previews added.",
    "Block Grid added as the second playable ARCADIA game.",
    "Level up sound and dashboard pulse reward added.",
    "Game over sound effect added for failed runs.",
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
  const BLOCK_GRID_SIZE = 8;
  const GAME_TICK_MS = 112;
  const STAR_TICK_MS = 1000 / 60;
  const STACK_TICK_MS = 1000 / 60;
  const GAME_OVER_SFX = "assets/audio/sfx/game-over.mp3";
  const LEVEL_UP_SFX = "assets/audio/sfx/level-up.mp3";
  const BLOCK_START_SFX = "assets/audio/sfx/block-grid/start.mp3";
  const BLOCK_GRAB_SFX = "assets/audio/sfx/block-grid/grab.mp3";
  const BLOCK_PLACE_SFX = "assets/audio/sfx/block-grid/place.mp3";
  const THEME_SONGS = {
    lobby: [
      "assets/themesong/lobby/lobby1.mp3",
      "assets/themesong/lobby/lobby2.mp3",
      "assets/themesong/lobby/lobby3.mp3"
    ],
    games: {
      snake: "assets/themesong/games/snake.mp3",
      block: "assets/themesong/games/block-grid.mp3",
      star: "assets/themesong/games/star-invaders.mp3",
      stack: [
        "assets/themesong/games/stack.mp3",
        "assets/themesong/games/stack-2.mp3",
        "assets/themesong/games/stack-3.mp3"
      ],
      starBoss: "assets/themesong/games/star-invaders-boss.mp3"
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
    muteSfx: false,
    muteMusic: false,
    devModeEnabled: false,
    activityLog: [],
    stats: {
      gamesPlayed: 0,
      snakeRuns: 0,
      snakeBest: 0,
      snakeXpEarned: 0,
      snakeTotalScore: 0,
      snakeApples: 0,
      blockRuns: 0,
      blockBest: 0,
      blockXpEarned: 0,
      blockTotalScore: 0,
      blockLines: 0,
      starRuns: 0,
      starBest: 0,
      starXpEarned: 0,
      starTotalScore: 0,
      starKills: 0,
      starBossKills: 0,
      stackRuns: 0,
      stackBest: 0,
      stackXpEarned: 0,
      stackTotalScore: 0,
      stackPerfects: 0
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
      title: "Block Grid",
      gameNo: "02",
      tags: ["block", "puzzle", "grid", "combo", "blast"],
      description: "Place fixed pieces, clear lines, and keep the board open.",
      status: "Play",
      available: true,
      image: "assets/images/games/blockgrid.png",
      mark: "B"
    },
    {
      id: "invaders",
      title: "Star Invaders",
      gameNo: "03",
      tags: ["space", "shooter", "aliens"],
      description: "Dodge meteors, blast enemies, and survive the star lane.",
      status: "Play",
      available: true,
      image: "assets/images/games/starinvaders.png",
      mark: "I"
    },
    {
      id: "stack",
      title: "Stack",
      gameNo: "04",
      tags: ["stack", "tower", "timing", "precision"],
      description: "Time each slab, cut the overhang, and climb higher.",
      status: "Play",
      available: true,
      image: "assets/images/games/stack.png",
      mark: "K"
    },
    {
      id: "runner",
      title: "Turbo Tunnel",
      gameNo: "05",
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
    { id: "block_first", title: "Block Drop", text: "Complete your first Block Grid run." },
    { id: "block_500", title: "Line Crusher", text: "Score 500 or higher in Block Grid." },
    { id: "star_first", title: "First Launch", text: "Complete your first Star Invaders run." },
    { id: "star_25", title: "Astro Ace", text: "Destroy 25 enemies in Star Invaders." },
    { id: "stack_first", title: "Tower Drop", text: "Complete your first Stack run." },
    { id: "stack_20", title: "Neon Highrise", text: "Score 20 or higher in Stack." },
    { id: "stack_perfect_5", title: "Perfect Builder", text: "Land 5 perfect Stack placements in one run." },
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
  let currentGame = "";
  let snakeTimer = null;
  let snake = createSnakeState();
  let block = createBlockState();
  let star = createStarState();
  let starTimer = null;
  let stack = createStackState();
  let stackTimer = null;
  let touchStart = null;
  let headerSeenXp = Number(state.xp) || 0;
  let dashboardRewardTimer = null;
  let activeStoreTab = "player";
  let storeCountdownTimer = null;
  let themeAudio = null;
  let gameOverAudio = null;
  let levelUpAudio = null;
  let activeTheme = "";
  let themeFadeTimer = null;
  const sfxPools = new Map();
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
    blockScreen: $("blockScreen"),
    starScreen: $("starScreen"),
    stackScreen: $("stackScreen"),
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
    progressModeBtn: $("progressModeBtn"),
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
    exitBlockBtn: $("exitBlockBtn"),
    blockPauseBtn: $("blockPauseBtn"),
    blockBoard: $("blockBoard"),
    blockTray: $("blockTray"),
    blockScore: $("blockScore"),
    blockBest: $("blockBest"),
    blockLines: $("blockLines"),
    blockXpPreview: $("blockXpPreview"),
    blockCoinPreview: $("blockCoinPreview"),
    startBlockBtn: $("startBlockBtn"),
    restartBlockBtn: $("restartBlockBtn"),
    exitStarBtn: $("exitStarBtn"),
    starPauseBtn: $("starPauseBtn"),
    starCanvas: $("starCanvas"),
    starScore: $("starScore"),
    starBest: $("starBest"),
    starKills: $("starKills"),
    starHealth: $("starHealth"),
    starXpPreview: $("starXpPreview"),
    starCoinPreview: $("starCoinPreview"),
    starJoystick: $("starJoystick"),
    starJoystickKnob: $("starJoystickKnob"),
    starShootBtn: $("starShootBtn"),
    startStarBtn: $("startStarBtn"),
    restartStarBtn: $("restartStarBtn"),
    exitStackBtn: $("exitStackBtn"),
    stackPauseBtn: $("stackPauseBtn"),
    stackCanvas: $("stackCanvas"),
    stackScore: $("stackScore"),
    stackBest: $("stackBest"),
    stackCombo: $("stackCombo"),
    stackXpPreview: $("stackXpPreview"),
    stackCoinPreview: $("stackCoinPreview"),
    startStackBtn: $("startStackBtn"),
    restartStackBtn: $("restartStackBtn"),
    toastStack: $("toastStack"),
    gameOverModal: $("gameOverModal"),
    connectionModal: $("connectionModal"),
    connectionKicker: $("connectionKicker"),
    connectionTitle: $("connectionTitle"),
    connectionMessage: $("connectionMessage"),
    connectionActionBtn: $("connectionActionBtn"),
    developerModal: $("developerModal"),
    toggleSfxBtn: $("toggleSfxBtn"),
    toggleMusicBtn: $("toggleMusicBtn"),
    checkUpdatesBtn: $("checkUpdatesBtn"),
    openRenameBtn: $("openRenameBtn"),
    devUnlockedControls: $("devUnlockedControls"),
    editLevelBtn: $("editLevelBtn"),
    editCoinsBtn: $("editCoinsBtn"),
    devLevelValue: $("devLevelValue"),
    devCoinsValue: $("devCoinsValue"),
    closeDeveloperBtn: $("closeDeveloperBtn"),
    openBackdoorBtn: $("openBackdoorBtn"),
    appVersionText: $("appVersionText"),
    backdoorModal: $("backdoorModal"),
    backdoorForm: $("backdoorForm"),
    developerAccessCode: $("developerAccessCode"),
    closeBackdoorBtn: $("closeBackdoorBtn"),
    devModeModal: $("devModeModal"),
    devModeToggle: $("devModeToggle"),
    closeDevModeBtn: $("closeDevModeBtn"),
    progressModal: $("progressModal"),
    closeProgressBtn: $("closeProgressBtn"),
    progressMostXp: $("progressMostXp"),
    progressMostXpMeta: $("progressMostXpMeta"),
    progressLeastXp: $("progressLeastXp"),
    progressLeastXpMeta: $("progressLeastXpMeta"),
    progressGameXpList: $("progressGameXpList"),
    progressActivityList: $("progressActivityList"),
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

  async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return null;
    try {
      return await navigator.serviceWorker.register("sw.js", { updateViaCache: "none" });
    } catch {
      return null;
    }
  }

  function waitForServiceWorkerRefresh() {
    if (!("serviceWorker" in navigator)) return Promise.resolve(false);
    return new Promise((resolve) => {
      let resolved = false;
      const finish = (value) => {
        if (resolved) return;
        resolved = true;
        navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
        resolve(value);
      };
      const onControllerChange = () => finish(true);
      navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
      setTimeout(() => finish(false), 1800);
    });
  }

  async function activateWaitingWorker(registration) {
    if (!registration?.waiting) return false;
    const refreshed = waitForServiceWorkerRefresh();
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
    return refreshed;
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
      muteSfx: Boolean(saved?.muteSfx),
      muteMusic: Boolean(saved?.muteMusic),
      devModeEnabled: Boolean(saved?.devModeEnabled),
      stats: { ...clone(defaultState.stats), ...(saved?.stats || {}) },
      owned: Array.isArray(saved?.owned) ? saved.owned : [],
      achievements: Array.isArray(saved?.achievements) ? saved.achievements : [],
      activityLog: Array.isArray(saved?.activityLog) ? saved.activityLog.slice(0, 40) : []
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

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
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
    el.blockScreen.classList.toggle("hidden", name !== "block");
    el.starScreen.classList.toggle("hidden", name !== "star");
    el.stackScreen.classList.toggle("hidden", name !== "stack");
    if (name !== "game") stopSnake();
    if (name !== "block") stopBlock(false);
    if (name !== "star") stopStar(false);
    if (name !== "stack") stopStack(false);
    renderAll();
    if (name === "home") {
      playLobbyTheme({ transition: ["game", "block", "star", "stack"].includes(previousScreen) });
    } else if (["game", "block", "star", "stack"].includes(previousScreen) && name !== previousScreen) {
      stopGameTheme();
    }
  }

  function playTone(kind = "tap") {
    if (state.muteSfx) return;
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
    if (state.muteSfx) return;
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

  function getGameOverAudio() {
    if (!gameOverAudio) {
      gameOverAudio = new Audio(GAME_OVER_SFX);
      gameOverAudio.preload = "auto";
      gameOverAudio.volume = 0.86;
    }
    return gameOverAudio;
  }

  async function playGameOverSound() {
    if (state.muteSfx) return;
    try {
      const audio = getGameOverAudio();
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0.86;
      await audio.play();
    } catch {
      playFailTone();
    }
  }

  function getLevelUpAudio() {
    if (!levelUpAudio) {
      levelUpAudio = new Audio(LEVEL_UP_SFX);
      levelUpAudio.preload = "auto";
      levelUpAudio.volume = 0.9;
    }
    return levelUpAudio;
  }

  async function playLevelUpSound() {
    if (state.muteSfx) return;
    try {
      const audio = getLevelUpAudio();
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0.9;
      await audio.play();
    } catch {
      playTone("level");
    }
  }

  function playOneShotSfx(src, volume = 0.85) {
    if (state.muteSfx) return;
    try {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch {
      playTone("tap");
    }
  }

  function playPooledSfx(src, volume = 0.75, poolSize = 4) {
    if (state.muteSfx) return;
    try {
      let pool = sfxPools.get(src);
      if (!pool) {
        pool = {
          index: 0,
          lastPlayed: 0,
          items: Array.from({ length: poolSize }, () => {
            const audio = new Audio(src);
            audio.preload = "auto";
            audio.volume = volume;
            return audio;
          })
        };
        sfxPools.set(src, pool);
      }
      const now = performance.now();
      if (now - pool.lastPlayed < 42) return;
      pool.lastPlayed = now;
      const audio = pool.items[pool.index];
      pool.index = (pool.index + 1) % pool.items.length;
      audio.pause();
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch {
      playToneAt(1120, 0.035, "square", 0.04);
    }
  }

  function playBlockSfx(kind) {
    const map = {
      start: [BLOCK_START_SFX, 0.9],
      grab: [BLOCK_PLACE_SFX, 0.78],
      place: [BLOCK_GRAB_SFX, 0.82]
    };
    const [src, volume] = map[kind] || map.grab;
    playOneShotSfx(src, volume);
  }

  function triggerLevelUpReward(level) {
    if (currentScreen !== "home") return;
    el.playerLevel.textContent = `Level ${level}`;
    el.playerLevel.classList.remove("level-reward-pop");
    void el.playerLevel.offsetWidth;
    el.playerLevel.classList.add("level-reward-pop");
    showToast("Level Up", `You reached level ${level}.`, "silent", 4000);
    playLevelUpSound();
    setTimeout(() => {
      el.playerLevel.classList.remove("level-reward-pop");
    }, 3100);
  }

  function playToneAt(frequency, duration = 0.055, type = "square", volume = 0.06) {
    if (state.muteSfx) return;
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
    if (state.muteMusic) {
      activeTheme = "";
      fadeThemeOut(160);
      return;
    }
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

  function pickThemeTrack(track) {
    if (!Array.isArray(track)) return track;
    return track[Math.floor(Math.random() * track.length)] || track[0];
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
    const track = pickThemeTrack(THEME_SONGS.games[gameId]);
    const key = Array.isArray(THEME_SONGS.games[gameId]) && options.restart ? `game-${gameId}-${Date.now()}` : `game-${gameId}`;
    playTheme(track, key, { transition: false, ...options });
  }

  function playStarTheme(mode = "normal", options = {}) {
    const key = mode === "boss" ? "starBoss" : "star";
    playTheme(THEME_SONGS.games[key], `game-${key}`, { transition: false, ...options });
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

  function updateAudioToggleButtons() {
    if (!el.toggleSfxBtn || !el.toggleMusicBtn) return;
    el.toggleSfxBtn.textContent = `Sound FX: ${state.muteSfx ? "Off" : "On"}`;
    el.toggleMusicBtn.textContent = `Soundtrack: ${state.muteMusic ? "Off" : "On"}`;
    el.toggleSfxBtn.classList.toggle("is-muted", state.muteSfx);
    el.toggleMusicBtn.classList.toggle("is-muted", state.muteMusic);
  }

  function renderAppVersion() {
    if (!el.appVersionText) return;
    el.appVersionText.textContent = `Version ${APP_VERSION}`;
  }

  function renderDeveloperTools() {
    if (!el.devUnlockedControls) return;
    el.devUnlockedControls.classList.toggle("hidden", !state.devModeEnabled);
    if (el.devModeToggle) el.devModeToggle.checked = Boolean(state.devModeEnabled);
    if (el.devLevelValue) el.devLevelValue.textContent = formatNumber(state.level);
    if (el.devCoinsValue) el.devCoinsValue.textContent = formatNumber(state.coins);
  }

  function normalizeVersion(value) {
    return String(value || "").trim();
  }

  function resumeCurrentTheme() {
    if (state.muteMusic) return;
    if (currentScreen === "home") {
      playLobbyTheme();
      return;
    }
    if (currentScreen === "game" && snake.running) playGameTheme("snake");
    if (currentScreen === "block" && block.running) playGameTheme("block");
    if (currentScreen === "stack" && stack.running) playGameTheme("stack");
    if (currentScreen === "star" && star.running) {
      const bossOnScreen = star.enemies.some((enemy) => enemy.type === "boss" && !enemy.dead);
      playStarTheme(bossOnScreen ? "boss" : "normal");
    }
  }

  function toggleSoundEffects() {
    state.muteSfx = !state.muteSfx;
    saveState();
    updateAudioToggleButtons();
    if (!state.muteSfx) playTone("win");
    showToast("Sound FX", state.muteSfx ? "Sound effects muted." : "Sound effects enabled.", "silent", 3000);
  }

  function toggleSoundtrack() {
    state.muteMusic = !state.muteMusic;
    saveState();
    updateAudioToggleButtons();
    if (state.muteMusic) {
      fadeThemeOut(180);
      showToast("Soundtrack", "Soundtrack muted.", "silent", 3000);
      return;
    }
    resumeCurrentTheme();
    showToast("Soundtrack", "Soundtrack enabled.", "silent", 3000);
  }

  function showToast(title, text, kind = "tap", duration = 3000) {
    const key = `${title}::${text}`;
    const now = Date.now();
    const lastShown = toastCooldowns.get(key) || 0;
    const alreadyQueued = toastQueue.some((item) => item.key === key);

    if (activeToasts.has(key) || alreadyQueued || now - lastShown < 6000) return;

    toastCooldowns.set(key, now);
    recordActivity(title, text, kind);
    toastQueue.push({ key, title, text, kind, duration });
    drainToastQueue();
  }

  function recordActivity(title, text, kind = "tap") {
    const ignored = new Set(["Coming Soon", "Start Game", "No Updates Found", "Share Canceled"]);
    if (ignored.has(title)) return;
    state.activityLog = [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title,
        text,
        kind,
        at: Date.now()
      },
      ...(Array.isArray(state.activityLog) ? state.activityLog : [])
    ].slice(0, 40);
    saveState();
    if (!el.progressModal?.classList.contains("hidden")) renderProgressModal();
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
    if (item.kind !== "silent") playTone(item.kind);
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
    renderProgressModal();
    updateAudioToggleButtons();
    renderAppVersion();
    renderDeveloperTools();
    renderSnakeStats();
    renderBlockStats();
    renderStarStats();
    renderStackStats();
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
          setTimeout(() => {
            triggerLevelUpReward(target.level);
          }, animationDuration + 160);
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
        if (game.id === "snake") openSnake();
        if (game.id === "breakout") openBlockGrid();
        if (game.id === "invaders") openStarInvaders();
        if (game.id === "stack") openStack();
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

  function getGameProgressRows() {
    return [
      {
        title: "Snake",
        xp: Number(state.stats.snakeXpEarned) || 0,
        runs: Number(state.stats.snakeRuns) || 0,
        best: Number(state.stats.snakeBest) || 0,
        metricLabel: "Best"
      },
      {
        title: "Block Grid",
        xp: Number(state.stats.blockXpEarned) || 0,
        runs: Number(state.stats.blockRuns) || 0,
        best: Number(state.stats.blockBest) || 0,
        metricLabel: "Best"
      },
      {
        title: "Star Invaders",
        xp: Number(state.stats.starXpEarned) || 0,
        runs: Number(state.stats.starRuns) || 0,
        best: Number(state.stats.starBossKills) || 0,
        metricLabel: "Bosses"
      },
      {
        title: "Stack",
        xp: Number(state.stats.stackXpEarned) || 0,
        runs: Number(state.stats.stackRuns) || 0,
        best: Number(state.stats.stackBest) || 0,
        metricLabel: "Best"
      }
    ].sort((a, b) => b.xp - a.xp || b.runs - a.runs || b.best - a.best);
  }

  function formatActivityTime(timestamp) {
    const elapsed = Math.max(0, Date.now() - (Number(timestamp) || Date.now()));
    const minutes = Math.floor(elapsed / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  function renderProgressModal() {
    const rows = getGameProgressRows();
    const playedRows = rows.filter((row) => row.xp > 0 || row.runs > 0);
    const most = playedRows[0] || rows[0];
    const least = playedRows.length ? playedRows[playedRows.length - 1] : rows[rows.length - 1];
    const maxXp = Math.max(1, ...rows.map((row) => row.xp));

    el.progressMostXp.textContent = most.title;
    el.progressMostXpMeta.textContent = `${formatNumber(most.xp)} XP earned`;
    el.progressLeastXp.textContent = least.title;
    el.progressLeastXpMeta.textContent = `${formatNumber(least.xp)} XP earned`;
    el.progressGameXpList.innerHTML = rows.map((row) => {
      const pct = Math.max(4, Math.round((row.xp / maxXp) * 100));
      return `
        <div class="progress-game-row">
          <div>
            <strong>${escapeHtml(row.title)}</strong>
            <small>${formatNumber(row.runs)} plays &middot; ${escapeHtml(row.metricLabel)} ${formatNumber(row.best)}</small>
          </div>
          <span>${formatNumber(row.xp)} XP</span>
          <i style="--xp-width: ${pct}%"></i>
        </div>
      `;
    }).join("");

    const activity = (Array.isArray(state.activityLog) ? state.activityLog : []).slice(0, 14);
    el.progressActivityList.innerHTML = activity.length
      ? activity.map((item) => `
        <article class="progress-activity-item">
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.text)}</small>
          </div>
          <time>${formatActivityTime(item.at)}</time>
        </article>
      `).join("")
      : `<div class="progress-empty">No recent notifications yet. Play a game to start filling this up.</div>`;
  }

  function getFavoriteGame() {
    const gameStats = [
      {
        id: "snake",
        title: "Snake",
        runs: Number(state.stats.snakeRuns) || 0,
        xp: Number(state.stats.snakeXpEarned) || 0,
        best: Number(state.stats.snakeBest) || 0
      },
      {
        id: "block",
        title: "Block Grid",
        runs: Number(state.stats.blockRuns) || 0,
        xp: Number(state.stats.blockXpEarned) || 0,
        best: Number(state.stats.blockBest) || 0
      },
      {
        id: "star",
        title: "Star Invaders",
        runs: Number(state.stats.starRuns) || 0,
        xp: Number(state.stats.starXpEarned) || 0,
        best: Number(state.stats.starBest) || 0
      },
      {
        id: "stack",
        title: "Stack",
        runs: Number(state.stats.stackRuns) || 0,
        xp: Number(state.stats.stackXpEarned) || 0,
        best: Number(state.stats.stackBest) || 0
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
    currentGame = "snake";
    prepareGameTheme();
    showScreen("game");
    resetSnake();
  }

  const blockShapes = [
    [[1]],
    [[1, 1]],
    [[1], [1]],
    [[1, 1, 1]],
    [[1], [1], [1]],
    [[1, 1], [1, 1]],
    [[1, 1, 1], [0, 1, 0]],
    [[1, 0], [1, 0], [1, 1]],
    [[0, 1], [0, 1], [1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[1, 1, 1, 1]],
    [[1], [1], [1], [1]]
  ];

  function createBlockState() {
    return {
      running: false,
      paused: false,
      board: Array.from({ length: BLOCK_GRID_SIZE }, () => Array(BLOCK_GRID_SIZE).fill(0)),
      pieces: [],
      selected: null,
      score: 0,
      lines: 0,
      placements: 0,
      clearEvents: 0,
      bestClear: 0,
      multiplier: 1,
      lastPieceShapeIds: [],
      runStartedAt: 0,
      pausedAt: 0,
      pausedMs: 0,
      starting: false,
      dragIndex: null,
      dragPointerId: null,
      dragOffset: { x: 0, y: 0 },
      preview: null,
      clearing: [],
      ghost: null
    };
  }

  function normalizeShape(shape) {
    return shape.map((row) => row.map(Boolean));
  }

  function blockShapeId(shape) {
    return shape.map((row) => row.map((filled) => filled ? "1" : "0").join("")).join("/");
  }

  function hasDuplicateBlockShapes(shapeIds) {
    return new Set(shapeIds).size < shapeIds.length;
  }

  function createBlockPieceFromShape(shape) {
    const colors = ["cyan", "green", "pink", "yellow", "purple"];
    const normalized = normalizeShape(shape);
    return {
      id: window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      shape: normalized,
      shapeId: blockShapeId(normalized),
      color: colors[Math.floor(Math.random() * colors.length)],
      used: false
    };
  }

  function randomBlockShape(excludedIds = []) {
    const available = blockShapes.filter((shape) => !excludedIds.includes(blockShapeId(normalizeShape(shape))));
    const pool = available.length ? available : blockShapes;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function buildBlockTray() {
    const forceUnique = hasDuplicateBlockShapes(block.lastPieceShapeIds);
    const pieces = [];
    const usedIds = [];
    while (pieces.length < 3) {
      const allowOnePair = !forceUnique && pieces.length === 2 && Math.random() < 0.28;
      const excluded = allowOnePair ? [] : usedIds;
      const piece = createBlockPieceFromShape(randomBlockShape(excluded));
      if (!forceUnique && pieces.length === 2 && usedIds.every((id) => id === piece.shapeId)) continue;
      pieces.push(piece);
      usedIds.push(piece.shapeId);
    }
    return pieces;
  }

  function refillBlockPieces() {
    const nextPieces = buildBlockTray();
    block.lastPieceShapeIds = nextPieces.map((piece) => piece.shapeId);
    block.pieces = nextPieces;
    block.selected = null;
  }

  function openBlockGrid() {
    currentGame = "block";
    prepareGameTheme();
    showScreen("block");
    resetBlock();
  }

  function resetBlock(fillTray = false) {
    const lastPieceShapeIds = block.lastPieceShapeIds || [];
    block = createBlockState();
    block.lastPieceShapeIds = lastPieceShapeIds;
    if (fillTray) refillBlockPieces();
    renderBlock();
  }

  function startBlock() {
    resetBlock(false);
    block.running = true;
    block.starting = true;
    block.runStartedAt = Date.now();
    playBlockSfx("start");
    playGameTheme("block", { restart: true });
    renderBlock();
    setTimeout(() => {
      if (currentScreen !== "block" || !block.running || !block.starting) return;
      block.starting = false;
      refillBlockPieces();
      renderBlock();
    }, 1600);
  }

  function restartBlock() {
    cleanupBlockDrag();
    startBlock();
  }

  function handlePrimaryBlockAction() {
    if (block.running) {
      endBlockRun("manual");
      return;
    }
    startBlock();
  }

  function toggleBlockPause() {
    if (!block.running || block.starting) return;
    block.paused = !block.paused;
    if (block.paused) {
      block.pausedAt = Date.now();
      cleanupBlockDrag();
    } else if (block.pausedAt) {
      block.pausedMs += Date.now() - block.pausedAt;
      block.pausedAt = 0;
    }
    renderBlock();
    renderBlockStats();
  }

  function blockCanInteract() {
    return block.running && !block.paused && !block.starting && !block.clearing.length;
  }

  function blockIntroColor(row, col) {
    const colors = ["cyan", "green", "pink", "yellow", "purple"];
    return colors[(row * 3 + col * 2) % colors.length];
  }

  function blockIntroDelay(row) {
    return `${(BLOCK_GRID_SIZE - 1 - row) * 85}ms`;
  }

  function stopBlock(render = true) {
    if (block.paused && block.pausedAt) {
      block.pausedMs += Date.now() - block.pausedAt;
      block.pausedAt = 0;
    }
    block.running = false;
    block.paused = false;
    block.selected = null;
    cleanupBlockDrag();
    if (render) renderBlock();
  }

  function blockCells(piece) {
    const cells = [];
    piece.shape.forEach((row, y) => {
      row.forEach((filled, x) => {
        if (filled) cells.push({ x, y });
      });
    });
    return cells;
  }

  function canPlaceBlock(piece, row, col) {
    if (!piece || piece.used) return false;
    return blockCells(piece).every(({ x, y }) => {
      const r = row + y;
      const c = col + x;
      return r >= 0 && c >= 0 && r < BLOCK_GRID_SIZE && c < BLOCK_GRID_SIZE && !block.board[r][c];
    });
  }

  function anyBlockFits() {
    return block.pieces.some((piece) => !piece.used && block.board.some((_, row) => block.board[row].some((__, col) => canPlaceBlock(piece, row, col))));
  }

  function findFullBlockLines() {
    const fullRows = [];
    const fullCols = [];
    for (let r = 0; r < BLOCK_GRID_SIZE; r += 1) {
      if (block.board[r].every(Boolean)) fullRows.push(r);
    }
    for (let c = 0; c < BLOCK_GRID_SIZE; c += 1) {
      if (block.board.every((row) => row[c])) fullCols.push(c);
    }
    return { fullRows, fullCols };
  }

  function lineClearCells(fullRows, fullCols) {
    const cells = new Map();
    fullRows.forEach((r) => {
      for (let c = 0; c < BLOCK_GRID_SIZE; c += 1) {
        if (block.board[r][c]) cells.set(`${r}:${c}`, { row: r, col: c, color: block.board[r][c] });
      }
    });
    fullCols.forEach((c) => {
      for (let r = 0; r < BLOCK_GRID_SIZE; r += 1) {
        if (block.board[r][c]) cells.set(`${r}:${c}`, { row: r, col: c, color: block.board[r][c] });
      }
    });
    return Array.from(cells.values());
  }

  function clearBlockLines() {
    const { fullRows, fullCols } = findFullBlockLines();
    const cleared = fullRows.length + fullCols.length;
    if (cleared) {
      block.lines += cleared;
      block.clearEvents += 1;
      block.bestClear = Math.max(block.bestClear, cleared);
      block.multiplier += 0.14 * cleared + Math.max(0, cleared - 1) * 0.18;
      block.score += cleared * 80 + Math.max(0, cleared - 1) * 70;
      block.clearing = lineClearCells(fullRows, fullCols);
      playTone("win");
    }
    return { cleared, fullRows, fullCols };
  }

  function finishBlockLineClear(fullRows, fullCols) {
    fullRows.forEach((r) => {
      for (let c = 0; c < BLOCK_GRID_SIZE; c += 1) block.board[r][c] = 0;
    });
    fullCols.forEach((c) => {
      for (let r = 0; r < BLOCK_GRID_SIZE; r += 1) block.board[r][c] = 0;
    });
    block.clearing = [];
    if (block.pieces.every((pieceItem) => pieceItem.used)) refillBlockPieces();
    renderBlock();
    if (!anyBlockFits()) endBlockRun("crash");
  }

  function placeBlock(row, col) {
    if (!blockCanInteract()) {
      showToast("Start Game", "Press Start Game before placing blocks.");
      return;
    }
    const piece = block.pieces[block.selected];
    if (!canPlaceBlock(piece, row, col)) {
      playTone("fail");
      return;
    }
    const cells = blockCells(piece);
    cells.forEach(({ x, y }) => {
      block.board[row + y][col + x] = piece.color;
    });
    playBlockSfx("place");
    piece.used = true;
    block.score += cells.length * 12;
    block.placements += 1;
    const clearResult = clearBlockLines();
    block.selected = null;
    renderBlock();
    if (clearResult.cleared) {
      setTimeout(() => finishBlockLineClear(clearResult.fullRows, clearResult.fullCols), 460);
      return;
    }
    if (block.pieces.every((pieceItem) => pieceItem.used)) refillBlockPieces();
    renderBlock();
    if (!anyBlockFits()) endBlockRun("crash");
  }

  function blockElapsedSeconds() {
    if (!block.runStartedAt) return 0;
    const activePause = block.paused && block.pausedAt ? Date.now() - block.pausedAt : 0;
    return Math.max(0, Math.floor((Date.now() - block.runStartedAt - block.pausedMs - activePause) / 1000));
  }

  function calculateBlockXp() {
    if (block.score <= 0) return 0;
    const placementXp = Math.min(30, block.placements * 2);
    const clearXp = block.lines * 26 + block.clearEvents * 12 + block.bestClear * 18;
    const survivalBonus = Math.floor(blockElapsedSeconds() / 30);
    const newBestBonus = block.score > state.stats.blockBest && block.score >= 250 ? 45 : 0;
    return Math.round(placementXp + (clearXp + survivalBonus + newBestBonus) * block.multiplier);
  }

  function previewBlockCoins(newBest = block.score > state.stats.blockBest) {
    if (block.score <= 0) return 0;
    let earned = Math.max(2, Math.floor(block.score / 28) + block.lines * 5 + Math.floor(blockElapsedSeconds() / 20));
    if (newBest) earned += 30;
    return applyRewardBooster(earned);
  }

  function renderBlockStats() {
    if (!el.blockScore) return;
    el.blockScore.textContent = formatNumber(block.score);
    el.blockBest.textContent = formatNumber(Math.max(Number(state.stats.blockBest) || 0, block.score));
    el.blockLines.textContent = formatNumber(block.lines);
    el.blockXpPreview.textContent = formatNumber(applyRewardBooster(calculateBlockXp()));
    el.blockCoinPreview.textContent = formatNumber(previewBlockCoins());
    el.startBlockBtn.textContent = block.running ? "End Game" : "Start Game";
    el.blockPauseBtn.textContent = block.paused ? "Resume" : "Pause";
    el.blockPauseBtn.disabled = !block.running || block.starting;
  }

  function getBlockPreviewCells() {
    const cells = new Map();
    if (!block.preview || block.selected === null) return cells;
    const piece = block.pieces[block.selected];
    if (!piece) return cells;
    const type = block.preview.valid ? `valid ${piece.color}` : "invalid";
    blockCells(piece).forEach(({ x, y }) => {
      const r = block.preview.row + y;
      const c = block.preview.col + x;
      if (r >= 0 && c >= 0 && r < BLOCK_GRID_SIZE && c < BLOCK_GRID_SIZE) cells.set(`${r}:${c}`, type);
    });
    return cells;
  }

  function getClearingBlockCells() {
    const cells = new Map();
    block.clearing.forEach((cell, index) => {
      cells.set(`${cell.row}:${cell.col}`, { ...cell, index });
    });
    return cells;
  }

  function blockCellFromPoint(clientX, clientY) {
    const target = document.elementFromPoint(clientX, clientY);
    const cell = target?.closest?.(".block-cell");
    if (!cell || !el.blockBoard.contains(cell)) return null;
    return {
      row: Number(cell.dataset.row),
      col: Number(cell.dataset.col)
    };
  }

  function blockGrabOffsetFromEvent(piece, event) {
    const mini = event.target?.closest?.(".mini-block:not(.empty)");
    if (mini && event.currentTarget.contains(mini)) {
      return {
        x: Number(mini.dataset.x) || 0,
        y: Number(mini.dataset.y) || 0
      };
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const cols = piece.shape[0].length;
    const rows = piece.shape.length;
    return {
      x: Math.max(0, Math.min(cols - 1, Math.floor(((event.clientX - rect.left) / rect.width) * cols))),
      y: Math.max(0, Math.min(rows - 1, Math.floor(((event.clientY - rect.top) / rect.height) * rows)))
    };
  }

  function createBlockGhost(piece) {
    const ghost = document.createElement("div");
    ghost.className = `block-drag-ghost ${piece.color}`;
    ghost.style.setProperty("--piece-cols", piece.shape[0].length);
    ghost.style.setProperty("--piece-rows", piece.shape.length);
    piece.shape.forEach((row, y) => row.forEach((filled, x) => {
      const dot = document.createElement("span");
      dot.className = filled ? "mini-block" : "mini-block empty";
      dot.dataset.x = String(x);
      dot.dataset.y = String(y);
      ghost.appendChild(dot);
    }));
    document.body.appendChild(ghost);
    return ghost;
  }

  function moveBlockGhost(event) {
    if (!block.ghost) return;
    const piece = block.pieces[block.selected];
    const rect = block.ghost.getBoundingClientRect();
    const cols = piece?.shape?.[0]?.length || 1;
    const rows = piece?.shape?.length || 1;
    const cellW = rect.width / cols;
    const cellH = rect.height / rows;
    const x = event.clientX - ((block.dragOffset?.x || 0) + 0.5) * cellW;
    const y = event.clientY - ((block.dragOffset?.y || 0) + 0.5) * cellH;
    block.ghost.style.left = `${x}px`;
    block.ghost.style.top = `${y}px`;
  }

  function updateBlockPreview(event) {
    const cell = blockCellFromPoint(event.clientX, event.clientY);
    const piece = block.pieces[block.selected];
    const row = cell ? cell.row - (block.dragOffset?.y || 0) : null;
    const col = cell ? cell.col - (block.dragOffset?.x || 0) : null;
    block.preview = cell && piece
      ? { row, col, valid: canPlaceBlock(piece, row, col) }
      : null;
    renderBlockBoard();
  }

  function startBlockDrag(index, event) {
    if (!blockCanInteract()) {
      showToast("Start Game", "Press Start Game before choosing pieces.");
      return;
    }
    const piece = block.pieces[index];
    if (!piece || piece.used) return;
    event.preventDefault();
    block.selected = index;
    block.dragIndex = index;
    block.dragPointerId = event.pointerId;
    block.dragOffset = blockGrabOffsetFromEvent(piece, event);
    block.preview = null;
    block.ghost?.remove();
    block.ghost = createBlockGhost(piece);
    playBlockSfx("grab");
    event.currentTarget.setPointerCapture?.(event.pointerId);
    moveBlockGhost(event);
    updateBlockPreview(event);
    renderBlockTray();
  }

  function moveBlockDrag(event) {
    if (block.dragPointerId !== event.pointerId) return;
    event.preventDefault();
    moveBlockGhost(event);
    updateBlockPreview(event);
  }

  function endBlockDrag(event) {
    if (block.dragPointerId !== event.pointerId) return;
    event.preventDefault();
    const preview = block.preview;
    const canDrop = Boolean(preview?.valid);
    cleanupBlockDrag(false);
    if (canDrop) {
      placeBlock(preview.row, preview.col);
    } else {
      block.preview = null;
      renderBlock();
      playTone("fail");
    }
  }

  function cleanupBlockDrag(render = false) {
    block.ghost?.remove();
    block.ghost = null;
    block.dragIndex = null;
    block.dragPointerId = null;
    block.dragOffset = { x: 0, y: 0 };
    block.preview = null;
    if (render) renderBlock();
  }

  function renderBlockBoard() {
    if (!el.blockBoard) return;
    el.blockBoard.innerHTML = "";
    const previewCells = getBlockPreviewCells();
    const clearingCells = getClearingBlockCells();
    for (let r = 0; r < BLOCK_GRID_SIZE; r += 1) {
      for (let c = 0; c < BLOCK_GRID_SIZE; c += 1) {
        const cell = document.createElement("button");
        const preview = previewCells.get(`${r}:${c}`);
        const clearing = clearingCells.get(`${r}:${c}`);
        cell.type = "button";
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);
        cell.style.setProperty("--intro-delay", blockIntroDelay(r));
        cell.style.setProperty("--clear-delay", `${(clearing?.index || 0) * 18}ms`);
        cell.className = `block-cell ${block.starting ? `intro ${blockIntroColor(r, c)}` : ""} ${block.board[r][c] ? `filled ${block.board[r][c]}` : ""} ${clearing ? `clearing ${clearing.color}` : ""} ${preview ? `preview ${preview}` : ""}`;
        cell.setAttribute("aria-label", `Row ${r + 1}, column ${c + 1}`);
        cell.addEventListener("click", () => placeBlock(r, c));
        el.blockBoard.appendChild(cell);
      }
    }
  }

  function renderBlockTray() {
    if (!el.blockTray) return;
    el.blockTray.innerHTML = "";
    if (!block.running && !block.pieces.length) {
      return;
    }
    block.pieces.forEach((piece, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `block-piece ${piece.color} ${piece.used ? "used" : ""} ${block.selected === index ? "selected" : ""}`;
      button.disabled = piece.used;
      button.style.setProperty("--piece-cols", piece.shape[0].length);
      button.style.setProperty("--piece-rows", piece.shape.length);
      button.addEventListener("pointerdown", (event) => startBlockDrag(index, event));
      button.addEventListener("pointermove", moveBlockDrag);
      button.addEventListener("pointerup", endBlockDrag);
      button.addEventListener("pointercancel", () => cleanupBlockDrag(true));
      button.addEventListener("click", () => {
        if (piece.used) return;
        if (!blockCanInteract()) {
          showToast("Start Game", "Press Start Game before choosing pieces.");
          return;
        }
        playBlockSfx("grab");
        block.selected = index;
        renderBlockTray();
      });
      piece.shape.forEach((row, y) => row.forEach((filled, x) => {
        const dot = document.createElement("span");
        dot.className = filled ? "mini-block" : "mini-block empty";
        dot.dataset.x = String(x);
        dot.dataset.y = String(y);
        button.appendChild(dot);
      }));
      el.blockTray.appendChild(button);
    });
  }

  function renderBlock() {
    renderBlockBoard();
    renderBlockTray();
    renderBlockStats();
  }

  function endBlockRun(reason = "manual") {
    if (!block.running && reason !== "crash") return;
    stopBlock(false);
    if (reason === "manual") {
      playTone("tap");
    } else {
      playGameOverSound();
    }
    stopGameTheme(reason === "crash" ? "death" : "stop");

    const previousBest = state.stats.blockBest;
    const newBest = block.score > previousBest;
    const oldAchievements = new Set(state.achievements);
    const boosterUsed = getEquippedBoosterItem();
    const earned = applyRewardBooster(calculateBlockXp());
    const coinsEarned = previewBlockCoins(newBest);

    state.stats.gamesPlayed += 1;
    state.stats.blockRuns += 1;
    state.stats.blockTotalScore += block.score;
    state.stats.blockBest = Math.max(previousBest, block.score);
    state.stats.blockLines += block.lines;

    if (boosterUsed) {
      state.boosterCooldowns[boosterUsed.boost] = Date.now() + 10 * 60 * 1000;
      state.equippedBooster = null;
      state.boosterUses += 1;
      if (!state.boosterLevelTarget || state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
      showToast("Booster Used", `${boosterUsed.title} applied. Cooldown started.`, "win");
    }

    state.xp += earned;
    state.stats.blockXpEarned += earned;
    state.coins += coinsEarned;
    state.level = deriveLevel(state.xp);
    unlockEarnedAchievements();
    if (boosterUsed && state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
    saveState();
    renderAll();

    const newAchievements = achievements.filter((item) => !oldAchievements.has(item.id) && state.achievements.includes(item.id));
    currentGame = "block";
    if (newBest) showToast("New High Score", `Block Grid best is now ${formatNumber(block.score)}.`, "win");
    showToast("XP Earned", `+${formatNumber(earned)} XP.`, "win");
    showToast("Coins Earned", `+${formatNumber(coinsEarned)} coins.`, "win");
    el.resultScore.textContent = formatNumber(block.score);
    el.resultXp.textContent = formatNumber(earned);
    el.resultCoins.textContent = formatNumber(coinsEarned);
    el.resultBest.textContent = formatNumber(state.stats.blockBest);
    el.newBestBadge.classList.toggle("hidden", !newBest);
    el.resultAchievements.innerHTML = newAchievements.map((item) => `<span>${item.title}</span>`).join("");
    el.resultMessage.textContent = newBest
      ? "New Block Grid best. Keep the board open."
      : reason === "manual"
        ? "Run ended. Your score has been saved."
        : "No current pieces fit. Clear smarter next run.";
    el.gameOverModal.classList.remove("hidden");
  }

  function createStarState() {
    return {
      running: false,
      paused: false,
      player: { x: 360, y: 590, r: 16 },
      health: 3,
      maxHealth: 3,
      invulnerableUntil: 0,
      input: { x: 0, y: 0 },
      bullets: [],
      enemyBullets: [],
      enemies: [],
      meteors: [],
      powerups: [],
      stars: [],
      particles: [],
      score: 0,
      kills: 0,
      bossKills: 0,
      shots: 0,
      meteorsDestroyed: 0,
      survivedMs: 0,
      multiplier: 1,
      lastFrame: 0,
      lastShotAt: 0,
      enemySpawnAt: 0,
      meteorSpawnAt: 0,
      bossSpawnAt: 0,
      powerupSpawnAt: 0,
      runStartedAt: 0,
      pausedAt: 0,
      pausedMs: 0,
      damageBoostUntil: 0,
      wingmenUntil: 0,
      rocketHelperUntil: 0,
      rocketLastShotAt: 0,
      joystickPointerId: null,
      shootHeld: false
    };
  }

  function openStarInvaders() {
    currentGame = "star";
    prepareGameTheme();
    showScreen("star");
    resetStar();
  }

  function resetStar() {
    stopStar(false);
    star = createStarState();
    seedStarfield();
    renderStarStats();
    drawStar();
  }

  function seedStarfield() {
    star.stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * 720,
      y: Math.random() * 720,
      size: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 75 + 35
    }));
  }

  function startStar() {
    resetStar();
    star.running = true;
    star.runStartedAt = Date.now();
    star.lastFrame = performance.now();
    star.powerupSpawnAt = star.lastFrame + 5200;
    playTone("tap");
    playStarTheme("normal", { restart: true });
    starTimer = setInterval(tickStar, STAR_TICK_MS);
    renderStarStats();
  }

  function restartStar() {
    startStar();
  }

  function stopStar(render = true) {
    if (starTimer) {
      clearInterval(starTimer);
      starTimer = null;
    }
    if (star.paused && star.pausedAt) {
      star.pausedMs += Date.now() - star.pausedAt;
      star.pausedAt = 0;
    }
    star.running = false;
    star.paused = false;
    star.shootHeld = false;
    resetJoystickVisual();
    if (render) {
      renderStarStats();
      drawStar();
    }
  }

  function handlePrimaryStarAction() {
    if (star.running) {
      endStarRun("manual");
      return;
    }
    startStar();
  }

  function toggleStarPause() {
    if (!star.running) return;
    star.paused = !star.paused;
    if (star.paused) {
      star.pausedAt = Date.now();
      star.input = { x: 0, y: 0 };
      star.shootHeld = false;
      resetJoystickVisual();
    } else {
      if (star.pausedAt) {
        star.pausedMs += Date.now() - star.pausedAt;
        star.pausedAt = 0;
      }
      star.lastFrame = performance.now();
    }
    renderStarStats();
    drawStar();
  }

  function starElapsedSeconds() {
    if (!star.runStartedAt) return 0;
    const activePause = star.paused && star.pausedAt ? Date.now() - star.pausedAt : 0;
    return Math.max(0, Math.floor((Date.now() - star.runStartedAt - star.pausedMs - activePause) / 1000));
  }

  function starDifficulty() {
    return 1 + Math.min(4, starElapsedSeconds() / 45);
  }

  function spawnStarEnemy(type = "enemy") {
    const difficulty = starDifficulty();
    const isBoss = type === "boss";
    const hp = isBoss ? Math.round(8 + difficulty * 3 + star.bossKills * 2) : Math.round(2 + difficulty);
    star.enemies.push({
      type,
      x: 45 + Math.random() * 630,
      y: -40,
      r: isBoss ? 28 : 17,
      hp,
      maxHp: hp,
      speed: isBoss ? 46 + difficulty * 6 : 82 + difficulty * 14,
      drift: (Math.random() - 0.5) * (isBoss ? 30 : 60),
      healthUntil: 0,
      nextShotAt: performance.now() + 2000 + Math.random() * 2000
    });
    if (isBoss) playStarTheme("boss", { restart: true });
  }

  function spawnMeteor() {
    const difficulty = starDifficulty();
    const radius = 14 + Math.random() * 16;
    const hp = Math.max(2, Math.round(radius / 10 + difficulty * 0.7));
    star.meteors.push({
      x: 24 + Math.random() * 672,
      y: -36,
      r: radius,
      hp,
      maxHp: hp,
      healthUntil: 0,
      speed: 120 + difficulty * 20 + Math.random() * 70,
      spin: Math.random() * Math.PI
    });
  }

  function playStarBlasterTone() {
    if (state.muteSfx) return;
    playToneAt(1320, 0.032, "square", 0.035);
    window.setTimeout(() => playToneAt(860, 0.028, "square", 0.026), 24);
  }

  function getStarDamage() {
    return performance.now() < star.damageBoostUntil ? 1.5 : 1;
  }

  function fireStarBullet(x, y, options = {}) {
    star.bullets.push({
      x,
      y,
      vx: options.vx || 0,
      vy: options.vy || -520,
      r: options.r || 4,
      damage: options.damage || getStarDamage(),
      color: options.color || "#49f4ff"
    });
  }

  function shootStar() {
    if (!star.running || star.paused) return;
    const now = performance.now();
    if (now - star.lastShotAt < 190) return;
    star.lastShotAt = now;
    star.shots += 1;
    playStarBlasterTone();
    fireStarBullet(star.player.x, star.player.y - 18);
    if (now < star.wingmenUntil) {
      fireStarBullet(star.player.x - 26, star.player.y - 4, { vx: -28, vy: -540, r: 3.5, damage: getStarDamage(), color: "#57ff9a" });
      fireStarBullet(star.player.x + 26, star.player.y - 4, { vx: 28, vy: -540, r: 3.5, damage: getStarDamage(), color: "#57ff9a" });
    }
  }

  function pickStarPowerupType() {
    const roll = Math.random();
    if (roll < 0.42) return "health";
    if (roll < 0.7) return "damage";
    if (roll < 0.92) return "wingmen";
    return "rocket";
  }

  function spawnStarPowerup() {
    if (star.powerups.length >= 2) return;
    const type = pickStarPowerupType();
    const difficulty = starDifficulty();
    star.powerups.push({
      type,
      x: 48 + Math.random() * 624,
      y: -28,
      r: type === "rocket" ? 21 : 18,
      vy: 78 + difficulty * 14 + Math.random() * 22,
      spin: Math.random() * Math.PI
    });
  }

  function applyStarPowerup(type) {
    const now = performance.now();
    const labels = {
      health: "Shield Restored",
      damage: "Satellite Boost",
      wingmen: "Wingmen Online",
      rocket: "Rocket Support"
    };
    if (type === "health") {
      star.health = Math.min(star.maxHealth, star.health + 1);
    } else if (type === "damage") {
      star.damageBoostUntil = Math.max(star.damageBoostUntil, now) + 10000;
    } else if (type === "wingmen") {
      star.wingmenUntil = Math.max(star.wingmenUntil, now) + 8000;
    } else if (type === "rocket") {
      star.rocketHelperUntil = Math.max(star.rocketHelperUntil, now) + 8000;
      star.rocketLastShotAt = 0;
    }
    playTone("win");
    showToast(labels[type] || "Power Up", type === "health" ? `${star.health}/${star.maxHealth} health.` : "Powerup active.", "win");
  }

  function getRocketTarget() {
    const bosses = star.enemies.filter((enemy) => enemy.type === "boss" && !enemy.dead);
    if (bosses.length) return bosses.sort((a, b) => a.y - b.y)[0];
    const enemies = star.enemies.filter((enemy) => !enemy.dead);
    if (enemies.length) return enemies.sort((a, b) => b.y - a.y)[0];
    const meteors = star.meteors.filter((meteor) => !meteor.dead);
    return meteors.sort((a, b) => b.y - a.y)[0] || null;
  }

  function tickRocketHelper(now) {
    if (now >= star.rocketHelperUntil || now - star.rocketLastShotAt < 520) return;
    const target = getRocketTarget();
    if (!target) return;
    star.rocketLastShotAt = now;
    const origin = { x: Math.min(690, star.player.x + 44), y: star.player.y + 4 };
    const dx = target.x - origin.x;
    const dy = target.y - origin.y;
    const mag = Math.max(1, Math.hypot(dx, dy));
    const speed = 620;
    fireStarBullet(origin.x, origin.y, {
      vx: (dx / mag) * speed,
      vy: (dy / mag) * speed,
      r: 7,
      damage: getStarDamage() * 3.5,
      color: "#ffd35a"
    });
    playToneAt(540, 0.04, "sawtooth", 0.026);
  }

  function damageStarPlayer(amount = 1, x = star.player.x, y = star.player.y) {
    const now = performance.now();
    if (now < star.invulnerableUntil) return false;
    star.health = Math.max(0, star.health - amount);
    star.invulnerableUntil = now + 900;
    addStarExplosion(x, y, "#ff5275", 18);
    playToneAt(180, 0.08, "sawtooth", 0.06);
    if (star.health <= 0) {
      endStarRun("crash");
      return true;
    }
    renderStarStats();
    return false;
  }

  function enemyShoot(enemy, now) {
    star.enemyBullets.push({
      x: enemy.x,
      y: enemy.y + enemy.r,
      vy: enemy.type === "boss" ? 235 : 205,
      r: enemy.type === "boss" ? 5 : 4
    });
    enemy.nextShotAt = now + 2000 + Math.random() * 2000;
  }

  function markDamaged(target) {
    target.healthUntil = performance.now() + 1600;
  }

  function destroyStarEnemy(enemy) {
    enemy.dead = true;
    const boss = enemy.type === "boss";
    star.kills += 1;
    if (boss) {
      star.bossKills += 1;
      star.multiplier += 0.55 + star.bossKills * 0.08;
    }
    star.score += Math.round((boss ? 420 : 75) * star.multiplier);
    addStarExplosion(enemy.x, enemy.y, boss ? "#ffd35a" : "#ff2fad", boss ? 24 : 12);
    playTone(boss ? "level" : "win");
    if (boss && !star.enemies.some((item) => item !== enemy && item.type === "boss" && !item.dead)) {
      playStarTheme("normal", { restart: true });
    }
  }

  function destroyMeteor(meteor) {
    meteor.dead = true;
    star.meteorsDestroyed += 1;
    star.score += Math.round((28 + meteor.r) * star.multiplier);
    addStarExplosion(meteor.x, meteor.y, "#ffd35a", 10);
    playTone("win");
  }

  function addStarExplosion(x, y, color = "#49f4ff", count = 10) {
    for (let i = 0; i < count; i += 1) {
      star.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 180,
        vy: (Math.random() - 0.5) * 180,
        life: 24,
        color
      });
    }
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function tickStar() {
    if (!star.running || star.paused) return;
    const now = performance.now();
    const dt = Math.min(0.04, (now - star.lastFrame) / 1000 || 0.016);
    star.lastFrame = now;
    star.survivedMs += dt * 1000;
    const difficulty = starDifficulty();

    star.player.x = Math.max(20, Math.min(700, star.player.x + star.input.x * 260 * dt));
    star.player.y = Math.max(80, Math.min(690, star.player.y + star.input.y * 260 * dt));
    if (star.shootHeld) shootStar();

    star.stars.forEach((s) => {
      s.y += s.speed * difficulty * dt;
      if (s.y > 730) {
        s.y = -10;
        s.x = Math.random() * 720;
      }
    });

    if (now > star.enemySpawnAt) {
      spawnStarEnemy();
      star.enemySpawnAt = now + Math.max(520, 1400 - difficulty * 160);
    }
    if (now > star.meteorSpawnAt) {
      spawnMeteor();
      star.meteorSpawnAt = now + Math.max(430, 1050 - difficulty * 120);
    }
    if (starElapsedSeconds() > 22 && now > star.bossSpawnAt) {
      spawnStarEnemy("boss");
      star.bossSpawnAt = now + Math.max(9000, 19000 - difficulty * 1200);
    }
    if (now > star.powerupSpawnAt) {
      spawnStarPowerup();
      star.powerupSpawnAt = now + 6200 + Math.random() * 7200;
    }
    tickRocketHelper(now);

    star.bullets.forEach((b) => {
      b.x += (b.vx || 0) * dt;
      b.y += b.vy * dt;
    });
    star.enemyBullets.forEach((b) => b.y += b.vy * dt);
    star.enemies.forEach((e) => {
      e.y += e.speed * dt;
      e.x += Math.sin((now + e.y) / 430) * e.drift * dt;
      if (e.y > 20 && now > e.nextShotAt) enemyShoot(e, now);
    });
    star.meteors.forEach((m) => {
      m.y += m.speed * dt;
      m.spin += dt * 3;
    });
    star.powerups.forEach((p) => {
      p.y += p.vy * dt;
      p.spin += dt * 2.6;
    });
    star.particles.forEach((p) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= 1;
    });

    star.bullets = star.bullets.filter((b) => b.y > -30 && b.y < 760 && b.x > -30 && b.x < 750);
    star.enemyBullets = star.enemyBullets.filter((b) => b.y < 760);
    star.powerups = star.powerups.filter((p) => !p.dead && p.y < 780);
    star.particles = star.particles.filter((p) => p.life > 0);

    for (const bullet of star.bullets) {
      for (const enemy of star.enemies) {
        if (distance(bullet, enemy) < bullet.r + enemy.r) {
          bullet.y = -999;
          enemy.hp -= bullet.damage || 1;
          markDamaged(enemy);
          addStarExplosion(bullet.x, bullet.y, enemy.type === "boss" ? "#ffd35a" : "#49f4ff", 4);
          if (enemy.hp <= 0) destroyStarEnemy(enemy);
        }
      }
      for (const meteor of star.meteors) {
        if (distance(bullet, meteor) < bullet.r + meteor.r) {
          bullet.y = -999;
          meteor.hp -= bullet.damage || 1;
          markDamaged(meteor);
          addStarExplosion(bullet.x, bullet.y, "#ffd35a", 4);
          if (meteor.hp <= 0) destroyMeteor(meteor);
        }
      }
    }

    star.bullets = star.bullets.filter((b) => b.y > -100);
    star.enemyBullets = star.enemyBullets.filter((b) => b.y < 820);
    star.enemies = star.enemies.filter((e) => !e.dead && e.y < 780);
    star.meteors = star.meteors.filter((m) => !m.dead && m.y < 780);
    if (activeTheme === "game-starBoss" && !star.enemies.some((e) => e.type === "boss")) {
      playStarTheme("normal", { restart: true });
    }

    for (const p of star.powerups) {
      if (distance(star.player, p) < star.player.r + p.r) {
        p.dead = true;
        addStarExplosion(p.x, p.y, "#57ff9a", 18);
        applyStarPowerup(p.type);
      }
    }
    star.powerups = star.powerups.filter((p) => !p.dead && p.y < 780);

    const enemyHit = star.enemies.find((e) => distance(star.player, e) < star.player.r + e.r * 0.82);
    const meteorHit = star.meteors.find((m) => distance(star.player, m) < star.player.r + m.r * 0.78);
    const bulletHit = star.enemyBullets.find((b) => distance(star.player, b) < star.player.r + b.r);
    if (enemyHit || meteorHit || bulletHit) {
      if (enemyHit) enemyHit.dead = true;
      if (meteorHit) meteorHit.dead = true;
      if (bulletHit) bulletHit.y = 999;
      if (damageStarPlayer(1, (enemyHit || meteorHit || bulletHit).x, (enemyHit || meteorHit || bulletHit).y)) return;
    }

    star.score += dt * 3;
    renderStarStats();
    drawStar();
  }

  function calculateStarXp() {
    if (star.score <= 0) return 0;
    const survival = Math.floor(starElapsedSeconds() * 0.6);
    const killXp = star.kills * 18;
    const bossXp = star.bossKills * 95;
    const newBestBonus = star.bossKills > state.stats.starBest ? 75 : 0;
    const meteorXp = star.meteorsDestroyed * 7;
    return Math.round((survival + killXp + bossXp + meteorXp + newBestBonus) * star.multiplier);
  }

  function previewStarCoins(newBest = star.bossKills > state.stats.starBest) {
    if (star.score <= 0) return 0;
    let earned = Math.floor(star.kills * 3 + star.bossKills * 18 + star.meteorsDestroyed * 2 + starElapsedSeconds() / 12);
    if (newBest) earned += 25;
    return applyRewardBooster(Math.max(1, earned));
  }

  function renderStarStats() {
    if (!el.starScore) return;
    el.starScore.textContent = formatNumber(Math.floor(star.score));
    el.starBest.textContent = formatNumber(Math.max(Number(state.stats.starBest) || 0, star.bossKills));
    el.starKills.textContent = formatNumber(star.kills);
    if (el.starHealth) el.starHealth.textContent = `${star.health}/${star.maxHealth}`;
    el.starXpPreview.textContent = formatNumber(applyRewardBooster(calculateStarXp()));
    el.starCoinPreview.textContent = formatNumber(previewStarCoins());
    el.startStarBtn.textContent = star.running ? "End Game" : "Start Game";
    el.starPauseBtn.textContent = star.paused ? "Resume" : "Pause";
    el.starPauseBtn.disabled = !star.running;
  }

  function drawStarHealthBar(ctx, entity, yOffset) {
    if (!entity.healthUntil || performance.now() > entity.healthUntil) return;
    const width = Math.max(42, entity.r * 2.4);
    const pct = Math.max(0, Math.min(1, entity.hp / entity.maxHp));
    const x = entity.x - width / 2;
    const y = entity.y + yOffset;
    ctx.save();
    ctx.fillStyle = "rgba(5, 3, 11, 0.78)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.24)";
    ctx.lineWidth = 1;
    ctx.fillRect(x, y, width, 12);
    ctx.strokeRect(x, y, width, 12);
    ctx.fillStyle = pct > 0.5 ? "#57ff9a" : pct > 0.25 ? "#ffd35a" : "#ff5275";
    ctx.fillRect(x + 2, y + 2, Math.max(4, (width - 4) * pct), 8);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 8px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${Math.round(pct * 100)}%`, entity.x, y + 6);
    ctx.restore();
  }

  function drawPixelAlien(ctx, enemy) {
    const boss = enemy.type === "boss";
    const sprite = [
      "00111100",
      "01111110",
      "11011011",
      "11111111",
      "10111101",
      "10100101",
      "01000010",
      "10000001"
    ];
    const scale = boss ? 7 : 4.8;
    const width = sprite[0].length * scale;
    const height = sprite.length * scale;
    const x0 = -width / 2;
    const y0 = -height / 2;
    const body = boss ? "#ffd35a" : "#57ff9a";
    const shade = boss ? "#ff2fad" : "#49f4ff";

    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.shadowBlur = boss ? 24 : 16;
    ctx.shadowColor = boss ? "#ffd35a" : "#57ff9a";
    sprite.forEach((row, y) => {
      [...row].forEach((pixel, x) => {
        if (pixel !== "1") return;
        ctx.fillStyle = (x + y) % 5 === 0 ? shade : body;
        ctx.fillRect(x0 + x * scale, y0 + y * scale, scale - 0.5, scale - 0.5);
      });
    });
    ctx.shadowBlur = 0;
    ctx.fillStyle = boss ? "#10051d" : "#05030b";
    ctx.fillRect(x0 + scale * 2, y0 + scale * 2, scale, scale);
    ctx.fillRect(x0 + scale * 5, y0 + scale * 2, scale, scale);
    ctx.restore();
  }

  function drawStarShip(ctx, x, y, scale = 1, glow = "#49f4ff") {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.shadowBlur = 24;
    ctx.shadowColor = glow;
    const ship = ctx.createLinearGradient(-18, -22, 18, 24);
    ship.addColorStop(0, glow);
    ship.addColorStop(0.55, "#ffffff");
    ship.addColorStop(1, "#ff2fad");
    ctx.fillStyle = ship;
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.lineTo(20, 20);
    ctx.lineTo(0, 10);
    ctx.lineTo(-20, 20);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffd35a";
    ctx.fillRect(-5, 16, 10, 12);
    ctx.restore();
  }

  function drawStarPowerup(ctx, powerup) {
    const config = {
      health: { symbol: "+", color: "#57ff9a", label: "HP" },
      damage: { symbol: "*", color: "#ffd35a", label: "1.5" },
      wingmen: { symbol: "A", color: "#49f4ff", label: "2X" },
      rocket: { symbol: "R", color: "#ff2fad", label: "3.5" }
    }[powerup.type] || { symbol: "?", color: "#ffffff", label: "" };
    ctx.save();
    ctx.translate(powerup.x, powerup.y);
    ctx.rotate(powerup.spin);
    ctx.shadowBlur = 20;
    ctx.shadowColor = config.color;
    ctx.fillStyle = "rgba(5, 3, 11, 0.76)";
    ctx.strokeStyle = config.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, powerup.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.rotate(-powerup.spin);
    ctx.fillStyle = config.color;
    ctx.font = "900 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(config.symbol, 0, -2);
    ctx.font = "800 8px Arial";
    ctx.fillText(config.label, 0, 10);
    ctx.restore();
  }

  function drawStar() {
    if (!el.starCanvas) return;
    const ctx = el.starCanvas.getContext("2d");
    const w = el.starCanvas.width;
    const h = el.starCanvas.height;
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#05030b");
    bg.addColorStop(0.55, "#0b0820");
    bg.addColorStop(1, "#140725");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    star.stars.forEach((s) => {
      ctx.globalAlpha = 0.45 + Math.min(0.5, s.size / 3);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(s.x, s.y, s.size, s.size * 3.2);
    });
    ctx.globalAlpha = 1;

    star.meteors.forEach((m) => {
      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate(m.spin);
      ctx.fillStyle = "#7d647d";
      ctx.strokeStyle = "rgba(255, 211, 90, 0.42)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-m.r, -m.r * 0.2);
      ctx.lineTo(-m.r * 0.25, -m.r);
      ctx.lineTo(m.r * 0.8, -m.r * 0.5);
      ctx.lineTo(m.r, m.r * 0.25);
      ctx.lineTo(m.r * 0.2, m.r);
      ctx.lineTo(-m.r * 0.8, m.r * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      drawStarHealthBar(ctx, m, m.r + 8);
    });

    star.enemies.forEach((e) => {
      drawPixelAlien(ctx, e);
      drawStarHealthBar(ctx, e, e.r + 18);
    });

    star.powerups.forEach((p) => drawStarPowerup(ctx, p));

    star.bullets.forEach((b) => {
      ctx.shadowBlur = 16;
      ctx.shadowColor = b.color || "#49f4ff";
      ctx.fillStyle = b.color || "#49f4ff";
      ctx.fillRect(b.x - Math.max(2, b.r / 2), b.y - 12, Math.max(4, b.r), 18);
    });
    star.enemyBullets.forEach((b) => {
      ctx.shadowBlur = 14;
      ctx.shadowColor = "#ff5275";
      ctx.fillStyle = "#ff5275";
      ctx.fillRect(b.x - 2, b.y - 2, 4, 16);
    });
    ctx.shadowBlur = 0;

    star.particles.forEach((p) => {
      ctx.globalAlpha = Math.max(0, p.life / 24);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 3, 3);
    });
    ctx.globalAlpha = 1;

    const now = performance.now();
    if (now < star.wingmenUntil) {
      drawStarShip(ctx, star.player.x - 30, star.player.y + 14, 0.58, "#57ff9a");
      drawStarShip(ctx, star.player.x + 30, star.player.y + 14, 0.58, "#57ff9a");
    }
    if (now < star.rocketHelperUntil) {
      drawStarShip(ctx, Math.min(684, star.player.x + 46), star.player.y + 10, 0.95, "#ffd35a");
    }
    const flash = now < star.invulnerableUntil && Math.floor(now / 90) % 2 === 0;
    if (!flash) drawStarShip(ctx, star.player.x, star.player.y, 1, "#49f4ff");

    if (!star.running) {
      ctx.fillStyle = "rgba(5, 3, 11, 0.44)";
      ctx.fillRect(0, 0, w, h);
    }
  }

  function endStarRun(reason = "manual") {
    if (!star.running && reason !== "crash") return;
    stopStar(false);
    if (reason === "manual") {
      playTone("tap");
    } else {
      playGameOverSound();
    }
    stopGameTheme(reason === "crash" ? "death" : "stop");

    const previousBest = state.stats.starBest;
    const finalScore = Math.floor(star.score);
    const newBest = star.bossKills > previousBest;
    const oldAchievements = new Set(state.achievements);
    const boosterUsed = getEquippedBoosterItem();
    const earned = applyRewardBooster(calculateStarXp());
    const coinsEarned = previewStarCoins(newBest);

    state.stats.gamesPlayed += 1;
    state.stats.starRuns += 1;
    state.stats.starTotalScore += finalScore;
    state.stats.starBest = Math.max(previousBest, star.bossKills);
    state.stats.starKills += star.kills;
    state.stats.starBossKills += star.bossKills;

    if (boosterUsed) {
      state.boosterCooldowns[boosterUsed.boost] = Date.now() + 10 * 60 * 1000;
      state.equippedBooster = null;
      state.boosterUses += 1;
      if (!state.boosterLevelTarget || state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
      showToast("Booster Used", `${boosterUsed.title} applied. Cooldown started.`, "win");
    }

    state.xp += earned;
    state.stats.starXpEarned += earned;
    state.coins += coinsEarned;
    state.level = deriveLevel(state.xp);
    unlockEarnedAchievements();
    if (boosterUsed && state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
    saveState();
    renderAll();

    const newAchievements = achievements.filter((item) => !oldAchievements.has(item.id) && state.achievements.includes(item.id));
    currentGame = "star";
    if (newBest) showToast("New High Score", `Star Invaders best is now ${formatNumber(star.bossKills)} bosses.`, "win");
    showToast("XP Earned", `+${formatNumber(earned)} XP.`, "win");
    showToast("Coins Earned", `+${formatNumber(coinsEarned)} coins.`, "win");
    el.resultScore.textContent = formatNumber(finalScore);
    el.resultXp.textContent = formatNumber(earned);
    el.resultCoins.textContent = formatNumber(coinsEarned);
    el.resultBest.textContent = `${formatNumber(state.stats.starBest)} Bosses`;
    el.newBestBadge.classList.toggle("hidden", !newBest);
    el.resultAchievements.innerHTML = newAchievements.map((item) => `<span>${item.title}</span>`).join("");
    el.resultMessage.textContent = newBest
      ? "New star lane best. Keep flying."
      : reason === "manual"
        ? "Run ended. Your flight data has been saved."
        : "Ship destroyed. Retry and push deeper.";
    el.gameOverModal.classList.remove("hidden");
  }

  function createStackState() {
    return {
      running: false,
      paused: false,
      score: 0,
      combo: 0,
      bestCombo: 0,
      perfects: 0,
      speed: 190,
      direction: 1,
      axis: "x",
      lastFrame: 0,
      startedAt: 0,
      glowUntil: 0,
      cameraLevel: 0,
      particles: [],
      tower: [createStackBlock(0, 0, 230, 230, 0, "#7dffe8", true)],
      active: null
    };
  }

  function createStackBlock(x, z, w, d, level, color, perfect = false) {
    return { x, z, w, d, level, color, perfect };
  }

  function stackColor(level) {
    const hue = (level * 18 + 195) % 360;
    return `hsl(${hue} 96% 62%)`;
  }

  function openStack() {
    currentGame = "stack";
    prepareGameTheme();
    showScreen("stack");
    resetStack();
  }

  function resetStack() {
    stopStack(false);
    stack = createStackState();
    spawnStackBlock();
    renderStackStats();
    drawStack();
  }

  function startStack() {
    resetStack();
    stack.running = true;
    stack.startedAt = Date.now();
    stack.lastFrame = performance.now();
    playTone("tap");
    playGameTheme("stack", { restart: true });
    stackTimer = setInterval(tickStack, STACK_TICK_MS);
    renderStackStats();
  }

  function restartStack() {
    startStack();
  }

  function stopStack(render = true) {
    if (stackTimer) {
      clearInterval(stackTimer);
      stackTimer = null;
    }
    stack.running = false;
    stack.paused = false;
    if (render) {
      renderStackStats();
      drawStack();
    }
  }

  function toggleStackPause() {
    if (!stack.running) return;
    stack.paused = !stack.paused;
    stack.lastFrame = performance.now();
    renderStackStats();
    drawStack();
  }

  function handlePrimaryStackAction() {
    if (stack.running) {
      endStackRun("manual");
      return;
    }
    startStack();
  }

  function stackElapsedSeconds() {
    return stack.startedAt ? Math.floor((Date.now() - stack.startedAt) / 1000) : 0;
  }

  function spawnStackBlock() {
    const base = stack.tower[stack.tower.length - 1];
    stack.axis = stack.tower.length % 2 === 0 ? "z" : "x";
    const travel = 330;
    stack.direction = stack.tower.length % 2 === 0 ? -1 : 1;
    stack.active = createStackBlock(
      stack.axis === "x" ? -travel * stack.direction : base.x,
      stack.axis === "z" ? -travel * stack.direction : base.z,
      base.w,
      base.d,
      base.level + 1,
      stackColor(base.level + 1)
    );
  }

  function tickStack() {
    if (!stack.running || stack.paused || !stack.active) return;
    const now = performance.now();
    const dt = Math.min(0.05, (now - stack.lastFrame) / 1000 || 0.016);
    stack.lastFrame = now;
    const active = stack.active;
    const travel = 340;
    active[stack.axis] += stack.direction * stack.speed * dt;
    if (active[stack.axis] > travel) {
      active[stack.axis] = travel;
      stack.direction = -1;
    }
    if (active[stack.axis] < -travel) {
      active[stack.axis] = -travel;
      stack.direction = 1;
    }
    drawStack();
  }

  function placeStackBlock() {
    if (!stack.running || stack.paused || !stack.active) {
      if (!stack.running) startStack();
      return;
    }
    const active = stack.active;
    const base = stack.tower[stack.tower.length - 1];
    const sizeKey = stack.axis === "x" ? "w" : "d";
    const centerKey = stack.axis;
    const activeStart = active[centerKey] - active[sizeKey] / 2;
    const activeEnd = active[centerKey] + active[sizeKey] / 2;
    const baseStart = base[centerKey] - base[sizeKey] / 2;
    const baseEnd = base[centerKey] + base[sizeKey] / 2;
    let overlapStart = Math.max(activeStart, baseStart);
    let overlapEnd = Math.min(activeEnd, baseEnd);
    let overlap = overlapEnd - overlapStart;
    const offset = active[centerKey] - base[centerKey];
    const perfect = Math.abs(offset) <= 8;

    if (perfect) {
      stack.combo += 1;
      stack.bestCombo = Math.max(stack.bestCombo, stack.combo);
      stack.perfects += 1;
      overlapStart = baseStart;
      overlapEnd = baseEnd;
      overlap = Math.min(base[sizeKey] + (stack.combo >= 3 ? 8 : 0), 230);
      stack.glowUntil = performance.now() + 420;
      playTone("level");
    } else {
      stack.combo = 0;
      playTone("eat");
    }

    if (overlap <= 0) {
      endStackRun("crash");
      return;
    }

    const placed = { ...active, perfect };
    placed[centerKey] = perfect ? base[centerKey] : (overlapStart + overlapEnd) / 2;
    placed[sizeKey] = overlap;
    if (stack.axis === "x") placed.z = base.z;
    if (stack.axis === "z") placed.x = base.x;
    stack.tower.push(placed);
    stack.score += 1;
    stack.speed = Math.min(520, 190 + stack.score * 8 + Math.floor(stack.score / 12) * 28);
    stack.cameraLevel = Math.max(0, stack.tower.length - 14);
    addStackParticles(placed, perfect ? 18 : 7, perfect ? "#ffffff" : placed.color);
    spawnStackBlock();
    renderStackStats();
    drawStack();
  }

  function addStackParticles(block, count, color) {
    for (let i = 0; i < count; i += 1) {
      stack.particles.push({
        x: block.x + (Math.random() - 0.5) * block.w,
        z: block.z + (Math.random() - 0.5) * block.d,
        level: block.level,
        vx: (Math.random() - 0.5) * 80,
        vz: (Math.random() - 0.5) * 80,
        vy: -Math.random() * 28,
        life: 24,
        color
      });
    }
  }

  function calculateStackXp() {
    const base = stack.score * 7;
    const perfectBonus = stack.perfects * 8 + stack.bestCombo * 12;
    const survival = Math.floor(stackElapsedSeconds() / 10);
    const newBestBonus = stack.score > state.stats.stackBest ? 45 : 0;
    return Math.max(2, base + perfectBonus + survival + newBestBonus);
  }

  function previewStackCoins(newBest = stack.score > state.stats.stackBest) {
    let earned = Math.max(2, Math.floor(stack.score * 2.5) + stack.perfects * 3 + stack.bestCombo * 2);
    if (newBest) earned += 20;
    return applyRewardBooster(earned);
  }

  function renderStackStats() {
    if (!el.stackScore) return;
    el.stackScore.textContent = formatNumber(stack.score);
    el.stackBest.textContent = formatNumber(Math.max(Number(state.stats.stackBest) || 0, stack.score));
    el.stackCombo.textContent = formatNumber(stack.combo);
    el.stackXpPreview.textContent = formatNumber(applyRewardBooster(calculateStackXp()));
    el.stackCoinPreview.textContent = formatNumber(previewStackCoins());
    el.startStackBtn.textContent = stack.running ? "End Game" : "Start Game";
    el.stackPauseBtn.textContent = stack.paused ? "Resume" : "Pause";
    el.stackPauseBtn.disabled = !stack.running;
  }

  function drawStack() {
    if (!el.stackCanvas) return;
    const ctx = el.stackCanvas.getContext("2d");
    const width = el.stackCanvas.width;
    const height = el.stackCanvas.height;
    const now = performance.now();
    ctx.clearRect(0, 0, width, height);
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, "#27105e");
    bg.addColorStop(0.48, "#13072e");
    bg.addColorStop(1, "#05030b");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 60; i += 1) {
      const x = (i * 97 + 43) % width;
      const y = (i * 53 + Math.sin(now / 800 + i) * 8) % height;
      ctx.globalAlpha = 0.16 + (i % 5) * 0.05;
      ctx.fillStyle = i % 3 === 0 ? "#ff2fad" : "#49f4ff";
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.globalAlpha = 1;

    ctx.font = "300 74px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.shadowBlur = 28;
    ctx.shadowColor = "#ff2fad";
    ctx.fillText(String(stack.score), width / 2, 96);
    ctx.shadowBlur = 0;

    const visible = [...stack.tower.slice(Math.max(0, stack.tower.length - 26)), stack.active].filter(Boolean);
    visible.sort((a, b) => a.level - b.level).forEach((block) => drawStackBlock(ctx, block));
    updateStackParticles(ctx);

    if (now < stack.glowUntil) {
      const top = stack.tower[stack.tower.length - 1];
      ctx.save();
      ctx.globalAlpha = (stack.glowUntil - now) / 420;
      drawStackOutline(ctx, top);
      ctx.restore();
    }

    if (stack.paused) {
      ctx.fillStyle = "rgba(5, 3, 11, 0.68)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 56px Arial Black";
      ctx.fillText("PAUSED", width / 2, height / 2);
    }
    ctx.textAlign = "left";
  }

  function stackProject(x, z, level) {
    return {
      x: 360 + (x - z) * 0.54,
      y: 720 - (level - stack.cameraLevel) * 24 + (x + z) * 0.15
    };
  }

  function drawStackBlock(ctx, block) {
    const h = 18;
    const p1 = stackProject(block.x - block.w / 2, block.z - block.d / 2, block.level);
    const p2 = stackProject(block.x + block.w / 2, block.z - block.d / 2, block.level);
    const p3 = stackProject(block.x + block.w / 2, block.z + block.d / 2, block.level);
    const p4 = stackProject(block.x - block.w / 2, block.z + block.d / 2, block.level);
    const color = block.color;
    ctx.save();
    ctx.shadowBlur = block.perfect ? 22 : 12;
    ctx.shadowColor = color;
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 1.4;
    ctx.fillStyle = color;
    ctx.beginPath();
    [p1, p2, p3, p4].forEach((p, index) => index ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(5,3,11,0.32)";
    ctx.beginPath();
    ctx.moveTo(p4.x, p4.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p3.x, p3.y + h);
    ctx.lineTo(p4.x, p4.y + h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.beginPath();
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p3.x, p3.y + h);
    ctx.lineTo(p2.x, p2.y + h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawStackOutline(ctx, block) {
    const corners = [
      stackProject(block.x - block.w / 2, block.z - block.d / 2, block.level + 0.1),
      stackProject(block.x + block.w / 2, block.z - block.d / 2, block.level + 0.1),
      stackProject(block.x + block.w / 2, block.z + block.d / 2, block.level + 0.1),
      stackProject(block.x - block.w / 2, block.z + block.d / 2, block.level + 0.1)
    ];
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.shadowBlur = 26;
    ctx.shadowColor = "#ffffff";
    ctx.beginPath();
    corners.forEach((p, index) => index ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    ctx.closePath();
    ctx.stroke();
  }

  function updateStackParticles(ctx) {
    stack.particles = stack.particles.filter((p) => p.life > 0);
    stack.particles.forEach((p) => {
      p.x += p.vx * 0.016;
      p.z += p.vz * 0.016;
      p.level += p.vy * 0.001;
      p.life -= 1;
      const pos = stackProject(p.x, p.z, p.level);
      ctx.globalAlpha = Math.max(0, p.life / 24);
      ctx.fillStyle = p.color;
      ctx.fillRect(pos.x, pos.y, 3, 3);
    });
    ctx.globalAlpha = 1;
  }

  function endStackRun(reason = "crash") {
    if (!stack.running) return;
    stopStack(false);
    if (reason === "manual") playTone("tap");
    else playGameOverSound();
    stopGameTheme(reason === "crash" ? "death" : "stop");

    const previousBest = Number(state.stats.stackBest) || 0;
    const newBest = stack.score > previousBest;
    const oldAchievements = new Set(state.achievements);
    const boosterUsed = getEquippedBoosterItem();
    const earned = applyRewardBooster(calculateStackXp());
    const coinsEarned = previewStackCoins(newBest);

    state.stats.gamesPlayed += 1;
    state.stats.stackRuns += 1;
    state.stats.stackTotalScore += stack.score;
    state.stats.stackBest = Math.max(previousBest, stack.score);
    state.stats.stackPerfects = Math.max(Number(state.stats.stackPerfects) || 0, stack.bestCombo);

    if (boosterUsed) {
      state.boosterCooldowns[boosterUsed.boost] = Date.now() + 10 * 60 * 1000;
      state.equippedBooster = null;
      state.boosterUses += 1;
      if (!state.boosterLevelTarget || state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
      showToast("Booster Used", `${boosterUsed.title} applied. Cooldown started.`, "win");
    }

    state.xp += earned;
    state.stats.stackXpEarned += earned;
    state.coins += coinsEarned;
    state.level = deriveLevel(state.xp);
    unlockEarnedAchievements();
    if (boosterUsed && state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
    saveState();
    renderAll();

    const newAchievements = achievements.filter((item) => !oldAchievements.has(item.id) && state.achievements.includes(item.id));
    currentGame = "stack";
    if (newBest) showToast("New High Score", `Stack best is now ${formatNumber(stack.score)}.`, "win");
    showToast("XP Earned", `+${formatNumber(earned)} XP.`, "win");
    showToast("Coins Earned", `+${formatNumber(coinsEarned)} coins.`, "win");
    el.resultScore.textContent = formatNumber(stack.score);
    el.resultXp.textContent = formatNumber(earned);
    el.resultCoins.textContent = formatNumber(coinsEarned);
    el.resultBest.textContent = formatNumber(state.stats.stackBest);
    el.newBestBadge.classList.toggle("hidden", !newBest);
    el.resultAchievements.innerHTML = newAchievements.map((item) => `<span>${item.title}</span>`).join("");
    el.resultMessage.textContent = newBest
      ? "New tower best. The stack keeps climbing."
      : reason === "manual"
        ? "Run ended. Your tower data has been saved."
        : "Tower missed. Retry and tighten the timing.";
    el.gameOverModal.classList.remove("hidden");
  }

  function createSnakeState() {
    return {
      running: false,
      paused: false,
      score: 0,
      streak: 0,
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      directionQueue: [],
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
    const queue = snake.directionQueue || [];
    const basis = queue.length ? queue[queue.length - 1] : snake.nextDirection || snake.direction;
    if (next.x === basis.x && next.y === basis.y) return;
    if (next.x + basis.x === 0 && next.y + basis.y === 0) return;
    if (queue.length >= 3) queue.shift();
    queue.push(next);
    snake.directionQueue = queue;
    snake.nextDirection = queue[0];
  }

  function tickSnake() {
    if (snake.paused) return;

    if (snake.directionQueue?.length) {
      snake.nextDirection = snake.directionQueue.shift();
    }
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
    if (reason === "manual") {
      playTone("tap");
    } else {
      playGameOverSound();
    }
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
    currentGame = "snake";
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
      ["block_first", state.stats.blockRuns >= 1],
      ["block_500", state.stats.blockBest >= 500],
      ["star_first", state.stats.starRuns >= 1],
      ["star_25", state.stats.starKills >= 25],
      ["stack_first", state.stats.stackRuns >= 1],
      ["stack_20", state.stats.stackBest >= 20],
      ["stack_perfect_5", state.stats.stackPerfects >= 5],
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
    const favorite = getFavoriteGame();
    const text = `Check out my ARCADIA profile. Level ${state.level}, ${formatNumber(state.xp)} XP, ${formatNumber(state.coins)} coins, ${favorite.title} best ${formatNumber(favorite.best)}. Bet you can't top that.`;
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
    let remoteVersion = APP_VERSION;
    let remoteNotes = PATCH_NOTES;
    try {
      const versionResponse = await fetch(`${VERSION_URL}?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" }
      });
      if (versionResponse.ok) {
        const versionData = await versionResponse.json();
        remoteVersion = versionData.version || APP_VERSION;
        remoteNotes = Array.isArray(versionData.patchNotes) ? versionData.patchNotes : PATCH_NOTES;
      }
    } catch {
      // Offline or blocked requests fall back to the installed version.
    }

    remoteVersion = normalizeVersion(remoteVersion) || APP_VERSION;
    const previousVersion = normalizeVersion(localStorage.getItem(VERSION_KEY)) || APP_VERSION;
    const hasRemoteUpdate = remoteVersion !== APP_VERSION || previousVersion !== APP_VERSION;

    try {
      const registration = await registerServiceWorker();
      await registration?.update();
      await activateWaitingWorker(registration);
      if (hasRemoteUpdate && "caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.filter((key) => key.startsWith("arcadia-")).map((key) => caches.delete(key)));
      }
    } catch {
      // Cache access can be blocked in some browser modes.
    }

    if (hasRemoteUpdate) {
      localStorage.setItem(VERSION_KEY, remoteVersion);
      showToast("Update Successful", `Patches include: ${remoteNotes.join(" ")}`, "win", 5000);
      setTimeout(() => window.location.reload(), 900);
      return;
    }
    localStorage.setItem(VERSION_KEY, APP_VERSION);
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

  function openBackdoorModal() {
    el.developerAccessCode.value = "";
    el.developerModal.classList.add("hidden");
    el.backdoorModal.classList.remove("hidden");
    el.developerAccessCode.focus();
  }

  function openDevModeModal() {
    el.backdoorModal.classList.add("hidden");
    el.devModeToggle.checked = Boolean(state.devModeEnabled);
    el.devModeModal.classList.remove("hidden");
  }

  function unlockDevMode(event) {
    event.preventDefault();
    const code = el.developerAccessCode.value.trim().toLowerCase();
    if (code !== DEV_ACCESS_CODE) {
      const card = el.backdoorModal.querySelector(".modal-card");
      card?.classList.remove("access-denied");
      void card?.offsetWidth;
      card?.classList.add("access-denied");
      showToast("Access Denied", "Operator code rejected.", "fail", 3500);
      return;
    }
    playTone("win");
    openDevModeModal();
  }

  function setDevModeEnabled(enabled) {
    state.devModeEnabled = Boolean(enabled);
    saveState();
    renderAll();
    showToast("Dev Mode", state.devModeEnabled ? "Operator tools unlocked." : "Operator tools hidden.", "win", 4000);
  }

  function editPlayerLevel() {
    if (!state.devModeEnabled) return;
    const current = deriveLevel(state.xp);
    const input = window.prompt("Set player level", String(current));
    if (input === null) return;
    const nextLevel = Math.max(1, Math.min(999, Math.floor(Number(input))));
    if (!Number.isFinite(nextLevel)) {
      showToast("Invalid Level", "Enter a number from 1 to 999.", "fail", 3500);
      return;
    }
    state.xp = xpForLevel(nextLevel);
    state.level = deriveLevel(state.xp);
    if (state.boosterLevelTarget && state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
    unlockEarnedAchievements();
    saveState();
    headerSeenXp = Number(state.xp) || 0;
    renderAll();
    showToast("Level Updated", `Player level set to ${state.level}.`, "win", 4000);
  }

  function editPlayerCoins() {
    if (!state.devModeEnabled) return;
    const input = window.prompt("Set player coins", String(state.coins));
    if (input === null) return;
    const nextCoins = Math.max(0, Math.min(999999999, Math.floor(Number(input))));
    if (!Number.isFinite(nextCoins)) {
      showToast("Invalid Coins", "Enter a valid coin amount.", "fail", 3500);
      return;
    }
    state.coins = nextCoins;
    saveState();
    renderAll();
    showToast("Coins Updated", `${formatNumber(state.coins)} coins loaded.`, "win", 4000);
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

  function updateStarJoystick(event) {
    const rect = el.starJoystick.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const max = rect.width * 0.34;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const scale = dist > max ? max / dist : 1;
    const x = dx * scale;
    const y = dy * scale;
    star.input.x = x / max;
    star.input.y = y / max;
    el.starJoystickKnob.style.transform = `translate(${x}px, ${y}px)`;
  }

  function resetJoystickVisual() {
    if (!el.starJoystickKnob) return;
    star.input.x = 0;
    star.input.y = 0;
    el.starJoystickKnob.style.transform = "translate(0, 0)";
  }

  function startStarJoystick(event) {
    if (!star.running || star.paused) return;
    event.preventDefault();
    star.joystickPointerId = event.pointerId;
    el.starJoystick.setPointerCapture?.(event.pointerId);
    updateStarJoystick(event);
  }

  function moveStarJoystick(event) {
    if (star.paused) return;
    if (star.joystickPointerId !== event.pointerId) return;
    event.preventDefault();
    updateStarJoystick(event);
  }

  function endStarJoystick(event) {
    if (star.joystickPointerId !== event.pointerId) return;
    star.joystickPointerId = null;
    resetJoystickVisual();
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
    el.progressModeBtn.addEventListener("click", () => {
      renderProgressModal();
      el.progressModal.classList.remove("hidden");
    });
    el.closeProgressBtn.addEventListener("click", () => el.progressModal.classList.add("hidden"));
    el.developerModeBtn.addEventListener("click", () => el.developerModal.classList.remove("hidden"));
    el.closeDeveloperBtn.addEventListener("click", () => el.developerModal.classList.add("hidden"));
    el.toggleSfxBtn.addEventListener("click", toggleSoundEffects);
    el.toggleMusicBtn.addEventListener("click", toggleSoundtrack);
    el.checkUpdatesBtn.addEventListener("click", searchForUpdates);
    el.openRenameBtn.addEventListener("click", openRenameModal);
    el.editLevelBtn.addEventListener("click", editPlayerLevel);
    el.editCoinsBtn.addEventListener("click", editPlayerCoins);
    el.closeRenameBtn.addEventListener("click", () => el.renameModal.classList.add("hidden"));
    el.openBackdoorBtn.addEventListener("click", openBackdoorModal);
    el.closeBackdoorBtn.addEventListener("click", () => {
      el.backdoorModal.classList.add("hidden");
      el.developerModal.classList.remove("hidden");
    });
    el.backdoorForm.addEventListener("submit", unlockDevMode);
    el.closeDevModeBtn.addEventListener("click", () => {
      el.devModeModal.classList.add("hidden");
      el.developerModal.classList.remove("hidden");
      renderDeveloperTools();
    });
    el.devModeToggle.addEventListener("change", () => setDevModeEnabled(el.devModeToggle.checked));
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
      if (currentGame === "block") {
        startBlock();
      } else if (currentGame === "star") {
        startStar();
      } else if (currentGame === "stack") {
        startStack();
      } else {
        startSnake();
      }
    });
    el.closeResultBtn.addEventListener("click", () => {
      el.gameOverModal.classList.add("hidden");
      showScreen("home");
    });
    el.exitBlockBtn.addEventListener("click", () => showScreen("home"));
    el.blockPauseBtn.addEventListener("click", toggleBlockPause);
    el.startBlockBtn.addEventListener("click", handlePrimaryBlockAction);
    el.restartBlockBtn.addEventListener("click", restartBlock);
    el.exitStarBtn.addEventListener("click", () => showScreen("home"));
    el.starPauseBtn.addEventListener("click", toggleStarPause);
    el.startStarBtn.addEventListener("click", handlePrimaryStarAction);
    el.restartStarBtn.addEventListener("click", restartStar);
    el.exitStackBtn.addEventListener("click", () => showScreen("home"));
    el.stackPauseBtn.addEventListener("click", toggleStackPause);
    el.startStackBtn.addEventListener("click", handlePrimaryStackAction);
    el.restartStackBtn.addEventListener("click", restartStack);
    el.stackCanvas.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      placeStackBlock();
    });
    el.starJoystick.addEventListener("pointerdown", startStarJoystick);
    el.starJoystick.addEventListener("pointermove", moveStarJoystick);
    el.starJoystick.addEventListener("pointerup", endStarJoystick);
    el.starJoystick.addEventListener("pointercancel", endStarJoystick);
    el.starShootBtn.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (!star.running || star.paused) return;
      star.shootHeld = true;
      shootStar();
    });
    el.starShootBtn.addEventListener("pointerup", () => { star.shootHeld = false; });
    el.starShootBtn.addEventListener("pointercancel", () => { star.shootHeld = false; });
    document.addEventListener("pointermove", moveBlockDrag);
    document.addEventListener("pointerup", endBlockDrag);
    document.addEventListener("pointercancel", () => cleanupBlockDrag(true));

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
      if (keyMap[event.key] && currentScreen === "star" && star.running && !star.paused) {
        event.preventDefault();
        const dir = keyMap[event.key];
        star.input.x = dir === "left" ? -1 : dir === "right" ? 1 : star.input.x;
        star.input.y = dir === "up" ? -1 : dir === "down" ? 1 : star.input.y;
      }
      if (event.key === " " && currentScreen === "game") {
        event.preventDefault();
        snake.running ? togglePause() : startSnake();
      }
      if (event.key === " " && currentScreen === "star") {
        event.preventDefault();
        if (!star.running) startStar();
        else if (!star.paused) shootStar();
      }
      if (event.key === " " && currentScreen === "stack") {
        event.preventDefault();
        placeStackBlock();
      }
    });

    document.addEventListener("keyup", (event) => {
      if (currentScreen !== "star") return;
      if (["ArrowLeft", "ArrowRight", "a", "A", "d", "D"].includes(event.key)) star.input.x = 0;
      if (["ArrowUp", "ArrowDown", "w", "W", "s", "S"].includes(event.key)) star.input.y = 0;
    });

    el.snakeCanvas.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      touchStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
      el.snakeCanvas.setPointerCapture?.(event.pointerId);
    });

    el.snakeCanvas.addEventListener("pointermove", (event) => {
      if (!touchStart || touchStart.pointerId !== event.pointerId) return;
      event.preventDefault();
      const dx = event.clientX - touchStart.x;
      const dy = event.clientY - touchStart.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 10) return;
      changeDirection(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
      touchStart.x = event.clientX;
      touchStart.y = event.clientY;
    });

    el.snakeCanvas.addEventListener("pointerup", (event) => {
      event.preventDefault();
      if (touchStart?.pointerId === event.pointerId) touchStart = null;
    });

    el.snakeCanvas.addEventListener("pointercancel", (event) => {
      event.preventDefault();
      touchStart = null;
    });

    window.addEventListener("resize", () => {
      if (!document.body.classList.contains("video-live")) return;
      startBackgroundVideo();
    });
  }

  function init() {
    bindEvents();
    registerServiceWorker();
    localStorage.setItem(VERSION_KEY, APP_VERSION);
    drawSnake();
    setTimeout(() => {
      if (currentScreen === "boot") {
        showConnectionPrompt();
      }
    }, 2200);
  }

  init();
})();
