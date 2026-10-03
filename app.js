/**
 * UN REGALO PARA NOAH
 * - Fondo de pétalos y motas con la paleta de 4 colores:
 *   Azul Marino, Verde Olivo, Gris Plomo, Amarillo Mostaza
 * - Reproductor de música (AURORA - Exist for Love)
 * - Transición de bienvenida
 */

// ==========================================================================
// 1. SIMULACIÓN DE CANVAS 2D (Pétalos en 4 colores: Azul, Olivo, Plomo, Mostaza)
// ==========================================================================
class PetalCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.motes = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Densidad armónica y presencia visible de los 4 colores
    this.petalCount = window.innerWidth < 768 ? 20 : 32;
    this.moteCount = window.innerWidth < 768 ? 22 : 40;

    // Sprites de Stardew Valley (Junimos animados y Pollitos Azules)
    this.junimoSheet = new Image();
    this.junimoSheet.src = 'assets/junimo_spritesheet.png';
    this.chickenImg = new Image();
    this.chickenImg.src = 'assets/blue_chicken.png';
    this.creatureCount = window.innerWidth < 768 ? 6 : 10;
    this.creatures = [];

    this.init();
    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  init() {
    this.resize();
    this.petals = [];
    for (let i = 0; i < this.petalCount; i++) {
      this.petals.push(this.createPetal(true));
    }
    this.motes = [];
    for (let i = 0; i < this.moteCount; i++) {
      this.motes.push(this.createMote(true));
    }
    this.creatures = [];
    for (let i = 0; i < this.creatureCount; i++) {
      this.creatures.push(this.createCreature(true));
    }
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
  }

  // Distribución balanceada de los 4 colores pedidos
  getRandomPaletteColor() {
    const r = Math.random();
    if (r < 0.25) {
      return 'marine';   // Azul marino / zafiro
    } else if (r < 0.50) {
      return 'olive';    // Verde olivo
    } else if (r < 0.75) {
      return 'mustard';  // Amarillo mostaza
    } else {
      return 'lead';     // Gris plomo
    }
  }

  createPetal(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -35,
      size: Math.random() * 12 + 10,
      speedY: Math.random() * 0.75 + 0.45,
      speedX: Math.random() * 0.6 - 0.3,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: (Math.random() - 0.5) * 0.02,
      flipAngle: Math.random() * Math.PI * 2,
      flipSpeed: Math.random() * 0.035 + 0.015, // Giro 3D para revoloteo natural
      curve: Math.random() * 0.45 + 0.35,
      alpha: Math.random() * 0.35 + 0.55,       // Opacidad más clara y distinguible
      colorType: this.getRandomPaletteColor(),
      swayOffset: Math.random() * Math.PI * 2
    };
  }

  createMote(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 10,
      radius: Math.random() * 1.8 + 0.7,
      speedY: -(Math.random() * 0.35 + 0.15),
      speedX: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.35,
      pulseSpeed: Math.random() * 0.025 + 0.01,
      pulseVal: Math.random() * Math.PI * 2,
      colorType: this.getRandomPaletteColor()
    };
  }

  createCreature(randomY = false) {
    const isChicken = Math.random() < 0.45;
    
    // 75% caen por los márgenes laterales y 25% caen sutilmente por el centro
    // para no tapar ni estorbar la lectura de la carta
    let x;
    const isMargin = Math.random() < 0.75;
    if (isMargin) {
      if (Math.random() < 0.5) {
        x = Math.random() * (this.width * 0.26); // Lateral izquierdo
      } else {
        x = this.width - Math.random() * (this.width * 0.26); // Lateral derecho
      }
    } else {
      x = this.width * 0.28 + Math.random() * (this.width * 0.44); // Centro
    }

    return {
      type: isChicken ? 'chicken' : 'junimo',
      x: x,
      y: randomY ? Math.random() * this.height : -55,
      size: isChicken ? (Math.random() * 8 + 32) : (Math.random() * 8 + 30),
      speedY: Math.random() * 0.42 + 0.32, // Descenso flotante y pausado
      speedX: (Math.random() - 0.5) * 0.3,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.012,
      swayAmp: Math.random() * 0.8 + 0.4,
      frame: Math.floor(Math.random() * 4),
      frameTimer: 0,
      frameDelay: Math.floor(Math.random() * 4 + 10),
      // En los laterales son más vivos, en el centro tienen opacidad sutil
      alpha: isMargin ? (Math.random() * 0.2 + 0.68) : (Math.random() * 0.15 + 0.42),
      isMargin: isMargin
    };
  }

  drawCreature(c) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(c.x, c.y);

    // Mecerse suavemente al caer
    const tilt = Math.sin(c.sway) * 0.12;
    ctx.rotate(tilt);

    // Si es pollito, orientarlo hacia donde flota
    if (c.type === 'chicken') {
      const flipX = Math.sin(c.sway) > 0 ? 1 : -1;
      ctx.scale(flipX, 1);
    }

    ctx.globalAlpha = c.alpha;
    ctx.imageSmoothingEnabled = false; // Pixel-art nítido sin borrosidad

    if (c.type === 'junimo' && this.junimoSheet.complete && this.junimoSheet.naturalWidth > 0) {
      const sx = c.frame * 48;
      ctx.drawImage(
        this.junimoSheet,
        sx, 0, 48, 48,
        -c.size / 2, -c.size / 2, c.size, c.size
      );
    } else if (c.type === 'chicken' && this.chickenImg.complete && this.chickenImg.naturalWidth > 0) {
      ctx.drawImage(
        this.chickenImg,
        -c.size / 2, -c.size / 2, c.size, c.size
      );
    }

    ctx.restore();
  }

  drawPetal(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);

    // Efecto 3D de volteo de pétalo al caer
    const flipScale = Math.cos(p.flipAngle);
    ctx.scale(flipScale, 1);

    // Silueta estilizada de pétalo alargado de Lycoris
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * p.curve, -p.size * 0.3, p.size * 0.35, p.size * 0.7, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.3, p.size * 0.7, -p.size * p.curve, -p.size * 0.3, 0, -p.size);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);

    if (p.colorType === 'marine') {
      // 1. Azul Marino / Zafiro profundo con punta luminosa
      grad.addColorStop(0, `rgba(96, 205, 255, ${p.alpha * 0.95})`);
      grad.addColorStop(0.5, `rgba(37, 99, 235, ${p.alpha * 0.85})`);
      grad.addColorStop(1, `rgba(18, 50, 130, ${p.alpha * 0.65})`);
    } else if (p.colorType === 'olive') {
      // 2. Verde Olivo cálido y natural
      grad.addColorStop(0, `rgba(168, 208, 120, ${p.alpha * 0.95})`);
      grad.addColorStop(0.5, `rgba(110, 142, 75, ${p.alpha * 0.85})`);
      grad.addColorStop(1, `rgba(74, 98, 48, ${p.alpha * 0.65})`);
    } else if (p.colorType === 'mustard') {
      // 3. Amarillo Mostaza dorado y otoñal
      grad.addColorStop(0, `rgba(255, 218, 110, ${p.alpha * 0.98})`);
      grad.addColorStop(0.5, `rgba(230, 168, 34, ${p.alpha * 0.88})`);
      grad.addColorStop(1, `rgba(175, 110, 16, ${p.alpha * 0.65})`);
    } else {
      // 4. Gris Plomo con destellos plateados
      grad.addColorStop(0, `rgba(226, 232, 240, ${p.alpha * 0.95})`);
      grad.addColorStop(0.5, `rgba(148, 163, 184, ${p.alpha * 0.85})`);
      grad.addColorStop(1, `rgba(80, 95, 115, ${p.alpha * 0.65})`);
    }

    ctx.fillStyle = grad;
    ctx.fill();

    // Sutil filamento / nervadura central del pétalo
    ctx.beginPath();
    ctx.moveTo(0, -p.size * 0.7);
    ctx.lineTo(0, p.size * 0.8);
    ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.25})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();

    ctx.restore();
  }

  drawMote(m) {
    const ctx = this.ctx;
    const currentAlpha = Math.max(0.12, Math.sin(m.pulseVal) * m.alpha);
    
    let color = `rgba(96, 205, 255, ${currentAlpha})`;
    if (m.colorType === 'olive') {
      color = `rgba(168, 208, 120, ${currentAlpha})`;
    } else if (m.colorType === 'mustard') {
      color = `rgba(255, 218, 110, ${currentAlpha})`;
    } else if (m.colorType === 'lead') {
      color = `rgba(226, 232, 240, ${currentAlpha})`;
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Motas de luz estelar de fondo
    for (let i = 0; i < this.motes.length; i++) {
      const m = this.motes[i];
      m.pulseVal += m.pulseSpeed;
      m.x += m.speedX;
      m.y += m.speedY;

      if (m.y < -10 || m.x < -10 || m.x > this.width + 10) {
        this.motes[i] = this.createMote(false);
      } else {
        this.drawMote(m);
      }
    }

    // 2. Junimos y Pollitos de Stardew flotando y cayendo atrás
    for (let i = 0; i < this.creatures.length; i++) {
      const c = this.creatures[i];
      c.sway += c.swaySpeed;
      c.x += c.speedX + Math.sin(c.sway) * c.swayAmp;
      c.y += c.speedY;

      if (c.type === 'junimo') {
        c.frameTimer++;
        if (c.frameTimer >= c.frameDelay) {
          c.frameTimer = 0;
          c.frame = (c.frame + 1) % 4;
        }
      }

      if (c.y > this.height + 60 || c.x < -60 || c.x > this.width + 60) {
        this.creatures[i] = this.createCreature(false);
      } else {
        this.drawCreature(c);
      }
    }

    // 3. Pétalos multicolor revoloteando en 3D
    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      p.swayOffset += 0.015;
      p.flipAngle += p.flipSpeed;
      p.x += p.speedX + Math.sin(p.swayOffset) * 0.65;
      p.y += p.speedY;
      p.angle += p.angularSpeed;

      if (p.y > this.height + 35 || p.x < -35 || p.x > this.width + 35) {
        this.petals[i] = this.createPetal(false);
      } else {
        this.drawPetal(p);
      }
    }

    requestAnimationFrame(this.animate);
  }
}

