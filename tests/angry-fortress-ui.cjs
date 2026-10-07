const assert = require('node:assert/strict');
const { chromium } = require(process.env.ARCADIA_PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.goto(process.env.ARCADIA_PREVIEW_URL || 'http://127.0.0.1:4179');
    await page.getByRole('button',{name:'Create Player',exact:true}).click();
    await page.locator('#playerName').fill('Fortress Test');
    await page.getByRole('button',{name:'Enter Arcadia',exact:true}).click();
    // Migrate an existing player who already cleared Chapter 2.
    await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('arcadia_player_v1'));s.stats.angrySolved=30;localStorage.setItem('arcadia_player_v1',JSON.stringify(s));});
    await page.reload();
    await page.getByRole('button',{name:'Enter Arcadia',exact:true}).click();
    const card=page.locator('.game-card').filter({hasText:'Angry Birds'});
    await card.click();
    await page.waitForFunction(()=>!document.querySelector('#startAngryBtn').disabled);
    await page.locator('#startAngryBtn').click();
    const frame=page.frame({url:/games\/angry-birds/});
    await frame.evaluate(()=>game.state.start('AngryBirds.LevelSelector'));
    await frame.waitForFunction(()=>game.state.current==='AngryBirds.LevelSelector');
    assert.equal(await frame.evaluate(()=>game.state.states['AngryBirds.LevelSelector'].arcadiaPage),2);
    if(process.env.TEMP)await page.screenshot({path:process.env.TEMP+'/arcadia-chapter-three.png'});
    async function mission(n) {
      await frame.evaluate(n=>{game.paused=false;GAME_LEVEL_SELECTED=String(n);game.state.start('AngryBirds.Game');},n);
      await page.locator('#angryMissionModal').waitFor({state:'visible'});
      await page.waitForFunction(n=>document.querySelector('#angryMissionTitle').textContent.startsWith(n+'.'),n);
    }
    await mission(31);
    assert.match(await page.locator('#angryMissionHint').textContent(),/Boost Chuck/);
    assert(await frame.evaluate(()=>game.paused));
    if(process.env.TEMP)await page.screenshot({path:process.env.TEMP+'/arcadia-fortress-briefing.png'});
    for(const [width,height] of [[320,568],[390,844],[844,390]]) {
      await page.setViewportSize({width,height});
      const fits=await page.evaluate(()=>{const r=document.querySelector('#angryMissionBeginBtn').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight;});
      assert(fits,`Briefing does not fit ${width}x${height}`);
    }
    await page.setViewportSize({width:390,height:844});
    await page.locator('#angryMissionBeginBtn').click();
    await page.locator('#angryMissionModal').waitFor({state:'hidden'});
    assert.equal(await frame.evaluate(()=>game.paused),false);
    await page.locator('#angryMissionHelpBtn').click();
    await page.locator('#angryMissionModal').waitFor({state:'visible'});
    await page.locator('#angryMissionBeginBtn').click();
    const save=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('arcadia_player_v1')));
    async function victory(n,used) {
      await mission(n);await page.locator('#angryMissionBeginBtn').click();
      await frame.evaluate(used=>{const s=game.state.states['AngryBirds.Game'];s.arcadiaBirdsLaunched=used;while(!s.gameWon)s.updateDeadCount();parent.arcadiaCompleteAngryBirds();},used);
    }
    await victory(31,1);let s=await save();
    assert.deepEqual(s.stats.angryRecords[31],{stars:3,bestUnusedBirds:2,wins:1});
    const xp=s.xp;
    await victory(31,3);s=await save();
    assert.deepEqual(s.stats.angryRecords[31],{stars:3,bestUnusedBirds:2,wins:2});
    assert.equal(s.xp-xp,360);
    await victory(45,3);s=await save();
    assert.equal(s.stats.angrySolved,45);assert(s.achievements.includes('angry_fortress'));
    assert.deepEqual(s.stats.angryRecords[45],{stars:3,bestUnusedBirds:2,wins:1});
    await mission(38);await page.locator('#angryMissionBeginBtn').click();
    await page.evaluate(()=>{const style=document.documentElement.style;style.setProperty('--safe-top','59px');style.setProperty('--safe-bottom','34px');});
    await page.waitForTimeout(350);
    assert(await page.evaluate(()=>document.querySelector('#restartAngryBtn').getBoundingClientRect().bottom<=document.querySelector('.angry-game-content').getBoundingClientRect().bottom));
    if(process.env.TEMP)await page.screenshot({path:process.env.TEMP+'/arcadia-fortress-bridge.png'});
    await page.locator('#exitAngryBtn').click();await page.reload();
    await page.getByRole('button',{name:'Enter Arcadia',exact:true}).click();await card.click();
    await page.waitForFunction(()=>!document.querySelector('#startAngryBtn').disabled);await page.locator('#startAngryBtn').click();
    const reopened=page.frame({url:/games\/angry-birds/});
    assert.deepEqual(await reopened.evaluate(()=>arcadiaAngryBirds.getRecord(31)),{stars:3,bestUnusedBirds:2,wins:2});
    assert.equal(await reopened.evaluate(()=>game.state.states['AngryBirds.SplashGame'].getSolvedLevels()),'45');
    assert.deepEqual(errors,[]);
    console.log('PASS returning-player unlock, briefings/hints, portrait/landscape fit, pause/help, best-star retention, replay XP, mission 45 achievement, save/reload');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
