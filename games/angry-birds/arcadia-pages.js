/* Fifteen missions per page, unlocked by completing the preceding page. */
(() => {
  'use strict';
  const selector = game.state.states['AngryBirds.LevelSelector'];
  const campaign = game.state.states['AngryBirds.SplashGame'];
  const play = game.state.states['AngryBirds.Game'];
  const pageCount = Math.ceil(window.ARCADIA_ANGRY_LEVEL_COUNT / 15);
  const chapters = ['Piggy Plains', 'Royal Rumble', 'Fortress Falls'];
  let selectedPage = null;
  const unlockedPage = () => Math.min(pageCount - 1, Math.floor(Number(campaign.getSolvedLevels()) / 15));
  const createButton = selector.createLevelButton;
  selector.createLevelButton = function (x, y, number, solved) {
    const level = Number(number) + selectedPage * 15;
    createButton.call(this, x, y, String(level), solved);
  };
  const originalCreate = selector.create;
  selector.create = function () {
    selectedPage = Math.min(selectedPage ?? unlockedPage(), unlockedPage());
    this.arcadiaPage = selectedPage;
    originalCreate.call(this);
    const chapter = game.add.text(391, 23, `CHAPTER ${selectedPage + 1}: ${chapters[selectedPage]}`,
      { font: 'bold 23px sans-serif', fill: '#fff4cb', stroke: '#442b17', strokeThickness: 4 });
    chapter.anchor.set(0.5);
    const label = game.add.bitmapText(340, 382, 'AngryBirdsFont', `PAGE ${selectedPage + 1} / ${pageCount}`, 22);
    label.x = 390 - label.width / 2;
    const arrow = (x, text, enabled, target) => {
      const button = game.add.graphics(x, 369);
      button.beginFill(enabled ? 0xf8c645 : 0x6b7280, enabled ? 1 : 0.45);
      button.drawRoundedRect(0, 0, 60, 52, 10);
      const glyph = game.add.bitmapText(x + 18, 376, 'AngryBirdsFont', text, 30);
      glyph.alpha = enabled ? 1 : 0.4;
      button.inputEnabled = enabled;
      if (enabled) button.events.onInputUp.add(() => {
        selectedPage = target;
        game.state.start('AngryBirds.LevelSelector', target > this.arcadiaPage
          ? Phaser.Plugin.StateTransition.Out.SlideLeft : Phaser.Plugin.StateTransition.Out.SlideRight);
      });
      return button;
    };
    this.arcadiaPreviousPage = arrow(235, '<', selectedPage > 0, selectedPage - 1);
    this.arcadiaNextPage = arrow(490, '>', selectedPage < unlockedPage(), selectedPage + 1);
    if (selectedPage + 1 < pageCount && selectedPage === unlockedPage()) {
      game.add.bitmapText(575, 379, 'AngryBirdsFont', `CLEAR ${15 * (selectedPage + 1)}\nFOR NEXT PAGE`, 16);
    }
  };
  const save = campaign.setSolvedLevels;
  campaign.setSolvedLevels = function (level) {
    const before = unlockedPage();
    save.call(this, level);
    if (unlockedPage() > before) selectedPage = unlockedPage();
  };
  const hasNext = play.nextLevelExists;
  play.nextLevelExists = function () {
    // Finish a page at the selector so the newly unlocked page is visible.
    return Number(GAME_LEVEL_SELECTED) % 15 !== 0 && hasNext.call(this);
  };
})();
