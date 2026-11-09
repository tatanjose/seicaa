/* =====================================================
   APARICIONES — entrada del hero y bloques al hacer scroll
   ===================================================== */
export function initReveal() {
  // Entrada orquestada del hero (la única animación que no inicia la persona)
  const hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(() => hero.classList.add('is-ready'));

  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // solo la primera vez
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
  );
  items.forEach((item) => observer.observe(item));
}
