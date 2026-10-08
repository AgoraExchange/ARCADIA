/* Thunderclap Citadel: original mixed-flock missions 46–60. */
(() => {
  'use strict';
  const levels = { ...window.ARCADIA_ANGRY_LEVELS };
  function mission(number, name, flock, build) {
    const level = { name, flock, birds: flock.length, blocks: [], enemies: [] };
    const block = (x, y, extra = {}) => level.blocks.push({ x, y, asset: 'imageGameBoxLight', mass: 5, ...extra });
    const tower = (x, height, heavy = 0) => {
      for (let row=0; row<height; row++) block(x,368-row*48,row<heavy ? {asset:'imageGameBoxHeavy',mass:12} : {});
    };
    const pig = (x, row, armor=0, king=false) => level.enemies.push({x,y:368-row*48,asset:'imageGamePig',armor,
      character:king?'king-pig':armor?'corporal-pig':undefined});
    const post = (x, height, armor=0, heavy=0) => {tower(x,height,heavy);pig(x,height,armor);};
    const tnt = (x,row=0) => block(x,368-row*48,{tnt:true});
    const wall = (x,height) => block(x,392-height/2,{width:36,height,fixed:true,asset:'imageGameBoxHeavy'});
    const bridge = (x,row,width) => block(x,400-row*48,{width,height:18,suspended:true});
    build({block,tower,pig,post,tnt,wall,bridge});
    levels[number]=level;
  }
  mission(46,'Thunder Gate',['chuck','bomb','hal','chuck'],({post,wall,tnt})=>{
    wall(405,64);post(520,3);post(740,5,1);post(970,3);tnt(640);
  });
  mission(47,'Split-Level Siege',['bomb','hal','chuck','bomb','red'],({bridge,pig,post,tnt})=>{
    bridge(560,2,190);pig(510,2);pig(610,2,1);bridge(900,3,180);pig(865,3);pig(945,3);tnt(420);tnt(760);post(1100,3);
  });
  mission(48,'Fuse Corridor',['chuck','bomb','chuck','hal','bomb'],({post,tnt,wall})=>{
    post(460,4,1);wall(620,48);post(760,3);post(1020,5,1);[550,690,830,970].forEach(x=>tnt(x));
  });
  mission(49,'Around the Rampart',['hal','hal','bomb','chuck','bomb'],({block,wall,post,tnt})=>{
    wall(420,168);block(490,224,{width:180,height:18,fixed:true,asset:'imageGameBoxHeavy'});
    post(530,2,1);wall(740,96);post(850,3);post(1060,4,1);tnt(640);tnt(950);
  });
  mission(50,'Powder Platforms',['bomb','chuck','bomb','hal','red'],({bridge,pig,tnt,post})=>{
    bridge(570,3,220);pig(510,3,1);pig(630,3);post(810,4,1);post(1050,2);[430,570,710,930].forEach(x=>tnt(x));
  });
  mission(51,'Needle Towers',['chuck','hal','chuck','bomb','bomb'],({post,tnt})=>{
    [[450,5],[620,2],[790,5],[960,3],[1120,4]].forEach(([x,h],i)=>post(x,h,i%2));tnt(700);tnt(1040);
  });
  mission(52,'The Back Passage',['hal','bomb','hal','chuck','bomb'],({block,wall,post,bridge,pig,tnt})=>{
    wall(440,208);block(520,184,{width:196,height:18,fixed:true,asset:'imageGameBoxHeavy'});
    post(550,2);bridge(835,2,210);pig(785,2,1);pig(900,2);post(1110,4,1);tnt(670);tnt(1030);
  });
  mission(53,'Three Suspensions',['bomb','chuck','bomb','hal','bomb'],({bridge,pig,tnt})=>{
    [[490,2],[780,3],[1060,2]].forEach(([x,row],i)=>{bridge(x,row,170);pig(x-40,row,i===1?1:0);pig(x+40,row);});
    [390,530,680,820,960,1100].forEach(x=>tnt(x));
  });
  mission(54,'Iron Orchard',['chuck','bomb','hal','bomb','chuck'],({post,tnt})=>{
    [[470,4],[665,5],[860,3],[1060,5]].forEach(([x,h])=>post(x,h,1,1));tnt(570);tnt(770);tnt(965);
  });
  mission(55,'Crossfire Court',['hal','chuck','bomb','hal','bomb'],({wall,post,bridge,pig,tnt})=>{
    wall(410,96);post(525,3,1);bridge(775,3,200);pig(725,3);pig(825,3,1);post(1070,4);tnt(640);tnt(940);
  });
  mission(56,'Broken Staircase',['chuck','bomb','hal','bomb','chuck'],({post,tnt})=>{
    [[445,2],[600,3],[755,4],[910,5],[1080,3]].forEach(([x,h],i)=>post(x,h,i===3?1:0));tnt(520);tnt(830);tnt(1000);
  });
  mission(57,'Royal Freight',['bomb','hal','chuck','bomb','bomb'],({bridge,pig,tnt,post})=>{
    bridge(580,2,220);pig(525,2,1);pig(635,2,1);bridge(975,3,240);pig(920,3);pig(1030,3,1);post(790,4);
    [425,565,705,855,995].forEach(x=>tnt(x));
  });
  mission(58,'The Crown Wall',['hal','bomb','chuck','bomb','hal'],({block,wall,post,tnt})=>{
    wall(420,192);block(510,200,{width:180,height:18,fixed:true,asset:'imageGameBoxHeavy'});
    post(540,2,1);post(740,5,1);wall(880,96);post(1010,4,1);tnt(640);tnt(810);tnt(1130);
  });
  mission(59,'Eye of the Storm',['chuck','bomb','hal','bomb','bomb'],({post,bridge,pig,tnt})=>{
    post(455,5,1);bridge(715,3,200);pig(665,3,1);pig(770,3);post(940,4,1);post(1130,3);[550,690,835,1040].forEach(x=>tnt(x));
  });
  mission(60,'Thunderclap Citadel',['bomb','chuck','hal','bomb','bomb'],({post,bridge,pig,tnt,tower,wall})=>{
    post(460,4,1);bridge(700,2,210);pig(640,2,1);pig(755,2);post(895,3,1);tower(1110,5);pig(1110,5,2,true);
    [540,680,820,970].forEach(x=>tnt(x));wall(1230,192);
  });
  window.ARCADIA_ANGRY_LEVELS=Object.freeze(levels);
  window.ARCADIA_ANGRY_LEVEL_COUNT=60;
})();
