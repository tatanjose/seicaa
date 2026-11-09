/* =====================================================
   DETALLE DE PROYECTO — usa <dialog> nativo:
   atrapa el foco, cierra con Escape y devuelve el foco al cerrar.
   Incluye galería: miniaturas, flechas del teclado y botones.
   ===================================================== */
import { el, icon } from './utils.js';
import { formatArea } from './data.js';

const dialog = () => document.getElementById('project-dialog');
let lastTrigger = null;
let closeTimer = null;
let current = { proyecto: null, index: 0 };

/** Portada de la tarjeta: primera foto o aviso de "próximamente". */
export function projectMedia(proyecto) {
  const [portada] = proyecto.fotos;
  if (portada) {
    return el('img', { src: portada, alt: proyecto.titulo, loading: 'lazy', decoding: 'async' });
  }
  return el('div', { class: 'project-placeholder' }, [icon('fas fa-camera'), 'Fotografía próximamente']);
}

/* ---------- Galería ---------- */

function showPhoto(index, { instant = false } = {}) {
  const modal = dialog();
  const { proyecto } = current;
  const total = proyecto.fotos.length;
  if (!total) return;
  current.index = (index + total) % total;

  const img = modal.querySelector('.modal-photo');
  const src = proyecto.fotos[current.index];
  if (img.getAttribute('src') !== src) {
    // Cambio con fundido corto; con teclado es instantáneo (se usa muchas veces seguidas)
    img.classList.toggle('is-instant', instant);
    img.classList.add('is-swapping');
    img.onload = () => img.classList.remove('is-swapping');
    img.src = src;
    img.alt = `${proyecto.titulo}, foto ${current.index + 1} de ${total}`;
  }

  modal.querySelector('#modal-counter').textContent = `${current.index + 1} / ${total}`;
  modal.querySelectorAll('.modal-thumb').forEach((thumb, i) => {
    const active = i === current.index;
    thumb.setAttribute('aria-current', active ? 'true' : 'false');
    if (active) thumb.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  });
}

function buildGallery(proyecto) {
  const modal = dialog();
  const media = modal.querySelector('#modal-media');
  const thumbs = modal.querySelector('#modal-thumbs');
  const total = proyecto.fotos.length;

  if (!total) {
    media.replaceChildren(projectMedia(proyecto));
    thumbs.replaceChildren();
    thumbs.hidden = true;
    return;
  }

  const several = total > 1;
  // filter(Boolean): quita los botones que no aplican cuando hay una sola foto
  media.replaceChildren(...[
    el('img', { class: 'modal-photo', src: proyecto.fotos[0], alt: '', decoding: 'async' }),
    several && el('button', { class: 'gallery-nav prev', type: 'button', 'aria-label': 'Foto anterior', 'data-step': '-1' }, icon('fas fa-chevron-left')),
    several && el('button', { class: 'gallery-nav next', type: 'button', 'aria-label': 'Foto siguiente', 'data-step': '1' }, icon('fas fa-chevron-right')),
    several && el('span', { class: 'gallery-counter', id: 'modal-counter', 'aria-live': 'polite' }),
  ].filter(Boolean));

  thumbs.hidden = !several;
  thumbs.replaceChildren(
    ...(several
      ? proyecto.fotos.map((src, i) =>
          el('button', { class: 'modal-thumb', type: 'button', 'data-index': i, 'aria-label': `Ver foto ${i + 1} de ${total}` },
            el('img', { src, alt: '', loading: 'lazy', decoding: 'async' })),
        )
      : []),
  );

  if (!several) {
    media.querySelector('.modal-photo').alt = proyecto.titulo;
    return;
  }
  showPhoto(0, { instant: true });
}

/* ---------- Abrir / cerrar ---------- */

export function openProject(proyecto, trigger) {
  const modal = dialog();
  if (!modal) return;
  clearTimeout(closeTimer);
  lastTrigger = trigger ?? document.activeElement;
  current = { proyecto, index: 0 };

  buildGallery(proyecto);
  modal.querySelector('#modal-tipo').textContent = proyecto.tipo;
  modal.querySelector('#modal-year').textContent = proyecto.anio ?? '';
  modal.querySelector('#modal-year').hidden = !proyecto.anio;
  modal.querySelector('#modal-title').textContent = proyecto.nombre;
  modal.querySelector('#modal-desc').textContent = proyecto.descripcion;
  modal.querySelector('#modal-location').textContent = proyecto.ubicacion;
  modal.querySelector('#modal-area').textContent = proyecto.area ? formatArea(proyecto.area) : '';
  modal.querySelector('#modal-area-row').hidden = !proyecto.area;
  modal.querySelector('.modal-scroll').scrollTop = 0;

  if (!modal.open) modal.showModal();
  document.documentElement.classList.add('is-locked');
  // Siguiente frame: activa la transición de entrada
  requestAnimationFrame(() => modal.classList.add('is-open'));
}

export function closeProject() {
  const modal = dialog();
  if (!modal?.open) return;
  modal.classList.remove('is-open');
  // Espera a que termine la salida (160 ms) antes de cerrar de verdad
  closeTimer = setTimeout(() => {
    modal.close();
    document.documentElement.classList.remove('is-locked');
    lastTrigger?.focus?.({ preventScroll: true });
  }, 170);
}

export function initModal() {
  const modal = dialog();
  if (!modal) return;

  modal.querySelector('#modal-close')?.addEventListener('click', closeProject);

  // Escape: usamos nuestra salida animada en vez del cierre instantáneo
  modal.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeProject();
  });

  modal.addEventListener('click', (e) => {
    const nav = e.target.closest('.gallery-nav');
    if (nav) return showPhoto(current.index + Number(nav.dataset.step));
    const thumb = e.target.closest('.modal-thumb');
    if (thumb) return showPhoto(Number(thumb.dataset.index));
    // Clic en el fondo oscuro (fuera de la caja)
    if (!e.target.closest('.modal-box')) closeProject();
  });

  // Flechas del teclado para recorrer las fotos
  modal.addEventListener('keydown', (e) => {
    if ((current.proyecto?.fotos.length ?? 0) < 2) return;
    if (e.key === 'ArrowRight') showPhoto(current.index + 1, { instant: true });
    if (e.key === 'ArrowLeft') showPhoto(current.index - 1, { instant: true });
  });

  // Deslizar con el dedo en la foto principal (celulares)
  let startX = null;
  const media = modal.querySelector('#modal-media');
  media.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') startX = e.clientX;
  });
  media.addEventListener('pointerup', (e) => {
    if (startX == null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40 && (current.proyecto?.fotos.length ?? 0) > 1) {
      showPhoto(current.index + (dx < 0 ? 1 : -1));
    }
  });
  media.addEventListener('pointercancel', () => (startX = null));
}
