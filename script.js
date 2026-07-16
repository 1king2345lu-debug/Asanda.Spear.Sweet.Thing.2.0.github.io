/**
 * Will You Be My Valentine? — app logic
 * Organized as small focused modules (no frameworks, just vanilla JS).
 */
(() => {
  'use strict';

  /* ---------------------------------------------------------------------
   * Stage scaler — keeps the 960x540 "slide" pixel-perfect at any size
   * ------------------------------------------------------------------- */
  const Stage = {
    el: document.getElementById('stage'),
    viewport: document.getElementById('viewport'),
    baseW: 960,
    baseH: 540,

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());
      window.addEventListener('orientationchange', () => this.resize());
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => this.resize());
      }
    },

    resize() {
      const vw = this.viewport.clientWidth;
      const vh = this.viewport.clientHeight;
      const scale = Math.min(vw / this.baseW, vh / this.baseH);
      document.documentElement.style.setProperty('--scale', scale.toFixed(4));
    },
  };

  /* ---------------------------------------------------------------------
   * Router — one screen visible at a time, no page reloads
   * ------------------------------------------------------------------- */
  const Router = {
    screens: Array.from(document.querySelectorAll('.screen')),
    dots: Array.from(document.querySelectorAll('#progress span[aria-current], #progress span:not([aria-current])')).filter(
      (el) => el.tagName === 'SPAN' && !el.classList.contains('sr-only')
    ),
    liveRegion: document.getElementById('progress-live'),
    current: 'screen-1',
    history: [],

    init() {
      this.screens.forEach((s) => s.classList.remove('is-active'));
      document.getElementById(this.current).classList.add('is-active');
      this.updateDots();

      document.querySelectorAll('[data-goto]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const target = e.currentTarget.getAttribute('data-goto');
          const choice = e.currentTarget.getAttribute('data-choice');
          this.go(target, choice);
        });
      });

      // Keyboard support beyond native button activation: Enter/Space already
      // trigger click on <button> elements natively, so no extra wiring needed.
    },

    go(targetId, choice) {
      const from = document.getElementById(this.current);
      const to = document.getElementById(targetId);
      if (!to || targetId === this.current) return;

      from.classList.add('is-leaving');
      from.classList.remove('is-active');

      // Small delay lets the fade-out play before the new screen fades in.
      window.setTimeout(() => {
        from.classList.remove('is-leaving');
      }, 380);

      to.classList.add('is-active');
      this.current = targetId;
      this.updateDots();

      if (choice === 'yes' || targetId === 'screen-10') {
        Confetti.launch();
      }
    },

    updateDots() {
      const index = this.screens.findIndex((s) => s.id === this.current);
      this.dots.forEach((dot, i) => {
        dot.classList.toggle('is-current', i === index);
      });
      if (this.liveRegion) {
        this.liveRegion.textContent = `Slide ${index + 1} of ${this.screens.length}`;
      }
    },
  };

  /* ---------------------------------------------------------------------
   * Confetti — lightweight celebratory burst for the final screen
   * ------------------------------------------------------------------- */
  const Confetti = {
    colors: ['#ff5c8a', '#ffd166', '#06d6a0', '#4285f4', '#ff0000', '#00ff00'],

    launch() {
      const layer = document.getElementById('confetti-layer');
      if (!layer) return;
      layer.innerHTML = '';

      for (let i = 0; i < 36; i++) {
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        const left = Math.random() * 960;
        const delay = Math.random() * 400;
        const duration = 1800 + Math.random() * 1200;
        const color = this.colors[i % this.colors.length];

        piece.style.left = `${left.toFixed(1)}px`;
        piece.style.background = color;
        piece.style.animationDelay = `${delay}ms`;
        piece.style.animationDuration = `${duration}ms`;

        layer.appendChild(piece);
      }

      window.setTimeout(() => {
        layer.innerHTML = '';
      }, 3200);
    },
  };

  /* ---------------------------------------------------------------------
   * Splash / boot
   * ------------------------------------------------------------------- */
  function hideSplash() {
    const splash = document.getElementById('splash');
    if (!splash) return;
    splash.classList.add('is-hidden');
    window.setTimeout(() => splash.remove(), 500);
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').catch(() => {
          /* offline support is a progressive enhancement; ignore failures */
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    Stage.init();
    Router.init();
    registerServiceWorker();
    window.setTimeout(hideSplash, 250);
  });
})();
