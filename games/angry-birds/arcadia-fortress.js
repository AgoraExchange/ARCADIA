/* New obstacles and armor are opt-in level data; missions 1–30 keep their rules. */
(() => {
  'use strict';
  const state = game.state.states['AngryBirds.Game'];
  const pending = new Set();
  const impactSpeed = equations => {
    const e = equations?.[0];
    return e ? Math.hypot(e.bodyA.velocity[0] - e.bodyB.velocity[0], e.bodyA.velocity[1] - e.bodyB.velocity[1]) : 0;
  };
  function ring(x, y, color, radius) {
    const g = game.add.graphics(x, y);
    g.lineStyle(4, color, 1); g.drawCircle(0, 0, radius * 2);
    game.add.tween(g).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true).onComplete.add(() => g.destroy());
  }
  state.arcadiaAbsorbArmor = pig => {
    if (game.time.now < (pig.arcadiaArmorUntil || 0)) return true;
    if (!pig.arcadiaArmor) return false;
    pig.arcadiaArmor--;
    pig.arcadiaArmorUntil = game.time.now + 350;
    ring(pig.x, pig.y, 0xffdf65, 34);
    if (!pig.arcadiaArmor && pig.arcadiaCharacter !== 'king-pig') {
      pig.loadTexture('imageGamePig');
      pig.animations.add('stand', [1, 2, 0]);
      pig.animations.add('win', [2]);
      pig.animations.play('stand', 0.5, true);
    }
    return true;
  };
  const hit = state.hitEnemy;
  state.hitEnemy = function (...args) {
    if (!this.alive || this.alpha !== 1) return;
    if (impactSpeed(args[4]) > state.KILL_DIFF && state.arcadiaAbsorbArmor(this)) return;
    hit.apply(this, args);
  };
  const block = state.createBlock;
  state.createBlock = function (data) {
    const sprite = block.call(this, data);
    if (data.width) {
      sprite.width = data.width; sprite.height = data.height;
      sprite.body.setRectangle(data.width, data.height);
      sprite.body.setCollisionGroup(this.blocksCollisionGroup);
      sprite.body.collides([this.blocksCollisionGroup, this.enemiesCollisionGroup, this.birdsCollisionGroup]);
    }
    if (data.fixed || data.suspended) sprite.body.static = true;
    sprite.arcadiaSuspended = Boolean(data.suspended);
    if (data.suspended) {
      sprite.tint = 0xffda75;
      const cables = game.add.graphics();
      cables.lineStyle(3, 0x485360, 1);
      for (const dx of [-data.width / 2 + 14, data.width / 2 - 14]) {
        cables.moveTo(data.x + dx, 70); cables.lineTo(data.x + dx, data.y);
      }
      sprite.arcadiaCables = cables;
    }
    if (data.tnt) {
      sprite.tint = 0xff6655;
      sprite.arcadiaTnt = true;
      const label = game.add.text(0, 0, 'TNT', { font: 'bold 14px sans-serif', fill: '#ffffff', stroke: '#651b10', strokeThickness: 3 });
      label.anchor.set(0.5); sprite.addChild(label);
      sprite.body.onBeginContact.add((a,b,c,d,e) => {
        if (state.arcadiaBirdsLaunched > 0 && impactSpeed(e) > 3) pending.add(sprite);
      });
    }
    return sprite;
  };
  state.arcadiaBlastStructures = (x, y) => {
    state.blocks.children.forEach(b => {
      if (!b.alive || !b.body) return;
      const distance = Math.hypot(b.x - x, b.y - y);
      if (b.arcadiaTnt && !b.arcadiaExploded && distance <= 165) pending.add(b);
      if (b.arcadiaSuspended && distance <= 220) {
        b.arcadiaSuspended = false;
        b.arcadiaCables?.destroy();
        b.body.static = false; b.body.mass = 8;
        b.body.velocity.y = 80;
      }
    });
  };
  function explode(b) {
    if (!b.alive || b.arcadiaExploded || state.gameWon) return;
    b.arcadiaExploded = true;
    const x = b.x, y = b.y;
    b.kill(); b.body.clearShapes(); b.body.velocity.x = 0; b.body.velocity.y = 0; b.body.angularVelocity = 0;
    ring(x, y, 0xff762e, 165);
    state.arcadiaBlastStructures(x, y);
    state.blocks.children.forEach(target => {
      if (!target.alive || !target.body || target.body.static) return;
      const dx = target.x-x, dy=target.y-y, distance=Math.max(20, Math.hypot(dx,dy));
      if (distance > 200) return;
      const force = (1-distance/230)*700/Math.sqrt(target.body.mass);
      target.body.velocity.x += dx/distance*force;
      target.body.velocity.y += dy/distance*force-100;
    });
    state.enemies.children.forEach(pig => {
      if (!pig.alive || pig.alpha !== 1) return;
      const dx=pig.x-x, dy=pig.y-y, distance=Math.max(1,Math.hypot(dx,dy));
      if (distance <= 125 && !state.arcadiaAbsorbArmor(pig)) {
        pig.alpha=0.99; pig.kill();
        pig.explosion.position.set(pig.x-24,pig.y-24);
        pig.explosion.visible=true; pig.explosion.animations.play('explosion',10,false);
        state.updateDeadCount();
      } else if (distance <= 200) {
        pig.body.velocity.x += dx/distance*250;
        pig.body.velocity.y += dy/distance*250-80;
      }
    });
  }
  const create = state.create;
  state.create = function () {
    pending.clear();
    create.call(this);
    this.enemies.children.forEach((pig, i) => {
      pig.arcadiaArmor = this.levelData.enemies[i].armor || 0;
      if (pig.arcadiaArmor) pig.arcadiaArmorBadge = game.add.graphics();
    });
  };
  const update = state.update;
  state.update = function () {
    const batch = [...pending]; pending.clear();
    batch.forEach(explode);
    update.call(this);
    this.enemies.children.forEach(pig => {
      const badge = pig.arcadiaArmorBadge;
      if (!badge) return;
      badge.clear();
      if (!pig.alive) return;
      for (let i=0; i<pig.arcadiaArmor; i++) {
        badge.beginFill(0xffd24d); badge.drawRoundedRect(pig.x-14+i*16,pig.y-36,12,7,2); badge.endFill();
      }
    });
  };
  const shutdown = state.shutdown;
  state.shutdown = function () {
    pending.clear();
    shutdown?.call(this);
  };
})();
