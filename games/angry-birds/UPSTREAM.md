# Angry Birds clone

Angry Birds clone game in JavaScript.

![alt screenshot](https://raw.githubusercontent.com/lrusso/AngryBirds/master/AngryBirds.png)

## Web:

https://lrusso.github.io/AngryBirds/AngryBirds.htm

## Disclaimer

The Angry Birds resources (images, fonts, music and sounds) are provided for educational purposes ONLY. This demo is not affiliated with or endorsed by their respective copyright holders.


## ARCADIA integration

Source: https://github.com/lrusso/AngryBirds
Game source blob: 9069b204e6391a55e0fe2fe7d75fa84b5d2d0465

The original engine, embedded artwork, audio, three included levels, and native menu are preserved. ARCADIA's separate bridge bypasses the developer splash and disclaimer screens, gates startup behind Start Game, integrates audio/pause, and saves campaign progress in ARCADIA's player save. The original resource notice is retained above. The 15-slot upstream selector contains only three playable levels.


## Original ARCADIA campaign extension

Version 19.35.0.0 supplies missions 4-15 in `arcadia-levels.js`. These are new ARCADIA layouts, not recovered or official Angry Birds levels. They reuse the included crate and pig assets and native physics; the bridge registers the layouts and supplies three to five birds per mission. The original missions 1-3 remain unchanged.

The dashboard and launch cover use the player-provided `assets/images/games/angry-birds-icon.png`.

## Page 2 and character reference

Version 19.36.0.0 adds original missions 16-30, with a second selector page unlocked by clearing mission 15. Existing progress and the first 15 layouts are preserved.

Character artwork in `characters/` comes from https://github.com/yumin-jung/Angry-Birds (tree `23bcc0e73cb9f0fb9eb62a8280857feb535fcaf1`), the source of https://angry-birds-beta.vercel.app/ supplied as a reference by the player. Files: `data/birds/chuck.png`, `bomb.png`, `hal.png`, `data/pigs/corporal-pig.png`, and `king-pig.png`. The reference README credits Rovio for Angry Birds and its characters. Its bird classes informed the speed-boost and boomerang concepts; ARCADIA implements these in the existing Phaser/P2 engine, and gives Bomb a radial blast rather than the reference demo's enlargement power. No Matter.js engine or source classes are bundled.

Page 2 introduces Chuck at 16, Bomb at 18, Hal at 20, Corporal Pigs at 22, and King Pigs at 23. Special powers activate once per launched bird using a game-board tap, Space, or the outside-frame Power button. Pig variants change appearance while retaining the native collision footprint and defeat rules.

Campaign verification: `node tests/angry-campaign.cjs` from the repository root with the local preview running and Playwright available. Set `ARCADIA_PLAYWRIGHT_MODULE` to an existing Playwright module path if needed. The checks replay legal shots using the native physics and verify every new mission can be cleared within its bird budget, remains stable before launch, and displays all spare birds.
