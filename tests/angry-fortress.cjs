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
      arcadiaAngryBirds.start({ solved: 29, mutedMusic: true, mutedSfx: true });
      game.raf.stop();
      let clock = Date.now(); Date.now = () => clock;
      window.tick = () => { clock += 1000/60; game.time.update(game.time.now+1000/60); game.time.physicsElapsed=1/60; game.updateLogic(1/60); };
      window.resetMission = n => {
        game.paused=false; game.sound.stopAll(); game.time.events.removeAll();
        GAME_LEVEL_SELECTED=String(n); game.state.start('AngryBirds.Game'); game.state.preUpdate();
        for(let i=0;i<18;i++) tick();
      };
    });
    const pages = await page.evaluate(() => {
      const selector=game.state.states['AngryBirds.LevelSelector'];
      game.state.start('AngryBirds.LevelSelector'); game.state.preUpdate();
      const locked = !selector.arcadiaNextPage.inputEnabled;
      game.state.states['AngryBirds.SplashGame'].setSolvedLevels(30);
      game.state.start('AngryBirds.LevelSelector'); game.state.preUpdate();
      return { locked, page: selector.arcadiaPage, next: Boolean(selector.arcadiaNextPage.inputEnabled),
        title: game.world.children.some(c=>c.text==='CHAPTER 3: Fortress Falls') };
    });
    assert.deepEqual(pages,{locked:true,page:2,next:false,title:true});
    const armor = await page.evaluate(() => {
      resetMission(40);
      const s=game.state.states['AngryBirds.Game'], pig=s.enemies.children[0];
      const hit = speed => s.hitEnemy.call(pig,null,null,null,null,[{bodyA:{velocity:[speed,0]},bodyB:{velocity:[0,0]}}]);
      hit(0.1); const weak=pig.arcadiaArmor;
      hit(100); const first={alive:pig.alive,armor:pig.arcadiaArmor};
      hit(100); const duplicate=pig.alive;
      for(let i=0;i<25;i++)tick(); hit(100);
      return {weak,first,duplicate,dead:!pig.alive,count:s.countDeadEnemies};
    });
    assert.deepEqual(armor,{weak:1,first:{alive:true,armor:0},duplicate:true,dead:true,count:1});
    const king = await page.evaluate(() => {
      resetMission(45); const s=game.state.states['AngryBirds.Game'];
      const pig=s.enemies.children.find(p=>p.arcadiaCharacter==='king-pig');
      const results=[];
      for(let hit=0;hit<3;hit++) {
        s.hitEnemy.call(pig,null,null,null,null,[{bodyA:{velocity:[100,0]},bodyB:{velocity:[0,0]}}]);
        results.push({alive:pig.alive,armor:pig.arcadiaArmor});
        for(let i=0;i<25;i++)tick();
      }
      return results;
    });
    assert.deepEqual(king,[{alive:true,armor:1},{alive:true,armor:0},{alive:false,armor:0}]);
    const bridge = await page.evaluate(() => {
      resetMission(38); const s=game.state.states['AngryBirds.Game'];
      const deck=s.blocks.children.find(b=>b.arcadiaSuspended);
      const wasStatic=deck.body.static;
      s.arcadiaBlastStructures(deck.x,deck.y);
      return {wasStatic, static:deck.body.static, suspended:deck.arcadiaSuspended};
    });
    assert.deepEqual(bridge,{wasStatic:true,static:false,suspended:false});
    const tnt = await page.evaluate(() => {
      resetMission(37); const s=game.state.states['AngryBirds.Game'];
      const barrels=s.blocks.children.filter(b=>b.arcadiaTnt);
      s.arcadiaBlastStructures(barrels[0].x,barrels[0].y);
      for(let i=0;i<15;i++)tick();
      const exploded=barrels.filter(b=>b.arcadiaExploded).length;
      resetMission(37);
      return {exploded, reset:s.blocks.children.filter(b=>b.arcadiaTnt&&b.alive&&!b.arcadiaExploded).length};
    });
    assert.equal(tnt.exploded,4); assert.equal(tnt.reset,4);
    const pause = await page.evaluate(() => {
      resetMission(31);
      const started=!game.paused;
      arcadiaAngryBirds.pause(true);
      const paused=game.paused; arcadiaAngryBirds.pause(false);
      return {started,paused,resumed:!game.paused};
    });
    assert.deepEqual(pause,{started:true,paused:true,resumed:true});
    assert.deepEqual(errors,[]);
    console.log('PASS chapter unlock/title, armor impact threshold and cooldown, three-hit king, bridge release, TNT chain/reset, immediate start and manual pause');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode=1; });
