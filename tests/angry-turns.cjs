const assert = require('node:assert/strict');
const { chromium } = require(process.env.ARCADIA_PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${process.env.ARCADIA_PREVIEW_URL || 'http://127.0.0.1:4179'}/games/angry-birds/index.html`);
    await page.waitForFunction(() => game.cache.checkTextKey('level45'));
    await page.evaluate(() => {
      game.raf.stop(); GAME_SOUND_ENABLED = false;
      let clock = Date.now(); Date.now = () => clock;
      window.tick = () => { clock += 1000/60; game.time.update(game.time.now+1000/60); game.time.physicsElapsed=1/60; game.updateLogic(1/60); };
      window.fixture = n => {
        game.paused = false; game.sound.stopAll(); game.time.events.removeAll();
        GAME_LEVEL_SELECTED = String(n); game.state.start('AngryBirds.Game'); game.state.preUpdate();
        for(let i=0;i<18;i++)tick();
        const s = game.state.states['AngryBirds.Game'];
        // Stable bodies isolate the native "still moving" condition without
        // letting unrelated collisions kill the pigs under test.
        [...s.enemies.children,...s.blocks.children].forEach(o => { o.body.static=true; });
        s.enemies.children[0].body.velocity.x=4;
        s.bird.position.set(100,340); s.throwBird();
        s.bird.body.static=true; s.bird.body.velocity.x=4; s.bird.body.velocity.y=0;
        return s;
      };
    });
    for(const level of [1,44,45]) {
      const result = await page.evaluate(level => {
        const s=fixture(level), bird=s.bird, budget=s.availableBirdsCounter;
        s.killBird(); s.killBird();
        for(let i=0;i<360;i++)tick();
        return {next:s.bird!==bird, ready:!s.bird.body, left:s.availableBirdsCounter,
          expected:budget-1, pigs:s.enemies.children.filter(p=>p.alive).length, total:s.totalNumEnemies, won:s.gameWon};
      },level);
      assert(result.next && result.ready,`Mission ${level} stuck waiting for rolling pig`);
      assert.equal(result.left,result.expected);assert.equal(result.pigs,result.total);assert.equal(result.won,false);
    }
    const timeout = await page.evaluate(() => {
      const s=fixture(44),bird=s.bird;
      for(let i=0;i<600;i++)tick();
      const before=s.bird===bird;
      game.paused=true;for(let i=0;i<1200;i++)tick();game.paused=false;
      const afterPause=s.bird===bird;
      for(let i=0;i<400;i++)tick();
      return {before,afterPause,next:s.bird!==bird,left:s.availableBirdsCounter};
    });
    assert.deepEqual(timeout,{before:true,afterPause:true,next:true,left:4});
    const leftExit = await page.evaluate(() => {
      const s=fixture(44),bird=s.bird;bird.body.x=-100;bird.body.postUpdate();
      tick();const retired=!bird.alive;
      for(let i=0;i<330;i++)tick();
      return {retired,next:s.bird!==bird,left:s.availableBirdsCounter};
    });
    assert.deepEqual(leftExit,{retired:true,next:true,left:4});
    const loss = await page.evaluate(() => {
      const s=fixture(44),bird=s.bird;s.availableBirdsCounter=1;s.killBird();
      for(let i=0;i<340;i++)tick();
      return {same:s.bird===bird,left:s.availableBirdsCounter,turn:s.turnInProgress,toast:s.toastText?.text};
    });
    assert.equal(loss.same,true);assert.equal(loss.left,0);assert.equal(loss.turn,false);assert.equal(loss.toast,'Try it again!');
    assert.deepEqual(errors,[]);
    console.log('PASS rolling pigs on missions 1/44/45, single bird consumption, bounded rolling shot, pause, left exit and last-bird loss');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
