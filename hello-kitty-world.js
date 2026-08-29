(() => {
  "use strict";

  const VIEW_WIDTH = 960;
  const VIEW_HEIGHT = 600;
  const WORLD_WIDTH = 1600;
  const WORLD_HEIGHT = 980;
  const SEEK_SECONDS = 60;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  class ArcadiaHelloKittyWorld {
    constructor(options = {}) {
      Object.assign(this, options);
      this.ctx = this.canvas?.getContext("2d", { alpha: false }) || null;
      if (this.ctx) this.ctx.imageSmoothingEnabled = false;
      this.opened = false;
      this.started = false;
      this.paused = false;
      this.mode = "preview";
      this.input = { x: 0, y: 0, run: false };
      this.keyDirections = new Set();
      this.player = { x: 236, y: 820, radius: 18, facing: "up", step: 0 };
      this.camera = { x: 0, y: 380 };
      this.lastFrame = 0;
      this.frame = 0;
      this.elapsed = 0;
      this.timeLeft = SEEK_SECONDS;
      this.totalFinds = Math.max(0, Math.floor(Number(options.totalFinds) || 0));
      this.adventureRuns = Math.max(0, Math.floor(Number(options.adventureRuns) || 0));
      this.finds = this.totalFinds;
      this.returningAdventure = this.totalFinds > 0 || this.adventureRuns > 0;
      this.score = 0;
      this.prompt = "";
      this.objective = "Find Kuromi in Friendship Village";
      this.dialogueLines = [];
      this.dialogueIndex = 0;
      this.dialogueDone = null;
      this.activeHideSpot = null;
      this.lastHideSpot = "";
      this.resultPending = false;
      this.confetti = [];
      this.joystickPointerId = null;
      this.mutedMusic = false;
      this.mutedSfx = false;
      this.audioContext = null;
      this.musicTimer = 0;
      this.musicStep = 0;
      this.lastUiState = "";
      this.playerName = this.normalizePlayerName(options.playerName);
      this.melodyHintIndex = 0;
      this.boundKeyDown = this.handleKeyDown.bind(this);
      this.boundKeyUp = this.handleKeyUp.bind(this);

      this.helloHouse = { x: 90, y: 82, w: 320, h: 220, door: { x: 250, y: 320 } };
      this.kuromiMeeting = { x: 1436, y: 338 };
      this.kuromiAtHouse = { x: 340, y: 344 };
      this.houses = [
        { ...this.helloHouse, name: "HELLO KITTY", wall: "#fff0f5", roof: "#ef557e", trim: "#ffffff", bow: true },
        { x: 506, y: 90, w: 306, h: 210, door: { x: 660, y: 318 }, name: "MY MELODY", wall: "#fff4f7", roof: "#f596ba", trim: "#ffe0eb" },
        { x: 982, y: 74, w: 350, h: 228, door: { x: 1158, y: 320 }, name: "FRIENDSHIP HALL", wall: "#fff7cc", roof: "#53b6c8", trim: "#ffffff" },
        { x: 1200, y: 592, w: 300, h: 214, door: { x: 1350, y: 824 }, name: "CINNAMON CAFE", wall: "#eefaff", roof: "#79cbe7", trim: "#ffffff" }
      ];
      this.trees = [
        { x: 458, y: 206 }, { x: 888, y: 210 }, { x: 1450, y: 180 },
        { x: 1458, y: 434 }, { x: 1080, y: 620 }, { x: 1020, y: 760 },
        { x: 502, y: 680 }, { x: 420, y: 824 }, { x: 90, y: 650 },
        { x: 250, y: 590 }, { x: 1525, y: 900 }, { x: 1120, y: 910 }
      ];
      this.npcs = [
        { id: "melody", name: "My Melody", x: 660, y: 350, color: "#f58ab4" },
        { id: "keroppi", name: "Keroppi", x: 760, y: 820, color: "#69d66f", lines: ["Ribbit! Press and hold B when you want Hello Kitty to run.", "It really helps during Hide and Seek!"] },
        { id: "cinnamoroll", name: "Cinnamoroll", x: 1310, y: 860, color: "#a8e2f3", lines: ["Welcome to Friendship Village!", "If the timer gets low, look for purple sparkles near Kuromi's hiding place."] }
      ];
      this.hideSpots = [
        { id: "pink-house", x: 116, y: 334, label: "behind Hello Kitty's flower hedge" },
        { id: "orchard", x: 502, y: 720, label: "behind an orchard tree" },
        { id: "bakery", x: 532, y: 334, label: "beside My Melody's house" },
        { id: "moon-garden", x: 1460, y: 444, label: "inside the moon garden" },
        { id: "cafe", x: 1228, y: 570, label: "behind Cinnamon Cafe" },
        { id: "pond", x: 1050, y: 700, label: "behind the tree near the pond" },
        { id: "fountain", x: 1110, y: 456, label: "behind Friendship Fountain" },
        { id: "friendship-hall", x: 950, y: 350, label: "behind the hedge beside Friendship Hall" },
        { id: "cafe-garden", x: 1518, y: 844, label: "in the garden behind Cinnamon Cafe" },
        { id: "south-meadow", x: 930, y: 856, label: "among the flowers in the south meadow" },
        { id: "melody-hedge", x: 850, y: 350, label: "behind the hedge near My Melody's house" },
        { id: "village-sign", x: 78, y: 906, label: "behind the Friendship Village sign" }
      ];

      this.obstacles = [
        ...this.houses.map((house) => ({ type: "rect", x: house.x, y: house.y, w: house.w, h: house.h })),
        { type: "ellipse", x: 750, y: 655, rx: 176, ry: 100 },
        { type: "ellipse", x: 1044, y: 456, rx: 54, ry: 42 },
        ...this.trees.map((tree) => ({ type: "circle", x: tree.x, y: tree.y + 20, r: 31 }))
      ];

      this.bindControls();
      this.updateDialogue();
      this.emitState(true);
    }

    normalizePlayerName(name) {
      return String(name || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 16) || "Player";
    }

    setPlayerName(name) {
      this.playerName = this.normalizePlayerName(name);
      return this.playerName;
    }

    setPlayerProgress(progress = {}) {
      if (Object.hasOwn(progress, "totalFinds")) {
        this.totalFinds = Math.max(0, Math.floor(Number(progress.totalFinds) || 0));
      }
      if (Object.hasOwn(progress, "adventureRuns")) {
        this.adventureRuns = Math.max(0, Math.floor(Number(progress.adventureRuns) || 0));
      }
      this.finds = this.totalFinds;
      this.emitState(true);
      return { totalFinds: this.totalFinds, adventureRuns: this.adventureRuns };
    }

    bindControls() {
      if (this.dialogueAdvance) {
        this.dialogueAdvance.addEventListener("click", (event) => {
          event.preventDefault();
          this.pressA();
        });
      }
      this.canvas?.addEventListener("pointerdown", (event) => {
        if (!this.opened || !this.started || this.paused) return;
        event.preventDefault();
        if (this.dialogueLines.length || this.prompt) this.pressA();
      });

      const updateJoystick = (event) => {
        if (event.pointerId !== this.joystickPointerId) return;
        event.preventDefault();
        const rect = this.joystick.getBoundingClientRect();
        const radius = Math.max(1, Math.min(rect.width, rect.height) / 2);
        let x = (event.clientX - rect.left - rect.width / 2) / radius;
        let y = (event.clientY - rect.top - rect.height / 2) / radius;
        const magnitude = Math.hypot(x, y);
        if (magnitude > 1) {
          x /= magnitude;
          y /= magnitude;
        }
        const deadzone = 0.14;
        this.input.x = Math.abs(x) < deadzone ? 0 : x;
        this.input.y = Math.abs(y) < deadzone ? 0 : y;
        if (this.joystickKnob) {
          const travel = radius * 0.43;
          this.joystickKnob.style.transform = `translate(${x * travel}px, ${y * travel}px)`;
        }
      };
      const releaseJoystick = (event) => {
        if (event?.pointerId !== undefined && event.pointerId !== this.joystickPointerId) return;
        event?.preventDefault?.();
        this.joystickPointerId = null;
        this.input.x = 0;
        this.input.y = 0;
        if (this.joystickKnob) this.joystickKnob.style.transform = "translate(0px, 0px)";
      };
      this.joystick?.addEventListener("pointerdown", (event) => {
        if (!this.started || this.paused) return;
        event.preventDefault();
        this.joystickPointerId = event.pointerId;
        this.joystick.setPointerCapture?.(event.pointerId);
        updateJoystick(event);
      });
      this.joystick?.addEventListener("pointermove", updateJoystick);
      this.joystick?.addEventListener("pointerup", releaseJoystick);
      this.joystick?.addEventListener("pointercancel", releaseJoystick);
      this.joystick?.addEventListener("lostpointercapture", releaseJoystick);

      const bindButton = (button, down, up) => {
        if (!button) return;
        const release = (event) => {
          event?.preventDefault?.();
          button.classList.remove("is-pressed");
          up?.();
        };
        button.addEventListener("pointerdown", (event) => {
          if (!this.started || this.paused) return;
          event.preventDefault();
          button.setPointerCapture?.(event.pointerId);
          button.classList.add("is-pressed");
          down?.();
        });
        button.addEventListener("pointerup", release);
        button.addEventListener("pointercancel", release);
        button.addEventListener("lostpointercapture", release);
      };
      bindButton(this.aButton, () => this.pressA());
      bindButton(this.bButton, () => { this.input.run = true; }, () => { this.input.run = false; });

      window.addEventListener("keydown", this.boundKeyDown);
      window.addEventListener("keyup", this.boundKeyUp);
    }

    handleKeyDown(event) {
      if (!this.opened || !this.started || this.paused) return;
      const target = event.target?.tagName?.toLowerCase();
      if (target === "input" || target === "textarea" || target === "select") return;
      const directionKeys = {
        ArrowLeft: "left", a: "left", A: "left",
        ArrowRight: "right", d: "right", D: "right",
        ArrowUp: "up", w: "up", W: "up",
        ArrowDown: "down", s: "down", S: "down"
      };
      if (directionKeys[event.key]) {
        event.preventDefault();
        this.keyDirections.add(directionKeys[event.key]);
        this.syncKeyboardMovement();
      }
      if (["Enter", "e", "E", "z", "Z"].includes(event.key) && !event.repeat) {
        event.preventDefault();
        this.pressA();
      }
      if (["Shift", "x", "X"].includes(event.key)) {
        event.preventDefault();
        this.input.run = true;
      }
      if (["p", "P", "Escape"].includes(event.key) && !event.repeat) {
        event.preventDefault();
        this.onPauseRequest?.();
      }
    }

    handleKeyUp(event) {
      if (!this.opened) return;
      const directionKeys = {
        ArrowLeft: "left", a: "left", A: "left",
        ArrowRight: "right", d: "right", D: "right",
        ArrowUp: "up", w: "up", W: "up",
        ArrowDown: "down", s: "down", S: "down"
      };
      if (directionKeys[event.key]) {
        this.keyDirections.delete(directionKeys[event.key]);
        this.syncKeyboardMovement();
      }
      if (["Shift", "x", "X"].includes(event.key)) this.input.run = false;
    }

    syncKeyboardMovement() {
      if (this.joystickPointerId !== null) return;
      this.input.x = Number(this.keyDirections.has("right")) - Number(this.keyDirections.has("left"));
      this.input.y = Number(this.keyDirections.has("down")) - Number(this.keyDirections.has("up"));
    }

    open() {
      this.opened = true;
      this.started = false;
      this.paused = false;
      this.mode = "preview";
      this.resultPending = false;
      this.releaseControls();
      this.titleOverlay?.classList.remove("hidden");
      this.hideDialogue();
      this.prompt = "";
      this.objective = "A tiny friendship adventure";
      this.emitState(true);
      this.startLoop();
    }

    start(options = {}) {
      if (!this.opened) this.open();
      this.setMuted(options);
      this.returningAdventure = this.totalFinds > 0 || this.adventureRuns > 0;
      this.started = true;
      this.paused = false;
      this.mode = "explore";
      this.player.x = 236;
      this.player.y = 820;
      this.player.facing = "up";
      this.player.step = 0;
      this.camera.x = 0;
      this.camera.y = 380;
      this.elapsed = 0;
      this.timeLeft = SEEK_SECONDS;
      this.finds = this.totalFinds;
      this.score = 0;
      this.activeHideSpot = null;
      this.resultPending = false;
      this.confetti = [];
      this.melodyHintIndex = 0;
      this.objective = "Find Kuromi near the purple moon garden";
      this.titleOverlay?.classList.add("hidden");
      this.hideDialogue();
      this.releaseControls();
      this.startMusic();
      this.playSfx("start");
      this.emitState(true);
      this.startLoop();
      this.onStart?.();
      return true;
    }

    restart(options = {}) {
      return this.start(options);
    }

    stop() {
      this.opened = false;
      this.started = false;
      this.paused = false;
      this.mode = "preview";
      this.releaseControls();
      this.hideDialogue();
      this.stopMusic();
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.lastFrame = 0;
      this.emitState(true);
    }

    togglePause() {
      if (!this.started || this.resultPending) return this.paused;
      this.paused = !this.paused;
      this.releaseControls();
      if (this.paused) this.stopMusic();
      else this.startMusic();
      this.emitState(true);
      return this.paused;
    }

    setMuted(options = {}) {
      if (Object.hasOwn(options, "mutedMusic")) this.mutedMusic = Boolean(options.mutedMusic);
      if (Object.hasOwn(options, "mutedSfx")) this.mutedSfx = Boolean(options.mutedSfx);
      if (this.mutedMusic) this.stopMusic();
      else if (this.opened && this.started && !this.paused) this.startMusic();
    }

    releaseControls() {
      this.input.x = 0;
      this.input.y = 0;
      this.input.run = false;
      this.keyDirections.clear();
      this.joystickPointerId = null;
      if (this.joystickKnob) this.joystickKnob.style.transform = "translate(0px, 0px)";
      this.aButton?.classList.remove("is-pressed");
      this.bButton?.classList.remove("is-pressed");
    }

    startLoop() {
      if (this.frame) return;
      this.lastFrame = performance.now();
      this.frame = requestAnimationFrame((time) => this.loop(time));
    }

    loop(time) {
      this.frame = 0;
      if (!this.opened) return;
      const dt = Math.min(0.04, Math.max(0, (time - this.lastFrame) / 1000));
      this.lastFrame = time;
      if (this.started && !this.paused && !this.dialogueLines.length && !this.resultPending) this.update(dt);
      this.updateConfetti(dt);
      this.draw(time);
      this.emitState();
      this.frame = requestAnimationFrame((next) => this.loop(next));
    }

    update(dt) {
      this.elapsed += dt;
      this.movePlayer(dt);
      this.updatePrompt();
      if (this.mode === "seeking") {
        this.timeLeft = Math.max(0, this.timeLeft - dt);
        if (this.timeLeft <= 0) this.finishRound(false);
        else if (this.timeLeft <= 25) this.objective = "Kuromi left purple sparkles near her hiding place!";
      }
    }

    movePlayer(dt) {
      let x = this.input.x;
      let y = this.input.y;
      const magnitude = Math.hypot(x, y);
      if (magnitude > 1) {
        x /= magnitude;
        y /= magnitude;
      }
      if (magnitude < 0.05) return;
      const speed = this.input.run ? 246 : 160;
      const dx = x * speed * dt;
      const dy = y * speed * dt;
      const nextX = clamp(this.player.x + dx, 34, WORLD_WIDTH - 34);
      if (!this.collides(nextX, this.player.y)) this.player.x = nextX;
      const nextY = clamp(this.player.y + dy, 42, WORLD_HEIGHT - 34);
      if (!this.collides(this.player.x, nextY)) this.player.y = nextY;
      if (Math.abs(x) > Math.abs(y)) this.player.facing = x < 0 ? "left" : "right";
      else this.player.facing = y < 0 ? "up" : "down";
      this.player.step += dt * (this.input.run ? 13 : 8);
    }

    collides(x, y) {
      const r = this.player.radius;
      return this.obstacles.some((obstacle) => {
        if (obstacle.type === "rect") {
          const nearX = clamp(x, obstacle.x, obstacle.x + obstacle.w);
          const nearY = clamp(y, obstacle.y, obstacle.y + obstacle.h);
          return Math.hypot(x - nearX, y - nearY) < r;
        }
        if (obstacle.type === "circle") return Math.hypot(x - obstacle.x, y - obstacle.y) < r + obstacle.r;
        const nx = (x - obstacle.x) / (obstacle.rx + r);
        const ny = (y - obstacle.y) / (obstacle.ry + r);
        return nx * nx + ny * ny < 1;
      });
    }

    updatePrompt() {
      let prompt = "";
      if (this.mode === "explore" && distance(this.player, this.kuromiMeeting) < 92) prompt = "A  TALK TO KUROMI";
      if (this.mode === "to-house" && distance(this.player, this.kuromiAtHouse) < 105) prompt = "A  START HIDE & SEEK";
      if (this.mode === "seeking" && this.activeHideSpot && distance(this.player, this.activeHideSpot) < 94) prompt = "A  SEARCH HERE";
      if (!prompt) {
        const npc = this.nearestNpc();
        if (npc) prompt = `A  TALK TO ${npc.name.toUpperCase()}`;
      }
      this.prompt = prompt;
    }

    nearestNpc() {
      return this.npcs.find((npc) => distance(this.player, npc) < 76) || null;
    }

    getNpcDialogue(npc) {
      if (npc.id === "melody") return this.getMyMelodyDialogue();
      if (npc.id === "cinnamoroll") {
        return [
          `Welcome to Friendship Village, ${this.playerName}!`,
          "If the timer gets low, look for purple sparkles near Kuromi's hiding place."
        ];
      }
      return [...(npc.lines || [])];
    }

    getMyMelodyDialogue() {
      if (this.mode !== "seeking" || !this.activeHideSpot) {
        if (this.mode === "to-house") {
          return [
            `Great job finding Kuromi, ${this.playerName}!`,
            "She ran toward Hello Kitty's house. Follow the pink path to start your game!"
          ];
        }
        return [
          `Hi, ${this.playerName}! Kuromi was giggling near the purple flowers.`,
          "Follow the big path toward the moon garden!"
        ];
      }

      const hints = {
        "pink-house": [
          "I heard a giggle beside a very pink roof!",
          "Try looking near flowers close to Hello Kitty's home.",
          "Kuromi did not wander far from where this adventure began."
        ],
        orchard: [
          "I spotted a black tail disappearing between the orchard trees!",
          "Listen for rustling leaves in the little orchard.",
          "Kuromi may be using a tree trunk as her hiding wall."
        ],
        bakery: [
          "Someone tiptoed past my house just before you arrived!",
          "Search around the edge of My Melody's house.",
          "That giggle sounded surprisingly close to me."
        ],
        "moon-garden": [
          "The purple flowers in the moon garden were moving a moment ago!",
          "I would check wherever the crescent moon decorations glow.",
          "Kuromi loves the purple side of Friendship Village."
        ],
        cafe: [
          "I saw tiny footprints heading toward Cinnamon Cafe!",
          "Look around the cafe where the air smells sweet.",
          "Kuromi might be hiding behind a building with a blue roof."
        ],
        pond: [
          "I heard a tiny splash near the pond!",
          "Try the trees beside the bright blue water.",
          "Kuromi may be somewhere she can watch the fish."
        ],
        fountain: [
          "I heard a giggle over the splashing Friendship Fountain!",
          "Look around the fountain in the middle of the village.",
          "Kuromi may be hiding where the water sparkles."
        ],
        "friendship-hall": [
          "Tiny footsteps disappeared beside Friendship Hall!",
          "Check the hedge beside the big hall with the blue roof.",
          "Kuromi may be peeking around Friendship Hall."
        ],
        "cafe-garden": [
          "The flowers behind Cinnamon Cafe were rustling!",
          "Search the little garden on the far side of the cafe.",
          "Kuromi may be hiding where the cafe garden smells sweet."
        ],
        "south-meadow": [
          "I saw purple ears moving through the south meadow flowers!",
          "Try the flower patch toward the bottom of the village.",
          "Kuromi picked a colorful hiding place this time."
        ],
        "melody-hedge": [
          "I heard someone giggling just past my garden hedge!",
          "Search the hedge on the Friendship Hall side of my house.",
          "Kuromi is hiding very close to My Melody's flowers."
        ],
        "village-sign": [
          "Someone ducked behind the Friendship Village sign!",
          "Look near the wooden welcome sign in the lower-left meadow.",
          "Kuromi may be hiding where every visitor enters the village."
        ]
      };
      const choices = hints[this.activeHideSpot.id] || ["I heard Kuromi giggling somewhere nearby!"];
      const clue = choices[this.melodyHintIndex % choices.length];
      this.melodyHintIndex += 1;
      const proximity = distance(this.player, this.activeHideSpot);
      const followUp = proximity < 360
        ? "You're getting warm — search around this part of the village!"
        : this.timeLeft <= 25
          ? "Look for purple sparkles now. Kuromi is leaving you one last clue!"
          : `You still have ${Math.ceil(this.timeLeft)} seconds. Hold B to run!`;
      return [clue, followUp];
    }

    getKuromiMeetingDialogue() {
      if (!this.returningAdventure) {
        return [
          "Hello, hehe! Nice to meet you.",
          `I've heard lots about you, ${this.playerName}!`,
          "I hope you enjoy the world I live in.",
          "Hello Kitty and I were so excited when we heard you were going to visit.",
          "We play lots of games in this world. One of our favorites is Hide and Seek!",
          "Since you're here, you can play with us anytime!",
          "To start playing, meet me at Hello Kitty's house. I'll see you there!"
        ];
      }

      const rematches = [
        [
          `You're back, ${this.playerName}! Are you ready to play Hide and Seek again?`,
          "I found a few new hiding spots, so keep your eyes open!",
          "Meet me at Hello Kitty's house when you're ready for our rematch."
        ],
        [
          `Hey, ${this.playerName}! I was hoping you'd come back for another round.`,
          "Think you can find me even faster this time?",
          "Let's meet at Hello Kitty's house and start the game!"
        ],
        [
          `Welcome back, ${this.playerName}! You're becoming a great Kuromi seeker.`,
          "My Melody might share a hint if my hiding place is extra sneaky.",
          "Come meet me at Hello Kitty's house when you're ready!"
        ],
        [
          `There you are, ${this.playerName}! Kuromi's Hide-and-Seek challenge is ready again.`,
          "I promise I won't make this round too easy, hehe!",
          "Race me to Hello Kitty's house and I'll go hide."
        ]
      ];
      return rematches[(this.adventureRuns + this.totalFinds) % rematches.length];
    }

    getKuromiHouseDialogue() {
      if (!this.returningAdventure) {
        return [
          "You found Hello Kitty's house! Ready to play?",
          "I'll hide while you count... three, two, one!",
          "Ready or not, come find me!"
        ];
      }

      const rematches = [
        [
          "You made it! Ready for another Hide-and-Seek round?",
          "Count to three while I choose a brand-new hiding place...",
          "Ready or not, come find me!"
        ],
        [
          "Welcome back to our starting spot! Let's make this round fun.",
          "Close your eyes while I sneak away... three, two, one!",
          "Okay, seeker—come find Kuromi!"
        ],
        [
          `This is rematch time, ${this.playerName}! Do you remember all my hiding tricks?`,
          "I'll hide somewhere around the village while you count.",
          "No peeking... ready or not, here we go!"
        ]
      ];
      return rematches[(this.adventureRuns + this.totalFinds) % rematches.length];
    }

    pressA() {
      if (!this.started || this.paused || this.resultPending) return false;
      if (this.dialogueLines.length) {
        this.advanceDialogue();
        return true;
      }
      if (this.mode === "explore" && distance(this.player, this.kuromiMeeting) < 100) {
        this.showDialogue("Kuromi", this.getKuromiMeetingDialogue(), () => {
          this.mode = "to-house";
          this.objective = "Meet Kuromi at Hello Kitty's house";
          this.prompt = "";
          this.playSfx("quest");
        });
        return true;
      }
      if (this.mode === "to-house" && distance(this.player, this.kuromiAtHouse) < 112) {
        this.showDialogue("Kuromi", this.getKuromiHouseDialogue(), () => this.startHideAndSeek());
        return true;
      }
      if (this.mode === "seeking" && this.activeHideSpot && distance(this.player, this.activeHideSpot) < 100) {
        this.finishRound(true);
        return true;
      }
      const npc = this.nearestNpc();
      if (npc) {
        this.showDialogue(npc.name, this.getNpcDialogue(npc));
        return true;
      }
      this.playSfx("nope");
      return false;
    }

    showDialogue(speaker, lines, onDone = null) {
      this.releaseControls();
      this.dialogueSpeakerName = speaker;
      this.dialogueLines = [...lines];
      this.dialogueIndex = 0;
      this.dialogueDone = onDone;
      this.updateDialogue();
      this.playSfx("talk");
    }

    advanceDialogue() {
      if (!this.dialogueLines.length) return;
      if (this.dialogueIndex < this.dialogueLines.length - 1) {
        this.dialogueIndex += 1;
        this.updateDialogue();
        this.playSfx("talk");
        return;
      }
      const done = this.dialogueDone;
      this.hideDialogue();
      done?.();
      this.emitState(true);
    }

    updateDialogue() {
      const visible = this.dialogueLines.length > 0;
      this.dialogue?.classList.toggle("hidden", !visible);
      if (!visible) return;
      if (this.dialogueSpeaker) this.dialogueSpeaker.textContent = this.dialogueSpeakerName || "Friend";
      if (this.dialogueText) this.dialogueText.textContent = this.dialogueLines[this.dialogueIndex] || "";
      if (this.dialogueCounter) this.dialogueCounter.textContent = `${this.dialogueIndex + 1} / ${this.dialogueLines.length}`;
    }

    hideDialogue() {
      this.dialogueLines = [];
      this.dialogueIndex = 0;
      this.dialogueDone = null;
      this.dialogue?.classList.add("hidden");
    }

    startHideAndSeek() {
      const choices = this.hideSpots.filter((spot) => spot.id !== this.lastHideSpot);
      this.activeHideSpot = choices[Math.floor(Math.random() * choices.length)] || this.hideSpots[0];
      this.lastHideSpot = this.activeHideSpot.id;
      this.melodyHintIndex = 0;
      this.mode = "seeking";
      this.timeLeft = SEEK_SECONDS;
      this.objective = "Find Kuromi! Search every landmark in Friendship Village";
      this.prompt = "";
      this.playSfx("start");
      this.emitState(true);
    }

    finishRound(found) {
      if (this.resultPending) return;
      this.resultPending = true;
      this.releaseControls();
      this.finds = this.totalFinds + (found ? 1 : 0);
      this.score = found ? 1000 + Math.ceil(this.timeLeft) * 25 : 0;
      this.mode = found ? "found" : "timeout";
      this.objective = found ? "You found Kuromi!" : "Time's up — Kuromi was hiding nearby!";
      this.prompt = "";
      if (found) {
        this.spawnConfetti();
        this.playSfx("found");
      } else {
        this.playSfx("timeout");
      }
      this.stopMusic();
      this.emitState(true);
      window.setTimeout(() => {
        if (!this.opened || !this.resultPending) return;
        this.onRoundEnd?.({
          found,
          score: this.score,
          timeLeft: Math.ceil(this.timeLeft),
          elapsed: Math.max(1, Math.round(SEEK_SECONDS - this.timeLeft)),
          hidingPlace: this.activeHideSpot?.label || "somewhere in Friendship Village"
        });
      }, found ? 1350 : 650);
    }

    spawnConfetti() {
      const source = this.activeHideSpot || this.player;
      this.confetti = Array.from({ length: 54 }, (_, index) => ({
        x: source.x,
        y: source.y - 24,
        vx: (Math.random() - 0.5) * 290,
        vy: -100 - Math.random() * 260,
        gravity: 310 + Math.random() * 100,
        life: 1.2 + Math.random() * 0.8,
        color: ["#ef557e", "#ffd65a", "#9e6ae8", "#74d4e8", "#ffffff"][index % 5]
      }));
    }

    updateConfetti(dt) {
      this.confetti.forEach((particle) => {
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.vy += particle.gravity * dt;
        particle.life -= dt;
      });
      this.confetti = this.confetti.filter((particle) => particle.life > 0);
    }

    emitState(force = false) {
      const state = {
        opened: this.opened,
        started: this.started,
        paused: this.paused,
        mode: this.mode,
        objective: this.objective,
        prompt: this.prompt,
        time: this.mode === "seeking" ? Math.ceil(this.timeLeft) : null,
        finds: this.finds,
        aLabel: this.prompt.includes("SEARCH") ? "SEARCH" : this.prompt.includes("START") ? "START" : "TALK",
        bLabel: "RUN"
      };
      const serialized = JSON.stringify(state);
      if (!force && serialized === this.lastUiState) return;
      this.lastUiState = serialized;
      this.onUpdate?.(state);
    }

    ensureAudio() {
      if (this.audioContext) return this.audioContext;
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      this.audioContext = new AudioCtor();
      return this.audioContext;
    }

    playNote(frequency, duration = 0.12, volume = 0.025, type = "square") {
      const audio = this.ensureAudio();
      if (!audio || audio.state === "suspended") audio?.resume?.().catch?.(() => undefined);
      if (!audio) return;
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      const now = audio.currentTime;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.02);
    }

    startMusic() {
      if (this.mutedMusic || this.musicTimer || !this.started || this.paused) return;
      const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46, 659.25, 783.99, 987.77, 783.99, 587.33, 659.25, 698.46, 493.88];
      const tick = () => {
        if (this.mutedMusic || !this.started || this.paused) return;
        const note = melody[this.musicStep % melody.length];
        this.playNote(note, 0.15, 0.014, "square");
        if (this.musicStep % 4 === 0) this.playNote(note / 4, 0.2, 0.012, "triangle");
        this.musicStep += 1;
      };
      tick();
      this.musicTimer = window.setInterval(tick, 235);
    }

    stopMusic() {
      window.clearInterval(this.musicTimer);
      this.musicTimer = 0;
    }

    playSfx(kind) {
      if (this.mutedSfx) return;
      const sounds = {
        talk: [[740, 0.055], [880, 0.06]],
        quest: [[523, 0.08], [659, 0.08], [880, 0.14]],
        start: [[392, 0.07], [523, 0.07], [784, 0.16]],
        found: [[659, 0.1], [784, 0.1], [988, 0.12], [1319, 0.25]],
        timeout: [[392, 0.12], [330, 0.12], [262, 0.24]],
        nope: [[210, 0.05]]
      };
      (sounds[kind] || sounds.talk).forEach(([note, length], index) => {
        window.setTimeout(() => this.playNote(note, length, 0.035, kind === "timeout" ? "triangle" : "square"), index * 75);
      });
    }

    draw(time) {
      if (!this.ctx) return;
      const preview = !this.started;
      if (preview) {
        const wave = time / 1000;
        this.camera.x = 300 + Math.sin(wave * 0.16) * 260;
        this.camera.y = 170 + Math.cos(wave * 0.13) * 110;
      } else {
        this.camera.x = clamp(this.player.x - VIEW_WIDTH / 2, 0, WORLD_WIDTH - VIEW_WIDTH);
        this.camera.y = clamp(this.player.y - VIEW_HEIGHT / 2, 0, WORLD_HEIGHT - VIEW_HEIGHT);
      }
      const ctx = this.ctx;
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      this.drawGround(ctx);
      ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));
      this.drawPaths(ctx);
      this.drawPond(ctx, 750, 655);
      this.drawFountain(ctx, 1044, 456, time);
      this.drawMoonGarden(ctx, time);
      this.houses.forEach((house) => this.drawHouse(ctx, house));
      this.drawHedges(ctx);
      this.trees.forEach((tree, index) => this.drawTree(ctx, tree.x, tree.y, time + index * 130));
      this.drawFlowers(ctx, time);
      this.drawSigns(ctx);

      const characters = [...this.npcs];
      if (this.mode === "explore" || preview) characters.push({ id: "kuromi", name: "Kuromi", ...this.kuromiMeeting });
      if (this.mode === "to-house") characters.push({ id: "kuromi", name: "Kuromi", ...this.kuromiAtHouse });
      if (this.mode === "found" && this.activeHideSpot) characters.push({ id: "kuromi", name: "Kuromi", x: this.activeHideSpot.x, y: this.activeHideSpot.y });
      if (preview) characters.push({ id: "hello", name: "Hello Kitty", x: 960 + Math.sin(time / 420) * 34, y: 500 });
      else characters.push({ id: "hello", name: "Hello Kitty", ...this.player });
      characters.sort((a, b) => a.y - b.y).forEach((character) => this.drawCharacter(ctx, character, time));

      if (this.mode === "seeking" && this.activeHideSpot && this.timeLeft <= 25) this.drawHideSparkles(ctx, this.activeHideSpot, time);
      this.confetti.forEach((particle) => {
        ctx.globalAlpha = clamp(particle.life, 0, 1);
        ctx.fillStyle = particle.color;
        ctx.fillRect(Math.round(particle.x), Math.round(particle.y), 8, 8);
      });
      ctx.globalAlpha = 1;
      ctx.restore();
      if (this.started) this.drawCompass(ctx, time);
      if (this.paused) this.drawPauseOverlay(ctx);
    }

    drawGround(ctx) {
      ctx.fillStyle = "#83d58b";
      ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
      const tile = 32;
      const offsetX = -Math.round(this.camera.x) % tile;
      const offsetY = -Math.round(this.camera.y) % tile;
      for (let y = offsetY; y < VIEW_HEIGHT; y += tile) {
        for (let x = offsetX; x < VIEW_WIDTH; x += tile) {
          if (((x - offsetX) / tile + (y - offsetY) / tile) % 2 !== 0) continue;
          ctx.fillStyle = "rgba(191, 238, 157, 0.16)";
          ctx.fillRect(x, y, tile, tile);
        }
      }
    }

    drawPaths(ctx) {
      ctx.fillStyle = "#f8dca8";
      ctx.fillRect(0, 390, WORLD_WIDTH, 150);
      ctx.fillRect(190, 300, 120, 680);
      ctx.fillRect(610, 288, 100, 250);
      ctx.fillRect(1108, 296, 100, 244);
      ctx.fillRect(1302, 520, 98, 460);
      ctx.fillStyle = "#ffe9bd";
      for (let x = 0; x < WORLD_WIDTH; x += 48) {
        ctx.fillRect(x + 8, 450, 28, 10);
      }
      for (let y = 330; y < WORLD_HEIGHT; y += 46) ctx.fillRect(235, y, 28, 10);
    }

    drawHouse(ctx, house) {
      const { x, y, w, h } = house;
      ctx.fillStyle = "rgba(57, 59, 76, 0.18)";
      ctx.fillRect(x + 18, y + 24, w, h);
      ctx.fillStyle = house.wall;
      ctx.fillRect(x, y + 68, w, h - 68);
      ctx.fillStyle = house.trim;
      ctx.fillRect(x + 14, y + 86, w - 28, h - 102);
      ctx.fillStyle = house.roof;
      ctx.beginPath();
      ctx.moveTo(x - 18, y + 82);
      ctx.lineTo(x + w / 2, y);
      ctx.lineTo(x + w + 18, y + 82);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 5; i += 1) ctx.fillRect(x + 36 + i * 55, y + 55 + (i % 2) * 5, 22, 10);
      ctx.fillStyle = "#6e5163";
      ctx.fillRect(x + w / 2 - 28, y + h - 70, 56, 70);
      ctx.fillStyle = "#ffe066";
      ctx.fillRect(x + w / 2 + 13, y + h - 36, 7, 7);
      ctx.fillStyle = "#76c9e5";
      ctx.fillRect(x + 42, y + 112, 58, 46);
      ctx.fillRect(x + w - 100, y + 112, 58, 46);
      ctx.fillStyle = "#dff8ff";
      ctx.fillRect(x + 50, y + 120, 42, 30);
      ctx.fillRect(x + w - 92, y + 120, 42, 30);
      ctx.fillStyle = "#6d5363";
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "center";
      ctx.fillText(house.name, x + w / 2, y + h + 24);
      if (house.bow) this.drawBow(ctx, x + w / 2 + 68, y + 42, 1.2, "#ffd2df");
    }

    drawHedges(ctx) {
      const hedges = [
        { x: 58, y: 326, w: 120 }, { x: 350, y: 326, w: 100 },
        { x: 470, y: 326, w: 100 }, { x: 744, y: 326, w: 116 },
        { x: 950, y: 330, w: 110 }, { x: 1270, y: 330, w: 110 },
        { x: 1380, y: 390, w: 160 }
      ];
      hedges.forEach((hedge) => {
        ctx.fillStyle = "#3f9c62";
        ctx.fillRect(hedge.x, hedge.y, hedge.w, 28);
        ctx.fillStyle = "#6fca75";
        for (let x = hedge.x + 6; x < hedge.x + hedge.w; x += 22) ctx.fillRect(x, hedge.y - 8, 14, 16);
      });
    }

    drawTree(ctx, x, y, time) {
      const sway = Math.round(Math.sin(time / 520) * 2);
      ctx.fillStyle = "rgba(54, 66, 73, 0.18)";
      ctx.fillRect(x - 30, y + 30, 68, 16);
      ctx.fillStyle = "#8a5c45";
      ctx.fillRect(x - 10, y + 2, 20, 52);
      ctx.fillStyle = "#2f8f5b";
      ctx.fillRect(x - 42 + sway, y - 42, 84, 64);
      ctx.fillStyle = "#58bc69";
      ctx.fillRect(x - 31 + sway, y - 55, 62, 72);
      ctx.fillStyle = "#91dd7a";
      ctx.fillRect(x - 20 + sway, y - 45, 30, 22);
      ctx.fillStyle = "#ef557e";
      ctx.fillRect(x - 26 + sway, y - 22, 8, 8);
      ctx.fillRect(x + 18 + sway, y - 34, 8, 8);
    }

    drawPond(ctx, x, y) {
      ctx.fillStyle = "#f7e6b8";
      ctx.beginPath();
      ctx.ellipse(x, y, 194, 118, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#55c7dd";
      ctx.beginPath();
      ctx.ellipse(x, y, 176, 100, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#9ce8ea";
      ctx.fillRect(x - 96, y - 34, 66, 8);
      ctx.fillRect(x + 24, y + 28, 82, 8);
      ctx.fillStyle = "#64b85c";
      ctx.fillRect(x - 126, y + 22, 32, 13);
      ctx.fillRect(x + 110, y - 28, 34, 13);
      ctx.fillStyle = "#f8a7c1";
      ctx.fillRect(x - 114, y + 15, 12, 12);
      ctx.fillRect(x + 120, y - 36, 12, 12);
    }

    drawFountain(ctx, x, y, time) {
      ctx.fillStyle = "#d8eef2";
      ctx.beginPath();
      ctx.ellipse(x, y + 12, 66, 45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#5fcce0";
      ctx.beginPath();
      ctx.ellipse(x, y + 9, 50, 31, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff7f9";
      ctx.fillRect(x - 8, y - 43, 16, 54);
      const splash = Math.round(Math.sin(time / 170) * 5);
      ctx.fillStyle = "#c9f7ff";
      ctx.fillRect(x - 27, y - 28 - splash, 8, 18);
      ctx.fillRect(x + 20, y - 33 + splash, 8, 18);
    }

    drawMoonGarden(ctx, time) {
      ctx.fillStyle = "#8d65b9";
      ctx.fillRect(1380, 368, 170, 96);
      ctx.fillStyle = "#b98ee2";
      ctx.fillRect(1392, 380, 146, 72);
      for (let index = 0; index < 12; index += 1) {
        const x = 1402 + (index % 6) * 24;
        const y = 392 + Math.floor(index / 6) * 34;
        ctx.fillStyle = index % 2 ? "#fff0a8" : "#f3b2ef";
        ctx.fillRect(x, y + Math.sin(time / 300 + index) * 2, 9, 9);
      }
      ctx.fillStyle = "#fff4b8";
      ctx.beginPath();
      ctx.arc(1465, 415, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#b98ee2";
      ctx.beginPath();
      ctx.arc(1474, 407, 19, 0, Math.PI * 2);
      ctx.fill();
    }

    drawFlowers(ctx, time) {
      const patches = [
        [58, 560], [334, 660], [520, 540], [930, 850], [1480, 540], [850, 340], [42, 370]
      ];
      patches.forEach(([baseX, baseY], patch) => {
        for (let index = 0; index < 6; index += 1) {
          const x = baseX + (index % 3) * 18;
          const y = baseY + Math.floor(index / 3) * 20;
          ctx.fillStyle = "#388d55";
          ctx.fillRect(x + 4, y + 8, 3, 9);
          ctx.fillStyle = ["#ffffff", "#f7a8c5", "#ffe36d"][((patch + index) % 3)];
          ctx.fillRect(x, y + Math.sin(time / 360 + index) * 1.5, 11, 9);
        }
      });
    }

    drawSigns(ctx) {
      const signs = [
        { x: 330, y: 540, text: "MOON GARDEN  →" },
        { x: 1110, y: 548, text: "CAFE  ↓" },
        { x: 52, y: 860, text: "FRIENDSHIP VILLAGE" }
      ];
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      signs.forEach((sign) => {
        const width = ctx.measureText(sign.text).width + 24;
        ctx.fillStyle = "#8a5c45";
        ctx.fillRect(sign.x - width / 2, sign.y, width, 28);
        ctx.fillRect(sign.x - 4, sign.y + 28, 8, 22);
        ctx.fillStyle = "#fff5d5";
        ctx.fillText(sign.text, sign.x, sign.y + 19);
      });
    }

    drawCharacter(ctx, character, time) {
      const bob = Math.round(Math.sin(time / 260 + character.x * 0.01) * 2);
      if (character.id === "hello") this.drawHelloKitty(ctx, character.x, character.y + bob, character.step || this.player.step);
      else if (character.id === "kuromi") this.drawKuromi(ctx, character.x, character.y + bob);
      else if (character.id === "melody") this.drawMyMelody(ctx, character.x, character.y + bob);
      else if (character.id === "keroppi") this.drawKeroppi(ctx, character.x, character.y + bob);
      else this.drawCinnamoroll(ctx, character.x, character.y + bob);
    }

    drawShadow(ctx, x, y, width = 42) {
      ctx.fillStyle = "rgba(46, 61, 64, 0.2)";
      ctx.beginPath();
      ctx.ellipse(x, y + 25, width / 2, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    drawHelloKitty(ctx, x, y, step = 0) {
      this.drawShadow(ctx, x, y, 44);
      const foot = Math.sin(step) > 0 ? 3 : -3;
      ctx.fillStyle = "#df3f63";
      ctx.fillRect(x - 17, y + 5, 34, 29);
      ctx.fillStyle = "#4a8fd0";
      ctx.fillRect(x - 15, y + 18, 30, 20);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x - 24, y - 25, 48, 36);
      ctx.fillRect(x - 19, y - 36, 12, 14);
      ctx.fillRect(x + 7, y - 36, 12, 14);
      ctx.fillStyle = "#1d2230";
      ctx.fillRect(x - 12, y - 12, 5, 8);
      ctx.fillRect(x + 8, y - 12, 5, 8);
      ctx.fillStyle = "#f1c44f";
      ctx.fillRect(x - 3, y - 5, 7, 5);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x - 16 + foot, y + 35, 12, 8);
      ctx.fillRect(x + 4 - foot, y + 35, 12, 8);
      this.drawBow(ctx, x + 19, y - 27, 0.72, "#e83e64");
      ctx.fillStyle = "#29232d";
      ctx.fillRect(x - 31, y - 8, 12, 2);
      ctx.fillRect(x - 31, y - 2, 12, 2);
      ctx.fillRect(x + 19, y - 8, 12, 2);
      ctx.fillRect(x + 19, y - 2, 12, 2);
    }

    drawKuromi(ctx, x, y) {
      this.drawShadow(ctx, x, y, 44);
      ctx.fillStyle = "#1f1a2b";
      ctx.fillRect(x - 22, y - 28, 44, 44);
      ctx.beginPath();
      ctx.moveTo(x - 22, y - 25);
      ctx.lineTo(x - 35, y - 48);
      ctx.lineTo(x - 8, y - 29);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 22, y - 25);
      ctx.lineTo(x + 35, y - 48);
      ctx.lineTo(x + 8, y - 29);
      ctx.fill();
      ctx.fillStyle = "#fff7fb";
      ctx.fillRect(x - 17, y - 18, 34, 28);
      ctx.fillStyle = "#241b2a";
      ctx.fillRect(x - 10, y - 8, 5, 7);
      ctx.fillRect(x + 6, y - 8, 5, 7);
      ctx.fillStyle = "#ed72aa";
      ctx.fillRect(x - 3, y + 1, 7, 5);
      ctx.fillStyle = "#6b3f91";
      ctx.fillRect(x - 18, y + 14, 36, 27);
      ctx.fillStyle = "#f6a7cf";
      ctx.fillRect(x - 7, y - 28, 14, 12);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x - 3, y - 25, 6, 6);
      ctx.fillStyle = "#1f1a2b";
      ctx.fillRect(x - 16, y + 38, 12, 7);
      ctx.fillRect(x + 4, y + 38, 12, 7);
    }

    drawMyMelody(ctx, x, y) {
      this.drawShadow(ctx, x, y, 42);
      ctx.fillStyle = "#f58ab4";
      ctx.fillRect(x - 21, y - 28, 42, 40);
      ctx.fillRect(x - 19, y - 51, 13, 28);
      ctx.fillRect(x + 6, y - 51, 13, 28);
      ctx.fillStyle = "#fff9f5";
      ctx.fillRect(x - 16, y - 17, 32, 27);
      ctx.fillStyle = "#25212a";
      ctx.fillRect(x - 9, y - 8, 4, 6);
      ctx.fillRect(x + 6, y - 8, 4, 6);
      ctx.fillStyle = "#f3c64d";
      ctx.fillRect(x - 2, y, 5, 4);
      ctx.fillStyle = "#fff2f7";
      ctx.fillRect(x - 16, y + 12, 32, 30);
      ctx.fillStyle = "#ffe067";
      ctx.fillRect(x + 10, y - 32, 11, 11);
    }

    drawKeroppi(ctx, x, y) {
      this.drawShadow(ctx, x, y, 42);
      ctx.fillStyle = "#6ed56c";
      ctx.fillRect(x - 21, y - 20, 42, 36);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x - 18, y - 31, 15, 18);
      ctx.fillRect(x + 3, y - 31, 15, 18);
      ctx.fillStyle = "#20222a";
      ctx.fillRect(x - 11, y - 25, 5, 7);
      ctx.fillRect(x + 8, y - 25, 5, 7);
      ctx.fillStyle = "#ef5371";
      ctx.fillRect(x - 11, y + 1, 22, 6);
      ctx.fillStyle = "#f7efdf";
      ctx.fillRect(x - 17, y + 16, 34, 24);
      ctx.fillStyle = "#ef5371";
      ctx.fillRect(x - 17, y + 22, 34, 6);
    }

    drawCinnamoroll(ctx, x, y) {
      this.drawShadow(ctx, x, y, 48);
      ctx.fillStyle = "#fffdf9";
      ctx.fillRect(x - 22, y - 23, 44, 40);
      ctx.fillRect(x - 48, y - 18, 28, 12);
      ctx.fillRect(x + 20, y - 18, 28, 12);
      ctx.fillStyle = "#5da9d4";
      ctx.fillRect(x - 11, y - 10, 5, 8);
      ctx.fillRect(x + 7, y - 10, 5, 8);
      ctx.fillStyle = "#f3a9bd";
      ctx.fillRect(x - 17, y + 1, 8, 5);
      ctx.fillRect(x + 10, y + 1, 8, 5);
      ctx.fillStyle = "#7bc8e7";
      ctx.fillRect(x - 17, y + 17, 34, 24);
      ctx.fillStyle = "#fffdf9";
      ctx.fillRect(x - 15, y + 38, 12, 7);
      ctx.fillRect(x + 3, y + 38, 12, 7);
    }

    drawBow(ctx, x, y, scale, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x - 16 * scale, y - 9 * scale, 13 * scale, 18 * scale);
      ctx.fillRect(x + 3 * scale, y - 9 * scale, 13 * scale, 18 * scale);
      ctx.fillStyle = "#fff1f5";
      ctx.fillRect(x - 4 * scale, y - 6 * scale, 8 * scale, 12 * scale);
    }

    drawHideSparkles(ctx, spot, time) {
      for (let index = 0; index < 5; index += 1) {
        const angle = time / 430 + index * (Math.PI * 2 / 5);
        const radius = 28 + Math.sin(time / 260 + index) * 8;
        const x = spot.x + Math.cos(angle) * radius;
        const y = spot.y - 20 + Math.sin(angle) * radius * 0.45;
        ctx.fillStyle = index % 2 ? "#ffffff" : "#c785ff";
        ctx.fillRect(Math.round(x) - 4, Math.round(y) - 4, 8, 8);
      }
    }

    drawCompass(ctx, time) {
      let target = null;
      if (this.mode === "explore") target = this.kuromiMeeting;
      if (this.mode === "to-house") target = this.kuromiAtHouse;
      if (this.mode === "seeking" && this.timeLeft <= 25) target = this.activeHideSpot;
      if (!target) return;
      const screenX = target.x - this.camera.x;
      const screenY = target.y - this.camera.y;
      if (screenX > 52 && screenX < VIEW_WIDTH - 52 && screenY > 62 && screenY < VIEW_HEIGHT - 52) return;
      const centerX = VIEW_WIDTH / 2;
      const centerY = VIEW_HEIGHT / 2;
      const angle = Math.atan2(screenY - centerY, screenX - centerX);
      const radiusX = VIEW_WIDTH / 2 - 50;
      const radiusY = VIEW_HEIGHT / 2 - 58;
      const scale = Math.min(
        Math.abs(radiusX / (Math.cos(angle) || 0.001)),
        Math.abs(radiusY / (Math.sin(angle) || 0.001))
      );
      const x = centerX + Math.cos(angle) * scale;
      const y = centerY + Math.sin(angle) * scale;
      ctx.save();
      ctx.translate(x, y + Math.sin(time / 160) * 3);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillStyle = "#fff8fc";
      ctx.strokeStyle = "#6b3f91";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(14, 13);
      ctx.lineTo(0, 7);
      ctx.lineTo(-14, 13);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    drawPauseOverlay(ctx) {
      ctx.fillStyle = "rgba(56, 38, 66, 0.58)";
      ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.font = "bold 48px monospace";
      ctx.fillText("PAUSED", VIEW_WIDTH / 2, VIEW_HEIGHT / 2);
      ctx.font = "bold 18px monospace";
      ctx.fillText("Tap Resume when you're ready", VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 42);
    }
  }

  window.ArcadiaHelloKittyWorld = ArcadiaHelloKittyWorld;
})();
