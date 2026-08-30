(() => {
  "use strict";

  const WIDTH = 540;
  const HEIGHT = 840;
  const PLAYER_WIDTH = 58;
  const PLAYER_HEIGHT = 64;
  const GRAVITY = 0.43;
  const BOUNCE_SPEED = -12.25;
  const SPRING_SPEED = -17.2;
  const CAMERA_LINE = 330;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const randomBetween = (min, max) => min + Math.random() * (max - min);

  class ArcadiaDoodleJump {
    constructor(options = {}) {
      this.canvas = options.canvas;
      this.ctx = this.canvas?.getContext("2d") || null;
      this.onScore = options.onScore || (() => {});
      this.onGameOver = options.onGameOver || (() => {});
      this.onSound = options.onSound || (() => {});
      this.onState = options.onState || (() => {});
      this.mode = "idle";
      this.active = false;
      this.frame = 0;
      this.lastTime = 0;
      this.previewStartedAt = 0;
      this.pointerId = null;
      this.pointerTargetX = null;
      this.keys = { left: false, right: false };
      this.platforms = [];
      this.particles = [];
      this.player = null;
      this.score = 0;
      this.climbed = 0;
      this.landings = 0;
      this.springs = 0;
      this.lastGeneratedSafe = true;
      this.lastFacing = 1;
      this.backgroundSeed = Array.from({ length: 28 }, (_, index) => ({
        x: (index * 97 + 31) % WIDTH,
        y: (index * 149 + 72) % HEIGHT,
        kind: index % 5,
        size: 4 + (index % 4) * 2
      }));

      if (this.canvas) {
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        this.bindPointerControls();
      }
    }

    bindPointerControls() {
      const updatePointer = (event) => {
        const rect = this.canvas.getBoundingClientRect();
        if (!rect.width) return;
        this.pointerTargetX = clamp((event.clientX - rect.left) * WIDTH / rect.width, 0, WIDTH);
      };
      this.canvas.addEventListener("pointerdown", (event) => {
        if (this.mode !== "running") return;
        event.preventDefault();
        this.pointerId = event.pointerId;
        updatePointer(event);
        this.canvas.setPointerCapture?.(event.pointerId);
      });
      this.canvas.addEventListener("pointermove", (event) => {
        if (this.mode !== "running" || event.pointerId !== this.pointerId) return;
        event.preventDefault();
        updatePointer(event);
      });
      const release = (event) => {
        if (event.pointerId !== this.pointerId) return;
        event.preventDefault();
        this.pointerId = null;
        this.pointerTargetX = null;
      };
      this.canvas.addEventListener("pointerup", release);
      this.canvas.addEventListener("pointercancel", release);
      this.canvas.addEventListener("lostpointercapture", () => {
        this.pointerId = null;
        this.pointerTargetX = null;
      });
    }

    showPreview() {
      this.cancelFrame();
      this.mode = "preview";
      this.active = true;
      this.previewStartedAt = performance.now();
      this.lastTime = this.previewStartedAt;
      this.onState(this.mode);
      this.drawPreview(this.previewStartedAt);
      this.frame = requestAnimationFrame((time) => this.loop(time));
    }

    start() {
      this.cancelFrame();
      this.resetWorld();
      this.mode = "running";
      this.active = true;
      this.lastTime = performance.now();
      this.onState(this.mode);
      this.onScore(0);
      this.frame = requestAnimationFrame((time) => this.loop(time));
    }

    restart() {
      this.start();
    }

    suspend() {
      this.active = false;
      this.mode = "idle";
      this.pointerId = null;
      this.pointerTargetX = null;
      this.keys.left = false;
      this.keys.right = false;
      this.cancelFrame();
      this.onState(this.mode);
    }

    cancelFrame() {
      if (this.frame) cancelAnimationFrame(this.frame);
      this.frame = 0;
    }

    setInput(direction, pressed) {
      if (direction !== "left" && direction !== "right") return;
      this.keys[direction] = Boolean(pressed);
    }

    togglePause() {
      if (this.mode === "running") {
        this.mode = "paused";
        this.pointerId = null;
        this.pointerTargetX = null;
      } else if (this.mode === "paused") {
        this.mode = "running";
        this.lastTime = performance.now();
      } else {
        return false;
      }
      this.onState(this.mode);
      return this.mode === "paused";
    }

    getResult() {
      return {
        score: this.score,
        landings: this.landings,
        springs: this.springs
      };
    }

    loop(time) {
      if (!this.active) return;
      const deltaMs = clamp(time - this.lastTime || 16.67, 0, 34);
      this.lastTime = time;
      if (this.mode === "preview") {
        this.drawPreview(time);
      } else if (this.mode === "running") {
        this.update(deltaMs / 16.67, time);
        this.draw(time);
      } else if (this.mode === "paused") {
        this.draw(time, true);
      }
      if (this.active) this.frame = requestAnimationFrame((nextTime) => this.loop(nextTime));
    }

    resetWorld() {
      this.score = 0;
      this.climbed = 0;
      this.landings = 0;
      this.springs = 0;
      this.platforms = [];
      this.particles = [];
      this.pointerId = null;
      this.pointerTargetX = null;
      this.keys.left = false;
      this.keys.right = false;
      this.lastGeneratedSafe = true;
      this.lastFacing = 1;

      const base = this.makePlatform(178, HEIGHT - 76, 184, "arcadia");
      base.spring = false;
      this.platforms.push(base);
      let y = base.y;
      let x = base.x;
      for (let index = 0; index < 12; index += 1) {
        const gap = index < 3 ? 70 : randomBetween(72, 91);
        y -= gap;
        x = clamp(x + randomBetween(-155, 155), 18, WIDTH - 106);
        const platform = this.makePlatform(x, y, index < 4 ? 94 : randomBetween(78, 104), "normal");
        platform.spring = index === 4;
        this.platforms.push(platform);
      }

      this.player = {
        x: base.x + base.w / 2 - PLAYER_WIDTH / 2,
        y: base.y - PLAYER_HEIGHT,
        vx: 0,
        vy: BOUNCE_SPEED,
        previousY: base.y - PLAYER_HEIGHT,
        facing: 1,
        squash: 0,
        stretch: 0,
        trail: []
      };
    }

    makePlatform(x, y, width, type = "normal") {
      return {
        x,
        y,
        w: width,
        h: type === "arcadia" ? 22 : 17,
        type,
        vx: type === "moving" ? (Math.random() < 0.5 ? -1 : 1) * randomBetween(1.05, 1.75) : 0,
        spring: false,
        broken: false,
        breakRotation: 0,
        breakVx: 0,
        breakVy: 0,
        fading: false,
        fade: 1,
        pulse: Math.random() * Math.PI * 2
      };
    }

    createNextPlatform(topY) {
      const difficulty = clamp(this.score / 5200, 0, 1);
      const gap = randomBetween(72 + difficulty * 8, 92 + difficulty * 25);
      const previous = this.platforms
        .filter((platform) => !platform.broken)
        .sort((a, b) => a.y - b.y)[0];
      const width = randomBetween(76 - difficulty * 8, 106 - difficulty * 12);
      const anchorX = previous ? previous.x + previous.w / 2 - width / 2 : randomBetween(18, WIDTH - width - 18);
      const x = clamp(anchorX + randomBetween(-176, 176), 14, WIDTH - width - 14);
      const roll = Math.random();
      let type = "normal";
      if (this.score > 500 && roll < 0.18 + difficulty * 0.08) type = "moving";
      else if (this.score > 1050 && roll < 0.31 + difficulty * 0.08) type = "breakable";
      else if (this.score > 1500 && roll < 0.42 + difficulty * 0.08) type = "fading";
      if (!this.lastGeneratedSafe && (type === "breakable" || type === "fading")) type = "normal";
      const platform = this.makePlatform(x, topY - gap, width, type);
      platform.spring = (type === "normal" || type === "moving") && this.score > 260 && Math.random() < 0.11;
      this.lastGeneratedSafe = type !== "breakable";
      return platform;
    }

    ensurePlatforms() {
      let top = Math.min(...this.platforms.filter((platform) => !platform.broken).map((platform) => platform.y), HEIGHT);
      while (top > -130) {
        const platform = this.createNextPlatform(top);
        this.platforms.push(platform);
        top = platform.y;
      }
    }

    update(step, time) {
      const player = this.player;
      if (!player) return;
      player.previousY = player.y;

      let desiredVelocity = 0;
      if (this.keys.left !== this.keys.right) desiredVelocity = this.keys.left ? -7.2 : 7.2;
      else if (this.pointerTargetX !== null) {
        const delta = this.pointerTargetX - (player.x + PLAYER_WIDTH / 2);
        desiredVelocity = clamp(delta * 0.075, -7.5, 7.5);
        if (Math.abs(delta) < 5) desiredVelocity = 0;
      }

      if (desiredVelocity) {
        const response = this.pointerTargetX !== null ? 0.27 : 0.2;
        player.vx += (desiredVelocity - player.vx) * response * step;
      } else {
        player.vx *= Math.pow(0.82, step);
        if (Math.abs(player.vx) < 0.03) player.vx = 0;
      }
      if (Math.abs(player.vx) > 0.18) {
        player.facing = player.vx > 0 ? 1 : -1;
        this.lastFacing = player.facing;
      }

      player.x += player.vx * step;
      if (player.x > WIDTH + 8) player.x = -PLAYER_WIDTH - 8;
      else if (player.x + PLAYER_WIDTH < -8) player.x = WIDTH + 8;

      player.vy += GRAVITY * step;
      player.y += player.vy * step;
      player.squash *= Math.pow(0.72, step);
      player.stretch *= Math.pow(0.74, step);

      if (player.y < CAMERA_LINE && player.vy < 0) {
        const scroll = CAMERA_LINE - player.y;
        player.y = CAMERA_LINE;
        this.climbed += scroll;
        this.platforms.forEach((platform) => { platform.y += scroll; });
        this.particles.forEach((particle) => { particle.y += scroll; });
        const nextScore = Math.floor(this.climbed);
        if (nextScore !== this.score) {
          this.score = nextScore;
          this.onScore(this.score);
        }
      }

      this.updatePlatforms(step);
      this.checkLandings(time);
      this.updateParticles(step);
      this.ensurePlatforms();

      player.trail.unshift({ x: player.x + PLAYER_WIDTH / 2, y: player.y + PLAYER_HEIGHT * 0.72, life: 1 });
      player.trail = player.trail.slice(0, 7);
      player.trail.forEach((point) => { point.life -= 0.13 * step; });

      if (player.y > HEIGHT + 105) this.finishRun();
    }

    updatePlatforms(step) {
      this.platforms.forEach((platform) => {
        platform.pulse += 0.04 * step;
        if (platform.type === "moving" && !platform.broken) {
          platform.x += platform.vx * step;
          if (platform.x < 8 || platform.x + platform.w > WIDTH - 8) {
            platform.x = clamp(platform.x, 8, WIDTH - platform.w - 8);
            platform.vx *= -1;
          }
        }
        if (platform.fading) platform.fade = Math.max(0, platform.fade - 0.045 * step);
        if (platform.broken) {
          platform.breakVy += 0.48 * step;
          platform.y += platform.breakVy * step;
          platform.x += platform.breakVx * step;
          platform.breakRotation += platform.breakVx * 0.015 * step;
        }
      });
      this.platforms = this.platforms.filter((platform) => platform.y < HEIGHT + 125 && platform.fade > 0.02);
    }

    checkLandings(time) {
      const player = this.player;
      if (player.vy <= 0) return;
      const previousBottom = player.previousY + PLAYER_HEIGHT;
      const bottom = player.y + PLAYER_HEIGHT;
      const centerX = player.x + PLAYER_WIDTH / 2;
      const candidates = this.platforms
        .filter((platform) => !platform.broken && platform.fade > 0.18)
        .sort((a, b) => a.y - b.y);

      for (const platform of candidates) {
        if (previousBottom > platform.y + 5 || bottom < platform.y) continue;
        if (player.x + PLAYER_WIDTH - 12 <= platform.x || player.x + 12 >= platform.x + platform.w) continue;
        if (platform.type === "breakable") {
          platform.broken = true;
          platform.breakVx = centerX < platform.x + platform.w / 2 ? 1.8 : -1.8;
          platform.breakVy = 1.5;
          this.spawnParticles(centerX, platform.y, "#ff8c62", 10);
          this.onSound("break");
          return;
        }

        const springHit = platform.spring
          && centerX > platform.x + platform.w * 0.36
          && centerX < platform.x + platform.w * 0.68;
        player.y = platform.y - PLAYER_HEIGHT;
        player.vy = springHit ? SPRING_SPEED : BOUNCE_SPEED - Math.min(1.25, this.score / 4800);
        player.squash = springHit ? 0.34 : 0.22;
        player.stretch = springHit ? 0.3 : 0.14;
        this.landings += 1;
        if (springHit) this.springs += 1;
        if (platform.type === "fading") platform.fading = true;
        this.spawnParticles(centerX, platform.y, springHit ? "#ffd65a" : "#57ff9a", springHit ? 13 : 6);
        this.onSound(springHit ? "spring" : "bounce", { time });
        return;
      }
    }

    spawnParticles(x, y, color, count) {
      for (let index = 0; index < count; index += 1) {
        this.particles.push({
          x: x + randomBetween(-20, 20),
          y: y + randomBetween(-3, 5),
          vx: randomBetween(-2.7, 2.7),
          vy: randomBetween(-3.4, -0.8),
          life: 1,
          size: randomBetween(2, 5),
          color
        });
      }
    }

    updateParticles(step) {
      this.particles.forEach((particle) => {
        particle.x += particle.vx * step;
        particle.y += particle.vy * step;
        particle.vy += 0.2 * step;
        particle.life -= 0.035 * step;
      });
      this.particles = this.particles.filter((particle) => particle.life > 0);
    }

    finishRun() {
      if (this.mode !== "running") return;
      const result = this.getResult();
      this.mode = "ended";
      this.active = false;
      this.cancelFrame();
      this.draw(performance.now());
      this.onState(this.mode);
      this.onGameOver(result);
    }

    drawPaperBackground(time, preview = false) {
      const ctx = this.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      gradient.addColorStop(0, preview ? "#fffdf0" : "#f9f7e6");
      gradient.addColorStop(1, preview ? "#edf8f6" : "#e9f4ee");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.save();
      ctx.strokeStyle = "rgba(75, 135, 160, 0.11)";
      ctx.lineWidth = 1;
      const offset = preview ? 0 : this.climbed % 32;
      for (let x = 0; x <= WIDTH; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, HEIGHT);
        ctx.stroke();
      }
      for (let y = -32 + offset; y <= HEIGHT + 32; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(WIDTH, y + 0.5);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(255, 70, 165, 0.2)";
      ctx.beginPath();
      ctx.moveTo(55.5, 0);
      ctx.lineTo(55.5, HEIGHT);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.strokeStyle = "#315b63";
      ctx.fillStyle = "#315b63";
      this.backgroundSeed.forEach((mark, index) => {
        const y = (mark.y + (preview ? 0 : this.climbed * 0.16)) % (HEIGHT + 90) - 45;
        const pulse = 1 + Math.sin(time / 900 + index) * 0.08;
        ctx.save();
        ctx.translate(mark.x, y);
        ctx.scale(pulse, pulse);
        if (mark.kind === 0) {
          ctx.beginPath();
          ctx.arc(0, 0, mark.size, 0, Math.PI * 2);
          ctx.stroke();
        } else if (mark.kind === 1) {
          ctx.beginPath();
          ctx.moveTo(-mark.size, mark.size);
          ctx.lineTo(0, -mark.size);
          ctx.lineTo(mark.size, mark.size);
          ctx.stroke();
        } else if (mark.kind === 2) {
          ctx.font = `700 ${mark.size * 2}px ui-monospace, monospace`;
          ctx.fillText("+", -mark.size / 2, mark.size / 2);
        } else if (mark.kind === 3) {
          ctx.beginPath();
          ctx.moveTo(-mark.size, 0);
          ctx.quadraticCurveTo(0, -mark.size, mark.size, 0);
          ctx.quadraticCurveTo(0, mark.size, -mark.size, 0);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(-mark.size, -mark.size);
          ctx.lineTo(mark.size, mark.size);
          ctx.moveTo(mark.size, -mark.size);
          ctx.lineTo(-mark.size, mark.size);
          ctx.stroke();
        }
        ctx.restore();
      });
      ctx.restore();
    }

    drawPreview(time) {
      if (!this.ctx) return;
      const ctx = this.ctx;
      this.drawPaperBackground(time, true);
      const elapsed = (time - this.previewStartedAt) / 1000;
      const podium = this.makePlatform(132, 700, 276, "arcadia");
      this.drawPlatform(podium, time);
      const smallPlatforms = [
        this.makePlatform(45, 560, 112, "normal"),
        this.makePlatform(382, 475, 108, "moving"),
        this.makePlatform(80, 350, 98, "fading")
      ];
      smallPlatforms[1].x += Math.sin(elapsed * 1.4) * 30;
      smallPlatforms.forEach((platform) => this.drawPlatform(platform, time));

      const phase = (elapsed * 1.05) % 1;
      const height = Math.sin(phase * Math.PI) * 170;
      const previewX = WIDTH / 2 - PLAYER_WIDTH / 2 + Math.sin(elapsed * 0.75) * 34;
      const previewY = podium.y - PLAYER_HEIGHT - height;
      this.drawPlayer({
        x: previewX,
        y: previewY,
        vx: Math.cos(elapsed * 0.75) * 1.8,
        vy: phase < 0.5 ? -5 : 5,
        facing: Math.cos(elapsed * 0.75) >= 0 ? 1 : -1,
        squash: phase > 0.94 ? 0.2 : 0,
        stretch: phase > 0.12 && phase < 0.42 ? 0.12 : 0,
        trail: []
      }, time);

      ctx.save();
      ctx.fillStyle = "rgba(25, 47, 51, 0.72)";
      ctx.font = "700 17px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText("AUTOMATIC BOUNCE  •  FINGER STEERING", WIDTH / 2, 778);
      ctx.restore();
    }

    draw(time, paused = false) {
      if (!this.ctx || !this.player) return;
      const ctx = this.ctx;
      this.drawPaperBackground(time);
      this.platforms.slice().sort((a, b) => a.y - b.y).forEach((platform) => this.drawPlatform(platform, time));

      ctx.save();
      this.particles.forEach((particle) => {
        ctx.globalAlpha = clamp(particle.life, 0, 1);
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
      });
      ctx.restore();

      this.drawPlayer(this.player, time);

      if (paused) {
        ctx.save();
        ctx.fillStyle = "rgba(7, 4, 15, 0.56)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ff2fad";
        ctx.shadowBlur = 18;
        ctx.textAlign = "center";
        ctx.font = "900 56px ui-monospace, monospace";
        ctx.fillText("PAUSED", WIDTH / 2, HEIGHT / 2 - 8);
        ctx.shadowBlur = 0;
        ctx.font = "700 17px ui-monospace, monospace";
        ctx.fillText("PRESS RESUME TO KEEP CLIMBING", WIDTH / 2, HEIGHT / 2 + 32);
        ctx.restore();
      }
    }

    drawPlatform(platform, time) {
      const ctx = this.ctx;
      ctx.save();
      ctx.globalAlpha = platform.fade ?? 1;
      ctx.translate(platform.x + platform.w / 2, platform.y + platform.h / 2);
      ctx.rotate(platform.breakRotation || 0);
      const x = -platform.w / 2;
      const y = -platform.h / 2;
      const pulse = 0.5 + Math.sin((platform.pulse || 0) + time / 250) * 0.5;

      if (platform.type === "arcadia") {
        const gradient = ctx.createLinearGradient(x, 0, -x, 0);
        gradient.addColorStop(0, "#ff2fad");
        gradient.addColorStop(0.48, "#8a5cff");
        gradient.addColorStop(1, "#49f4ff");
        ctx.shadowColor = "rgba(255, 47, 173, 0.75)";
        ctx.shadowBlur = 20;
        ctx.fillStyle = gradient;
        this.roundRect(ctx, x, y, platform.w, platform.h, 8);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(7, 4, 15, 0.86)";
        ctx.font = "900 13px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("ARCADIA", 0, 1);
      } else {
        const colors = {
          normal: ["#57ff9a", "#1cbe68"],
          moving: ["#49f4ff", "#3386ff"],
          breakable: ["#ffb45a", "#ff5f6d"],
          fading: ["#d784ff", "#8a5cff"]
        }[platform.type] || ["#57ff9a", "#1cbe68"];
        const gradient = ctx.createLinearGradient(0, y, 0, -y);
        gradient.addColorStop(0, colors[1]);
        gradient.addColorStop(1, colors[0]);
        ctx.shadowColor = colors[0];
        ctx.shadowBlur = 8 + pulse * 5;
        ctx.fillStyle = gradient;
        this.roundRect(ctx, x, y, platform.w, platform.h, 7);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(17, 42, 39, 0.58)";
        ctx.lineWidth = 2;
        this.roundRect(ctx, x, y, platform.w, platform.h, 7);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 9, y + 4);
        ctx.lineTo(-x - 9, y + 4);
        ctx.stroke();

        if (platform.type === "moving") {
          ctx.fillStyle = "rgba(5, 15, 31, 0.72)";
          ctx.font = "900 12px ui-monospace, monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(platform.vx < 0 ? "‹‹" : "››", 0, 1);
        }
        if (platform.type === "breakable") {
          ctx.strokeStyle = "rgba(68, 26, 30, 0.82)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-platform.w * 0.18, y + 2);
          ctx.lineTo(-platform.w * 0.05, -y - 2);
          ctx.lineTo(platform.w * 0.08, y + 3);
          ctx.stroke();
        }
      }

      if (platform.spring && !platform.broken) {
        ctx.strokeStyle = "#4d3557";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-5, y);
        ctx.lineTo(6, y - 8);
        ctx.lineTo(-5, y - 16);
        ctx.lineTo(6, y - 24);
        ctx.stroke();
        ctx.fillStyle = "#ffd65a";
        this.roundRect(ctx, -12, y - 30, 24, 7, 3);
        ctx.fill();
      }
      ctx.restore();
    }

    drawPlayer(player, time) {
      const ctx = this.ctx;
      const facing = player.facing || this.lastFacing || 1;
      const squash = player.squash || 0;
      const stretch = player.stretch || 0;

      ctx.save();
      (player.trail || []).slice().reverse().forEach((point, index) => {
        if (point.life <= 0) return;
        ctx.globalAlpha = point.life * 0.12;
        ctx.fillStyle = index % 2 ? "#ff2fad" : "#49f4ff";
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5 + index * 0.7, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      ctx.save();
      ctx.translate(player.x + PLAYER_WIDTH / 2, player.y + PLAYER_HEIGHT / 2);
      ctx.scale(facing, 1);
      ctx.scale(1 + squash - stretch * 0.28, 1 - squash * 0.55 + stretch);
      ctx.translate(-PLAYER_WIDTH / 2, -PLAYER_HEIGHT / 2);

      ctx.shadowColor = "rgba(73, 244, 255, 0.62)";
      ctx.shadowBlur = 13;
      const bodyGradient = ctx.createLinearGradient(6, 4, 48, 60);
      bodyGradient.addColorStop(0, "#d9ff79");
      bodyGradient.addColorStop(0.52, "#66e889");
      bodyGradient.addColorStop(1, "#2fbf94");
      ctx.fillStyle = bodyGradient;
      ctx.strokeStyle = "#173f42";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(14, 12);
      ctx.quadraticCurveTo(26, 1, 43, 10);
      ctx.quadraticCurveTo(54, 17, 50, 36);
      ctx.quadraticCurveTo(46, 54, 30, 57);
      ctx.quadraticCurveTo(13, 58, 7, 43);
      ctx.quadraticCurveTo(0, 25, 14, 12);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.stroke();

      ctx.strokeStyle = "#173f42";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(24, 9);
      ctx.quadraticCurveTo(23, -2, 17, -5);
      ctx.stroke();
      ctx.fillStyle = "#ff2fad";
      ctx.beginPath();
      ctx.arc(16.5, -5.5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#173f42";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(30, 20, 8, 10, 0, 0, Math.PI * 2);
      ctx.ellipse(44, 21, 7, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#152d35";
      ctx.beginPath();
      ctx.arc(33, 22, 2.8, 0, Math.PI * 2);
      ctx.arc(47, 23, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#49f4ff";
      ctx.strokeStyle = "#173f42";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(48, 31);
      ctx.quadraticCurveTo(64, 30, 67, 38);
      ctx.quadraticCurveTo(62, 45, 47, 42);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.78)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(54, 35);
      ctx.lineTo(62, 37);
      ctx.stroke();

      const legKick = Math.sin(time / 90) * clamp(Math.abs(player.vx || 0) / 7, 0, 1) * 4;
      ctx.strokeStyle = "#173f42";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(19, 52);
      ctx.lineTo(15 - legKick, 63);
      ctx.moveTo(38, 53);
      ctx.lineTo(43 + legKick, 63);
      ctx.stroke();
      ctx.strokeStyle = "#ff2fad";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(9 - legKick, 63);
      ctx.lineTo(19 - legKick, 63);
      ctx.moveTo(38 + legKick, 63);
      ctx.lineTo(48 + legKick, 63);
      ctx.stroke();
      ctx.restore();
    }

    roundRect(ctx, x, y, width, height, radius) {
      const r = Math.min(radius, width / 2, height / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + width, y, x + width, y + height, r);
      ctx.arcTo(x + width, y + height, x, y + height, r);
      ctx.arcTo(x, y + height, x, y, r);
      ctx.arcTo(x, y, x + width, y, r);
      ctx.closePath();
    }
  }

  window.ArcadiaDoodleJump = ArcadiaDoodleJump;
})();
