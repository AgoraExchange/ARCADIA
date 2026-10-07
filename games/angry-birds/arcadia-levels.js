/* Original ARCADIA missions for the lrusso Angry Birds engine.
 * Coordinates are body centers. The floor starts at y=392; crates are 48px.
 * Keep this data separate from the unchanged upstream engine and missions 1–3.
 */
(() => {
  'use strict';
  const levels = {};
  function mission(number, name, birds, build) {
    const level = { name, birds, blocks: [], enemies: [] };
    const crate = (x, row, heavy = false) => level.blocks.push({
      x, y: 368 - row * 48,
      asset: heavy ? 'imageGameBoxHeavy' : 'imageGameBoxLight', mass: heavy ? 12 : 5
    });
    const tower = (x, height, heavyBase = 0) => {
      for (let row = 0; row < height; row++) crate(x, row, row < heavyBase);
    };
    const pig = (x, height = 0) => level.enemies.push({ x, y: 368 - height * 48, asset: 'imageGamePig' });
    build({ crate, tower, pig });
    levels[number] = level;
  }

  mission(4, 'Twin Peaks', 3, ({ tower, pig }) => {
    tower(470, 3); pig(470, 3);
    tower(640, 4); pig(640, 4);
  });
  mission(5, 'Ground Patrol', 3, ({ tower, pig }) => {
    tower(420, 2); tower(565, 3); tower(710, 2);
    pig(492); pig(637); pig(710, 2);
  });
  mission(6, 'Stairway', 3, ({ tower, pig }) => {
    tower(430, 2); pig(430, 2);
    tower(575, 3); pig(575, 3);
    tower(720, 5); pig(720, 5);
  });
  mission(7, 'Domino Yard', 3, ({ tower, pig }) => {
    [440, 536, 632, 728].forEach(x => tower(x, 4));
    pig(440, 4); pig(632, 4); pig(728, 4);
  });
  mission(8, 'High and Low', 4, ({ tower, pig }) => {
    tower(430, 4, 1); pig(430, 4);
    pig(530); tower(625, 2, 1); pig(625, 2);
    tower(790, 5); pig(790, 5);
  });
  mission(9, 'Wooden Village', 4, ({ tower, pig }) => {
    [430, 670, 910].forEach(x => { tower(x, 3); pig(x, 3); pig(x + 80); });
  });
  mission(10, 'Over the Wall', 4, ({ tower, pig }) => {
    tower(395, 3, 3);
    tower(530, 4); pig(530, 4);
    tower(690, 3); pig(690, 3);
    pig(780); tower(875, 4); pig(875, 4);
  });
  mission(11, 'Watchtowers', 4, ({ tower, pig }) => {
    [[435, 4], [600, 2], [765, 5], [930, 3]].forEach(([x, height]) => {
      tower(x, height, 1); pig(x, height);
    });
  });
  mission(12, 'Crate Mountain', 5, ({ tower, pig }) => {
    [2, 3, 4, 5, 4, 3, 2].forEach((height, index) => tower(490 + index * 48, height));
    pig(442); pig(538, 3); pig(634, 5); pig(730, 3);
    tower(920, 2); pig(920, 2);
  });
  mission(13, 'Distant Outposts', 5, ({ tower, pig }) => {
    [[450, 3], [560, 4], [820, 4], [940, 3], [1060, 5]].forEach(([x, height]) => {
      tower(x, height); pig(x, height);
    });
  });
  mission(14, 'Stone Roots', 5, ({ tower, pig }) => {
    [[440, 5], [585, 3], [730, 4], [875, 5]].forEach(([x, height]) => {
      tower(x, height, 2); pig(x, height);
    });
    pig(990);
  });
  mission(15, 'Last Stand', 5, ({ tower, pig }) => {
    [[450, 3], [550, 5], [725, 4], [825, 3], [1000, 5], [1100, 4]].forEach(([x, height]) => {
      tower(x, height, 1); pig(x, height);
    });
  });

  mission(16, 'Chuck Takes Flight', 3, ({ tower, pig }) => {
    tower(475, 3); pig(475, 3); tower(710, 4); pig(710, 4);
  });
  mission(17, 'Speedway', 4, ({ tower, pig }) => {
    [450, 650, 850, 1050].forEach(x => { tower(x, 3); pig(x, 3); });
  });
  mission(18, 'Bomb School', 3, ({ tower, pig }) => {
    [500, 596, 692].forEach(x => { tower(x, 3); pig(x, 3); });
  });
  mission(19, 'Demolition Crew', 4, ({ tower, pig }) => {
    [450, 546, 642, 830, 926].forEach((x, i) => { tower(x, i < 3 ? 4 : 3); pig(x, i < 3 ? 4 : 3); });
  });
  mission(20, 'Hal Comes Around', 4, ({ tower, pig }) => {
    tower(480, 3); pig(480, 3); tower(700, 4, 1); pig(700, 4);
    tower(900, 2); pig(900, 2);
  });
  mission(21, 'Teamwork', 4, ({ tower, pig }) => {
    [[445, 2], [610, 4], [800, 3], [990, 5]].forEach(([x, h]) => { tower(x, h); pig(x, h); });
  });
  mission(22, 'Helmet Patrol', 4, ({ tower, pig }) => {
    [460, 605, 750, 895].forEach(x => { tower(x, 4, 1); pig(x, 4); });
    pig(1000);
  });
  mission(23, 'Royal Escort', 5, ({ tower, pig }) => {
    [[460, 3], [580, 4], [750, 5], [920, 4], [1040, 3]].forEach(([x, h]) => { tower(x, h); pig(x, h); });
  });
  mission(24, 'Blast Alley', 4, ({ tower, pig }) => {
    [460, 556, 652, 845, 941].forEach(x => { tower(x, 4); pig(x, 4); });
  });
  mission(25, 'Long Way Home', 5, ({ tower, pig }) => {
    [[470, 4], [650, 3], [830, 5], [1010, 4]].forEach(([x, h]) => { tower(x, h, 1); pig(x, h); });
  });
  mission(26, 'Stone and Timber', 5, ({ tower, pig }) => {
    [[450, 3], [590, 5], [730, 3], [870, 5], [1010, 3]].forEach(([x, h]) => { tower(x, h, 2); pig(x, h); });
  });
  mission(27, 'Royal Mountain', 5, ({ tower, pig }) => {
    [2, 3, 4, 5, 4, 3, 2].forEach((h, i) => tower(480 + i * 48, h));
    pig(432); pig(528, 3); pig(624, 5); pig(720, 3); tower(930, 3); pig(930, 3);
  });
  mission(28, 'Outpost Ambush', 5, ({ tower, pig }) => {
    [[440, 4], [550, 3], [790, 4], [900, 3], [1080, 5]].forEach(([x, h]) => { tower(x, h); pig(x, h); });
  });
  mission(29, 'The Crown Guard', 5, ({ tower, pig }) => {
    [[440, 5], [580, 4], [720, 5], [860, 4], [1000, 5]].forEach(([x, h]) => { tower(x, h, 1); pig(x, h); });
  });
  mission(30, 'King of the Castle', 5, ({ tower, pig }) => {
    [[440, 3], [540, 5], [710, 4], [810, 3], [990, 5], [1090, 4]].forEach(([x, h]) => { tower(x, h, 1); pig(x, h); });
  });

  const flocks = {
    16: ['chuck', 'red', 'chuck'],
    17: ['chuck', 'chuck', 'red', 'chuck'],
    18: ['bomb', 'red', 'bomb'],
    19: ['bomb', 'chuck', 'bomb', 'red'],
    20: ['hal', 'red', 'hal', 'chuck'],
    21: ['chuck', 'bomb', 'hal', 'red'],
    22: ['bomb', 'chuck', 'red', 'hal'],
    23: ['red', 'chuck', 'bomb', 'hal', 'bomb'],
    24: ['bomb', 'chuck', 'bomb', 'red'],
    25: ['hal', 'chuck', 'red', 'hal', 'bomb'],
    26: ['bomb', 'chuck', 'bomb', 'hal', 'red'],
    27: ['bomb', 'hal', 'chuck', 'bomb', 'red'],
    28: ['chuck', 'hal', 'bomb', 'chuck', 'red'],
    29: ['bomb', 'chuck', 'hal', 'red', 'bomb'],
    30: ['chuck', 'bomb', 'hal', 'bomb', 'red']
  };
  for (const [number, flock] of Object.entries(flocks)) {
    levels[number].flock = flock;
    levels[number].enemies.forEach((enemy, index, enemies) => {
      if (Number(number) >= 23 && index === enemies.length - 1) enemy.character = 'king-pig';
      else if (Number(number) >= 22 && index % 2 === 0) enemy.character = 'corporal-pig';
    });
  }

  window.ARCADIA_ANGRY_LEVELS = Object.freeze(levels);
  window.ARCADIA_ANGRY_LEVEL_COUNT = 30;
})();
