(() => {
  "use strict";

  const STORAGE_KEY = "arcadia_player_v1";
  const XP_PER_LEVEL = 500;
  const GRID_SIZE = 20;
  const GAME_TICK_MS = 112;

  const $ = (id) => document.getElementById(id);
  const defaultState = {
    playerName: "",
    xp: 0,
    coins: 0,
    level: 1,
    owned: [],
    activeBoost: null,
    stats: {
      gamesPlayed: 0,
      snakeRuns: 0,
      snakeBest: 0,
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
    { id: "level_5", title: "High Score Hero", text: "Reach level 5." }
  ];

  const storeItems = [
    { id: "neon_badge", title: "Neon Nameplate", level: 1, cost: 150, text: "Add a brighter glow to your player profile." },
    { id: "xp_boost_2", title: "2X XP Booster", level: 3, cost: 600, text: "Double XP and coins from your next completed run." },
    { id: "xp_boost_3", title: "3X XP Booster", level: 5, cost: 1400, text: "Triple XP and coins from your next completed run." }
  ];

  let state = loadState();
  let audioCtx = null;
  let currentScreen = "boot";
  let snakeTimer = null;
  let snake = createSnakeState();
  let touchStart = null;

  const el = {
    bootScreen: $("bootScreen"),
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
    profileName: $("profileName"),
    profileStatus: $("profileStatus"),
    profileShareBtn: $("profileShareBtn"),
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
    storeGrid: $("storeGrid"),
    snakeCanvas: $("snakeCanvas"),
    snakeScore: $("snakeScore"),
    snakeBest: $("snakeBest"),
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
      coins: legacyCoins,
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

  function deriveLevel(xp) {
    return Math.floor((Number(xp) || 0) / XP_PER_LEVEL) + 1;
  }

  function xpForLevel(level) {
    return (Math.max(1, level) - 1) * XP_PER_LEVEL;
  }

  function xpIntoLevel() {
    return state.xp - xpForLevel(state.level);
  }

  function showScreen(name) {
    currentScreen = name;
    el.bootScreen.classList.toggle("hidden", name !== "boot");
    el.nameScreen.classList.toggle("hidden", name !== "name");
    el.homeScreen.classList.toggle("hidden", name !== "home");
    el.profileScreen.classList.toggle("hidden", name !== "profile");
    el.gameScreen.classList.toggle("hidden", name !== "game");
    if (name !== "game") stopSnake();
    renderAll();
  }

  function playTone(kind = "tap") {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;
      const tones = {
        tap: [440, 0.04],
        eat: [860, 0.07],
        win: [980, 0.12],
        fail: [170, 0.16],
        level: [1260, 0.22]
      };
      const [freq, duration] = tones[kind] || tones.tap;
      osc.type = kind === "fail" ? "sawtooth" : "square";
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

  function showToast(title, text, kind = "tap") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<strong>${title}</strong><small>${text}</small>`;
    el.toastStack.appendChild(toast);
    playTone(kind);
    setTimeout(() => toast.remove(), 3000);
  }

  function renderAll() {
    state.level = deriveLevel(state.xp);
    renderHeader();
    renderGames();
    renderProfile();
    renderAchievements();
    renderLeaderboard();
    renderStore();
    renderSnakeStats();
  }

  function renderHeader() {
    const name = state.playerName || "PLAYER";
    const initial = name.trim()[0]?.toUpperCase() || "P";
    const current = xpIntoLevel();
    const pct = Math.max(0, Math.min(100, (current / XP_PER_LEVEL) * 100));
    el.playerHandle.textContent = name.toUpperCase();
    el.playerLevel.textContent = `Level ${state.level}`;
    el.headerCoins.textContent = formatNumber(state.coins);
    el.headerXpFill.style.width = `${pct}%`;
    el.headerXpTrack.setAttribute("aria-valuenow", String(Math.round(current)));
    el.headerXpTrack.setAttribute("aria-valuemax", String(XP_PER_LEVEL));
    el.headerXpText.textContent = `${formatNumber(current)} / ${formatNumber(XP_PER_LEVEL)} XP to Level ${state.level + 1}`;
    el.profileAvatar.textContent = initial;
    el.profileName.textContent = name.toUpperCase();
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
      card.innerHTML = `
        <div class="game-art"><strong>${game.mark}</strong></div>
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
    const pct = Math.max(0, Math.min(100, (current / XP_PER_LEVEL) * 100));
    el.profileStatus.textContent = `Level ${state.level} arcade player. Keep playing to climb the scoreboard.`;
    el.levelNumber.textContent = state.level;
    el.xpText.textContent = `${formatNumber(current)} / ${formatNumber(XP_PER_LEVEL)} XP`;
    el.xpFill.style.width = `${pct}%`;
    el.profileXp.textContent = formatNumber(state.xp);
    el.profileCoins.textContent = formatNumber(state.coins);
    el.profileGames.textContent = formatNumber(state.stats.gamesPlayed);
    el.profileSnakeBest.textContent = formatNumber(state.stats.snakeBest);
    el.profileFavorite.textContent = "Snake";
    el.profileAchievements.textContent = `${state.achievements.length}/${achievements.length}`;
  }

  function renderAchievements() {
    el.achievementList.innerHTML = "";
    achievements.forEach((achievement) => {
      const unlocked = state.achievements.includes(achievement.id);
      const card = document.createElement("div");
      card.className = `achievement-card ${unlocked ? "unlocked" : "locked"}`;
      card.innerHTML = `
        <p class="system-line">${unlocked ? "Unlocked" : "Locked"}</p>
        <h3>${achievement.title}</h3>
        <p>${achievement.text}</p>
      `;
      el.achievementList.appendChild(card);
    });
    el.achievementCount.textContent = `${state.achievements.length} / ${achievements.length}`;
  }

  function renderLeaderboard() {
    const rows = [
      { player: state.playerName || "YOU", score: state.stats.snakeBest, game: "Snake" },
      { player: "NOVA", score: Math.max(18, state.stats.snakeBest - 2), game: "Snake" },
      { player: "PIXEL", score: Math.max(12, state.stats.snakeBest - 6), game: "Snake" },
      { player: "ACE", score: Math.max(8, state.stats.snakeBest - 10), game: "Snake" }
    ].sort((a, b) => b.score - a.score);

    el.leaderboardPreview.innerHTML = rows.map((row, index) => `
      <div class="score-row">
        <span class="rank">#${index + 1}</span>
        <strong>${row.player}</strong>
        <small>${row.game} - ${formatNumber(row.score)}</small>
      </div>
    `).join("");
  }

  function renderStore() {
    el.storePreviewCoins.textContent = `${formatNumber(state.coins)} Coins`;
    el.storeGrid.innerHTML = "";
    storeItems.forEach((item) => {
      const owned = state.owned.includes(item.id);
      const locked = state.level < item.level;
      const affordable = state.coins >= item.cost;
      const card = document.createElement("div");
      card.className = `store-card ${locked ? "locked" : ""}`;
      card.innerHTML = `
        <p class="system-line">${locked ? `Level ${item.level}` : `${formatNumber(item.cost)} Coins`}</p>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
        <button class="arcade-btn ${locked || owned || !affordable ? "secondary" : "primary"}" type="button">
          ${owned ? "Owned" : locked ? "Locked" : affordable ? "Purchase" : "Need Coins"}
        </button>
      `;
      card.querySelector("button").addEventListener("click", () => buyStoreItem(item));
      el.storeGrid.appendChild(card);
    });
  }

  function buyStoreItem(item) {
    if (state.level < item.level) {
      showToast("Reward Locked", `Reach level ${item.level} to unlock this reward.`);
      return;
    }
    if (state.owned.includes(item.id)) {
      showToast("Already Owned", "This reward is already on your player card.");
      return;
    }
    if (state.coins < item.cost) {
      showToast("Need More Coins", `${formatNumber(item.cost - state.coins)} more coins required.`);
      return;
    }

    state.coins -= item.cost;
    state.owned.push(item.id);
    if (item.id.startsWith("xp_boost")) state.activeBoost = item.id;
    saveState();
    renderAll();
    showToast("Purchase Complete", `${item.title} unlocked.`, "win");
  }

  function openSnake() {
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

  function startSnake() {
    resetSnake();
    snake.running = true;
    snake.paused = false;
    snake.runStartedAt = Date.now();
    el.pauseSnakeBtn.textContent = "Pause";
    el.topPauseSnakeBtn.textContent = "Pause";
    playTone("tap");
    snakeTimer = setInterval(tickSnake, GAME_TICK_MS);
  }

  function stopSnake() {
    if (snakeTimer) {
      clearInterval(snakeTimer);
      snakeTimer = null;
    }
    snake.running = false;
    snake.paused = false;
  }

  function togglePause() {
    if (!snake.running) return;
    snake.paused = !snake.paused;
    el.pauseSnakeBtn.textContent = snake.paused ? "Resume" : "Pause";
    el.topPauseSnakeBtn.textContent = snake.paused ? "Resume" : "Pause";
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
    let earned = Math.max(12, snake.score * 18 + snake.streak * 4);
    if (snake.score > state.stats.snakeBest) earned += 80;
    if (state.activeBoost === "xp_boost_2") earned *= 2;
    if (state.activeBoost === "xp_boost_3") earned *= 3;
    return earned;
  }

  function runElapsedSeconds() {
    if (!snake.runStartedAt) return 0;
    return Math.max(0, Math.floor((Date.now() - snake.runStartedAt) / 1000));
  }

  function previewCoins(newBest = snake.score > state.stats.snakeBest) {
    const playTimeBonus = Math.floor(runElapsedSeconds() / 15);
    let earned = Math.max(2, snake.score * 3 + snake.streak + playTimeBonus);
    if (newBest) earned += 25;
    if (state.activeBoost === "xp_boost_2") earned *= 2;
    if (state.activeBoost === "xp_boost_3") earned *= 3;
    return earned;
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
    el.snakeScore.textContent = formatNumber(snake.score);
    el.snakeBest.textContent = formatNumber(state.stats.snakeBest);
    el.snakeStreak.textContent = formatNumber(snake.streak);
    el.snakeXpPreview.textContent = formatNumber(preview);
    el.snakeCoinPreview.textContent = formatNumber(previewCoins());
  }

  function endSnakeRun() {
    if (!snake.running) return;
    stopSnake();
    playTone("fail");

    const previousBest = state.stats.snakeBest;
    const newBest = snake.score > previousBest;
    const oldLevel = state.level;
    const oldAchievements = new Set(state.achievements);
    let earned = Math.max(12, snake.score * 18 + snake.streak * 4);
    let coinsEarned = previewCoins(newBest);

    state.stats.gamesPlayed += 1;
    state.stats.snakeRuns += 1;
    state.stats.snakeTotalScore += snake.score;
    state.stats.snakeBest = Math.max(previousBest, snake.score);

    if (newBest) earned += 80;
    if (state.activeBoost === "xp_boost_2") earned *= 2;
    if (state.activeBoost === "xp_boost_3") earned *= 3;
    if (state.activeBoost) {
      showToast("Booster Used", "Your reward booster was applied.", "win");
      state.activeBoost = null;
    }

    state.xp += earned;
    state.coins += coinsEarned;
    state.level = deriveLevel(state.xp);
    unlockEarnedAchievements();
    saveState();
    renderAll();

    const newAchievements = achievements.filter((item) => !oldAchievements.has(item.id) && state.achievements.includes(item.id));
    if (newBest) showToast("New High Score", `Snake best is now ${formatNumber(snake.score)}.`, "win");
    showToast("XP Earned", `+${formatNumber(earned)} XP.`, "win");
    showToast("Coins Earned", `+${formatNumber(coinsEarned)} coins.`, "win");
    if (state.level > oldLevel) showToast("Level Up", `You reached level ${state.level}.`, "level");

    el.resultScore.textContent = formatNumber(snake.score);
    el.resultXp.textContent = formatNumber(earned);
    el.resultCoins.textContent = formatNumber(coinsEarned);
    el.resultBest.textContent = formatNumber(state.stats.snakeBest);
    el.newBestBadge.classList.toggle("hidden", !newBest);
    el.resultAchievements.innerHTML = newAchievements.map((item) => `<span>${item.title}</span>`).join("");
    el.resultMessage.textContent = newBest ? "New personal best. Keep the streak going." : "Run complete. Retry and beat your score.";
    el.gameOverModal.classList.remove("hidden");
  }

  function unlockEarnedAchievements() {
    const checks = [
      ["first_run", state.stats.gamesPlayed >= 1],
      ["snake_10", state.stats.snakeBest >= 10],
      ["snake_25", state.stats.snakeBest >= 25],
      ["level_2", state.level >= 2],
      ["level_5", state.level >= 5]
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

  function bindEvents() {
    syncAppHeight();
    window.addEventListener("resize", syncAppHeight);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", syncAppHeight);

    el.skipBootBtn.addEventListener("click", () => {
      playTone("tap");
      state.playerName ? showScreen("home") : showScreen("name");
    });

    el.playerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = el.playerName.value.trim().replace(/\s+/g, " ");
      if (!name) return;
      state.playerName = name.slice(0, 16);
      saveState();
      showScreen("home");
      showToast("Player Linked", `${state.playerName} entered ARCADIA.`, "win");
    });

    el.openProfileBtn.addEventListener("click", () => showScreen("profile"));
    el.backFromProfileBtn.addEventListener("click", () => showScreen("home"));
    el.exitGameBtn.addEventListener("click", () => showScreen("home"));
    el.profileShareBtn.addEventListener("click", shareProfile);

    el.gameSearch.addEventListener("input", renderGames);
    el.clearSearchBtn.addEventListener("click", () => {
      el.gameSearch.value = "";
      renderGames();
      el.gameSearch.focus();
    });

    el.startSnakeBtn.addEventListener("click", startSnake);
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
  }

  function init() {
    bindEvents();
    drawSnake();
    setTimeout(() => {
      if (currentScreen === "boot") {
        showScreen(state.playerName ? "home" : "name");
      }
    }, 2200);
  }

  init();
})();
