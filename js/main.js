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
