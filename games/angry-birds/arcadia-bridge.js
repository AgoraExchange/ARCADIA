/* ARCADIA adapter; the upstream game remains unmodified. */
(() => {
  'use strict';
  let ready = false;
  let started = false;
  let solved = 0;
  let pendingVictory = null;
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
    if (!launched) this.arcadiaBirdsLaunched++;
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
    takeVictory() {
      const victory = pendingVictory;
      pendingVictory = null;
      return victory;
    },
    start(options = {}) {
      if (!ready || started) return false;
      solved = Math.max(0, Math.min(levelCount, Number(options.solved) || 0));
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
