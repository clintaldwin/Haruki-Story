// ═══════════════════════════════════
// READER.JS — Progress Bar, Prev/Next
// ═══════════════════════════════════

(function () {
  'use strict';

  // ── Reading progress bar ──────────
  const bar = document.querySelector('.reading-bar');
  const proseWrap = document.querySelector('.prose-wrap');

  if (bar && proseWrap) {
    function updateBar() {
      const rect = proseWrap.getBoundingClientRect();
      const total = proseWrap.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const pct = Math.min(Math.max((scrolled / total) * 100, 0), 100);
      bar.style.width = pct + '%';

      // Mark as read when 90% through
      if (pct > 90 && window.HarukiNovel) {
        const key = document.body.dataset.chapter;
        if (key) window.HarukiNovel.markChapterRead(key);
      }
    }

    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
  }

  // ── Sidebar TOC active state ──────
  const sidebarLinks = document.querySelectorAll('.sidebar-toc__link');
  const proseHeadings = document.querySelectorAll('.prose h2, .prose h3');

  if (sidebarLinks.length && proseHeadings.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          sidebarLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -75% 0px' });

    proseHeadings.forEach(h => {
      if (h.id) observer.observe(h);
    });
  }

  // ── Keyboard navigation ───────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const dir = e.key === 'ArrowLeft' ? 'prev' : 'next';
      const link = document.querySelector(`.chapter-nav__item--${dir}`);
      if (link && link.href) {
        // Page transition
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity .35s ease';
        setTimeout(() => { window.location.href = link.href; }, 350);
      }
    }
  });

  // ── Animated chapter nav arrows ───
  document.querySelectorAll('.chapter-nav__item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const href = item.getAttribute('href');
      if (!href) return;
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity .4s ease';
      setTimeout(() => { window.location.href = href; }, 400);
    });
  });

  // ── Reading time ──────────────────
  const proseEl = document.querySelector('.prose');
  const rtEl = document.querySelector('.reading-time');

  if (proseEl && rtEl) {
    const words = proseEl.innerText.split(/\s+/).length;
    const mins = Math.ceil(words / 200);
    rtEl.textContent = `${mins} min read`;
  }

})();