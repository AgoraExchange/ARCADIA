const assert = require('node:assert/strict');
const { chromium } = require(process.env.ARCADIA_PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${process.env.ARCADIA_PREVIEW_URL || 'http://127.0.0.1:4179'}/games/angry-birds/index.html`);
    await page.waitForFunction(() => game.cache.checkTextKey('level30'));
    await page.evaluate(() => window.arcadiaAngryBirds.start({ solved: 14, mutedMusic: true, mutedSfx: true }));
    async function selector() {
      await page.evaluate(() => game.state.start('AngryBirds.LevelSelector'));
      await page.waitForFunction(() => game.state.current === 'AngryBirds.LevelSelector');
      await page.waitForTimeout(100);
      return page.evaluate(() => {
        const s = game.state.states['AngryBirds.LevelSelector'];
        return { page: s.arcadiaPage, next: Boolean(s.arcadiaNextPage.inputEnabled), previous: Boolean(s.arcadiaPreviousPage.inputEnabled) };
      });
    }
    assert.deepEqual(await selector(), { page: 0, next: false, previous: false });
    await page.evaluate(() => game.state.states['AngryBirds.SplashGame'].setSolvedLevels(15));
    assert.deepEqual(await selector(), { page: 1, next: false, previous: true });
    await page.evaluate(() => game.state.states['AngryBirds.LevelSelector'].arcadiaPreviousPage.events.onInputUp.dispatch());
    await page.waitForTimeout(700);
    assert.deepEqual(await selector(), { page: 0, next: true, previous: false });
    await page.evaluate(() => game.state.states['AngryBirds.LevelSelector'].arcadiaNextPage.events.onInputUp.dispatch());
    await page.waitForTimeout(700);
    assert.equal((await selector()).page, 1);
    async function mission(number) {
      await page.evaluate(number => {
        game.paused = false;
        GAME_LEVEL_SELECTED = String(number);
        game.sound.stopAll();
        game.state.start('AngryBirds.Game');
      }, number);
      await page.waitForFunction(number => game.state.current === 'AngryBirds.Game' && Number(game.state.states['AngryBirds.Game'].currentLevel) === number, number);
      await page.waitForTimeout(250);
    }
    await mission(16);
    assert.equal(await page.evaluate(() => window.arcadiaAngryBirds.useAbility()), false);
    const chuck = await page.evaluate(() => {
      const s = game.state.states['AngryBirds.Game'];
      s.bird.position.set(90, 335); s.throwBird();
      const before = s.bird.body.velocity.x;
      const used = window.arcadiaAngryBirds.useAbility();
      return { type: s.bird.arcadiaType, used, repeated: window.arcadiaAngryBirds.useAbility(), faster: s.bird.body.velocity.x > before };
    });
    assert.deepEqual(chuck, { type: 'chuck', used: true, repeated: false, faster: true });
    await page.evaluate(() => window.arcadiaAngryBirds.restart());
    await page.waitForTimeout(250);
    assert.equal(await page.evaluate(() => game.state.states['AngryBirds.Game'].bird.arcadiaPowerUsed), false);
    await mission(20);
    const hal = await page.evaluate(() => {
      const s = game.state.states['AngryBirds.Game'];
      s.bird.position.set(90, 335); s.throwBird();
      window.arcadiaAngryBirds.pause(true);
      const paused = window.arcadiaAngryBirds.useAbility();
      window.arcadiaAngryBirds.pause(false);
      const used = window.arcadiaAngryBirds.useAbility();
      return { type: s.bird.arcadiaType, paused, used, returning: s.bird.body.velocity.x < 0 };
    });
    assert.deepEqual(hal, { type: 'hal', paused: false, used: true, returning: true });
    await mission(18);
    const bomb = await page.evaluate(() => {
      const s = game.state.states['AngryBirds.Game'];
      s.bird.position.set(90, 335); s.throwBird();
      // Place a launched bomb at a controlled blast-radius fixture.
      s.bird.body.x = s.enemies.children[0].x - 60;
      s.bird.body.y = s.enemies.children[0].y;
      s.bird.body.postUpdate();
      const used = window.arcadiaAngryBirds.useAbility();
      return { used, killed: s.countDeadEnemies, birds: s.availableBirdsCounter, repeated: window.arcadiaAngryBirds.useAbility(), alive: s.bird.alive };
    });
    assert.equal(bomb.used, true);
    assert(bomb.killed >= 1 && bomb.killed < 4);
    assert.equal(bomb.birds, 2);
    assert.equal(bomb.repeated, false);
    assert.equal(bomb.alive, false);
    await mission(23);
    assert(await page.evaluate(() => game.state.states['AngryBirds.Game'].enemies.children.some(pig => pig.arcadiaCharacter === 'king-pig')));
    assert(await page.evaluate(() => game.state.states['AngryBirds.Game'].enemies.children.some(pig => pig.arcadiaCharacter === 'corporal-pig')));
    await page.evaluate(() => { const s = game.state.states['AngryBirds.Game']; s.availableBirdsCounter = 0; s.endTurn(); });
    await page.waitForTimeout(700);
    await mission(1);
    assert.equal(await page.evaluate(() => game.state.states['AngryBirds.Game'].bird.arcadiaType), 'red');
    assert.equal(await page.evaluate(() => game.state.states['AngryBirds.Game'].availableBirdsCounter), 3);
    await mission(15);
    assert.equal(await page.evaluate(() => game.state.states['AngryBirds.Game'].nextLevelExists()), false);
    await mission(16);
    assert.equal(await page.evaluate(() => game.state.states['AngryBirds.Game'].nextLevelExists()), true);
    await mission(30);
    assert.equal(await page.evaluate(() => game.state.states['AngryBirds.Game'].nextLevelExists()), false);
    assert.deepEqual(errors, []);
    console.log('PASS page unlocks, both arrows, character textures, power effects, one use per bird, pause/restart, classic missions, page boundaries');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
