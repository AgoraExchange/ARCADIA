/* ARCADIA adapter; the upstream game remains unmodified. */
(() => {
  'use strict';
  let ready = false;
  let started = false;
  let solved = 0;
  let pendingVictory = null;
  let records = {};
  let mutedMusic = false;
  let mutedSfx = false;
  const levelCount = window.ARCADIA_ANGRY_LEVEL_COUNT;
  const musicKeys = new Set(['audioIntro', 'audioBackground', 'audioEpisodeIntro']);
  const notify = (type, detail = {}) => parent.postMessage({ source: 'arcadia-angry-birds', type, ...detail }, location.origin);
  const applySound = (sound) => { sound.mute = musicKeys.has(sound.key) ? mutedMusic : mutedSfx; };
  const originalPlay = Phaser.Sound.prototype.play;
  Phaser.Sound.prototype.play = function (...args) {
    const result = originalPlay.apply(this, args);
    applySound(this);
    return result;
  };
  const saved = game.state.states['AngryBirds.SplashGame'];
  saved.getSolvedLevels = () => String(solved);
  saved.setSolvedLevels = (value) => {
    const level = Math.max(0, Math.min(levelCount, Number(value) || 0));
    if (level <= solved) return;
    solved = level;
  };
  for (const state of Object.values(game.state.states)) {
    if (state.setBooleanSetting) state.setBooleanSetting = (key, enabled) => {
      if (key === 'GAME_SOUND_ENABLED') parent.arcadiaSaveAngryBirdsSound?.(enabled);
    };
  }
  const gameState = game.state.states['AngryBirds.Game'];
  const originalThrowBird = gameState.throwBird;
  gameState.throwBird = function () {
    const launched = Boolean(this.bird.body);
    originalThrowBird.call(this);
    // The native sign calculation divides by zero on an exactly level shot.
    if (!Number.isFinite(this.bird.body.velocity.y)) this.bird.body.velocity.y = 0;
    if (!launched) {
      this.arcadiaBirdsLaunched++;
      this.arcadiaShotSeconds = 0;
      this.arcadiaSpentSeconds = 0;
    }
  };
  const originalKillBird = gameState.killBird;
  gameState.killBird = function () {
    if (!this.bird?.alive || !this.bird.body) return;
    originalKillBird.call(this);
  };
  const originalUpdate = gameState.update;
  gameState.update = function () {
    originalUpdate.call(this);
    if (game.paused || this.gameWon || !this.turnInProgress || !this.bird?.body) return;
    const step = Math.min(game.time.physicsElapsed || 1 / 60, 0.1);
    this.arcadiaShotSeconds += step;
    const bird = this.bird;
    // A returning Hal can leave through the left edge, which the native game
    // does not retire. Also bound the lifetime of birds that keep rolling.
    if (bird.alive && bird.alpha === 1 &&
        (bird.x < -60 || bird.y > game.world.height + 60 || this.arcadiaShotSeconds >= 15)) {
      this.killBird();
    }
    if (bird.alive) return; // Let any native delayed kill finish before handoff.
    this.arcadiaSpentSeconds += step;
    // Native handoff requires almost zero movement in every pig and block.
    // Allow collisions to finish, then provide the next bird even if debris
    // keeps rolling. Keep all surviving pigs and the remaining bird budget.
    if (this.arcadiaSpentSeconds < 5 && this.arcadiaShotSeconds < 15) return;
    this.turnInProgress = false;
    game.physics.p2.pause();
    this.endTurn();
  };
  const originalUpdateDeadCount = gameState.updateDeadCount;
  gameState.updateDeadCount = function () {
    if (this.gameWon) return;
    originalUpdateDeadCount.call(this);
    if (!this.gameWon) return;
    pendingVictory = {
      level: Number(this.currentLevel),
      unusedBirds: Math.max(0, (this.levelData.birds || 3) - this.arcadiaBirdsLaunched)
    };
    // Award synchronously, including replay wins, before navigation can unload us.
    const { level, unusedBirds } = pendingVictory;
    const best = records[level] || {};
    records[level] = { stars: Math.max(best.stars || 0, Math.min(3, unusedBirds + 1)),
      bestUnusedBirds: Math.max(best.bestUnusedBirds || 0, unusedBirds), wins: (best.wins || 0) + 1 };
    parent.arcadiaCompleteAngryBirds?.();
  };
  const originalLoadLevel = gameState.loadLevel;
  gameState.loadLevel = function () {
    originalLoadLevel.call(this);
    this.availableBirdsCounter = this.levelData.birds || 3;
  };
  const originalAddBird = gameState.addBird;
  gameState.addBird = function () {
    originalAddBird.call(this);
    // The upstream queue only has room for two spare birds. Fit the expanded
    // flock beside the sling so extra attempts never disappear offscreen.
    if ((this.levelData.birds || 3) > 3) {
      this.birds.children.forEach((bird, index) => {
        bird.scale.setTo(0.6);
        bird.x = 16 + index * 32;
        bird.y = 392 - bird.height;
      });
    }
  };
  const originalCreate = gameState.create;
  gameState.create = function () {
    pendingVictory = null;
    this.arcadiaBirdsLaunched = 0;
    originalCreate.call(this);
    if (this.levelData.name) {
      const title = game.add.bitmapText(240, 18, 'AngryBirdsFont', `${this.currentLevel}. ${this.levelData.name}`, 24);
      title.fixedToCamera = true;
      game.time.events.add(2500, () => title.destroy());
    }
    notify('level-start', { level: Number(GAME_LEVEL_SELECTED) });
  };
  game.state.states['AngryBirds.Preloader'].create = function () {
    // ARCADIA owns tab visibility/pause. Clicking its outside-frame Power or
    // Restart buttons must not trigger Phaser's automatic window-blur pause.
    game.stage.disableVisibilityChange = true;
    for (const [number, data] of Object.entries(window.ARCADIA_ANGRY_LEVELS)) {
      game.cache.addText(`level${number}`, '', JSON.stringify(data));
    }
    ready = true;
    document.getElementById('loading').style.display = 'none';
    notify('ready');
  };
  function unlockAudio() {
    const context = game.sound.context;
    if (context?.state === 'suspended') context.resume().catch(() => {});
    // The parent's Start click is a same-origin user gesture, including on iOS.
    game.sound.unlock?.();
  }
  function title() {
    game.paused = false;
    game.sound.stopAll();
    MUSIC_PLAYER = game.add.audio('audioIntro', 1, true);
    if (GAME_SOUND_ENABLED) MUSIC_PLAYER.play();
    game.state.start('AngryBirds.SplashGame');
  }
  window.arcadiaAngryBirds = {
    getRecord(level) { return records[level] || null; },
    takeVictory() {
      const victory = pendingVictory;
      pendingVictory = null;
      return victory;
    },
    start(options = {}) {
      if (!ready || started) return false;
      solved = Math.max(0, Math.min(levelCount, Number(options.solved) || 0));
      records = JSON.parse(JSON.stringify(options.records || {}));
      GAME_SOUND_ENABLED = options.soundEnabled !== false;
      this.setMuted(options);
      unlockAudio();
      started = true;
      title();
      return true;
    },
    restart() {
      if (!started) return false;
      unlockAudio();
      game.paused = false;
      game.sound.stopAll();
      if (game.state.current === 'AngryBirds.Game') game.state.states['AngryBirds.Game'].restartGame(true);
      else title();
      return true;
    },
    pause(value) {
      if (!started) return;
      game.paused = Boolean(value);
      if (value) game.sound.pauseAll();
      else { unlockAudio(); game.sound.resumeAll(); }
    },
    setMuted(options = {}) {
      mutedMusic = Boolean(options.mutedMusic);
      mutedSfx = Boolean(options.mutedSfx);
      game.sound._sounds.forEach(applySound);
    }
  };
  function resize() {
    if (!game.scale) return;
    const scale = Math.min(innerWidth / 782, innerHeight / 440);
    game.scale.setUserScale(scale, scale);
    game.scale.refresh();
  }
  window.addEventListener('resize', resize);
  window.addEventListener('pagehide', () => game.sound.stopAll());
})();
