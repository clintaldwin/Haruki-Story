// ═══════════════════════════════════
// MAIN.JS — Navigation, Scroll, Theme
// ═══════════════════════════════════

(function () {
  'use strict';

  // ── Scrolled nav ──────────────────
  const nav = document.querySelector('.site-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── Hamburger menu ────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Back to top ───────────────────
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Page load animation ───────────
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .5s ease';
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

  // ── Reading progress ──────────────
  // Saved in localStorage by chapter
  function markChapterRead(chapterKey) {
    try {
      const read = JSON.parse(localStorage.getItem('haruki_read') || '{}');
      read[chapterKey] = true;
      localStorage.setItem('haruki_read', JSON.stringify(read));
    } catch (e) {}
  }

  function isChapterRead(chapterKey) {
    try {
      const read = JSON.parse(localStorage.getItem('haruki_read') || '{}');
      return !!read[chapterKey];
    } catch (e) { return false; }
  }

  // Expose to other scripts
  window.HarukiNovel = { markChapterRead, isChapterRead };

  // ── Active nav link ───────────────
  const currentPath = window.location.pathname;
  document.querySelectorAll('.site-nav__links a, .mobile-nav a').forEach(a => {
    if (a.getAttribute('href') && currentPath.endsWith(a.getAttribute('href').replace('../', '').replace('./', ''))) {
      a.classList.add('active');
    }
  });

})();