# ARCADIA

- Version 19.24.2.0 raises Mario Kart's portrait controls away from Restart, separates landscape A/B buttons, and places the landscape item slot directly beneath them.
- Version 19.24.1.0 guarantees a louder compressed cannon pop for every Fruit Ninja gameplay launch, primes the effect from trusted iOS Start/Resume gestures, and balances it clearly above the OGG soundtrack.
- Version 19.24.0.0 adds Mario Kart's conditional Tap to Continue audio gate, automatic title advance when sound is ready, diagonal A/B mobile controls, native back/cancel navigation, debounced item detection, and reliable one-press item use.
- Version 19.23.0.0 unlocks Mario Kart's actual GameMaker music/SFX engine from real touch gestures on iOS PWAs and precaches the complete kart runtime for dependable loading.
- Version 19.22.0.0 restores responsive held Mario Kart steering, separates joystick menu navigation from confirmation, and adds native joystick-down braking/reverse during races.
- Version 19.21.0.0 adds Fruit Ninja's blue-glowing Slow Motion Nana, six-second time slowing, escalating survival score, bonus power-up XP, and guaranteed level gains for new personal high scores across ARCADIA.
- Version 19.20.0.1 removes the dotted circle around Fruit Ninja bombs while preserving their animated fuse, sparks, flame, and smoke.
- Version 19.20.0.0 adds unmistakable sparking bomb fuses, cannon-pop fruit launches, five-fruit minute volleys, +100 combo milestones, and sharply escalating survival XP to Fruit Ninja.
- Version 19.19.0.2 switches the Super Mario Kart ZX dashboard card to the player-provided neon kart artwork.
- Version 19.19.0.1 keeps Mario Kart's enlarged portrait canvas while returning its touch controls and Restart button to the bottom of the screen.
- Version 19.19.0.0 fixes Mario Kart's Grand Prix pause menu and black-screen course exits, removes the extra touch guide, adds smoother proportional steering, and enlarges the portrait mobile presentation.
- Version 19.18.0.2 makes the local launcher open only after its server is ready and automatically moves to another localhost port when 4179 is occupied.
- Version 19.18.0.1 detects blocked Mario Kart game-file downloads and adds `Launch ARCADIA.cmd` for one-click local web-server testing.
- Version 19.18.0.0 adds Super Mario Kart ZX as Game 10 with the original web build, preserved intro and title sequence, mobile driving controls, and ARCADIA progression.
- Version 19.17.0.1 switches Fruit Ninja to the player-provided icon and organizes its image, OGG soundtrack, and WAV cut sound into dedicated asset folders.
- Version 19.17.0.0 adds Fruit Ninja with voxel-built fruit, projected wall shadows, swipe slicing, block-fragment destruction, escalating survival waves, bombs, rewards, and dedicated audio.
- Version 19.16.1.0 fixes Inferno Red, Violet Pulse, Hologram, and Black Hole Store preview travel so their style animations no longer pin shots to the bottom edge.
- Version 19.16.0.0 adds twelve Star Invaders beam cosmetics with animated Store previews and matching projectile, trail, gravity, shard, hologram, and impact effects.
- Version 19.15.0.0 adds fourteen Crossy Road characters with a level-and-price flex progression, animated Store previews, and matching in-game hop, landing, trail, hologram, and material effects.
- Version 19.14.0.0 adds ten premium reactive Snake cosmetics and removes the spaceship artwork from laser Store previews.
- Version 19.13.0.0 repairs Blackstorm profile and bell layouts and adds animated previews for every nameplate, laser cosmetic, and booster.
- Version 19.12.0.0 adds the animated level-75 Blackstorm Nameplate with moving storm clouds and circulating lightning.
- Version 19.11.1.0 makes the notification bell match the player's equipped nameplate, including animated RGB and Redline styles.
- Version 19.11.0.0 adds the notification inbox and the animated level-65 Galaxy Frog Crossy Road cosmetic.

ARCADIA is a modern 1980s-inspired arcade web app. Players enter a name, browse a clean game library, play ten arcade games, earn XP, collect coins, unlock achievements, and track progress from their player profile.

If you enjoy ARCADIA and would love to see more projects show me some support here https://ko-fi.com/agoraexchange .

## Local Launch

Most ARCADIA games can run from a directly opened HTML file, but browser security blocks Super Mario Kart ZX's WebAssembly files in `file://` mode. On Windows, double-click `Launch ARCADIA.cmd` and use the `http://127.0.0.1:4179/` tab it opens. The published GitHub Pages site already runs over HTTP and does not need this launcher.

## Current Layout

- Splash / boot screen
- First-time player name setup
- Minimal arcade lobby
  - Huge ARCADIA title
  - Clickable player strip under the title
  - Semi-transparent game search
  - Game list with Snake and coming-soon games
- Profile page
  - Player name and initials
  - Level and XP progress
  - Coins, games played, Snake best, favorite game, badges
  - Achievements
  - Leaderboard preview
  - Compact three-item achievement and leaderboard views with internal scrolling
  - Compact Rewards Store with permanent player cosmetics, reusable game boosters, horizontal game filters, search, and internal scrolling
