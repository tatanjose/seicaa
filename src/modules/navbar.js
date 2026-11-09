/* =====================================================
   NAVBAR — fondo al hacer scroll, menú móvil y sección activa
   ===================================================== */
export function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const backTop = document.getElementById('back-top');
  if (!navbar || !hamburger || !navLinks) return;

  // --- Fondo sólido y botón "volver arriba" según el scroll (máx. 1 vez por frame)
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      navbar.classList.toggle('is-scrolled', y > 40);
      backTop?.classList.toggle('is-visible', y > 600);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0 });
    document.querySelector('.nav-logo')?.focus({ preventScroll: true });
  });

  // --- Menú móvil
  const setMenu = (open) => {
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    navLinks.classList.toggle('is-open', open);
    navbar.classList.toggle('is-menu-open', open);
  };

  hamburger.addEventListener('click', () => {
    setMenu(hamburger.getAttribute('aria-expanded') !== 'true');
  });
  navLinks.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
      setMenu(false);
      hamburger.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('is-open') && !navbar.contains(e.target)) setMenu(false);
  });
  window.matchMedia('(min-width: 769px)').addEventListener('change', (mq) => {
    if (mq.matches) setMenu(false);
  });

  // --- Marca en el menú la sección que se está viendo
  const links = [...navLinks.querySelectorAll('a[href^="#"]')];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((a) => {
          if (a.getAttribute('href') === id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => spy.observe(s));
}
