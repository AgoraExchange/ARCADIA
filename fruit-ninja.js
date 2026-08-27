(() => {
  "use strict";

  const TAU = Math.PI * 2;
  const CAMERA_Z = 860;
  const BACKBOARD_Z = -210;
  const GRAVITY = 690;
  // Light reaches the fruit from the upper-left/front. The matching cast
  // direction is down with only a slight rightward lean.
  const LIGHT = { x: 0.1, y: 0.42, z: -1.7 };
  const LIGHT_LENGTH = Math.hypot(LIGHT.x, LIGHT.y, LIGHT.z);
  const SHADOW_SCREEN_OFFSET = { x: 7, y: 38 };
  const FACE_DEFS = [
    { normal: { x: 0, y: 0, z: 1 }, corners: [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]] },
    { normal: { x: 0, y: 0, z: -1 }, corners: [[1, -1, -1], [-1, -1, -1], [-1, 1, -1], [1, 1, -1]] },
    { normal: { x: 1, y: 0, z: 0 }, corners: [[1, -1, 1], [1, -1, -1], [1, 1, -1], [1, 1, 1]] },
    { normal: { x: -1, y: 0, z: 0 }, corners: [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]] },
    { normal: { x: 0, y: 1, z: 0 }, corners: [[-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]] },
    { normal: { x: 0, y: -1, z: 0 }, corners: [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]] }
  ];

  const FRUIT_INFO = {
    apple: { label: "APPLE", points: 12, inside: "#ffd9bd" },
    strawberry: { label: "STRAWBERRY", points: 16, inside: "#ff9bb0" },
    watermelon: { label: "WATERMELON", points: 24, inside: "#ff4267" },
    banana: { label: "BANANA", points: 18, inside: "#fff4a7" },
    orange: { label: "ORANGE", points: 14, inside: "#ffd078" },
    pear: { label: "PEAR", points: 20, inside: "#efff9a" }
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const random = (min, max) => min + Math.random() * (max - min);
  const choose = (items) => items[Math.floor(Math.random() * items.length)];
  const cellKey = (x, y, z) => `${x},${y},${z}`;

  function hexToRgb(hex) {
    const value = String(hex).replace("#", "");
    const normalized = value.length === 3 ? value.split("").map((part) => part + part).join("") : value;
    const number = Number.parseInt(normalized, 16);
    return { r: (number >> 16) & 255, g: (number >> 8) & 255, b: number & 255 };
  }

  function shadeColor(hex, amount) {
    const { r, g, b } = hexToRgb(hex);
    const lift = amount >= 0 ? 255 : 0;
    const mix = Math.abs(amount);
    return `rgb(${Math.round(r + (lift - r) * mix)}, ${Math.round(g + (lift - g) * mix)}, ${Math.round(b + (lift - b) * mix)})`;
  }

  function rotatePoint(point, rotation) {
    let { x, y, z } = point;
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const yX = y * cosX - z * sinX;
    const zX = y * sinX + z * cosX;
    y = yX;
    z = zX;

    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);
    const xY = x * cosY + z * sinY;
    const zY = -x * sinY + z * cosY;
    x = xY;
    z = zY;

    const cosZ = Math.cos(rotation.z);
    const sinZ = Math.sin(rotation.z);
    return {
      x: x * cosZ - y * sinZ,
      y: x * sinZ + y * cosZ,
      z
    };
  }

  function convexHull(points) {
    if (points.length < 4) return points;
    const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
    const cross = (origin, a, b) => (a.x - origin.x) * (b.y - origin.y) - (a.y - origin.y) * (b.x - origin.x);
    const lower = [];
    sorted.forEach((point) => {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) lower.pop();
      lower.push(point);
    });
    const upper = [];
    for (let index = sorted.length - 1; index >= 0; index -= 1) {
      const point = sorted[index];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) upper.pop();
      upper.push(point);
    }
    lower.pop();
    upper.pop();
    return lower.concat(upper);
  }

  function makeModel(cells, cubeSize = 15) {
    const lookup = new Set(cells.map((cell) => cellKey(cell.x, cell.y, cell.z)));
    const directionKeys = [
      [0, 0, 1], [0, 0, -1], [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0]
    ];
    cells.forEach((cell) => {
      cell.faces = FACE_DEFS.map((face, index) => ({ ...face, hidden: lookup.has(cellKey(
        cell.x + directionKeys[index][0],
        cell.y + directionKeys[index][1],
        cell.z + directionKeys[index][2]
      )) }));
    });
    const radius = Math.max(...cells.map((cell) => Math.hypot(cell.x, cell.y, cell.z) * cubeSize + cubeSize));
    return { cells, cubeSize, radius };
  }

  function addEllipsoid(cells, options) {
    const { rx, ry, rz, offsetY = 0, color } = options;
    for (let x = Math.ceil(-rx); x <= Math.floor(rx); x += 1) {
      for (let y = Math.ceil(-ry); y <= Math.floor(ry); y += 1) {
        for (let z = Math.ceil(-rz); z <= Math.floor(rz); z += 1) {
          const normalized = (x * x) / (rx * rx) + (y * y) / (ry * ry) + (z * z) / (rz * rz);
          if (normalized > 1.08) continue;
          const resolvedColor = typeof color === "function" ? color(x, y, z, normalized) : color;
          cells.set(cellKey(x, y + offsetY, z), { x, y: y + offsetY, z, color: resolvedColor });
        }
      }
    }
  }

  function buildApple() {
    const cells = new Map();
    addEllipsoid(cells, {
      rx: 2.55, ry: 2.35, rz: 2.05,
      color: (x, y) => (x + y) % 4 === 0 ? "#ff315f" : "#e51648"
    });
    cells.set(cellKey(0, -3, 0), { x: 0, y: -3, z: 0, color: "#7b4529" });
    cells.set(cellKey(1, -3, 0), { x: 1, y: -3, z: 0, color: "#65d95b" });
    cells.set(cellKey(2, -3, 0), { x: 2, y: -3, z: 0, color: "#39a946" });
    return makeModel([...cells.values()], 15);
  }

  function buildStrawberry() {
    const cells = new Map();
    for (let y = -2; y <= 3; y += 1) {
      const width = y <= 0 ? 2.35 : Math.max(0.75, 2.35 - y * 0.48);
      const depth = Math.max(0.75, width * 0.75);
      for (let x = Math.ceil(-width); x <= Math.floor(width); x += 1) {
        for (let z = Math.ceil(-depth); z <= Math.floor(depth); z += 1) {
          if ((x * x) / (width * width) + (z * z) / (depth * depth) > 1.16) continue;
          const seed = (x * 3 + y * 5 + z * 7) % 9 === 0;
          cells.set(cellKey(x, y, z), { x, y, z, color: seed ? "#ffd35a" : y % 2 ? "#ff2d65" : "#e81f52" });
        }
      }
    }
    [-2, -1, 0, 1, 2].forEach((x) => cells.set(cellKey(x, -3, 0), { x, y: -3, z: 0, color: x % 2 ? "#4abf4d" : "#75e56d" }));
    return makeModel([...cells.values()], 13.5);
  }

  function buildWatermelon() {
    const cells = new Map();
    addEllipsoid(cells, {
      rx: 3.25, ry: 2.45, rz: 2.35,
      color: (x, y) => (Math.abs(x + y) % 3 === 0 ? "#b2ef48" : "#31ad58")
    });
    return makeModel([...cells.values()], 14);
  }

  function buildBanana() {
    const cells = new Map();
    const curve = [[-4, 1], [-3, 0], [-2, -1], [-1, -2], [0, -2], [1, -2], [2, -1], [3, 0], [4, 1]];
    curve.forEach(([x, y], index) => {
      [-1, 0, 1].forEach((z) => {
        cells.set(cellKey(x, y, z), { x, y, z, color: index === 0 || index === curve.length - 1 ? "#8e5b24" : index % 2 ? "#ffd72f" : "#f6bd18" });
      });
      if (index > 1 && index < curve.length - 2) cells.set(cellKey(x, y + 1, 0), { x, y: y + 1, z: 0, color: "#ffe65d" });
    });
    return makeModel([...cells.values()], 12.5);
  }

  function buildOrange() {
    const cells = new Map();
    addEllipsoid(cells, {
      rx: 2.25, ry: 2.25, rz: 2.15,
      color: (x, y, z) => (x + y + z) % 3 === 0 ? "#ffae22" : "#f37a20"
    });
    cells.set(cellKey(0, -3, 0), { x: 0, y: -3, z: 0, color: "#52c956" });
    cells.set(cellKey(1, -3, 0), { x: 1, y: -3, z: 0, color: "#78e46c" });
    return makeModel([...cells.values()], 14.5);
  }

  function buildPear() {
    const cells = new Map();
    addEllipsoid(cells, {
      rx: 2.4, ry: 2.55, rz: 2, offsetY: 1,
      color: (x, y) => (x + y) % 3 === 0 ? "#c9ed3e" : "#8ece35"
    });
    addEllipsoid(cells, { rx: 1.45, ry: 1.75, rz: 1.3, offsetY: -2, color: "#b5df39" });
    cells.set(cellKey(0, -4, 0), { x: 0, y: -4, z: 0, color: "#744528" });
    cells.set(cellKey(1, -4, 0), { x: 1, y: -4, z: 0, color: "#50bd4c" });
    return makeModel([...cells.values()], 13.5);
  }

  function buildBomb() {
    const cells = new Map();
    addEllipsoid(cells, {
      rx: 2.3, ry: 2.3, rz: 2.2,
      color: (x, y, z) => (x + y + z) % 3 === 0 ? "#2d3142" : "#11131d"
    });
    cells.set(cellKey(0, -3, 0), { x: 0, y: -3, z: 0, color: "#89735e" });
    cells.set(cellKey(0, -4, 0), { x: 0, y: -4, z: 0, color: "#ff5a37" });
    cells.set(cellKey(1, -4, 0), { x: 1, y: -4, z: 0, color: "#ffd35a" });
    return makeModel([...cells.values()], 14.5);
  }

  const MODELS = {
    apple: buildApple(),
    strawberry: buildStrawberry(),
    watermelon: buildWatermelon(),
    banana: buildBanana(),
    orange: buildOrange(),
    pear: buildPear(),
    bomb: buildBomb()
  };
  const FRUIT_NAMES = Object.keys(FRUIT_INFO);

  class ArcadiaFruitNinjaEngine {
    constructor(canvas, callbacks = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.callbacks = callbacks;
      this.mode = "stopped";
      this.raf = null;
      this.lastAt = 0;
      this.lastDrawAt = 0;
      this.elapsed = 0;
      this.spawnIn = 0;
      this.nextMinuteVolley = 60;
      this.minuteVolleyRemaining = 0;
      this.minuteVolleyIn = 0;
      this.nextSlowNanaAt = random(46, 58);
      this.slowMotionUntil = 0;
      this.slowMotionActive = false;
      this.entities = [];
      this.fragments = [];
      this.particles = [];
      this.trail = [];
      this.pointerDown = false;
      this.pointer = null;
      this.score = 0;
      this.sliced = 0;
      this.misses = 0;
      this.combo = 0;
      this.bestCombo = 0;
      this.comboBonusPoints = 0;
      this.survivalBonusPoints = 0;
      this.slowNanasSliced = 0;
      this.lastSliceAt = 0;
      this.explosionElapsed = 0;
      this.gameOverSent = false;
      this.previewIndex = 0;
      this.frame = this.frame.bind(this);
    }

    enterPreview() {
      this.resetCommon();
      this.mode = "preview";
      this.spawnIn = 0.25;
      this.entities.push(
        this.createEntity("apple", 120, 590, { vx: 62, vy: -520, preview: true }),
        this.createEntity("banana", 390, 470, { vx: -42, vy: -370, preview: true })
      );
      this.ensureLoop();
      this.emitStats();
    }

    start() {
      this.resetCommon();
      this.mode = "running";
      this.spawnIn = 0.15;
      this.ensureLoop();
      this.emitStats();
    }

    stop() {
      this.mode = "stopped";
      this.pointerDown = false;
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = null;
    }

    finish() {
      if (this.mode === "stopped" || this.mode === "ended") return;
      this.mode = "ended";
      this.pointerDown = false;
    }

    togglePause() {
      if (this.mode === "running") this.mode = "paused";
      else if (this.mode === "paused") {
        this.mode = "running";
        this.lastAt = performance.now();
      }
      return this.mode === "paused";
    }

    isRunning() {
      return ["running", "paused", "exploding"].includes(this.mode);
    }

    isPaused() {
      return this.mode === "paused";
    }

    getSnapshot() {
      return {
        score: this.score,
        sliced: this.sliced,
        misses: this.misses,
        combo: this.combo,
        bestCombo: this.bestCombo,
        comboBonusPoints: this.comboBonusPoints,
        survivalBonusPoints: this.survivalBonusPoints,
        slowNanasSliced: this.slowNanasSliced,
        slowMotionRemaining: this.slowMotionActive ? Math.max(0, (this.slowMotionUntil - performance.now()) / 1000) : 0,
        elapsed: this.elapsed
      };
    }

    pointFromEvent(event) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / Math.max(1, rect.width)) * this.canvas.width,
        y: ((event.clientY - rect.top) / Math.max(1, rect.height)) * this.canvas.height
      };
    }

    beginSlice(point) {
      if (this.mode !== "running") return;
      this.pointerDown = true;
      this.pointer = point;
      this.trail.push({ ...point, life: 0.18 });
    }

    moveSlice(point) {
      if (!this.pointerDown || this.mode !== "running" || !this.pointer) return;
      const from = this.pointer;
      const dx = point.x - from.x;
      const dy = point.y - from.y;
      const distance = Math.hypot(dx, dy);
      this.pointer = point;
      if (distance < 3) return;
      this.trail.push({ ...point, life: 0.18 });
      if (this.trail.length > 18) this.trail.shift();
      this.hitTestSegment(from, point, { x: dx / distance, y: dy / distance, speed: distance });
    }

    endSlice() {
      this.pointerDown = false;
      this.pointer = null;
    }

    autoSlice() {
      if (this.mode !== "running") return false;
      const index = this.entities.findIndex((entity) => entity.kind !== "bomb" && !entity.sliced && entity.y < this.canvas.height - 30);
      if (index < 0) return false;
      const entity = this.entities[index];
      const hit = this.project({ x: entity.x, y: entity.y, z: entity.z });
      const direction = Math.random() < 0.5
        ? { x: 0.82, y: -0.57, speed: 48 }
        : { x: -0.78, y: -0.63, speed: 48 };
      this.trail.push(
        { x: hit.x - direction.x * 64, y: hit.y - direction.y * 64, life: 0.18 },
        { x: hit.x + direction.x * 64, y: hit.y + direction.y * 64, life: 0.18 }
      );
      entity.sliced = true;
      this.sliceFruit(entity, direction, hit);
      this.entities.splice(index, 1);
      return true;
    }

    resetCommon() {
      this.elapsed = 0;
      this.nextMinuteVolley = 60;
      this.minuteVolleyRemaining = 0;
      this.minuteVolleyIn = 0;
      this.nextSlowNanaAt = random(46, 58);
      this.slowMotionUntil = 0;
      this.slowMotionActive = false;
      this.entities.length = 0;
      this.fragments.length = 0;
      this.particles.length = 0;
      this.trail.length = 0;
      this.pointerDown = false;
      this.pointer = null;
      this.score = 0;
      this.sliced = 0;
      this.misses = 0;
      this.combo = 0;
      this.bestCombo = 0;
      this.comboBonusPoints = 0;
      this.survivalBonusPoints = 0;
      this.slowNanasSliced = 0;
      this.lastSliceAt = 0;
      this.explosionElapsed = 0;
      this.gameOverSent = false;
      this.lastAt = performance.now();
    }

    ensureLoop() {
      if (this.raf) return;
      this.lastAt = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }

    frame(now) {
      this.raf = null;
      const dt = Math.min(0.034, Math.max(0.001, (now - this.lastAt) / 1000));
      this.lastAt = now;
      if (this.mode !== "stopped") {
        this.update(dt);
        if (now - this.lastDrawAt >= 1000 / 45) {
          this.lastDrawAt = now;
          this.draw();
        }
        this.raf = requestAnimationFrame(this.frame);
      }
    }

    update(dt) {
      const now = performance.now();
      if (this.slowMotionActive && now >= this.slowMotionUntil) {
        this.slowMotionActive = false;
        this.slowMotionUntil = 0;
        this.callbacks.onSlowMotionChange?.(false, 0);
      }
      const simulationDt = this.mode === "running" && this.slowMotionActive ? dt * 0.42 : dt;
      this.trail.forEach((point) => { point.life -= dt; });
      this.trail = this.trail.filter((point) => point.life > 0);
      this.updateFragments(simulationDt);
      this.updateParticles(simulationDt);
      if (this.mode === "paused" || this.mode === "ended") return;
      if (this.mode === "exploding") {
        this.explosionElapsed += dt;
        if (this.explosionElapsed >= 0.74 && !this.gameOverSent) {
          this.gameOverSent = true;
          this.mode = "ended";
          this.callbacks.onGameOver?.("bomb", this.getSnapshot());
        }
        return;
      }

      this.elapsed += dt;
      if (this.mode === "running" && this.elapsed >= this.nextSlowNanaAt) this.maybeSpawnSlowMotionBanana();
      if (this.mode === "running" && this.elapsed >= this.nextMinuteVolley) {
        this.minuteVolleyRemaining += 5;
        this.minuteVolleyIn = 0;
        this.nextMinuteVolley += 60;
      }
      if (this.mode === "running" && this.minuteVolleyRemaining > 0) {
        this.minuteVolleyIn -= simulationDt;
        if (this.minuteVolleyIn <= 0) this.spawnMinuteVolleyFruit();
      } else {
        this.spawnIn -= simulationDt;
        if (this.spawnIn <= 0) {
          if (this.mode === "preview") this.spawnPreviewFruit();
          else this.spawnWave();
        }
      }
      this.updateEntities(simulationDt);
      const comboGrace = this.slowMotionActive ? 1800 : 900;
      if (this.mode === "running" && this.lastSliceAt && now - this.lastSliceAt > comboGrace) this.combo = 0;
    }

    createEntity(kind, x, y, overrides = {}) {
      const model = MODELS[kind];
      return {
        kind,
        model,
        x,
        y,
        z: overrides.z ?? random(-30, 110),
        vx: overrides.vx ?? random(-125, 125),
        vy: overrides.vy ?? random(-900, -770),
        vz: overrides.vz ?? random(-55, 65),
        rotation: { x: random(0, TAU), y: random(0, TAU), z: random(0, TAU) },
        spin: { x: random(-1.8, 1.8), y: random(-2.2, 2.2), z: random(-2.6, 2.6) },
        scale: overrides.scale ?? 1,
        preview: Boolean(overrides.preview),
        powerUp: overrides.powerUp || "",
        fuseSeed: random(0, TAU),
        sliced: false
      };
    }

    spawnPreviewFruit() {
      const kind = FRUIT_NAMES[this.previewIndex % FRUIT_NAMES.length];
      this.previewIndex += 1;
      const fromLeft = this.previewIndex % 2 === 0;
      this.entities.push(this.createEntity(kind, random(80, 460), this.canvas.height + 80, {
        vx: fromLeft ? random(25, 95) : random(-95, -25),
        vy: random(-810, -690),
        preview: true
      }));
      this.spawnIn = random(0.7, 1.05);
    }

    spawnWave() {
      const difficulty = 1 + this.elapsed / 30;
      let count = 1;
      if (Math.random() < clamp((difficulty - 1) * 0.34, 0, 0.78)) count += 1;
      if (Math.random() < clamp((difficulty - 2) * 0.2, 0, 0.5)) count += 1;
      count = Math.min(4, count);
      const bombChance = clamp(0.045 + this.elapsed / 520, 0.045, 0.16);
      for (let index = 0; index < count; index += 1) {
        const kind = Math.random() < bombChance ? "bomb" : choose(FRUIT_NAMES);
        const laneWidth = (this.canvas.width - 120) / count;
        const x = 60 + laneWidth * index + random(18, Math.max(24, laneWidth - 18));
        const centerPull = (this.canvas.width / 2 - x) * random(0.18, 0.34);
        this.entities.push(this.createEntity(kind, x, this.canvas.height + 80 + index * 12, {
          vx: centerPull + random(-70, 70),
          vy: random(-930, -790) - Math.min(90, this.elapsed * 1.2),
          vz: random(-45, 85)
        }));
        this.callbacks.onLaunch?.(kind, { waveIndex: index, minuteVolley: false });
      }
      this.spawnIn = clamp(0.94 - this.elapsed * 0.009, 0.28, 0.94) + random(-0.07, 0.11);
    }

    spawnMinuteVolleyFruit() {
      const launchIndex = 5 - Math.min(5, this.minuteVolleyRemaining);
      const lanes = [78, 174, 270, 366, 462];
      const x = lanes[launchIndex] + random(-17, 17);
      const kind = choose(FRUIT_NAMES);
      const centerPull = (this.canvas.width / 2 - x) * random(0.2, 0.32);
      this.entities.push(this.createEntity(kind, x, this.canvas.height + 82, {
        vx: centerPull + random(-48, 48),
        vy: random(-990, -895) - Math.min(105, this.elapsed * 0.9),
        vz: random(-35, 90)
      }));
      this.callbacks.onLaunch?.(kind, { waveIndex: launchIndex, minuteVolley: true });
      this.minuteVolleyRemaining -= 1;
      this.minuteVolleyIn = this.minuteVolleyRemaining > 0 ? 0.13 : 0;
      if (this.minuteVolleyRemaining <= 0) {
        this.spawnIn = Math.max(this.spawnIn, 0.42);
      }
    }

    maybeSpawnSlowMotionBanana() {
      const doingWell = this.elapsed >= 45
        && this.score >= 450 + this.elapsed * 4
        && this.sliced >= 18 + this.elapsed * 0.12
        && this.misses <= 1;
      const powerUpOnBoard = this.entities.some((entity) => entity.powerUp === "slow");
      if (!doingWell || this.slowMotionActive || powerUpOnBoard) {
        this.nextSlowNanaAt = this.elapsed + 7;
        return;
      }

      const x = random(105, this.canvas.width - 105);
      const centerPull = (this.canvas.width / 2 - x) * random(0.22, 0.34);
      this.entities.push(this.createEntity("banana", x, this.canvas.height + 84, {
        vx: centerPull + random(-48, 48),
        vy: random(-985, -895) - Math.min(100, this.elapsed),
        vz: random(25, 105),
        powerUp: "slow"
      }));
      this.callbacks.onLaunch?.("banana", { waveIndex: 0, minuteVolley: false, powerUp: "slow" });
      this.callbacks.onPowerUpSpawn?.("slow");
      this.spawnIn = Math.max(this.spawnIn, 0.5);
      this.nextSlowNanaAt = this.elapsed + random(55, 78);
    }

    activateSlowMotion(seconds = 6) {
      const duration = Math.max(1, Number(seconds) || 6);
      this.slowMotionUntil = performance.now() + duration * 1000;
      this.slowMotionActive = true;
      this.callbacks.onSlowMotionChange?.(true, duration);
    }

    updateEntities(dt) {
      for (let index = this.entities.length - 1; index >= 0; index -= 1) {
        const entity = this.entities[index];
        entity.x += entity.vx * dt;
        entity.y += entity.vy * dt;
        entity.z += entity.vz * dt;
        entity.vy += GRAVITY * dt;
        entity.rotation.x += entity.spin.x * dt;
        entity.rotation.y += entity.spin.y * dt;
        entity.rotation.z += entity.spin.z * dt;
        if (entity.x < 28) {
          entity.x = 28;
          entity.vx = Math.abs(entity.vx) * 0.7;
        } else if (entity.x > this.canvas.width - 28) {
          entity.x = this.canvas.width - 28;
          entity.vx = -Math.abs(entity.vx) * 0.7;
        }
        if (entity.y <= this.canvas.height + 135 || entity.vy <= 0) continue;
        this.entities.splice(index, 1);
        if (this.mode === "running" && entity.kind !== "bomb" && !entity.powerUp) {
          this.misses += 1;
          this.combo = 0;
          this.callbacks.onMiss?.(this.misses);
          this.emitStats();
          if (this.misses >= 3 && !this.gameOverSent) {
            this.gameOverSent = true;
            this.mode = "ended";
            this.callbacks.onGameOver?.("miss", this.getSnapshot());
          }
        }
      }
    }

    hitTestSegment(from, to, direction) {
      for (let index = this.entities.length - 1; index >= 0; index -= 1) {
        const entity = this.entities[index];
        if (entity.sliced) continue;
        const projected = this.project({ x: entity.x, y: entity.y, z: entity.z });
        const scale = CAMERA_Z / Math.max(180, CAMERA_Z - entity.z);
        const radius = entity.model.radius * scale * 0.76;
        const distance = this.distanceToSegment(projected, from, to);
        if (distance > radius) continue;
        entity.sliced = true;
        const hit = {
          x: clamp(projected.x, 0, this.canvas.width),
          y: clamp(projected.y, 0, this.canvas.height)
        };
        if (entity.kind === "bomb") {
          this.triggerBomb(entity, direction, hit);
          return;
        }
        this.sliceFruit(entity, direction, hit);
        this.entities.splice(index, 1);
      }
    }

    distanceToSegment(point, from, to) {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const lengthSq = dx * dx + dy * dy || 1;
      const mix = clamp(((point.x - from.x) * dx + (point.y - from.y) * dy) / lengthSq, 0, 1);
      return Math.hypot(point.x - (from.x + dx * mix), point.y - (from.y + dy * mix));
    }

    sliceFruit(entity, direction, hit) {
      const now = performance.now();
      const comboWindow = this.slowMotionActive ? 1550 : 780;
      this.combo = now - this.lastSliceAt <= comboWindow ? this.combo + 1 : 1;
      this.lastSliceAt = now;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      this.sliced += 1;
      const info = FRUIT_INFO[entity.kind];
      const comboBonus = this.combo >= 5 && this.combo % 5 === 0 ? 100 : 0;
      const survivalBonus = Math.min(80, Math.floor(this.elapsed / 30) * 5);
      const powerUpBonus = entity.powerUp === "slow" ? 50 : 0;
      const earned = info.points + Math.min(30, (this.combo - 1) * 3) + comboBonus + survivalBonus + powerUpBonus;
      this.comboBonusPoints += comboBonus;
      this.survivalBonusPoints += survivalBonus;
      this.score += earned;
      this.createFragments(entity, direction, info.inside);
      this.createJuiceBurst(hit, info.inside, direction, 24);
      this.callbacks.onSlice?.(entity.kind, earned, this.combo, comboBonus, { survivalBonus, powerUpBonus, powerUp: entity.powerUp });
      if (entity.powerUp === "slow") {
        this.slowNanasSliced += 1;
        this.activateSlowMotion(6);
        this.callbacks.onPowerUp?.("slow", 6);
      }
      this.emitStats();
    }

    createFragments(entity, direction, insideColor) {
      const size = entity.model.cubeSize;
      const maxFragments = 34;
      const fragmentStep = Math.max(1, Math.ceil(entity.model.cells.length / maxFragments));
      entity.model.cells.forEach((cell, index) => {
        if (index % fragmentStep !== 0) return;
        const local = rotatePoint({ x: cell.x * size, y: cell.y * size, z: cell.z * size }, entity.rotation);
        const outwardLength = Math.hypot(local.x, local.y) || 1;
        const side = local.x * -direction.y + local.y * direction.x >= 0 ? 1 : -1;
        this.fragments.push({
          x: entity.x + local.x,
          y: entity.y + local.y,
          z: entity.z + local.z,
          vx: entity.vx * 0.42 + direction.x * random(85, 220) + (local.x / outwardLength) * random(20, 95),
          vy: entity.vy * 0.2 + direction.y * random(75, 190) + (local.y / outwardLength) * random(20, 85) - random(15, 100),
          vz: entity.vz + side * random(75, 185),
          rotation: { x: random(0, TAU), y: random(0, TAU), z: random(0, TAU) },
          spin: { x: random(-5, 5), y: random(-5, 5), z: random(-6, 6) },
          size: size * random(0.72, 0.98),
          color: index % 4 === 0 ? cell.color : insideColor,
          life: random(1.6, 2.5)
        });
      });
      if (this.fragments.length > 150) this.fragments.splice(0, this.fragments.length - 150);
    }

    createJuiceBurst(hit, color, direction, count) {
      for (let index = 0; index < count; index += 1) {
        const angle = Math.atan2(direction.y, direction.x) + random(-1.7, 1.7);
        const speed = random(70, 310);
        this.particles.push({
          x: hit.x,
          y: hit.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: random(2, 7),
          color,
          life: random(0.35, 0.8),
          maxLife: 0.8
        });
      }
    }

    triggerBomb(entity, direction, hit) {
      this.mode = "exploding";
      this.explosionElapsed = 0;
      this.pointerDown = false;
      this.entities = this.entities.filter((item) => item !== entity);
      this.createFragments(entity, direction, "#ff6b32");
      ["#fff7c2", "#ffd35a", "#ff7b2f", "#ff2f62", "#8b5cff"].forEach((color, colorIndex) => {
        this.createJuiceBurst(hit, color, { x: Math.cos(colorIndex * 1.21), y: Math.sin(colorIndex * 1.21) }, 24);
      });
      this.callbacks.onBomb?.(hit);
    }

    updateFragments(dt) {
      for (let index = this.fragments.length - 1; index >= 0; index -= 1) {
        const fragment = this.fragments[index];
        fragment.x += fragment.vx * dt;
        fragment.y += fragment.vy * dt;
        fragment.z += fragment.vz * dt;
        fragment.vy += GRAVITY * dt;
        fragment.vx *= Math.pow(0.985, dt * 60);
        fragment.vz *= Math.pow(0.985, dt * 60);
        fragment.rotation.x += fragment.spin.x * dt;
        fragment.rotation.y += fragment.spin.y * dt;
        fragment.rotation.z += fragment.spin.z * dt;
        fragment.life -= dt;
        if (fragment.life <= 0 || fragment.y > this.canvas.height + 180) this.fragments.splice(index, 1);
      }
    }

    updateParticles(dt) {
      for (let index = this.particles.length - 1; index >= 0; index -= 1) {
        const particle = this.particles[index];
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.vy += GRAVITY * 0.55 * dt;
        particle.vx *= Math.pow(0.97, dt * 60);
        particle.life -= dt;
        if (particle.life <= 0) this.particles.splice(index, 1);
      }
    }

    emitStats() {
      this.callbacks.onStats?.(this.getSnapshot());
    }

    project(point) {
      const scale = CAMERA_Z / Math.max(140, CAMERA_Z - point.z);
      return {
        x: this.canvas.width / 2 + (point.x - this.canvas.width / 2) * scale,
        y: this.canvas.height / 2 + (point.y - this.canvas.height / 2) * scale,
        scale
      };
    }

    worldPoint(entity, cell, corner) {
      const half = entity.model.cubeSize * 0.5;
      const local = {
        x: cell.x * entity.model.cubeSize + corner[0] * half,
        y: cell.y * entity.model.cubeSize + corner[1] * half,
        z: cell.z * entity.model.cubeSize + corner[2] * half
      };
      const rotated = rotatePoint(local, entity.rotation);
      return { x: entity.x + rotated.x, y: entity.y + rotated.y, z: entity.z + rotated.z };
    }

    fragmentWorldPoint(fragment, corner) {
      const half = fragment.size * 0.5;
      const rotated = rotatePoint({ x: corner[0] * half, y: corner[1] * half, z: corner[2] * half }, fragment.rotation);
      return { x: fragment.x + rotated.x, y: fragment.y + rotated.y, z: fragment.z + rotated.z };
    }

    shadowPoint(world) {
      const projected = this.project(world);
      // A screen-space final offset avoids perspective pulling shadows toward
      // the canvas center at its edges. Greater Z separation still increases
      // the cast distance, so fruit nearer the player throw longer shadows.
      const separation = clamp((world.z - BACKBOARD_Z) / 320, 0.35, 1.2);
      return {
        x: projected.x + SHADOW_SCREEN_OFFSET.x * separation,
        y: projected.y + SHADOW_SCREEN_OFFSET.y * separation
      };
    }

    draw() {
      const ctx = this.ctx;
      const width = this.canvas.width;
      const height = this.canvas.height;
      ctx.clearRect(0, 0, width, height);
      this.drawBackboard();
      this.drawShadows();

      const faces = [];
      this.entities.forEach((entity) => this.collectEntityFaces(entity, faces));
      this.fragments.forEach((fragment) => this.collectFragmentFaces(fragment, faces));
      faces.sort((a, b) => a.depth - b.depth);
      ctx.lineJoin = "bevel";
      faces.forEach((face) => {
        ctx.beginPath();
        face.points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
        ctx.closePath();
        ctx.fillStyle = face.color;
        ctx.fill();
        ctx.strokeStyle = face.stroke;
        ctx.lineWidth = 0.65;
        ctx.stroke();
      });

      this.drawPowerUpWarnings();
      this.drawBombWarnings();
      this.drawParticles();
      this.drawTrail();
      this.drawSlowMotionStatus();
      this.drawOverlay();
    }

    drawBackboard() {
      const ctx = this.ctx;
      const width = this.canvas.width;
      const height = this.canvas.height;
      const gradient = ctx.createRadialGradient(width * 0.22, height * 0.08, 20, width * 0.5, height * 0.45, height * 0.85);
      gradient.addColorStop(0, "#33285a");
      gradient.addColorStop(0.42, "#17142f");
      gradient.addColorStop(1, "#070611");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(178, 161, 255, 0.075)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= width; x += 54) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += 54) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const floorGlow = ctx.createLinearGradient(0, height * 0.72, 0, height);
      floorGlow.addColorStop(0, "rgba(255, 47, 173, 0)");
      floorGlow.addColorStop(1, "rgba(255, 47, 173, 0.12)");
      ctx.fillStyle = floorGlow;
      ctx.fillRect(0, height * 0.72, width, height * 0.28);
    }

    drawShadows() {
      const ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 8;
      this.entities.forEach((entity) => {
        const silhouette = entity.model.cells.map((cell) => this.shadowPoint(this.worldPoint(entity, cell, [0, 0, 0])));
        ctx.lineWidth = entity.model.cubeSize * 0.8;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.34)";
        this.fillHull(convexHull(silhouette), true);
      });
      this.fragments.forEach((fragment) => {
        const corners = [];
        [-1, 1].forEach((x) => [-1, 1].forEach((y) => [-1, 1].forEach((z) => {
          corners.push(this.shadowPoint(this.fragmentWorldPoint(fragment, [x, y, z])));
        })));
        this.fillHull(convexHull(corners));
      });
      ctx.restore();
    }

    fillHull(points, stroke = false) {
      if (!points.length) return;
      const ctx = this.ctx;
      ctx.beginPath();
      points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
      ctx.closePath();
      ctx.fill();
      if (stroke) ctx.stroke();
    }

    collectEntityFaces(entity, output) {
      entity.model.cells.forEach((cell) => {
        cell.faces.forEach((face) => {
          if (face.hidden) return;
          const worldPoints = face.corners.map((corner) => this.worldPoint(entity, cell, corner));
          const center = worldPoints.reduce((sum, point) => ({ x: sum.x + point.x / 4, y: sum.y + point.y / 4, z: sum.z + point.z / 4 }), { x: 0, y: 0, z: 0 });
          const normal = rotatePoint(face.normal, entity.rotation);
          const view = { x: this.canvas.width / 2 - center.x, y: this.canvas.height / 2 - center.y, z: CAMERA_Z - center.z };
          if (normal.x * view.x + normal.y * view.y + normal.z * view.z <= 0) return;
          const lightDot = clamp((-normal.x * LIGHT.x - normal.y * LIGHT.y - normal.z * LIGHT.z) / LIGHT_LENGTH, -1, 1);
          const lightness = clamp(-0.24 + (lightDot + 1) * 0.27, -0.26, 0.3);
          output.push({
            points: worldPoints.map((point) => this.project(point)),
            depth: center.z,
            color: shadeColor(cell.color, lightness),
            stroke: shadeColor(cell.color, -0.34)
          });
        });
      });
    }

    collectFragmentFaces(fragment, output) {
      FACE_DEFS.forEach((face) => {
        const worldPoints = face.corners.map((corner) => this.fragmentWorldPoint(fragment, corner));
        const center = worldPoints.reduce((sum, point) => ({ x: sum.x + point.x / 4, y: sum.y + point.y / 4, z: sum.z + point.z / 4 }), { x: 0, y: 0, z: 0 });
        const normal = rotatePoint(face.normal, fragment.rotation);
        const view = { x: this.canvas.width / 2 - center.x, y: this.canvas.height / 2 - center.y, z: CAMERA_Z - center.z };
        if (normal.x * view.x + normal.y * view.y + normal.z * view.z <= 0) return;
        const lightDot = clamp((-normal.x * LIGHT.x - normal.y * LIGHT.y - normal.z * LIGHT.z) / LIGHT_LENGTH, -1, 1);
        output.push({
          points: worldPoints.map((point) => this.project(point)),
          depth: center.z,
          color: shadeColor(fragment.color, clamp(-0.23 + (lightDot + 1) * 0.26, -0.25, 0.28)),
          stroke: shadeColor(fragment.color, -0.36)
        });
      });
    }

    drawPowerUpWarnings() {
      const ctx = this.ctx;
      const now = performance.now();
      this.entities.forEach((entity) => {
        if (entity.powerUp !== "slow" || entity.sliced) return;
        const outlinePoints = [];
        entity.model.cells.forEach((cell) => {
          [-1, 1].forEach((x) => [-1, 1].forEach((y) => [-1, 1].forEach((z) => {
            outlinePoints.push(this.project(this.worldPoint(entity, cell, [x, y, z])));
          })));
        });
        const hull = convexHull(outlinePoints);
        if (hull.length < 3) return;
        const center = this.project({ x: entity.x, y: entity.y, z: entity.z });
        const pulse = 0.5 + Math.sin(now * 0.012 + entity.fuseSeed) * 0.5;
        const top = Math.min(...hull.map((point) => point.y));

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.lineJoin = "round";
        ctx.shadowColor = "#36cfff";
        ctx.shadowBlur = 16 + pulse * 16;
        ctx.strokeStyle = `rgba(60, 198, 255, ${0.52 + pulse * 0.3})`;
        ctx.lineWidth = 6 + pulse * 3;
        ctx.beginPath();
        hull.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
        ctx.closePath();
        ctx.stroke();

        const sweep = ctx.createLinearGradient(center.x - 90, center.y - 70, center.x + 90, center.y + 70);
        sweep.addColorStop(0, "#1b68ff");
        sweep.addColorStop(0.5, "#bdf8ff");
        sweep.addColorStop(1, "#35d9ff");
        ctx.strokeStyle = sweep;
        ctx.lineWidth = 2.6 + pulse * 1.8;
        ctx.setLineDash([18, 28]);
        ctx.lineDashOffset = -now * 0.075;
        ctx.stroke();
        ctx.setLineDash([]);

        for (let index = 0; index < 6; index += 1) {
          const angle = now * 0.0022 + entity.fuseSeed + index * TAU / 6;
          const radiusX = entity.model.radius * center.scale * 0.78;
          const radiusY = entity.model.radius * center.scale * 0.48;
          const moteSize = 2.5 + (index % 2) * 1.7 + pulse;
          ctx.fillStyle = index % 2 ? "#ffffff" : "#42d8ff";
          ctx.fillRect(
            center.x + Math.cos(angle) * radiusX - moteSize / 2,
            center.y + Math.sin(angle) * radiusY - moteSize / 2,
            moteSize,
            moteSize
          );
        }
        ctx.restore();

        ctx.save();
        ctx.textAlign = "center";
        ctx.fillStyle = "#bdf8ff";
        ctx.shadowColor = "#239cff";
        ctx.shadowBlur = 10;
        ctx.font = "bold 14px 'Orange Kid', monospace";
        ctx.fillText("SLOW NANA", center.x, top - 12);
        ctx.restore();
      });
    }

    drawBombWarnings() {
      const ctx = this.ctx;
      const now = performance.now();
      this.entities.forEach((entity) => {
        if (entity.kind !== "bomb" || entity.sliced) return;
        const size = entity.model.cubeSize;
        const toWorld = (point) => {
          const rotated = rotatePoint(point, entity.rotation);
          return { x: entity.x + rotated.x, y: entity.y + rotated.y, z: entity.z + rotated.z };
        };
        const center = this.project({ x: entity.x, y: entity.y, z: entity.z });
        const fuseBase = this.project(toWorld({ x: 0, y: -size * 3.15, z: 0 }));
        const fuseTip = this.project(toWorld({ x: size * 1.05, y: -size * 4.45, z: 0 }));
        const pulse = 0.5 + Math.sin(now * 0.018 + entity.fuseSeed) * 0.5;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = "#ff9a3d";
        ctx.lineWidth = Math.max(3, 5 * center.scale);
        ctx.shadowColor = "#ff572d";
        ctx.shadowBlur = 11;
        ctx.beginPath();
        ctx.moveTo(fuseBase.x, fuseBase.y);
        ctx.quadraticCurveTo(
          (fuseBase.x + fuseTip.x) / 2 + Math.sin(now * 0.012 + entity.fuseSeed) * 5,
          Math.min(fuseBase.y, fuseTip.y) - 6,
          fuseTip.x,
          fuseTip.y
        );
        ctx.stroke();

        const flameRadius = (10 + pulse * 7) * center.scale;
        const flame = ctx.createRadialGradient(fuseTip.x, fuseTip.y, 0, fuseTip.x, fuseTip.y, flameRadius * 2.1);
        flame.addColorStop(0, "rgba(255,255,244,1)");
        flame.addColorStop(0.2, "rgba(255,239,118,0.98)");
        flame.addColorStop(0.48, "rgba(255,112,38,0.9)");
        flame.addColorStop(1, "rgba(255,47,98,0)");
        ctx.fillStyle = flame;
        ctx.beginPath();
        ctx.arc(fuseTip.x, fuseTip.y, flameRadius * 2.1, 0, TAU);
        ctx.fill();

        for (let index = 0; index < 12; index += 1) {
          const cycle = (now / (420 + index * 19) + index * 0.173 + entity.fuseSeed / TAU) % 1;
          const angle = entity.fuseSeed + index * 2.37 + Math.sin(now * 0.009 + index) * 0.55;
          const distance = (7 + cycle * 31) * center.scale;
          const sparkX = fuseTip.x + Math.cos(angle) * distance;
          const sparkY = fuseTip.y + Math.sin(angle) * distance - cycle * 11;
          const sparkSize = Math.max(1.5, (5.2 - cycle * 3.5) * center.scale);
          ctx.globalAlpha = 1 - cycle;
          const sparkColor = index % 3 === 0 ? "#ffffff" : index % 2 === 0 ? "#ffd35a" : "#ff6a2d";
          ctx.strokeStyle = sparkColor;
          ctx.lineWidth = Math.max(1.2, sparkSize * 0.72);
          ctx.beginPath();
          ctx.moveTo(sparkX - Math.cos(angle) * sparkSize * 2.8, sparkY - Math.sin(angle) * sparkSize * 2.8);
          ctx.lineTo(sparkX, sparkY);
          ctx.stroke();
          ctx.fillStyle = sparkColor;
          ctx.fillRect(sparkX - sparkSize / 2, sparkY - sparkSize / 2, sparkSize, sparkSize);
        }
        ctx.restore();

        ctx.save();
        for (let index = 0; index < 3; index += 1) {
          const cycle = (now / 1450 + index * 0.31 + entity.fuseSeed / TAU) % 1;
          const smokeSize = (4 + cycle * 10) * center.scale;
          ctx.globalAlpha = (1 - cycle) * 0.32;
          ctx.fillStyle = "#c8bfd4";
          ctx.beginPath();
          ctx.arc(
            fuseTip.x + Math.sin(entity.fuseSeed + index * 2.1) * cycle * 8,
            fuseTip.y - 8 - cycle * 28,
            smokeSize,
            0,
            TAU
          );
          ctx.fill();
        }
        ctx.restore();
      });
    }

    drawParticles() {
      const ctx = this.ctx;
      this.particles.forEach((particle) => {
        ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
      });
      ctx.globalAlpha = 1;
    }

    drawTrail() {
      if (this.trail.length < 2) return;
      const ctx = this.ctx;
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const gradient = ctx.createLinearGradient(
        this.trail[0].x, this.trail[0].y,
        this.trail[this.trail.length - 1].x, this.trail[this.trail.length - 1].y
      );
      gradient.addColorStop(0, "rgba(255, 47, 173, 0)");
      gradient.addColorStop(0.35, "rgba(255, 47, 173, 0.85)");
      gradient.addColorStop(0.72, "rgba(73, 244, 255, 0.96)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0.98)");
      ctx.strokeStyle = gradient;
      ctx.shadowColor = "#49f4ff";
      ctx.shadowBlur = 18;
      ctx.lineWidth = 10;
      ctx.beginPath();
      this.trail.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
      ctx.stroke();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.shadowBlur = 6;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
    }

    drawSlowMotionStatus() {
      if (this.mode !== "running" || !this.slowMotionActive) return;
      const ctx = this.ctx;
      const width = this.canvas.width;
      const height = this.canvas.height;
      const remaining = Math.max(0, (this.slowMotionUntil - performance.now()) / 1000);
      const pulse = 0.5 + Math.sin(performance.now() * 0.01) * 0.5;
      ctx.save();
      ctx.strokeStyle = `rgba(55, 210, 255, ${0.35 + pulse * 0.28})`;
      ctx.shadowColor = "#2d9dff";
      ctx.shadowBlur = 18 + pulse * 10;
      ctx.lineWidth = 7;
      ctx.strokeRect(5, 5, width - 10, height - 10);
      ctx.textAlign = "left";
      ctx.fillStyle = "#bdf8ff";
      ctx.shadowBlur = 9;
      ctx.font = "bold 18px 'Orange Kid', monospace";
      ctx.fillText(`SLOW NANA ${remaining.toFixed(1)}s`, 18, 30);
      ctx.restore();
    }

    drawOverlay() {
      const ctx = this.ctx;
      const width = this.canvas.width;
      const height = this.canvas.height;
      if (this.mode === "preview") {
        const shade = ctx.createLinearGradient(0, 0, 0, 210);
        shade.addColorStop(0, "rgba(5, 3, 16, 0.84)");
        shade.addColorStop(1, "rgba(5, 3, 16, 0)");
        ctx.fillStyle = shade;
        ctx.fillRect(0, 0, width, 230);
        ctx.save();
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff7d6";
        ctx.shadowColor = "#ff2fad";
        ctx.shadowBlur = 18;
        ctx.font = "64px 'Game Paused', 'Arial Black', sans-serif";
        ctx.fillText("FRUIT NINJA", width / 2, 92);
        ctx.shadowBlur = 9;
        ctx.fillStyle = "#8cf7ff";
        ctx.font = "bold 18px 'Orange Kid', monospace";
        ctx.fillText("SLICE FRUIT. AVOID BOMBS.", width / 2, 132);
        ctx.restore();
      }

      if (this.mode === "paused") {
        ctx.fillStyle = "rgba(5, 3, 16, 0.72)";
        ctx.fillRect(0, 0, width, height);
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = "54px 'Game Paused', 'Arial Black', sans-serif";
        ctx.fillText("PAUSED", width / 2, height / 2);
      }

      if (this.mode === "exploding") {
        const strength = clamp(1 - this.explosionElapsed / 0.74, 0, 1);
        const radius = 80 + this.explosionElapsed * 780;
        const glow = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, radius);
        glow.addColorStop(0, `rgba(255,255,238,${0.98 * strength})`);
        glow.addColorStop(0.18, `rgba(255,211,90,${0.92 * strength})`);
        glow.addColorStop(0.5, `rgba(255,71,45,${0.74 * strength})`);
        glow.addColorStop(1, "rgba(255,31,82,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, 0.72 - this.explosionElapsed * 2.2)})`;
        ctx.fillRect(0, 0, width, height);
      }

      if (this.mode === "running") {
        ctx.textAlign = "right";
        ctx.font = "bold 18px 'Orange Kid', monospace";
        ctx.fillStyle = this.misses ? "#ff8a9d" : "rgba(255,255,255,0.42)";
        ctx.fillText(`LIVES ${3 - this.misses}/3`, width - 18, 30);
      }
    }
  }

  window.ArcadiaFruitNinjaEngine = ArcadiaFruitNinjaEngine;
})();
