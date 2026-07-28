// ============ EMBERS BACKGROUND ============
(function embers() {
  const canvas = document.getElementById('embers');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let particles = [];

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeParticles() {
    const count = window.innerWidth < 768 ? 30 : 60;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 0.6 + Math.random() * 1.6,
      driftX: (Math.random() - 0.5) * 0.15,
      driftY: -0.15 - Math.random() * 0.25,
      baseOpacity: 0.15 + Math.random() * 0.35,
      twinkleSpeed: 0.0008 + Math.random() * 0.0015,
      twinklePhase: Math.random() * Math.PI * 2
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((p) => {
      p.x += p.driftX;
      p.y += p.driftY;
      if (p.y < -10) { p.y = window.innerHeight + 10; p.x = Math.random() * window.innerWidth; }
      if (p.x < -10) p.x = window.innerWidth + 10;
      if (p.x > window.innerWidth + 10) p.x = -10;
      const twinkle = Math.sin(Date.now() * p.twinkleSpeed + p.twinklePhase);
      const opacity = Math.max(0, p.baseOpacity + twinkle * 0.2);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 162, 75, ${opacity})`;
      ctx.fill();
    });
    if (!reduceMotion) requestAnimationFrame(tick);
  }

  resize();
  makeParticles();
  window.addEventListener('resize', () => { resize(); makeParticles(); });
  tick();
})();

// ============ CONFETTI BURST ============
const burstConfetti = (function confettiSetup() {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  const colors = ['#C9A24B', '#8B4A2B', '#F5F1EA', '#E8C978'];
  let particles = [];
  let running = false;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((p) => {
      p.vy += 0.12;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;
      p.life -= 1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
      ctx.restore();
    });
    particles = particles.filter((p) => p.life > 0 && p.y < window.innerHeight + 40);
    if (particles.length) {
      requestAnimationFrame(tick);
    } else {
      running = false;
    }
  }

  return function burst(x, y) {
    if (reduceMotion) return;
    const originX = x != null ? x : window.innerWidth / 2;
    const originY = y != null ? y : window.innerHeight / 2;
    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed * 0.6,
        vy: Math.sin(angle) * speed - 4,
        size: 5 + Math.random() * 6,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 70 + Math.random() * 30,
        maxLife: 100
      });
    }
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  };
})();

// ============ BOOKING FORM — CONFETTI + INLINE SUCCESS ============
(function bookingForm() {
  const form = document.getElementById('bookingForm');
  const success = document.getElementById('bookingSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const rect = btn.getBoundingClientRect();
    burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);

    // Best-effort background submit — action currently points at a placeholder
    // Formspree endpoint (see README.md) and is expected to fail until replaced.
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).catch(() => {});

    form.hidden = true;
    success.hidden = false;
  });
})();

// ============ LIQUID BLOB — LOW-END DEVICE GATE ============
(function liquidGate() {
  const el = document.getElementById('liquidWrap');
  if (!el) return;
  const lowEnd = (navigator.hardwareConcurrency || 8) <= 2;
  if (lowEnd) el.classList.add('hidden');
})();

// ============ LOADER ============
(function loader() {
  const loaderEl = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  let pct = 0;
  const iv = setInterval(() => {
    pct += 8 + Math.random() * 12;
    if (pct >= 100) {
      pct = 100;
      bar.style.width = '100%';
      clearInterval(iv);
      setTimeout(() => {
        loaderEl.style.transition = 'opacity 0.6s ease';
        loaderEl.style.opacity = '0';
        setTimeout(() => (loaderEl.style.display = 'none'), 600);
      }, 200);
      return;
    }
    bar.style.width = pct + '%';
  }, 90);
})();

// ============ SCROLL PROGRESS + NAVBAR ============
(function scrollChrome() {
  const progress = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = pct + '%';
    navbar.classList.toggle('nav-scrolled', window.scrollY > 80);
  }, { passive: true });
})();

// ============ TRAILER SCROLL STORY (annotation cards + snap-stop) ============
(function scrollStory() {
  const section = document.querySelector('.scroll-story');
  if (!section) return;
  const cards = Array.from(document.querySelectorAll('.annotation-card'));
  const zones = cards.map((card) => ({
    show: parseFloat(card.dataset.show),
    hide: parseFloat(card.dataset.hide),
    snapped: false
  }));
  const HOLD_DURATION = 550;
  let isSnapping = false;
  let ticking = false;

  function update() {
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    const progress = Math.min(1, Math.max(0, -rect.top / scrollable));

    cards.forEach((card, i) => {
      const zone = zones[i];
      const visible = progress >= zone.show && progress <= zone.hide;
      card.classList.toggle('visible', visible);

      if (visible && !zone.snapped && !isSnapping) {
        zone.snapped = true;
        isSnapping = true;
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
          document.body.style.overflow = '';
          isSnapping = false;
        }, HOLD_DURATION);
      }
      if (!visible) zone.snapped = false;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();

// ============ SPECS COUNT-UP ============
(function specs() {
  const section = document.getElementById('specs');
  if (!section) return;

  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  function countUp(el, target, suffix, duration = 1800) {
    const start = performance.now();
    el.classList.add('counting');
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = eased * target;
      el.textContent = Math.floor(current) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
        el.classList.remove('counting');
      }
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.spec-item');
        items.forEach((item, i) => {
          setTimeout(() => {
            const numEl = item.querySelector('.spec-number');
            const target = parseFloat(item.dataset.target);
            const suffix = item.dataset.suffix || '';
            countUp(numEl, target, suffix);
          }, i * 180);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  observer.observe(section);
})();

// ============ TESTIMONIALS DRAG-TO-SCROLL ============
(function dragScroll() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;
  let isDown = false, startX, scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  track.addEventListener('mouseleave', () => (isDown = false));
  track.addEventListener('mouseup', () => (isDown = false));
  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX);
  });
})();

// ============ CARD SCANNER — 3D PARTICLE GLASS ============
(function cardScanner() {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('scannerCanvas');
  if (!canvas) return;
  const lowEnd = (navigator.hardwareConcurrency || 8) <= 2;
  if (lowEnd) { canvas.style.display = 'none'; return; }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PARTICLE_COUNT = window.innerWidth < 768 ? 1200 : 2400;

  // Sample a coupe-glass silhouette from an offscreen 2D canvas into particle targets.
  function sampleGlassPoints(count) {
    const w = 220, h = 300;
    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const octx = off.getContext('2d');
    octx.fillStyle = '#000';
    octx.fillRect(0, 0, w, h);
    octx.fillStyle = '#fff';
    octx.beginPath();
    // Coupe bowl
    octx.moveTo(30, 40);
    octx.quadraticCurveTo(30, 130, 110, 150);
    octx.quadraticCurveTo(190, 130, 190, 40);
    octx.quadraticCurveTo(190, 20, 110, 20);
    octx.quadraticCurveTo(30, 20, 30, 40);
    octx.closePath();
    octx.fill();
    // Stem
    octx.fillRect(104, 150, 12, 100);
    // Base
    octx.beginPath();
    octx.ellipse(110, 262, 46, 10, 0, 0, Math.PI * 2);
    octx.fill();

    const data = octx.getImageData(0, 0, w, h).data;
    const candidates = [];
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const idx = (y * w + x) * 4;
        if (data[idx] > 128) candidates.push({ x: x - w / 2, y: h / 2 - y });
      }
    }
    const points = [];
    for (let i = 0; i < count; i++) {
      const c = candidates[Math.floor(Math.random() * candidates.length)];
      points.push({
        x: (c.x / w) * 220 + (Math.random() - 0.5) * 3,
        y: (c.y / h) * 260 + (Math.random() - 0.5) * 3,
        z: (Math.random() - 0.5) * 24
      });
    }
    return points;
  }

  const targets = sampleGlassPoints(PARTICLE_COUNT);
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const startPositions = [];
  const delays = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r = 260 + Math.random() * 140;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const sx = r * Math.sin(phi) * Math.cos(theta);
    const sy = r * Math.sin(phi) * Math.sin(theta);
    const sz = r * Math.cos(phi);
    startPositions.push({ x: sx, y: sy, z: sz });
    delays.push(Math.random() * 0.5);
    positions[i * 3] = reduceMotion ? targets[i].x : sx;
    positions[i * 3 + 1] = reduceMotion ? targets[i].y : sy;
    positions[i * 3 + 2] = reduceMotion ? targets[i].z : sz;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xc9a24b,
    size: 2.4,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const points = new THREE.Points(geometry, material);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000);
  camera.position.z = 320;
  scene.add(points);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  window.addEventListener('resize', resize);

  let assembling = false;
  let assembleStart = 0;
  const ASSEMBLE_MS = 2200;
  const posAttr = geometry.attributes.position;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animate(now) {
    if (assembling && !reduceMotion) {
      const globalT = Math.min(1, (now - assembleStart) / ASSEMBLE_MS);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const localT = Math.max(0, Math.min(1, (globalT - delays[i]) / (1 - delays[i])));
        const e = easeOutCubic(localT);
        const sp = startPositions[i];
        const tp = targets[i];
        posAttr.array[i * 3] = sp.x + (tp.x - sp.x) * e;
        posAttr.array[i * 3 + 1] = sp.y + (tp.y - sp.y) * e;
        posAttr.array[i * 3 + 2] = sp.z + (tp.z - sp.z) * e;
      }
      posAttr.needsUpdate = true;
      if (globalT >= 1) assembling = false;
    } else if (!reduceMotion) {
      points.rotation.y += 0.0018;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        assembling = true;
        assembleStart = performance.now();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(document.getElementById('card-scanner'));
})();

// ============ GSAP SCROLL REVEALS ============
(function reveals() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const groups = [
    '#services .section-title, #services .section-subtitle',
    '#menu .section-title, #menu .section-subtitle',
    '#gallery .section-title, #gallery .section-subtitle',
    '#testimonials .section-title, #testimonials .section-subtitle',
    '.booking-content h2, .booking-content > p'
  ];
  groups.forEach((sel) => {
    gsap.utils.toArray(sel).forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
  });

  gsap.utils.toArray('.feature-card').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, y: 30, duration: 0.6, delay: (i % 3) * 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
  gsap.utils.toArray('.menu-item').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, y: 20, duration: 0.5, delay: (i % 3) * 0.08, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%' }
    });
  });
  gsap.utils.toArray('.gallery-tile').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, scale: 0.94, duration: 0.5, delay: (i % 3) * 0.08, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%' }
    });
  });
})();
