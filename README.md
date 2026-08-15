# ARCADIA

- Version 19.12.0.0 adds the animated level-75 Blackstorm Nameplate with moving storm clouds and circulating lightning.
- Version 19.11.1.0 makes the notification bell match the player's equipped nameplate, including animated RGB and Redline styles.
- Version 19.11.0.0 adds the notification inbox and the animated level-65 Galaxy Frog Crossy Road cosmetic.

ARCADIA is a modern 1980s-inspired arcade web app. Players enter a name, browse a clean game library, play eight arcade games, earn XP, collect coins, unlock achievements, and track progress from their player profile.

If you enjoy ARCADIA and would love to see more projects show me some support here https://ko-fi.com/agoraexchange .

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
- Dev Mode Casper autopilot for all eight games

## Visual Direction

The theme is based on dark arcade poster art, hot magenta, violet, purple, cyan, neon grid floors, subtle scanlines, and semi-transparent UI panels.

## Asset Folders

Place generated images in:

`assets/images/`

Place exported sound effects or music tracks in:

`assets/audio/`

## Future Assets

1. App icon:
   `Square app icon for ARCADIA, premium 1980s retro arcade platform, glowing letter A monogram, black glass arcade frame, neon magenta purple cyan accents, subtle CRT scanlines, clean centered composition, no extra text`

2. Game library background:
   `Dark retro arcade game menu background, black and deep purple, neon magenta title glow, cyan and violet grid floor, pixel stars, premium 1980s arcade poster style, no readable text`

3. Snake game card:
   `Retro arcade game card art for Snake, glowing neon snake, black purple background, magenta and cyan arcade lighting, clean game library thumbnail, no copyrighted characters`

4. Rewards Store:
   `Arcade prize counter UI background, glowing coins, glowing reward shelves, magenta purple cyan lighting, modern clean retro arcade style, no readable text`
