const assert = require('node:assert/strict');
const { chromium } = require(process.env.ARCADIA_PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try {
    const page=await browser.newPage({viewport:{width:782,height:440}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`${process.env.ARCADIA_PREVIEW_URL || 'http://127.0.0.1:4179'}/games/angry-birds/index.html`);
    await page.waitForFunction(()=>game.cache.checkTextKey('level60'));
    await page.evaluate(()=>{arcadiaAngryBirds.start({solved:44,mutedMusic:true,mutedSfx:true});game.state.start('AngryBirds.LevelSelector');});
    await page.waitForFunction(()=>game.state.current==='AngryBirds.LevelSelector');
    assert.deepEqual(await page.evaluate(()=>{const s=game.state.states['AngryBirds.LevelSelector'];return {page:s.arcadiaPage,next:Boolean(s.arcadiaNextPage.inputEnabled)};}),{page:2,next:false});
    await page.evaluate(()=>{game.state.states['AngryBirds.SplashGame'].setSolvedLevels(45);game.state.start('AngryBirds.LevelSelector');});
    await page.waitForFunction(()=>game.state.states['AngryBirds.LevelSelector'].arcadiaPage===3);
    assert(await page.evaluate(()=>game.world.children.some(c=>c.text==='CHAPTER 4: Thunderclap Citadel')));
    if(process.env.TEMP)await page.screenshot({path:process.env.TEMP+'/arcadia-citadel-selector.png'});
    await page.mouse.click(100,90);
    await page.waitForFunction(()=>game.state.current==='AngryBirds.Game'&&Number(game.state.states['AngryBirds.Game'].currentLevel)===46);
    assert.equal(await page.evaluate(()=>game.paused),false);
    await page.waitForTimeout(350);
    if(process.env.TEMP)await page.screenshot({path:process.env.TEMP+'/arcadia-citadel-mission.png'});
    await page.evaluate(()=>{GAME_LEVEL_SELECTED='60';game.state.start('AngryBirds.Game');});
    await page.waitForFunction(()=>Number(game.state.states['AngryBirds.Game'].currentLevel)===60);
    assert.equal(await page.evaluate(()=>game.state.states['AngryBirds.Game'].nextLevelExists()),false);
    assert(await page.evaluate(()=>game.state.states['AngryBirds.Game'].enemies.children.some(p=>p.arcadiaCharacter==='king-pig'&&p.arcadiaArmor===2)));
    await page.evaluate(()=>{game.state.states['AngryBirds.SplashGame'].setSolvedLevels(60);game.state.start('AngryBirds.LevelSelector');});
    await page.waitForFunction(()=>game.state.current==='AngryBirds.LevelSelector');
    assert.equal(await page.evaluate(()=>game.world.children.filter(c=>c.key==='imageLevelSelectorCompleted').length),15);
    assert.equal(await page.evaluate(()=>Boolean(game.state.states['AngryBirds.LevelSelector'].arcadiaNextPage.inputEnabled)),false);
    assert.deepEqual(errors,[]);
    console.log('PASS mission 45 unlock, Chapter 4 heading, click-to-play, armored king, final page boundary and completion stars');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
