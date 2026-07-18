(() => {
  "use strict";

  const STORAGE_KEY = "arcadia_player_v1";
  const VERSION_KEY = "arcadia_app_version";
  const APP_VERSION = "19.7.5.28";
  const VERSION_URL = "app-version.json";
  const DEV_ACCESS_CODE = "80sarcadia";
  const PATCH_NOTES = [
    "Star Invaders controls now stay anchored left and right, while Gun refills follow a protected 2-4 minute survival timer.",
    "Star Invaders Machine Gun booster now appears as a mid-game button and only activates when tapped.",
    "Star Invaders floating Gun perk added to recharge Machine Gun or stack extra shot damage without it.",
    "Crossy Road cover updated, trees and rocks now block movement, and rising screen pressure punishes idle runs.",
    "Crossy Road visuals rebuilt closer to the reference demo with bright lanes, blocky vehicles, trees, and a chunkier player.",
    "Crossy Road added as Game 06 with swipe controls, street ambience, crash death screen, and ARCADIA scoring.",
    "Flappy Bird countdown now uses the ARCADIA pixel number font.",
    "Flappy Bird added as Game 05 with pipe scoring, countdown start, XP scaling, and soundtrack.",
    "Machine Gun booster now lasts 30 seconds in Star Invaders before normal shooting returns.",
    "Rewards Store expanded with new nameplates, Star Invaders laser cosmetics, Machine Gun booster, and fixed Stack action button sizing.",
    "Star Invaders boss outlines removed, Freefire sped up, and rare powerup balance tuned.",
    "Star Invaders now shows active powerup countdowns on the top-right of the game screen.",
    "Star Invaders boss-best counter, Freefire, nuke powerup, and escalating boss visuals added.",
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
  const FLAPPY_TICK_MS = 1000 / 60;
  const CROSSY_TICK_MS = 1000 / 60;
  const GAME_OVER_SFX = "assets/audio/sfx/game-over.mp3";
  const LEVEL_UP_SFX = "assets/audio/sfx/level-up.mp3";
  const CROSSY_CRASH_SFX = "assets/audio/sfx/crossy-road/crash.mp3";
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
      flappy: "assets/themesong/games/flappy-bird.mp3",
      crossy: "assets/themesong/games/crossy-road-street.mp3",
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
    equippedLaser: null,
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
      stackPerfects: 0,
      flappyRuns: 0,
      flappyBest: 0,
      flappyXpEarned: 0,
      flappyTotalScore: 0,
      crossyRuns: 0,
      crossyBest: 0,
      crossyXpEarned: 0,
      crossyTotalScore: 0
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
      id: "flappy",
      title: "Flappy Bird",
      gameNo: "05",
      tags: ["flappy", "bird", "pipes", "reflex", "classic"],
      description: "Tap to flap, thread pipes, and keep the streak alive.",
      status: "Play",
      available: true,
      image: "assets/images/games/flappybird.png",
      mark: "F"
    },
    {
      id: "crossy",
      title: "Crossy Road",
      gameNo: "06",
      tags: ["crossy", "road", "traffic", "cars", "swipe", "classic"],
      description: "Swipe through neon traffic and push your crossing streak.",
      status: "Play",
      available: true,
      image: "assets/images/games/crossyroad.png",
      mark: "C"
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
    { id: "flappy_first", title: "First Flight", text: "Complete your first Flappy Bird run." },
    { id: "flappy_10", title: "Pipe Runner", text: "Clear 10 pipes in Flappy Bird." },
    { id: "crossy_first", title: "Street Starter", text: "Complete your first Crossy Road run." },
    { id: "crossy_10", title: "Traffic Dodger", text: "Reach score 10 in Crossy Road." },
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
      id: "blue_nameplate",
      title: "Blue Nameplate",
      category: "player",
      type: "cosmetic",
      slot: "nameplate",
      level: 6,
      cost: 520,
      tags: ["nameplate", "profile", "player", "blue", "neon"],
      text: "Wrap your player tag in a cold neon-blue arcade glow."
    },
    {
      id: "black_nameplate",
      title: "Black Nameplate",
      category: "player",
      type: "cosmetic",
      slot: "nameplate",
      level: 10,
      cost: 980,
      tags: ["nameplate", "profile", "player", "black", "neon"],
      text: "A deep black glass plate with a tight neon edge."
    },
    {
      id: "purple_nameplate",
      title: "Purple Nameplate",
      category: "player",
      type: "cosmetic",
      slot: "nameplate",
      level: 15,
      cost: 1650,
      tags: ["nameplate", "profile", "player", "purple", "neon"],
      text: "A rich violet glow for higher-ranked arcade players."
    },
    {
      id: "rgb_nameplate",
      title: "RGB Nameplate",
      category: "player",
      type: "cosmetic",
      slot: "nameplate",
      level: 20,
      cost: 2600,
      tags: ["nameplate", "profile", "player", "rgb", "rainbow"],
      text: "A shifting RGB nameplate that cycles through arcade color."
    },
    {
      id: "redline_nameplate",
      title: "Redline Nameplate",
      category: "player",
      type: "cosmetic",
      slot: "nameplate",
      level: 25,
      cost: 3900,
      tags: ["nameplate", "profile", "player", "red", "black", "animated"],
      text: "A black neon plate with red energy racing around the border."
    },
    {
      id: "laser_yellow",
      title: "Yellow Laser Beams",
      category: "player",
      type: "cosmetic",
      slot: "laser",
      level: 10,
      cost: 900,
      tags: ["star", "invaders", "laser", "yellow", "bullets"],
      text: "Change Star Invaders shots into hot yellow arcade beams."
    },
    {
      id: "laser_black",
      title: "Black Laser Beams",
      category: "player",
      type: "cosmetic",
      slot: "laser",
      level: 15,
      cost: 1550,
      tags: ["star", "invaders", "laser", "black", "bullets"],
      text: "Fire dark-core laser rounds with neon edge glow."
    },
    {
      id: "laser_rgb",
      title: "RGB Laser Beams",
      category: "player",
      type: "cosmetic",
      slot: "laser",
      level: 20,
      cost: 2700,
      tags: ["star", "invaders", "laser", "rgb", "bullets"],
      text: "Cycle every Star Invaders shot through RGB colors."
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
    },
    {
      id: "machine_gun_star",
      title: "Machine Gun",
      category: "boosters",
      type: "booster",
      boost: "machine_gun_star",
      effect: "machine_gun",
      game: "star",
      level: 12,
      cost: 1250,
      tags: ["booster", "star", "invaders", "machine", "gun", "autofire"],
      text: "Auto-fire in your next Star Invaders run. No bonus damage, just pressure."
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
  let flappy = createFlappyState();
  let flappyTimer = null;
  let crossy = createCrossyState();
  let crossyTimer = null;
  let crossyTouchStart = null;
  let crossyCrashAudio = null;
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
    flappyScreen: $("flappyScreen"),
    crossyScreen: $("crossyScreen"),
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
    starBoosterBtn: $("starBoosterBtn"),
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
    exitFlappyBtn: $("exitFlappyBtn"),
    flappyPauseBtn: $("flappyPauseBtn"),
    flappyCanvas: $("flappyCanvas"),
    flappyScore: $("flappyScore"),
    flappyBest: $("flappyBest"),
    flappyStreak: $("flappyStreak"),
    flappyXpPreview: $("flappyXpPreview"),
    flappyCoinPreview: $("flappyCoinPreview"),
    startFlappyBtn: $("startFlappyBtn"),
    restartFlappyBtn: $("restartFlappyBtn"),
    exitCrossyBtn: $("exitCrossyBtn"),
    crossyPauseBtn: $("crossyPauseBtn"),
    crossyCanvas: $("crossyCanvas"),
    crossyScore: $("crossyScore"),
    crossyBest: $("crossyBest"),
    crossyStreak: $("crossyStreak"),
    crossyXpPreview: $("crossyXpPreview"),
    crossyCoinPreview: $("crossyCoinPreview"),
    startCrossyBtn: $("startCrossyBtn"),
    restartCrossyBtn: $("restartCrossyBtn"),
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
      equippedLaser: typeof saved?.equippedLaser === "string" ? saved.equippedLaser : null,
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
    el.flappyScreen.classList.toggle("hidden", name !== "flappy");
    el.crossyScreen.classList.toggle("hidden", name !== "crossy");
    if (name !== "game") stopSnake();
    if (name !== "block") stopBlock(false);
    if (name !== "star") stopStar(false);
    if (name !== "stack") stopStack(false);
    if (name !== "flappy") stopFlappy(false);
    if (name !== "crossy") stopCrossy(false);
    renderAll();
    if (name === "home") {
      playLobbyTheme({ transition: ["game", "block", "star", "stack", "flappy", "crossy"].includes(previousScreen) });
    } else if (["game", "block", "star", "stack", "flappy", "crossy"].includes(previousScreen) && name !== previousScreen) {
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
    audio.volume = options.volume ?? 0.58;
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
    if (currentScreen === "flappy" && flappy.running) playGameTheme("flappy");
    if (currentScreen === "crossy" && crossy.running) playGameTheme("crossy", { volume: 0.4 });
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
    const nameplateClasses = ["nameplate-neon", "nameplate-blue", "nameplate-black", "nameplate-purple", "nameplate-rgb", "nameplate-redline"];
    const activeNameplateClass = {
      neon_badge: "nameplate-neon",
      blue_nameplate: "nameplate-blue",
      black_nameplate: "nameplate-black",
      purple_nameplate: "nameplate-purple",
      rgb_nameplate: "nameplate-rgb",
      redline_nameplate: "nameplate-redline"
    }[state.equippedNameplate] || "";
    el.playerHandle.textContent = name.toUpperCase();
    el.headerCoins.textContent = formatCompactNumber(state.coins);
    nameplateClasses.forEach((className) => {
      el.openProfileBtn.classList.toggle(className, className === activeNameplateClass);
      el.profileHero.classList.toggle(className, className === activeNameplateClass);
    });
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
        if (game.id === "flappy") openFlappy();
        if (game.id === "crossy") openCrossy();
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
      },
      {
        title: "Flappy Bird",
        xp: Number(state.stats.flappyXpEarned) || 0,
        runs: Number(state.stats.flappyRuns) || 0,
        best: Number(state.stats.flappyBest) || 0,
        metricLabel: "Pipes"
      },
      {
        title: "Crossy Road",
        xp: Number(state.stats.crossyXpEarned) || 0,
        runs: Number(state.stats.crossyRuns) || 0,
        best: Number(state.stats.crossyBest) || 0,
        metricLabel: "Score"
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
      },
      {
        id: "flappy",
        title: "Flappy Bird",
        runs: Number(state.stats.flappyRuns) || 0,
        xp: Number(state.stats.flappyXpEarned) || 0,
        best: Number(state.stats.flappyBest) || 0
      },
      {
        id: "crossy",
        title: "Crossy Road",
        runs: Number(state.stats.crossyRuns) || 0,
        xp: Number(state.stats.crossyXpEarned) || 0,
        best: Number(state.stats.crossyBest) || 0
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
      const equipped = isCosmeticEquipped(item);
      const boosterEquipped = item.type === "booster" && state.equippedBooster === item.boost;
      const cooldown = item.type === "booster" ? getBoosterCooldownRemaining(item) : 0;
      const card = document.createElement("div");
      card.className = `store-card ${locked ? "locked" : ""} ${equipped || boosterEquipped ? "equipped" : ""}`;
      card.innerHTML = `
        <p class="system-line">${locked ? `Unlocked at Level ${item.level}` : item.type === "booster" ? cooldown ? `Cooldown ${formatCountdown(cooldown)}` : "Reusable Booster" : "Player Cosmetic"}</p>
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
    if (status.locked) return `<button class="arcade-btn secondary" data-store-action type="button">Level ${item.level}</button>`;
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

  function isCosmeticEquipped(item) {
    if (item.slot === "nameplate") return state.equippedNameplate === item.id;
    if (item.slot === "laser") return state.equippedLaser === item.id;
    return false;
  }

  function toggleCosmetic(item) {
    if (item.slot === "nameplate") state.equippedNameplate = state.equippedNameplate === item.id ? null : item.id;
    else if (item.slot === "laser") state.equippedLaser = state.equippedLaser === item.id ? null : item.id;
    else return;
    saveState();
    renderAll();
    showToast(isCosmeticEquipped(item) ? "Reward Equipped" : "Reward Removed", item.title, "win");
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
      if (item.slot === "laser") state.equippedLaser = item.id;
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
      gunPowerupSpawnAt: 0,
      runStartedAt: 0,
      pausedAt: 0,
      pausedMs: 0,
      damageBoostUntil: 0,
      freefireUntil: 0,
      lastFreefireShotAt: 0,
      machineGunActive: false,
      machineGunChargeReady: false,
      machineGunBoosterEquipped: false,
      machineGunWasActivated: false,
      machineGunUntil: 0,
      lastMachineGunShotAt: 0,
      gunDamageBonus: 0,
      laserCycle: 0,
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
    const booster = getEquippedBoosterItem("star");
    star.running = true;
    star.machineGunBoosterEquipped = booster?.effect === "machine_gun";
    star.machineGunChargeReady = star.machineGunBoosterEquipped;
    star.machineGunActive = false;
    star.machineGunWasActivated = false;
    star.runStartedAt = Date.now();
    star.lastFrame = performance.now();
    star.machineGunUntil = 0;
    star.powerupSpawnAt = star.lastFrame + 5200;
    star.gunPowerupSpawnAt = randomStarGunPowerupTime();
    playTone("tap");
    playStarTheme("normal", { restart: true });
    starTimer = setInterval(tickStar, STAR_TICK_MS);
    renderStarStats();
    if (star.machineGunChargeReady) showToast("Machine Gun Armed", "Tap MG when you want 30 seconds of auto-fire.", "win");
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

  function activateStarMachineGun() {
    if (!star.running || star.paused || star.machineGunActive || !star.machineGunChargeReady) return;
    const now = performance.now();
    star.machineGunChargeReady = false;
    star.machineGunActive = true;
    star.machineGunWasActivated = true;
    star.machineGunUntil = now + 30000;
    star.lastMachineGunShotAt = 0;
    star.lastShotAt = 0;
    playTone("win");
    showToast("Machine Gun Active", "30 seconds of Star Invaders auto-fire.", "win");
    renderStarStats();
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
      bossTier: isBoss ? star.bossKills + 1 : 0,
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

  function getStarDamage(options = {}) {
    const gunBonus = Number(star.gunDamageBonus) || 0;
    if (options.freefire) return 2.5 + gunBonus;
    const boostDamage = performance.now() < star.damageBoostUntil ? 1.5 : 1;
    return boostDamage + gunBonus;
  }

  function getStarLaserColor(options = {}) {
    if (options.color) return options.color;
    if (options.freefire) return "#ffd35a";
    if (state.equippedLaser === "laser_yellow") return "#ffd35a";
    if (state.equippedLaser === "laser_black") return "#05030b";
    if (state.equippedLaser === "laser_rgb") {
      const colors = ["#49f4ff", "#ff2fad", "#57ff9a", "#ffd35a", "#b071ff"];
      const color = colors[star.laserCycle % colors.length];
      star.laserCycle += 1;
      return color;
    }
    return "#49f4ff";
  }

  function fireStarBullet(x, y, options = {}) {
    const color = getStarLaserColor(options);
    star.bullets.push({
      x,
      y,
      vx: options.vx || 0,
      vy: options.vy || -520,
      r: options.r || 4,
      damage: options.damage || getStarDamage(options),
      color,
      darkCore: state.equippedLaser === "laser_black" && !options.color
    });
  }

  function shootStar(options = {}) {
    if (!star.running || star.paused) return;
    const now = performance.now();
    if (!options.auto && (now < star.freefireUntil || star.machineGunActive)) return;
    const delay = options.auto ? 55 : 190;
    if (now - star.lastShotAt < delay) return;
    star.lastShotAt = now;
    star.shots += 1;
    if (!options.quiet) playStarBlasterTone();
    const freefire = Boolean(options.freefire);
    fireStarBullet(star.player.x, star.player.y - 18, {
      vy: freefire ? -640 : -520,
      r: freefire ? 5 : 4,
      damage: getStarDamage({ freefire }),
      color: freefire ? "#ffd35a" : undefined
    });
    if (now < star.wingmenUntil) {
      fireStarBullet(star.player.x - 26, star.player.y - 4, { vx: -28, vy: freefire ? -650 : -540, r: 3.5, damage: getStarDamage({ freefire }), color: "#57ff9a" });
      fireStarBullet(star.player.x + 26, star.player.y - 4, { vx: 28, vy: freefire ? -650 : -540, r: 3.5, damage: getStarDamage({ freefire }), color: "#57ff9a" });
    }
  }

  function pickStarPowerupType() {
    const roll = Math.random();
    if (roll < 0.35) return "health";
    if (roll < 0.625) return "damage";
    if (roll < 0.85) return "wingmen";
    if (roll < 0.9375) return "rocket";
    if (roll < 0.9875) return "freefire";
    return "nuke";
  }

  function randomStarGunPowerupTime() {
    return star.survivedMs + 120000 + Math.random() * 120000;
  }

  function spawnStarPowerup(type = pickStarPowerupType()) {
    if (star.powerups.length >= 2) return false;
    const difficulty = starDifficulty();
    star.powerups.push({
      type,
      x: 48 + Math.random() * 624,
      y: -28,
      r: type === "rocket" || type === "nuke" || type === "gun" ? 21 : 18,
      vy: 78 + difficulty * 14 + Math.random() * 22,
      spin: Math.random() * Math.PI
    });
    return true;
  }

  function applyStarPowerup(type) {
    const now = performance.now();
    const labels = {
      health: "Shield Restored",
      damage: "Satellite Boost",
      wingmen: "Wingmen Online",
      rocket: "Rocket Support",
      freefire: "FREEFIRE!",
      nuke: "RAD NUKE",
      gun: "Gun Perk"
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
    } else if (type === "freefire") {
      star.freefireUntil = Math.max(star.freefireUntil, now) + 10000;
      star.lastFreefireShotAt = 0;
      star.lastShotAt = 0;
    } else if (type === "nuke") {
      triggerStarNuke();
    } else if (type === "gun") {
      applyStarGunPerk(now);
    }
    playTone("win");
    showToast(labels[type] || "Power Up", starPowerupMessage(type), "win");
  }

  function applyStarGunPerk(now = performance.now()) {
    if (star.machineGunBoosterEquipped) {
      star.machineGunChargeReady = true;
      return;
    }
    star.gunDamageBonus = Math.min(3, (Number(star.gunDamageBonus) || 0) + 0.35);
    star.damageBoostUntil = Math.max(star.damageBoostUntil, now) + 12000;
  }

  function starPowerupMessage(type) {
    if (type === "health") return `${star.health}/${star.maxHealth} health.`;
    if (type === "gun" && star.machineGunBoosterEquipped) return "Machine Gun charge refilled.";
    if (type === "gun") return `Shot damage upgraded to ${getStarDamage().toFixed(2)}.`;
    return "Powerup active.";
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

  function triggerStarNuke() {
    const targets = star.enemies.filter((enemy) => !enemy.dead && enemy.y > -70 && enemy.y < 760);
    if (!targets.length) {
      addStarExplosion(star.player.x, star.player.y - 60, "#ffd35a", 28);
      return;
    }
    playToneAt(95, 0.16, "sawtooth", 0.09);
    window.setTimeout(() => playToneAt(52, 0.22, "square", 0.07), 90);
    targets.forEach((enemy, index) => {
      const boss = enemy.type === "boss";
      window.setTimeout(() => {
        addStarExplosion(enemy.x, enemy.y, boss ? "#57ff9a" : "#ffd35a", boss ? 44 : 18);
        if (boss) {
          addStarExplosion(enemy.x, enemy.y, "#ff2fad", 36);
          addStarExplosion(enemy.x, enemy.y, "#49f4ff", 32);
        }
        destroyStarEnemy(enemy, { quiet: true, nuke: true });
      }, index * 18);
    });
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

  function destroyStarEnemy(enemy, options = {}) {
    if (enemy.dead) return;
    enemy.dead = true;
    const boss = enemy.type === "boss";
    star.kills += 1;
    if (boss) {
      star.bossKills += 1;
      star.multiplier += 0.55 + star.bossKills * 0.08;
    }
    star.score += Math.round((boss ? 420 : 75) * star.multiplier);
    addStarExplosion(enemy.x, enemy.y, boss ? (options.nuke ? "#57ff9a" : "#ffd35a") : "#ff2fad", boss ? 24 : 12);
    if (!options.quiet) playTone(boss ? "level" : "win");
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
    if (now < star.freefireUntil && now - star.lastFreefireShotAt >= 62) {
      star.lastFreefireShotAt = now;
      shootStar({ auto: true, freefire: true, quiet: true });
    }
    if (star.machineGunActive && now >= star.machineGunUntil) {
      star.machineGunActive = false;
      star.machineGunUntil = 0;
      showToast("Machine Gun Expired", "Manual shooting is back online.");
    }
    if (star.machineGunActive && now >= star.freefireUntil && now - star.lastMachineGunShotAt >= 92) {
      star.lastMachineGunShotAt = now;
      shootStar({ auto: true, quiet: true });
    }

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
    const machineGunNeedsRefill = !star.machineGunBoosterEquipped || !star.machineGunChargeReady;
    if (star.survivedMs >= star.gunPowerupSpawnAt && !star.machineGunActive && machineGunNeedsRefill) {
      if (spawnStarPowerup("gun")) star.gunPowerupSpawnAt = randomStarGunPowerupTime();
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
    if (el.starBoosterBtn) {
      const showButton = star.running && star.machineGunBoosterEquipped;
      el.starBoosterBtn.classList.toggle("hidden", !showButton);
      el.starBoosterBtn.disabled = !showButton || star.paused || star.machineGunActive || !star.machineGunChargeReady;
      el.starBoosterBtn.textContent = star.machineGunActive ? "ON" : star.machineGunChargeReady ? "MG" : "--";
      const boosterLabel = star.machineGunActive
        ? "Machine gun booster active"
        : star.machineGunChargeReady
          ? "Activate machine gun booster"
          : "Machine gun booster unavailable";
      el.starBoosterBtn.setAttribute("aria-label", boosterLabel);
    }
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
    const bossPalette = [
      ["#ffd35a", "#ff2fad", "#ffd35a"],
      ["#ff5275", "#49f4ff", "#ff5275"],
      ["#57ff9a", "#ffd35a", "#57ff9a"],
      ["#b071ff", "#ffffff", "#b071ff"],
      ["#ff8a3d", "#57ff9a", "#ff8a3d"]
    ];
    const palette = bossPalette[Math.max(0, (enemy.bossTier || 1) - 1) % bossPalette.length];
    const body = boss ? palette[0] : "#57ff9a";
    const shade = boss ? palette[1] : "#49f4ff";

    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.shadowBlur = boss ? 24 : 16;
    ctx.shadowColor = boss ? palette[2] : "#57ff9a";
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
      gun: { symbol: "MG", color: "#57ff9a", label: "GUN" },
      damage: { symbol: "*", color: "#ffd35a", label: "1.5" },
      wingmen: { symbol: "A", color: "#49f4ff", label: "2X" },
      rocket: { symbol: "R", color: "#ff2fad", label: "3.5" },
      freefire: { symbol: "⚡", color: "#ffd35a", label: "FREE" },
      nuke: { symbol: "☢", color: "#57ff9a", label: "NUKE" }
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

  function getActiveStarPowerups(now = performance.now()) {
    return [
      { name: "Satellite", color: "#ffd35a", until: star.damageBoostUntil },
      { name: "Wingmen", color: "#49f4ff", until: star.wingmenUntil },
      { name: "Rocket", color: "#ff2fad", until: star.rocketHelperUntil },
      { name: "Freefire", color: "#ffd35a", until: star.freefireUntil },
      { name: "Machine Gun", color: "#57ff9a", until: star.machineGunUntil },
      {
        name: `Gun DMG +${(Number(star.gunDamageBonus) || 0).toFixed(2)}`,
        color: "#57ff9a",
        until: star.gunDamageBonus > 0 ? Number.POSITIVE_INFINITY : 0
      }
    ]
      .filter((item) => item.until > now)
      .map((item) => ({
        ...item,
        seconds: Number.isFinite(item.until) ? Math.max(1, Math.ceil((item.until - now) / 1000)) : null
      }));
  }

  function drawRoundedPanel(ctx, x, y, width, height, radius = 12) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function drawStarOverlay(ctx) {
    const best = Math.max(Number(state.stats.starBest) || 0, star.bossKills);
    const now = performance.now();
    ctx.save();
    ctx.fillStyle = "rgba(5, 3, 11, 0.72)";
    ctx.strokeStyle = star.bossKills > (Number(state.stats.starBest) || 0) ? "#ffd35a" : "rgba(73, 244, 255, 0.62)";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 14;
    ctx.shadowColor = ctx.strokeStyle;
    drawRoundedPanel(ctx, 14, 14, 156, 36, 12);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 14px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(`Bosses: ${formatNumber(best)}`, 28, 32);

    const activePowerups = getActiveStarPowerups(now);
    if (activePowerups.length) {
      const panelWidth = 196;
      const rowHeight = 24;
      const panelHeight = 22 + activePowerups.length * rowHeight;
      const x = 720 - panelWidth - 14;
      const y = 14;
      ctx.fillStyle = "rgba(5, 3, 11, 0.74)";
      ctx.strokeStyle = "rgba(255, 211, 90, 0.68)";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 14;
      ctx.shadowColor = "#ffd35a";
      drawRoundedPanel(ctx, x, y, panelWidth, panelHeight, 12);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 10px Arial";
      ctx.textAlign = "left";
      ctx.fillText("POWER UP", x + 14, y + 13);
      activePowerups.forEach((item, index) => {
        const rowY = y + 32 + index * rowHeight;
        ctx.fillStyle = item.color;
        ctx.font = "900 14px Arial";
        ctx.textAlign = "left";
        ctx.fillText(item.name.toUpperCase(), x + 14, rowY);
        ctx.textAlign = "right";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(item.seconds ? `${item.seconds}s` : "RUN", x + panelWidth - 14, rowY);
      });
    }

    if (now < star.freefireUntil) {
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(5, 3, 11, 0.52)";
      ctx.fillRect(210, 72, 300, 54);
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#ffd35a";
      ctx.fillStyle = "#ffd35a";
      ctx.font = "900 34px Arial";
      ctx.fillText("FREEFIRE!", 360, 100);
      ctx.shadowBlur = 0;
    }
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
      if (b.darkCore) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#ff2fad";
        ctx.strokeStyle = "#ff2fad";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(b.x - Math.max(2, b.r / 2), b.y - 12, Math.max(4, b.r), 18);
      }
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

    drawStarOverlay(ctx);

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
    const boosterUsed = getEquippedBoosterItem("star");
    const earned = applyRewardBooster(calculateStarXp());
    const coinsEarned = previewStarCoins(newBest);

    state.stats.gamesPlayed += 1;
    state.stats.starRuns += 1;
    state.stats.starTotalScore += finalScore;
    state.stats.starBest = Math.max(previousBest, star.bossKills);
    state.stats.starKills += star.kills;
    state.stats.starBossKills += star.bossKills;

    const shouldConsumeBooster = boosterUsed && (boosterUsed.effect !== "machine_gun" || star.machineGunWasActivated);
    if (shouldConsumeBooster) {
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
    if (shouldConsumeBooster && state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
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

  function getEquippedBoosterItem(game = currentGame) {
    if (!state.equippedBooster) return null;
    const item = getStoreItem(state.equippedBooster);
    if (!item || getBoosterCooldownRemaining(item) > 0) return null;
    if (item.game && item.game !== game) return null;
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
    return booster?.multiplier ? Math.round(value * booster.multiplier) : value;
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

  function createFlappyState() {
    return {
      running: false,
      paused: false,
      countdown: 0,
      countdownStartedAt: 0,
      lastFrame: 0,
      score: 0,
      bestLive: 0,
      bird: { x: 142, y: 300, vy: 0, r: 17, rotation: 0, wing: 0 },
      pipes: [],
      particles: [],
      spawnAt: 0,
      groundX: 0,
      startedAt: 0,
      pausedAt: 0,
      pausedMs: 0
    };
  }

  function openFlappy() {
    currentGame = "flappy";
    prepareGameTheme();
    showScreen("flappy");
    resetFlappy();
  }

  function resetFlappy() {
    stopFlappy(false);
    flappy = createFlappyState();
    renderFlappyStats();
    drawFlappy();
  }

  function startFlappy() {
    resetFlappy();
    flappy.running = true;
    flappy.countdown = 3;
    flappy.countdownStartedAt = performance.now();
    flappy.lastFrame = performance.now();
    flappy.startedAt = Date.now();
    flappy.spawnAt = flappy.lastFrame + 1900;
    playTone("tap");
    playGameTheme("flappy", { restart: true });
    flappyTimer = setInterval(tickFlappy, FLAPPY_TICK_MS);
    renderFlappyStats();
    drawFlappy();
  }

  function restartFlappy() {
    startFlappy();
  }

  function stopFlappy(render = true) {
    if (flappyTimer) {
      clearInterval(flappyTimer);
      flappyTimer = null;
    }
    if (flappy.paused && flappy.pausedAt) {
      flappy.pausedMs += Date.now() - flappy.pausedAt;
      flappy.pausedAt = 0;
    }
    flappy.running = false;
    flappy.paused = false;
    if (render) {
      renderFlappyStats();
      drawFlappy();
    }
  }

  function handlePrimaryFlappyAction() {
    if (flappy.running) {
      endFlappyRun("manual");
      return;
    }
    startFlappy();
  }

  function toggleFlappyPause() {
    if (!flappy.running || flappy.countdown > 0) return;
    flappy.paused = !flappy.paused;
    if (flappy.paused) {
      flappy.pausedAt = Date.now();
    } else {
      if (flappy.pausedAt) {
        flappy.pausedMs += Date.now() - flappy.pausedAt;
        flappy.pausedAt = 0;
      }
      flappy.lastFrame = performance.now();
    }
    renderFlappyStats();
    drawFlappy();
  }

  function flapBird() {
    if (!flappy.running || flappy.paused || flappy.countdown > 0) return;
    flappy.bird.vy = -7.2;
    flappy.bird.wing = 8;
    playToneAt(760, 0.035, "square", 0.035);
  }

  function spawnFlappyPipe(now) {
    const gap = Math.max(148, 190 - Math.min(34, flappy.score * 1.25));
    const margin = 92;
    const center = margin + gap / 2 + Math.random() * (720 - margin * 2 - gap);
    flappy.pipes.push({
      x: 560,
      width: 74,
      gapTop: center - gap / 2,
      gapBottom: center + gap / 2,
      scored: false
    });
    flappy.spawnAt = now + Math.max(1180, 1640 - Math.min(320, flappy.score * 13));
  }

  function tickFlappy() {
    if (!flappy.running || flappy.paused) return;
    const now = performance.now();
    const dt = Math.min(0.04, (now - flappy.lastFrame) / 1000 || 0.016);
    flappy.lastFrame = now;

    if (flappy.countdown > 0) {
      const elapsed = now - flappy.countdownStartedAt;
      flappy.countdown = Math.max(0, 3 - Math.floor(elapsed / 820));
      if (flappy.countdown === 0) {
        flappy.countdownStartedAt = 0;
        flappy.bird.vy = -4.6;
      }
      drawFlappy();
      return;
    }

    flappy.groundX = (flappy.groundX - 140 * dt) % 42;
    flappy.bird.vy += 18.5 * dt;
    flappy.bird.y += flappy.bird.vy;
    flappy.bird.rotation = Math.max(-0.42, Math.min(1.25, flappy.bird.vy / 9));
    flappy.bird.wing = Math.max(0, flappy.bird.wing - 1);

    if (now >= flappy.spawnAt) spawnFlappyPipe(now);
    const speed = 168 + Math.min(64, flappy.score * 3.6);
    flappy.pipes.forEach((pipe) => {
      pipe.x -= speed * dt;
      if (!pipe.scored && pipe.x + pipe.width < flappy.bird.x) {
        pipe.scored = true;
        flappy.score += 1;
        flappy.bestLive = Math.max(Number(state.stats.flappyBest) || 0, flappy.score);
        playTone("win");
        addFlappyBurst(flappy.bird.x, flappy.bird.y, "#ffd35a", 8);
      }
    });
    flappy.pipes = flappy.pipes.filter((pipe) => pipe.x + pipe.width > -30);
    flappy.particles.forEach((p) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= 1;
    });
    flappy.particles = flappy.particles.filter((p) => p.life > 0);

    if (flappyHit()) {
      addFlappyBurst(flappy.bird.x, flappy.bird.y, "#ff5275", 22);
      endFlappyRun("crash");
      return;
    }

    renderFlappyStats();
    drawFlappy();
  }

  function addFlappyBurst(x, y, color, count) {
    for (let i = 0; i < count; i += 1) {
      flappy.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 160,
        vy: (Math.random() - 0.5) * 160,
        life: 24,
        color
      });
    }
  }

  function flappyHit() {
    const bird = flappy.bird;
    if (bird.y - bird.r < 0 || bird.y + bird.r > 650) return true;
    return flappy.pipes.some((pipe) => {
      const withinX = bird.x + bird.r > pipe.x && bird.x - bird.r < pipe.x + pipe.width;
      if (!withinX) return false;
      return bird.y - bird.r < pipe.gapTop || bird.y + bird.r > pipe.gapBottom;
    });
  }

  function flappyRunMultiplier() {
    return 1 + Math.max(0, flappy.score - 1) * 0.16;
  }

  function calculateFlappyXp() {
    if (flappy.score <= 0) return 0;
    const base = flappy.score * 18;
    const streakBonus = Math.max(0, flappy.score - 3) * 7;
    const newBestBonus = flappy.score > state.stats.flappyBest && flappy.score >= 4 ? 55 : 0;
    return Math.round((base + streakBonus + newBestBonus) * flappyRunMultiplier());
  }

  function previewFlappyCoins(newBest = flappy.score > state.stats.flappyBest) {
    if (flappy.score <= 0) return 0;
    let earned = Math.floor(flappy.score * 4 + Math.max(0, flappy.score - 4) * 2);
    if (newBest) earned += 25;
    return applyRewardBooster(Math.max(1, earned));
  }

  function renderFlappyStats() {
    if (!el.flappyScore) return;
    const previousBest = Number(state.stats.flappyBest) || 0;
    const liveBest = Math.max(previousBest, flappy.score);
    el.flappyScore.textContent = formatNumber(flappy.score);
    el.flappyBest.textContent = formatNumber(liveBest);
    el.flappyStreak.textContent = flappy.score >= previousBest && previousBest > 0 ? "BEST" : formatNumber(flappy.score);
    el.flappyXpPreview.textContent = formatNumber(applyRewardBooster(calculateFlappyXp()));
    el.flappyCoinPreview.textContent = formatNumber(previewFlappyCoins());
    el.startFlappyBtn.textContent = flappy.running ? "End Game" : "Start Game";
    el.flappyPauseBtn.textContent = flappy.paused ? "Resume" : "Pause";
    el.flappyPauseBtn.disabled = !flappy.running || flappy.countdown > 0;
  }

  function drawFlappyPill(ctx, x, y, label, value, color) {
    ctx.save();
    ctx.fillStyle = "rgba(5, 3, 11, 0.72)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect?.(x, y, 144, 34, 12);
    if (!ctx.roundRect) {
      ctx.rect(x, y, 144, 34);
    }
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = "900 9px Arial";
    ctx.textAlign = "left";
    ctx.fillText(label, x + 12, y + 13);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 17px Arial";
    ctx.fillText(String(value), x + 12, y + 28);
    ctx.restore();
  }

  function drawFlappy() {
    if (!el.flappyCanvas) return;
    const ctx = el.flappyCanvas.getContext("2d");
    const w = el.flappyCanvas.width;
    const h = el.flappyCanvas.height;
    ctx.clearRect(0, 0, w, h);

    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#110529");
    sky.addColorStop(0.48, "#17336b");
    sky.addColorStop(1, "#080414");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(255,255,255,0.64)";
    for (let i = 0; i < 54; i += 1) {
      const x = (i * 83 + Math.abs(flappy.groundX) * (i % 3 + 1)) % w;
      const y = (i * 47) % 520;
      ctx.fillRect(x, y, i % 4 === 0 ? 2 : 1, i % 4 === 0 ? 2 : 1);
    }

    flappy.pipes.forEach((pipe) => {
      const grd = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
      grd.addColorStop(0, "#57ff9a");
      grd.addColorStop(0.55, "#49f4ff");
      grd.addColorStop(1, "#b071ff");
      ctx.fillStyle = grd;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#49f4ff";
      ctx.fillRect(pipe.x, 0, pipe.width, pipe.gapTop);
      ctx.fillRect(pipe.x, pipe.gapBottom, pipe.width, 650 - pipe.gapBottom);
      ctx.fillStyle = "rgba(5,3,11,0.42)";
      ctx.fillRect(pipe.x + 9, 0, 8, pipe.gapTop);
      ctx.fillRect(pipe.x + 9, pipe.gapBottom, 8, 650 - pipe.gapBottom);
      ctx.shadowBlur = 0;
    });

    ctx.fillStyle = "rgba(255, 211, 90, 0.22)";
    for (let x = flappy.groundX; x < w + 42; x += 42) {
      ctx.fillRect(x, 650, 22, 70);
    }
    ctx.fillStyle = "rgba(5, 3, 11, 0.78)";
    ctx.fillRect(0, 650, w, 70);
    ctx.strokeStyle = "#ffd35a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 650);
    ctx.lineTo(w, 650);
    ctx.stroke();

    flappy.particles.forEach((p) => {
      ctx.globalAlpha = Math.max(0, p.life / 24);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 4, 4);
    });
    ctx.globalAlpha = 1;

    const bird = flappy.bird;
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.rotation);
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#ffd35a";
    ctx.fillStyle = "#ffd35a";
    ctx.beginPath();
    ctx.ellipse(0, 0, 23, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ff2fad";
    ctx.beginPath();
    ctx.ellipse(-8, bird.wing > 0 ? 7 : 2, 11, 7, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(9, -6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#05030b";
    ctx.beginPath();
    ctx.arc(10, -6, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ff8a3d";
    ctx.beginPath();
    ctx.moveTo(20, -2);
    ctx.lineTo(34, 3);
    ctx.lineTo(20, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    const previousBest = Number(state.stats.flappyBest) || 0;
    const liveBest = Math.max(previousBest, flappy.score);
    drawFlappyPill(ctx, 14, 14, "BEST", formatNumber(liveBest), flappy.score > previousBest ? "#ffd35a" : "#49f4ff");
    if (flappy.score <= previousBest) {
      drawFlappyPill(ctx, w - 158, 14, "PIPES", formatNumber(flappy.score), "#57ff9a");
    }

    if (flappy.countdown > 0) {
      ctx.fillStyle = "rgba(5, 3, 11, 0.46)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#ffd35a";
      ctx.shadowBlur = 22;
      ctx.shadowColor = "#ffd35a";
      ctx.font = "900 104px ByteBounce, Arial Black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(flappy.countdown), w / 2, h / 2);
      ctx.textBaseline = "alphabetic";
      ctx.shadowBlur = 0;
    }

    if (flappy.paused) {
      ctx.fillStyle = "rgba(5, 3, 11, 0.64)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 46px Arial Black";
      ctx.textAlign = "center";
      ctx.fillText("PAUSED", w / 2, h / 2);
    }

    if (!flappy.running) {
      ctx.fillStyle = "rgba(5, 3, 11, 0.42)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 24px Arial Black";
      ctx.textAlign = "center";
      ctx.fillText("PRESS START", w / 2, h / 2);
    }
  }

  function endFlappyRun(reason = "crash") {
    if (!flappy.running) return;
    stopFlappy(false);
    if (reason === "manual") playTone("tap");
    else playGameOverSound();
    stopGameTheme(reason === "crash" ? "death" : "stop");

    const previousBest = Number(state.stats.flappyBest) || 0;
    const newBest = flappy.score > previousBest;
    const oldAchievements = new Set(state.achievements);
    const boosterUsed = getEquippedBoosterItem();
    const earned = applyRewardBooster(calculateFlappyXp());
    const coinsEarned = previewFlappyCoins(newBest);

    state.stats.gamesPlayed += 1;
    state.stats.flappyRuns += 1;
    state.stats.flappyTotalScore += flappy.score;
    state.stats.flappyBest = Math.max(previousBest, flappy.score);

    if (boosterUsed) {
      state.boosterCooldowns[boosterUsed.boost] = Date.now() + 10 * 60 * 1000;
      state.equippedBooster = null;
      state.boosterUses += 1;
      if (!state.boosterLevelTarget || state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
      showToast("Booster Used", `${boosterUsed.title} applied. Cooldown started.`, "win");
    }

    state.xp += earned;
    state.stats.flappyXpEarned += earned;
    state.coins += coinsEarned;
    state.level = deriveLevel(state.xp);
    unlockEarnedAchievements();
    if (boosterUsed && state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
    saveState();
    renderAll();

    const newAchievements = achievements.filter((item) => !oldAchievements.has(item.id) && state.achievements.includes(item.id));
    currentGame = "flappy";
    if (newBest) showToast("New High Score", `Flappy Bird best is now ${formatNumber(flappy.score)} pipes.`, "win");
    showToast("XP Earned", `+${formatNumber(earned)} XP.`, "win");
    showToast("Coins Earned", `+${formatNumber(coinsEarned)} coins.`, "win");
    el.resultScore.textContent = formatNumber(flappy.score);
    el.resultXp.textContent = formatNumber(earned);
    el.resultCoins.textContent = formatNumber(coinsEarned);
    el.resultBest.textContent = `${formatNumber(state.stats.flappyBest)} Pipes`;
    el.newBestBadge.classList.toggle("hidden", !newBest);
    el.resultAchievements.innerHTML = newAchievements.map((item) => `<span>${item.title}</span>`).join("");
    el.resultMessage.textContent = newBest
      ? "New pipe record. Keep the bird flying."
      : reason === "manual"
        ? "Flight ended. Your pipes have been saved."
        : "Flight complete. Retry and thread more pipes.";
    el.gameOverModal.classList.remove("hidden");
  }

  function createCrossyState() {
    return {
      running: false,
      paused: false,
      dying: false,
      deathStartedAt: 0,
      deathModalTimer: null,
      score: 0,
      depth: 0,
      pressureDepth: -4,
      section: 0,
      bestLive: 0,
      player: { col: 4, row: 9, x: 270, y: 612, targetX: 270, targetY: 612, size: 34 },
      cars: [],
      lanes: [],
      decor: [],
      particles: [],
      lastFrame: 0,
      startedAt: 0,
      pausedAt: 0,
      pausedMs: 0
    };
  }

  function openCrossy() {
    currentGame = "crossy";
    prepareGameTheme();
    showScreen("crossy");
    resetCrossy();
  }

  function resetCrossy() {
    stopCrossy(false);
    crossy = createCrossyState();
    seedCrossyLanes();
    renderCrossyStats();
    drawCrossy();
  }

  function seedCrossyLanes() {
    const speedBoost = Math.min(70, crossy.section * 10);
    const laneData = [
      { type: "grass" },
      { type: "road", speed: -128 - speedBoost, color: "#d94b45", count: 2, vehicle: "car" },
      { type: "road", speed: 142 + speedBoost, color: "#d7cf48", count: 2, vehicle: "car" },
      { type: "forest" },
      { type: "road", speed: -176 - speedBoost, color: "#78b14b", count: 3, vehicle: "truck" },
      { type: "road", speed: 164 + speedBoost, color: "#4fb5ff", count: 2, vehicle: "car" },
      { type: "grass" },
      { type: "road", speed: -208 - speedBoost, color: "#ff8a35", count: 3, vehicle: "truck" },
      { type: "road", speed: 188 + speedBoost, color: "#c46cff", count: 2, vehicle: "car" },
      { type: "grass" }
    ];
    crossy.lanes = laneData;
    crossy.cars = [];
    crossy.decor = [];
    laneData.forEach((lane, row) => {
      if (lane.type !== "road") return;
      const spacing = 540 / lane.count;
      for (let i = 0; i < lane.count; i += 1) {
        crossy.cars.push({
          row,
          x: (i * spacing + Math.random() * 90) % 620 - 40,
          width: lane.vehicle === "truck" ? 104 + Math.random() * 18 : 64 + Math.random() * 18,
          speed: lane.speed,
          color: lane.color,
          vehicle: lane.vehicle
        });
      }
    });
    laneData.forEach((lane, row) => {
      if (!["grass", "forest"].includes(lane.type)) return;
      const blocked = row === crossy.player.row ? [crossy.player.col] : [];
      const count = lane.type === "forest" ? 5 : 3;
      for (let i = 0; i < count; i += 1) {
        const col = Math.floor(Math.random() * 9);
        if (blocked.includes(col) || (row === 9 && Math.abs(col - 4) <= 1)) continue;
        crossy.decor.push({
          row,
          col,
          kind: i % 3 === 0 ? "rock" : "tree",
          scale: 0.86 + Math.random() * 0.28
        });
      }
    });
  }

  function startCrossy() {
    resetCrossy();
    crossy.running = true;
    crossy.startedAt = Date.now();
    crossy.lastFrame = performance.now();
    playTone("tap");
    playGameTheme("crossy", { restart: true, volume: 0.4 });
    crossyTimer = setInterval(tickCrossy, CROSSY_TICK_MS);
    renderCrossyStats();
  }

  function restartCrossy() {
    startCrossy();
  }

  function stopCrossy(render = true) {
    if (crossyTimer) {
      clearInterval(crossyTimer);
      crossyTimer = null;
    }
    if (crossy.deathModalTimer) {
      clearTimeout(crossy.deathModalTimer);
      crossy.deathModalTimer = null;
    }
    if (crossyCrashAudio && !render) {
      crossyCrashAudio.pause();
      crossyCrashAudio.currentTime = 0;
    }
    if (crossy.paused && crossy.pausedAt) {
      crossy.pausedMs += Date.now() - crossy.pausedAt;
      crossy.pausedAt = 0;
    }
    crossy.running = false;
    crossy.paused = false;
    if (render) {
      renderCrossyStats();
      drawCrossy();
    }
  }

  function handlePrimaryCrossyAction() {
    if (crossy.running) {
      endCrossyRun("manual");
      return;
    }
    startCrossy();
  }

  function toggleCrossyPause() {
    if (!crossy.running || crossy.dying) return;
    crossy.paused = !crossy.paused;
    if (crossy.paused) {
      crossy.pausedAt = Date.now();
    } else {
      if (crossy.pausedAt) {
        crossy.pausedMs += Date.now() - crossy.pausedAt;
        crossy.pausedAt = 0;
      }
      crossy.lastFrame = performance.now();
    }
    renderCrossyStats();
    drawCrossy();
  }

  function moveCrossy(direction) {
    if (!crossy.running || crossy.paused || crossy.dying) return;
    const player = crossy.player;
    const next = { col: player.col, row: player.row };
    if (direction === "up") next.row -= 1;
    if (direction === "down") next.row += 1;
    if (direction === "left") next.col -= 1;
    if (direction === "right") next.col += 1;
    next.col = Math.max(0, Math.min(8, next.col));
    next.row = Math.max(0, Math.min(9, next.row));
    if (next.col === player.col && next.row === player.row) return;
    if (isCrossyBlocked(next.row, next.col)) {
      playTone("tap");
      return;
    }
    player.col = next.col;
    player.row = next.row;
    player.targetX = 30 + player.col * 60;
    player.targetY = 54 + player.row * 66;
    if (direction === "up") {
      crossy.depth += 1;
      crossy.score = Math.max(crossy.score, crossy.depth);
      crossy.bestLive = Math.max(Number(state.stats.crossyBest) || 0, crossy.score);
      playTone("eat");
      if (player.row <= 1) {
        crossy.section += 1;
        player.row = 6;
        player.y = 54 + player.row * 66;
        player.targetY = 54 + player.row * 66;
        seedCrossyLanes();
      }
    }
    if (direction === "down") crossy.depth = Math.max(0, crossy.depth - 1);
    renderCrossyStats();
  }

  function tickCrossy() {
    if (!crossy.running || crossy.paused) return;
    const now = performance.now();
    const dt = Math.min(0.04, (now - crossy.lastFrame) / 1000 || 0.016);
    crossy.lastFrame = now;

    crossy.cars.forEach((car) => {
      car.x += car.speed * dt;
      if (car.speed > 0 && car.x > 590) car.x = -car.width - 60;
      if (car.speed < 0 && car.x + car.width < -50) car.x = 590 + Math.random() * 80;
    });
    const pressureRate = Math.min(0.42, 0.2 + crossy.section * 0.025);
    crossy.pressureDepth += pressureRate * dt;
    const p = crossy.player;
    p.x += (p.targetX - p.x) * Math.min(1, dt * 16);
    p.y += (p.targetY - p.y) * Math.min(1, dt * 16);
    crossy.particles.forEach((part) => {
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      part.life -= 1;
    });
    crossy.particles = crossy.particles.filter((part) => part.life > 0);

    if (!crossy.dying && (crossyHit() || crossyPressureCaught())) {
      triggerCrossyDeath();
      return;
    }

    renderCrossyStats();
    drawCrossy();
  }

  function crossyHit() {
    const p = crossy.player;
    return crossy.cars.some((car) => {
      if (car.row !== p.row) return false;
      const carLeft = car.x;
      const carRight = car.x + car.width;
      const carTop = 54 + car.row * 66 - 24;
      const carBottom = carTop + 48;
      return p.x + p.size * 0.42 > carLeft
        && p.x - p.size * 0.42 < carRight
        && p.y + p.size * 0.42 > carTop
        && p.y - p.size * 0.42 < carBottom;
    });
  }

  function isCrossyBlocked(row, col) {
    return crossy.decor.some((item) => item.row === row && item.col === col);
  }

  function crossyPressureCaught() {
    return crossy.pressureDepth >= crossy.depth - 0.12;
  }

  function addCrossyCrashBurst(x, y) {
    for (let i = 0; i < 28; i += 1) {
      crossy.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 220,
        vy: (Math.random() - 0.5) * 220,
        life: 30,
        color: i % 2 ? "#ff5275" : "#ffd35a"
      });
    }
  }

  async function playCrossyCrashSound(onDone) {
    if (state.muteSfx) {
      onDone?.();
      return;
    }
    try {
      if (!crossyCrashAudio) {
        crossyCrashAudio = new Audio(CROSSY_CRASH_SFX);
        crossyCrashAudio.preload = "auto";
      }
      crossyCrashAudio.pause();
      crossyCrashAudio.currentTime = 0;
      crossyCrashAudio.volume = 0.86;
      crossyCrashAudio.onended = () => onDone?.();
      await crossyCrashAudio.play();
    } catch {
      playGameOverSound();
      setTimeout(() => onDone?.(), 1600);
    }
  }

  function triggerCrossyDeath() {
    crossy.dying = true;
    crossy.deathStartedAt = performance.now();
    addCrossyCrashBurst(crossy.player.x, crossy.player.y);
    stopGameTheme("death");
    const finishDeath = () => {
      if (!crossy.running || !crossy.dying) return;
      endCrossyRun("crash");
    };
    playCrossyCrashSound(finishDeath);
    drawCrossy();
    crossy.deathModalTimer = setTimeout(finishDeath, 3200);
  }

  function crossyRunMultiplier() {
    return 1 + Math.max(0, crossy.score - 1) * 0.14;
  }

  function calculateCrossyXp() {
    if (crossy.score <= 0) return 0;
    const base = crossy.score * 17;
    const streakBonus = Math.max(0, crossy.score - 4) * 8;
    const newBestBonus = crossy.score > state.stats.crossyBest && crossy.score >= 5 ? 60 : 0;
    return Math.round((base + streakBonus + newBestBonus) * crossyRunMultiplier());
  }

  function previewCrossyCoins(newBest = crossy.score > state.stats.crossyBest) {
    if (crossy.score <= 0) return 0;
    let earned = Math.floor(crossy.score * 4 + Math.max(0, crossy.score - 5) * 2);
    if (newBest) earned += 25;
    return applyRewardBooster(Math.max(1, earned));
  }

  function renderCrossyStats() {
    if (!el.crossyScore) return;
    const previousBest = Number(state.stats.crossyBest) || 0;
    const liveBest = Math.max(previousBest, crossy.score);
    el.crossyScore.textContent = formatNumber(crossy.score);
    el.crossyBest.textContent = formatNumber(liveBest);
    el.crossyStreak.textContent = crossy.score > previousBest && previousBest > 0 ? "BEST" : formatNumber(crossy.score);
    el.crossyXpPreview.textContent = formatNumber(applyRewardBooster(calculateCrossyXp()));
    el.crossyCoinPreview.textContent = formatNumber(previewCrossyCoins());
    el.startCrossyBtn.textContent = crossy.running ? "End Game" : "Start Game";
    el.crossyPauseBtn.textContent = crossy.paused ? "Resume" : "Pause";
    el.crossyPauseBtn.disabled = !crossy.running || crossy.dying;
  }

  function drawCrossyPill(ctx, x, y, label, value, color) {
    ctx.save();
    ctx.fillStyle = "rgba(5, 3, 11, 0.74)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, 146, 34, 12);
    else ctx.rect(x, y, 146, 34);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = "900 9px Arial";
    ctx.textAlign = "left";
    ctx.fillText(label, x + 12, y + 13);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 17px ByteBounce, Arial Black";
    ctx.fillText(String(value), x + 12, y + 28);
    ctx.restore();
  }

  function drawCrossyBlock(ctx, x, y, w, h, depth, color, side = "rgba(0, 0, 0, 0.22)") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y - depth, w, h);
    ctx.fillStyle = side;
    ctx.fillRect(x, y + h - depth, w, depth);
    ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
    ctx.fillRect(x + 3, y - depth + 3, Math.max(0, w - 6), 4);
  }

  function drawCrossyTree(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    drawCrossyBlock(ctx, -7, -5, 14, 22, 4, "#7a4a26", "rgba(60, 28, 12, 0.55)");
    drawCrossyBlock(ctx, -20, -34, 40, 30, 7, "#239d55", "rgba(13, 90, 45, 0.66)");
    drawCrossyBlock(ctx, -14, -53, 28, 25, 6, "#36c56d", "rgba(13, 90, 45, 0.5)");
    ctx.restore();
  }

  function drawCrossyRock(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    drawCrossyBlock(ctx, -15, -13, 30, 18, 5, "#b6c2cf", "rgba(54, 64, 82, 0.48)");
    ctx.restore();
  }

  function drawCrossyVehicle(ctx, car) {
    const y = 54 + car.row * 66;
    const isTruck = car.vehicle === "truck";
    const bodyH = isTruck ? 38 : 34;
    ctx.save();
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(0, 0, 0, 0.38)";
    drawCrossyBlock(ctx, car.x, y - bodyH / 2 + 7, car.width, bodyH, 9, car.color, "rgba(0, 0, 0, 0.32)");
    if (isTruck) {
      const cabX = car.speed > 0 ? car.x + car.width - 34 : car.x + 8;
      drawCrossyBlock(ctx, cabX, y - 21, 28, 32, 8, "#d9ecff", "rgba(39, 61, 88, 0.45)");
    } else {
      drawCrossyBlock(ctx, car.x + car.width * 0.36, y - 24, 28, 24, 7, "#d9ecff", "rgba(39, 61, 88, 0.45)");
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#20232d";
    ctx.fillRect(car.x + 10, y + 14, 18, 8);
    ctx.fillRect(car.x + car.width - 28, y + 14, 18, 8);
    ctx.fillStyle = "#fff7b8";
    const lightX = car.speed > 0 ? car.x + car.width - 6 : car.x + 2;
    ctx.fillRect(lightX, y - 10, 5, 7);
    ctx.fillRect(lightX, y + 5, 5, 7);
    ctx.restore();
  }

  function drawCrossyPlayer(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.shadowBlur = 14;
    ctx.shadowColor = "#ffffff";
    drawCrossyBlock(ctx, -16, -16, 32, 32, 8, "#f7f4df", "rgba(188, 180, 145, 0.58)");
    drawCrossyBlock(ctx, -11, -35, 22, 20, 6, "#fff7d8", "rgba(188, 180, 145, 0.5)");
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ff6f2f";
    ctx.fillRect(-5, -43, 10, 8);
    ctx.fillStyle = "#111827";
    ctx.fillRect(-7, -28, 4, 4);
    ctx.fillRect(5, -28, 4, 4);
    ctx.fillStyle = "#ffd35a";
    ctx.fillRect(-5, -22, 10, 5);
    ctx.restore();
  }

  function drawCrossy() {
    if (!el.crossyCanvas) return;
    const ctx = el.crossyCanvas.getContext("2d");
    const w = el.crossyCanvas.width;
    const h = el.crossyCanvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "#6ecf52";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (let x = -40; x < w; x += 54) {
      ctx.fillRect(x, 0, 3, h);
    }
    crossy.lanes.forEach((lane, row) => {
      const y = 22 + row * 66;
      if (lane.type === "road") {
        ctx.fillStyle = row % 2 ? "#5f6475" : "#555b6b";
        ctx.fillRect(0, y, w, 66);
        ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
        ctx.fillRect(0, y + 58, w, 8);
        ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
        for (let x = 10; x < w; x += 58) {
          ctx.fillRect(x, y + 31, 28, 5);
        }
      } else {
        ctx.fillStyle = lane.type === "forest" ? "#5aba49" : "#76d65e";
        ctx.fillRect(0, y, w, 66);
        ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
        ctx.fillRect(0, y + 58, w, 8);
        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        for (let x = 0; x < w; x += 34) {
          ctx.fillRect(x + (row % 2 ? 16 : 0), y + 12, 12, 4);
        }
      }
    });

    crossy.decor.forEach((item) => {
      const x = 30 + item.col * 60;
      const y = 54 + item.row * 66 + 16;
      if (item.kind === "rock") drawCrossyRock(ctx, x, y, item.scale);
      else drawCrossyTree(ctx, x, y, item.scale);
    });

    crossy.cars.forEach((car) => drawCrossyVehicle(ctx, car));

    const pressureGap = Math.max(-0.2, crossy.depth - crossy.pressureDepth);
    const dangerY = crossy.player.targetY + pressureGap * 66 + 34;
    if (dangerY < h + 36) {
      const alpha = Math.max(0.18, Math.min(0.78, 1 - (dangerY - crossy.player.targetY) / 360));
      const gradient = ctx.createLinearGradient(0, dangerY - 44, 0, h);
      gradient.addColorStop(0, `rgba(255, 82, 117, ${alpha * 0.08})`);
      gradient.addColorStop(0.26, `rgba(255, 82, 117, ${alpha * 0.32})`);
      gradient.addColorStop(1, `rgba(5, 3, 11, ${alpha})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, Math.max(0, dangerY - 44), w, h);
      ctx.fillStyle = `rgba(255, 82, 117, ${Math.min(0.92, alpha + 0.1)})`;
      ctx.fillRect(0, dangerY, w, 5);
      ctx.fillStyle = `rgba(255, 211, 90, ${Math.min(0.68, alpha)})`;
      for (let x = 0; x < w; x += 34) {
        ctx.fillRect(x, dangerY + 9, 18, 3);
      }
    }

    crossy.particles.forEach((p) => {
      ctx.globalAlpha = Math.max(0, p.life / 30);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 4, 4);
    });
    ctx.globalAlpha = 1;

    drawCrossyPlayer(ctx, crossy.player);

    const previousBest = Number(state.stats.crossyBest) || 0;
    const liveBest = Math.max(previousBest, crossy.score);
    drawCrossyPill(ctx, 14, 14, "BEST", formatNumber(liveBest), crossy.score > previousBest ? "#ffd35a" : "#49f4ff");
    if (crossy.score <= previousBest) {
      drawCrossyPill(ctx, w - 160, 14, "SCORE", formatNumber(crossy.score), "#57ff9a");
    }

    if (crossy.paused) {
      ctx.fillStyle = "rgba(5, 3, 11, 0.64)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 46px Arial Black";
      ctx.textAlign = "center";
      ctx.fillText("PAUSED", w / 2, h / 2);
    }

    if (crossy.dying) {
      const pct = Math.min(1, (performance.now() - crossy.deathStartedAt) / 360);
      ctx.fillStyle = `rgba(0, 0, 0, ${0.2 + pct * 0.8})`;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#ff5275";
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#ff5275";
      ctx.font = "900 52px ByteBounce, Arial Black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("YOU DIED", w / 2, h / 2);
      ctx.textBaseline = "alphabetic";
      ctx.shadowBlur = 0;
    }

    if (!crossy.running) {
      ctx.fillStyle = "rgba(5, 3, 11, 0.42)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 24px Arial Black";
      ctx.textAlign = "center";
      ctx.fillText("PRESS START", w / 2, h / 2);
    }
  }

  function endCrossyRun(reason = "crash") {
    if (!crossy.running) return;
    const wasCrash = reason === "crash";
    const previousBest = Number(state.stats.crossyBest) || 0;
    const newBest = crossy.score > previousBest;
    const oldAchievements = new Set(state.achievements);
    const boosterUsed = getEquippedBoosterItem();
    const earned = applyRewardBooster(calculateCrossyXp());
    const coinsEarned = previewCrossyCoins(newBest);
    stopCrossy(false);
    if (!wasCrash) {
      playTone("tap");
      stopGameTheme("stop");
    }

    state.stats.gamesPlayed += 1;
    state.stats.crossyRuns += 1;
    state.stats.crossyTotalScore += crossy.score;
    state.stats.crossyBest = Math.max(previousBest, crossy.score);

    if (boosterUsed) {
      state.boosterCooldowns[boosterUsed.boost] = Date.now() + 10 * 60 * 1000;
      state.equippedBooster = null;
      state.boosterUses += 1;
      if (!state.boosterLevelTarget || state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
      showToast("Booster Used", `${boosterUsed.title} applied. Cooldown started.`, "win");
    }

    state.xp += earned;
    state.stats.crossyXpEarned += earned;
    state.coins += coinsEarned;
    state.level = deriveLevel(state.xp);
    unlockEarnedAchievements();
    if (boosterUsed && state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
    saveState();
    renderAll();

    const newAchievements = achievements.filter((item) => !oldAchievements.has(item.id) && state.achievements.includes(item.id));
    currentGame = "crossy";
    if (newBest) showToast("New High Score", `Crossy Road best is now ${formatNumber(crossy.score)}.`, "win");
    showToast("XP Earned", `+${formatNumber(earned)} XP.`, "win");
    showToast("Coins Earned", `+${formatNumber(coinsEarned)} coins.`, "win");
    el.resultScore.textContent = formatNumber(crossy.score);
    el.resultXp.textContent = formatNumber(earned);
    el.resultCoins.textContent = formatNumber(coinsEarned);
    el.resultBest.textContent = formatNumber(state.stats.crossyBest);
    el.newBestBadge.classList.toggle("hidden", !newBest);
    el.resultAchievements.innerHTML = newAchievements.map((item) => `<span>${item.title}</span>`).join("");
    el.resultMessage.textContent = newBest
      ? "New street record. Keep dodging traffic."
      : wasCrash
        ? "Crash logged. Retry and cross farther."
        : "Run ended. Your crossing score has been saved.";
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
      ["flappy_first", state.stats.flappyRuns >= 1],
      ["flappy_10", state.stats.flappyBest >= 10],
      ["crossy_first", state.stats.crossyRuns >= 1],
      ["crossy_10", state.stats.crossyBest >= 10],
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
      } else if (currentGame === "flappy") {
        startFlappy();
      } else if (currentGame === "crossy") {
        startCrossy();
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
    el.exitFlappyBtn.addEventListener("click", () => showScreen("home"));
    el.flappyPauseBtn.addEventListener("click", toggleFlappyPause);
    el.startFlappyBtn.addEventListener("click", handlePrimaryFlappyAction);
    el.restartFlappyBtn.addEventListener("click", restartFlappy);
    el.exitCrossyBtn.addEventListener("click", () => showScreen("home"));
    el.crossyPauseBtn.addEventListener("click", toggleCrossyPause);
    el.startCrossyBtn.addEventListener("click", handlePrimaryCrossyAction);
    el.restartCrossyBtn.addEventListener("click", restartCrossy);
    el.flappyCanvas.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      flapBird();
    });
    el.crossyCanvas.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      crossyTouchStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
      el.crossyCanvas.setPointerCapture?.(event.pointerId);
    });
    el.crossyCanvas.addEventListener("pointerup", (event) => {
      event.preventDefault();
      if (!crossyTouchStart || crossyTouchStart.pointerId !== event.pointerId) return;
      const dx = event.clientX - crossyTouchStart.x;
      const dy = event.clientY - crossyTouchStart.y;
      crossyTouchStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) {
        moveCrossy("up");
        return;
      }
      moveCrossy(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
    });
    el.crossyCanvas.addEventListener("pointercancel", (event) => {
      event.preventDefault();
      crossyTouchStart = null;
    });
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
    el.starBoosterBtn?.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      activateStarMachineGun();
    });
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
      if (keyMap[event.key] && currentScreen === "crossy") {
        event.preventDefault();
        moveCrossy(keyMap[event.key]);
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
      if ([" ", "ArrowUp", "w", "W"].includes(event.key) && currentScreen === "flappy") {
        event.preventDefault();
        if (!flappy.running) startFlappy();
        else flapBird();
      }
      if (event.key === " " && currentScreen === "crossy") {
        event.preventDefault();
        if (!crossy.running) startCrossy();
        else moveCrossy("up");
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
