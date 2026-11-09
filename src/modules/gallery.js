/* =====================================================
   GALERÍA — funciona sobre el HTML de galleryMarkup():
   flechas, miniaturas, teclado (← →) y deslizar en celular.
   ===================================================== */

export function mountGallery(root, { fotos, titulo }) {
  const controller = new AbortController();
  const { signal } = controller;
  const total = fotos.length;
  const img = root.querySelector('.gallery-img');
  let index = 0;

  const go = (next, { instant = false } = {}) => {
    if (!img || total < 2) return;
    index = (next + total) % total;
    const src = fotos[index];

    if (img.getAttribute('src') !== src) {
      // Cambio con fundido corto; con teclado es instantáneo (se usa muchas veces seguidas)
      img.classList.toggle('is-instant', instant);
      img.classList.add('is-swapping');
      img.onload = () => img.classList.remove('is-swapping');
      img.src = src;
      img.alt = `${titulo}, foto ${index + 1} de ${total}`;
    }

    const counter = root.querySelector('.gallery-counter');
    if (counter) counter.textContent = `${index + 1} / ${total}`;
    root.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
      const active = i === index;
      thumb.setAttribute('aria-current', String(active));
      if (active) thumb.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  };

  root.addEventListener(
    'click',
    (e) => {
      const nav = e.target.closest('.gallery-nav');
      if (nav) return go(index + Number(nav.dataset.step));
      const thumb = e.target.closest('.gallery-thumb');
      if (thumb) go(Number(thumb.dataset.index));
    },
    { signal },
  );

  // Deslizar con el dedo sobre la foto principal
  const main = root.querySelector('.gallery-main');
  let startX = null;
  main?.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') startX = e.clientX; }, { signal });
  main?.addEventListener('pointercancel', () => { startX = null; }, { signal });
  main?.addEventListener(
    'pointerup',
    (e) => {
      if (startX == null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    },
    { signal },
  );

  return {
    next: () => go(index + 1, { instant: true }),
    prev: () => go(index - 1, { instant: true }),
    destroy: () => controller.abort(),
  };
}
