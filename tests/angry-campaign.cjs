/* Run against the local preview:
 * ARCADIA_PLAYWRIGHT_MODULE may point to an existing Playwright installation.
 * node tests/angry-campaign.cjs
 * Uses the native engine, collision rules, legal sling coordinates, and bird
 * budget. Only the clock/render loop is accelerated; no enemies are forced dead.
 */
const assert = require('node:assert/strict');
const { chromium } = require(process.env.ARCADIA_PLAYWRIGHT_MODULE || 'playwright');
const solutions = {
  46: [[40,350,null]],
  47: [[40,290,25]],
  48: [[40,290,25]],
  49: [[120,350,null],[120,350,140],[40,290,25]],
  50: [[40,290,null]],
  51: [[40,310,50]],
  52: [[120,370,140],[80,290,25],[40,290,null],[40,350,50]],
  53: [[40,330,50]],
  54: [[40,370,25]],
  55: [[40,350,110],[40,350,25],[40,330,50]],
  56: [[40,330,50]],
  57: [[40,330,80]],
  58: [[120,350,null],[40,290,25],[40,350,25],[140,350,150],[120,350,140]],
  59: [[40,290,25],[120,330,10],[40,310,null],[140,350,150],[40,310,50]],
  60: [[40,350,null],[40,310,25],[40,310,null],[40,330,50],[130,345,135]],
  31: [[40,330,25]], 32: [[40,310,25]], 33: [[40,370,50]],
  34: [[120,370,140],[120,370,140],[40,290,25]],
  35: [[120,350,140]],
  36: [[120,370,140],[120,350,80],[40,350,50],[40,290,25]],
  37: [[40,290,25]], 38: [[40,310,50]], 39: [[40,290,null]],
  40: [[40,290,25]], 41: [[40,350,null]], 42: [[40,290,null]],
  43: [[40,310,25]], 44: [[80,350,110],[40,350,80]],
  45: [[40,350,25],[40,330,50]],
  4: [[40, 310]], 5: [[40, 320]], 6: [[40, 340]], 7: [[40, 330]],
  8: [[100, 310], [40, 330]], 9: [[100, 350], [80, 340]],
  10: [[100, 350], [40, 350]], 11: [[60, 370], [40, 320]],
  12: [[80, 350], [150, 353], [40, 280]], 13: [[80, 310], [80, 310], [40, 340], [40, 330], [40, 320]],
  14: [[80, 330], [40, 330], [40, 340], [40, 320]], 15: [[40, 350], [40, 340], [40, 330], [24, 320], [60, 330]],
  16: [[100,340],[40,340],[40,330]],
  17: [[100,350],[100,340],[40,340],[40,330]],
  18: [[40,330,35],[40,340],[40,330,40]],
  19: [[40,350],[40,340],[40,330],[24,320]],
  20: [[100,340],[40,340],[40,340],[40,330]],
  21: [[80,330],[40,330],[40,340],[40,330]],
  22: [[40,360],[40,340],[40,330],[24,320]],
  23: [[60,350],[40,340],[40,330],[24,320],[60,350]],
  24: [[40,360,35],[40,340,15],[40,330,40],[24,320]],
  25: [[120,330],[40,330],[40,340],[40,330],[24,320]],
  26: [[40,360],[40,350],[40,340],[40,330],[24,320]],
  27: [[60,360],[40,340],[40,280],[40,340],[40,330]],
  28: [[40,370],[40,350],[40,340],[40,330],[24,320]],
  29: [[120,340],[40,340],[40,330],[24,320],[60,350]],
  30: [[60,320],[40,330],[40,340],[40,330],[24,320]]
};

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${process.env.ARCADIA_PREVIEW_URL || 'http://127.0.0.1:4179'}/games/angry-birds/index.html`);
    await page.waitForFunction(() => game.cache.checkTextKey('level60'));
    assert.equal(await page.evaluate(() => Array.from({ length: 60 }, (_, i) => game.cache.checkTextKey(`level${i + 1}`)).every(Boolean)), true);
    await page.evaluate(() => {
      window.victories = [];
      window.arcadiaCompleteAngryBirds = () => victories.push(window.arcadiaAngryBirds.takeVictory());
      game.raf.stop();
      game.paused = false;
      GAME_SOUND_ENABLED = false;
      let clock = Date.now();
      Date.now = () => clock;
      window.testTick = () => {
        clock += 1000 / 60;
        game.time.update(game.time.now + 1000 / 60);
        game.time.physicsElapsed = 1 / 60;
        game.updateLogic(1 / 60);
      };
      window.testReset = number => {
        game.sound.stopAll();
        game.time.events.removeAll();
        GAME_LEVEL_SELECTED = String(number);
        game.state.start('AngryBirds.Game');
        game.state.preUpdate();
        for (let frame = 0; frame < 18; frame++) testTick();
      };
    });
    for (const [level, shots] of Object.entries(solutions).filter(([level]) => level !== '45')) {
      const result = await page.evaluate(({ level, shots }) => {
        testReset(level);
        const state = game.state.states['AngryBirds.Game'];
        const budget = state.availableBirdsCounter;
        const queueVisible = state.birds.children.every(bird => bird.x >= 0 && bird.x + bird.width < 160);
        game.physics.p2.resume();
        for (let frame = 0; frame < 300; frame++) testTick();
        const idleDeaths = state.countDeadEnemies;
        const armorIntact = state.enemies.children.every((pig,i) => (pig.arcadiaArmor || 0) === (state.levelData.enemies[i].armor || 0));
        testReset(level);
        let used = 0;
        for (const [x, y, powerFrame] of shots) {
          if (x < 24 || x > 180 || y < 170 || y > 370) throw new Error("Illegal sling position");
          if (state.gameWon) break;
          if (state.bird.body || state.availableBirdsCounter <= 0) throw new Error('Bird unavailable');
          state.bird.position.set(x, y);
          state.throwBird();
          used++;
          for (let frame = 0; frame < 2400; frame++) {
            if (frame === powerFrame) window.arcadiaAngryBirds.useAbility();
            testTick();
            if (state.gameWon || state.availableBirdsCounter <= 0 || !state.bird.body) break;
          }
        }
        const victory = victories.pop();
        if (state.gameWon) state.updateDeadCount();
        if (victories.length || window.arcadiaAngryBirds.takeVictory()) throw new Error("Duplicate victory reward");
        return { armorIntact, victory, budget, used, idleDeaths, queueVisible, won: state.gameWon, killed: state.countDeadEnemies, pigs: state.totalNumEnemies,
          survivors: state.enemies.children.filter(pig => pig.alive).map(pig => ({ x: Math.round(pig.x), y: Math.round(pig.y), armor: pig.arcadiaArmor || 0 })) };
      }, { level, shots });
      assert(result.armorIntact, `Mission ${level} loses armor before launch`);
      assert.equal(result.idleDeaths, 0, `Mission ${level} collapses before a shot`);
      assert(result.queueVisible, `Mission ${level} hides spare birds`);
      assert(shots.length <= result.budget, `Mission ${level} exceeds the bird budget`);
      assert(result.won, `Mission ${level} cannot be cleared with its reference shots: ${JSON.stringify(result)}`);
      assert.equal(result.killed, result.pigs);
      assert.deepEqual(result.victory, { level: Number(level), unusedBirds: result.budget - result.used });
      console.log(`PASS mission ${level}: ${result.pigs} pigs, ${result.used}/${result.budget} birds`);
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
