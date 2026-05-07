// ═══════════════════════════════════
// ANIMATIONS.JS — Scroll-triggered, Parallax, Particles
// ═══════════════════════════════════

(function () {
  'use strict';

  // ── Paragraph fade-in ─────────────
  const proseParagraphs = document.querySelectorAll('.prose p, .prose .thought, .prose .blueprint, .prose .scripture, .prose .br, .prose .twist');

  if (proseParagraphs.length) {
    const paraObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          paraObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });

    proseParagraphs.forEach(p => paraObserver.observe(p));
  }

  // ── Reveal on scroll ─────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .stagger-children');

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ── Parallax (cover page) ─────────
  const parallaxLayers = document.querySelectorAll('[data-parallax]');

  if (parallaxLayers.length) {
    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      parallaxLayers.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || .5;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Cover particle field ──────────
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function makeParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height + canvas.height * .2,
        r: Math.random() * 1.5 + .3,
        speed: Math.random() * .4 + .15,
        drift: (Math.random() - .5) * .3,
        opacity: Math.random() * .5 + .2,
        gold: Math.random() > .5,
        life: 0,
        maxLife: Math.random() * 300 + 150,
      };
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < 100; i++) {
        const p = makeParticle();
        p.y = Math.random() * canvas.height;
        p.life = Math.random() * p.maxLife;
        particles.push(p);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${alpha})`
          : `rgba(244,240,230,${alpha * .6})`;
        ctx.fill();

        p.y -= p.speed;
        p.x += p.drift;
        p.life++;

        if (p.life >= p.maxLife || p.y < -10) {
          Object.assign(p, makeParticle());
          p.y = canvas.height + 10;
          p.life = 0;
        }
      });

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      init();
      draw();
    });

    // Pause when off-screen
    const coverObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (!animId) draw();
      } else {
        cancelAnimationFrame(animId);
        animId = null;
      }
    });
    coverObserver.observe(canvas);
  }

  // ── Chapter floating particles ────
  // Context-sensitive: notes, petals, code, etc.
  function initChapterParticles() {
    const container = document.getElementById('chapter-particles');
    if (!container) return;

    const type = container.dataset.type || 'dust';
    const count = 18;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'cp-particle';

      const size = Math.random() * 6 + 2;
      const delay = Math.random() * 8;
      const duration = Math.random() * 6 + 5;
      const left = Math.random() * 100;

      el.style.cssText = `
        position: absolute;
        left: ${left}%;
        bottom: ${Math.random() * 40}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        pointer-events: none;
        animation: floatUp ${duration}s ${delay}s ease-in infinite;
      `;

      if (type === 'notes') {
        el.textContent = '♩';
        el.style.borderRadius = '0';
        el.style.width = 'auto';
        el.style.height = 'auto';
        el.style.fontSize = `${Math.random() * 8 + 10}px`;
        el.style.color = `rgba(201,168,76,${Math.random() * .4 + .1})`;
        el.style.animation = `noteDrift ${duration}s ${delay}s ease-in infinite`;
      } else if (type === 'petals') {
        el.style.background = `rgba(184,104,120,${Math.random() * .4 + .1})`;
        el.style.borderRadius = '50% 0';
        el.style.transform = `rotate(${Math.random() * 360}deg)`;
        el.style.animation = `petalFall ${duration}s ${delay}s ease-in infinite`;
      } else if (type === 'code') {
        el.textContent = ['0','1','{','}','<','>','//'][Math.floor(Math.random()*7)];
        el.style.borderRadius = '0';
        el.style.width = 'auto';
        el.style.height = 'auto';
        el.style.fontSize = '10px';
        el.style.color = `rgba(74,184,200,${Math.random() * .3 + .05})`;
        el.style.fontFamily = 'monospace';
        el.style.animation = `codeRain ${duration * 1.5}s ${delay}s linear infinite`;
      } else {
        el.style.background = `rgba(201,168,76,${Math.random() * .3 + .05})`;
      }

      container.appendChild(el);
    }
  }

  initChapterParticles();

  // ── SVG element reveal ────────────
  document.querySelectorAll('.svg-animate').forEach(svg => {
    const elements = svg.querySelectorAll('[data-anim-order]');
    elements.forEach(el => {
      const order = parseInt(el.dataset.animOrder) || 0;
      el.style.opacity = '0';
      el.style.animation = `none`;
      setTimeout(() => {
        el.style.transition = `opacity .6s ease, transform .6s ease`;
        el.style.opacity = '1';
        el.style.transform = 'none';
      }, order * 200 + 300);
    });
  });

  // ── Title word-by-word animation ─
  document.querySelectorAll('.title-animate').forEach(el => {
    const words = el.textContent.trim().split(' ');
    el.innerHTML = words.map((w, i) =>
      `<span style="display:inline-block;animation:titleWord .7s ${i * .15}s ease both;">${w}</span>`
    ).join(' ');
  });

})();