- Snake game page
  - Neon framed board
  - Run-only Score on the left and High Score on the right above the unobstructed board
  - XP and coin preview
  - Start, pause, restart, exit
  - Keyboard, swipe, and mobile controls
  - Six purchasable color skins, including the level-35 animated Rainbow Snake
  - Shared Tombstone resurrection booster with one wall rebound or self-collision ghost pass per run
- Block Grid game page
  - Eight-by-eight placement board with row and column clears
  - Run-only live score rail with Score, Lines, and High Score positioned above the board
  - Earthquake booster that clears and scores the board during the opening 15-45 seconds
  - Skill recharge after every five player-cleared lines
- Crossy Road game page
  - Endless procedurally generated lanes that recycle only after leaving the screen
  - Guaranteed connected island routes that prevent impossible tree-and-rock dead ends
  - Smooth forward camera pressure with a bottom danger edge for idle players
  - Continuous world progress and scoring without resetting the player to the middle
  - Tombstone traffic revival and automatic ghost rescue to a safe center island
  - Purchasable Skips character, a white cat with blue eyes
- Solitaire game page
  - Solver-verified winnable Draw-1 deals generated off the UI thread
  - Automatic tableau exposure, unlimited ordered stock redeals, complete hints, and card-state integrity checks
  - Seven fixed tableau columns that keep empty King destinations available
- Fruit Blend game page
  - Physics-based fruit drops and same-tier merging
  - Stable resting stacks that sleep instead of jittering under compression
  - Ten fruit sizes with mixed weighted drops, including banana and pineapple
  - Tier-scaled merge scoring with visible point popups and massive maximum-fruit clear bonuses
  - Upcoming-fruit card with a scaled preview and the fruit name
  - Maximum-fruit clears that disappear for escalating high-score bonuses
  - Overflow danger line, high scores, XP, coins, and achievements
  - Mouse, keyboard, and touch controls with rotating music
- Fruit Ninja game page
  - Six recognizable voxel fruit shapes built from shaded 3D cubes
  - Directional wall shadows that follow intact fruit and every flying fragment
  - Mouse and touch swipe slicing with a neon blade trail and dedicated cut sound
  - Increasing launch speed, a clear cannon pop for every gameplay fruit, multi-fruit waves, combos, three-miss survival, and instant-loss bombs
  - Full-screen bomb flash and fragment explosion before the shared result modal
  - Animated attract mode before Start Game, dedicated OGG soundtrack, XP, coins, high scores, and achievements
- Super Mario Kart ZX game page
  - Original srPerez and Nintendo intro, gamepad recommendation, animated title, music, menus, races, items, and GameMaker WebGL renderer
  - Automatic gamepad-screen advance when audio is available, with a compact Tap to Continue sound gate for iOS when a real gesture is required
  - Left-side immediate steering with hold-forward acceleration and pull-back native braking/reverse, while menu navigation remains separate from selection
  - Diagonal A/B jump-select and back-cancel buttons, plus a debounced center item slot with reliable one-press power-up use
  - Desktop keyboard and gamepad support retained from the original port, plus ARCADIA XP, coins, playtime, and an achievement
- Dev Mode Casper autopilot for ARCADIA's nine native games

## Visual Direction

The theme is based on dark arcade poster art, hot magenta, violet, purple, cyan, neon grid floors, subtle scanlines, and semi-transparent UI panels.

Fruit Ninja's custom ARCADIA canvas renderer is an original implementation inspired by Caleb Miller's open-source Menja cube-smashing prototype, including its tiny-renderer approach to shaded geometry, projected backboard shadows, swipe trails, and flying fragments.

Super Mario Kart ZX was created by srPerez and its web port was published by burnedpopcorn. ARCADIA includes the exact compiled port with the user's confirmed permission and adds only the surrounding launch, touch-control, responsive-layout, and progression integration. See `games/sm-kart-zx/ATTRIBUTION.md` for upstream links and details.

## Asset Folders

Place generated images in:

`assets/images/`

Place exported sound effects or music tracks in:

`assets/audio/`

Game soundtracks live in:

`assets/themesong/games/`

## Future Assets

1. App icon:
   `Square app icon for ARCADIA, premium 1980s retro arcade platform, glowing letter A monogram, black glass arcade frame, neon magenta purple cyan accents, subtle CRT scanlines, clean centered composition, no extra text`

2. Game library background:
   `Dark retro arcade game menu background, black and deep purple, neon magenta title glow, cyan and violet grid floor, pixel stars, premium 1980s arcade poster style, no readable text`

3. Snake game card:
   `Retro arcade game card art for Snake, glowing neon snake, black purple background, magenta and cyan arcade lighting, clean game library thumbnail, no copyrighted characters`

4. Rewards Store:
   `Arcade prize counter UI background, glowing coins, glowing reward shelves, magenta purple cyan lighting, modern clean retro arcade style, no readable text`
