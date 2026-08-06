const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');

function closeMenu() {
  if (!menuButton || !nav) return;

  nav.classList.remove('open');
  menuButton.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');

    menuButton.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

function setActiveNavigation() {
  const currentPage =
    window.location.pathname.split('/').pop() || 'index.html';

  let activeHref = currentPage;

  if (currentPage === 'index.html' || currentPage === '') {
    const sections = [
      'creators',
      'challenge',
      'memberships',
      'marketplace'
    ];

    let activeSection = '';

    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId);

      if (section && section.getBoundingClientRect().top <= 160) {
        activeSection = sectionId;
      }
    });

    activeHref = activeSection
      ? `index.html#${activeSection}`
      : 'index.html';
  }

  navLinks.forEach((link) => {
    const linkUrl = new URL(link.href, window.location.href);
    const linkPage = linkUrl.pathname.split('/').pop() || 'index.html';
    const linkHref = linkUrl.hash
      ? `${linkPage}${linkUrl.hash}`
      : linkPage;

    link.classList.toggle('active', linkHref === activeHref);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const destination = new URL(link.href, window.location.href);
    const currentPage =
      window.location.pathname.split('/').pop() || 'index.html';
    const destinationPage =
      destination.pathname.split('/').pop() || 'index.html';

    const samePage = destinationPage === currentPage;

    if (samePage && destination.hash) {
      const target = document.querySelector(destination.hash);

      if (target) {
        event.preventDefault();
        closeMenu();

        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        history.pushState(null, '', destination.hash);
        setActiveNavigation();
      }
    }
  });
});

window.addEventListener('scroll', setActiveNavigation, {
  passive: true
});

window.addEventListener('hashchange', setActiveNavigation);
window.addEventListener('load', setActiveNavigation);

document.querySelectorAll('.cast-card').forEach((card) => {
  const video = card.querySelector('video');

  if (!video) return;

  const play = () => {
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const stop = () => {
    video.pause();
    video.currentTime = 0;
  };

  card.addEventListener('mouseenter', play);
  card.addEventListener('mouseleave', stop);
  card.addEventListener('focusin', play);
  card.addEventListener('focusout', stop);

  card.addEventListener(
    'touchstart',
    () => {
      if (video.paused) {
        play();
      } else {
        stop();
      }
    },
    { passive: true }
  );
});