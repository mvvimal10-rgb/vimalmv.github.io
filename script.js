/* ============================================================
   VIMAL M — PORTFOLIO JAVASCRIPT
   Features: Typing animation · Scroll reveal · Navbar ·
             Background canvas · Mobile menu
   ============================================================ */

/* ============================================================
   1. ANIMATED BACKGROUND CANVAS
      Subtle moving particles connected by faint lines
   ============================================================ */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx   = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const PARTICLE_COUNT  = 55;
  const CONNECT_DIST    = 160;
  const COLOR_PRIMARY   = 'rgba(0, 198, 255,';
  const COLOR_SECONDARY = 'rgba(0, 114, 255,';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r  = Math.random() * 1.5 + 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = COLOR_PRIMARY + '0.5)';
      ctx.fill();
    }
  }

  function buildParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      a.update();
      a.draw();
      for (let j = i + 1; j < particles.length; j++) {
        const b    = particles[j];
        const dx   = a.x - b.x;
        const dy   = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = COLOR_SECONDARY + alpha + ')';
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    resize();
    buildParticles();
  });

  resize();
  buildParticles();
  loop();
})();


/* ============================================================
   2. TYPING ANIMATION
   ============================================================ */
(function initTyping() {
  const target = document.getElementById('typed-text');
  if (!target) return;

  const phrases = [
    'Data Analyst.',
    'Databricks Certified Data Engineer.',
    'Microsoft Certified Fabric Data Engineer.',
    'BI Developer.',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let pauseTimer;

  const TYPE_SPEED   = 80;
  const DELETE_SPEED = 45;
  const PAUSE_AFTER  = 1800;
  const PAUSE_BEFORE = 300;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      // Typing
      charIdx++;
      target.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting   = true;
        pauseTimer = setTimeout(tick, PAUSE_AFTER);
        return;
      }
    } else {
      // Deleting
      charIdx--;
      target.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
    }

    setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  // Start after a short delay so it feels intentional
  setTimeout(tick, 900);
})();


/* ============================================================
   3. NAVBAR — SCROLL BEHAVIOUR + MOBILE MENU
   ============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const allLinks  = navLinks ? navLinks.querySelectorAll('a') : [];

  // Scroll class
  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    allLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (navLinks.classList.contains('open') &&
          !navLinks.contains(e.target) &&
          !hamburger.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
})();


/* ============================================================
   4. SCROLL REVEAL  (Intersection Observer)
   ============================================================ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ============================================================
   5. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
   ============================================================ */
(function initActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--text-primary)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


/* ============================================================
   6. LUCIDE ICONS INIT
      (runs after DOM is ready via the defer attribute)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
});

/* ---------- PHOTO HOVER → SWAP NAV LOGO ---------- */
(function initPhotoHover() {
  const photo  = document.getElementById('hero-photo');
  const navbar = document.getElementById('navbar');
  if (!photo || !navbar) return;

  photo.addEventListener('mouseenter', () => navbar.classList.add('photo-hovered'));
  photo.addEventListener('mouseleave', () => navbar.classList.remove('photo-hovered'));
})();