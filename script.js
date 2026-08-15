(() => {
  "use strict";

  const STORAGE_KEY = "arcadia_player_v1";
  const VERSION_KEY = "arcadia_app_version";
  const APP_VERSION = "19.16.1.0";
  const VERSION_URL = "app-version.json";
  const DEV_ACCESS_CODE = "80sarcadia";
  const PATCH_NOTES = [
    "Inferno Red, Violet Pulse, Hologram, and Black Hole Store previews now visibly fire across the full showcase instead of sticking near the launcher edge.",
    "Star Invaders adds twelve collectible beams spanning frosted, inferno, toxic, pulse, plasma, solar, cryo, luxury, and ultra flex tiers.",
    "New beam cosmetics now animate in flight and on impact with embers, vapor, electric coils, ice shards, gold etching, gravity distortion, holograms, supernova bursts, and black-hole particle collapse.",
    "Crossy Road adds fourteen purchasable characters, from Fox, Duck, and Penguin through the level-110 Chrono Dragon flex skin.",
    "Premium Crossy characters now bring their Store designs into gameplay with animated materials, accessories, hop particles, holograms, landing bursts, shadow trails, and time ripples.",
    "Snake Store previews now face forward, and the Cowboy Snake preview spins its complete hat instead of moving only the brim.",
    "Casper now shares Snake's tail-vacate collision rule and favors routes with a reachable tail and safe next move.",
    "Reactive Snake milestones are rebalanced by rarity, with Cyber and Obsidian at 10 pellets, Quantum and Void at 12, and a flashing Void body outline.",
    "The Snake collection adds ten high-level character, milestone, evolution, and luxury skins with faces and reactive pellet effects.",
    "Star Invaders laser previews now fire cleanly from the bottom of each Store showcase without displaying a spaceship.",
    "The Rewards Store now previews every nameplate, Star Invaders laser, and booster with compact animated artwork while keeping complete item descriptions readable.",
    "Blackstorm no longer stretches the Player Profile or disrupts the notification bell and unread badge layout.",
    "The Rewards Store adds the level-75 Blackstorm Nameplate with moving black clouds, a circling lightning border, and intermittent lightning flashes.",
    "The notification bell now inherits the equipped player nameplate's background, border, glow, and animated RGB or Redline effects.",
    "A new notification bell opens a scrollable player inbox with unread activity, detailed multi-level progress, and update history with version notes.",
    "The Rewards Store adds Galaxy Frog, a level-65 Crossy Road character with a living starfield that counter-moves as the frog crosses each lane.",
    "Dev Mode adds Casper, an eight-game autopilot that plays through normal mechanics with predictive strategies while locking only direct gameplay input.",
    "Fruit Blend now uses a streamlined 10-fruit chain, removing Peach and Dragon Fruit so Watermelon and maximum-fruit clears are more achievable before the container fills.",
    "Tombstone now resurrects Crossy Road runners after a traffic hit and ghost-rescues players caught by the rising danger edge to a safe center island.",
    "The Rewards Store adds Skips, a purchasable white, blue-eyed cat character for Crossy Road.",
    "Solitaire now deals solver-verified winnable Draw-1 games, automatically flips newly exposed tableau cards, validates card integrity, and gives complete legal-move and stock-aware hints.",
    "Fruit Blend restores its lively one-pass motion with spin-driven rolling, while sleep is limited to the floor and genuinely cradled fruit.",
    "Crossy Road terrain generation now protects a connected route through every island so trees and rocks can challenge the player without creating impossible dead ends.",
    "Fruit Blend scoring now rewards every merge on a steep fruit-size ladder, adds visible point popups, and grants a massive escalating bonus for clearing maximum fruit.",
    "Crossy Road now travels through continuously generated lanes with seamless off-screen recycling instead of teleporting the player back to the middle.",
    "Crossy Road adds a smooth forward-moving camera and bottom danger edge that ends the run when the player falls behind.",
    "Fruit Blend stacked fruit now settles into a stable sleep state, preventing compressed bottom fruit from shaking or spinning in place.",
    "Rewards Store adds horizontal game and ownership filter chips, useful item sorting, compact cards, and an internally scrolling results area.",
    "Tombstone now uses the same clean text-only Rewards Store presentation as ARCADIA's other boosters.",
    "Player Profile now shows three locked-first Achievements and the top three Leaderboard entries at a time, with the complete lists available through compact panel scrolling.",
    "The Rewards Store adds Tombstone, a reusable Snake resurrection booster that rebounds fatal wall crashes or activates one ghost pass through the snake's body before entering cooldown.",
    "Snake's Start Game and Restart controls now use the same responsive mobile layout and normal button height as ARCADIA's other games.",
    "Snake's compact Score and High Score cards use single-line labels matching Block Grid and appear only after Start Game.",
    "Snake's stage HUD is simplified to Score on the left and High Score on the right, with Streak removed from view.",
    "Snake's High Score now stays in the stage HUD above the board instead of covering playable canvas space.",
    "Block Grid now reveals a compact live score rail when a run starts, with Score on the left and High Score on the right.",
    "Fruit Blend's strawberry now has a tapered berry silhouette, leafy crown, and visible seeds.",
    "Fruit Blend's Next card now shows the upcoming fruit name beneath its preview.",
    "The Player Store adds six permanent Snake color skins, including an animated Rainbow Snake unlocked at level 35.",
    "Block Grid adds the Earthquake booster: it clears and scores every placed block once during the opening 15-45 seconds, then rearms after every five skill-cleared lines.",
    "Fruit Blend now uses its dedicated neon fruit-merging artwork on the ARCADIA dashboard.",
    "Fruit Blend overflow now ends decisively after the dropped-fruit entry grace period and opens the shared Retry and Dashboard results without a flickering warning.",
    "Fruit Blend bananas now use a curved compound collider, while stronger settling and pineapple spin damping keep fruit stacks natural.",
    "Fruit Blend adds a crescent-shaped banana and expands direct drops through banana and pineapple with mixed weighted sizes.",
    "Fruit Blend high scores now center on clearing paired maximum fruits for large escalating bonuses instead of ordinary merges alone.",
    "Fruit Blend pineapple upgraded with a tall pineapple silhouette, diamond rind texture, and full leafy crown.",
    "Fruit Blend fruit sizes increased across all 11 tiers and the five droppable tiers are now balanced so space management begins sooner.",
    "Fruit Blend added as Game 08 with physics-based drops, 11 fruit tiers, chain merging, danger-line overflow, rewards, and achievements.",
    "Fruit Blend includes two rotating soundtracks that switch automatically without repeating the previous song.",
    "Block Grid invalid drops now keep dragged pieces visible and outline only conflicting placed blocks in red.",
    "Stack now keeps its vertical mobile controls at the same compact width as the other two-button games.",
    "Stack and Solitaire bottom controls now use the same stacked mobile button layout as Snake, Block Grid, and Star Invaders.",
    "Solitaire soundtrack selection now prevents the same song from playing on consecutive runs or restarts.",
    "Solitaire now keeps all four action buttons together at the bottom of the game.",
    "Solitaire action buttons now keep Start and Restart together, with matching Undo and Hint controls, and use the new player-provided game icon.",
    "Klondike Solitaire added as Game 07 with touch card controls, Undo, Hint, rewards, achievements, and two random soundtracks.",
    "The dashboard now scrolls to the player header only when a pending level-up animation is about to play.",
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
  const CROSSY_LANE_HEIGHT = 66;
  const CROSSY_START_Y = 620;
  const CROSSY_CAMERA_LOCK_Y = 320;
  const FRUIT_TICK_MS = 1000 / 60;
  const SOLITAIRE_SUITS = [
    { id: "hearts", symbol: "♥", color: "red" },
    { id: "diamonds", symbol: "♦", color: "red" },
    { id: "clubs", symbol: "♣", color: "black" },
    { id: "spades", symbol: "♠", color: "black" }
  ];
  const SOLITAIRE_RANKS = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const FRUIT_TYPES = [
    { name: "Cherry", radius: 17, color: "#ff3f75", accent: "#ffb3ca", points: 3 },
    { name: "Strawberry", radius: 22, color: "#ff416c", accent: "#ffd35a", points: 10 },
    { name: "Grape", radius: 28, color: "#8b5cff", accent: "#d7b5ff", points: 25 },
    { name: "Tangerine", radius: 35, color: "#ff8a3d", accent: "#ffd35a", points: 50 },
    { name: "Apple", radius: 43, color: "#78df52", accent: "#d9ff8c", points: 90 },
    { name: "Pear", radius: 52, color: "#cbe944", accent: "#f3ff9a", points: 150 },
    { name: "Banana", radius: 70, color: "#ffe14c", accent: "#fff6a0", points: 380 },
    { name: "Pineapple", radius: 79, color: "#ffc83d", accent: "#fff19a", points: 600 },
    { name: "Coconut", radius: 89, color: "#7c4b37", accent: "#e8c89f", points: 950 },
    { name: "Watermelon", radius: 110, color: "#54cb62", accent: "#b8ff8c", points: 2400 }
  ];
  const FRUIT_DROP_WEIGHTS = [18, 16, 14, 12, 10, 8, 8, 7];
  const FRUIT_BANANA_TIER = 6;
  const FRUIT_PINEAPPLE_TIER = 7;
  const FRUIT_COCONUT_TIER = 8;
  const FRUIT_WATERMELON_TIER = 9;
  const FRUIT_BOUNDS = { left: 48, right: 492, top: 126, bottom: 680, danger: 154 };
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
      solitaire: [
        "assets/themesong/games/solitaire-1.mp3",
        "assets/themesong/games/solitaire-2.mp3"
      ],
      fruit: [
        "assets/themesong/games/fruit-blend-1.mp3",
        "assets/themesong/games/fruit-blend-2.mp3"
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
    equippedLaser: null,
    equippedSnakeSkin: null,
    equippedCrossyCharacter: null,
    equippedBooster: null,
    boosterCooldowns: {},
    boosterPurchases: 0,
    boosterUses: 0,
    boosterLevelTarget: null,
    muteSfx: false,
    muteMusic: false,
    devModeEnabled: false,
    casperEnabled: false,
    activityLog: [],
    notificationsReadAt: 0,
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
      crossyTotalScore: 0,
      solitaireRuns: 0,
      solitaireWins: 0,
      solitaireBest: 0,
      solitaireXpEarned: 0,
      solitaireTotalScore: 0,
      fruitRuns: 0,
      fruitBest: 0,
      fruitXpEarned: 0,
      fruitTotalScore: 0,
      fruitMerges: 0,
      fruitLargest: 0,
      fruitClears: 0
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
    },
    {
      id: "solitaire",
      title: "Solitaire",
      gameNo: "07",
      tags: ["solitaire", "klondike", "cards", "classic", "puzzle", "single player"],
      description: "Build four foundations and clear the classic card table.",
      status: "Play",
      available: true,
      image: "assets/images/games/solitaire.png",
      mark: "A"
    },
    {
      id: "fruit",
      title: "Fruit Blend",
      gameNo: "08",
      tags: ["fruit", "blend", "merge", "match", "physics", "puzzle", "watermelon"],
      description: "Mix small and large drops, then clear maximum fruit for huge scores.",
      status: "Play",
      available: true,
      image: "assets/images/games/fruitblend.png",
      mark: "F"
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
    { id: "solitaire_first", title: "First Deal", text: "Complete your first Solitaire run." },
    { id: "solitaire_win", title: "Card Sharp", text: "Win a game of Solitaire." },
    { id: "fruit_first", title: "Fresh Squeeze", text: "Complete your first Fruit Blend run." },
    { id: "fruit_500", title: "Blend Master", text: "Score 500 or higher in Fruit Blend." },
    { id: "fruit_melon", title: "Melon Royalty", text: "Create a watermelon in Fruit Blend." },
    { id: "fruit_clear", title: "Clean Blend", text: "Clear two maximum fruits in Fruit Blend." },
    { id: "level_2", title: "Arcade Regular", text: "Reach level 2." },
    { id: "level_5", title: "High Score Hero", text: "Reach level 5." },
    { id: "booster_buyer", title: "Power Shopper", text: "Purchase your first booster." },
    { id: "booster_used", title: "Boosted Run", text: "Use a booster in any game." },
    { id: "booster_climb", title: "Two-Level Boost", text: "Use a booster to reach your current booster target." }
  ];

  const rivalNames = ["NOVA", "PIXEL", "ACE", "VOLT", "GLITCH", "BYTE", "JUNO", "ZERO"];

  const NAMEPLATE_CLASS_BY_ITEM = Object.freeze({
    neon_badge: "nameplate-neon",
    blue_nameplate: "nameplate-blue",
    black_nameplate: "nameplate-black",
    purple_nameplate: "nameplate-purple",
    rgb_nameplate: "nameplate-rgb",
    redline_nameplate: "nameplate-redline",
    blackstorm_nameplate: "nameplate-blackstorm"
  });

  const NAMEPLATE_PREVIEW_LABELS = Object.freeze({
    neon_badge: "NEON",
    blue_nameplate: "BLUE",
    black_nameplate: "BLACK",
    purple_nameplate: "PURPLE",
    rgb_nameplate: "RGB",
    redline_nameplate: "REDLINE",
    blackstorm_nameplate: "BLACKSTORM"
  });

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
      id: "blackstorm_nameplate",
      title: "Blackstorm Nameplate",
      category: "player",
      type: "cosmetic",
      slot: "nameplate",
      level: 75,
      cost: 18000,
      tags: ["nameplate", "profile", "player", "black", "storm", "cloud", "lightning", "animated"],
      text: "Command a living black storm with rolling clouds, circling lightning, and sudden electric flashes."
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
      id: "laser_ice_blue",
      title: "Ice Blue Beam",
      category: "player",
      type: "cosmetic",
      slot: "laser",
      level: 6,
      cost: 500,
      laserStyle: "ice-blue",
      colors: ["#dffcff", "#6bdcff", "#ffffff"],
      tags: ["star", "invaders", "laser", "beam", "ice", "blue", "frost", "thin"],
      text: "A crisp, cold, thin blue beam wrapped in a bright frosted edge."
    },
    {
      id: "laser_inferno_red",
      title: "Inferno Red Beam",
      category: "player",
      type: "cosmetic",
      slot: "laser",
      level: 9,
      cost: 800,
      laserStyle: "inferno-red",
      colors: ["#fff08a", "#ff4038", "#ff8a2b"],
      tags: ["star", "invaders", "laser", "beam", "inferno", "red", "fire", "ember", "animated"],
      text: "A fiery red shot with a hot yellow core and drifting ember particles."
    },
    {
      id: "laser_toxic_green",
      title: "Toxic Green Beam",
      category: "player",
      type: "cosmetic",
      slot: "laser",
      level: 13,
      cost: 1300,
      laserStyle: "toxic-green",
      colors: ["#dfff65", "#35ff72", "#0b6b38"],
      tags: ["star", "invaders", "laser", "beam", "toxic", "green", "vapor", "animated"],
      text: "A radioactive neon-green beam that carries a faint curling vapor trail."
    },
    {
      id: "laser_violet_pulse",
      title: "Violet Pulse Beam",
      category: "player",
      type: "cosmetic",
      slot: "laser",
      level: 18,
      cost: 2200,
      laserStyle: "violet-pulse",
      colors: ["#f3c8ff", "#a84dff", "#53128f"],
      tags: ["star", "invaders", "laser", "beam", "violet", "purple", "pulse", "heartbeat", "animated"],
      text: "A violet energy beam that expands and contracts with a heartbeat-like pulse."
    },
    {
      id: "laser_plasma_coil",
      title: "Plasma Coil Beam",
      category: "player",
      type: "cosmetic",
      slot: "laser",
      level: 28,
      cost: 4500,
      laserStyle: "plasma-coil",
      colors: ["#f4ffff", "#49f4ff", "#c471ff"],
      tags: ["star", "invaders", "laser", "beam", "plasma", "coil", "electric", "arcs", "animated", "flex"],
      text: "Electric cyan and violet arcs spiral tightly around every plasma shot."
    },
    {
      id: "laser_solar_flare",
      title: "Solar Flare Beam",
      category: "player",
      type: "cosmetic",
      slot: "laser",
      level: 36,
      cost: 6500,
      laserStyle: "solar-flare",
      colors: ["#fffbd0", "#ff9d27", "#ff3d20"],
      tags: ["star", "invaders", "laser", "beam", "solar", "orange", "flare", "eruption", "animated", "flex"],
      text: "A brilliant orange beam with tiny solar eruptions dancing along its length."
    },
    {
      id: "laser_cryo_shard",
      title: "Cryo Shard Beam",
      category: "player",
      type: "cosmetic",
      slot: "laser",
      level: 46,
      cost: 9500,
      laserStyle: "cryo-shard",
      colors: ["#ffffff", "#8cf7ff", "#4a75ff"],
      tags: ["star", "invaders", "laser", "beam", "cryo", "ice", "shard", "blue", "animated", "flex"],
      text: "A blue-white beam that grows sharp ice shards and breaks them off mid-flight."
    },
    {
      id: "laser_obsidian",
      title: "Obsidian Beam",
      category: "player",
      type: "cosmetic",
      slot: "laser",
      level: 62,
      cost: 16000,
      laserStyle: "obsidian",
      colors: ["#020205", "#d9aa42", "#fff1a1"],
      tags: ["star", "invaders", "laser", "beam", "obsidian", "black", "gold", "etching", "animated", "luxury"],
      text: "A matte-black core covered in living gold micro-etched patterns."
    },
    {
      id: "laser_dark_matter",
      title: "Dark Matter Beam",
      category: "player",
      type: "cosmetic",
      slot: "laser",
      level: 74,
      cost: 24000,
      laserStyle: "dark-matter",
      colors: ["#020106", "#642299", "#d081ff"],
      tags: ["star", "invaders", "laser", "beam", "dark matter", "purple", "black", "gravity", "distortion", "animated", "luxury"],
      text: "A swirling purple-black mass that distorts the starlight around each shot."
    },
    {
      id: "laser_supernova",
      title: "Supernova Beam",
      category: "player",
      type: "cosmetic",
      slot: "laser",
      level: 86,
      cost: 34000,
      laserStyle: "supernova",
      colors: ["#ffffff", "#fff5a5", "#ff6949"],
      tags: ["star", "invaders", "laser", "beam", "supernova", "white hot", "starburst", "impact", "animated", "luxury"],
      text: "A white-hot beam that detonates into a radiant starburst on impact."
    },
    {
      id: "laser_hologram",
      title: "Hologram Beam",
      category: "player",
      type: "cosmetic",
      slot: "laser",
      level: 98,
      cost: 48000,
      laserStyle: "hologram",
      colors: ["rgba(255,255,255,.38)", "#6ff5ff", "#ff65dc"],
      tags: ["star", "invaders", "laser", "beam", "hologram", "transparent", "pattern", "animated", "ultra", "rare"],
      text: "A transparent projection filled with shifting cyan and magenta holographic patterns."
    },
    {
      id: "laser_black_hole",
      title: "Black Hole Beam",
      category: "player",
      type: "cosmetic",
      slot: "laser",
      level: 110,
      cost: 70000,
      laserStyle: "black-hole",
      colors: ["#000000", "#b054ff", "#ffffff"],
      tags: ["star", "invaders", "laser", "beam", "black hole", "collapse", "particles", "gravity", "animated", "ultra", "mythic"],
      text: "The beam collapses inward as it travels, pulling nearby particles into its black core."
    },
    {
      id: "snake_cyber_blue",
      title: "Cyber Blue Snake",
      category: "player",
      type: "cosmetic",
      slot: "snake_skin",
      level: 2,
      cost: 260,
      colors: ["#8cf7ff", "#168cff", "#0647c8"],
      tags: ["snake", "skin", "color", "blue", "cyber"],
      text: "Turn Snake into a bright electric-blue arcade trail."
    },
    {
      id: "snake_toxic_green",
      title: "Toxic Green Snake",
      category: "player",
      type: "cosmetic",
      slot: "snake_skin",
      level: 6,
      cost: 580,
      colors: ["#dfff65", "#59ff75", "#0fa849"],
      tags: ["snake", "skin", "color", "green", "toxic"],
      text: "Give every segment a radioactive green glow."
    },
    {
      id: "snake_plasma_pink",
      title: "Plasma Pink Snake",
      category: "player",
      type: "cosmetic",
      slot: "snake_skin",
      level: 10,
      cost: 980,
      colors: ["#fff0fb", "#ff4fc8", "#b20b82"],
      tags: ["snake", "skin", "color", "pink", "plasma"],
      text: "Run the board with a hot plasma-pink snake."
    },
    {
      id: "snake_solar_gold",
      title: "Solar Gold Snake",
      category: "player",
      type: "cosmetic",
      slot: "snake_skin",
      level: 15,
      cost: 1680,
      colors: ["#fff7ad", "#ffd13d", "#ff7a18"],
      tags: ["snake", "skin", "color", "gold", "yellow", "solar"],
      text: "Light up Snake with a molten gold finish."
    },
    {
      id: "snake_void_purple",
      title: "Void Purple Snake",
      category: "player",
      type: "cosmetic",
      slot: "snake_skin",
      level: 22,
      cost: 2850,
      colors: ["#e4c6ff", "#9c50ff", "#4a0ca8"],
      tags: ["snake", "skin", "color", "purple", "void"],
      text: "Wrap the snake in deep violet void energy."
    },
    {
      id: "snake_rainbow",
      title: "Rainbow Snake",
      category: "player",
      type: "cosmetic",
      slot: "snake_skin",
      level: 35,
      cost: 6000,
      rainbow: true,
      tags: ["snake", "skin", "color", "rainbow", "rgb", "animated"],
      text: "Cycle every snake segment through a living rainbow."
    },
    {
      id: "snake_cowboy",
      title: "Cowboy Snake",
      category: "player",
      type: "cosmetic",
      slot: "snake_skin",
      level: 42,
      cost: 7600,
      colors: ["#fff0b8", "#c97932", "#63321f"],
      preview: "cowboy",
      milestone: 6,
      tags: ["snake", "skin", "cowboy", "hat", "western", "yeehaw", "animated", "milestone"],
      text: "Wear a cowboy hat. Every 6 pellets it spins, kicks up dust, and calls YEEHAW."
    },
    {
      id: "snake_cyber",
      title: "Cyber Snake",
      category: "player",
      type: "cosmetic",
      slot: "snake_skin",
      level: 48,
      cost: 9200,
      colors: ["#eaffff", "#49f4ff", "#ff2fad"],
      preview: "cyber",
      milestone: 10,
      tags: ["snake", "skin", "cyber", "glitch", "pixel", "animated", "milestone"],
      text: "Every 10 pellets the snake erupts into a flickering pixel-glitch distortion."
    },
    {
      id: "snake_plasma",
      title: "Plasma Snake",
      category: "player",
      type: "cosmetic",
      slot: "snake_skin",
      level: 54,
      cost: 11000,
      colors: ["#ffffff", "#8cf7ff", "#8a5cff"],
      preview: "plasma",
      milestone: 6,
      tags: ["snake", "skin", "plasma", "shockwave", "ripple", "animated", "milestone"],
      text: "Every 6 pellets the tail emits a luminous shockwave ripple for two seconds."
    },
    {
      id: "snake_samurai",
      title: "Samurai Snake",
      category: "player",
      type: "cosmetic",
      slot: "snake_skin",
      level: 62,
      cost: 14500,
      colors: ["#fff7f3", "#ff526f", "#230712"],
      preview: "samurai",
      milestone: 10,
      tags: ["snake", "skin", "samurai", "katana", "slash", "cherry blossom", "animated", "milestone"],
      text: "Every 10 pellets unleashes a katana slash and two seconds of falling cherry blossoms."
    },
    {
      id: "snake_hacker",
      title: "Hacker Snake",
      category: "player",
      type: "cosmetic",
      slot: "snake_skin",
      level: 68,
      cost: 17500,
      colors: ["#d8ffd8", "#42ff76", "#03140a"],
      preview: "hacker",
      milestone: 10,
      tags: ["snake", "skin", "hacker", "matrix", "terminal", "hex", "loading", "animated", "milestone"],
      text: "Every 10 pellets triggers Matrix text rain, a loading head, and scrolling tail hex."
    },
    {
      id: "snake_royal",
      title: "Royal Snake",
      category: "player",
      type: "cosmetic",
      slot: "snake_skin",
      level: 74,
      cost: 21000,
      colors: ["#fff7ad", "#ffd13d", "#7d35c8"],
      preview: "royal",
      milestone: 10,
      tags: ["snake", "skin", "royal", "crown", "gold", "fanfare", "animated", "milestone"],
      text: "Every 10 pellets the crown flares, gold rains from the body, and a soft fanfare plays."
    },
    {
      id: "snake_dragon",
      title: "Dragon Evolution Snake",
      category: "player",
      type: "cosmetic",
      slot: "snake_skin",
      level: 80,
      cost: 30000,
      colors: ["#fff08a", "#ff7040", "#76162f"],
      preview: "dragon",
      milestone: 6,
      evolution: true,
      tags: ["snake", "skin", "dragon", "evolution", "scales", "horns", "wings", "fire", "ultra rare", "animated"],
      text: "Evolves every 6 pellets: scales, horns, folded wings, glowing eyes, then a full flame aura."
    },
    {
      id: "snake_obsidian",
      title: "Obsidian Snake",
      category: "player",
      type: "cosmetic",
      slot: "snake_skin",
      level: 85,
      cost: 36000,
      colors: ["#4a433d", "#09090c", "#020204"],
      preview: "obsidian",
      milestone: 10,
      tags: ["snake", "skin", "obsidian", "matte black", "gold", "glyph", "luxury", "animated"],
      text: "Matte obsidian with gold micro-etching. Every 10 pellets, living glyphs race along the body."
    },
    {
      id: "snake_quantum",
      title: "Quantum Snake",
      category: "player",
      type: "cosmetic",
      slot: "snake_skin",
      level: 90,
      cost: 44000,
      colors: ["#ffffff", "#62e8ff", "#8a48ff"],
      preview: "quantum",
      milestone: 12,
      tags: ["snake", "skin", "quantum", "dimensions", "shadows", "particles", "luxury", "animated"],
      text: "Flickers between dimensions. Every 12 pellets it splits into three collapsing quantum shadows."
    },
    {
      id: "snake_void",
      title: "Void Snake",
      category: "player",
      type: "cosmetic",
      slot: "snake_skin",
      level: 95,
      cost: 52000,
      colors: ["#15101f", "#020204", "#000000"],
      preview: "void",
      milestone: 12,
      tags: ["snake", "skin", "void", "black", "white eyes", "vignette", "luxury", "animated"],
      text: "A pure-black silhouette with white eyes. Every 12 pellets, void energy flashes across its outline and the screen edges."
    },
    {
      id: "crossy_skips",
      title: "Skips",
      category: "player",
      type: "cosmetic",
      slot: "crossy_character",
      level: 5,
      cost: 650,
      tags: ["crossy", "road", "character", "cat", "skips", "white", "blue eyes"],
      text: "Cross the road as Skips, a bright white cat with vivid blue eyes."
    },
    {
      id: "crossy_fox",
      title: "Fox",
      category: "player",
      type: "cosmetic",
      slot: "crossy_character",
      level: 8,
      cost: 900,
      crossyStyle: "fox",
      colors: ["#ff8a32", "#fff1d0", "#642719"],
      tags: ["crossy", "road", "character", "fox", "animal"],
      text: "A bright woodland fox with a white-tipped tail and sharp little ears."
    },
    {
      id: "crossy_duck",
      title: "Duck",
      category: "player",
      type: "cosmetic",
      slot: "crossy_character",
      level: 12,
      cost: 1450,
      crossyStyle: "duck",
      colors: ["#ffe85b", "#ff9a32", "#fff9b5"],
      tags: ["crossy", "road", "character", "duck", "animal"],
      text: "A sunny yellow duck with an orange bill and a confident traffic waddle."
    },
    {
      id: "crossy_penguin",
      title: "Penguin",
      category: "player",
      type: "cosmetic",
      slot: "crossy_character",
      level: 18,
      cost: 2250,
      crossyStyle: "penguin",
      colors: ["#121827", "#f5fbff", "#ffae3d"],
      tags: ["crossy", "road", "character", "penguin", "animal"],
      text: "A polished little penguin with a snowy belly and bright orange feet."
    },
    {
      id: "crossy_sheriff_raccoon",
      title: "Sheriff Raccoon",
      category: "player",
      type: "cosmetic",
      slot: "crossy_character",
      level: 28,
      cost: 4600,
      crossyStyle: "sheriff-raccoon",
      colors: ["#8b96a8", "#252a35", "#f2c05f"],
      tags: ["crossy", "road", "character", "raccoon", "sheriff", "hat", "star"],
      text: "A masked lawkeeper wearing a tiny frontier hat and a shining sheriff star."
    },
    {
      id: "crossy_samurai_rabbit",
      title: "Samurai Rabbit",
      category: "player",
      type: "cosmetic",
      slot: "crossy_character",
      level: 38,
      cost: 7400,
      crossyStyle: "samurai-rabbit",
      colors: ["#f4f1f8", "#ff405f", "#73efff"],
      tags: ["crossy", "road", "character", "rabbit", "samurai", "headband", "katana"],
      text: "A focused rabbit with a red headband and a glowing katana across its back."
    },
    {
      id: "crossy_astronaut_hamster",
      title: "Astronaut Hamster",
      category: "player",
      type: "cosmetic",
      slot: "crossy_character",
      level: 48,
      cost: 10500,
      crossyStyle: "astronaut-hamster",
      colors: ["#c98248", "#e8f8ff", "#63dcff"],
      tags: ["crossy", "road", "character", "hamster", "astronaut", "helmet", "jetpack", "animated"],
      text: "A bubble-helmet hamster whose pocket jetpack showers sparks on every hop."
    },
    {
      id: "crossy_ninja_ferret",
      title: "Ninja Ferret",
      category: "player",
      type: "cosmetic",
      slot: "crossy_character",
      level: 58,
      cost: 14500,
      crossyStyle: "ninja-ferret",
      colors: ["#4a4054", "#08080d", "#d9d1e3"],
      tags: ["crossy", "road", "character", "ferret", "ninja", "bandana", "smoke", "animated"],
      text: "A black-bandana ferret that vanishes into a compact smoke poof when it jumps."
    },
    {
      id: "crossy_galaxy_frog",
      title: "Galaxy Frog",
      category: "player",
      type: "cosmetic",
      slot: "crossy_character",
      level: 65,
      cost: 12500,
      tags: ["crossy", "road", "character", "frog", "galaxy", "space", "animated", "reactive"],
      text: "Leap through traffic with a living galaxy that drifts against every sideways move."
    },
    {
      id: "crossy_void_panther",
      title: "Void Panther",
      category: "player",
      type: "cosmetic",
      slot: "crossy_character",
      level: 72,
      cost: 22000,
      crossyStyle: "void-panther",
      colors: ["#000000", "#ffffff", "#7133a8"],
      tags: ["crossy", "road", "character", "panther", "void", "particles", "shadow", "animated", "rare"],
      text: "Pure darkness with white eyes, void particles on every hop, and a fading shadow trail."
    },
    {
      id: "crossy_quantum_hare",
      title: "Quantum Hare",
      category: "player",
      type: "cosmetic",
      slot: "crossy_character",
      level: 78,
      cost: 28000,
      crossyStyle: "quantum-hare",
      colors: ["#6feeff", "#c65cff", "#ffffff"],
      tags: ["crossy", "road", "character", "hare", "quantum", "hologram", "glitch", "animated", "rare"],
      text: "Flickers between positions, projects 0.2-second holograms, and leaves a glitch trail."
    },
    {
      id: "crossy_obsidian_wolf",
      title: "Obsidian Wolf",
      category: "player",
      type: "cosmetic",
      slot: "crossy_character",
      level: 84,
      cost: 36000,
      crossyStyle: "obsidian-wolf",
      colors: ["#09090c", "#d8a93d", "#fff0a1"],
      tags: ["crossy", "road", "character", "wolf", "obsidian", "gold", "sparks", "flare", "luxury"],
      text: "Matte obsidian with gold micro-etching, landing sparks, and a subtle head flare."
    },
    {
      id: "crossy_cyber_oni_cat",
      title: "Cyber Oni Cat",
      category: "player",
      type: "cosmetic",
      slot: "crossy_character",
      level: 90,
      cost: 45000,
      crossyStyle: "cyber-oni-cat",
      colors: ["#131126", "#ff3ab8", "#49f4ff"],
      tags: ["crossy", "road", "character", "cat", "oni", "cyber", "horns", "circuits", "neon", "luxury"],
      text: "Neon oni horns, pulsing circuit markings, and a tail transformed into a glowing wire."
    },
    {
      id: "crossy_prism_deer",
      title: "Prism Deer",
      category: "player",
      type: "cosmetic",
      slot: "crossy_character",
      level: 96,
      cost: 56000,
      crossyStyle: "prism-deer",
      colors: ["#73efff", "#ff72d0", "#fff2a8"],
      tags: ["crossy", "road", "character", "deer", "prism", "crystal", "refraction", "burst", "luxury"],
      text: "A crystal body that refracts with movement and bursts into prismatic light on landing."
    },
    {
      id: "crossy_rgb_tiger",
      title: "RGB Tiger",
      category: "player",
      type: "cosmetic",
      slot: "crossy_character",
      level: 102,
      cost: 68000,
      crossyStyle: "rgb-tiger",
      colors: ["#ff456f", "#57ff9a", "#49f4ff"],
      tags: ["crossy", "road", "character", "tiger", "rgb", "stripes", "animated", "ultra rare"],
      text: "A midnight tiger carrying endlessly color-shifting RGB stripes inside its body."
    },
    {
      id: "crossy_chrono_dragon",
      title: "Chrono Dragon",
      category: "player",
      type: "cosmetic",
      slot: "crossy_character",
      level: 110,
      cost: 85000,
      crossyStyle: "chrono-dragon",
      colors: ["#55e8ff", "#8b56ff", "#ffd65a"],
      tags: ["crossy", "road", "character", "dragon", "chrono", "time", "gears", "ripple", "animated", "mythic"],
      text: "Time-shifting scales and living clockwork gears. Every hop releases a temporal ripple."
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
      id: "tombstone_snake",
      title: "Tombstone",
      category: "boosters",
      type: "booster",
      boost: "tombstone_snake",
      effect: "tombstone",
      games: ["snake", "crossy"],
      level: 10,
      cost: 1500,
      tags: ["booster", "snake", "crossy", "road", "tombstone", "resurrection", "revive", "ghost", "extra life"],
      text: "Resurrect once in Snake or Crossy Road. Rebound, phase through danger, or ghost back to a safe island."
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
    },
    {
      id: "earthquake_block",
      title: "Earthquake",
      category: "boosters",
      type: "booster",
      boost: "earthquake_block",
      effect: "earthquake",
      game: "block",
      level: 14,
      cost: 1750,
      tags: ["booster", "block", "grid", "earthquake", "clear", "shake"],
      text: "Shake every placed block off the board in your next Block Grid run. Clear five lines to trigger it again."
    }
  ];

  let state = loadState();
  let audioCtx = null;
  let currentScreen = "boot";
  let currentGame = "";
  let snakeTimer = null;
  let snake = createSnakeState();
  let block = createBlockState();
  let blockEarthquakeTimer = null;
  let casperBlockTimer = null;
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
  let solitaire = createSolitaireState();
  let solitaireTimer = null;
  let casperSolitaireTimer = null;
  let solitaireDealRequest = 0;
  let solitaireSolverJob = null;
  let fruit = createFruitState();
  let fruitTimer = null;
  let fruitPointerId = null;
  let touchStart = null;
  let headerSeenXp = Number(state.xp) || 0;
  let dashboardRewardTimer = null;
  let activeStoreTab = "player";
  let activeStoreFilter = "all";
  let storeScrollTop = 0;
  let storeCountdownTimer = null;
  let themeAudio = null;
  let gameOverAudio = null;
  let levelUpAudio = null;
  let activeTheme = "";
  let themeFadeTimer = null;
  const lastGameThemeTracks = new Map();
  const sfxPools = new Map();
  const toastQueue = [];
  const activeToasts = new Set();
  const toastCooldowns = new Map();
  const casperRuntime = {
    blockMoveAt: 0,
    crossyMoveAt: 0,
    solitaireMoveAt: 0,
    solitaireStates: new Map(),
    fruitDropAt: 0
  };

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
    solitaireScreen: $("solitaireScreen"),
    fruitScreen: $("fruitScreen"),
    skipBootBtn: $("skipBootBtn"),
    playerForm: $("playerForm"),
    playerName: $("playerName"),
    openProfileBtn: $("openProfileBtn"),
    openNotificationsBtn: $("openNotificationsBtn"),
    notificationBadge: $("notificationBadge"),
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
    storeFilters: $("storeFilters"),
    storeGrid: $("storeGrid"),
    snakeStage: $("snakeStage"),
    snakeCanvas: $("snakeCanvas"),
    snakeLiveScorebar: $("snakeLiveScorebar"),
    snakeScore: $("snakeScore"),
    snakeBest: $("snakeBest"),
    snakeXpPreview: $("snakeXpPreview"),
    snakeCoinPreview: $("snakeCoinPreview"),
    startSnakeBtn: $("startSnakeBtn"),
    pauseSnakeBtn: $("pauseSnakeBtn"),
    topPauseSnakeBtn: $("topPauseSnakeBtn"),
    restartSnakeBtn: $("restartSnakeBtn"),
    exitGameBtn: $("exitGameBtn"),
    exitBlockBtn: $("exitBlockBtn"),
    blockPauseBtn: $("blockPauseBtn"),
    blockLiveScorebar: $("blockLiveScorebar"),
    blockBoard: $("blockBoard"),
    blockEarthquakeBanner: $("blockEarthquakeBanner"),
    blockTray: $("blockTray"),
    blockScore: $("blockScore"),
    blockBest: $("blockBest"),
    blockLines: $("blockLines"),
    blockXpPreview: $("blockXpPreview"),
    blockCoinPreview: $("blockCoinPreview"),
    blockHint: $("blockHint"),
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
    exitSolitaireBtn: $("exitSolitaireBtn"),
    solitairePauseBtn: $("solitairePauseBtn"),
    solitaireBoard: $("solitaireBoard"),
    solitaireStock: $("solitaireStock"),
    solitaireWaste: $("solitaireWaste"),
    solitaireFoundations: $("solitaireFoundations"),
    solitaireTableau: $("solitaireTableau"),
    solitaireBoardOverlay: $("solitaireBoardOverlay"),
    solitaireScore: $("solitaireScore"),
    solitaireMoves: $("solitaireMoves"),
    solitaireTime: $("solitaireTime"),
    solitaireBest: $("solitaireBest"),
    solitaireXpPreview: $("solitaireXpPreview"),
    solitaireCoinPreview: $("solitaireCoinPreview"),
    startSolitaireBtn: $("startSolitaireBtn"),
    undoSolitaireBtn: $("undoSolitaireBtn"),
    hintSolitaireBtn: $("hintSolitaireBtn"),
    restartSolitaireBtn: $("restartSolitaireBtn"),
    exitFruitBtn: $("exitFruitBtn"),
    fruitPauseBtn: $("fruitPauseBtn"),
    fruitCanvas: $("fruitCanvas"),
    fruitScore: $("fruitScore"),
    fruitBest: $("fruitBest"),
    fruitClears: $("fruitClears"),
    fruitXpPreview: $("fruitXpPreview"),
    fruitCoinPreview: $("fruitCoinPreview"),
    startFruitBtn: $("startFruitBtn"),
    restartFruitBtn: $("restartFruitBtn"),
    toastStack: $("toastStack"),
    gameOverModal: $("gameOverModal"),
    resultKicker: $("resultKicker"),
    resultTitle: $("resultTitle"),
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
    casperToggleBtn: $("casperToggleBtn"),
    casperToggleValue: $("casperToggleValue"),
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
    notificationsModal: $("notificationsModal"),
    closeNotificationsBtn: $("closeNotificationsBtn"),
    notificationSummary: $("notificationSummary"),
    notificationUpdateBtn: $("notificationUpdateBtn"),
    notificationList: $("notificationList"),
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
      equippedSnakeSkin: typeof saved?.equippedSnakeSkin === "string" ? saved.equippedSnakeSkin : null,
      equippedCrossyCharacter: typeof saved?.equippedCrossyCharacter === "string" ? saved.equippedCrossyCharacter : null,
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
      casperEnabled: Boolean(saved?.casperEnabled),
      notificationsReadAt: Number.isFinite(Number(saved?.notificationsReadAt)) ? Number(saved.notificationsReadAt) : 0,
      stats: { ...clone(defaultState.stats), ...(saved?.stats || {}) },
      owned: Array.isArray(saved?.owned) ? saved.owned : [],
      achievements: Array.isArray(saved?.achievements) ? saved.achievements : [],
      activityLog: Array.isArray(saved?.activityLog) ? saved.activityLog.slice(0, 60) : []
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
    el.solitaireScreen.classList.toggle("hidden", name !== "solitaire");
    el.fruitScreen.classList.toggle("hidden", name !== "fruit");
    if (name !== "game") stopSnake();
    if (name !== "block") stopBlock(false);
    if (name !== "star") stopStar(false);
    if (name !== "stack") stopStack(false);
    if (name !== "flappy") stopFlappy(false);
    if (name !== "crossy") stopCrossy(false);
    if (name !== "solitaire") stopSolitaire(false);
    if (name !== "fruit") stopFruit(false);
    if (name !== "solitaire") {
      el.resultKicker.textContent = "Classic Results";
      el.resultTitle.textContent = "Game Over";
    }
    renderAll();
    if (name === "home") {
      playLobbyTheme({ transition: ["game", "block", "star", "stack", "flappy", "crossy", "solitaire", "fruit"].includes(previousScreen) });
    } else if (["game", "block", "star", "stack", "flappy", "crossy", "solitaire", "fruit"].includes(previousScreen) && name !== previousScreen) {
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

  function triggerLevelUpReward(level, previousLevel = level - 1) {
    if (currentScreen !== "home") return;
    const levelsGained = Math.max(1, level - previousLevel);
    el.playerLevel.textContent = `Level ${level}`;
    el.playerLevel.classList.remove("level-reward-pop");
    void el.playerLevel.offsetWidth;
    el.playerLevel.classList.add("level-reward-pop");
    showToast(
      "Level Up",
      `Level ${previousLevel} to Level ${level} (+${levelsGained} level${levelsGained === 1 ? "" : "s"}).`,
      "silent",
      4000,
      { category: "level" }
    );
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

    audio.loop = !options.onended;
    audio.onended = typeof options.onended === "function" ? options.onended : null;
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

  function pickThemeTrack(track, previousTrack = "") {
    if (!Array.isArray(track)) return track;
    const availableTracks = track.length > 1
      ? track.filter((candidate) => candidate !== previousTrack)
      : track;
    return availableTracks[Math.floor(Math.random() * availableTracks.length)] || track[0];
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
    const gameTracks = THEME_SONGS.games[gameId];
    const track = pickThemeTrack(gameTracks, lastGameThemeTracks.get(gameId));
    if (Array.isArray(gameTracks) && track) lastGameThemeTracks.set(gameId, track);
    const key = Array.isArray(gameTracks) && options.restart ? `game-${gameId}-${Date.now()}` : `game-${gameId}`;
    const continuousPlaylist = Boolean(options.playlist && Array.isArray(gameTracks));
    const onended = continuousPlaylist
      ? () => {
          if (currentScreen !== gameId || !fruit.running) return;
          playGameTheme(gameId, { ...options, restart: true });
        }
      : null;
    playTheme(track, key, { transition: false, ...options, onended });
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

  function casperHasGameplayControl(game = currentGame) {
    if (!state.devModeEnabled || !state.casperEnabled) return false;
    if (game === "snake") return Boolean(snake.running && !snake.paused);
    if (game === "block") return Boolean(block.running && !block.paused && !block.starting);
    if (game === "star") return Boolean(star.running && !star.paused);
    if (game === "stack") return Boolean(stack.running && !stack.paused);
    if (game === "flappy") return Boolean(flappy.running && !flappy.paused && flappy.countdown <= 0);
    if (game === "crossy") return Boolean(crossy.running && !crossy.paused && !crossy.dying);
    if (game === "solitaire") return Boolean(solitaire.running && !solitaire.paused && !solitaire.dealing);
    if (game === "fruit") return Boolean(fruit.running && !fruit.paused);
    return false;
  }

  function casperRunIsArmed(game) {
    if (!state.devModeEnabled || !state.casperEnabled) return false;
    if (game === "snake") return Boolean(snake.running);
    if (game === "block") return Boolean(block.running);
    if (game === "star") return Boolean(star.running);
    if (game === "stack") return Boolean(stack.running);
    if (game === "flappy") return Boolean(flappy.running);
    if (game === "crossy") return Boolean(crossy.running);
    if (game === "solitaire") return Boolean(solitaire.running || solitaire.dealing);
    if (game === "fruit") return Boolean(fruit.running);
    return false;
  }

  function syncCasperPresentation() {
    const screens = [
      ["snake", el.gameScreen],
      ["block", el.blockScreen],
      ["star", el.starScreen],
      ["stack", el.stackScreen],
      ["flappy", el.flappyScreen],
      ["crossy", el.crossyScreen],
      ["solitaire", el.solitaireScreen],
      ["fruit", el.fruitScreen]
    ];
    screens.forEach(([game, screen]) => screen?.classList.toggle("casper-active", casperRunIsArmed(game)));
  }

  function prepareCasperRun(game) {
    if (game === "block") casperRuntime.blockMoveAt = performance.now() + 180;
    if (game === "crossy") casperRuntime.crossyMoveAt = performance.now() + 120;
    if (game === "solitaire") {
      casperRuntime.solitaireMoveAt = performance.now() + 420;
      casperRuntime.solitaireStates.clear();
    }
    if (game === "fruit") casperRuntime.fruitDropAt = performance.now() + 380;
    syncCasperPresentation();
    if (state.devModeEnabled && state.casperEnabled) {
      const title = games.find((item) => item.id === game)?.title || game;
      showToast("Casper Active", `${title} gameplay is now under autopilot control.`, "win", 3200);
    }
  }

  function releaseCasperRun() {
    star.shootHeld = false;
    if (star.input) star.input = { x: 0, y: 0 };
    syncCasperPresentation();
  }

  function toggleCasper() {
    if (!state.devModeEnabled) return;
    state.casperEnabled = !state.casperEnabled;
    if (!state.casperEnabled) releaseCasperRun();
    saveState();
    renderDeveloperTools();
    showToast(
      "Casper",
      state.casperEnabled
        ? "Autopilot armed. Start any game to watch Casper play."
        : "Autopilot disabled. Gameplay controls restored.",
      state.casperEnabled ? "win" : "tap",
      4200
    );
  }

  function renderDeveloperTools() {
    if (!el.devUnlockedControls) return;
    el.devUnlockedControls.classList.toggle("hidden", !state.devModeEnabled);
    if (el.devModeToggle) el.devModeToggle.checked = Boolean(state.devModeEnabled);
    if (el.casperToggleBtn) {
      const enabled = Boolean(state.devModeEnabled && state.casperEnabled);
      el.casperToggleBtn.classList.toggle("is-active", enabled);
      el.casperToggleBtn.setAttribute("aria-pressed", enabled ? "true" : "false");
      if (el.casperToggleValue) el.casperToggleValue.textContent = enabled ? "On" : "Off";
    }
    if (el.devLevelValue) el.devLevelValue.textContent = formatNumber(state.level);
    if (el.devCoinsValue) el.devCoinsValue.textContent = formatNumber(state.coins);
    syncCasperPresentation();
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
    if (currentScreen === "solitaire" && solitaire.running) playGameTheme("solitaire", { volume: 0.52 });
    if (currentScreen === "fruit" && fruit.running) playGameTheme("fruit", { playlist: true, volume: 0.5 });
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

  function showToast(title, text, kind = "tap", duration = 3000, activityDetails = {}) {
    const key = `${title}::${text}`;
    const now = Date.now();
    const lastShown = toastCooldowns.get(key) || 0;
    const alreadyQueued = toastQueue.some((item) => item.key === key);

    if (activeToasts.has(key) || alreadyQueued || now - lastShown < 6000) return;

    toastCooldowns.set(key, now);
    recordActivity(title, text, kind, activityDetails);
    toastQueue.push({ key, title, text, kind, duration });
    drainToastQueue();
  }

  function recordActivity(title, text, kind = "tap", details = {}) {
    const ignored = new Set(["Coming Soon", "Start Game", "Share Canceled"]);
    if (ignored.has(title)) return;
    state.activityLog = [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title,
        text,
        kind,
        at: Date.now(),
        category: typeof details.category === "string" ? details.category : "activity",
        version: typeof details.version === "string" ? details.version : "",
        notes: Array.isArray(details.notes) ? details.notes.slice(0, 8).map((note) => String(note)) : []
      },
      ...(Array.isArray(state.activityLog) ? state.activityLog : [])
    ].slice(0, 60);
    const modalOpen = el.notificationsModal && !el.notificationsModal.classList.contains("hidden");
    const readAtBeforeActivity = Number(state.notificationsReadAt) || 0;
    saveState();
    if (!el.progressModal?.classList.contains("hidden")) renderProgressModal();
    if (modalOpen) {
      renderNotificationsModal(readAtBeforeActivity);
      state.notificationsReadAt = Date.now();
      saveState();
    }
    renderNotificationBell();
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
    renderNotificationBell();
    updateAudioToggleButtons();
    renderAppVersion();
    renderDeveloperTools();
    renderSnakeStats();
    renderBlockStats();
    renderStarStats();
    renderStackStats();
    renderSolitaireStats();
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
    const nameplateClasses = Object.values(NAMEPLATE_CLASS_BY_ITEM);
    const activeNameplateClass = NAMEPLATE_CLASS_BY_ITEM[state.equippedNameplate] || "";
    el.playerHandle.textContent = name.toUpperCase();
    el.headerCoins.textContent = formatCompactNumber(state.coins);
    nameplateClasses.forEach((className) => {
      el.openProfileBtn.classList.toggle(className, className === activeNameplateClass);
      el.openNotificationsBtn.classList.toggle(className, className === activeNameplateClass);
      el.profileHero.classList.toggle(className, className === activeNameplateClass);
    });
    el.profileAvatar.textContent = initial;
    el.profileAvatar.classList.toggle("has-image", Boolean(state.profileImage));
    el.profileAvatar.style.backgroundImage = state.profileImage ? `url("${state.profileImage}")` : "";
    el.profileName.textContent = name.toUpperCase();

    if (animateProgress && xpDelta > 0) {
      const leveledUp = target.level > from.level;
      const strong = target.level > from.level || xpDelta >= target.needed * 0.35;
      const progressRatio = target.level > from.level ? 1 : xpDelta / Math.max(1, target.needed);
      const animationDuration = Math.round(520 + Math.min(1, progressRatio) * 1180 + (target.level > from.level ? 520 : 0));
      setHeaderProgress(from);
      if (leveledUp) {
        requestAnimationFrame(() => {
          el.homeScreen.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
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
            triggerLevelUpReward(target.level, from.level);
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
        if (game.id === "solitaire") openSolitaire();
        if (game.id === "fruit") openFruit();
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
      },
      {
        title: "Solitaire",
        xp: Number(state.stats.solitaireXpEarned) || 0,
        runs: Number(state.stats.solitaireRuns) || 0,
        best: Number(state.stats.solitaireBest) || 0,
        metricLabel: "Best"
      },
      {
        title: "Fruit Blend",
        xp: Number(state.stats.fruitXpEarned) || 0,
        runs: Number(state.stats.fruitRuns) || 0,
        best: Number(state.stats.fruitBest) || 0,
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

  function notificationUnreadCount(readAt = Number(state.notificationsReadAt) || 0) {
    return (Array.isArray(state.activityLog) ? state.activityLog : [])
      .filter((item) => (Number(item.at) || 0) > readAt).length;
  }

  function renderNotificationBell() {
    if (!el.openNotificationsBtn || !el.notificationBadge) return;
    const unread = notificationUnreadCount();
    el.openNotificationsBtn.classList.toggle("has-unread", unread > 0);
    el.openNotificationsBtn.setAttribute(
      "aria-label",
      unread ? `Open notifications, ${unread} unread` : "Open notifications"
    );
    el.notificationBadge.textContent = unread > 9 ? "9+" : String(unread);
    el.notificationBadge.classList.toggle("hidden", unread === 0);
  }

  function notificationGlyph(item) {
    if (item.category === "update") return "UP";
    if (item.category === "level" || item.title === "Level Up") return "LV";
    if (item.title?.includes("Achievement")) return "A";
    if (item.title?.includes("XP")) return "XP";
    if (item.title?.includes("Coins")) return "$";
    if (item.title?.includes("Purchase") || item.title?.includes("Equipped")) return "S";
    return "!";
  }

  function renderNotificationsModal(readAt = Number(state.notificationsReadAt) || 0) {
    if (!el.notificationList || !el.notificationSummary) return;
    const activity = (Array.isArray(state.activityLog) ? state.activityLog : []).slice(0, 60);
    const unread = notificationUnreadCount(readAt);
    el.notificationSummary.textContent = unread
      ? `${formatNumber(unread)} new notification${unread === 1 ? "" : "s"}`
      : activity.length
        ? `${formatNumber(activity.length)} recent notification${activity.length === 1 ? "" : "s"}`
        : "All caught up";
    el.notificationList.innerHTML = activity.length
      ? activity.map((item) => {
        const notes = Array.isArray(item.notes) ? item.notes.filter(Boolean).slice(0, 8) : [];
        const version = typeof item.version === "string" && item.version ? item.version : "";
        const isNew = (Number(item.at) || 0) > readAt;
        return `
          <article class="notification-item ${isNew ? "is-new" : ""}" data-kind="${escapeHtml(item.kind || "tap")}" data-category="${escapeHtml(item.category || "activity")}">
            <span class="notification-item-icon" aria-hidden="true">${escapeHtml(notificationGlyph(item))}</span>
            <div class="notification-item-body">
              <strong>${escapeHtml(item.title)}</strong>
              <small>${escapeHtml(item.text)}</small>
              ${version ? `<span class="notification-version">Version ${escapeHtml(version)}</span>` : ""}
              ${notes.length ? `<ul class="notification-patch-notes">${notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>` : ""}
            </div>
            <time datetime="${new Date(Number(item.at) || Date.now()).toISOString()}">${formatActivityTime(item.at)}</time>
          </article>
        `;
      }).join("")
      : `<div class="notification-empty">No notifications yet. Level-ups, rewards, store activity, and ARCADIA updates will appear here.</div>`;
  }

  function openNotificationsModal() {
    const readAt = Number(state.notificationsReadAt) || 0;
    renderNotificationsModal(readAt);
    el.notificationsModal.classList.remove("hidden");
    state.notificationsReadAt = Date.now();
    saveState();
    renderNotificationBell();
  }

  function closeNotificationsModal() {
    el.notificationsModal.classList.add("hidden");
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
      },
      {
        id: "solitaire",
        title: "Solitaire",
        runs: Number(state.stats.solitaireRuns) || 0,
        xp: Number(state.stats.solitaireXpEarned) || 0,
        best: Number(state.stats.solitaireBest) || 0
      },
      {
        id: "fruit",
        title: "Fruit Blend",
        runs: Number(state.stats.fruitRuns) || 0,
        xp: Number(state.stats.fruitXpEarned) || 0,
        best: Number(state.stats.fruitBest) || 0
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
    const orderedAchievements = achievements
      .map((achievement, index) => ({ achievement, index, unlocked: state.achievements.includes(achievement.id) }))
      .sort((a, b) => Number(a.unlocked) - Number(b.unlocked) || a.index - b.index);
    orderedAchievements.forEach(({ achievement, unlocked }) => {
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
    el.achievementCount.textContent = `${state.achievements.length} / ${achievements.length} · Scroll for all`;
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
      tab.setAttribute("aria-selected", tab.dataset.storeTab === activeStoreTab ? "true" : "false");
    });
    const searchedItems = storeItems.filter((item) => {
      const haystack = `${item.title} ${item.text} ${item.category} ${item.type} ${(item.tags || []).join(" ")}`.toLowerCase();
      return item.category === activeStoreTab && haystack.includes(term);
    });

    const filterOptions = getStoreFilterOptions(activeStoreTab)
      .map((option) => ({
        ...option,
        count: searchedItems.filter((item) => storeItemMatchesFilter(item, option.id)).length
      }))
      .filter((option) => option.id === "all" || option.count > 0);
    if (!filterOptions.some((option) => option.id === activeStoreFilter)) activeStoreFilter = "all";

    const filterScrollLeft = el.storeFilters?.scrollLeft || 0;
    el.storeFilters.innerHTML = filterOptions.map((option) => `
      <button
        class="store-filter-chip ${option.id === activeStoreFilter ? "active" : ""}"
        type="button"
        data-store-filter="${option.id}"
        aria-pressed="${option.id === activeStoreFilter}"
      >
        <span>${option.label}</span><b>${option.count}</b>
      </button>
    `).join("");
    el.storeFilters.scrollLeft = filterScrollLeft;

    el.storeGrid.innerHTML = "";
    const filtered = searchedItems
      .filter((item) => storeItemMatchesFilter(item, activeStoreFilter))
      .sort(compareStoreItems);

    if (!filtered.length) {
      el.storeGrid.innerHTML = `<div class="store-empty">No rewards found.</div>`;
      el.storeGrid.scrollTop = 0;
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
      card.dataset.storeItemId = item.id;
      card.innerHTML = `
        <p class="system-line">${locked ? `Unlocked at Level ${item.level}` : item.type === "booster" ? cooldown ? `Cooldown ${formatCountdown(cooldown)}` : "Reusable Booster" : "Player Cosmetic"}</p>
        <h3>${item.title}</h3>
        ${renderStoreItemPreview(item)}
        <p class="store-item-description">${item.text}</p>
        <div class="store-card-foot">
          <span>${owned ? item.type === "booster" ? cooldown ? formatCountdown(cooldown) : "Ready" : "Owned" : `${formatNumber(item.cost)} Coins`}</span>
          ${renderStoreAction(item, { owned, locked, affordable, equipped, boosterEquipped, cooldown })}
        </div>
      `;
      const action = card.querySelector("[data-store-action]");
      if (action) action.addEventListener("click", () => handleStoreAction(item));
      el.storeGrid.appendChild(card);
    });
    el.storeGrid.scrollTop = Math.min(storeScrollTop, Math.max(0, el.storeGrid.scrollHeight - el.storeGrid.clientHeight));
  }

  function getStoreFilterOptions(tab) {
    if (tab === "boosters") {
      return [
        { id: "all", label: "All" },
        { id: "universal", label: "Universal" },
        { id: "snake", label: "Snake" },
        { id: "crossy", label: "Crossy Road" },
        { id: "block", label: "Block Grid" },
        { id: "star", label: "Star Invaders" },
        { id: "ready", label: "Ready" }
      ];
    }
    return [
      { id: "all", label: "All" },
      { id: "profile", label: "Profile" },
      { id: "snake", label: "Snake" },
      { id: "crossy", label: "Crossy Road" },
      { id: "star", label: "Star Invaders" },
      { id: "owned", label: "Owned" }
    ];
  }

  function storeItemSupportsGame(item, game) {
    if (Array.isArray(item.games)) return item.games.includes(game);
    return item.game === game;
  }

  function storeItemMatchesFilter(item, filter) {
    if (filter === "all") return true;
    if (filter === "profile") return item.slot === "nameplate";
    if (filter === "snake") return item.slot === "snake_skin" || storeItemSupportsGame(item, "snake");
    if (filter === "crossy") return item.slot === "crossy_character" || storeItemSupportsGame(item, "crossy");
    if (filter === "block") return storeItemSupportsGame(item, "block");
    if (filter === "star") return item.slot === "laser" || storeItemSupportsGame(item, "star");
    if (filter === "universal") return item.type === "booster" && !item.game && !item.games?.length;
    if (filter === "owned") return state.owned.includes(item.id);
    if (filter === "ready") return item.type === "booster" && state.owned.includes(item.id) && getBoosterCooldownRemaining(item) <= 0;
    return true;
  }

  function compareStoreItems(a, b) {
    const rank = (item) => {
      const owned = state.owned.includes(item.id);
      const equipped = isCosmeticEquipped(item) || (item.type === "booster" && state.equippedBooster === item.boost);
      const locked = state.level < item.level;
      const cooldown = item.type === "booster" ? getBoosterCooldownRemaining(item) : 0;
      if (equipped) return 0;
      if (owned && !cooldown) return 1;
      if (!owned && !locked && state.coins >= item.cost) return 2;
      if (owned) return 3;
      if (!locked) return 4;
      return 5;
    };
    return rank(a) - rank(b) || a.level - b.level || a.title.localeCompare(b.title);
  }

  function renderStoreItemPreview(item) {
    if (item.slot === "nameplate") {
      const nameplateClass = NAMEPLATE_CLASS_BY_ITEM[item.id] || "";
      const label = NAMEPLATE_PREVIEW_LABELS[item.id] || "PLAYER";
      return `
        <div class="store-item-preview nameplate-store-preview ${nameplateClass}" aria-hidden="true">
          <strong>${label}</strong><span>PLAYER</span>
        </div>
      `;
    }
    if (item.slot === "laser") {
      const laserStyles = {
        laser_yellow: "--laser-main:#ffd35a;--laser-edge:#fff6b5;--laser-glow:rgba(255,211,90,.88)",
        laser_black: "--laser-main:#05030b;--laser-edge:#8cf7ff;--laser-glow:rgba(73,244,255,.78)",
        laser_rgb: "--laser-main:#ff45bc;--laser-edge:#ffffff;--laser-glow:rgba(196,113,255,.86)"
      };
      const colors = item.colors || [];
      const dynamicStyle = colors.length
        ? `--laser-main:${colors[0]};--laser-edge:${colors[1]};--laser-glow:${colors[2]}`
        : "";
      const previewClass = item.laserStyle ? `laser-${item.laserStyle}` : item.id === "laser_rgb" ? "laser-rgb" : "";
      const tier = item.level >= 98 ? "ULTRA FIRE" : item.level >= 62 ? "ELITE FIRE" : item.level >= 28 ? "FLEX FIRE" : "FIRE TEST";
      return `
        <div class="store-item-preview laser-store-preview ${previewClass}" style="${laserStyles[item.id] || dynamicStyle || laserStyles.laser_yellow}" aria-hidden="true">
          <span class="laser-preview-field"><i></i><i></i><i></i></span>
          <b class="laser-preview-shot shot-one"></b><b class="laser-preview-shot shot-two"></b><b class="laser-preview-shot shot-three"></b>
          <em>${tier}</em>
        </div>
      `;
    }
    if (item.slot === "snake_skin") {
      const colors = item.colors || ["#ff4fc8", "#8a5cff", "#49f4ff"];
      const style = `--skin-a:${colors[0]};--skin-b:${colors[1]};--skin-c:${colors[2]}`;
      const premiumClass = item.preview ? `snake-preview-${item.preview} premium-snake` : "";
      const accessory = item.preview === "cowboy" ? '<b class="cowboy-preview-hat"></b>' : "";
      const face = item.preview ? `${accessory}<i></i><i></i>` : "";
      return `
        <div class="store-item-preview snake-skin-preview ${item.rainbow ? "rainbow" : ""} ${premiumClass}" style="${style}" aria-hidden="true">
          <span class="snake-preview-head">${face}</span><span></span><span></span><span></span>
        </div>
      `;
    }
    if (item.slot === "crossy_character") {
      if (item.id === "crossy_galaxy_frog") {
        return `
          <div class="store-item-preview crossy-character-preview galaxy-frog-preview" aria-hidden="true">
            <div class="galaxy-store-frog">
              <span class="frog-foot left"></span><span class="frog-foot right"></span>
              <span class="frog-body"></span><span class="frog-face"></span>
              <i class="frog-eye left"></i><i class="frog-eye right"></i>
            </div>
            <strong>GALAXY FROG</strong>
          </div>
        `;
      }
      if (item.crossyStyle) {
        const colors = item.colors || ["#8cf7ff", "#ffffff", "#c471ff"];
        const style = `--crossy-a:${colors[0]};--crossy-b:${colors[1]};--crossy-c:${colors[2]}`;
        return `
          <div class="store-item-preview crossy-character-preview crossy-animal-preview crossy-preview-${item.crossyStyle}" style="${style}" aria-hidden="true">
            <div class="crossy-preview-stage">
              <span class="crossy-preview-echo echo-one"></span><span class="crossy-preview-echo echo-two"></span>
              <div class="crossy-preview-animal">
                <span class="crossy-preview-tail"></span><span class="crossy-preview-body"></span>
                <span class="crossy-preview-leg leg-one"></span><span class="crossy-preview-leg leg-two"></span>
                <span class="crossy-preview-head"><i></i><i></i><b></b></span>
                <span class="crossy-preview-ear ear-one"></span><span class="crossy-preview-ear ear-two"></span>
                <span class="crossy-preview-accessory"></span>
              </div>
            </div>
            <strong>${item.title}</strong>
          </div>
        `;
      }
      return `
        <div class="store-item-preview crossy-character-preview" aria-hidden="true">
          <div class="skips-store-cat">
            <span class="cat-ear left"></span><span class="cat-ear right"></span>
            <span class="cat-face"><i></i><i></i><b></b></span>
            <span class="cat-body"></span><span class="cat-tail"></span>
          </div>
          <strong>SKIPS</strong>
        </div>
      `;
    }
    if (item.multiplier) {
      return `
        <div class="store-item-preview xp-store-preview" aria-hidden="true">
          <span>XP</span><strong>&times;${item.multiplier}</strong><i>COINS TOO</i>
        </div>
      `;
    }
    if (item.effect === "tombstone") {
      return `
        <div class="store-item-preview tombstone-store-preview" aria-hidden="true">
          <span><strong>RIP</strong></span><i>+1 LIFE</i>
        </div>
      `;
    }
    if (item.effect === "machine_gun") {
      return `
        <div class="store-item-preview machine-gun-store-preview" aria-hidden="true">
          <span class="machine-gun-art"><i></i><b></b></span><em></em><em></em><em></em><strong>AUTO FIRE</strong>
        </div>
      `;
    }
    if (item.effect === "earthquake") {
      return `<div class="store-item-preview earthquake-store-preview" aria-hidden="true"><span></span><strong>QUAKE</strong><span></span></div>`;
    }
    return "";
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
    if (item.slot === "snake_skin") return state.equippedSnakeSkin === item.id;
    if (item.slot === "crossy_character") return state.equippedCrossyCharacter === item.id;
    return false;
  }

  function toggleCosmetic(item) {
    if (item.slot === "nameplate") state.equippedNameplate = state.equippedNameplate === item.id ? null : item.id;
    else if (item.slot === "laser") state.equippedLaser = state.equippedLaser === item.id ? null : item.id;
    else if (item.slot === "snake_skin") state.equippedSnakeSkin = state.equippedSnakeSkin === item.id ? null : item.id;
    else if (item.slot === "crossy_character") state.equippedCrossyCharacter = state.equippedCrossyCharacter === item.id ? null : item.id;
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
      if (item.slot === "snake_skin") state.equippedSnakeSkin = item.id;
      if (item.slot === "crossy_character") state.equippedCrossyCharacter = item.id;
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
      runId: 0,
      runStartedAt: 0,
      pausedAt: 0,
      pausedMs: 0,
      starting: false,
      dragIndex: null,
      dragPointerId: null,
      dragOffset: { x: 0, y: 0 },
      preview: null,
      clearing: [],
      ghost: null,
      earthquakeBoosterEquipped: false,
      earthquakeActive: false,
      earthquakeQueued: false,
      earthquakeCells: [],
      earthquakeCount: 0,
      earthquakeScore: 0,
      linesSinceEarthquake: 0,
      earthquakeTriggerAt: 0
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

  function clearBlockEarthquakeTimer() {
    if (!blockEarthquakeTimer) return;
    clearTimeout(blockEarthquakeTimer);
    blockEarthquakeTimer = null;
  }

  function scheduleBlockEarthquake(delayMs) {
    clearBlockEarthquakeTimer();
    block.earthquakeTriggerAt = Date.now() + delayMs;
    blockEarthquakeTimer = setTimeout(() => {
      blockEarthquakeTimer = null;
      if (currentScreen !== "block" || !block.running || !block.earthquakeBoosterEquipped) return;
      if (block.paused || block.starting || block.clearing.length || block.earthquakeActive) {
        scheduleBlockEarthquake(350);
        return;
      }
      triggerBlockEarthquake();
    }, delayMs);
  }

  function triggerBlockEarthquake() {
    if (!block.running || !block.earthquakeBoosterEquipped || block.earthquakeActive) return;
    cleanupBlockDrag();
    const cells = [];
    for (let row = 0; row < BLOCK_GRID_SIZE; row += 1) {
      for (let col = 0; col < BLOCK_GRID_SIZE; col += 1) {
        if (block.board[row][col]) cells.push({ row, col, color: block.board[row][col] });
      }
    }
    block.earthquakeActive = true;
    block.earthquakeQueued = false;
    block.earthquakeCells = cells;
    block.earthquakeScore = cells.length * 12;
    block.selected = null;
    playTone("fail");
    showToast("EARTHQUAKE", cells.length ? `${cells.length} blocks are falling.` : "The board shook clean.", "win", 2200);
    renderBlock();
    clearBlockEarthquakeTimer();
    blockEarthquakeTimer = setTimeout(finishBlockEarthquake, 1050);
  }

  function finishBlockEarthquake() {
    blockEarthquakeTimer = null;
    if (!block.running || !block.earthquakeActive) return;
    block.earthquakeCells.forEach(({ row, col }) => {
      block.board[row][col] = 0;
    });
    const points = block.earthquakeScore;
    block.score += points;
    block.earthquakeCount += 1;
    block.linesSinceEarthquake = 0;
    block.earthquakeTriggerAt = 0;
    block.earthquakeActive = false;
    block.earthquakeCells = [];
    block.earthquakeScore = 0;
    if (block.pieces.every((pieceItem) => pieceItem.used)) refillBlockPieces();
    playTone("win");
    showToast("Board Cleared", `Earthquake awarded +${formatNumber(points)} points. Clear 5 lines to recharge it.`, "win", 3200);
    renderBlock();
  }

  function resetBlock(fillTray = false) {
    clearBlockEarthquakeTimer();
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
    block.runId = Date.now() + Math.random();
    block.runStartedAt = Date.now();
    const equippedBooster = getEquippedBoosterItem("block");
    block.earthquakeBoosterEquipped = equippedBooster?.effect === "earthquake";
    if (block.earthquakeBoosterEquipped) {
      scheduleBlockEarthquake(15000 + Math.floor(Math.random() * 30001));
    }
    playBlockSfx("start");
    playGameTheme("block", { restart: true });
    prepareCasperRun("block");
    if (casperBlockTimer) clearInterval(casperBlockTimer);
    casperBlockTimer = setInterval(runCasperBlock, 120);
    renderBlock();
    const runId = block.runId;
    setTimeout(() => {
      if (currentScreen !== "block" || !block.running || !block.starting || block.runId !== runId) return;
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
    if (!block.running || block.starting || block.earthquakeActive || block.earthquakeQueued) return;
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
    return block.running && !block.paused && !block.starting && !block.clearing.length && !block.earthquakeActive && !block.earthquakeQueued;
  }

  function blockIntroColor(row, col) {
    const colors = ["cyan", "green", "pink", "yellow", "purple"];
    return colors[(row * 3 + col * 2) % colors.length];
  }

  function blockIntroDelay(row) {
    return `${(BLOCK_GRID_SIZE - 1 - row) * 85}ms`;
  }

  function stopBlock(render = true) {
    clearBlockEarthquakeTimer();
    if (casperBlockTimer) {
      clearInterval(casperBlockTimer);
      casperBlockTimer = null;
    }
    if (block.paused && block.pausedAt) {
      block.pausedMs += Date.now() - block.pausedAt;
      block.pausedAt = 0;
    }
    block.running = false;
    block.paused = false;
    block.earthquakeActive = false;
    block.earthquakeQueued = false;
    block.earthquakeCells = [];
    block.selected = null;
    cleanupBlockDrag();
    el.blockScreen?.classList.remove("earthquake-active");
    el.blockEarthquakeBanner?.setAttribute("aria-hidden", "true");
    releaseCasperRun();
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

  function canPlaceCasperBlock(board, piece, row, col) {
    return blockCells(piece).every(({ x, y }) => {
      const targetRow = row + y;
      const targetCol = col + x;
      return targetRow >= 0
        && targetCol >= 0
        && targetRow < BLOCK_GRID_SIZE
        && targetCol < BLOCK_GRID_SIZE
        && !board[targetRow][targetCol];
    });
  }

  function simulateCasperBlockPlacement(board, piece, row, col) {
    const next = board.map((line) => line.slice());
    blockCells(piece).forEach(({ x, y }) => { next[row + y][col + x] = 1; });
    const fullRows = [];
    const fullCols = [];
    for (let index = 0; index < BLOCK_GRID_SIZE; index += 1) {
      if (next[index].every(Boolean)) fullRows.push(index);
      if (next.every((line) => line[index])) fullCols.push(index);
    }
    fullRows.forEach((targetRow) => next[targetRow].fill(0));
    fullCols.forEach((targetCol) => next.forEach((line) => { line[targetCol] = 0; }));
    return { board: next, clears: fullRows.length + fullCols.length };
  }

  function scoreCasperBlockBoard(board, clears = 0) {
    const rowCounts = board.map((row) => row.filter(Boolean).length);
    const colCounts = Array.from({ length: BLOCK_GRID_SIZE }, (_, col) => board.filter((row) => row[col]).length);
    const occupied = rowCounts.reduce((total, count) => total + count, 0);
    const pressure = [...rowCounts, ...colCounts].reduce((total, count) => total + count * count, 0);
    let crampedCells = 0;
    for (let row = 0; row < BLOCK_GRID_SIZE; row += 1) {
      for (let col = 0; col < BLOCK_GRID_SIZE; col += 1) {
        if (board[row][col]) continue;
        const neighbors = [
          row <= 0 || board[row - 1][col],
          row >= BLOCK_GRID_SIZE - 1 || board[row + 1][col],
          col <= 0 || board[row][col - 1],
          col >= BLOCK_GRID_SIZE - 1 || board[row][col + 1]
        ].filter(Boolean).length;
        if (neighbors >= 3) crampedCells += 1;
      }
    }
    return clears * 2400 + pressure * 2.2 - occupied * 5 - crampedCells * 42;
  }

  function casperBlockCandidates(board, pieces) {
    const candidates = [];
    pieces.forEach(({ piece, index }) => {
      for (let row = 0; row < BLOCK_GRID_SIZE; row += 1) {
        for (let col = 0; col < BLOCK_GRID_SIZE; col += 1) {
          if (!canPlaceCasperBlock(board, piece, row, col)) continue;
          const result = simulateCasperBlockPlacement(board, piece, row, col);
          candidates.push({
            index,
            row,
            col,
            board: result.board,
            score: scoreCasperBlockBoard(result.board, result.clears),
            clears: result.clears
          });
        }
      }
    });
    return candidates.sort((a, b) => b.score - a.score);
  }

  function searchCasperBlockPlan(board, pieces, depth = 3) {
    const candidates = casperBlockCandidates(board, pieces);
    if (!candidates.length) return null;
    let best = null;
    for (const candidate of candidates.slice(0, 14)) {
      let score = candidate.score;
      if (depth > 1 && pieces.length > 1) {
        const remaining = pieces.filter((item) => item.index !== candidate.index);
        const future = searchCasperBlockPlan(candidate.board, remaining, depth - 1);
        score += future ? future.totalScore * 0.58 : -1800;
      }
      if (!best || score > best.totalScore) best = { ...candidate, totalScore: score };
    }
    return best;
  }

  function runCasperBlock() {
    if (!casperHasGameplayControl("block") || !blockCanInteract()) return;
    const now = performance.now();
    if (now < casperRuntime.blockMoveAt) return;
    const pieces = block.pieces
      .map((piece, index) => ({ piece, index }))
      .filter(({ piece }) => !piece.used);
    const move = searchCasperBlockPlan(block.board.map((row) => row.map(Boolean)), pieces, Math.min(3, pieces.length));
    if (!move) {
      if (!anyBlockFits()) endBlockRun("crash");
      return;
    }
    block.selected = move.index;
    casperRuntime.blockMoveAt = now + (move.clears ? 620 : 260);
    placeBlock(move.row, move.col);
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
      if (block.earthquakeBoosterEquipped && block.earthquakeCount > 0) {
        block.linesSinceEarthquake += cleared;
        if (block.linesSinceEarthquake >= 5) block.earthquakeQueued = true;
      }
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
    if (block.earthquakeQueued) {
      scheduleBlockEarthquake(160);
      return;
    }
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
      const runId = block.runId;
      setTimeout(() => {
        if (!block.running || block.runId !== runId) return;
        finishBlockLineClear(clearResult.fullRows, clearResult.fullCols);
      }, 460);
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
    el.blockLiveScorebar?.classList.toggle("is-visible", block.running);
    el.blockLiveScorebar?.setAttribute("aria-hidden", block.running ? "false" : "true");
    el.blockXpPreview.textContent = formatNumber(applyRewardBooster(calculateBlockXp()));
    el.blockCoinPreview.textContent = formatNumber(previewBlockCoins());
    el.startBlockBtn.textContent = block.running ? "End Game" : "Start Game";
    el.blockPauseBtn.textContent = block.paused ? "Resume" : "Pause";
    el.blockPauseBtn.disabled = !block.running || block.starting || block.earthquakeActive || block.earthquakeQueued;
    if (el.blockHint) {
      if (block.earthquakeActive) {
        el.blockHint.textContent = "EARTHQUAKE ACTIVE - every placed block is falling for points.";
      } else if (block.earthquakeBoosterEquipped && block.earthquakeCount === 0) {
        el.blockHint.textContent = "Earthquake armed - the opening strike will hit between 15 and 45 seconds.";
      } else if (block.earthquakeBoosterEquipped) {
        el.blockHint.textContent = `Earthquake recharge: ${Math.min(5, block.linesSinceEarthquake)} / 5 skill-cleared lines.`;
      } else {
        el.blockHint.textContent = "Tap a piece, then tap the board. Fill rows or columns to clear space.";
      }
    }
  }

  function getBlockPreviewCells() {
    const cells = new Map();
    if (!block.preview || block.selected === null) return cells;
    const piece = block.pieces[block.selected];
    if (!piece) return cells;
    blockCells(piece).forEach(({ x, y }) => {
      const r = block.preview.row + y;
      const c = block.preview.col + x;
      if (r < 0 || c < 0 || r >= BLOCK_GRID_SIZE || c >= BLOCK_GRID_SIZE) return;
      if (block.preview.valid) {
        cells.set(`${r}:${c}`, `valid ${piece.color}`);
      } else if (block.board[r][c]) {
        cells.set(`${r}:${c}`, "conflict");
      }
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

  function getEarthquakeBlockCells() {
    const cells = new Map();
    block.earthquakeCells.forEach((cell) => cells.set(`${cell.row}:${cell.col}`, cell));
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
    block.ghost?.classList.toggle("invalid-drop", Boolean(block.preview && !block.preview.valid));
    renderBlockBoard();
  }

  function startBlockDrag(index, event) {
    if (casperHasGameplayControl("block")) return;
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
    const earthquakeCells = getEarthquakeBlockCells();
    for (let r = 0; r < BLOCK_GRID_SIZE; r += 1) {
      for (let c = 0; c < BLOCK_GRID_SIZE; c += 1) {
        const cell = document.createElement("button");
        const preview = previewCells.get(`${r}:${c}`);
        const clearing = clearingCells.get(`${r}:${c}`);
        const earthquake = earthquakeCells.get(`${r}:${c}`);
        cell.type = "button";
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);
        cell.style.setProperty("--intro-delay", blockIntroDelay(r));
        cell.style.setProperty("--clear-delay", `${(clearing?.index || 0) * 18}ms`);
        cell.style.setProperty("--quake-delay", `${r * 18 + (c % 3) * 22}ms`);
        cell.className = `block-cell ${block.starting ? `intro ${blockIntroColor(r, c)}` : ""} ${block.board[r][c] ? `filled ${block.board[r][c]}` : ""} ${clearing ? `clearing ${clearing.color}` : ""} ${earthquake ? "earthquake-fall" : ""} ${preview ? `preview ${preview}` : ""}`;
        cell.setAttribute("aria-label", `Row ${r + 1}, column ${c + 1}`);
        cell.addEventListener("click", () => {
          if (casperHasGameplayControl("block")) return;
          placeBlock(r, c);
        });
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
        if (casperHasGameplayControl("block")) return;
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
    el.blockScreen?.classList.toggle("earthquake-active", Boolean(block.earthquakeActive));
    el.blockEarthquakeBanner?.setAttribute("aria-hidden", block.earthquakeActive ? "false" : "true");
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
      laserImpacts: [],
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
    prepareCasperRun("star");
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
    releaseCasperRun();
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

  function getEquippedStarLaser() {
    if (!state.owned.includes(state.equippedLaser)) return null;
    return storeItems.find((item) => item.id === state.equippedLaser && item.slot === "laser") || null;
  }

  function getStarLaserVisual(options = {}) {
    if (options.color) return { color: options.color, edgeColor: options.color, accentColor: options.color, style: "default" };
    if (options.freefire) return { color: "#ffd35a", edgeColor: "#fff6b5", accentColor: "#ff8a2b", style: "default" };
    const item = getEquippedStarLaser();
    if (item?.id === "laser_yellow") return { color: "#ffd35a", edgeColor: "#fff6b5", accentColor: "#ff8a2b", style: "default" };
    if (item?.id === "laser_black") return { color: "#05030b", edgeColor: "#ff2fad", accentColor: "#49f4ff", style: "black" };
    if (item?.id === "laser_rgb") {
      const colors = ["#49f4ff", "#ff2fad", "#57ff9a", "#ffd35a", "#b071ff"];
      const color = colors[star.laserCycle % colors.length];
      star.laserCycle += 1;
      return { color, edgeColor: "#ffffff", accentColor: colors[(star.laserCycle + 1) % colors.length], style: "rgb" };
    }
    if (item?.laserStyle) {
      return {
        color: item.colors?.[0] || "#49f4ff",
        edgeColor: item.colors?.[1] || "#ffffff",
        accentColor: item.colors?.[2] || item.colors?.[1] || "#c471ff",
        style: item.laserStyle
      };
    }
    return { color: "#49f4ff", edgeColor: "#dfffff", accentColor: "#168cff", style: "default" };
  }

  function fireStarBullet(x, y, options = {}) {
    const visual = getStarLaserVisual(options);
    const bornAt = performance.now();
    star.bullets.push({
      x,
      y,
      vx: options.vx || 0,
      vy: options.vy || -520,
      r: options.r || 4,
      damage: options.damage || getStarDamage(options),
      color: visual.color,
      edgeColor: visual.edgeColor,
      accentColor: visual.accentColor,
      laserStyle: visual.style,
      bornAt,
      lastTrailAt: bornAt,
      phase: Math.random() * Math.PI * 2,
      darkCore: visual.style === "black"
    });
  }

  function addStarLaserTrailParticle(bullet, kind, color, options = {}) {
    if (star.particles.length > 480) return;
    const life = options.life || 18;
    star.particles.push({
      x: bullet.x + (Math.random() - 0.5) * (options.spread || 9),
      y: bullet.y + 7 + Math.random() * 12,
      vx: options.vx ?? (Math.random() - 0.5) * 28,
      vy: options.vy ?? 28 + Math.random() * 34,
      life,
      totalLife: life,
      size: options.size || 2 + Math.random() * 3,
      spin: Math.random() * Math.PI,
      kind,
      color
    });
  }

  function emitStarLaserTrail(bullet, now) {
    const intervals = {
      "inferno-red": 82,
      "toxic-green": 105,
      "solar-flare": 96,
      "cryo-shard": 112,
      "dark-matter": 115,
      hologram: 108
    };
    const interval = intervals[bullet.laserStyle];
    if (!interval || now - bullet.lastTrailAt < interval) return;
    bullet.lastTrailAt = now;
    if (bullet.laserStyle === "inferno-red") {
      addStarLaserTrailParticle(bullet, "ember", Math.random() > 0.45 ? "#ff9d27" : "#ff4038", { life: 15, spread: 12, vy: 42 });
    } else if (bullet.laserStyle === "toxic-green") {
      addStarLaserTrailParticle(bullet, "vapor", "#35ff72", { life: 22, spread: 14, size: 5, vy: 24 });
    } else if (bullet.laserStyle === "solar-flare") {
      addStarLaserTrailParticle(bullet, "solar", Math.random() > 0.5 ? "#fffbd0" : "#ff9d27", { life: 14, spread: 15, vy: 38 });
    } else if (bullet.laserStyle === "cryo-shard") {
      addStarLaserTrailParticle(bullet, "shard", Math.random() > 0.5 ? "#ffffff" : "#8cf7ff", { life: 18, spread: 13, size: 4, vy: 30 });
    } else if (bullet.laserStyle === "dark-matter") {
      addStarLaserTrailParticle(bullet, "matter", Math.random() > 0.5 ? "#642299" : "#d081ff", { life: 20, spread: 18, size: 4, vy: 18 });
    } else if (bullet.laserStyle === "hologram") {
      addStarLaserTrailParticle(bullet, "hologram", Math.random() > 0.5 ? "#6ff5ff" : "#ff65dc", { life: 13, spread: 11, size: 5, vy: 34 });
    }
  }

  function triggerStarLaserImpact(bullet, x, y) {
    if (bullet.impacted || !bullet.laserStyle || bullet.laserStyle === "default") return;
    bullet.impacted = true;
    const duration = bullet.laserStyle === "supernova" ? 620 : bullet.laserStyle === "black-hole" ? 520 : 360;
    star.laserImpacts.push({
      x,
      y,
      style: bullet.laserStyle,
      color: bullet.color,
      edgeColor: bullet.edgeColor,
      accentColor: bullet.accentColor,
      startedAt: performance.now(),
      duration,
      phase: bullet.phase || 0
    });
    const burstMap = {
      "ice-blue": ["#dffcff", "#6bdcff"],
      "inferno-red": ["#fff08a", "#ff4038", "#ff8a2b"],
      "toxic-green": ["#dfff65", "#35ff72"],
      "violet-pulse": ["#f3c8ff", "#a84dff"],
      "plasma-coil": ["#49f4ff", "#c471ff"],
      "solar-flare": ["#fffbd0", "#ff9d27", "#ff3d20"],
      "cryo-shard": ["#ffffff", "#8cf7ff", "#4a75ff"],
      obsidian: ["#d9aa42", "#fff1a1"],
      "dark-matter": ["#642299", "#d081ff"],
      supernova: ["#ffffff", "#fff5a5", "#ff6949"],
      hologram: ["#6ff5ff", "#ff65dc"],
      "black-hole": ["#000000", "#b054ff", "#ffffff"]
    };
    const colors = burstMap[bullet.laserStyle] || [bullet.color || "#49f4ff"];
    const count = bullet.laserStyle === "supernova" ? 28 : bullet.laserStyle === "black-hole" ? 18 : 9;
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count + Math.random() * 0.18;
      const speed = bullet.laserStyle === "supernova" ? 90 + Math.random() * 170 : 34 + Math.random() * 75;
      const life = bullet.laserStyle === "supernova" ? 28 : 18;
      star.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        totalLife: life,
        size: bullet.laserStyle === "supernova" ? 3 + Math.random() * 5 : 2 + Math.random() * 3,
        spin: angle,
        kind: bullet.laserStyle === "cryo-shard" || bullet.laserStyle === "ice-blue" ? "shard" : "laser-impact",
        color: colors[index % colors.length]
      });
    }
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

  function scoreCasperStarPosition(x, y) {
    let score = -Math.abs(y - 585) * 0.22;
    score -= Math.max(0, 70 - x) * 3;
    score -= Math.max(0, x - 650) * 3;
    score -= Math.max(0, 390 - y) * 1.4;
    score -= Math.max(0, y - 670) * 3;

    star.enemyBullets.forEach((bullet) => {
      const time = Math.max(0, Math.min(1.1, (y - bullet.y) / Math.max(1, bullet.vy)));
      const projectedY = bullet.y + bullet.vy * time;
      const gap = Math.hypot(x - bullet.x, y - projectedY);
      score -= Math.max(0, 92 - gap) * 16;
      if (time < 0.65 && Math.abs(x - bullet.x) < star.player.r + bullet.r + 18) score -= 900;
    });

    [...star.meteors, ...star.enemies].forEach((hazard) => {
      const speed = hazard.speed || 0;
      [0.25, 0.55, 0.9].forEach((time) => {
        const projected = { x: hazard.x, y: hazard.y + speed * time };
        const gap = distance({ x, y }, projected) - star.player.r - hazard.r;
        score -= Math.max(0, 115 - gap) * (hazard.type === "boss" ? 5 : 8);
        if (gap < 18) score -= 1000;
      });
    });

    const powerup = star.powerups
      .filter((item) => !item.dead)
      .sort((a, b) => distance(star.player, a) - distance(star.player, b))[0];
    if (powerup) {
      const value = powerup.type === "health" && star.health < star.maxHealth ? 420 : 180;
      score += Math.max(0, value - distance({ x, y }, powerup) * 0.55);
    }

    const target = star.enemies.find((enemy) => enemy.type === "boss" && !enemy.dead)
      || star.enemies.filter((enemy) => !enemy.dead).sort((a, b) => b.y - a.y)[0]
      || star.meteors.filter((meteor) => !meteor.dead).sort((a, b) => b.y - a.y)[0];
    if (target) score += Math.max(0, 130 - Math.abs(x - target.x)) * 0.32;
    return score;
  }

  function runCasperStar() {
    if (!casperHasGameplayControl("star")) return;
    if (star.machineGunBoosterEquipped && star.machineGunChargeReady && !star.machineGunActive) activateStarMachineGun();
    star.shootHeld = true;
    const choices = [];
    [-1, 0, 1].forEach((dx) => {
      [-1, 0, 1].forEach((dy) => {
        const magnitude = Math.hypot(dx, dy) || 1;
        const input = { x: dx / magnitude, y: dy / magnitude };
        const x = Math.max(24, Math.min(696, star.player.x + input.x * 92));
        const y = Math.max(90, Math.min(686, star.player.y + input.y * 92));
        const stillBonus = dx === 0 && dy === 0 ? 4 : 0;
        choices.push({ input, score: scoreCasperStarPosition(x, y) + stillBonus });
      });
    });
    choices.sort((a, b) => b.score - a.score);
    star.input = choices[0]?.input || { x: 0, y: 0 };
  }

  function tickStar() {
    if (!star.running || star.paused) return;
    const now = performance.now();
    const dt = Math.min(0.04, (now - star.lastFrame) / 1000 || 0.016);
    star.lastFrame = now;
    star.survivedMs += dt * 1000;
    const difficulty = starDifficulty();

    runCasperStar();

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
      emitStarLaserTrail(b, now);
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
    star.laserImpacts = star.laserImpacts.filter((impact) => now - impact.startedAt < impact.duration);

    for (const bullet of star.bullets) {
      for (const enemy of star.enemies) {
        if (distance(bullet, enemy) < bullet.r + enemy.r) {
          const impactX = bullet.x;
          const impactY = bullet.y;
          triggerStarLaserImpact(bullet, impactX, impactY);
          bullet.y = -999;
          enemy.hp -= bullet.damage || 1;
          markDamaged(enemy);
          addStarExplosion(impactX, impactY, enemy.type === "boss" ? "#ffd35a" : "#49f4ff", 4);
          if (enemy.hp <= 0) destroyStarEnemy(enemy);
        }
      }
      for (const meteor of star.meteors) {
        if (distance(bullet, meteor) < bullet.r + meteor.r) {
          const impactX = bullet.x;
          const impactY = bullet.y;
          triggerStarLaserImpact(bullet, impactX, impactY);
          bullet.y = -999;
          meteor.hp -= bullet.damage || 1;
          markDamaged(meteor);
          addStarExplosion(impactX, impactY, "#ffd35a", 4);
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

  function drawStarLaserBullet(ctx, bullet, now = performance.now()) {
    const style = bullet.laserStyle || "default";
    const age = Math.max(0, now - (bullet.bornAt || now));
    const pulse = (Math.sin(age / 62 + (bullet.phase || 0)) + 1) / 2;
    const width = Math.max(4, bullet.r || 4);
    ctx.save();
    ctx.translate(bullet.x, bullet.y);

    if (style === "default" || style === "rgb" || style === "black") {
      ctx.shadowBlur = 16;
      ctx.shadowColor = bullet.color || "#49f4ff";
      ctx.fillStyle = bullet.color || "#49f4ff";
      ctx.fillRect(-Math.max(2, width / 2), -12, width, 18);
      if (style === "black" || bullet.darkCore) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = bullet.edgeColor || "#ff2fad";
        ctx.strokeStyle = bullet.edgeColor || "#ff2fad";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-Math.max(2, width / 2), -12, width, 18);
      }
      ctx.restore();
      return;
    }

    if (style === "ice-blue") {
      ctx.shadowColor = "#6bdcff";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#dffcff";
      ctx.fillRect(-1.5, -17, 3, 25);
      ctx.strokeStyle = "rgba(255,255,255,.92)";
      ctx.lineWidth = 1;
      ctx.strokeRect(-2.5, -17, 5, 25);
      [-12, -2].forEach((shardY, index) => {
        ctx.save();
        ctx.translate(index ? 5 : -5, shardY);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = "rgba(223,252,255,.78)";
        ctx.fillRect(-2, -2, 4, 4);
        ctx.restore();
      });
    } else if (style === "inferno-red") {
      const inferno = ctx.createLinearGradient(-5, 0, 5, 0);
      inferno.addColorStop(0, "#ff4038");
      inferno.addColorStop(0.5, "#fff08a");
      inferno.addColorStop(1, "#ff4038");
      ctx.shadowColor = "#ff4038";
      ctx.shadowBlur = 17 + pulse * 7;
      ctx.fillStyle = inferno;
      ctx.fillRect(-3 - pulse, -17, 6 + pulse * 2, 25);
    } else if (style === "toxic-green") {
      ctx.fillStyle = `rgba(53,255,114,${0.12 + pulse * 0.1})`;
      ctx.beginPath();
      ctx.ellipse(0, 7, 8 + pulse * 4, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = "#35ff72";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#dfff65";
      ctx.fillRect(-2, -17, 4, 25);
      ctx.strokeStyle = "#35ff72";
      ctx.strokeRect(-3, -17, 6, 25);
    } else if (style === "violet-pulse") {
      const heartbeat = Math.sin(age / 92) > 0.48 ? 1.75 : Math.sin(age / 92) > 0.1 ? 1.15 : 0.8;
      ctx.shadowColor = "#a84dff";
      ctx.shadowBlur = 13 + heartbeat * 5;
      ctx.fillStyle = "#f3c8ff";
      ctx.fillRect(-2.5 * heartbeat, -17, 5 * heartbeat, 25);
      ctx.fillStyle = "#a84dff";
      ctx.fillRect(-1.5 * heartbeat, -17, 3 * heartbeat, 25);
    } else if (style === "plasma-coil") {
      ctx.shadowColor = "#49f4ff";
      ctx.shadowBlur = 17;
      ctx.fillStyle = "#f4ffff";
      ctx.fillRect(-2, -18, 4, 27);
      [0, Math.PI].forEach((offset, index) => {
        ctx.strokeStyle = index ? "#c471ff" : "#49f4ff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let y = -18; y <= 9; y += 2) {
          const x = Math.sin(y * 0.55 + age / 48 + offset) * 7;
          if (y === -18) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    } else if (style === "solar-flare") {
      const solar = ctx.createLinearGradient(-5, 0, 5, 0);
      solar.addColorStop(0, "#ff3d20");
      solar.addColorStop(0.48, "#fffbd0");
      solar.addColorStop(1, "#ff9d27");
      ctx.shadowColor = "#ff9d27";
      ctx.shadowBlur = 19;
      ctx.fillStyle = solar;
      ctx.fillRect(-4, -18, 8, 27);
      for (let eruption = 0; eruption < 3; eruption += 1) {
        const side = eruption % 2 ? -1 : 1;
        const radius = 2 + ((age / 70 + eruption) % 3);
        ctx.strokeStyle = eruption % 2 ? "#fffbd0" : "#ff9d27";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(side * (4 + radius), -14 + eruption * 9, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (style === "cryo-shard") {
      const cryo = ctx.createLinearGradient(-5, 0, 5, 0);
      cryo.addColorStop(0, "#4a75ff");
      cryo.addColorStop(0.5, "#ffffff");
      cryo.addColorStop(1, "#8cf7ff");
      ctx.shadowColor = "#8cf7ff";
      ctx.shadowBlur = 18;
      ctx.fillStyle = cryo;
      ctx.fillRect(-3, -18, 6, 27);
      [-12, -2, 6].forEach((shardY, index) => {
        ctx.save();
        ctx.translate((index % 2 ? -1 : 1) * (5 + pulse * 3), shardY);
        ctx.rotate(Math.PI / 4 + age / 220);
        ctx.fillStyle = index % 2 ? "#ffffff" : "#8cf7ff";
        ctx.fillRect(-3, -3, 6, 6);
        ctx.restore();
      });
    } else if (style === "obsidian") {
      ctx.shadowColor = "#d9aa42";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#020205";
      ctx.strokeStyle = "#d9aa42";
      ctx.lineWidth = 1.5;
      ctx.fillRect(-4, -19, 8, 29);
      ctx.strokeRect(-4, -19, 8, 29);
      ctx.fillStyle = "#fff1a1";
      for (let mark = -16; mark < 8; mark += 7) {
        const offset = ((age / 35 + mark) % 7) - 3;
        ctx.fillRect(-2, mark + offset, 4, 1.5);
        ctx.fillRect(mark % 2 ? -4 : 2, mark + 2 + offset, 2, 2);
      }
    } else if (style === "dark-matter") {
      const matter = ctx.createRadialGradient(0, -4, 1, 0, -4, 12 + pulse * 3);
      matter.addColorStop(0, "#020106");
      matter.addColorStop(0.45, "#32104f");
      matter.addColorStop(0.72, "#642299");
      matter.addColorStop(1, "rgba(208,129,255,0)");
      ctx.fillStyle = matter;
      ctx.beginPath();
      ctx.ellipse(0, -4, 12 + pulse * 3, 21, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(208,129,255,${0.35 + pulse * 0.35})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, -4, 10 + pulse * 4, 16 + pulse * 3, age / 210, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#020106";
      ctx.fillRect(-3, -18, 6, 28);
    } else if (style === "supernova") {
      ctx.shadowColor = "#fff5a5";
      ctx.shadowBlur = 24;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-3, -19, 6, 29);
      ctx.fillStyle = `rgba(255,245,165,${0.28 + pulse * 0.36})`;
      ctx.fillRect(-7, -10, 14, 3);
      ctx.fillRect(-1.5, -16, 3, 19);
    } else if (style === "hologram") {
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.58 + pulse * 0.2;
      [-4, 0, 4].forEach((offset, index) => {
        ctx.fillStyle = index === 0 ? "#6ff5ff" : index === 2 ? "#ff65dc" : "rgba(255,255,255,.55)";
        for (let segment = -18; segment < 9; segment += 6) {
          ctx.fillRect(offset - 1.5 + (index === 1 ? Math.sin(age / 45) * 2 : 0), segment + ((age / 24) % 6), 3, 4);
        }
      });
    } else if (style === "black-hole") {
      ctx.shadowColor = "#b054ff";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#b054ff";
      ctx.lineWidth = 2;
      ctx.fillRect(-4 + pulse * 2, -20, 8 - pulse * 4, 31);
      ctx.strokeRect(-5 + pulse, -20, 10 - pulse * 2, 31);
      for (let orbit = 0; orbit < 7; orbit += 1) {
        const cycle = ((age / 460) + orbit / 7) % 1;
        const radius = 18 * (1 - cycle);
        const angle = age / 120 + orbit * 1.7;
        ctx.fillStyle = orbit % 3 === 0 ? "#ffffff" : "#b054ff";
        ctx.globalAlpha = 0.25 + cycle * 0.75;
        ctx.fillRect(Math.cos(angle) * radius - 1.5, -4 + Math.sin(angle) * radius * 0.82 - 1.5, 3, 3);
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function drawStarLaserImpacts(ctx, now = performance.now()) {
    star.laserImpacts.forEach((impact) => {
      const progress = Math.max(0, Math.min(1, (now - impact.startedAt) / impact.duration));
      const fade = 1 - progress;
      ctx.save();
      ctx.translate(impact.x, impact.y);
      ctx.globalAlpha = fade;
      ctx.shadowBlur = 18;
      ctx.shadowColor = impact.edgeColor || impact.color;
      if (impact.style === "supernova") {
        const radius = 8 + progress * 58;
        ctx.strokeStyle = progress < 0.45 ? "#ffffff" : "#ff6949";
        ctx.lineWidth = 5 - progress * 3.5;
        for (let ray = 0; ray < 12; ray += 1) {
          const angle = (Math.PI * 2 * ray) / 12;
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * radius * 0.18, Math.sin(angle) * radius * 0.18);
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(255,255,255,${fade * 0.72})`;
        ctx.beginPath();
        ctx.arc(0, 0, 18 * fade, 0, Math.PI * 2);
        ctx.fill();
      } else if (impact.style === "black-hole") {
        ctx.strokeStyle = "#b054ff";
        ctx.lineWidth = 3;
        for (let ring = 0; ring < 3; ring += 1) {
          const radius = Math.max(2, 34 * (1 - progress) + ring * 7);
          ctx.globalAlpha = fade * (0.85 - ring * 0.2);
          ctx.beginPath();
          ctx.ellipse(0, 0, radius, radius * 0.42, progress * Math.PI + ring, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(0, 0, 11 * fade, 0, Math.PI * 2);
        ctx.fill();
      } else if (impact.style === "dark-matter") {
        ctx.strokeStyle = "#d081ff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, 8 + progress * 30, 5 + progress * 13, progress * 3.2, 0, Math.PI * 2);
        ctx.stroke();
      } else if (impact.style === "cryo-shard" || impact.style === "ice-blue") {
        ctx.fillStyle = impact.edgeColor || "#8cf7ff";
        for (let shard = 0; shard < 8; shard += 1) {
          const angle = (Math.PI * 2 * shard) / 8;
          const distance = 4 + progress * 28;
          ctx.save();
          ctx.translate(Math.cos(angle) * distance, Math.sin(angle) * distance);
          ctx.rotate(angle + Math.PI / 4);
          ctx.fillRect(-3, -3, 6, 6);
          ctx.restore();
        }
      } else {
        ctx.strokeStyle = impact.edgeColor || impact.color || "#49f4ff";
        ctx.lineWidth = 4 - progress * 2;
        ctx.beginPath();
        ctx.arc(0, 0, 5 + progress * 28, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    });
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

    const laserNow = performance.now();
    star.bullets.forEach((b) => drawStarLaserBullet(ctx, b, laserNow));
    star.enemyBullets.forEach((b) => {
      ctx.shadowBlur = 14;
      ctx.shadowColor = "#ff5275";
      ctx.fillStyle = "#ff5275";
      ctx.fillRect(b.x - 2, b.y - 2, 4, 16);
    });
    ctx.shadowBlur = 0;
    drawStarLaserImpacts(ctx, laserNow);

    star.particles.forEach((p) => {
      const totalLife = p.totalLife || 24;
      const lifeRatio = Math.max(0, p.life / totalLife);
      ctx.globalAlpha = lifeRatio;
      ctx.fillStyle = p.color;
      if (p.kind === "vapor") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, (p.size || 4) * (1.35 - lifeRatio * 0.45), 0, Math.PI * 2);
        ctx.fill();
      } else if (p.kind === "shard") {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.spin || 0) + (1 - lifeRatio) * Math.PI);
        const size = p.size || 3;
        ctx.fillRect(-size / 2, -size / 2, size, size);
        ctx.restore();
      } else if (p.kind === "matter") {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (p.size || 3) * lifeRatio, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (p.kind === "hologram") {
        ctx.globalCompositeOperation = "screen";
        ctx.fillRect(p.x - (p.size || 4), p.y, (p.size || 4) * 2, 2);
        ctx.globalCompositeOperation = "source-over";
      } else {
        const size = p.size || 3;
        ctx.fillRect(p.x, p.y, size, size);
      }
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
    prepareCasperRun("stack");
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
    releaseCasperRun();
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
    const base = stack.tower[stack.tower.length - 1];
    const previousPosition = active[stack.axis];
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
    if (casperHasGameplayControl("stack")) {
      const target = base[stack.axis];
      const crossedTarget = (previousPosition - target) * (active[stack.axis] - target) <= 0;
      const closeEnough = Math.abs(active[stack.axis] - target) <= Math.max(5, stack.speed * dt * 0.72);
      if (crossedTarget || closeEnough) {
        active[stack.axis] = target;
        placeStackBlock();
        return;
      }
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
      cosmeticParticles: [],
      cosmeticEvent: null,
      popups: [],
      tombstoneArmed: false,
      tombstoneUsed: false,
      ghostTicks: 0,
      reviveFlashTicks: 0,
      reviveReason: "",
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
    const booster = getEquippedBoosterItem("snake");
    snake.running = true;
    snake.paused = false;
    snake.tombstoneArmed = booster?.effect === "tombstone";
    snake.runStartedAt = Date.now();
    syncSnakeButtons();
    renderSnakeStats();
    playTone("tap");
    playGameTheme("snake", { restart: true });
    if (snake.tombstoneArmed) showToast("Tombstone Armed", "One fatal collision will resurrect your snake.", "win", 3600);
    snakeTimer = setInterval(tickSnake, GAME_TICK_MS);
    prepareCasperRun("snake");
  }

  function stopSnake() {
    if (snakeTimer) {
      clearInterval(snakeTimer);
      snakeTimer = null;
    }
    snake.running = false;
    snake.paused = false;
    syncSnakeButtons();
    el.snakeStage?.classList.remove("score-visible");
    el.snakeLiveScorebar?.classList.remove("is-visible");
    el.snakeLiveScorebar?.setAttribute("aria-hidden", "true");
    releaseCasperRun();
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
    if (casperHasGameplayControl("snake")) return;
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

  function casperSnakeOpenArea(start, occupied) {
    const startKey = `${start.x}:${start.y}`;
    if (occupied.has(startKey)) return 0;
    const queue = [start];
    const seen = new Set([startKey]);
    for (let index = 0; index < queue.length; index += 1) {
      const cell = queue[index];
      [
        { x: cell.x + 1, y: cell.y },
        { x: cell.x - 1, y: cell.y },
        { x: cell.x, y: cell.y + 1 },
        { x: cell.x, y: cell.y - 1 }
      ].forEach((next) => {
        const key = `${next.x}:${next.y}`;
        if (next.x < 0 || next.y < 0 || next.x >= GRID_SIZE || next.y >= GRID_SIZE || occupied.has(key) || seen.has(key)) return;
        seen.add(key);
        queue.push(next);
      });
    }
    return seen.size;
  }

  function snakeCollisionBody(next) {
    const eating = next.x === snake.food.x && next.y === snake.food.y;
    return eating ? snake.body : snake.body.slice(0, -1);
  }

  function snakeHitsSelf(next) {
    return snakeCollisionBody(next).some((part) => part.x === next.x && part.y === next.y);
  }

  function casperSnakeCanReach(start, target, occupied) {
    const targetKey = `${target.x}:${target.y}`;
    const blocked = new Set(occupied);
    blocked.delete(targetKey);
    const startKey = `${start.x}:${start.y}`;
    if (blocked.has(startKey)) return false;
    const queue = [start];
    const seen = new Set([startKey]);
    for (let index = 0; index < queue.length; index += 1) {
      const cell = queue[index];
      if (cell.x === target.x && cell.y === target.y) return true;
      [
        { x: cell.x + 1, y: cell.y },
        { x: cell.x - 1, y: cell.y },
        { x: cell.x, y: cell.y + 1 },
        { x: cell.x, y: cell.y - 1 }
      ].forEach((next) => {
        const key = `${next.x}:${next.y}`;
        if (next.x < 0 || next.y < 0 || next.x >= GRID_SIZE || next.y >= GRID_SIZE || blocked.has(key) || seen.has(key)) return;
        seen.add(key);
        queue.push(next);
      });
    }
    return false;
  }

  function casperSnakeFutureExitCount(next, direction, bodyAfterMove) {
    const occupied = new Set(bodyAfterMove.slice(0, -1).map((part) => `${part.x}:${part.y}`));
    occupied.delete(`${next.x}:${next.y}`);
    return [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 0, y: -1 }
    ].filter((candidate) => {
      if (candidate.x + direction.x === 0 && candidate.y + direction.y === 0) return false;
      const cell = { x: next.x + candidate.x, y: next.y + candidate.y };
      return cell.x >= 0 && cell.y >= 0 && cell.x < GRID_SIZE && cell.y < GRID_SIZE && !occupied.has(`${cell.x}:${cell.y}`);
    }).length;
  }

  function runCasperSnake() {
    if (!casperHasGameplayControl("snake")) return;
    const head = snake.body[0];
    const current = snake.direction || { x: 1, y: 0 };
    const directions = [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 0, y: -1 }
    ];
    const options = directions.flatMap((direction) => {
      if (direction.x + current.x === 0 && direction.y + current.y === 0) return [];
      const next = { x: head.x + direction.x, y: head.y + direction.y };
      if (next.x < 0 || next.y < 0 || next.x >= GRID_SIZE || next.y >= GRID_SIZE) return [];
      const eating = next.x === snake.food.x && next.y === snake.food.y;
      const body = snakeCollisionBody(next);
      const occupied = new Set(body.map((part) => `${part.x}:${part.y}`));
      if (occupied.has(`${next.x}:${next.y}`) && snake.ghostTicks <= 0) return [];
      occupied.delete(`${next.x}:${next.y}`);
      const area = casperSnakeOpenArea(next, occupied);
      const tail = snake.body[snake.body.length - 1];
      const tailReachable = casperSnakeCanReach(next, tail, occupied);
      const bodyAfterMove = [next, ...body];
      const futureExitCount = casperSnakeFutureExitCount(next, direction, bodyAfterMove);
      const distanceToFood = Math.abs(next.x - snake.food.x) + Math.abs(next.y - snake.food.y);
      const roomNeeded = Math.min(GRID_SIZE * GRID_SIZE - snake.body.length, snake.body.length + 4);
      const crampedPenalty = area < roomNeeded ? 900 : 0;
      const tailPenalty = snake.body.length > 6 && !tailReachable ? 1200 : 0;
      const exitPenalty = futureExitCount === 0 ? 2400 : futureExitCount === 1 ? 120 : 0;
      const edgePenalty = (next.x === 0 || next.y === 0 || next.x === GRID_SIZE - 1 || next.y === GRID_SIZE - 1) ? 8 : 0;
      const straightBonus = direction.x === current.x && direction.y === current.y ? 3 : 0;
      const score = Math.min(120, area) * 5 - distanceToFood * 11 + (eating ? 360 : 0) - crampedPenalty - tailPenalty - exitPenalty - edgePenalty + straightBonus;
      return [{ direction, score }];
    });
    if (!options.length) return;
    options.sort((a, b) => b.score - a.score);
    const chosen = options[0].direction;
    snake.directionQueue = [chosen];
    snake.nextDirection = chosen;
  }

  function tickSnake() {
    if (snake.paused) return;

    runCasperSnake();

    if (snake.directionQueue?.length) {
      snake.nextDirection = snake.directionQueue.shift();
    }
    snake.direction = snake.nextDirection;
    const head = snake.body[0];
    let next = { x: head.x + snake.direction.x, y: head.y + snake.direction.y };
    let hitWall = next.x < 0 || next.y < 0 || next.x >= GRID_SIZE || next.y >= GRID_SIZE;
    let hitSelf = !hitWall && snakeHitsSelf(next);

    if (hitWall && activateSnakeTombstone("wall")) {
      const rebound = { x: -snake.direction.x, y: -snake.direction.y };
      snake.direction = rebound;
      snake.nextDirection = rebound;
      snake.directionQueue = [];
      next = { x: head.x + rebound.x, y: head.y + rebound.y };
      hitWall = false;
      hitSelf = snakeHitsSelf(next);
    } else if (hitSelf && snake.ghostTicks <= 0) {
      activateSnakeTombstone("self");
    }

    if (hitWall || (hitSelf && snake.ghostTicks <= 0)) {
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
      triggerSnakeSkinMilestone(snake.score);
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
    snake.cosmeticParticles = snake.cosmeticParticles
      .map((p) => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        rotation: (p.rotation || 0) + (p.spin || 0),
        life: p.life - 1
      }))
      .filter((p) => p.life > 0);
    if (snake.cosmeticEvent && performance.now() >= snake.cosmeticEvent.endsAt) snake.cosmeticEvent = null;
    if (snake.ghostTicks > 0) snake.ghostTicks -= 1;
    if (snake.reviveFlashTicks > 0) snake.reviveFlashTicks -= 1;
  }

  function activateSnakeTombstone(reason) {
    if (!snake.tombstoneArmed || snake.tombstoneUsed) return false;
    const booster = consumeTombstoneBooster();
    if (!booster) return false;

    snake.tombstoneArmed = false;
    snake.tombstoneUsed = true;
    snake.reviveReason = reason;
    snake.reviveFlashTicks = 11;
    snake.ghostTicks = reason === "wall" ? Math.max(8, snake.body.length + 2) : 14;
    snake.popups.push({
      x: snake.body[0].x,
      y: snake.body[0].y,
      life: 12,
      text: reason === "wall" ? "REBOUND!" : "GHOST!"
    });

    playTombstoneResurrectionSound();
    showToast(
      "Tombstone Resurrection",
      reason === "wall" ? "Fatal wall crash reversed. You are alive again." : "Fatal self-crash phased through. You are alive again.",
      "win",
      4200
    );
    return true;
  }

  function consumeTombstoneBooster() {
    const booster = getStoreItem("tombstone_snake");
    if (!booster) return null;
    state.boosterCooldowns[booster.boost] = Date.now() + 10 * 60 * 1000;
    if (state.equippedBooster === booster.boost) state.equippedBooster = null;
    state.boosterUses += 1;
    if (!state.boosterLevelTarget || state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
    unlockEarnedAchievements();
    saveState();
    return booster;
  }

  function playTombstoneResurrectionSound() {
    playToneAt(180, 0.14, "sawtooth", 0.055);
    setTimeout(() => playToneAt(360, 0.12, "square", 0.06), 105);
    setTimeout(() => playToneAt(720, 0.18, "square", 0.065), 210);
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

  function getEquippedSnakeSkin() {
    const skin = getStoreItem(state.equippedSnakeSkin);
    return skin?.slot === "snake_skin" && state.owned.includes(skin.id) ? skin : null;
  }

  function snakeEvolutionStage(skin = getEquippedSnakeSkin()) {
    if (!skin?.evolution) return 0;
    return Math.min(5, Math.floor(snake.score / 6) + 1);
  }

  function addSnakeCosmeticParticle(particle) {
    const life = Math.max(1, Number(particle.life) || 12);
    snake.cosmeticParticles.push({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      rotation: 0,
      spin: 0,
      size: 0.16,
      color: "#ffffff",
      shape: "dot",
      ...particle,
      life,
      maxLife: life
    });
  }

  function playRoyalSnakeFanfare() {
    [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
      setTimeout(() => playToneAt(frequency, index === 3 ? 0.22 : 0.13, "triangle", 0.028), index * 105);
    });
  }

  function triggerSnakeSkinMilestone(score) {
    const skin = getEquippedSnakeSkin();
    const milestone = Number(skin?.milestone) || 0;
    if (!skin || !milestone || score <= 0 || score % milestone !== 0) return;

    const durations = {
      snake_cowboy: 720,
      snake_cyber: 900,
      snake_plasma: 2000,
      snake_samurai: 2000,
      snake_hacker: 2000,
      snake_royal: 2000,
      snake_dragon: 1500,
      snake_obsidian: 1700,
      snake_quantum: 1800,
      snake_void: 1800
    };
    const startedAt = performance.now();
    snake.cosmeticEvent = {
      skinId: skin.id,
      score,
      startedAt,
      endsAt: startedAt + (durations[skin.id] || 1400)
    };

    const tail = snake.body[snake.body.length - 1] || snake.body[0];
    if (skin.id === "snake_cowboy") {
      for (let index = 0; index < 22; index += 1) {
        addSnakeCosmeticParticle({
          x: tail.x + 0.5,
          y: tail.y + 0.6,
          vx: (Math.random() - 0.5) * 0.22,
          vy: -0.02 - Math.random() * 0.07,
          life: 8 + Math.floor(Math.random() * 9),
          size: 0.1 + Math.random() * 0.18,
          color: index % 2 ? "#d79757" : "#7a482b",
          shape: "dust"
        });
      }
    } else if (skin.id === "snake_samurai") {
      for (let index = 0; index < 30; index += 1) {
        addSnakeCosmeticParticle({
          x: Math.random() * GRID_SIZE,
          y: -Math.random() * 7,
          vx: -0.04 + Math.random() * 0.09,
          vy: 0.18 + Math.random() * 0.16,
          life: 17 + Math.floor(Math.random() * 12),
          size: 0.12 + Math.random() * 0.11,
          rotation: Math.random() * Math.PI,
          spin: 0.18 + Math.random() * 0.2,
          color: index % 3 ? "#ff9fc5" : "#fff1f7",
          shape: "petal"
        });
      }
    } else if (skin.id === "snake_royal") {
      for (let index = 0; index < 28; index += 1) {
        const part = snake.body[index % snake.body.length];
        addSnakeCosmeticParticle({
          x: part.x + 0.25 + Math.random() * 0.5,
          y: part.y + 0.6,
          vx: (Math.random() - 0.5) * 0.045,
          vy: 0.1 + Math.random() * 0.1,
          life: 12 + Math.floor(Math.random() * 9),
          size: 0.07 + Math.random() * 0.1,
          color: index % 3 ? "#ffd13d" : "#ffffff",
          shape: "gold"
        });
      }
      playRoyalSnakeFanfare();
    } else if (["snake_dragon", "snake_quantum"].includes(skin.id)) {
      for (let index = 0; index < 24; index += 1) {
        const angle = (Math.PI * 2 * index) / 24;
        addSnakeCosmeticParticle({
          x: tail.x + 0.5,
          y: tail.y + 0.5,
          vx: Math.cos(angle) * (0.05 + Math.random() * 0.15),
          vy: Math.sin(angle) * (0.05 + Math.random() * 0.15),
          life: 10 + Math.floor(Math.random() * 8),
          size: 0.07 + Math.random() * 0.11,
          color: skin.id === "snake_dragon" ? (index % 2 ? "#ffcf4a" : "#ff4f2f") : (index % 2 ? "#62e8ff" : "#b25cff"),
          shape: skin.id === "snake_dragon" ? "flame" : "quantum"
        });
      }
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
    const supportedGames = Array.isArray(item.games) ? item.games : item.game ? [item.game] : [];
    if (supportedGames.length && !supportedGames.includes(game)) return null;
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

  function snakeSegmentColors(index, now) {
    const skin = getEquippedSnakeSkin();
    if (!skin) {
      return index === 0
        ? { start: "#49f4ff", end: "#ff2fad", glow: "#ff2fad" }
        : { start: "#57ff9a", end: "#1fd36f", glow: "#57ff9a" };
    }
    if (skin.rainbow) {
      const hue = (now / 18 + index * 31) % 360;
      return {
        start: `hsl(${hue} 100% 72%)`,
        end: `hsl(${(hue + 62) % 360} 92% 52%)`,
        glow: `hsl(${(hue + 28) % 360} 100% 64%)`
      };
    }
    if (skin.id === "snake_quantum") {
      const phase = Math.sin(now / 82 + index * 1.7);
      return phase > 0
        ? { start: "#f8ffff", end: "#51e4ff", glow: "#51e4ff" }
        : { start: "#dfbaff", end: "#793cff", glow: "#b25cff" };
    }
    if (skin.id === "snake_void") {
      return { start: index === 0 ? "#17131f" : "#07070a", end: "#000000", glow: index === 0 ? "#ffffff" : "#381354" };
    }
    if (skin.id === "snake_obsidian") {
      return { start: index === 0 ? "#40382e" : "#181619", end: "#030305", glow: "#d5a93b" };
    }
    if (skin.id === "snake_dragon") {
      const stage = snakeEvolutionStage(skin);
      const stageColors = [
        ["#fff08a", "#ff994d", "#7b2637"],
        ["#fff1a1", "#ff7549", "#791633"],
        ["#ffe86b", "#ff593d", "#611127"],
        ["#fff8cb", "#ff4938", "#3e0a1d"],
        ["#ffffff", "#ffca40", "#9b1325"]
      ][Math.max(0, stage - 1)];
      return index === 0
        ? { start: stageColors[0], end: stageColors[1], glow: stage >= 4 ? "#ffffff" : stageColors[1] }
        : { start: stageColors[1], end: stageColors[2], glow: stage >= 5 ? "#ff5a2f" : stageColors[1] };
    }
    const colors = skin.colors || ["#49f4ff", "#57ff9a", "#1fd36f"];
    return index === 0
      ? { start: colors[0], end: colors[1], glow: colors[0] }
      : { start: colors[1], end: colors[2], glow: colors[1] };
  }

  function snakeCosmeticEventProgress(event, now) {
    if (!event || event.endsAt <= event.startedAt) return 1;
    return Math.max(0, Math.min(1, (now - event.startedAt) / (event.endsAt - event.startedAt)));
  }

  function drawSnakeCosmeticBackdrop(ctx, size, cell, skin, event, now) {
    if (!skin || !event || event.skinId !== skin.id) return;
    const progress = snakeCosmeticEventProgress(event, now);
    const fade = Math.sin(Math.PI * progress);
    ctx.save();

    if (skin.id === "snake_cyber") {
      const frame = Math.floor(now / 58);
      for (let index = 0; index < 24; index += 1) {
        const x = ((index * 83 + frame * 31) % 457) + 4;
        const y = ((index * 47 + frame * 19) % 451) + 4;
        const width = 5 + ((index * 7) % 31);
        ctx.globalAlpha = (0.16 + (index % 4) * 0.08) * fade;
        ctx.fillStyle = index % 2 ? "#49f4ff" : "#ff2fad";
        ctx.fillRect(x, y, width, 2 + (index % 3));
      }
      ctx.globalAlpha = 0.2 * fade;
      ctx.fillStyle = frame % 2 ? "#49f4ff" : "#ff2fad";
      ctx.fillRect(0, (frame * 37) % size, size, 4);
    }

    if (skin.id === "snake_cowboy" && progress < 0.72) {
      const head = snake.body[0];
      const bubbleX = Math.min(size - 112, Math.max(8, (head.x + 0.5) * cell + 14));
      const bubbleY = Math.max(36, (head.y + 0.5) * cell - 32);
      ctx.globalAlpha = Math.min(1, fade * 2.2);
      ctx.fillStyle = "rgba(255, 247, 214, 0.94)";
      ctx.strokeStyle = "#7a482b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(bubbleX, bubbleY - 27, 100, 30, 9);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#3a1e12";
      ctx.font = "900 15px Arial Black";
      ctx.textAlign = "center";
      ctx.fillText("YEEHAW!", bubbleX + 50, bubbleY - 7);
    }

    if (skin.id === "snake_samurai") {
      ctx.globalAlpha = 0.3 + fade * 0.7;
      const sweep = -size * 0.35 + progress * size * 1.7;
      ctx.translate(size / 2, size / 2);
      ctx.rotate(-0.55);
      const slash = ctx.createLinearGradient(sweep - 80, 0, sweep + 80, 0);
      slash.addColorStop(0, "rgba(255,255,255,0)");
      slash.addColorStop(0.48, "#ffffff");
      slash.addColorStop(0.55, "#ff4f80");
      slash.addColorStop(1, "rgba(255,79,128,0)");
      ctx.strokeStyle = slash;
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 22;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(sweep - 130, -size);
      ctx.lineTo(sweep + 130, size);
      ctx.stroke();
    }

    if (skin.id === "snake_hacker") {
      const glyphs = ["01", "FF", "A7", "0X", "C4", "10", "E9", "7B"];
      ctx.font = "700 12px Consolas, monospace";
      ctx.textAlign = "center";
      for (let column = 0; column < 15; column += 1) {
        const x = (column + 0.5) * (size / 15);
        for (let row = 0; row < 8; row += 1) {
          const y = ((row * 73 + now * (0.08 + column * 0.002) + column * 31) % (size + 80)) - 40;
          ctx.globalAlpha = (0.12 + row * 0.035) * fade;
          ctx.fillStyle = row === 7 ? "#eaffea" : "#42ff76";
          ctx.fillText(glyphs[(column + row) % glyphs.length], x, y);
        }
      }
    }

    if (skin.id === "snake_dragon") {
      const stage = snakeEvolutionStage(skin);
      ctx.globalAlpha = fade * 0.75;
      const aura = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.62);
      aura.addColorStop(0, "rgba(255,239,126,0.1)");
      aura.addColorStop(0.72, "rgba(255,66,36,0.13)");
      aura.addColorStop(1, "rgba(255,35,72,0)");
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, size, size);
      ctx.globalAlpha = Math.min(1, fade * 1.8);
      ctx.fillStyle = "#fff4bd";
      ctx.shadowColor = "#ff572f";
      ctx.shadowBlur = 18;
      ctx.font = "900 20px Arial Black";
      ctx.textAlign = "center";
      ctx.fillText(`EVOLUTION STAGE ${stage}`, size / 2, 34);
    }
    ctx.restore();
  }

  function drawQuantumSnakeShadows(ctx, cell, event, now) {
    if (!event || event.skinId !== "snake_quantum") return;
    const progress = snakeCosmeticEventProgress(event, now);
    const collapse = Math.sin(Math.PI * progress);
    [
      { x: -8 * collapse, y: 3 * collapse, color: "#ff43bc" },
      { x: 8 * collapse, y: -3 * collapse, color: "#49f4ff" },
      { x: 0, y: 8 * collapse, color: "#9d64ff" }
    ].forEach((shadow) => {
      ctx.save();
      ctx.globalAlpha = 0.12 + collapse * 0.32;
      ctx.fillStyle = shadow.color;
      ctx.shadowColor = shadow.color;
      ctx.shadowBlur = 13;
      snake.body.forEach((part) => {
        ctx.fillRect(part.x * cell + 3 + shadow.x, part.y * cell + 3 + shadow.y, cell - 6, cell - 6);
      });
      ctx.restore();
    });
  }

  function drawSnakeCosmeticParticles(ctx, cell) {
    snake.cosmeticParticles.forEach((particle) => {
      const alpha = Math.max(0, particle.life / (particle.maxLife || particle.life || 1));
      const x = particle.x * cell;
      const y = particle.y * cell;
      const radius = Math.max(2, particle.size * cell);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(particle.rotation || 0);
      ctx.fillStyle = particle.color;
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = particle.shape === "dust" ? 4 : 10;
      ctx.beginPath();
      if (particle.shape === "petal") {
        ctx.ellipse(0, 0, radius * 1.35, radius * 0.62, 0, 0, Math.PI * 2);
      } else if (particle.shape === "flame") {
        ctx.moveTo(0, -radius * 1.5);
        ctx.lineTo(radius, radius);
        ctx.lineTo(0, radius * 0.55);
        ctx.lineTo(-radius, radius);
        ctx.closePath();
      } else if (particle.shape === "quantum") {
        ctx.rect(-radius, -radius * 0.35, radius * 2, radius * 0.7);
      } else {
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();
    });
  }

  function drawSnakeSegmentDetails(ctx, part, index, cell, skin, event, now) {
    if (!skin) return;
    const x = part.x * cell + 3;
    const y = part.y * cell + 3;
    const inner = cell - 6;
    const eventActive = event?.skinId === skin.id;

    if (skin.id === "snake_cyber" && eventActive) {
      const shift = ((index + Math.floor(now / 55)) % 3 - 1) * 4;
      ctx.fillStyle = index % 2 ? "rgba(73,244,255,.72)" : "rgba(255,47,173,.72)";
      ctx.fillRect(x + shift, y + (index % 3) * 4, inner, 3);
    }

    if (skin.id === "snake_hacker" && index > 0 && eventActive) {
      ctx.fillStyle = "#eaffea";
      ctx.font = `800 ${Math.max(7, cell * 0.29)}px Consolas, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(((index * 37 + Math.floor(now / 140)) % 256).toString(16).padStart(2, "0").toUpperCase(), x + inner / 2, y + inner / 2);
    }

    if (skin.id === "snake_obsidian") {
      ctx.strokeStyle = "rgba(239,196,82,.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + inner * 0.72);
      ctx.lineTo(x + inner * 0.45, y + 4);
      ctx.lineTo(x + inner - 4, y + inner * 0.65);
      ctx.stroke();
      if (eventActive) {
        const glyphs = ["◇", "⌁", "ϟ", "△", "◈"];
        ctx.fillStyle = "#ffd86a";
        ctx.shadowColor = "#ffd13d";
        ctx.shadowBlur = 9;
        ctx.font = `900 ${Math.max(8, cell * 0.42)}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(glyphs[(index + Math.floor(now / 110)) % glyphs.length], x + inner / 2, y + inner / 2);
      }
    }

    if (skin.id === "snake_void" && eventActive) {
      const pulse = 0.52 + Math.abs(Math.sin(now / 74)) * 0.48;
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.strokeStyle = index === 0 ? "#ffffff" : index % 2 ? "#c46cff" : "#7337ad";
      ctx.shadowColor = index === 0 ? "#ffffff" : "#9f4fe2";
      ctx.shadowBlur = 10 + pulse * 14;
      ctx.lineWidth = 1.5 + pulse * 2.2;
      ctx.strokeRect(x - 1, y - 1, inner + 2, inner + 2);
      ctx.restore();
    }

    if (skin.id === "snake_dragon") {
      const stage = snakeEvolutionStage(skin);
      ctx.strokeStyle = stage >= 5 ? "rgba(255,243,166,.8)" : "rgba(255,226,111,.44)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x + inner * 0.12, y + inner * 0.62);
      ctx.lineTo(x + inner * 0.5, y + inner * 0.2);
      ctx.lineTo(x + inner * 0.88, y + inner * 0.62);
      ctx.stroke();
      if (stage >= 3 && (index === 1 || index === 2)) {
        ctx.fillStyle = "rgba(255,190,80,.78)";
        ctx.beginPath();
        ctx.moveTo(x + inner * 0.48, y + inner * 0.45);
        ctx.lineTo(x - inner * 0.45, y - inner * 0.18);
        ctx.lineTo(x + inner * 0.12, y + inner * 0.82);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + inner * 0.52, y + inner * 0.45);
        ctx.lineTo(x + inner * 1.45, y - inner * 0.18);
        ctx.lineTo(x + inner * 0.88, y + inner * 0.82);
        ctx.fill();
      }
    }
  }

  function drawSnakeHeadCosmetic(ctx, cell, skin, event, now) {
    if (!skin?.preview || !snake.body.length) return;
    const head = snake.body[0];
    const centerX = (head.x + 0.5) * cell;
    const centerY = (head.y + 0.5) * cell;
    const direction = snake.direction || { x: 1, y: 0 };
    const eventActive = event?.skinId === skin.id;
    const forward = cell * 0.17;
    const spread = cell * 0.15;
    const eyePairs = direction.x
      ? [[centerX + direction.x * forward, centerY - spread], [centerX + direction.x * forward, centerY + spread]]
      : [[centerX - spread, centerY + direction.y * forward], [centerX + spread, centerY + direction.y * forward]];

    ctx.save();
    eyePairs.forEach(([x, y]) => {
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = skin.id === "snake_void" ? "#ffffff" : "rgba(255,255,255,.65)";
      ctx.shadowBlur = skin.id === "snake_void" ? 10 : 4;
      ctx.beginPath();
      ctx.arc(x, y, skin.id === "snake_void" ? cell * 0.07 : cell * 0.09, 0, Math.PI * 2);
      ctx.fill();
      if (skin.id !== "snake_void") {
        ctx.shadowBlur = 0;
        ctx.fillStyle = skin.id === "snake_dragon" && snakeEvolutionStage(skin) >= 4 ? "#ff2b1f" : "#12051b";
        ctx.beginPath();
        ctx.arc(x + direction.x * 1.3, y + direction.y * 1.3, cell * 0.035, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    if (skin.id === "snake_cowboy") {
      ctx.translate(centerX, centerY - cell * 0.42);
      if (eventActive) ctx.rotate((now - event.startedAt) / 42);
      ctx.fillStyle = "#532b1d";
      ctx.strokeStyle = "#f2c06d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, cell * 0.58, cell * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillRect(-cell * 0.26, -cell * 0.34, cell * 0.52, cell * 0.34);
      ctx.strokeRect(-cell * 0.26, -cell * 0.34, cell * 0.52, cell * 0.34);
    } else if (skin.id === "snake_samurai") {
      ctx.fillStyle = "#fff4ed";
      ctx.fillRect(centerX - cell * 0.42, centerY - cell * 0.31, cell * 0.84, cell * 0.16);
      ctx.fillStyle = "#ff365d";
      ctx.fillRect(centerX - cell * 0.42, centerY - cell * 0.25, cell * 0.84, cell * 0.07);
      ctx.beginPath();
      ctx.moveTo(centerX + cell * 0.4, centerY - cell * 0.24);
      ctx.lineTo(centerX + cell * 0.68, centerY - cell * 0.42);
      ctx.lineTo(centerX + cell * 0.55, centerY - cell * 0.1);
      ctx.fill();
    } else if (skin.id === "snake_hacker" && eventActive) {
      const angle = (now - event.startedAt) / 120;
      ctx.strokeStyle = "#d8ffd8";
      ctx.shadowColor = "#42ff76";
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, cell * 0.37, angle, angle + Math.PI * 1.45);
      ctx.stroke();
    } else if (skin.id === "snake_royal") {
      const flare = eventActive ? Math.sin(Math.PI * snakeCosmeticEventProgress(event, now)) : 0;
      ctx.fillStyle = "#ffd13d";
      ctx.strokeStyle = "#fff5ae";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX - cell * 0.42, centerY - cell * 0.35);
      ctx.lineTo(centerX - cell * 0.28, centerY - cell * 0.7);
      ctx.lineTo(centerX, centerY - cell * 0.43);
      ctx.lineTo(centerX + cell * 0.28, centerY - cell * 0.7);
      ctx.lineTo(centerX + cell * 0.42, centerY - cell * 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      if (flare > 0.04) {
        ctx.strokeStyle = `rgba(255,255,255,${flare})`;
        ctx.shadowColor = "#fff4a0";
        ctx.shadowBlur = 20;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - cell, centerY - cell * 0.53);
        ctx.lineTo(centerX + cell, centerY - cell * 0.53);
        ctx.moveTo(centerX, centerY - cell * 1.15);
        ctx.lineTo(centerX, centerY + cell * 0.1);
        ctx.stroke();
      }
    } else if (skin.id === "snake_dragon" && snakeEvolutionStage(skin) >= 2) {
      ctx.fillStyle = "#fff0a0";
      ctx.beginPath();
      ctx.moveTo(centerX - cell * 0.36, centerY - cell * 0.28);
      ctx.lineTo(centerX - cell * 0.56, centerY - cell * 0.78);
      ctx.lineTo(centerX - cell * 0.08, centerY - cell * 0.42);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(centerX + cell * 0.36, centerY - cell * 0.28);
      ctx.lineTo(centerX + cell * 0.56, centerY - cell * 0.78);
      ctx.lineTo(centerX + cell * 0.08, centerY - cell * 0.42);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawSnakeSkinOverlay(ctx, size, cell, skin, event, now) {
    if (!skin) return;
    const eventActive = event?.skinId === skin.id;
    if (eventActive && skin.id === "snake_plasma") {
      const tail = snake.body[snake.body.length - 1];
      const progress = snakeCosmeticEventProgress(event, now);
      for (let ring = 0; ring < 3; ring += 1) {
        const phase = (progress + ring / 3) % 1;
        ctx.save();
        ctx.globalAlpha = 1 - phase;
        ctx.strokeStyle = ring % 2 ? "#8cf7ff" : "#b56cff";
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 18;
        ctx.lineWidth = 4 - phase * 2;
        ctx.beginPath();
        ctx.arc((tail.x + 0.5) * cell, (tail.y + 0.5) * cell, cell * (0.4 + phase * 3.4), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    if (eventActive && skin.id === "snake_samurai" && snake.body.length > 2) {
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,.82)";
      ctx.shadowColor = "#ff416f";
      ctx.shadowBlur = 13;
      ctx.lineWidth = 3;
      ctx.beginPath();
      snake.body.slice(1).forEach((part, index) => {
        const x = (part.x + 0.5) * cell;
        const y = (part.y + 0.5) * cell;
        if (!index) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    }

    if (skin.id === "snake_dragon" && snakeEvolutionStage(skin) >= 5) {
      const tail = snake.body[snake.body.length - 1];
      const flicker = 0.72 + Math.sin(now / 55) * 0.18;
      ctx.save();
      ctx.globalAlpha = flicker;
      ctx.fillStyle = "#ffca38";
      ctx.shadowColor = "#ff3727";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo((tail.x + 0.5) * cell, (tail.y + 0.5) * cell);
      ctx.lineTo((tail.x + 0.12 - snake.direction.x * 0.9) * cell, (tail.y + 0.14 - snake.direction.y * 0.9) * cell);
      ctx.lineTo((tail.x + 0.88 - snake.direction.x * 0.9) * cell, (tail.y + 0.86 - snake.direction.y * 0.9) * cell);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    if (eventActive && skin.id === "snake_void") {
      const progress = snakeCosmeticEventProgress(event, now);
      const fade = Math.sin(Math.PI * progress);
      const voidGradient = ctx.createRadialGradient(size / 2, size / 2, size * (0.34 - progress * 0.05), size / 2, size / 2, size * 0.7);
      voidGradient.addColorStop(0, "rgba(4, 2, 9, 0)");
      voidGradient.addColorStop(0.58, `rgba(20, 4, 38, ${0.12 + fade * 0.12})`);
      voidGradient.addColorStop(1, `rgba(0, 0, 0, ${0.72 + fade * 0.22})`);
      ctx.save();
      ctx.fillStyle = voidGradient;
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = `rgba(180, 99, 255, ${0.22 + fade * 0.5})`;
      ctx.lineWidth = 8 + fade * 9;
      ctx.strokeRect(2, 2, size - 4, size - 4);
      ctx.restore();
    }

    drawSnakeCosmeticParticles(ctx, cell);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
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

    const skin = getEquippedSnakeSkin();
    const cosmeticEvent = snake.cosmeticEvent;
    drawSnakeCosmeticBackdrop(ctx, size, cell, skin, cosmeticEvent, now);

    const ghostActive = snake.ghostTicks > 0;
    if (!ghostActive && skin?.id === "snake_quantum") drawQuantumSnakeShadows(ctx, cell, cosmeticEvent, now);
    ctx.save();
    if (ghostActive) {
      ctx.globalAlpha = 0.3 + Math.abs(Math.sin(now / 85)) * 0.24;
      ctx.globalCompositeOperation = "screen";
    }
    snake.body.forEach((part, index) => {
      const x = part.x * cell + 3;
      const y = part.y * cell + 3;
      const colors = ghostActive
        ? { start: "#e7f8ff", end: "#8cf7ff", glow: "#c471ff" }
        : snakeSegmentColors(index, now);
      const g = ctx.createLinearGradient(x, y, x + cell, y + cell);
      g.addColorStop(0, colors.start);
      g.addColorStop(1, colors.end);
      ctx.fillStyle = g;
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = index === 0 ? 20 : 9;
      ctx.fillRect(x, y, cell - 6, cell - 6);
      if (!ghostActive) drawSnakeSegmentDetails(ctx, part, index, cell, skin, cosmeticEvent, now);
    });
    ctx.restore();
    if (!ghostActive) drawSnakeHeadCosmetic(ctx, cell, skin, cosmeticEvent, now);
    if (!ghostActive) drawSnakeSkinOverlay(ctx, size, cell, skin, cosmeticEvent, now);

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

    if (snake.reviveFlashTicks > 0) {
      const strength = snake.reviveFlashTicks / 11;
      const flashColor = snake.reviveReason === "wall" ? "255, 47, 173" : "140, 247, 255";
      const overlay = ctx.createRadialGradient(size / 2, size / 2, size * 0.08, size / 2, size / 2, size * 0.68);
      overlay.addColorStop(0, `rgba(${flashColor}, ${0.08 + strength * 0.12})`);
      overlay.addColorStop(1, `rgba(${flashColor}, ${0.16 + strength * 0.28})`);
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = `rgba(${flashColor}, ${0.42 + strength * 0.45})`;
      ctx.lineWidth = 7;
      ctx.strokeRect(4, 4, size - 8, size - 8);

      const stoneWidth = 62;
      const stoneHeight = 70;
      const stoneX = size / 2 - stoneWidth / 2;
      const stoneY = size * 0.18;
      ctx.save();
      ctx.shadowColor = snake.reviveReason === "wall" ? "#ff2fad" : "#8cf7ff";
      ctx.shadowBlur = 24;
      ctx.fillStyle = "rgba(18, 12, 29, 0.9)";
      ctx.beginPath();
      ctx.roundRect(stoneX, stoneY, stoneWidth, stoneHeight, [28, 28, 8, 8]);
      ctx.fill();
      ctx.strokeStyle = snake.reviveReason === "wall" ? "#ff75cf" : "#b9fbff";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 17px Arial Black";
      ctx.textAlign = "center";
      ctx.fillText("RIP", size / 2, stoneY + 39);
      ctx.font = "900 24px Arial Black";
      ctx.fillText(snake.reviveReason === "wall" ? "REBOUND" : "GHOST MODE", size / 2, stoneY + stoneHeight + 39);
      ctx.restore();
      ctx.textAlign = "left";
    }

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
    el.snakeStage?.classList.toggle("score-visible", snake.running);
    el.snakeLiveScorebar?.classList.toggle("is-visible", snake.running);
    el.snakeLiveScorebar?.setAttribute("aria-hidden", snake.running ? "false" : "true");
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
    const boosterUsed = getEquippedBoosterItem("snake");
    let earned = applyRewardBooster(calculateSnakeXp());
    let coinsEarned = previewCoins(newBest);

    state.stats.gamesPlayed += 1;
    state.stats.snakeRuns += 1;
    state.stats.snakeTotalScore += snake.score;
    state.stats.snakeBest = Math.max(previousBest, snake.score);

    const shouldConsumeBooster = boosterUsed && boosterUsed.effect !== "tombstone";
    if (shouldConsumeBooster) {
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
    if (shouldConsumeBooster && state.level >= state.boosterLevelTarget) {
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
    prepareCasperRun("flappy");
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
    releaseCasperRun();
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

  function runCasperFlappy() {
    if (!casperHasGameplayControl("flappy")) return;
    const bird = flappy.bird;
    const nextPipe = flappy.pipes
      .filter((pipe) => pipe.x + pipe.width >= bird.x - bird.r)
      .sort((a, b) => a.x - b.x)[0];
    const targetY = nextPipe ? (nextPipe.gapTop + nextPipe.gapBottom) / 2 + 16 : 325;
    const framesAhead = nextPipe
      ? Math.max(5, Math.min(16, ((nextPipe.x - bird.x) / Math.max(1, 168 + flappy.score * 3.6)) * 20))
      : 10;
    const gravityPerFrame = 18.5 / 60;
    const predictedY = bird.y + bird.vy * framesAhead + gravityPerFrame * framesAhead * (framesAhead + 1) / 2;
    const upperLimit = nextPipe ? nextPipe.gapTop + bird.r + 12 : 72;
    const shouldFlap = predictedY > targetY + 8
      || bird.y > targetY + 26
      || bird.y + bird.r > 620;
    const safeFlapApex = bird.y - 82 > upperLimit;
    if (shouldFlap && safeFlapApex && bird.vy > -0.35) flapBird();
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

    runCasperFlappy();

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
      deathReason: "crash",
      score: 0,
      cameraDepth: 0,
      cameraFloor: 0,
      furthestDepth: 0,
      nextLaneDepth: -2,
      pathCol: 4,
      section: 0,
      bestLive: 0,
      galaxyOffsetX: 0,
      galaxyOffsetY: 0,
      player: {
        col: 4,
        depth: 0,
        x: 270,
        y: CROSSY_START_Y,
        targetX: 270,
        targetY: CROSSY_START_Y,
        size: 34,
        hopActive: false,
        hopStartedAt: 0,
        facing: 1
      },
      cars: [],
      lanes: [],
      decor: [],
      particles: [],
      cosmeticEffects: [],
      tombstoneArmed: false,
      tombstoneUsed: false,
      ghostUntil: 0,
      reviveFlashStartedAt: 0,
      reviveFlashUntil: 0,
      reviveReason: "",
      rescuing: false,
      rescueTarget: null,
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
    crossy.cars = [];
    crossy.lanes = [];
    crossy.decor = [];
    crossy.nextLaneDepth = -2;
    crossy.pathCol = 4;
    ensureCrossyWorld(13);
  }

  function createCrossyCorridor(currentCol, depth, roll = Math.random()) {
    const entryCol = Math.max(0, Math.min(8, Number.isFinite(currentCol) ? currentCol : 4));
    const shift = depth <= 1 ? 0 : Math.floor(roll * 3) - 1;
    const exitCol = Math.max(0, Math.min(8, entryCol + shift));
    const columns = [];
    for (let col = Math.min(entryCol, exitCol); col <= Math.max(entryCol, exitCol); col += 1) columns.push(col);
    return { entryCol, exitCol, columns };
  }

  function chooseCrossyObstacleColumns(reservedColumns, count, random = Math.random) {
    const reserved = new Set(reservedColumns);
    const available = Array.from({ length: 9 }, (_, col) => col).filter((col) => !reserved.has(col));
    for (let index = available.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [available[index], available[swapIndex]] = [available[swapIndex], available[index]];
    }
    return available.slice(0, Math.min(count, available.length));
  }

  function createCrossyLane(depth) {
    let type = "grass";
    if (depth > 1) {
      let roadRun = 0;
      let forestRun = 0;
      for (let index = crossy.lanes.length - 1; index >= 0 && crossy.lanes[index].type === "road"; index -= 1) roadRun += 1;
      for (let index = crossy.lanes.length - 1; index >= 0 && crossy.lanes[index].type === "forest"; index -= 1) forestRun += 1;
      const roll = Math.random();
      if (roadRun) type = roadRun < 3 && roll < 0.6 ? "road" : roll < 0.8 ? "grass" : "forest";
      else if (forestRun) type = forestRun < 2 && roll < 0.34 ? "forest" : roll < 0.76 ? "grass" : "road";
      else type = roll < 0.58 ? "road" : roll < 0.78 ? "forest" : "grass";
    }

    const corridor = createCrossyCorridor(crossy.pathCol, depth);
    const lane = { depth, type, pathEntry: corridor.entryCol, pathExit: corridor.exitCol };
    crossy.pathCol = corridor.exitCol;
    if (type === "road") {
      const palette = ["#d94b45", "#d7cf48", "#78b14b", "#4fb5ff", "#ff8a35", "#c46cff"];
      const difficulty = Math.min(92, Math.floor(Math.max(0, depth) / 10) * 9);
      const direction = Math.random() < 0.5 ? -1 : 1;
      const vehicle = Math.random() < 0.32 ? "truck" : "car";
      const count = vehicle === "truck" ? (Math.random() < 0.45 ? 2 : 3) : (Math.random() < 0.68 ? 2 : 3);
      lane.speed = direction * (126 + Math.random() * 74 + difficulty);
      lane.color = palette[Math.floor(Math.random() * palette.length)];
      lane.vehicle = vehicle;
      lane.count = count;
      const spacing = 540 / count;
      for (let i = 0; i < count; i += 1) {
        crossy.cars.push({
          depth,
          x: (i * spacing + Math.random() * 88) % 620 - 40,
          width: vehicle === "truck" ? 104 + Math.random() * 18 : 64 + Math.random() * 18,
          speed: lane.speed,
          color: lane.color,
          vehicle
        });
      }
    } else {
      const reserved = new Set(corridor.columns);
      if (depth <= 1) [3, 4, 5].forEach((col) => reserved.add(col));
      const count = type === "forest" ? 4 + Math.floor(Math.random() * 2) : 2 + Math.floor(Math.random() * 2);
      chooseCrossyObstacleColumns(reserved, count).forEach((col, index) => {
        crossy.decor.push({
          depth,
          col,
          kind: index % 3 === 0 ? "rock" : "tree",
          scale: 0.86 + Math.random() * 0.28
        });
      });
      crossy.decor = crossy.decor.filter((item) => item.depth !== depth || !corridor.columns.includes(item.col));
    }
    crossy.lanes.push(lane);
  }

  function ensureCrossyWorld(targetDepth = Math.ceil(Math.max(crossy.cameraDepth, crossy.player.depth) + 12)) {
    while (crossy.nextLaneDepth <= targetDepth) {
      createCrossyLane(crossy.nextLaneDepth);
      crossy.nextLaneDepth += 1;
    }
    const oldestDepth = Math.floor(crossy.cameraDepth) - 3;
    crossy.lanes = crossy.lanes.filter((lane) => lane.depth >= oldestDepth);
    crossy.cars = crossy.cars.filter((car) => car.depth >= oldestDepth);
    crossy.decor = crossy.decor.filter((item) => item.depth >= oldestDepth);
  }

  function crossyScreenY(depth) {
    return CROSSY_START_Y - (depth - crossy.cameraDepth) * CROSSY_LANE_HEIGHT;
  }

  function startCrossy() {
    resetCrossy();
    const booster = getEquippedBoosterItem("crossy");
    crossy.running = true;
    crossy.tombstoneArmed = booster?.effect === "tombstone";
    crossy.startedAt = Date.now();
    crossy.lastFrame = performance.now();
    playTone("tap");
    playGameTheme("crossy", { restart: true, volume: 0.4 });
    crossyTimer = setInterval(tickCrossy, CROSSY_TICK_MS);
    prepareCasperRun("crossy");
    renderCrossyStats();
    if (crossy.tombstoneArmed) {
      showToast("Tombstone Armed", "One traffic hit or danger-edge catch will resurrect your runner.", "win", 3600);
    }
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
    releaseCasperRun();
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
        const pausedFor = Date.now() - crossy.pausedAt;
        crossy.pausedMs += pausedFor;
        if (crossy.ghostUntil) crossy.ghostUntil += pausedFor;
        if (crossy.reviveFlashUntil) {
          crossy.reviveFlashStartedAt += pausedFor;
          crossy.reviveFlashUntil += pausedFor;
        }
        crossy.pausedAt = 0;
      }
      crossy.lastFrame = performance.now();
    }
    renderCrossyStats();
    drawCrossy();
  }

  function moveCrossy(direction) {
    if (!crossy.running || crossy.paused || crossy.dying || crossy.rescuing) return;
    const player = crossy.player;
    const next = { col: player.col, depth: player.depth };
    if (direction === "up") next.depth += 1;
    if (direction === "down") next.depth -= 1;
    if (direction === "left") next.col -= 1;
    if (direction === "right") next.col += 1;
    next.col = Math.max(0, Math.min(8, next.col));
    if (direction === "down" && crossyScreenY(next.depth) > 674) return;
    if (next.col === player.col && next.depth === player.depth) return;
    ensureCrossyWorld(next.depth + 12);
    if (isCrossyBlocked(next.depth, next.col)) {
      playTone("tap");
      return;
    }
    player.col = next.col;
    player.depth = next.depth;
    player.targetX = 30 + player.col * 60;
    if (direction === "left") player.facing = -1;
    if (direction === "right") player.facing = 1;
    player.hopActive = true;
    player.hopStartedAt = performance.now();
    triggerCrossyCosmeticHop(player);
    if (direction === "up") {
      crossy.furthestDepth = Math.max(crossy.furthestDepth, player.depth);
      crossy.score = Math.max(crossy.score, crossy.furthestDepth);
      crossy.section = Math.floor(crossy.score / 10);
      crossy.bestLive = Math.max(Number(state.stats.crossyBest) || 0, crossy.score);
      playTone("eat");
    }
    player.targetY = crossyScreenY(player.depth);
    renderCrossyStats();
  }

  function casperCrossyCarX(car, secondsAhead) {
    let x = car.x + car.speed * secondsAhead;
    const span = 650 + car.width;
    while (x > 590) x -= span;
    while (x + car.width < -50) x += span;
    return x;
  }

  function casperCrossyCellSafe(depth, col, arrivalSeconds = 0.2) {
    if (col < 0 || col > 8 || isCrossyBlocked(depth, col)) return false;
    const centerX = 30 + col * 60;
    return !crossy.cars.some((car) => {
      if (car.depth !== depth) return false;
      const windowStart = Math.max(0, arrivalSeconds - 0.2);
      const samples = Array.from({ length: 4 }, (_, index) => windowStart + index * 0.09);
      return samples.some((time) => {
        const carX = casperCrossyCarX(car, time);
        return centerX + 26 > carX - 14 && centerX - 26 < carX + car.width + 14;
      });
    });
  }

  function findCasperCrossyPath() {
    const start = { col: crossy.player.col, depth: crossy.player.depth, path: [] };
    const goalDepth = start.depth + 6;
    const queue = [start];
    const seen = new Set([`${start.depth}:${start.col}`]);
    for (let index = 0; index < queue.length; index += 1) {
      const node = queue[index];
      if (node.depth >= goalDepth) return node.path;
      const lane = crossy.lanes.find((item) => item.depth === node.depth);
      const lateralTowardExit = lane && lane.pathExit !== node.col
        ? (lane.pathExit > node.col ? "right" : "left")
        : null;
      const directions = [lateralTowardExit, "up", "left", "right", "down"].filter((value, moveIndex, list) => value && list.indexOf(value) === moveIndex);
      directions.forEach((direction) => {
        const next = { col: node.col, depth: node.depth };
        if (direction === "up") next.depth += 1;
        if (direction === "down") next.depth -= 1;
        if (direction === "left") next.col -= 1;
        if (direction === "right") next.col += 1;
        if (next.depth < start.depth - 1 || next.depth > goalDepth || next.col < 0 || next.col > 8) return;
        const key = `${next.depth}:${next.col}`;
        if (seen.has(key)) return;
        const arrival = Math.max(0.14, (node.path.length + 1) * 0.2);
        const safe = node.path.length < 2
          ? casperCrossyCellSafe(next.depth, next.col, arrival)
          : !isCrossyBlocked(next.depth, next.col);
        if (!safe) return;
        seen.add(key);
        queue.push({ ...next, path: [...node.path, direction] });
      });
    }
    return null;
  }

  function runCasperCrossy(now) {
    if (!casperHasGameplayControl("crossy") || crossy.rescuing || now < casperRuntime.crossyMoveAt) return;
    const player = crossy.player;
    if (Math.abs(player.x - player.targetX) > 4 || Math.abs(player.y - player.targetY) > 4) return;
    ensureCrossyWorld(player.depth + 14);
    const path = findCasperCrossyPath();
    if (!path?.length) {
      casperRuntime.crossyMoveAt = now + 70;
      return;
    }
    casperRuntime.crossyMoveAt = now + 92;
    moveCrossy(path[0]);
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
    runCasperCrossy(now);
    const activeSeconds = Math.max(0, (Date.now() - crossy.startedAt - crossy.pausedMs) / 1000);
    if (activeSeconds > 2.25) {
      const pressureRate = Math.min(0.34, 0.17 + crossy.section * 0.012);
      crossy.cameraFloor += pressureRate * dt;
    }
    const lockDistance = (CROSSY_START_Y - CROSSY_CAMERA_LOCK_Y) / CROSSY_LANE_HEIGHT;
    const followDepth = Math.max(0, crossy.player.depth - lockDistance);
    const followStep = Math.max(0, followDepth - crossy.cameraDepth) * Math.min(1, dt * 5.2);
    crossy.cameraDepth = Math.max(crossy.cameraFloor, crossy.cameraDepth + followStep);
    crossy.cameraFloor = Math.max(crossy.cameraFloor, crossy.cameraDepth);
    ensureCrossyWorld();
    const p = crossy.player;
    const previousPlayerX = p.x;
    const previousPlayerY = p.y;
    p.targetY = crossyScreenY(p.depth);
    p.x += (p.targetX - p.x) * Math.min(1, dt * 16);
    p.y += (p.targetY - p.y) * Math.min(1, dt * 16);
    crossy.galaxyOffsetX -= (p.x - previousPlayerX) * 1.4;
    crossy.galaxyOffsetY -= (p.y - previousPlayerY) * 0.48;
    if (crossy.rescuing && Math.abs(p.x - p.targetX) < 1.5 && Math.abs(p.y - p.targetY) < 1.5) {
      p.x = p.targetX;
      p.y = p.targetY;
      crossy.rescuing = false;
      crossy.rescueTarget = null;
    }
    crossy.particles.forEach((part) => {
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      part.life -= 1;
    });
    crossy.particles = crossy.particles.filter((part) => part.life > 0);
    crossy.cosmeticEffects = crossy.cosmeticEffects.filter((effect) => now - effect.startedAt < effect.duration);
    if (p.hopActive && Math.abs(p.x - p.targetX) < 1.5 && Math.abs(p.y - p.targetY) < 1.5) {
      p.x = p.targetX;
      p.y = p.targetY;
      p.hopActive = false;
      triggerCrossyCosmeticLanding(p);
    }

    if (!crossy.dying && !isCrossyGhostActive(now) && crossyHit()) {
      triggerCrossyDeath("crash");
      return;
    }
    if (!crossy.dying && !isCrossyGhostActive(now) && crossyPressureCaught()) {
      triggerCrossyDeath("caught");
      return;
    }

    renderCrossyStats();
    drawCrossy();
  }

  function crossyHit() {
    const p = crossy.player;
    return crossy.cars.some((car) => {
      if (car.depth !== p.depth) return false;
      const carLeft = car.x;
      const carRight = car.x + car.width;
      const carTop = crossyScreenY(car.depth) - 24;
      const carBottom = carTop + 48;
      return p.x + p.size * 0.42 > carLeft
        && p.x - p.size * 0.42 < carRight
        && p.y + p.size * 0.42 > carTop
        && p.y - p.size * 0.42 < carBottom;
    });
  }

  function isCrossyBlocked(depth, col) {
    return crossy.decor.some((item) => item.depth === depth && item.col === col);
  }

  function crossyPressureCaught() {
    return crossy.player.targetY > el.crossyCanvas.height - 16;
  }

  function isCrossyGhostActive(now = performance.now()) {
    return crossy.rescuing || crossy.ghostUntil > now;
  }

  function findCrossyRescueCell() {
    const lockDistance = (CROSSY_START_Y - CROSSY_CAMERA_LOCK_Y) / CROSSY_LANE_HEIGHT;
    const desiredDepth = Math.max(crossy.player.depth + 1, Math.ceil(crossy.cameraDepth + lockDistance));
    ensureCrossyWorld(desiredDepth + 16);
    const nearby = crossy.lanes
      .filter((lane) => lane.depth >= desiredDepth && lane.depth <= desiredDepth + 16 && lane.type !== "road")
      .sort((a, b) => a.depth - b.depth || (a.type === "grass" ? 0 : 1) - (b.type === "grass" ? 0 : 1));
    const lane = nearby[0] || crossy.lanes.find((candidate) => candidate.depth >= desiredDepth) || { depth: desiredDepth };
    const columns = Array.from({ length: 9 }, (_, col) => col).sort((a, b) => Math.abs(a - 4) - Math.abs(b - 4));
    const col = columns.find((candidate) => !isCrossyBlocked(lane.depth, candidate)) ?? 4;
    return { depth: lane.depth, col };
  }

  function activateCrossyTombstone(reason) {
    if (!crossy.tombstoneArmed || crossy.tombstoneUsed) return false;
    const booster = consumeTombstoneBooster();
    if (!booster) return false;

    const now = performance.now();
    crossy.tombstoneArmed = false;
    crossy.tombstoneUsed = true;
    crossy.reviveReason = reason;
    crossy.reviveFlashStartedAt = now;
    crossy.reviveFlashUntil = now + 1050;
    crossy.ghostUntil = now + (reason === "caught" ? 2800 : 2400);
    addCrossyGhostBurst(crossy.player.x, crossy.player.y);

    if (reason === "caught") {
      const target = findCrossyRescueCell();
      crossy.rescuing = true;
      crossy.rescueTarget = target;
      crossy.player.col = target.col;
      crossy.player.depth = target.depth;
      crossy.player.targetX = 30 + target.col * 60;
      crossy.player.targetY = crossyScreenY(target.depth);
      crossy.furthestDepth = Math.max(crossy.furthestDepth, target.depth);
      crossy.score = Math.max(crossy.score, crossy.furthestDepth);
      crossy.section = Math.floor(crossy.score / 10);
      crossy.bestLive = Math.max(Number(state.stats.crossyBest) || 0, crossy.score);
    }

    playTombstoneResurrectionSound();
    renderCrossyStats();
    showToast(
      "Tombstone Resurrection",
      reason === "caught"
        ? "Ghost rescue active. Phasing through traffic to a safe island."
        : "Traffic phased through. You are a ghost - keep crossing.",
      "win",
      4200
    );
    return true;
  }

  function addCrossyGhostBurst(x, y) {
    for (let i = 0; i < 32; i += 1) {
      const angle = (Math.PI * 2 * i) / 32;
      const speed = 70 + Math.random() * 130;
      crossy.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30,
        color: i % 3 ? "#8cf7ff" : "#c471ff"
      });
    }
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

  function triggerCrossyDeath(reason = "crash") {
    if (activateCrossyTombstone(reason)) {
      drawCrossy();
      return;
    }
    crossy.dying = true;
    crossy.deathReason = reason;
    crossy.deathStartedAt = performance.now();
    addCrossyCrashBurst(crossy.player.x, crossy.player.y);
    stopGameTheme("death");
    const finishDeath = () => {
      if (!crossy.running || !crossy.dying) return;
      endCrossyRun(reason);
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
    const y = crossyScreenY(car.depth);
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

  function getEquippedCrossyCharacter() {
    if (!state.owned.includes(state.equippedCrossyCharacter)) return null;
    return storeItems.find((item) => item.id === state.equippedCrossyCharacter && item.slot === "crossy_character") || null;
  }

  function drawCrossyChicken(ctx) {
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
  }

  function drawCrossySkips(ctx) {
    drawCrossyBlock(ctx, 12, -17, 15, 8, 4, "#f8fbff", "rgba(160, 190, 210, 0.54)");
    drawCrossyBlock(ctx, 20, -27, 8, 15, 4, "#ffffff", "rgba(160, 190, 210, 0.5)");
    drawCrossyBlock(ctx, -17, -17, 34, 31, 8, "#f8fbff", "rgba(174, 201, 217, 0.58)");
    drawCrossyBlock(ctx, -15, 7, 10, 10, 4, "#ffffff", "rgba(174, 201, 217, 0.5)");
    drawCrossyBlock(ctx, 5, 7, 10, 10, 4, "#ffffff", "rgba(174, 201, 217, 0.5)");
    drawCrossyBlock(ctx, -14, -38, 28, 25, 7, "#ffffff", "rgba(174, 201, 217, 0.54)");
    drawCrossyBlock(ctx, -13, -47, 9, 12, 4, "#f8fbff", "rgba(174, 201, 217, 0.5)");
    drawCrossyBlock(ctx, 4, -47, 9, 12, 4, "#f8fbff", "rgba(174, 201, 217, 0.5)");
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#38bfff";
    ctx.shadowColor = "#49f4ff";
    ctx.shadowBlur = 7;
    ctx.fillRect(-8, -31, 5, 6);
    ctx.fillRect(4, -31, 5, 6);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#0b1e39";
    ctx.fillRect(-6, -29, 2, 3);
    ctx.fillRect(6, -29, 2, 3);
    ctx.fillStyle = "#ff9db7";
    ctx.fillRect(-2, -23, 5, 4);
    ctx.strokeStyle = "rgba(207, 235, 246, 0.94)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-3, -20);
    ctx.lineTo(-17, -23);
    ctx.moveTo(3, -20);
    ctx.lineTo(17, -23);
    ctx.stroke();
  }

  function traceCrossyGalaxyFrog(ctx) {
    ctx.beginPath();
    ctx.rect(-20, -40, 40, 27);
    ctx.rect(-17, -49, 11, 12);
    ctx.rect(6, -49, 11, 12);
    ctx.rect(-18, -18, 36, 30);
    ctx.rect(-24, 4, 17, 12);
    ctx.rect(7, 4, 17, 12);
  }

  function drawCrossyGalaxyFrog(ctx, now) {
    const wrap = (value, span) => ((value % span) + span) % span;
    const driftX = (Number(crossy.galaxyOffsetX) || 0) + now * 0.013;
    const driftY = (Number(crossy.galaxyOffsetY) || 0) + now * 0.004;

    ctx.save();
    ctx.shadowColor = "#7f5cff";
    ctx.shadowBlur = 18;
    traceCrossyGalaxyFrog(ctx);
    ctx.fillStyle = "#090421";
    ctx.fill();
    ctx.clip();

    const space = ctx.createLinearGradient(-26 + driftX * 0.08, -50, 24 + driftX * 0.08, 18);
    space.addColorStop(0, "#07031a");
    space.addColorStop(0.36, "#301163");
    space.addColorStop(0.68, "#075c8e");
    space.addColorStop(1, "#170326");
    ctx.fillStyle = space;
    ctx.fillRect(-28, -52, 56, 72);

    [
      { x: -38, y: -30, radius: 28, color: "rgba(255, 62, 178, 0.66)" },
      { x: 4, y: -6, radius: 32, color: "rgba(63, 205, 255, 0.62)" },
      { x: 46, y: -40, radius: 25, color: "rgba(157, 91, 255, 0.72)" }
    ].forEach((cloud) => {
      const x = wrap(cloud.x + driftX + 60, 120) - 60;
      const y = wrap(cloud.y + driftY + 68, 88) - 68;
      const nebula = ctx.createRadialGradient(x, y, 1, x, y, cloud.radius);
      nebula.addColorStop(0, cloud.color);
      nebula.addColorStop(1, "rgba(8, 3, 28, 0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(-30, -54, 60, 76);
    });

    const stars = [
      [-23, -43, 2.2], [-10, -34, 1.2], [8, -44, 1.7], [21, -29, 1.1],
      [-17, -20, 1.4], [-2, -12, 2], [13, -17, 1.2], [23, -4, 1.7],
      [-22, 7, 1.1], [-7, 4, 1.5], [8, 9, 1.1], [18, 2, 2.1]
    ];
    stars.forEach(([baseX, baseY, size], index) => {
      const x = wrap(baseX + driftX * (0.7 + (index % 3) * 0.12) + 28, 56) - 28;
      const y = wrap(baseY + driftY * 0.45 + 54, 72) - 54;
      ctx.globalAlpha = 0.55 + Math.abs(Math.sin(now / 210 + index)) * 0.45;
      ctx.fillStyle = index % 4 === 0 ? "#ffd8ff" : "#e8ffff";
      ctx.fillRect(x, y, size, size);
      if (size > 1.8) {
        ctx.fillRect(x - 2, y + size / 2, size + 4, 1);
        ctx.fillRect(x + size / 2, y - 2, 1, size + 4);
      }
    });
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(203, 229, 255, 0.92)";
    ctx.lineWidth = 2;
    [[-20, -40, 40, 27], [-17, -49, 11, 12], [6, -49, 11, 12], [-18, -18, 36, 30], [-24, 4, 17, 12], [7, 4, 17, 12]]
      .forEach(([x, y, width, height]) => ctx.strokeRect(x, y, width, height));
    ctx.shadowColor = "#49f4ff";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#dfffff";
    ctx.fillRect(-13, -43, 5, 6);
    ctx.fillRect(8, -43, 5, 6);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#101024";
    ctx.fillRect(-11, -41, 2, 4);
    ctx.fillRect(10, -41, 2, 4);
    ctx.strokeStyle = "rgba(216, 251, 255, 0.92)";
    ctx.beginPath();
    ctx.moveTo(-7, -23);
    ctx.quadraticCurveTo(0, -18, 7, -23);
    ctx.stroke();
    ctx.restore();
  }

  function drawCrossyAnimalEar(ctx, x, y, width, height, color, outline, rounded = false) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (rounded) {
      if (ctx.roundRect) ctx.roundRect(x, y, width, height, 5);
      else ctx.rect(x, y, width, height);
    } else {
      ctx.moveTo(x + width / 2, y);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x, y + height);
      ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawCrossyAnimal(ctx, item, now, options = {}) {
    const style = item?.crossyStyle || "fox";
    const colors = item?.colors || ["#ff8a32", "#fff1d0", "#642719"];
    const phase = now / 1000;
    const isDuck = style === "duck";
    const isPenguin = style === "penguin";
    const isRabbit = style === "samurai-rabbit" || style === "quantum-hare";
    const isHamster = style === "astronaut-hamster";
    const isDeer = style === "prism-deer";
    const isDragon = style === "chrono-dragon";
    const isVoid = style === "void-panther";
    const isQuantum = style === "quantum-hare";
    const isObsidian = style === "obsidian-wolf";
    const isCyber = style === "cyber-oni-cat";
    const isRgb = style === "rgb-tiger";
    const outline = isVoid ? "rgba(139, 73, 185, 0.42)" : isObsidian ? "#b58a32" : isCyber ? "#49f4ff" : "rgba(224, 242, 255, 0.72)";
    let bodyColor = isVoid ? "#000000" : colors[0];

    ctx.save();
    if (isQuantum && !options.echo) ctx.translate(Math.sin(now / 52) > 0.72 ? 2 : 0, 0);
    if (isVoid) {
      ctx.shadowColor = "#7133a8";
      ctx.shadowBlur = options.echo ? 5 : 13;
    } else if (isObsidian) {
      ctx.shadowColor = "#ffd65a";
      ctx.shadowBlur = 7 + Math.max(0, Math.sin(phase * 2.5)) * 5;
    } else if (isCyber || isQuantum || isDragon) {
      ctx.shadowColor = colors[1];
      ctx.shadowBlur = 11;
    }

    if (!isDuck && !isPenguin) {
      ctx.save();
      ctx.strokeStyle = isCyber ? "#49f4ff" : bodyColor;
      ctx.lineWidth = isCyber ? 5 : 7;
      ctx.lineCap = "square";
      ctx.beginPath();
      ctx.moveTo(14, -11);
      ctx.quadraticCurveTo(29, -19, 25, -2);
      ctx.stroke();
      if (style === "fox") {
        ctx.strokeStyle = "#fff1d0";
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(24, -5);
        ctx.lineTo(26, -1);
        ctx.stroke();
      }
      ctx.restore();
    }

    if (isDragon) {
      ctx.save();
      ctx.fillStyle = "rgba(85, 232, 255, 0.45)";
      ctx.strokeStyle = "#ffd65a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-3, -20);
      ctx.lineTo(20, -35);
      ctx.lineTo(14, -5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    if (isRgb) {
      const rgbGradient = ctx.createLinearGradient(-18, -20, 18, 12);
      rgbGradient.addColorStop(0, `hsl(${(now / 12) % 360} 100% 62%)`);
      rgbGradient.addColorStop(0.5, `hsl(${(now / 12 + 120) % 360} 100% 62%)`);
      rgbGradient.addColorStop(1, `hsl(${(now / 12 + 240) % 360} 100% 62%)`);
      bodyColor = "#080910";
      drawCrossyBlock(ctx, -18, -16, 36, 29, 8, bodyColor, "#020207");
      ctx.fillStyle = rgbGradient;
      for (let stripe = -13; stripe <= 10; stripe += 8) {
        ctx.save();
        ctx.translate(stripe, -18);
        ctx.rotate(-0.28);
        ctx.fillRect(0, 0, 4, 27);
        ctx.restore();
      }
    } else if (isDeer || isDragon) {
      const shifting = ctx.createLinearGradient(-20 + Math.sin(phase) * 10, -30, 24, 15);
      shifting.addColorStop(0, colors[0]);
      shifting.addColorStop(0.45, colors[1]);
      shifting.addColorStop(0.72, colors[2]);
      shifting.addColorStop(1, colors[0]);
      drawCrossyBlock(ctx, -18, -16, 36, 29, 8, shifting, "rgba(36, 16, 70, 0.48)");
    } else {
      drawCrossyBlock(ctx, isHamster ? -17 : -18, -16, isHamster ? 34 : 36, 29, 8, bodyColor, isVoid ? "#050208" : "rgba(25, 17, 37, 0.42)");
    }

    drawCrossyBlock(ctx, -14, 7, 10, 10, 4, isPenguin ? "#ffae3d" : bodyColor, "rgba(0,0,0,.3)");
    drawCrossyBlock(ctx, 5, 7, 10, 10, 4, isPenguin ? "#ffae3d" : bodyColor, "rgba(0,0,0,.3)");

    if (isPenguin) {
      ctx.fillStyle = "#f5fbff";
      ctx.beginPath();
      ctx.ellipse(0, -5, 10, 15, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (isObsidian) {
      ctx.strokeStyle = "#d8a93d";
      ctx.lineWidth = 1.4;
      for (let line = -12; line < 14; line += 8) {
        ctx.beginPath();
        ctx.moveTo(line, -21);
        ctx.lineTo(line + 9, 5);
        ctx.stroke();
      }
    }

    if (isCyber) {
      ctx.strokeStyle = "#ff3ab8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-14, -8);
      ctx.lineTo(-4, -8);
      ctx.lineTo(-4, 2);
      ctx.lineTo(10, 2);
      ctx.stroke();
      ctx.fillStyle = "#49f4ff";
      ctx.fillRect(-16, -10, 4, 4);
      ctx.fillRect(9, 0, 4, 4);
    }

    if (isDragon) {
      ctx.strokeStyle = "#ffd65a";
      ctx.lineWidth = 2;
      [-8, 8].forEach((gearX, index) => {
        ctx.beginPath();
        ctx.arc(gearX, -5 + index * 2, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(gearX, -5 + index * 2);
        ctx.lineTo(gearX + Math.cos(phase * 4 + index) * 4, -5 + index * 2 + Math.sin(phase * 4 + index) * 4);
        ctx.stroke();
      });
    }

    let headColor = bodyColor;
    if (isDeer || isDragon) {
      const headGradient = ctx.createLinearGradient(-15, -44, 15, -16);
      headGradient.addColorStop(0, colors[0]);
      headGradient.addColorStop(0.5, colors[1]);
      headGradient.addColorStop(1, colors[2]);
      headColor = headGradient;
    }
    drawCrossyBlock(ctx, -14, -39, 28, 25, 7, headColor, isVoid ? "#050208" : "rgba(25, 17, 37, 0.4)");

    if (!isDuck && !isPenguin) {
      if (isRabbit) {
        drawCrossyAnimalEar(ctx, -12, -61, 9, 24, bodyColor, outline, true);
        drawCrossyAnimalEar(ctx, 3, -61, 9, 24, bodyColor, outline, true);
      } else if (isDeer) {
        ctx.save();
        ctx.strokeStyle = "#eaffff";
        ctx.lineWidth = 3;
        ctx.lineCap = "square";
        [-1, 1].forEach((side) => {
          ctx.beginPath();
          ctx.moveTo(side * 8, -38);
          ctx.lineTo(side * 10, -54);
          ctx.lineTo(side * 17, -60);
          ctx.moveTo(side * 10, -52);
          ctx.lineTo(side * 4, -58);
          ctx.stroke();
        });
        ctx.restore();
      } else {
        drawCrossyAnimalEar(ctx, -13, isCyber ? -56 : -49, 11, isCyber ? 20 : 13, isCyber ? "#49f4ff" : bodyColor, outline);
        drawCrossyAnimalEar(ctx, 2, isCyber ? -56 : -49, 11, isCyber ? 20 : 13, isCyber ? "#ff3ab8" : bodyColor, outline);
      }
    }

    if (style === "sheriff-raccoon") {
      ctx.fillStyle = "#252a35";
      ctx.fillRect(-13, -33, 26, 10);
      drawCrossyBlock(ctx, -18, -52, 36, 7, 3, "#5b321d", "#2b140c");
      drawCrossyBlock(ctx, -8, -61, 16, 11, 4, "#6b3b22", "#2b140c");
      ctx.fillStyle = "#ffe380";
      ctx.font = "900 15px Arial";
      ctx.textAlign = "center";
      ctx.fillText("★", 0, -1);
    }

    if (style === "samurai-rabbit") {
      ctx.save();
      ctx.strokeStyle = "#73efff";
      ctx.shadowColor = "#49f4ff";
      ctx.shadowBlur = 10;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-17, 5);
      ctx.lineTo(19, -29);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#ff405f";
      ctx.fillRect(-17, -35, 34, 7);
      ctx.fillRect(13, -33, 13, 3);
    }

    if (isHamster) {
      ctx.save();
      ctx.strokeStyle = "rgba(225, 250, 255, 0.92)";
      ctx.fillStyle = "rgba(99, 220, 255, 0.11)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -29, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      drawCrossyBlock(ctx, 16, -16, 9, 18, 4, "#66859b", "#263846");
    }

    if (style === "ninja-ferret") {
      ctx.fillStyle = "#050509";
      ctx.fillRect(-17, -35, 34, 8);
      ctx.save();
      ctx.translate(15, -30);
      ctx.rotate(0.35);
      ctx.fillRect(0, 0, 17, 4);
      ctx.restore();
    }

    if (isRgb) {
      const faceStripe = ctx.createLinearGradient(-14, -37, 14, -18);
      faceStripe.addColorStop(0, "#ff456f");
      faceStripe.addColorStop(0.5, "#57ff9a");
      faceStripe.addColorStop(1, "#49f4ff");
      ctx.fillStyle = faceStripe;
      ctx.fillRect(-11, -35, 4, 18);
      ctx.fillRect(7, -35, 4, 18);
    }

    if (isPenguin) {
      ctx.fillStyle = "#f5fbff";
      ctx.fillRect(-9, -33, 18, 13);
    }

    ctx.shadowBlur = 0;
    ctx.fillStyle = isVoid ? "#ffffff" : isObsidian ? "#fff0a1" : isCyber ? "#49f4ff" : "#10131c";
    if (isVoid || isObsidian || isCyber) {
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 7;
    }
    ctx.fillRect(-9, -32, 5, 6);
    ctx.fillRect(4, -32, 5, 6);
    ctx.shadowBlur = 0;
    ctx.fillStyle = isDuck || isPenguin ? "#ff9a32" : style === "fox" ? "#30131a" : colors[2];
    if (isDuck || isPenguin) ctx.fillRect(-5, -24, 10, 6);
    else ctx.fillRect(-3, -24, 6, 4);

    if (isObsidian && !options.echo) {
      const flare = Math.max(0, Math.sin(phase * 2.3) - 0.72) / 0.28;
      if (flare > 0) {
        ctx.globalAlpha = flare;
        ctx.fillStyle = "#fff8cf";
        ctx.fillRect(-20, -34, 40, 2);
        ctx.fillRect(-1, -52, 2, 38);
      }
    }
    ctx.restore();
  }

  function createCrossyCosmeticBurst(kind, x, y, colors, count = 12, duration = 520) {
    crossy.cosmeticEffects.push({
      kind,
      x,
      y,
      colors,
      startedAt: performance.now(),
      duration,
      particles: Array.from({ length: count }, (_, index) => ({
        angle: (Math.PI * 2 * index) / Math.max(1, count) + Math.random() * 0.25,
        speed: 16 + Math.random() * 38,
        size: 2 + Math.random() * 4,
        color: colors[index % colors.length]
      }))
    });
  }

  function triggerCrossyCosmeticHop(player) {
    const item = getEquippedCrossyCharacter();
    const style = item?.crossyStyle;
    if (!style) return;
    const now = performance.now();
    if (style === "astronaut-hamster") createCrossyCosmeticBurst("jet", player.x + player.facing * 17, player.y + 5, ["#ffd65a", "#ff713c", "#63dcff"], 9, 430);
    if (style === "ninja-ferret") crossy.cosmeticEffects.push({ kind: "smoke", x: player.x, y: player.y + 8, startedAt: now, duration: 480 });
    if (style === "void-panther") {
      crossy.cosmeticEffects.push({ kind: "shadow", x: player.x, y: player.y, item, startedAt: now, duration: 650 });
      createCrossyCosmeticBurst("void", player.x, player.y - 8, ["#000000", "#7133a8", "#c68cff"], 12, 620);
    }
    if (style === "quantum-hare") {
      crossy.cosmeticEffects.push({ kind: "hologram", x: player.x, y: player.y, item, startedAt: now, duration: 200 });
      createCrossyCosmeticBurst("glitch", player.x, player.y, ["#6feeff", "#c65cff", "#ffffff"], 10, 420);
    }
    if (style === "chrono-dragon") crossy.cosmeticEffects.push({ kind: "time-ripple", x: player.x, y: player.y, startedAt: now, duration: 720 });
  }

  function triggerCrossyCosmeticLanding(player) {
    const style = getEquippedCrossyCharacter()?.crossyStyle;
    if (style === "obsidian-wolf") createCrossyCosmeticBurst("gold", player.x, player.y + 10, ["#ffd65a", "#fff3a8", "#a67518"], 15, 620);
    if (style === "prism-deer") createCrossyCosmeticBurst("prism", player.x, player.y + 3, ["#73efff", "#ff72d0", "#fff2a8", "#ffffff"], 20, 760);
  }

  function drawCrossyCosmeticEffects(ctx, now) {
    crossy.cosmeticEffects.forEach((effect) => {
      const progress = Math.max(0, Math.min(1, (now - effect.startedAt) / effect.duration));
      const fade = 1 - progress;
      ctx.save();
      if (effect.kind === "shadow") {
        ctx.globalAlpha = fade * 0.32;
        ctx.translate(effect.x - progress * 18, effect.y + progress * 5);
        ctx.scale(1 + progress * 0.12, 1 - progress * 0.08);
        drawCrossyAnimal(ctx, effect.item, now, { echo: true });
      } else if (effect.kind === "hologram") {
        [-1, 1].forEach((side) => {
          ctx.save();
          ctx.globalAlpha = fade * 0.52;
          ctx.globalCompositeOperation = "screen";
          ctx.translate(effect.x + side * (7 + progress * 9), effect.y - side * 3);
          ctx.filter = side < 0 ? "hue-rotate(75deg)" : "hue-rotate(-55deg)";
          drawCrossyAnimal(ctx, effect.item, now, { echo: true });
          ctx.restore();
        });
      } else if (effect.kind === "smoke") {
        ctx.fillStyle = `rgba(218, 211, 227, ${fade * 0.55})`;
        for (let puff = 0; puff < 7; puff += 1) {
          const angle = (Math.PI * 2 * puff) / 7;
          const distance = progress * (18 + (puff % 3) * 5);
          ctx.beginPath();
          ctx.arc(effect.x + Math.cos(angle) * distance, effect.y + Math.sin(angle) * distance * 0.45 - progress * 7, 3 + progress * 8, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (effect.kind === "time-ripple") {
        ctx.globalAlpha = fade * 0.82;
        ctx.strokeStyle = progress < 0.5 ? "#55e8ff" : "#ffd65a";
        ctx.lineWidth = 4 - progress * 2;
        ctx.beginPath();
        ctx.ellipse(effect.x, effect.y + 5, 8 + progress * 58, 4 + progress * 24, 0, 0, Math.PI * 2);
        ctx.stroke();
        for (let tick = 0; tick < 12; tick += 1) {
          const angle = (Math.PI * 2 * tick) / 12;
          const radius = 10 + progress * 46;
          ctx.fillStyle = tick % 3 ? "#55e8ff" : "#ffd65a";
          ctx.fillRect(effect.x + Math.cos(angle) * radius - 1, effect.y + 5 + Math.sin(angle) * radius * 0.42 - 1, 3, 3);
        }
      } else {
        effect.particles?.forEach((particle, index) => {
          const distance = particle.speed * progress;
          let px = effect.x + Math.cos(particle.angle) * distance;
          let py = effect.y + Math.sin(particle.angle) * distance;
          if (effect.kind === "jet") py += progress * 18;
          if (effect.kind === "gold" || effect.kind === "prism") py += progress * progress * 18;
          if (effect.kind === "glitch") {
            px += (index % 2 ? -1 : 1) * progress * 12;
            py = effect.y + (index - 5) * 3;
          }
          ctx.globalAlpha = fade;
          ctx.fillStyle = particle.color;
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = effect.kind === "void" ? 8 : 5;
          if (effect.kind === "prism") {
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(particle.angle);
            ctx.fillRect(-particle.size, -1, particle.size * 2.8, 3);
            ctx.restore();
          } else {
            ctx.fillRect(px, py, particle.size, particle.size);
          }
        });
      }
      ctx.restore();
    });
  }

  function drawCrossyPlayer(ctx, p) {
    const now = performance.now();
    const ghostActive = isCrossyGhostActive(now);
    const character = getEquippedCrossyCharacter();
    const hopProgress = Math.max(0, Math.min(1, (now - p.hopStartedAt) / 280));
    const hopLift = p.hopActive ? Math.sin(hopProgress * Math.PI) * 10 : 0;
    ctx.save();
    ctx.translate(p.x, p.y - hopLift);
    ctx.scale(p.facing || 1, 1);
    ctx.shadowBlur = ghostActive ? 25 : 14;
    ctx.shadowColor = ghostActive ? "#8cf7ff" : "#ffffff";
    if (ghostActive) {
      ctx.globalAlpha = 0.42 + Math.abs(Math.sin(now / 90)) * 0.18;
      ctx.globalCompositeOperation = "screen";
    }
    if (character?.id === "crossy_galaxy_frog") drawCrossyGalaxyFrog(ctx, now);
    else if (character?.id === "crossy_skips") drawCrossySkips(ctx);
    else if (character?.crossyStyle) drawCrossyAnimal(ctx, character, now);
    else drawCrossyChicken(ctx);
    if (ghostActive) {
      ctx.fillStyle = "#dffcff";
      ctx.globalAlpha = 0.24 + Math.abs(Math.sin(now / 110)) * 0.18;
      ctx.fillRect(-18, 23, 8, 5);
      ctx.fillRect(-3, 28, 7, 4);
      ctx.fillRect(11, 21, 9, 5);
    }
    ctx.restore();
  }

  function drawCrossyTombstoneFlash(ctx, width, height, now) {
    if (crossy.reviveFlashUntil <= now) return;
    const duration = Math.max(1, crossy.reviveFlashUntil - crossy.reviveFlashStartedAt);
    const strength = Math.max(0, Math.min(1, (crossy.reviveFlashUntil - now) / duration));
    const label = crossy.reviveReason === "caught" ? "GHOST RESCUE" : "GHOST MODE";
    ctx.save();
    const overlay = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, height * 0.7);
    overlay.addColorStop(0, `rgba(231, 248, 255, ${0.1 + strength * 0.2})`);
    overlay.addColorStop(1, `rgba(140, 247, 255, ${0.18 + strength * 0.34})`);
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = `rgba(196, 113, 255, ${0.48 + strength * 0.44})`;
    ctx.lineWidth = 8;
    ctx.strokeRect(5, 5, width - 10, height - 10);

    const stoneWidth = 72;
    const stoneHeight = 82;
    const stoneX = width / 2 - stoneWidth / 2;
    const stoneY = height * 0.18;
    ctx.shadowColor = "#8cf7ff";
    ctx.shadowBlur = 28;
    ctx.fillStyle = "rgba(18, 12, 29, 0.91)";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(stoneX, stoneY, stoneWidth, stoneHeight, [32, 32, 9, 9]);
    else ctx.rect(stoneX, stoneY, stoneWidth, stoneHeight);
    ctx.fill();
    ctx.strokeStyle = "#b9fbff";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 19px Arial Black";
    ctx.textAlign = "center";
    ctx.fillText("RIP", width / 2, stoneY + 47);
    ctx.font = "900 28px ByteBounce, Arial Black";
    ctx.fillText(label, width / 2, stoneY + stoneHeight + 43);
    ctx.restore();
  }

  function drawCrossy() {
    if (!el.crossyCanvas) return;
    const ctx = el.crossyCanvas.getContext("2d");
    const w = el.crossyCanvas.width;
    const h = el.crossyCanvas.height;
    const now = performance.now();
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "#6ecf52";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (let x = -40; x < w; x += 54) {
      ctx.fillRect(x, 0, 3, h);
    }
    crossy.lanes.forEach((lane) => {
      const y = crossyScreenY(lane.depth) - CROSSY_LANE_HEIGHT / 2;
      if (y > h || y + CROSSY_LANE_HEIGHT < 0) return;
      if (lane.type === "road") {
        ctx.fillStyle = Math.abs(lane.depth) % 2 ? "#5f6475" : "#555b6b";
        ctx.fillRect(0, y, w, CROSSY_LANE_HEIGHT + 1);
        ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
        ctx.fillRect(0, y + 58, w, 8);
        ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
        for (let x = 10; x < w; x += 58) {
          ctx.fillRect(x, y + 31, 28, 5);
        }
      } else {
        ctx.fillStyle = lane.type === "forest" ? "#5aba49" : "#76d65e";
        ctx.fillRect(0, y, w, CROSSY_LANE_HEIGHT + 1);
        ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
        ctx.fillRect(0, y + 58, w, 8);
        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        for (let x = 0; x < w; x += 34) {
          ctx.fillRect(x + (Math.abs(lane.depth) % 2 ? 16 : 0), y + 12, 12, 4);
        }
      }
    });

    crossy.decor.forEach((item) => {
      const x = 30 + item.col * 60;
      const y = crossyScreenY(item.depth) + 16;
      if (y < -60 || y > h + 60) return;
      if (item.kind === "rock") drawCrossyRock(ctx, x, y, item.scale);
      else drawCrossyTree(ctx, x, y, item.scale);
    });

    crossy.cars.forEach((car) => {
      const y = crossyScreenY(car.depth);
      if (y > -60 && y < h + 60) drawCrossyVehicle(ctx, car);
    });

    const dangerY = h - 18;
    const dangerDistance = dangerY - crossy.player.targetY;
    const alpha = Math.max(0.16, Math.min(0.82, 1 - dangerDistance / 220));
    if (crossy.running || crossy.dying) {
      const gradient = ctx.createLinearGradient(0, h - 128, 0, h);
      gradient.addColorStop(0, `rgba(255, 82, 117, ${alpha * 0.08})`);
      gradient.addColorStop(0.52, `rgba(255, 82, 117, ${alpha * 0.28})`);
      gradient.addColorStop(1, `rgba(5, 3, 11, ${alpha})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, h - 128, w, 128);
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

    drawCrossyCosmeticEffects(ctx, now);
    drawCrossyPlayer(ctx, crossy.player);

    drawCrossyTombstoneFlash(ctx, w, h, now);

    const previousBest = Number(state.stats.crossyBest) || 0;
    const liveBest = Math.max(previousBest, crossy.score);
    drawCrossyPill(ctx, 14, 14, "BEST", formatNumber(liveBest), crossy.score > previousBest ? "#ffd35a" : "#49f4ff");
    if (crossy.score <= previousBest) {
      drawCrossyPill(ctx, w - 160, 14, "SCORE", formatNumber(crossy.score), "#57ff9a");
    }
    if (isCrossyGhostActive(now)) {
      drawCrossyPill(ctx, w / 2 - 73, 55, "TOMBSTONE", crossy.rescuing ? "RESCUING" : "GHOST MODE", "#8cf7ff");
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
      ctx.fillText(crossy.deathReason === "caught" ? "TOO SLOW" : "YOU DIED", w / 2, h / 2);
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
    const wasCaught = reason === "caught";
    const previousBest = Number(state.stats.crossyBest) || 0;
    const newBest = crossy.score > previousBest;
    const oldAchievements = new Set(state.achievements);
    const boosterUsed = getEquippedBoosterItem("crossy");
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

    const shouldConsumeBooster = boosterUsed && boosterUsed.effect !== "tombstone";
    if (shouldConsumeBooster) {
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
    if (shouldConsumeBooster && state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
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
        : wasCaught
          ? "The road caught up. Keep moving forward to stay ahead."
          : "Run ended. Your crossing score has been saved.";
    el.gameOverModal.classList.remove("hidden");
  }

  function createSolitaireState() {
    return {
      running: false,
      paused: false,
      dealing: false,
      dealAttempts: 0,
      stock: [],
      waste: [],
      foundations: { hearts: [], diamonds: [], clubs: [], spades: [] },
      tableau: Array.from({ length: 7 }, () => []),
      selected: null,
      history: [],
      score: 0,
      moves: 0,
      recycles: 0,
      startedAt: 0,
      pausedAt: 0,
      pausedMs: 0,
      casperPlan: [],
      casperPlanIndex: 0,
      won: false
    };
  }

  function openSolitaire() {
    currentGame = "solitaire";
    prepareGameTheme();
    showScreen("solitaire");
    resetSolitaire();
  }

  function resetSolitaire() {
    stopSolitaire(false);
    solitaire = createSolitaireState();
    renderSolitaireBoard();
    renderSolitaireStats();
  }

  function solitaireSolverWorkerMain() {
    const rankOf = (card) => card % 13 + 1;
    const suitOf = (card) => Math.floor(card / 13);
    const colorOf = (card) => suitOf(card) < 2 ? 0 : 1;

    function shuffledDeck() {
      const deck = Array.from({ length: 52 }, (_, index) => index);
      for (let index = deck.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
      }
      return deck;
    }

    function dealDeck(deck) {
      const reserve = deck.slice();
      const tableau = Array.from({ length: 7 }, () => []);
      const down = [];
      for (let column = 0; column < 7; column += 1) {
        for (let row = 0; row <= column; row += 1) tableau[column].push(reserve.pop());
        down[column] = column;
      }
      return { tableau, down, reserve, foundation: [0, 0, 0, 0] };
    }

    function solveDeal(initial, nodeLimit, timeLimitMs) {
      const deadline = Date.now() + timeLimitMs;
      const seen = new Set();
      let nodes = 0;
      let stopped = false;

      function cloneState(state) {
        return {
          tableau: state.tableau.map((pile) => pile.slice()),
          down: state.down.slice(),
          reserve: state.reserve.slice(),
          foundation: state.foundation.slice()
        };
      }

      function exposeTableauTop(state, column) {
        if (state.down[column] > 0 && state.tableau[column].length === state.down[column]) {
          state.down[column] -= 1;
        }
      }

      function safeForFoundation(card, foundation) {
        const suit = suitOf(card);
        const oppositeSuits = suit < 2 ? [2, 3] : [0, 1];
        return rankOf(card) <= Math.min(foundation[oppositeSuits[0]], foundation[oppositeSuits[1]]) + 1;
      }

      function promoteSafeCards(state, plan) {
        let changed = true;
        while (changed) {
          changed = false;
          for (let column = 0; column < 7; column += 1) {
            const pile = state.tableau[column];
            const card = pile[pile.length - 1];
            if (card === undefined
              || rankOf(card) !== state.foundation[suitOf(card)] + 1
              || !safeForFoundation(card, state.foundation)) continue;
            pile.pop();
            state.foundation[suitOf(card)] += 1;
            exposeTableauTop(state, column);
            plan.push({ type: "tableauFoundation", from: column, card });
            changed = true;
          }
          for (let index = 0; index < state.reserve.length; index += 1) {
            const card = state.reserve[index];
            if (rankOf(card) !== state.foundation[suitOf(card)] + 1
              || !safeForFoundation(card, state.foundation)) continue;
            state.reserve.splice(index, 1);
            state.foundation[suitOf(card)] += 1;
            plan.push({ type: "reserveFoundation", card });
            changed = true;
            break;
          }
        }
      }

      function stateKey(state) {
        const piles = state.tableau
          .map((pile, column) => `${state.down[column]}:${pile.join(".")}`)
          .sort();
        return `${state.foundation.join(".")}/${state.reserve.slice().sort((a, b) => a - b).join(".")}/${piles.join("/")}`;
      }

      function fitsTableau(card, target) {
        return target === undefined
          ? rankOf(card) === 13
          : rankOf(target) === rankOf(card) + 1 && colorOf(target) !== colorOf(card);
      }

      function search(source, sourcePlan = []) {
        nodes += 1;
        if (nodes > nodeLimit || Date.now() > deadline) {
          stopped = true;
          return null;
        }

        const state = cloneState(source);
        const plan = sourcePlan.slice();
        promoteSafeCards(state, plan);
        if (state.foundation.every((rank) => rank === 13)) return plan;
        const key = stateKey(state);
        if (seen.has(key)) return null;
        seen.add(key);

        const moves = [];
        const firstEmpty = state.tableau.findIndex((pile) => pile.length === 0);
        for (let from = 0; from < 7; from += 1) {
          const pile = state.tableau[from];
          for (let index = state.down[from]; index < pile.length; index += 1) {
            const card = pile[index];
            for (let to = 0; to < 7; to += 1) {
              if (to === from) continue;
              const targetPile = state.tableau[to];
              const target = targetPile[targetPile.length - 1];
              if (!fitsTableau(card, target)) continue;
              if (target === undefined) {
                if (to !== firstEmpty || (state.down[from] === 0 && index === 0)) continue;
              }
              moves.push({
                type: "tableau",
                from,
                index,
                to,
                score: index === state.down[from] && state.down[from] > 0 ? 140 : 35
              });
            }
          }
        }

        for (let index = 0; index < state.reserve.length; index += 1) {
          const card = state.reserve[index];
          for (let to = 0; to < 7; to += 1) {
            const targetPile = state.tableau[to];
            const target = targetPile[targetPile.length - 1];
            if (!fitsTableau(card, target) || (target === undefined && to !== firstEmpty)) continue;
            moves.push({ type: "reserveTableau", index, to, score: target === undefined ? 70 : 80 });
          }
          if (rankOf(card) === state.foundation[suitOf(card)] + 1) {
            moves.push({ type: "reserveFoundation", index, score: 95 });
          }
        }

        for (let from = 0; from < 7; from += 1) {
          const pile = state.tableau[from];
          const card = pile[pile.length - 1];
          if (card !== undefined && rankOf(card) === state.foundation[suitOf(card)] + 1) {
            moves.push({
              type: "tableauFoundation",
              from,
              score: state.down[from] > 0 && pile.length === state.down[from] + 1 ? 130 : 90
            });
          }
        }
        moves.sort((a, b) => b.score - a.score);

        for (const move of moves) {
          const next = cloneState(state);
          let action;
          if (move.type === "tableau") {
            action = { type: move.type, from: move.from, to: move.to, card: next.tableau[move.from][move.index] };
            next.tableau[move.to].push(...next.tableau[move.from].splice(move.index));
            exposeTableauTop(next, move.from);
          } else if (move.type === "reserveTableau") {
            const card = next.reserve.splice(move.index, 1)[0];
            action = { type: move.type, to: move.to, card };
            next.tableau[move.to].push(card);
          } else if (move.type === "reserveFoundation") {
            const card = next.reserve.splice(move.index, 1)[0];
            action = { type: move.type, card };
            next.foundation[suitOf(card)] += 1;
          } else {
            const card = next.tableau[move.from].pop();
            action = { type: move.type, from: move.from, card };
            next.foundation[suitOf(card)] += 1;
            exposeTableauTop(next, move.from);
          }
          const result = search(next, [...plan, action]);
          if (result) return result;
          if (stopped) return null;
        }
        return null;
      }

      const plan = search(initial);
      return { solved: Boolean(plan), plan: plan || [], nodes };
    }

    self.onmessage = (event) => {
      const nodeLimit = Math.max(1000, Number(event.data?.nodeLimit) || 80000);
      const timeLimitMs = Math.max(100, Number(event.data?.timeLimitMs) || 700);
      let attempts = 0;
      let testedNodes = 0;
      while (true) {
        attempts += 1;
        const deck = shuffledDeck();
        const result = solveDeal(dealDeck(deck), nodeLimit, timeLimitMs);
        testedNodes += result.nodes;
        if (result.solved) {
          self.postMessage({ type: "solved", deck, plan: result.plan, attempts, testedNodes });
          return;
        }
        if (attempts % 5 === 0) self.postMessage({ type: "progress", attempts, testedNodes });
      }
    };
  }

  function finishSolitaireSolverJob(job) {
    if (!job) return;
    job.worker.terminate();
    URL.revokeObjectURL(job.url);
    if (solitaireSolverJob === job) solitaireSolverJob = null;
  }

  function cancelSolitaireSolver() {
    solitaireDealRequest += 1;
    const job = solitaireSolverJob;
    if (!job) return;
    finishSolitaireSolverJob(job);
    job.reject(new Error("Solitaire deal generation cancelled."));
  }

  function generateSolvableSolitaireDeck(requestId) {
    return new Promise((resolve, reject) => {
      const source = `(${solitaireSolverWorkerMain.toString()})();`;
      const url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
      const worker = new Worker(url);
      const job = { worker, url, reject, requestId };
      solitaireSolverJob = job;
      worker.onmessage = (event) => {
        if (solitaireSolverJob !== job || solitaireDealRequest !== requestId) return;
        if (event.data?.type === "progress") {
          solitaire.dealAttempts = event.data.attempts;
          renderSolitaireBoard();
          return;
        }
        if (event.data?.type !== "solved") return;
        finishSolitaireSolverJob(job);
        resolve(event.data);
      };
      worker.onerror = (event) => {
        finishSolitaireSolverJob(job);
        reject(new Error(event.message || "Solitaire solver worker failed."));
      };
      worker.postMessage({ nodeLimit: 80000, timeLimitMs: 700 });
    });
  }

  function createSolitaireDeck(cardOrder = null) {
    const order = cardOrder ? cardOrder.slice() : Array.from({ length: 52 }, (_, index) => index);
    if (!cardOrder) {
      for (let index = order.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
      }
    }
    return order.map((cardIndex) => {
      const suit = SOLITAIRE_SUITS[Math.floor(cardIndex / 13)];
      const rank = cardIndex % 13 + 1;
      return { id: `${suit.id}-${rank}`, suit: suit.id, rank, faceUp: false };
    });
  }

  function dealSolitaireDeck(deck) {
    for (let column = 0; column < 7; column += 1) {
      for (let row = 0; row <= column; row += 1) {
        const card = deck.pop();
        card.faceUp = row === column;
        solitaire.tableau[column].push(card);
      }
    }
    solitaire.stock = deck;
  }

  async function startSolitaire() {
    resetSolitaire();
    const requestId = ++solitaireDealRequest;
    solitaire.dealing = true;
    solitaire.dealAttempts = 0;
    renderSolitaireBoard();
    renderSolitaireStats();

    let result;
    try {
      result = await generateSolvableSolitaireDeck(requestId);
    } catch (error) {
      if (solitaireDealRequest !== requestId) return;
      solitaire.dealing = false;
      renderSolitaireBoard();
      showToast("Deal Generator", "Could not verify a solvable deal. Please try again.", "fail");
      console.error(error);
      return;
    }
    if (solitaireDealRequest !== requestId) return;

    solitaire.dealing = false;
    solitaire.dealAttempts = result.attempts;
    solitaire.casperPlan = Array.isArray(result.plan) ? result.plan : [];
    solitaire.casperPlanIndex = 0;
    dealSolitaireDeck(createSolitaireDeck(result.deck));
    ensureSolitaireIntegrity("initial deal");
    solitaire.running = true;
    solitaire.startedAt = Date.now();
    solitaireTimer = setInterval(renderSolitaireStats, 1000);
    if (casperSolitaireTimer) clearInterval(casperSolitaireTimer);
    casperSolitaireTimer = setInterval(runCasperSolitaire, 90);
    playTone("tap");
    playGameTheme("solitaire", { restart: true, volume: 0.52 });
    prepareCasperRun("solitaire");
    renderSolitaireBoard();
    renderSolitaireStats();
  }

  function restartSolitaire() {
    startSolitaire();
  }

  function stopSolitaire(render = true) {
    cancelSolitaireSolver();
    if (solitaireTimer) {
      clearInterval(solitaireTimer);
      solitaireTimer = null;
    }
    if (casperSolitaireTimer) {
      clearInterval(casperSolitaireTimer);
      casperSolitaireTimer = null;
    }
    if (solitaire.paused && solitaire.pausedAt) {
      solitaire.pausedMs += Date.now() - solitaire.pausedAt;
      solitaire.pausedAt = 0;
    }
    solitaire.running = false;
    solitaire.paused = false;
    solitaire.selected = null;
    releaseCasperRun();
    if (render) {
      renderSolitaireBoard();
      renderSolitaireStats();
    }
  }

  function handlePrimarySolitaireAction() {
    if (solitaire.running) {
      endSolitaireRun("manual");
      return;
    }
    startSolitaire();
  }

  function toggleSolitairePause() {
    if (!solitaire.running) return;
    solitaire.paused = !solitaire.paused;
    solitaire.selected = null;
    if (solitaire.paused) {
      solitaire.pausedAt = Date.now();
    } else if (solitaire.pausedAt) {
      solitaire.pausedMs += Date.now() - solitaire.pausedAt;
      solitaire.pausedAt = 0;
    }
    playTone("tap");
    renderSolitaireBoard();
    renderSolitaireStats();
  }

  function solitaireElapsedSeconds() {
    if (!solitaire.startedAt) return 0;
    const activePause = solitaire.paused && solitaire.pausedAt ? Date.now() - solitaire.pausedAt : 0;
    return Math.max(0, Math.floor((Date.now() - solitaire.startedAt - solitaire.pausedMs - activePause) / 1000));
  }

  function formatSolitaireTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function getSolitaireSuit(card) {
    return SOLITAIRE_SUITS.find((suit) => suit.id === card?.suit) || SOLITAIRE_SUITS[0];
  }

  function solitaireCardLabel(card) {
    if (!card) return "empty pile";
    const suit = getSolitaireSuit(card);
    return `${SOLITAIRE_RANKS[card.rank]} ${suit.id}`;
  }

  function solitaireCardMarkup(card) {
    const suit = getSolitaireSuit(card);
    return `
      <span class="solitaire-card-rank">${SOLITAIRE_RANKS[card.rank]}</span>
      <span class="solitaire-card-suit">${suit.symbol}</span>
      <span class="solitaire-card-center">${suit.symbol}</span>
    `;
  }

  function isSolitaireSelected(source, pile, cardIndex = null) {
    if (!solitaire.selected || solitaire.selected.source !== source) return false;
    if (solitaire.selected.pile !== pile) return false;
    return cardIndex === null || solitaire.selected.cardIndex === cardIndex;
  }

  function getSolitaireCardWidth() {
    const width = el.solitaireTableau?.clientWidth || Math.min(860, Math.max(300, window.innerWidth - 50));
    const gap = width <= 520 ? 4 : Math.min(12, Math.max(4, width * 0.012));
    return Math.max(34, (width - gap * 6) / 7);
  }

  function renderSolitairePileButton(button, card, action, options = {}) {
    button.dataset.solitaireAction = action;
    button.dataset.suit = options.suit || "";
    if (!card) {
      const suit = options.suit ? SOLITAIRE_SUITS.find((item) => item.id === options.suit) : null;
      button.className = `solitaire-pile-slot ${options.foundation ? "solitaire-foundation-slot" : ""} ${suit ? `is-${suit.color}` : ""}`.trim();
      button.innerHTML = suit ? suit.symbol : options.emptyText || "";
      button.setAttribute("aria-label", options.ariaLabel || "Empty pile");
      return;
    }
    const suit = getSolitaireSuit(card);
    const selected = options.selected ? "selected" : "";
    button.className = `solitaire-card is-${suit.color} ${card.faceUp ? "" : "face-down"} ${selected}`.trim();
    button.innerHTML = card.faceUp ? solitaireCardMarkup(card) : (options.count ? `<span class="solitaire-stock-count">${options.count}</span>` : "");
    button.setAttribute("aria-label", card.faceUp ? solitaireCardLabel(card) : `${options.count || 1} cards in stock`);
  }

  function renderSolitaireBoard() {
    if (!el.solitaireBoard) return;
    const stockTop = solitaire.stock[solitaire.stock.length - 1] || null;
    renderSolitairePileButton(el.solitaireStock, stockTop, "stock", {
      count: solitaire.stock.length,
      emptyText: solitaire.waste.length ? "↻" : "",
      ariaLabel: solitaire.stock.length
        ? `${solitaire.stock.length} cards in stock`
        : solitaire.waste.length ? "Recycle waste into stock" : "Empty stock pile"
    });

    const wasteTop = solitaire.waste[solitaire.waste.length - 1] || null;
    renderSolitairePileButton(el.solitaireWaste, wasteTop, "waste", {
      selected: isSolitaireSelected("waste", "waste"),
      ariaLabel: wasteTop ? solitaireCardLabel(wasteTop) : "Empty waste pile"
    });

    el.solitaireFoundations.innerHTML = SOLITAIRE_SUITS.map((suit) => {
      const pile = solitaire.foundations[suit.id];
      const card = pile[pile.length - 1] || null;
      if (!card) {
        return `<button class="solitaire-pile-slot solitaire-foundation-slot is-${suit.color}" type="button" data-solitaire-action="foundation" data-suit="${suit.id}" aria-label="Empty ${suit.id} foundation">${suit.symbol}</button>`;
      }
      return `<button class="solitaire-card is-${suit.color} ${isSolitaireSelected("foundation", suit.id) ? "selected" : ""}" type="button" data-solitaire-action="foundation" data-suit="${suit.id}" aria-label="${solitaireCardLabel(card)}">${solitaireCardMarkup(card)}</button>`;
    }).join("");

    const cardWidth = getSolitaireCardWidth();
    const cardHeight = cardWidth * 1.4;
    const downStep = Math.max(11, cardWidth * 0.28);
    const upStep = Math.max(21, cardWidth * 0.52);
    let maxTableauBottom = cardHeight;
    el.solitaireTableau.innerHTML = solitaire.tableau.map((pile, column) => {
      let top = 0;
      const cards = pile.map((card, cardIndex) => {
        const suit = getSolitaireSuit(card);
        const selected = isSolitaireSelected("tableau", column, cardIndex) ? "selected" : "";
        const html = `<button class="solitaire-card tableau-card is-${suit.color} ${card.faceUp ? "" : "face-down"} ${selected}" type="button" style="top:${Math.round(top)}px;z-index:${cardIndex + 1}" data-solitaire-action="tableau-card" data-column="${column}" data-index="${cardIndex}" aria-label="${card.faceUp ? solitaireCardLabel(card) : "Face-down card"}">${card.faceUp ? solitaireCardMarkup(card) : ""}</button>`;
        maxTableauBottom = Math.max(maxTableauBottom, top + cardHeight);
        top += card.faceUp ? upStep : downStep;
        return html;
      }).join("");
      return `<div class="solitaire-tableau-pile" data-solitaire-action="tableau" data-column="${column}">${cards || `<button class="solitaire-pile-slot" type="button" data-solitaire-action="tableau" data-column="${column}" aria-label="Empty tableau column">K</button>`}</div>`;
    }).join("");
    const baseBoardHeight = window.innerWidth <= 700 ? 440 : 560;
    el.solitaireBoard.style.minHeight = `${Math.ceil(Math.max(baseBoardHeight, cardHeight + maxTableauBottom + 60))}px`;

    el.solitaireBoardOverlay.classList.toggle("hidden", solitaire.running && !solitaire.paused && !solitaire.dealing);
    el.solitaireBoardOverlay.textContent = solitaire.dealing
      ? `Finding a solvable deal${solitaire.dealAttempts ? ` (${solitaire.dealAttempts} tested)` : ""}…`
      : solitaire.paused ? "Paused" : "Press Start";
    el.startSolitaireBtn.textContent = solitaire.dealing ? "Finding Deal…" : solitaire.running ? "End Game" : "Start Game";
    el.startSolitaireBtn.disabled = solitaire.dealing;
    el.restartSolitaireBtn.disabled = solitaire.dealing;
    el.solitairePauseBtn.textContent = solitaire.paused ? "Resume" : "Pause";
    el.solitairePauseBtn.disabled = !solitaire.running || solitaire.dealing;
    el.undoSolitaireBtn.disabled = !solitaire.running || solitaire.paused || solitaire.history.length === 0;
    el.hintSolitaireBtn.disabled = !solitaire.running || solitaire.paused;
  }

  function solitaireFoundationCount() {
    return SOLITAIRE_SUITS.reduce((total, suit) => total + solitaire.foundations[suit.id].length, 0);
  }

  function calculateSolitaireXp(won = solitaire.won) {
    if (solitaire.moves <= 0) return 0;
    return Math.round(20 + solitaire.score * 0.55 + solitaireFoundationCount() * 5 + (won ? 300 : 0));
  }

  function previewSolitaireCoins(won = solitaire.won) {
    if (solitaire.moves <= 0) return 0;
    const base = 3 + Math.floor(solitaire.score / 35) + solitaireFoundationCount() * 2 + (won ? 100 : 0);
    return applyRewardBooster(base);
  }

  function renderSolitaireStats() {
    if (!el.solitaireScore) return;
    el.solitaireScore.textContent = formatNumber(solitaire.score);
    el.solitaireMoves.textContent = formatNumber(solitaire.moves);
    el.solitaireTime.textContent = formatSolitaireTime(solitaireElapsedSeconds());
    el.solitaireBest.textContent = formatNumber(Math.max(Number(state.stats.solitaireBest) || 0, solitaire.score));
    el.solitaireXpPreview.textContent = formatNumber(applyRewardBooster(calculateSolitaireXp()));
    el.solitaireCoinPreview.textContent = formatNumber(previewSolitaireCoins());
  }

  function saveSolitaireHistory() {
    solitaire.history.push({
      stock: clone(solitaire.stock),
      waste: clone(solitaire.waste),
      foundations: clone(solitaire.foundations),
      tableau: clone(solitaire.tableau),
      score: solitaire.score,
      moves: solitaire.moves,
      recycles: solitaire.recycles
    });
    if (solitaire.history.length > 80) solitaire.history.shift();
  }

  function undoSolitaireMove() {
    if (!solitaire.running || solitaire.paused || !solitaire.history.length) return;
    const previous = solitaire.history.pop();
    solitaire.stock = previous.stock;
    solitaire.waste = previous.waste;
    solitaire.foundations = previous.foundations;
    solitaire.tableau = previous.tableau;
    solitaire.score = previous.score;
    solitaire.moves = previous.moves;
    solitaire.recycles = previous.recycles;
    solitaire.selected = null;
    ensureSolitaireIntegrity("undo");
    playTone("tap");
    renderSolitaireBoard();
    renderSolitaireStats();
  }

  function drawSolitaireStock() {
    if (!solitaire.running || solitaire.paused) return;
    if (!solitaire.stock.length && !solitaire.waste.length) return;
    saveSolitaireHistory();
    solitaire.selected = null;
    if (solitaire.stock.length) {
      const card = solitaire.stock.pop();
      card.faceUp = true;
      solitaire.waste.push(card);
    } else {
      while (solitaire.waste.length) {
        const card = solitaire.waste.pop();
        card.faceUp = false;
        solitaire.stock.push(card);
      }
      solitaire.recycles += 1;
      solitaire.score = Math.max(0, solitaire.score - 5);
    }
    solitaire.moves += 1;
    ensureSolitaireIntegrity("stock draw or recycle");
    playTone("tap");
    renderSolitaireBoard();
    renderSolitaireStats();
  }

  function solitaireCardColor(card) {
    return getSolitaireSuit(card).color;
  }

  function hasValidSolitaireState(game = solitaire) {
    const cards = [
      ...game.stock,
      ...game.waste,
      ...SOLITAIRE_SUITS.flatMap((suit) => game.foundations[suit.id]),
      ...game.tableau.flat()
    ];
    const expectedIds = new Set(SOLITAIRE_SUITS.flatMap((suit) => (
      Array.from({ length: 13 }, (_, index) => `${suit.id}-${index + 1}`)
    )));
    if (cards.length !== 52 || new Set(cards.map((card) => card.id)).size !== 52) return false;
    if (cards.some((card) => !expectedIds.has(card.id) || card.id !== `${card.suit}-${card.rank}`)) return false;
    if (game.stock.some((card) => card.faceUp) || game.waste.some((card) => !card.faceUp)) return false;

    for (const suit of SOLITAIRE_SUITS) {
      const pile = game.foundations[suit.id];
      if (pile.some((card, index) => !card.faceUp || card.suit !== suit.id || card.rank !== index + 1)) return false;
    }

    for (const pile of game.tableau) {
      const firstFaceUp = pile.findIndex((card) => card.faceUp);
      const faceUpIndex = firstFaceUp < 0 ? pile.length : firstFaceUp;
      if (pile.slice(0, faceUpIndex).some((card) => card.faceUp)) return false;
      if (pile.slice(faceUpIndex).some((card) => !card.faceUp)) return false;
      for (let index = faceUpIndex; index < pile.length - 1; index += 1) {
        const card = pile[index];
        const next = pile[index + 1];
        if (card.rank !== next.rank + 1 || solitaireCardColor(card) === solitaireCardColor(next)) return false;
      }
    }
    return true;
  }

  function ensureSolitaireIntegrity(context) {
    if (hasValidSolitaireState()) return;
    throw new Error(`Invalid Solitaire card state after ${context}.`);
  }

  function canPlaceSolitaireTableau(card, target) {
    if (!target) return card.rank === 13;
    return target.faceUp && target.rank === card.rank + 1 && solitaireCardColor(target) !== solitaireCardColor(card);
  }

  function canPlaceSolitaireFoundation(card, suitId) {
    if (!card || card.suit !== suitId) return false;
    const pile = solitaire.foundations[suitId];
    const target = pile[pile.length - 1];
    return target ? card.rank === target.rank + 1 : card.rank === 1;
  }

  function isSafeSolitaireFoundationMove(card) {
    const suit = getSolitaireSuit(card);
    const oppositeColor = suit.color === "red" ? "black" : "red";
    const oppositeRanks = SOLITAIRE_SUITS
      .filter((item) => item.color === oppositeColor)
      .map((item) => solitaire.foundations[item.id].length);
    return card.rank <= Math.min(...oppositeRanks) + 1;
  }

  function isValidSolitaireSequence(cards) {
    if (!cards.length || cards.some((card) => !card.faceUp)) return false;
    return cards.every((card, index) => {
      if (index === cards.length - 1) return true;
      const next = cards[index + 1];
      return card.rank === next.rank + 1 && solitaireCardColor(card) !== solitaireCardColor(next);
    });
  }

  function getSelectedSolitaireCards() {
    const selected = solitaire.selected;
    if (!selected) return [];
    if (selected.source === "waste") {
      const card = solitaire.waste[solitaire.waste.length - 1];
      return card ? [card] : [];
    }
    if (selected.source === "foundation") {
      const pile = solitaire.foundations[selected.pile];
      const card = pile[pile.length - 1];
      return card ? [card] : [];
    }
    return solitaire.tableau[selected.pile].slice(selected.cardIndex);
  }

  function removeSelectedSolitaireCards() {
    const selected = solitaire.selected;
    if (selected.source === "waste") return [solitaire.waste.pop()];
    if (selected.source === "foundation") return [solitaire.foundations[selected.pile].pop()];
    return solitaire.tableau[selected.pile].splice(selected.cardIndex);
  }

  function finishSolitaireMove(scoreDelta) {
    solitaire.score = Math.max(0, solitaire.score + scoreDelta);
    solitaire.moves += 1;
    solitaire.selected = null;
    ensureSolitaireIntegrity("card move");
    playTone("tap");
    renderSolitaireBoard();
    renderSolitaireStats();
    if (solitaireFoundationCount() === 52) {
      solitaire.score += Math.max(100, 1200 - solitaireElapsedSeconds());
      solitaire.won = true;
      endSolitaireRun("win");
    }
  }

  function exposeSolitaireTableauTop(column) {
    if (!Number.isInteger(column)) return false;
    const pile = solitaire.tableau[column];
    const card = pile[pile.length - 1];
    if (!card || card.faceUp) return false;
    card.faceUp = true;
    return true;
  }

  function moveSelectedSolitaireToTableau(column) {
    const cards = getSelectedSolitaireCards();
    if (!cards.length || !isValidSolitaireSequence(cards)) return false;
    const targetPile = solitaire.tableau[column];
    const target = targetPile[targetPile.length - 1] || null;
    if (!canPlaceSolitaireTableau(cards[0], target)) return false;
    if (solitaire.selected.source === "tableau" && solitaire.selected.pile === column) return false;
    saveSolitaireHistory();
    const source = { ...solitaire.selected };
    const fromFoundation = source.source === "foundation";
    targetPile.push(...removeSelectedSolitaireCards());
    const flipped = source.source === "tableau" && exposeSolitaireTableauTop(source.pile);
    finishSolitaireMove((fromFoundation ? -10 : 5) + (flipped ? 5 : 0));
    return true;
  }

  function moveSelectedSolitaireToFoundation(suitId) {
    const cards = getSelectedSolitaireCards();
    if (cards.length !== 1 || !canPlaceSolitaireFoundation(cards[0], suitId)) return false;
    if (solitaire.selected.source === "foundation") return false;
    saveSolitaireHistory();
    const source = { ...solitaire.selected };
    solitaire.foundations[suitId].push(...removeSelectedSolitaireCards());
    const flipped = source.source === "tableau" && exposeSolitaireTableauTop(source.pile);
    finishSolitaireMove(10 + (flipped ? 5 : 0));
    return true;
  }

  function flipSolitaireCard(column, cardIndex) {
    const pile = solitaire.tableau[column];
    const card = pile[cardIndex];
    if (!card || card.faceUp || cardIndex !== pile.length - 1) return;
    saveSolitaireHistory();
    card.faceUp = true;
    solitaire.moves += 1;
    solitaire.score += 5;
    solitaire.selected = null;
    ensureSolitaireIntegrity("manual tableau flip");
    playTone("win");
    renderSolitaireBoard();
    renderSolitaireStats();
  }

  function selectSolitaireSource(source, pile, cardIndex = null) {
    solitaire.selected = { source, pile, cardIndex };
    renderSolitaireBoard();
  }

  function handleSolitaireBoardClick(event) {
    if (casperHasGameplayControl("solitaire")) return;
    if (!solitaire.running || solitaire.paused) return;
    const target = event.target.closest("[data-solitaire-action]");
    if (!target || !el.solitaireBoard.contains(target)) return;
    const action = target.dataset.solitaireAction;
    if (action === "stock") {
      drawSolitaireStock();
      return;
    }
    if (action === "waste") {
      if (!solitaire.waste.length) return;
      solitaire.selected = isSolitaireSelected("waste", "waste") ? null : { source: "waste", pile: "waste", cardIndex: solitaire.waste.length - 1 };
      renderSolitaireBoard();
      return;
    }
    if (action === "foundation") {
      const suitId = target.dataset.suit;
      if (solitaire.selected && moveSelectedSolitaireToFoundation(suitId)) return;
      const pile = solitaire.foundations[suitId];
      solitaire.selected = pile.length && !isSolitaireSelected("foundation", suitId)
        ? { source: "foundation", pile: suitId, cardIndex: pile.length - 1 }
        : null;
      renderSolitaireBoard();
      return;
    }
    const column = Number(target.dataset.column);
    if (!Number.isInteger(column)) return;
    if (solitaire.selected && moveSelectedSolitaireToTableau(column)) return;
    if (action === "tableau-card") {
      const cardIndex = Number(target.dataset.index);
      const card = solitaire.tableau[column][cardIndex];
      if (!card?.faceUp) {
        flipSolitaireCard(column, cardIndex);
        return;
      }
      if (!isValidSolitaireSequence(solitaire.tableau[column].slice(cardIndex))) return;
      solitaire.selected = isSolitaireSelected("tableau", column, cardIndex)
        ? null
        : { source: "tableau", pile: column, cardIndex };
      renderSolitaireBoard();
      return;
    }
    solitaire.selected = null;
    renderSolitaireBoard();
  }

  function autoMoveSolitaireCard(source, pile, cardIndex = null) {
    if (!solitaire.running || solitaire.paused) return false;
    selectSolitaireSource(source, pile, cardIndex);
    const card = getSelectedSolitaireCards();
    if (card.length === 1 && moveSelectedSolitaireToFoundation(card[0].suit)) return true;
    solitaire.selected = null;
    renderSolitaireBoard();
    return false;
  }

  function handleSolitaireBoardDoubleClick(event) {
    if (casperHasGameplayControl("solitaire")) return;
    const target = event.target.closest("[data-solitaire-action]");
    if (!target) return;
    const action = target.dataset.solitaireAction;
    if (action === "waste" && solitaire.waste.length) {
      autoMoveSolitaireCard("waste", "waste", solitaire.waste.length - 1);
      return;
    }
    if (action === "tableau-card") {
      const column = Number(target.dataset.column);
      const cardIndex = Number(target.dataset.index);
      if (cardIndex === solitaire.tableau[column].length - 1) autoMoveSolitaireCard("tableau", column, cardIndex);
    }
  }

  function findSolitaireLegalMoves() {
    const moves = [];
    solitaire.tableau.forEach((pile, column) => {
      const card = pile[pile.length - 1];
      if (card && !card.faceUp) {
        moves.push({
          type: "flip",
          source: "tableau",
          pile: column,
          cardIndex: pile.length - 1,
          card,
          priority: 130,
          message: `Flip the face-down card in column ${column + 1}.`
        });
      }
    });

    const waste = solitaire.waste[solitaire.waste.length - 1];
    if (waste && canPlaceSolitaireFoundation(waste, waste.suit)) {
      moves.push({
        type: "waste-foundation",
        source: "waste",
        pile: "waste",
        cardIndex: solitaire.waste.length - 1,
        card: waste,
        priority: isSafeSolitaireFoundationMove(waste) ? 105 : 55,
        message: `Move ${solitaireCardLabel(waste)} to its foundation.`
      });
    }

    solitaire.tableau.forEach((pile, column) => {
      const card = pile[pile.length - 1];
      if (!card?.faceUp || !canPlaceSolitaireFoundation(card, card.suit)) return;
      const revealsCard = pile.length > 1 && !pile[pile.length - 2].faceUp;
      moves.push({
        type: "tableau-foundation",
        source: "tableau",
        pile: column,
        cardIndex: pile.length - 1,
        card,
        priority: revealsCard ? 125 : isSafeSolitaireFoundationMove(card) ? 100 : 50,
        message: `Move ${solitaireCardLabel(card)} to its foundation.`
      });
    });

    const tableauSources = [];
    solitaire.tableau.forEach((pile, column) => {
      pile.forEach((card, cardIndex) => {
        if (!card.faceUp || !isValidSolitaireSequence(pile.slice(cardIndex))) return;
        tableauSources.push({
          source: "tableau",
          pile: column,
          cardIndex,
          cards: pile.slice(cardIndex),
          revealsCard: cardIndex > 0 && !pile[cardIndex - 1].faceUp
        });
      });
    });

    const tableauTargets = (source, cards, priority, type) => {
      solitaire.tableau.forEach((targetPile, column) => {
        if (source.source === "tableau" && source.pile === column) return;
        const target = targetPile[targetPile.length - 1] || null;
        if (!canPlaceSolitaireTableau(cards[0], target)) return;
        const relocatesWholeOpenKingPile = source.source === "tableau"
          && source.cardIndex === 0
          && cards[0].rank === 13
          && !target;
        moves.push({
          type,
          source: source.source,
          pile: source.pile,
          cardIndex: source.cardIndex,
          card: cards[0],
          targetColumn: column,
          useful: !relocatesWholeOpenKingPile,
          priority: source.revealsCard ? 120 : priority,
          message: `Move ${solitaireCardLabel(cards[0])} to column ${column + 1}.`
        });
      });
    };

    if (waste) {
      tableauTargets(
        { source: "waste", pile: "waste", cardIndex: solitaire.waste.length - 1, revealsCard: false },
        [waste],
        90,
        "waste-tableau"
      );
    }
    tableauSources.forEach((source) => tableauTargets(source, source.cards, 80, "tableau-tableau"));

    SOLITAIRE_SUITS.forEach((suit) => {
      const pile = solitaire.foundations[suit.id];
      const card = pile[pile.length - 1];
      if (!card) return;
      tableauTargets(
        { source: "foundation", pile: suit.id, cardIndex: pile.length - 1, revealsCard: false },
        [card],
        30,
        "foundation-tableau"
      );
    });

    return moves.sort((a, b) => b.priority - a.priority);
  }

  function usefulSolitaireStockAction() {
    const buriedWaste = solitaire.waste.slice(0, -1);
    const accessibleCards = [...solitaire.stock, ...buriedWaste];
    const hasPlayableCard = accessibleCards.some((card) => {
      if (canPlaceSolitaireFoundation(card, card.suit)) return true;
      return solitaire.tableau.some((pile) => canPlaceSolitaireTableau(card, pile[pile.length - 1] || null));
    });
    if (!hasPlayableCard) return null;
    if (solitaire.stock.length) return { type: "draw", message: "Draw from the stock to reach another playable card." };
    if (solitaire.waste.length > 1) return { type: "recycle", message: "Recycle the waste pile to reach another playable card." };
    return null;
  }

  function solitairePlanCardId(cardNumber) {
    const number = Number(cardNumber);
    if (!Number.isInteger(number) || number < 0 || number >= 52) return "";
    const suit = SOLITAIRE_SUITS[Math.floor(number / 13)];
    return `${suit.id}-${number % 13 + 1}`;
  }

  function solitairePlanCardIsHome(cardNumber) {
    const number = Number(cardNumber);
    if (!Number.isInteger(number)) return false;
    const suit = SOLITAIRE_SUITS[Math.floor(number / 13)];
    const rank = number % 13 + 1;
    return solitaire.foundations[suit.id].length >= rank;
  }

  function advanceCasperSolitairePlan() {
    solitaire.casperPlanIndex += 1;
    casperRuntime.solitaireMoveAt = performance.now() + 170;
  }

  function executeCasperSolitairePlanStep() {
    const action = solitaire.casperPlan?.[solitaire.casperPlanIndex];
    if (!action) return false;
    const cardId = solitairePlanCardId(action.card);
    if (!cardId) return false;

    if (action.type.endsWith("Foundation") && solitairePlanCardIsHome(action.card)) {
      advanceCasperSolitairePlan();
      return true;
    }

    if (action.type === "tableauFoundation") {
      const pile = solitaire.tableau[action.from];
      const cardIndex = pile?.findIndex((card) => card.id === cardId) ?? -1;
      if (cardIndex < 0 || cardIndex !== pile.length - 1) return false;
      selectSolitaireSource("tableau", action.from, cardIndex);
      const moved = moveSelectedSolitaireToFoundation(pile[cardIndex].suit);
      if (moved) advanceCasperSolitairePlan();
      return moved;
    }

    if (action.type === "tableau") {
      const pile = solitaire.tableau[action.from];
      const cardIndex = pile?.findIndex((card) => card.id === cardId) ?? -1;
      if (cardIndex < 0) return false;
      selectSolitaireSource("tableau", action.from, cardIndex);
      const moved = moveSelectedSolitaireToTableau(action.to);
      if (moved) advanceCasperSolitairePlan();
      return moved;
    }

    const wasteTop = solitaire.waste[solitaire.waste.length - 1];
    if (wasteTop?.id !== cardId) {
      const accessible = solitaire.stock.some((card) => card.id === cardId)
        || solitaire.waste.some((card) => card.id === cardId);
      if (!accessible) return false;
      drawSolitaireStock();
      casperRuntime.solitaireMoveAt = performance.now() + 85;
      return true;
    }

    selectSolitaireSource("waste", "waste", solitaire.waste.length - 1);
    const moved = action.type === "reserveFoundation"
      ? moveSelectedSolitaireToFoundation(wasteTop.suit)
      : moveSelectedSolitaireToTableau(action.to);
    if (moved) advanceCasperSolitairePlan();
    return moved;
  }

  function casperSolitaireStateKey() {
    const foundations = SOLITAIRE_SUITS.map((suit) => solitaire.foundations[suit.id].length).join(".");
    const tableau = solitaire.tableau.map((pile) => pile.map((card) => `${card.id}${card.faceUp ? "u" : "d"}`).join(",")).join("/");
    const stock = solitaire.stock.map((card) => card.id).join(",");
    const waste = solitaire.waste.map((card) => card.id).join(",");
    return `${foundations}|${tableau}|${stock}|${waste}`;
  }

  function scoreCasperSolitaireMove(move) {
    const revealsCard = move.source === "tableau"
      && move.cardIndex > 0
      && !solitaire.tableau[move.pile][move.cardIndex - 1]?.faceUp;
    if (move.type === "flip") return 2400;
    if (revealsCard) return 2100 + (13 - move.card.rank) * 4;
    if (move.type.endsWith("foundation")) {
      return (isSafeSolitaireFoundationMove(move.card) ? 1600 : 900) + move.card.rank * 7;
    }
    if (move.type === "waste-tableau") return 1300 + (13 - move.card.rank) * 5;
    if (move.type === "tableau-tableau") {
      const target = solitaire.tableau[move.targetColumn];
      const emptyKingMove = !target.length && move.card.rank === 13;
      return (emptyKingMove ? 1120 : 760) + move.priority;
    }
    return move.type === "foundation-tableau" ? 80 : move.priority;
  }

  function executeCasperSolitaireMove(move) {
    if (move.type === "flip") {
      flipSolitaireCard(move.pile, move.cardIndex);
      return true;
    }
    selectSolitaireSource(move.source, move.pile, move.cardIndex);
    if (move.type.endsWith("foundation")) return moveSelectedSolitaireToFoundation(move.card.suit);
    if (move.targetColumn !== undefined) return moveSelectedSolitaireToTableau(move.targetColumn);
    solitaire.selected = null;
    return false;
  }

  function runCasperSolitaire() {
    if (!casperHasGameplayControl("solitaire")) return;
    const now = performance.now();
    if (now < casperRuntime.solitaireMoveAt) return;
    if (solitaire.casperPlanIndex < solitaire.casperPlan.length && executeCasperSolitairePlanStep()) return;
    const stateKey = casperSolitaireStateKey();
    const visits = (casperRuntime.solitaireStates.get(stateKey) || 0) + 1;
    casperRuntime.solitaireStates.set(stateKey, visits);
    if (casperRuntime.solitaireStates.size > 500) {
      const oldest = casperRuntime.solitaireStates.keys().next().value;
      casperRuntime.solitaireStates.delete(oldest);
    }

    const moves = findSolitaireLegalMoves()
      .filter((move) => move.useful !== false && move.type !== "foundation-tableau")
      .map((move) => ({ ...move, casperScore: scoreCasperSolitaireMove(move) }))
      .filter((move) => visits < 3 || move.type === "flip" || move.type.endsWith("foundation") || move.type === "waste-tableau")
      .sort((a, b) => b.casperScore - a.casperScore);
    const move = moves[0];
    casperRuntime.solitaireMoveAt = now + 360;
    if (move && executeCasperSolitaireMove(move)) return;

    solitaire.selected = null;
    if (solitaire.stock.length || solitaire.waste.length) {
      drawSolitaireStock();
      return;
    }
    renderSolitaireBoard();
  }

  function showSolitaireHint() {
    if (!solitaire.running || solitaire.paused) return;
    const move = findSolitaireLegalMoves().find((candidate) => candidate.useful !== false);
    if (move) {
      selectSolitaireSource(move.source, move.pile, move.cardIndex);
      showToast("Hint", move.message, "win");
      return;
    }
    const stockAction = usefulSolitaireStockAction();
    if (stockAction) {
      solitaire.selected = null;
      renderSolitaireBoard();
      showToast("Hint", stockAction.message, "win");
      return;
    }
    showToast("No More Moves", "No legal play or useful stock action remains. Undo a move or start a new solvable deal.", "fail");
  }

  function endSolitaireRun(reason = "manual") {
    if (!solitaire.running) return;
    const won = reason === "win";
    const previousBest = Number(state.stats.solitaireBest) || 0;
    const newBest = solitaire.score > previousBest;
    const oldAchievements = new Set(state.achievements);
    const boosterUsed = getEquippedBoosterItem();
    const earned = applyRewardBooster(calculateSolitaireXp(won));
    const coinsEarned = previewSolitaireCoins(won);
    stopSolitaire(false);
    stopGameTheme("stop");
    if (won) playTone("win");
    else playTone("tap");

    state.stats.gamesPlayed += 1;
    state.stats.solitaireRuns += 1;
    state.stats.solitaireWins += won ? 1 : 0;
    state.stats.solitaireTotalScore += solitaire.score;
    state.stats.solitaireBest = Math.max(previousBest, solitaire.score);
    if (boosterUsed) {
      state.boosterCooldowns[boosterUsed.boost] = Date.now() + 10 * 60 * 1000;
      state.equippedBooster = null;
      state.boosterUses += 1;
      if (!state.boosterLevelTarget || state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
      showToast("Booster Used", `${boosterUsed.title} applied. Cooldown started.`, "win");
    }
    state.xp += earned;
    state.stats.solitaireXpEarned += earned;
    state.coins += coinsEarned;
    state.level = deriveLevel(state.xp);
    unlockEarnedAchievements();
    if (boosterUsed && state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
    saveState();
    renderAll();

    const newAchievements = achievements.filter((item) => !oldAchievements.has(item.id) && state.achievements.includes(item.id));
    currentGame = "solitaire";
    el.resultKicker.textContent = "Solitaire Results";
    el.resultTitle.textContent = won ? "Table Cleared" : "Deal Ended";
    if (newBest) showToast("New High Score", `Solitaire best is now ${formatNumber(solitaire.score)}.`, "win");
    showToast("XP Earned", `+${formatNumber(earned)} XP.`, "win");
    showToast("Coins Earned", `+${formatNumber(coinsEarned)} coins.`, "win");
    el.resultScore.textContent = formatNumber(solitaire.score);
    el.resultXp.textContent = formatNumber(earned);
    el.resultCoins.textContent = formatNumber(coinsEarned);
    el.resultBest.textContent = formatNumber(state.stats.solitaireBest);
    el.newBestBadge.classList.toggle("hidden", !newBest);
    el.resultAchievements.innerHTML = newAchievements.map((item) => `<span>${item.title}</span>`).join("");
    el.resultMessage.textContent = won
      ? `Klondike cleared in ${formatSolitaireTime(solitaireElapsedSeconds())} with ${formatNumber(solitaire.moves)} moves.`
      : "Deal saved. Try another shuffle and build all four foundations.";
    el.gameOverModal.classList.remove("hidden");
  }

  let fruitSerial = 0;

  function randomFruitTier() {
    const total = FRUIT_DROP_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
    let roll = Math.random() * total;
    for (let tier = 0; tier < FRUIT_DROP_WEIGHTS.length; tier += 1) {
      roll -= FRUIT_DROP_WEIGHTS[tier];
      if (roll < 0) return tier;
    }
    return FRUIT_DROP_WEIGHTS.length - 1;
  }

  function createFruitState() {
    return {
      running: false,
      paused: false,
      fruits: [],
      particles: [],
      scorePops: [],
      score: 0,
      merges: 0,
      clears: 0,
      largest: 0,
      currentTier: randomFruitTier(),
      nextTier: randomFruitTier(),
      aimX: 270,
      dropReady: true,
      dropReadyAt: 0,
      clearFlash: null,
      lastAt: 0,
      runStartedAt: 0
    };
  }

  function createFruitBody(tier, x, y, options = {}) {
    const type = FRUIT_TYPES[tier];
    const spinRange = tier === FRUIT_PINEAPPLE_TIER ? 0.22 : tier === FRUIT_BANANA_TIER ? 0.5 : 0.8;
    return {
      id: ++fruitSerial,
      tier,
      x,
      y,
      vx: options.vx || 0,
      vy: options.vy || 0,
      radius: type.radius,
      angle: options.angle || 0,
      spin: options.spin ?? (Math.random() - 0.5) * spinRange,
      rollBias: options.rollBias ?? (Math.random() < 0.5 ? -1 : 1),
      spawnedAt: options.spawnedAt || performance.now(),
      supported: false,
      settleFrames: 0,
      sleeping: false
    };
  }

  function fruitCollisionParts(body) {
    if (body.tier !== FRUIT_BANANA_TIER) {
      return [{ x: body.x, y: body.y, radius: body.radius }];
    }

    const radius = body.radius;
    const cos = Math.cos(body.angle);
    const sin = Math.sin(body.angle);
    return [
      { x: -radius * 0.48, y: radius * 0.02, radius: radius * 0.3 },
      { x: 0, y: radius * 0.36, radius: radius * 0.34 },
      { x: radius * 0.48, y: radius * 0.1, radius: radius * 0.3 }
    ].map((part) => ({
      x: body.x + part.x * cos - part.y * sin,
      y: body.y + part.x * sin + part.y * cos,
      radius: part.radius
    }));
  }

  function findFruitContact(a, b) {
    let deepest = null;
    const partsA = fruitCollisionParts(a);
    const partsB = fruitCollisionParts(b);
    partsA.forEach((partA) => {
      partsB.forEach((partB) => {
        const dx = partB.x - partA.x;
        const dy = partB.y - partA.y;
        const minDistance = partA.radius + partB.radius;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq >= minDistance * minDistance) return;
        const distance = Math.sqrt(distanceSq);
        const overlap = minDistance - distance;
        if (deepest && overlap <= deepest.overlap) return;
        if (distance > 0.001) {
          deepest = { nx: dx / distance, ny: dy / distance, overlap };
          return;
        }
        const bodyDx = b.x - a.x;
        const bodyDy = b.y - a.y;
        const bodyDistance = Math.hypot(bodyDx, bodyDy);
        deepest = bodyDistance > 0.001
          ? { nx: bodyDx / bodyDistance, ny: bodyDy / bodyDistance, overlap }
          : { nx: 1, ny: 0, overlap };
      });
    });
    return deepest;
  }

  function fruitSupportState(body, tolerance = 1.5) {
    const bodyParts = fruitCollisionParts(body);
    const minX = Math.min(...bodyParts.map((part) => part.x - part.radius));
    const maxX = Math.max(...bodyParts.map((part) => part.x + part.radius));
    const maxY = Math.max(...bodyParts.map((part) => part.y + part.radius));
    const onFloor = maxY >= FRUIT_BOUNDS.bottom - tolerance;

    const supportNormals = [];
    fruit.fruits.forEach((other) => {
      if (other === body) return;
      const otherParts = fruitCollisionParts(other);
      bodyParts.forEach((bodyPart) => {
        otherParts.forEach((otherPart) => {
          const dx = otherPart.x - bodyPart.x;
          const dy = otherPart.y - bodyPart.y;
          const distance = Math.hypot(dx, dy);
          const contactDistance = bodyPart.radius + otherPart.radius + tolerance;
          if (distance > contactDistance) return;
          if (distance < 0.001) {
            if (other.y > body.y) supportNormals.push({ nx: 0, ny: 1 });
            return;
          }
          const ny = dy / distance;
          if (ny > 0.28) supportNormals.push({ nx: dx / distance, ny });
        });
      });
    });

    const supportedFromLeft = minX <= FRUIT_BOUNDS.left + tolerance
      || supportNormals.some(({ nx, ny }) => nx < -0.16 && ny > 0.34);
    const supportedFromRight = maxX >= FRUIT_BOUNDS.right - tolerance
      || supportNormals.some(({ nx, ny }) => nx > 0.16 && ny > 0.34);
    return {
      stable: onFloor || (supportedFromLeft && supportedFromRight),
      onFloor,
      contacts: supportNormals
    };
  }

  function wakeFruitBody(body) {
    body.sleeping = false;
    body.settleFrames = 0;
  }

  function resolveFruitBounds(body) {
    let parts = fruitCollisionParts(body);
    let minX = Math.min(...parts.map((part) => part.x - part.radius));
    let maxX = Math.max(...parts.map((part) => part.x + part.radius));
    if (minX < FRUIT_BOUNDS.left) {
      body.x += FRUIT_BOUNDS.left - minX;
      body.vx = Math.abs(body.vx) * 0.12;
      body.spin *= 0.7;
    } else if (maxX > FRUIT_BOUNDS.right) {
      body.x -= maxX - FRUIT_BOUNDS.right;
      body.vx = -Math.abs(body.vx) * 0.12;
      body.spin *= 0.7;
    }

    parts = fruitCollisionParts(body);
    const maxY = Math.max(...parts.map((part) => part.y + part.radius));
    if (maxY >= FRUIT_BOUNDS.bottom - 0.75) body.supported = true;
    if (maxY > FRUIT_BOUNDS.bottom) {
      body.y -= maxY - FRUIT_BOUNDS.bottom;
      if (body.vy > 0) body.vy *= -0.08;
      body.vx *= 0.94;
      body.spin *= 0.7;
      if (Math.abs(body.vy) < 10) body.vy = 0;
    }
  }

  function openFruit() {
    currentGame = "fruit";
    prepareGameTheme();
    showScreen("fruit");
    resetFruit();
  }

  function resetFruit() {
    stopFruit(false);
    fruit = createFruitState();
    renderFruitStats();
    drawFruitBlend();
  }

  function startFruit() {
    stopFruit(false);
    fruit = createFruitState();
    fruit.running = true;
    fruit.runStartedAt = Date.now();
    fruit.lastAt = performance.now();
    currentGame = "fruit";
    playGameTheme("fruit", { restart: true, playlist: true, volume: 0.5 });
    renderFruitStats();
    drawFruitBlend();
    fruitTimer = requestAnimationFrame(tickFruit);
    prepareCasperRun("fruit");
  }

  function restartFruit() {
    el.gameOverModal.classList.add("hidden");
    startFruit();
  }

  function stopFruit(render = true) {
    if (fruitTimer) cancelAnimationFrame(fruitTimer);
    fruitTimer = null;
    fruit.running = false;
    fruit.paused = false;
    fruitPointerId = null;
    releaseCasperRun();
    if (render) {
      renderFruitStats();
      drawFruitBlend();
    }
  }

  function handlePrimaryFruitAction() {
    if (fruit.running) {
      endFruitRun("manual");
      return;
    }
    startFruit();
  }

  function toggleFruitPause() {
    if (!fruit.running) return;
    fruit.paused = !fruit.paused;
    fruit.lastAt = performance.now();
    renderFruitStats();
    drawFruitBlend();
  }

  function fruitPointerPosition(event) {
    const rect = el.fruitCanvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / Math.max(1, rect.width)) * el.fruitCanvas.width,
      y: ((event.clientY - rect.top) / Math.max(1, rect.height)) * el.fruitCanvas.height
    };
  }

  function aimFruitFromPointer(event) {
    const point = fruitPointerPosition(event);
    const radius = FRUIT_TYPES[fruit.currentTier].radius;
    fruit.aimX = Math.max(FRUIT_BOUNDS.left + radius, Math.min(FRUIT_BOUNDS.right - radius, point.x));
    drawFruitBlend();
  }

  function dropFruit() {
    if (!fruit.running || fruit.paused || !fruit.dropReady) return;
    const tier = fruit.currentTier;
    const radius = FRUIT_TYPES[tier].radius;
    const x = Math.max(FRUIT_BOUNDS.left + radius, Math.min(FRUIT_BOUNDS.right - radius, fruit.aimX));
    fruit.fruits.push(createFruitBody(tier, x, FRUIT_BOUNDS.top - radius - 12));
    fruit.currentTier = fruit.nextTier;
    fruit.nextTier = randomFruitTier();
    fruit.dropReady = false;
    fruit.dropReadyAt = performance.now() + 390;
    playTone("tap");
    renderFruitStats();
  }

  function evaluateCasperFruitAim(tier, x) {
    const radius = FRUIT_TYPES[tier].radius;
    let landingY = FRUIT_BOUNDS.bottom - radius;
    let support = null;
    fruit.fruits.forEach((body) => {
      const combined = radius + body.radius;
      const dx = Math.abs(x - body.x);
      if (dx >= combined) return;
      const contactY = body.y - Math.sqrt(Math.max(0, combined * combined - dx * dx));
      if (contactY < landingY) {
        landingY = contactY;
        support = body;
      }
    });

    let score = landingY * 3.4;
    if (support?.tier === tier) score += 4800 + tier * 520;
    if (support && support.tier !== tier) score -= Math.abs(support.tier - tier) * 80;
    const sameTier = fruit.fruits.filter((body) => body.tier === tier);
    if (sameTier.length) {
      const nearest = Math.min(...sameTier.map((body) => Math.abs(body.x - x) + Math.max(0, body.y - landingY) * 0.18));
      score += Math.max(0, 820 - nearest * 7);
    }
    const nextMatches = fruit.fruits.filter((body) => body.tier === fruit.nextTier);
    if (nextMatches.length) {
      const nearestNext = Math.min(...nextMatches.map((body) => Math.abs(body.x - x)));
      if (tier !== fruit.nextTier) score += Math.min(160, nearestNext * 0.5);
    }
    if (landingY - radius < FRUIT_BOUNDS.danger + 18) score -= 3600;
    if (radius >= 70) score -= Math.max(0, 76 - Math.min(x - FRUIT_BOUNDS.left, FRUIT_BOUNDS.right - x)) * 12;
    return score;
  }

  function chooseCasperFruitAim(tier) {
    const radius = FRUIT_TYPES[tier].radius;
    const minX = FRUIT_BOUNDS.left + radius;
    const maxX = FRUIT_BOUNDS.right - radius;
    const candidates = [];
    for (let x = minX; x <= maxX; x += 16) candidates.push(x);
    fruit.fruits
      .filter((body) => body.tier === tier)
      .forEach((body) => candidates.push(Math.max(minX, Math.min(maxX, body.x))));
    candidates.push(maxX);
    return candidates
      .map((x) => ({ x, score: evaluateCasperFruitAim(tier, x) }))
      .sort((a, b) => b.score - a.score)[0]?.x || (minX + maxX) / 2;
  }

  function runCasperFruit(now) {
    if (!casperHasGameplayControl("fruit") || !fruit.dropReady || now < casperRuntime.fruitDropAt) return;
    fruit.aimX = chooseCasperFruitAim(fruit.currentTier);
    casperRuntime.fruitDropAt = now + 760;
    dropFruit();
  }

  function tickFruit(now) {
    if (!fruit.running) return;
    const elapsed = Math.max(0.001, Math.min(0.034, (now - fruit.lastAt) / 1000));
    fruit.lastAt = now;
    if (!fruit.paused) {
      const step = elapsed / 2;
      stepFruitPhysics(step, now);
      stepFruitPhysics(step, now);
      if (!fruit.dropReady && now >= fruit.dropReadyAt) fruit.dropReady = true;
      runCasperFruit(now);
      updateFruitParticles(elapsed);
      updateFruitDanger(now);
      if (!fruit.running) return;
    }
    renderFruitStats();
    drawFruitBlend(now);
    fruitTimer = requestAnimationFrame(tickFruit);
  }

  function stepFruitPhysics(dt, now) {
    fruit.fruits.forEach((body) => {
      if (body.sleeping && !fruitSupportState(body).stable) wakeFruitBody(body);
      body.supported = false;
      if (body.sleeping) {
        body.vx = 0;
        body.vy = 0;
        body.spin = 0;
        resolveFruitBounds(body);
        return;
      }
      body.vy += 1120 * dt;
      body.vx *= Math.pow(0.996, dt * 60);
      body.x += body.vx * dt;
      body.y += body.vy * dt;
      body.angle += body.spin * dt;
      const spinDamping = body.tier === FRUIT_PINEAPPLE_TIER ? 0.86 : body.tier === FRUIT_BANANA_TIER ? 0.92 : 0.97;
      body.spin *= Math.pow(spinDamping, dt * 60);
      if (Math.hypot(body.vx, body.vy) < 24) {
        body.vx *= Math.pow(0.96, dt * 60);
        body.spin *= Math.pow(0.82, dt * 60);
      }
      body.spin = Math.max(-2.2, Math.min(2.2, body.spin));
      resolveFruitBounds(body);
    });

    const mergePairs = [];
    for (let i = 0; i < fruit.fruits.length; i += 1) {
      for (let j = i + 1; j < fruit.fruits.length; j += 1) {
        const a = fruit.fruits[i];
        const b = fruit.fruits[j];
        const contact = findFruitContact(a, b);
        if (!contact) continue;
        if (a.tier === b.tier) {
          mergePairs.push([a, b]);
          continue;
        }

        const { nx, ny, overlap } = contact;
        const relativeVelocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        const shouldWakeStack = Math.abs(nx) > 0.58 && relativeVelocity < -72;
        if (shouldWakeStack) {
          if (a.sleeping) wakeFruitBody(a);
          if (b.sleeping) wakeFruitBody(b);
        }
        const invA = a.sleeping ? 0 : 1 / (a.radius * a.radius);
        const invB = b.sleeping ? 0 : 1 / (b.radius * b.radius);
        const invTotal = invA + invB;
        if (invTotal <= 0) continue;
        const correction = Math.max(0, overlap - 0.15) * 0.82;
        a.x -= nx * correction * (invA / invTotal);
        a.y -= ny * correction * (invA / invTotal);
        b.x += nx * correction * (invB / invTotal);
        b.y += ny * correction * (invB / invTotal);

        let normalImpulse = 0;
        if (relativeVelocity < 0) {
          normalImpulse = (-(1.06) * relativeVelocity) / invTotal;
          a.vx -= normalImpulse * nx * invA;
          a.vy -= normalImpulse * ny * invA;
          b.vx += normalImpulse * nx * invB;
          b.vy += normalImpulse * ny * invB;
        }
        const tangentX = -ny;
        const tangentY = nx;
        const linearTangentVelocity = (b.vx - a.vx) * tangentX + (b.vy - a.vy) * tangentY;
        const surfaceTangentVelocity = linearTangentVelocity - a.spin * a.radius - b.spin * b.radius;
        const invInertiaA = a.sleeping ? 0 : (2 * invA) / (a.radius * a.radius);
        const invInertiaB = b.sleeping ? 0 : (2 * invB) / (b.radius * b.radius);
        const tangentInvTotal = invTotal
          + a.radius * a.radius * invInertiaA
          + b.radius * b.radius * invInertiaB;
        const maxFriction = normalImpulse * 0.075;
        const frictionImpulse = Math.max(
          -maxFriction,
          Math.min(maxFriction, -surfaceTangentVelocity / tangentInvTotal)
        );
        a.vx -= frictionImpulse * tangentX * invA;
        a.vy -= frictionImpulse * tangentY * invA;
        b.vx += frictionImpulse * tangentX * invB;
        b.vy += frictionImpulse * tangentY * invB;
        a.spin -= frictionImpulse * a.radius * invInertiaA;
        b.spin -= frictionImpulse * b.radius * invInertiaB;
      }
    }

    fruit.fruits.forEach((body) => {
      const support = fruitSupportState(body);
      body.supported = support.stable;
      if (body.sleeping) {
        if (!body.supported) wakeFruitBody(body);
        return;
      }
      const speed = Math.hypot(body.vx, body.vy);
      if (!support.onFloor && !support.stable && support.contacts.length === 1
        && support.contacts[0].ny > 0.88 && speed < 32) {
        const rollDirection = Math.abs(body.spin) > 0.025 ? Math.sign(body.spin) : body.rollBias;
        body.vx += rollDirection * 48 * dt;
      }
      const canSettle = body.supported && speed < 18 && Math.abs(body.spin) < 0.22 && now - body.spawnedAt > 240;
      if (!canSettle) {
        body.settleFrames = 0;
        return;
      }
      body.settleFrames += 1;
      body.vx *= 0.72;
      body.vy *= 0.45;
      body.spin *= 0.5;
      if (Math.abs(body.vy) < 5) body.vy = 0;
      if (body.settleFrames >= 18) {
        body.sleeping = true;
        body.vx = 0;
        body.vy = 0;
        body.spin = 0;
      }
    });
    mergeFruitPairs(mergePairs, now);
  }

  function mergeFruitPairs(pairs, now) {
    const used = new Set();
    pairs.forEach(([a, b]) => {
      if (used.has(a.id) || used.has(b.id)) return;
      if (!fruit.fruits.includes(a) || !fruit.fruits.includes(b)) return;
      used.add(a.id);
      used.add(b.id);
      fruit.fruits = fruit.fruits.filter((body) => body !== a && body !== b);

      const nextTier = a.tier + 1;
      const mergeX = (a.x + b.x) / 2;
      const mergeY = (a.y + b.y) / 2;
      fruit.fruits.forEach((body) => {
        if (Math.hypot(body.x - mergeX, body.y - mergeY) > body.radius + 150) return;
        body.sleeping = false;
        body.settleFrames = 0;
      });
      const scoreTier = Math.min(nextTier, FRUIT_TYPES.length - 1);
      fruit.merges += 1;
      fruit.largest = Math.max(fruit.largest, scoreTier);
      addFruitMergeParticles(mergeX, mergeY, FRUIT_TYPES[scoreTier].color);

      if (nextTier < FRUIT_TYPES.length) {
        const mergePoints = FRUIT_TYPES[nextTier].points;
        fruit.score += mergePoints;
        addFruitScorePop(mergeX, mergeY, mergePoints, FRUIT_TYPES[nextTier].accent);
        const nextRadius = FRUIT_TYPES[nextTier].radius;
        fruit.fruits.push(createFruitBody(
          nextTier,
          Math.max(FRUIT_BOUNDS.left + nextRadius, Math.min(FRUIT_BOUNDS.right - nextRadius, mergeX)),
          Math.min(FRUIT_BOUNDS.bottom - nextRadius, mergeY),
          {
            vx: (a.vx + b.vx) * 0.28,
            vy: Math.min(-85, (a.vy + b.vy) * 0.18 - 55),
            spin: (a.spin + b.spin) * 0.18,
            spawnedAt: now
          }
        ));
      } else {
        fruit.clears += 1;
        const clearBonus = 10000 + (fruit.clears - 1) * 3000;
        fruit.score += clearBonus;
        fruit.clearFlash = { bonus: clearBonus, life: 1.5 };
        showToast("Maximum Fruit Cleared", `+${formatNumber(clearBonus)} high-score bonus.`, "win", 2600);
        for (let burst = 0; burst < 4; burst += 1) {
          addFruitMergeParticles(mergeX, mergeY, burst % 2 ? "#ffd35a" : "#49f4ff");
        }
      }
      playTone("eat");
    });
  }

  function addFruitMergeParticles(x, y, color) {
    for (let i = 0; i < 14; i += 1) {
      const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.25;
      const speed = 55 + Math.random() * 105;
      fruit.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 35,
        color,
        life: 0.7 + Math.random() * 0.4,
        size: 2 + Math.random() * 4
      });
    }
  }

  function addFruitScorePop(x, y, points, color) {
    fruit.scorePops.push({ x, y: y - 12, points, color, life: 1.15 });
  }

  function updateFruitParticles(dt) {
    fruit.particles = fruit.particles.filter((particle) => {
      particle.life -= dt;
      particle.vy += 280 * dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      return particle.life > 0;
    });
    fruit.scorePops = fruit.scorePops.filter((pop) => {
      pop.life -= dt;
      pop.y -= 28 * dt;
      return pop.life > 0;
    });
    if (fruit.clearFlash) {
      fruit.clearFlash.life -= dt;
      if (fruit.clearFlash.life <= 0) fruit.clearFlash = null;
    }
  }

  function updateFruitDanger(now) {
    const overflowed = fruit.fruits.some((body) => {
      if (now - body.spawnedAt <= 900) return false;
      const top = Math.min(...fruitCollisionParts(body).map((part) => part.y - part.radius));
      return top < FRUIT_BOUNDS.danger;
    });
    if (overflowed) endFruitRun("overflow");
  }

  function calculateFruitXp() {
    if (fruit.score <= 0) return 0;
    const sizeBonus = fruit.largest * 9;
    return Math.max(12, Math.round(fruit.score * 0.22 + fruit.merges * 3 + sizeBonus + fruit.clears * 75));
  }

  function previewFruitCoins(newBest = fruit.score > state.stats.fruitBest) {
    if (fruit.score <= 0) return 0;
    let earned = Math.max(2, Math.floor(fruit.score / 22) + fruit.largest * 2 + fruit.clears * 25);
    if (newBest) earned += 25;
    return applyRewardBooster(earned);
  }

  function renderFruitStats() {
    const liveBest = Math.max(Number(state.stats.fruitBest) || 0, fruit.score);
    el.fruitScore.textContent = formatNumber(fruit.score);
    el.fruitBest.textContent = formatNumber(liveBest);
    el.fruitClears.textContent = formatNumber(fruit.clears);
    el.fruitXpPreview.textContent = formatNumber(applyRewardBooster(calculateFruitXp()));
    el.fruitCoinPreview.textContent = formatNumber(previewFruitCoins());
    el.fruitPauseBtn.disabled = !fruit.running;
    el.fruitPauseBtn.textContent = fruit.paused ? "Resume" : "Pause";
    el.startFruitBtn.textContent = fruit.running ? "End Run" : "Start Game";
  }

  function drawFruitBlend(now = performance.now()) {
    const ctx = el.fruitCanvas.getContext("2d");
    const width = el.fruitCanvas.width;
    const height = el.fruitCanvas.height;
    ctx.clearRect(0, 0, width, height);

    const backdrop = ctx.createLinearGradient(0, 0, 0, height);
    backdrop.addColorStop(0, "#17072f");
    backdrop.addColorStop(0.55, "#09051a");
    backdrop.addColorStop(1, "#030208");
    ctx.fillStyle = backdrop;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(73, 244, 255, 0.07)";
    ctx.lineWidth = 1;
    for (let y = 0; y < height; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.save();
    ctx.strokeStyle = "rgba(73, 244, 255, 0.52)";
    ctx.lineWidth = 5;
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#49f4ff";
    ctx.beginPath();
    ctx.moveTo(FRUIT_BOUNDS.left, FRUIT_BOUNDS.top);
    ctx.lineTo(FRUIT_BOUNDS.left, FRUIT_BOUNDS.bottom);
    ctx.lineTo(FRUIT_BOUNDS.right, FRUIT_BOUNDS.bottom);
    ctx.lineTo(FRUIT_BOUNDS.right, FRUIT_BOUNDS.top);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(255, 63, 117, 0.5)";
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 9]);
    ctx.beginPath();
    ctx.moveTo(FRUIT_BOUNDS.left + 4, FRUIT_BOUNDS.danger);
    ctx.lineTo(FRUIT_BOUNDS.right - 4, FRUIT_BOUNDS.danger);
    ctx.stroke();
    ctx.restore();

    if (fruit.running && fruit.dropReady) {
      const preview = createFruitBody(fruit.currentTier, fruit.aimX, 75, { spin: 0, spawnedAt: now });
      fruitSerial -= 1;
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
      ctx.setLineDash([5, 8]);
      ctx.beginPath();
      ctx.moveTo(fruit.aimX, 98);
      ctx.lineTo(fruit.aimX, FRUIT_BOUNDS.bottom - 6);
      ctx.stroke();
      ctx.restore();
      drawFruitSprite(ctx, preview, 0.92);
    }

    const nextCardX = width - 124;
    const nextCardCenter = width - 71;
    const nextType = FRUIT_TYPES[fruit.nextTier];
    ctx.fillStyle = "rgba(5, 3, 11, 0.78)";
    ctx.beginPath();
    ctx.roundRect(nextCardX, 14, 106, 108, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(73, 244, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();
    const nextScale = Math.min(0.72, 30 / nextType.radius);
    const nextPreview = createFruitBody(fruit.nextTier, nextCardCenter, 65, { spin: 0, spawnedAt: now });
    fruitSerial -= 1;
    drawFruitSprite(ctx, nextPreview, 1, nextScale);
    ctx.fillStyle = "rgba(5, 3, 11, 0.86)";
    ctx.beginPath();
    ctx.roundRect(nextCardX + 7, 20, 38, 17, 5);
    ctx.fill();
    ctx.fillStyle = "#b8add1";
    ctx.font = "800 9px Arial";
    ctx.textAlign = "center";
    ctx.fillText("NEXT", nextCardX + 26, 32);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.beginPath();
    ctx.moveTo(nextCardX + 10, 98);
    ctx.lineTo(nextCardX + 96, 98);
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${nextType.name.length > 10 ? 8 : 9}px Arial Black`;
    ctx.textBaseline = "middle";
    ctx.fillText(nextType.name.toUpperCase(), nextCardCenter, 110, 92);
    ctx.textBaseline = "alphabetic";

    fruit.fruits.forEach((body) => drawFruitSprite(ctx, body));
    fruit.particles.forEach((particle) => {
      ctx.globalAlpha = Math.min(1, particle.life * 1.7);
      ctx.fillStyle = particle.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = particle.color;
      ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    fruit.scorePops.forEach((pop) => {
      ctx.save();
      ctx.globalAlpha = Math.min(1, pop.life * 1.7);
      ctx.fillStyle = pop.color;
      ctx.shadowBlur = 14;
      ctx.shadowColor = pop.color;
      ctx.font = "900 21px ByteBounce, Arial Black";
      ctx.textAlign = "center";
      ctx.fillText(`+${formatNumber(pop.points)}`, pop.x, pop.y);
      ctx.restore();
    });

    if (fruit.clearFlash) {
      const progress = Math.max(0, fruit.clearFlash.life / 1.5);
      ctx.save();
      ctx.globalAlpha = Math.min(1, progress * 1.6);
      ctx.fillStyle = "rgba(5, 3, 11, 0.68)";
      ctx.roundRect(92, height * 0.39, width - 184, 102, 18);
      ctx.fill();
      ctx.fillStyle = "#ffd35a";
      ctx.shadowBlur = 24;
      ctx.shadowColor = "#ff2fad";
      ctx.font = "900 24px Arial Black";
      ctx.textAlign = "center";
      ctx.fillText("MAX FRUIT CLEARED", width / 2, height * 0.39 + 40);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 30px Arial Black";
      ctx.fillText(`+${formatNumber(fruit.clearFlash.bonus)}`, width / 2, height * 0.39 + 78);
      ctx.restore();
    }

    if (!fruit.running || fruit.paused) {
      ctx.fillStyle = "rgba(5, 3, 11, 0.64)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 18;
      ctx.shadowColor = fruit.paused ? "#ffd35a" : "#49f4ff";
      ctx.font = "900 34px Arial Black";
      ctx.textAlign = "center";
      ctx.fillText(fruit.paused ? "PAUSED" : "PRESS START", width / 2, height / 2 - 8);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#b8add1";
      ctx.font = "700 16px Arial";
      ctx.fillText(fruit.paused ? "Press Resume to keep blending" : "Match identical fruit to grow the blend", width / 2, height / 2 + 26);
    }
    ctx.textAlign = "left";
  }

  function drawFruitSprite(ctx, body, alpha = 1, scale = 1) {
    const type = FRUIT_TYPES[body.tier];
    const radius = body.radius * scale;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(body.x, body.y);
    ctx.rotate(body.angle || 0);
    ctx.shadowBlur = Math.max(8, radius * 0.28);
    ctx.shadowColor = type.color;

    const gradient = ctx.createRadialGradient(-radius * 0.35, -radius * 0.42, radius * 0.08, 0, 0, radius);
    gradient.addColorStop(0, type.accent);
    gradient.addColorStop(0.45, type.color);
    gradient.addColorStop(1, "#3f173d");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    if (body.tier === 1) {
      ctx.moveTo(0, radius * 0.96);
      ctx.bezierCurveTo(-radius * 0.2, radius * 0.78, -radius * 0.78, radius * 0.42, -radius * 0.8, -radius * 0.18);
      ctx.bezierCurveTo(-radius * 0.82, -radius * 0.6, -radius * 0.38, -radius * 0.84, 0, -radius * 0.58);
      ctx.bezierCurveTo(radius * 0.38, -radius * 0.84, radius * 0.82, -radius * 0.6, radius * 0.8, -radius * 0.18);
      ctx.bezierCurveTo(radius * 0.78, radius * 0.42, radius * 0.2, radius * 0.78, 0, radius * 0.96);
      ctx.closePath();
    } else if (body.tier === FRUIT_BANANA_TIER) {
      ctx.moveTo(-radius * 0.88, -radius * 0.34);
      ctx.bezierCurveTo(-radius * 0.68, radius * 0.58, radius * 0.3, radius * 0.82, radius * 0.9, -radius * 0.08);
      ctx.bezierCurveTo(radius * 0.58, radius * 0.22, radius * 0.02, radius * 0.34, -radius * 0.58, -radius * 0.3);
      ctx.bezierCurveTo(-radius * 0.7, -radius * 0.42, -radius * 0.82, -radius * 0.42, -radius * 0.88, -radius * 0.34);
      ctx.closePath();
    } else if (body.tier === FRUIT_PINEAPPLE_TIER) {
      ctx.ellipse(0, radius * 0.08, radius * 0.78, radius * 0.94, 0, 0, Math.PI * 2);
    } else {
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, radius * 0.045);
    ctx.strokeStyle = "rgba(255,255,255,0.62)";
    ctx.stroke();
    ctx.shadowBlur = 0;

    if ([0, 3, 4, 5].includes(body.tier)) {
      ctx.strokeStyle = "#6e3d25";
      ctx.lineWidth = Math.max(2, radius * 0.08);
      ctx.beginPath();
      ctx.moveTo(0, -radius * 0.78);
      ctx.quadraticCurveTo(radius * 0.06, -radius * 1.18, radius * 0.24, -radius * 1.24);
      ctx.stroke();
      ctx.fillStyle = "#57ff9a";
      ctx.beginPath();
      ctx.ellipse(radius * 0.28, -radius * 1.12, radius * 0.28, radius * 0.12, -0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    if (body.tier === 1) {
      ctx.fillStyle = "#57ff9a";
      for (let leaf = -2; leaf <= 2; leaf += 1) {
        ctx.save();
        ctx.translate(0, -radius * 0.58);
        ctx.rotate(leaf * 0.34);
        ctx.beginPath();
        ctx.ellipse(0, -radius * 0.16, radius * 0.16, radius * 0.38, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.strokeStyle = "#4c7c2a";
      ctx.lineWidth = Math.max(1.5, radius * 0.07);
      ctx.beginPath();
      ctx.moveTo(0, -radius * 0.72);
      ctx.quadraticCurveTo(radius * 0.02, -radius * 1.02, radius * 0.14, -radius * 1.1);
      ctx.stroke();

      const seeds = [
        [-0.42, -0.26], [0, -0.34], [0.42, -0.26],
        [-0.56, 0.08], [-0.2, 0.04], [0.22, 0.04], [0.56, 0.08],
        [-0.38, 0.4], [0, 0.34], [0.38, 0.4], [0, 0.68]
      ];
      ctx.fillStyle = "#ffe58a";
      seeds.forEach(([seedX, seedY]) => {
        ctx.beginPath();
        ctx.ellipse(seedX * radius, seedY * radius, Math.max(0.9, radius * 0.045), Math.max(1.4, radius * 0.075), seedX * 0.35, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    if (body.tier === FRUIT_BANANA_TIER) {
      ctx.strokeStyle = "rgba(255, 249, 176, 0.8)";
      ctx.lineWidth = Math.max(2, radius * 0.045);
      ctx.beginPath();
      ctx.moveTo(-radius * 0.6, -radius * 0.16);
      ctx.bezierCurveTo(-radius * 0.3, radius * 0.42, radius * 0.35, radius * 0.5, radius * 0.68, radius * 0.02);
      ctx.stroke();
      ctx.fillStyle = "#6e3d25";
      ctx.beginPath();
      ctx.ellipse(-radius * 0.84, -radius * 0.33, radius * 0.1, radius * 0.15, -0.7, 0, Math.PI * 2);
      ctx.ellipse(radius * 0.88, -radius * 0.08, radius * 0.09, radius * 0.14, 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    if (body.tier === FRUIT_PINEAPPLE_TIER) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, radius * 0.08, radius * 0.76, radius * 0.92, 0, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = "rgba(126, 76, 22, 0.62)";
      ctx.lineWidth = Math.max(1.4, radius * 0.038);
      for (let offset = -0.82; offset <= 0.72; offset += 0.25) {
        ctx.beginPath();
        ctx.moveTo(-radius, offset * radius);
        ctx.lineTo(radius, (offset + 0.62) * radius);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(radius, offset * radius);
        ctx.lineTo(-radius, (offset + 0.62) * radius);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(255, 244, 140, 0.72)";
      for (let y = -0.55; y <= 0.68; y += 0.31) {
        for (let x = -0.48; x <= 0.48; x += 0.32) {
          ctx.beginPath();
          ctx.arc(x * radius, y * radius, Math.max(1.2, radius * 0.028), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      for (let i = -3; i <= 3; i += 1) {
        ctx.save();
        ctx.translate(0, -radius * 0.77);
        ctx.rotate(i * 0.2);
        ctx.fillStyle = i % 2 ? "#29d777" : "#57ff9a";
        ctx.beginPath();
        ctx.ellipse(0, -radius * (0.38 + Math.abs(i) * 0.035), radius * 0.12, radius * (0.42 - Math.abs(i) * 0.025), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    if (body.tier === FRUIT_COCONUT_TIER) {
      ctx.strokeStyle = "rgba(35, 15, 11, 0.48)";
      ctx.lineWidth = Math.max(2, radius * 0.045);
      for (let i = -2; i <= 2; i += 1) {
        ctx.beginPath();
        ctx.moveTo(i * radius * 0.22, -radius * 0.84);
        ctx.quadraticCurveTo(i * radius * 0.34, 0, i * radius * 0.18, radius * 0.88);
        ctx.stroke();
      }
    }

    if (body.tier === FRUIT_WATERMELON_TIER) {
      ctx.strokeStyle = "rgba(20, 92, 44, 0.7)";
      ctx.lineWidth = Math.max(3, radius * 0.065);
      for (let i = -2; i <= 2; i += 1) {
        ctx.beginPath();
        ctx.moveTo(i * radius * 0.28, -radius * 0.9);
        ctx.quadraticCurveTo((i + 0.5) * radius * 0.2, 0, i * radius * 0.28, radius * 0.9);
        ctx.stroke();
      }
    }

    const faceOffsetY = body.tier === FRUIT_BANANA_TIER ? radius * 0.35 : body.tier === 1 ? radius * 0.08 : 0;
    const eyeY = faceOffsetY - radius * 0.08;
    const eyeX = radius * 0.28;
    ctx.fillStyle = "#100817";
    ctx.beginPath();
    ctx.arc(-eyeX, eyeY, Math.max(1.6, radius * 0.075), 0, Math.PI * 2);
    ctx.arc(eyeX, eyeY, Math.max(1.6, radius * 0.075), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#100817";
    ctx.lineWidth = Math.max(1.4, radius * 0.045);
    ctx.beginPath();
    ctx.arc(0, faceOffsetY + radius * 0.12, radius * 0.22, 0.08 * Math.PI, 0.92 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  function endFruitRun(reason = "overflow") {
    if (!fruit.running) return;
    const previousBest = Number(state.stats.fruitBest) || 0;
    const newBest = fruit.score > previousBest;
    const oldAchievements = new Set(state.achievements);
    const boosterUsed = getEquippedBoosterItem("fruit");
    const earned = applyRewardBooster(calculateFruitXp());
    const coinsEarned = previewFruitCoins(newBest);
    stopFruit(false);
    stopGameTheme(reason === "overflow" ? "death" : "stop");
    if (reason === "overflow") playGameOverSound();
    else playTone("tap");

    state.stats.gamesPlayed += 1;
    state.stats.fruitRuns += 1;
    state.stats.fruitTotalScore += fruit.score;
    state.stats.fruitBest = Math.max(previousBest, fruit.score);
    state.stats.fruitMerges += fruit.merges;
    state.stats.fruitLargest = Math.max(Number(state.stats.fruitLargest) || 0, fruit.largest);
    state.stats.fruitClears += fruit.clears;
    if (boosterUsed) {
      state.boosterCooldowns[boosterUsed.boost] = Date.now() + 10 * 60 * 1000;
      state.equippedBooster = null;
      state.boosterUses += 1;
      if (!state.boosterLevelTarget || state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
      showToast("Booster Used", `${boosterUsed.title} applied. Cooldown started.`, "win");
    }
    state.xp += earned;
    state.stats.fruitXpEarned += earned;
    state.coins += coinsEarned;
    state.level = deriveLevel(state.xp);
    unlockEarnedAchievements();
    if (boosterUsed && state.level >= state.boosterLevelTarget) state.boosterLevelTarget = state.level + 2;
    saveState();
    renderAll();

    const newAchievements = achievements.filter((item) => !oldAchievements.has(item.id) && state.achievements.includes(item.id));
    currentGame = "fruit";
    el.resultKicker.textContent = "Fruit Blend Results";
    el.resultTitle.textContent = reason === "overflow" ? "Container Overflow" : "Blend Complete";
    if (newBest) showToast("New High Score", `Fruit Blend best is now ${formatNumber(fruit.score)}.`, "win");
    showToast("XP Earned", `+${formatNumber(earned)} XP.`, "win");
    showToast("Coins Earned", `+${formatNumber(coinsEarned)} coins.`, "win");
    el.resultScore.textContent = formatNumber(fruit.score);
    el.resultXp.textContent = formatNumber(earned);
    el.resultCoins.textContent = formatNumber(coinsEarned);
    el.resultBest.textContent = formatNumber(state.stats.fruitBest);
    el.newBestBadge.classList.toggle("hidden", !newBest);
    el.resultAchievements.innerHTML = newAchievements.map((item) => `<span>${item.title}</span>`).join("");
    el.resultMessage.textContent = `${formatNumber(fruit.merges)} blends, ${formatNumber(fruit.clears)} max clears. Largest fruit: ${FRUIT_TYPES[fruit.largest]?.name || "Cherry"}.`;
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
      ["solitaire_first", state.stats.solitaireRuns >= 1],
      ["solitaire_win", state.stats.solitaireWins >= 1],
      ["fruit_first", state.stats.fruitRuns >= 1],
      ["fruit_500", state.stats.fruitBest >= 500],
      ["fruit_melon", state.stats.fruitLargest >= FRUIT_TYPES.length - 1],
      ["fruit_clear", state.stats.fruitClears >= 1],
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
    if (el.notificationUpdateBtn) {
      el.notificationUpdateBtn.disabled = true;
      el.notificationUpdateBtn.textContent = "Checking...";
    }
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
    const hasRemoteUpdate = remoteVersion !== APP_VERSION;

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
      showToast(
        "Update Available",
        `ARCADIA ${remoteVersion} was found. Refreshing to install the latest release.`,
        "win",
        5000,
        { category: "update", version: remoteVersion, notes: remoteNotes.slice(0, 8) }
      );
      setTimeout(() => window.location.reload(), 900);
      return;
    }
    localStorage.setItem(VERSION_KEY, APP_VERSION);
    showToast(
      "No Updates Found",
      `ARCADIA ${APP_VERSION} is already running the latest patch.`,
      "tap",
      5000,
      { category: "update", version: APP_VERSION, notes: PATCH_NOTES.slice(0, 2) }
    );
    if (el.notificationUpdateBtn) {
      el.notificationUpdateBtn.disabled = false;
      el.notificationUpdateBtn.textContent = "Check for Updates";
    }
  }

  function recordInstalledVersionChange() {
    let previousVersion = "";
    try {
      previousVersion = normalizeVersion(localStorage.getItem(VERSION_KEY));
    } catch {
      previousVersion = "";
    }
    if (previousVersion && previousVersion !== APP_VERSION) {
      recordActivity(
        "ARCADIA Updated",
        `Version ${previousVersion} to Version ${APP_VERSION} is now installed.`,
        "win",
        { category: "update", version: APP_VERSION, notes: PATCH_NOTES.slice(0, 8) }
      );
    }
    try {
      localStorage.setItem(VERSION_KEY, APP_VERSION);
    } catch {
      // Private browsing can block persistent version history.
    }
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
    if (!state.devModeEnabled) state.casperEnabled = false;
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
    if (!star.running || star.paused || casperHasGameplayControl("star")) return;
    event.preventDefault();
    star.joystickPointerId = event.pointerId;
    el.starJoystick.setPointerCapture?.(event.pointerId);
    updateStarJoystick(event);
  }

  function moveStarJoystick(event) {
    if (star.paused || casperHasGameplayControl("star")) return;
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
    el.openNotificationsBtn.addEventListener("click", openNotificationsModal);
    el.closeNotificationsBtn.addEventListener("click", closeNotificationsModal);
    el.notificationsModal.addEventListener("click", (event) => {
      if (event.target === el.notificationsModal) closeNotificationsModal();
    });
    el.notificationUpdateBtn.addEventListener("click", searchForUpdates);
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
    el.checkUpdatesBtn.addEventListener("click", () => searchForUpdates());
    el.openRenameBtn.addEventListener("click", openRenameModal);
    el.casperToggleBtn.addEventListener("click", toggleCasper);
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
    el.storeSearch.addEventListener("input", () => {
      storeScrollTop = 0;
      renderStore();
    });
    el.storeFilters.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-store-filter]");
      if (!chip) return;
      activeStoreFilter = chip.dataset.storeFilter || "all";
      storeScrollTop = 0;
      renderStore();
    });
    el.storeGrid.addEventListener("scroll", () => {
      storeScrollTop = el.storeGrid.scrollTop;
    }, { passive: true });
    document.querySelectorAll(".store-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        activeStoreTab = tab.dataset.storeTab || "player";
        activeStoreFilter = "all";
        storeScrollTop = 0;
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
      } else if (currentGame === "solitaire") {
        startSolitaire();
      } else if (currentGame === "fruit") {
        startFruit();
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
    el.exitSolitaireBtn.addEventListener("click", () => showScreen("home"));
    el.solitairePauseBtn.addEventListener("click", toggleSolitairePause);
    el.startSolitaireBtn.addEventListener("click", handlePrimarySolitaireAction);
    el.restartSolitaireBtn.addEventListener("click", restartSolitaire);
    el.undoSolitaireBtn.addEventListener("click", undoSolitaireMove);
    el.hintSolitaireBtn.addEventListener("click", showSolitaireHint);
    el.solitaireBoard.addEventListener("click", handleSolitaireBoardClick);
    el.solitaireBoard.addEventListener("dblclick", handleSolitaireBoardDoubleClick);
    el.exitFruitBtn.addEventListener("click", () => showScreen("home"));
    el.fruitPauseBtn.addEventListener("click", toggleFruitPause);
    el.startFruitBtn.addEventListener("click", handlePrimaryFruitAction);
    el.restartFruitBtn.addEventListener("click", restartFruit);
    el.fruitCanvas.addEventListener("pointermove", (event) => {
      if (!fruit.running || fruit.paused || casperHasGameplayControl("fruit")) return;
      event.preventDefault();
      aimFruitFromPointer(event);
    });
    el.fruitCanvas.addEventListener("pointerdown", (event) => {
      if (!fruit.running || fruit.paused || casperHasGameplayControl("fruit")) return;
      event.preventDefault();
      fruitPointerId = event.pointerId;
      aimFruitFromPointer(event);
      el.fruitCanvas.setPointerCapture?.(event.pointerId);
    });
    el.fruitCanvas.addEventListener("pointerup", (event) => {
      if (casperHasGameplayControl("fruit")) return;
      if (fruitPointerId !== event.pointerId) return;
      event.preventDefault();
      aimFruitFromPointer(event);
      fruitPointerId = null;
      dropFruit();
    });
    el.fruitCanvas.addEventListener("pointercancel", () => { fruitPointerId = null; });
    el.flappyCanvas.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (casperHasGameplayControl("flappy")) return;
      flapBird();
    });
    el.crossyCanvas.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (casperHasGameplayControl("crossy")) return;
      crossyTouchStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
      el.crossyCanvas.setPointerCapture?.(event.pointerId);
    });
    el.crossyCanvas.addEventListener("pointerup", (event) => {
      event.preventDefault();
      if (casperHasGameplayControl("crossy")) return;
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
      if (casperHasGameplayControl("stack")) return;
      placeStackBlock();
    });
    el.starJoystick.addEventListener("pointerdown", startStarJoystick);
    el.starJoystick.addEventListener("pointermove", moveStarJoystick);
    el.starJoystick.addEventListener("pointerup", endStarJoystick);
    el.starJoystick.addEventListener("pointercancel", endStarJoystick);
    el.starShootBtn.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (!star.running || star.paused || casperHasGameplayControl("star")) return;
      star.shootHeld = true;
      shootStar();
    });
    el.starShootBtn.addEventListener("pointerup", () => {
      if (!casperHasGameplayControl("star")) star.shootHeld = false;
    });
    el.starShootBtn.addEventListener("pointercancel", () => {
      if (!casperHasGameplayControl("star")) star.shootHeld = false;
    });
    el.starBoosterBtn?.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (casperHasGameplayControl("star")) return;
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
      if (keyMap[event.key] && currentScreen === "star" && star.running && !star.paused && !casperHasGameplayControl("star")) {
        event.preventDefault();
        const dir = keyMap[event.key];
        star.input.x = dir === "left" ? -1 : dir === "right" ? 1 : star.input.x;
        star.input.y = dir === "up" ? -1 : dir === "down" ? 1 : star.input.y;
      }
      if (keyMap[event.key] && currentScreen === "crossy" && !casperHasGameplayControl("crossy")) {
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
        else if (!star.paused && !casperHasGameplayControl("star")) shootStar();
      }
      if (event.key === " " && currentScreen === "stack") {
        event.preventDefault();
        if (!casperHasGameplayControl("stack")) placeStackBlock();
      }
      if ([" ", "ArrowUp", "w", "W"].includes(event.key) && currentScreen === "flappy") {
        event.preventDefault();
        if (!flappy.running) startFlappy();
        else if (!casperHasGameplayControl("flappy")) flapBird();
      }
      if (event.key === " " && currentScreen === "crossy") {
        event.preventDefault();
        if (!crossy.running) startCrossy();
        else if (!casperHasGameplayControl("crossy")) moveCrossy("up");
      }
      if (event.key === " " && currentScreen === "fruit") {
        event.preventDefault();
        if (!fruit.running) startFruit();
        else if (!casperHasGameplayControl("fruit")) dropFruit();
      }
      if (currentScreen === "fruit" && fruit.running && !casperHasGameplayControl("fruit") && ["ArrowLeft", "a", "A", "ArrowRight", "d", "D"].includes(event.key)) {
        event.preventDefault();
        const direction = ["ArrowLeft", "a", "A"].includes(event.key) ? -1 : 1;
        const radius = FRUIT_TYPES[fruit.currentTier].radius;
        fruit.aimX = Math.max(FRUIT_BOUNDS.left + radius, Math.min(FRUIT_BOUNDS.right - radius, fruit.aimX + direction * 18));
        drawFruitBlend();
      }
    });

    document.addEventListener("keyup", (event) => {
      if (currentScreen !== "star" || casperHasGameplayControl("star")) return;
      if (["ArrowLeft", "ArrowRight", "a", "A", "d", "D"].includes(event.key)) star.input.x = 0;
      if (["ArrowUp", "ArrowDown", "w", "W", "s", "S"].includes(event.key)) star.input.y = 0;
    });

    el.snakeCanvas.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (casperHasGameplayControl("snake")) return;
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
      if (currentScreen === "solitaire") renderSolitaireBoard();
      if (currentScreen === "fruit") drawFruitBlend();
      if (!document.body.classList.contains("video-live")) return;
      startBackgroundVideo();
    });
  }

  function init() {
    bindEvents();
    recordInstalledVersionChange();
    registerServiceWorker();
    drawSnake();
    renderSolitaireBoard();
    drawFruitBlend();
    setTimeout(() => {
      if (currentScreen === "boot") {
        showConnectionPrompt();
      }
    }, 2200);
  }

  init();
})();
