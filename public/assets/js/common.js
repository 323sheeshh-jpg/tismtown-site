(() => {
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('.nav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setMenuState = (open) => {
    if (!menuButton || !nav) return;
    nav.classList.toggle('open', open);
    menuButton.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      setMenuState(!nav.classList.contains('open'));
    });

    document.addEventListener('click', (event) => {
      if (!nav.classList.contains('open')) return;
      if (nav.contains(event.target) || menuButton.contains(event.target)) return;
      setMenuState(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1100) setMenuState(false);
    });
  }

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Video previews use delegation so dynamically-created Cast/Crew cards work too.
  const stopPreview = (card) => {
    const video = card?.querySelector('video');
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  document.addEventListener('pointerenter', (event) => {
    const card = event.target.closest?.('.cast-card');
    if (!card || event.pointerType === 'touch') return;
    const video = card.querySelector('video');
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, true);

  document.addEventListener('pointerleave', (event) => {
    const card = event.target.closest?.('.cast-card');
    if (!card || event.pointerType === 'touch') return;
    stopPreview(card);
  }, true);

  document.addEventListener('focusin', (event) => {
    const card = event.target.closest?.('.cast-card');
    const video = card?.querySelector('video');
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  });

  document.addEventListener('focusout', (event) => {
    const card = event.target.closest?.('.cast-card');
    if (card && !card.contains(event.relatedTarget)) stopPreview(card);
  });

  // Fade the current page only for real same-site page changes.
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link || event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    const rawHref = link.getAttribute('href');
    if (!rawHref || rawHref === '#') return;

    let destination;
    try {
      destination = new URL(link.href, window.location.href);
    } catch {
      return;
    }

    if (destination.origin !== window.location.origin) return;

    const current = new URL(window.location.href);
    const sameDocument =
      destination.pathname === current.pathname &&
      destination.search === current.search;

    // Same-page section navigation: close menu, then scroll smoothly.
    if (sameDocument && destination.hash) {
      const target = document.querySelector(destination.hash);
      if (!target) return;
      event.preventDefault();
      setMenuState(false);
      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });
      history.pushState(null, '', destination.hash);
      return;
    }

    event.preventDefault();
    setMenuState(false);

    if (reduceMotion) {
      window.location.href = destination.href;
      return;
    }

    document.body.classList.add('page-leaving');
    window.setTimeout(() => {
      window.location.href = destination.href;
    }, 150);
  });

  // Covers browser back/forward cache restores.
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-leaving');
    requestAnimationFrame(() => document.body.classList.add('page-ready'));
  });
})();