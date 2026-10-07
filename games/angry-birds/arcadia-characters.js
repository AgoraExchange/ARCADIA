/* ARCADIA character abilities for the second campaign page.
 * Artwork reference and attribution: UPSTREAM.md. Physics stays in Phaser/P2.
 */
(() => {
  'use strict';
  const state = game.state.states['AngryBirds.Game'];
  const preloader = game.state.states['AngryBirds.Preloader'];
  const characters = ['chuck', 'bomb', 'hal', 'corporal-pig', 'king-pig'];
  const powers = { red: 'Classic shot', chuck: 'Speed Boost', bomb: 'Blast', hal: 'Boomerang' };
  let lastStatus = '';
  const load = preloader.preload;
  preloader.preload = function () {
    load.call(this);
    characters.forEach(name => this.load.image(`arcadia-source-${name}`, `characters/${name}.png`));
  };
  const ready = preloader.create;
  preloader.create = function () {
    // Normalize just the textures to the native footprints. Changing character
    // art must not silently change the collision size or invalidate old levels.
    characters.forEach(name => {
      const source = game.cache.getImage(`arcadia-source-${name}`);
      const bird = !name.endsWith('-pig');
      const original = game.cache.getImage(bird ? 'imageGameBird' : 'imageGamePig');
      const width = bird ? original.width : 48;
      const height = bird ? original.height : 46;
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(source, 0, 0, width, height);
      game.cache.addImage(`arcadia-${name}`, '', canvas);
    });
    ready.call(this);
  };
  function canUse() {
    const bird = state.bird;
    return game.state.current === 'AngryBirds.Game' && !game.paused && !state.gameWon &&
      bird?.alive && bird.alpha === 1 && bird.body && state.turnInProgress &&
      bird.arcadiaType !== 'red' && !bird.arcadiaPowerUsed;
  }
  function publish() {
    const active = game.state.current === 'AngryBirds.Game' && Boolean(state.levelData?.flock);
    const name = state.bird?.arcadiaType || 'red';
    const detail = { active, character: name, power: powers[name], ready: Boolean(active && canUse()),
      used: Boolean(state.bird?.arcadiaPowerUsed), launched: Boolean(state.bird?.body), paused: game.paused };
    const status = JSON.stringify(detail);
    if (status === lastStatus) return;
    lastStatus = status;
    parent.postMessage({ source: 'arcadia-angry-birds', type: 'ability', ...detail }, location.origin);
  }
  const addBird = state.addBird;
  state.addBird = function () {
    addBird.call(this);
    const flock = this.levelData.flock || Array(this.levelData.birds || 3).fill('red');
    const index = flock.length - this.availableBirdsCounter;
    const paint = (bird, type) => {
      bird.arcadiaType = type;
      bird.arcadiaPowerUsed = false;
      if (type !== 'red') bird.loadTexture(`arcadia-${type}`);
    };
    paint(this.bird, flock[index] || 'red');
    // The upstream queue is generated in reverse order; our adapter lays it out
    // left-to-right, with the next bird closest to the sling on the right.
    this.birds.children.forEach((bird, i, queue) => paint(bird, flock[index + queue.length - i] || 'red'));
    publish();
  };
  const create = state.create;
  state.create = function () {
    create.call(this);
    game.input.onDown.add(pointer => {
      if (pointer.y > 75 && !state.isPreparingShot) activate();
    });
    this.enemies.children.forEach((pig, index) => {
      const character = this.levelData.enemies[index].character;
      if (!character) return;
      pig.animations.stop();
      pig.loadTexture(`arcadia-${character}`);
      pig.animations.add('stand', [0]);
      pig.animations.add('win', [0]);
      pig.arcadiaCharacter = character;
    });
    if (this.levelData.flock) {
      this.arcadiaPowerLabel = game.add.bitmapText(220, 59, 'AngryBirdsFont', '', 17);
      this.arcadiaPowerLabel.fixedToCamera = true;
    }
    publish();
  };
  const hit = state.hitEnemy;
  state.hitEnemy = function (...args) {
    if (!this.alive || this.alpha !== 1) return;
    hit.apply(this, args);
  };
  function effect(x, y, color, radius) {
    const ring = game.add.graphics(x, y);
    ring.lineStyle(5, color, 0.9);
    ring.beginFill(color, 0.2);
    ring.drawCircle(0, 0, radius * 2);
    ring.scale.setTo(0.2);
    game.add.tween(ring.scale).to({ x: 1.2, y: 1.2 }, 450, Phaser.Easing.Quadratic.Out, true);
    game.add.tween(ring).to({ alpha: 0 }, 450, Phaser.Easing.Linear.None, true).onComplete.add(() => ring.destroy());
  }
  function blast(bird) {
    const x = bird.x, y = bird.y;
    effect(x, y, 0xffaf32, 155);
    for (const block of state.blocks.children) {
      if (!block.body || block.body.static) continue;
      const dx = block.x - x, dy = block.y - y;
      const distance = Math.max(18, Math.hypot(dx, dy));
      if (distance > 180) continue;
      const force = (1 - distance / 210) * 950 / Math.sqrt(block.body.mass);
      block.body.velocity.x += dx / distance * force;
      block.body.velocity.y += dy / distance * force - 100;
      block.body.angularVelocity += (dx < 0 ? -1 : 1) * 3;
    }
    for (const pig of state.enemies.children) {
      if (!pig.alive || pig.alpha !== 1) continue;
      const dx = pig.x - x, dy = pig.y - y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      if (distance <= 115) {
        if (state.arcadiaAbsorbArmor?.(pig)) continue;
        pig.alpha = 0.99;
        pig.kill();
        pig.explosion.position.set(pig.x - 24, pig.y - 24);
        pig.explosion.visible = true;
        pig.explosion.animations.play('explosion', 10, false);
        state.updateDeadCount();
      } else if (distance <= 180) {
        pig.body.velocity.x += dx / distance * 380;
        pig.body.velocity.y += dy / distance * 380 - 100;
      }
    }
    state.arcadiaBlastStructures?.(x, y);
    state.killBird();
  }
  function activate() {
    if (!canUse()) return false;
    const bird = state.bird;
    bird.arcadiaPowerUsed = true;
    if (bird.arcadiaType === 'chuck') {
      bird.body.velocity.x = Math.min(1500, Math.max(500, bird.body.velocity.x * 1.85));
      bird.body.velocity.y *= 0.65;
      effect(bird.x, bird.y, 0xffe241, 42);
    } else if (bird.arcadiaType === 'hal') {
      bird.body.velocity.x = -Math.max(400, Math.abs(bird.body.velocity.x) * 1.2);
      bird.body.velocity.y = Math.min(-75, bird.body.velocity.y);
      bird.body.angularVelocity = -5;
      effect(bird.x, bird.y, 0x8ee747, 50);
    } else if (bird.arcadiaType === 'bomb') blast(bird);
    publish();
    return true;
  }
  const update = state.update;
  state.update = function () {
    update.call(this);
    if (this.arcadiaPowerLabel?.exists) {
      const name = this.bird.arcadiaType || 'red';
      const action = this.bird.arcadiaPowerUsed ? 'POWER USED' : name === 'red' ? 'CLASSIC SHOT' : canUse() ? 'TAP / SPACE FOR ' + powers[name].toUpperCase() : 'LAUNCH, THEN TAP / SPACE';
      this.arcadiaPowerLabel.text = `${name.toUpperCase()} - ${action}`;
    }
    publish();
  };
  const shutdown = state.shutdown;
  state.shutdown = function () {
    this.arcadiaPowerLabel = null;
    lastStatus = '';
    parent.postMessage({ source: 'arcadia-angry-birds', type: 'ability', active: false }, location.origin);
    shutdown?.call(this);
  };
  window.addEventListener('keydown', event => {
    if (event.code === 'Space' && game.state.current === 'AngryBirds.Game') {
      event.preventDefault();
      if (!event.repeat) activate();
    }
  });
  window.arcadiaAngryBirds.useAbility = activate;
  const pause = window.arcadiaAngryBirds.pause;
  window.arcadiaAngryBirds.pause = function (value) { pause.call(this, value); publish(); };
})();
