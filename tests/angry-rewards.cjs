const assert = require('node:assert/strict');
const { chromium } = require(process.env.ARCADIA_PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.env.ARCADIA_PREVIEW_URL || 'http://127.0.0.1:4179');
    await page.getByRole('button', { name: 'Create Player', exact: true }).click();
    await page.locator('#playerName').fill('Reward Test');
    await page.getByRole('button', { name: 'Enter Arcadia', exact: true }).click();
    await page.locator('.game-card').filter({ hasText: 'Angry Birds' }).click();
    await page.waitForFunction(() => !document.querySelector('#startAngryBtn').disabled);
    await page.locator('#startAngryBtn').click();
    const frame = page.frame({ url: /games\/angry-birds/ });
    const save = () => page.evaluate(() => JSON.parse(localStorage.getItem('arcadia_player_v1')));
    async function mission(level) {
      await frame.evaluate(level => {
        game.sound.stopAll();
        GAME_LEVEL_SELECTED = String(level);
        game.state.start('AngryBirds.Game');
      }, level);
      await frame.waitForFunction(level => game.state.current === 'AngryBirds.Game' && Number(game.state.states['AngryBirds.Game'].currentLevel) === level, level);
      await page.waitForTimeout(250);
    }
    async function win(level, used) {
      await mission(level);
      return frame.evaluate(used => {
        // Controlled victory fixture exercises native win/save handling. Real
        // collision wins and launch counts are covered by angry-campaign.cjs.
        const s = game.state.states['AngryBirds.Game'];
        s.bird.position.set(90, 335);
        s.throwBird();
        s.arcadiaBirdsLaunched = used;
        while (!s.gameWon) s.updateDeadCount();
        s.updateDeadCount();
        parent.arcadiaCompleteAngryBirds();
        return (s.levelData.birds || 3) - used;
      }, used);
    }
    let before = await save();
    for (const [level, used, first] of [[1, 1, true], [1, 2, false], [15, 3, true], [15, 1, false], [30, 3, true], [30, 3, false]]) {
      const unused = await win(level, used);
      const after = await save();
      const xp = 50 + level * 10 + unused * 20 + (first ? 150 : 0);
      const coins = 10 + level * 2 + unused * 5 + (first ? 30 : 0);
      assert.equal(after.xp - before.xp, xp);
      assert.equal(after.coins - before.coins, coins);
      assert.equal(after.stats.angryXpEarned - (before.stats.angryXpEarned || 0), xp);
      before = after;
    }
    await mission(1);
    await frame.evaluate(() => window.arcadiaAngryBirds.restart());
    await page.waitForTimeout(300);
    assert.equal((await save()).xp, before.xp, 'Restart must not award XP');
    await page.reload();
    const persisted = await save();
    assert.equal(persisted.xp, before.xp);
    assert.equal(persisted.coins, before.coins);
    assert.equal(persisted.stats.angrySolved, 30);
    assert(persisted.level > 1);
    assert.deepEqual(errors, []);
    console.log('PASS first clears, replays, mission scaling, unused birds, duplicate protection, restart, level-up and persistence');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
