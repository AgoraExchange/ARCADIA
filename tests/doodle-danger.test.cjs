const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const test = require('node:test');
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(__dirname, '../doodle-jump.js'), 'utf8'), sandbox);
const update = sandbox.window.ArcadiaDoodleJump.prototype.updateDanger;
const run = (score, dangerY = 896) => ({ score, landings: 100, dangerY, dangerActive: true, dangerIdleFrames: 0 });

test('consistent climbs survive floor pressure at and beyond the old 5500–6000 wall', () => {
  for (const score of [0, 5500, 6000, 12000, 100000]) {
    const state = run(score);
    // An 80-pixel climb each second, with ascent and descent between scrolls.
    for (let bounce = 0; bounce < 300; bounce++) {
      for (let frame = 0; frame < 60; frame++) {
        update.call(state, 1, frame < 10 ? 8 : 0);
        assert(state.dangerY > 840, `Floor entered the board at score ${score}`);
      }
    }
  }
});

test('springs restore clearance and clear stalled-progress pressure', () => {
  const state = run(6000, 520);
  state.dangerIdleFrames = 300;
  for (let frame = 0; frame < 30; frame++) update.call(state, 1, 10);
  assert(state.dangerY > 800);
  assert.equal(state.dangerIdleFrames, 0);
});

test('repeated bouncing without gaining height still gets caught', () => {
  const state = run(6000);
  for (let frame = 0; frame < 900; frame++) update.call(state, 1, 0);
  assert(state.dangerY < 400);
});

test('floor integration is consistent across frame steps', () => {
  const regular = run(6000, 650);
  const half = run(6000, 650);
  for (let frame = 0; frame < 60; frame++) update.call(regular, 1, 1);
  for (let frame = 0; frame < 120; frame++) update.call(half, 0.5, 0.5);
  assert(Math.abs(regular.dangerY - half.dangerY) < 0.001);
});
