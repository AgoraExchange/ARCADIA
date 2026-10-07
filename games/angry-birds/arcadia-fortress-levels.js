/* Fortress Falls: original missions 31–45. All positions are body centers. */
(() => {
  'use strict';
  const levels = { ...window.ARCADIA_ANGRY_LEVELS };
  function mission(n, name, chapter, flock, challenge, hint, build) {
    const level = { name, chapter, flock, birds: flock.length, challenge, hint, blocks: [], enemies: [] };
    const block = (x, y, extra = {}) => level.blocks.push({ x, y, asset: 'imageGameBoxLight', mass: 5, ...extra });
    const tower = (x, height) => { for (let row = 0; row < height; row++) block(x, 368 - row * 48); };
    const pig = (x, height = 0, armor = 0, king = false) => level.enemies.push({ x, y: 368 - height * 48,
      asset: 'imageGamePig', armor, character: king ? 'king-pig' : armor ? 'corporal-pig' : undefined });
    const wall = (x, y, width, height) => block(x, y, { width, height, fixed: true, asset: 'imageGameBoxHeavy' });
    const barrel = (x, row = 0) => block(x, 368 - row * 48, { tnt: true });
    const bridge = (x, y, width) => block(x, y, { width, height: 18, suspended: true });
    build({ block, tower, pig, wall, barrel, bridge });
    levels[n] = level;
  }
  mission(31, 'Needle Gate', "Chuck's Run", ['chuck','chuck','red'],
    'Clear the two lookout towers beyond the gate.',
    'The stone gate has an opening. Boost Chuck through it toward the wooden supports; high arcs also work.',
    ({wall,tower,pig}) => { wall(400,368,48,48); wall(400,155,48,90); tower(555,3); pig(555,3); tower(765,3); pig(765,3); });
  mission(32, 'Faraway Fuse', "Chuck's Run", ['chuck','chuck','bomb','red'],
    'Reach the distant outposts and their explosive supply crate.',
    'Boost after launch to reach the far supports. A hard hit on a red TNT crate starts an explosion.',
    ({tower,pig,barrel}) => { tower(620,3); pig(620,3); tower(860,4); pig(860,4); barrel(940); tower(1035,2); pig(1035,2); });
  mission(33, 'Twin Windows', "Chuck's Run", ['chuck','chuck','hal','bomb'],
    'Thread the defenses and topple three watchtowers.',
    'Boost through the gaps between the stone lintels and low walls. Save Bomb for surviving clusters.',
    ({wall,tower,pig}) => { [420,710].forEach(x=>{wall(x,368,48,48);wall(x,130,48,70);}); [550,840,1020].forEach(x=>{tower(x,3);pig(x,3);}); });
  mission(34, 'Back Door', 'Behind Enemy Lines', ['hal','hal','bomb','red'],
    'Clear the pigs sheltered behind the stone shield.',
    'Lob Hal over the shield. Tap Boomerang after passing the shelter to attack its open rear.',
    ({wall,tower,pig}) => {wall(450,285,40,214);wall(510,178,160,18);tower(565,2);pig(565,2);tower(775,3);pig(775,3);});
  mission(35, 'Return Address', 'Behind Enemy Lines', ['hal','hal','chuck','bomb'],
    'Take down two shelters with different rear openings.',
    'Hal reverses direction once. Fly past a target before using his power; an early turn sends him home.',
    ({wall,tower,pig}) => {wall(430,320,40,144);tower(535,2);pig(535,2);wall(745,344,40,96);tower(845,2);pig(845,2);tower(980,3);pig(980,3);});
  mission(36, 'Rear Guard', 'Behind Enemy Lines', ['hal','chuck','hal','bomb','red'],
    'Break into the rear guard compound.',
    'Use Hal for the back of the covered shelter, Chuck for the distant tower, and Bomb for cleanup.',
    ({wall,tower,pig}) => {wall(450,285,40,214);wall(520,178,180,18);tower(580,2);pig(580,2);tower(790,4);pig(790,4);tower(1040,3);pig(1040,3);});
  mission(37, 'Powder Room', 'Demolition Yard', ['bomb','bomb','chuck','red'],
    'Ignite the supply chain between the towers.',
    'Detonate Bomb near the red TNT crates. Nearby crates ignite in sequence, spreading the blast.',
    ({tower,pig,barrel}) => {[500,692,884].forEach(x=>{tower(x,3);pig(x,3);});[548,644,740,836].forEach(x=>barrel(x));});
  mission(38, 'Bridge Breaker', 'Demolition Yard', ['bomb','chuck','bomb','hal'],
    'Bring down the suspended bridge and its guards.',
    'The striped bridge hangs from cables. A nearby Bomb or TNT blast snaps them and drops the deck.',
    ({bridge,pig,barrel,tower}) => {bridge(620,304,240);pig(560,2);pig(680,2);barrel(480);tower(885,3);pig(885,3);});
  mission(39, 'Chain Reaction', 'Demolition Yard', ['bomb','bomb','hal','chuck','red'],
    'Collapse two hanging decks and clear the supply yard.',
    'Ignite the TNT beside the first deck. Follow the chain, then use your remaining birds on isolated pigs.',
    ({bridge,pig,barrel}) => {bridge(550,304,180);bridge(850,304,180);[510,590,810,890].forEach(x=>pig(x,2));[430,550,670,790,910].forEach(x=>barrel(x));});
  mission(40, 'Hard Hats', 'Armored Outposts', ['bomb','chuck','bomb','red'],
    'Defeat the helmeted guards.',
    'A helmet absorbs one strong hit or explosion. The next hit defeats the pig. Falling debris can finish the job.',
    ({tower,pig,barrel}) => {tower(500,3);pig(500,3,1);tower(715,4);pig(715,4,1);barrel(620);});
  mission(41, 'Armor Alley', 'Armored Outposts', ['chuck','bomb','hal','bomb','red'],
    'Strip the armor and collapse the outposts.',
    'Break supports first: the fall can remove a helmet, leaving the exposed pig for another shot or TNT blast.',
    ({tower,pig,barrel}) => {[470,690,910].forEach(x=>{tower(x,4);pig(x,4,1);});barrel(570);barrel(790);});
  mission(42, 'Fortified Crossing', 'Armored Outposts', ['bomb','hal','chuck','bomb','red'],
    'Clear the armored bridge guard and the rear tower.',
    'Drop the bridge with an explosion, then finish the exposed guards. Hal can return toward survivors.',
    ({bridge,pig,barrel,tower}) => {bridge(590,304,220);pig(540,2,1);pig(650,2,1);barrel(450);barrel(570);tower(920,4);pig(920,4,1);});
  mission(43, 'Outer Keep', "King's Fortress", ['chuck','hal','bomb','bomb','red'],
    'Breach the gate and defeat the king’s escort.',
    'Chuck reaches the first support, Hal can flank the wall, and Bomb can break armor near the TNT.',
    ({wall,tower,pig,barrel}) => {wall(400,368,48,48);tower(525,4);pig(525,4,1);tower(740,3);pig(740,3);tower(960,4);pig(960,4,1);barrel(840);});
  mission(44, 'Throne Approach', "King's Fortress", ['hal','bomb','chuck','bomb','red'],
    'Clear the protected entrance and the royal bridge.',
    'Approach from above, then blast the bridge cables. Every armored survivor still needs a finishing hit.',
    ({wall,tower,pig,bridge,barrel}) => {wall(420,320,40,144);tower(540,3);pig(540,3,1);bridge(820,256,230);pig(770,3,1);pig(875,3);barrel(680);barrel(800);});
  mission(45, 'Fortress Falls', "King's Fortress", ['chuck','bomb','hal','bomb','bomb'],
    'Defeat every guard and the armored King Pig.',
    'The king has two armor layers: three strong hits defeat him. Collapse his tower, then use the TNT and remaining Bombs.',
    ({tower,pig,barrel,bridge}) => {tower(470,3);pig(470,3,1);bridge(690,304,170);pig(660,2);pig(730,2);tower(970,4);pig(970,4,2,true);[550,670,790,910,1030].forEach(x=>barrel(x));});
  window.ARCADIA_ANGRY_LEVELS = Object.freeze(levels);
  window.ARCADIA_ANGRY_LEVEL_COUNT = 45;
})();