// ==========================================================================
// 2. REPRODUCTOR DE MÚSICA SUTIL (AURORA - Exist for Love)
// ==========================================================================
class AudioPlayer {
  constructor() {
    this.btn = document.getElementById('playPauseBtn');
    this.icon = document.getElementById('musicIcon');
    this.fallbackAudio = document.getElementById('fallbackAudio');
    this.isPlaying = false;
    this.ytPlayer = null;
    this.ytReady = false;
    this.wantsToPlay = false;

    this.initYouTube();
    this.bindEvents();
  }

  initYouTube() {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const init = () => {
      try {
        this.ytPlayer = new YT.Player('ytPlayer', {
          height: '200',
          width: '200',
          videoId: '7YDkrJaiCrw',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: '7YDkrJaiCrw',
            playsinline: 1,
            rel: 0,
            origin: window.location.origin && window.location.origin !== 'null' ? window.location.origin : undefined
          },
          events: {
            onReady: (e) => {
              this.ytReady = true;
              try {
                e.target.unMute();
                e.target.setVolume(100);
              } catch (err) {}

              // Si el usuario ya dio clic en "Entrar", arrancar la música inmediatamente
              if (this.wantsToPlay) {
                this.executePlay();
              }
            },
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.PLAYING) {
                this.updateUI(true);
              } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
                this.updateUI(false);
              }
            },
            onError: (e) => {
              console.warn('YouTube Player warning/error code:', e.data);
              if (this.fallbackAudio && this.wantsToPlay) {
                this.fallbackAudio.play().catch(() => {});
              }
            }
          }
        });
      } catch (err) {
        console.warn('Error inicializando reproductor:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      init();
    } else {
      window.onYouTubeIframeAPIReady = init;
    }
  }

  bindEvents() {
    if (this.btn) {
      this.btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }

    if (this.fallbackAudio) {
      this.fallbackAudio.addEventListener('play', () => this.updateUI(true));
      this.fallbackAudio.addEventListener('pause', () => this.updateUI(false));
    }

    // Si el navegador bloqueó el autoplay en el botón de entrar, reactivar en el siguiente toque/clic
    const unlockOnGesture = () => {
      if (this.wantsToPlay && !this.isPlaying) {
        this.executePlay();
      }
    };
    window.addEventListener('click', unlockOnGesture, { passive: true });
    window.addEventListener('touchstart', unlockOnGesture, { passive: true });
  }

  executePlay() {
    if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
      try {
        this.ytPlayer.unMute();
        this.ytPlayer.setVolume(100);
        this.ytPlayer.playVideo();
        this.updateUI(true);
        return true;
      } catch (err) {
        console.warn('Fallo al ejecutar playVideo:', err);
      }
    }

    // Fallback directo por postMessage al iframe
    const iframe = document.querySelector('#ytContainer iframe');
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }), '*');
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
        this.updateUI(true);
        return true;
      } catch (e) {}
    }

    if (this.fallbackAudio) {
      this.fallbackAudio.play().then(() => {
        this.updateUI(true);
      }).catch(() => {});
    }

    return false;
  }

  play() {
    this.wantsToPlay = true;
    this.executePlay();
  }

  pause() {
    this.wantsToPlay = false;
    if (this.ytReady && this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      try {
        this.ytPlayer.pauseVideo();
      } catch (err) {}
    }

    const iframe = document.querySelector('#ytContainer iframe');
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
      } catch (e) {}
    }

    if (this.fallbackAudio && !this.fallbackAudio.paused) {
      this.fallbackAudio.pause();
    }
    this.updateUI(false);
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  updateUI(playing) {
    this.isPlaying = playing;
    if (this.btn) {
      this.btn.classList.toggle('playing', playing);
    }
    if (this.icon) {
      this.icon.textContent = playing ? '⏸' : '♪';
    }
  }
}

// ==========================================================================
// 3. INICIALIZACIÓN
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const canvas = new PetalCanvas('petalCanvas');
  const player = new AudioPlayer();

  const introModal = document.getElementById('introModal');
  const btnEnter = document.getElementById('btnEnter');

  if (btnEnter && introModal) {
    btnEnter.addEventListener('click', () => {
      player.play();
      introModal.classList.add('fade-out');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
