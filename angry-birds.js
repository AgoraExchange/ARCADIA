(() => {
  'use strict';
  class ArcadiaAngryBirds {
    constructor(options) {
      Object.assign(this, options);
      this.ready = false;
      this.started = false;
      this.paused = false;
      window.addEventListener('message', (event) => {
        if (event.origin !== location.origin || event.source !== this.frame.contentWindow || event.data?.source !== 'arcadia-angry-birds') return;
        if (event.data.type === 'ready') {
          clearTimeout(this.loadTimer);
          this.ready = true;
          this.status.textContent = 'Ready to launch';
          this.startButton.disabled = false;
          this.restartButton.disabled = false;
        }
        if (event.data.type === 'level-start' && this.started) this.onLevelStart?.(event.data.level);
        if (event.data.type === 'ability') {
          const active = Boolean(this.started && event.data.active);
          this.abilityControls?.classList.toggle('hidden', !active);
          this.hint?.classList.toggle('hidden', active);
          if (this.abilityButton) {
            this.abilityButton.disabled = !active || !event.data.ready;
            this.abilityButton.textContent = event.data.power || 'Power';
          }
          if (active && this.abilityLabel) {
            const name = event.data.character;
            const hint = event.data.paused ? 'Paused' : event.data.used ? 'Power used' : name === 'red' ? 'Classic shot' :
              event.data.ready ? 'Tap Power or press Space' : event.data.launched ? 'Shot finished' : 'Drag back and launch';
            this.abilityLabel.textContent = `${name[0].toUpperCase()}${name.slice(1)} · ${hint}`;
          }
        }
      });
      this.abilityButton?.addEventListener('click', () => this.api?.useAbility());
      window.addEventListener('keydown', (event) => {
        if (!this.started || event.code !== 'Space' || /^(INPUT|TEXTAREA|BUTTON)$/.test(event.target.tagName)) return;
        event.preventDefault();
        if (!event.repeat) this.api?.useAbility();
      });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && this.started && !this.paused) this.togglePause();
      });
    }
    get api() { return this.frame.contentWindow?.arcadiaAngryBirds; }
    load(version) {
      this.stop();
      this.version = version;
      this.cover.classList.remove('hidden');
      this.status.textContent = 'Loading Angry Birds…';
      this.startButton.textContent = 'Start Game';
      this.startButton.disabled = true;
      this.restartButton.disabled = true;
      this.pauseButton.disabled = true;
      this.pauseButton.textContent = 'Pause';
      this.frame.src = `games/angry-birds/index.html?arcadia=${encodeURIComponent(version)}`;
      this.loadTimer = setTimeout(() => {
        if (this.ready) return;
        this.status.textContent = 'Loading failed. Press Restart to try again.';
        this.restartButton.disabled = false;
      }, 60000);
    }
    start(options) {
      if (!this.ready || this.started || !this.api?.start(options)) return;
      this.started = true;
      this.cover.classList.add('hidden');
      this.startButton.textContent = 'Game Started';
      this.startButton.disabled = true;
      this.pauseButton.disabled = false;
    }
    restart(options) {
      if (!this.ready) { this.load(this.version); return; }
      if (!this.started) { this.start(options); return; }
      this.api?.restart();
      this.paused = false;
      this.pauseButton.textContent = 'Pause';
    }
    togglePause() {
      if (!this.started) return;
      this.paused = !this.paused;
      this.api?.pause(this.paused);
      this.pauseButton.textContent = this.paused ? 'Resume' : 'Pause';
    }
    setMuted(options) { if (this.ready) this.api?.setMuted(options); }
    stop() {
      clearTimeout(this.loadTimer);
      if (this.started) this.api?.pause(true);
      this.ready = this.started = this.paused = false;
      this.abilityControls?.classList.add('hidden');
      this.hint?.classList.remove('hidden');
      this.frame.src = 'about:blank';
    }
  }
  window.ArcadiaAngryBirds = ArcadiaAngryBirds;
})();
