/* =====================================================
   DETALLE DE PROYECTO — usa <dialog> nativo:
   atrapa el foco, cierra con Escape y devuelve el foco al cerrar.
   La galería es la misma que usan las páginas de cada proyecto.
   ===================================================== */
import { el, icon } from './utils.js';
import { formatArea, urlProyecto } from './data.js';
import { galleryMarkup } from '../data/markup.js';
import { mountGallery } from './gallery.js';

const dialog = () => document.getElementById('project-dialog');
let lastTrigger = null;
let closeTimer = null;
let gallery = null;

/** Portada de la tarjeta: primera foto o aviso de "próximamente". */
export function projectMedia(proyecto) {
  const [portada] = proyecto.fotos;
  if (portada) {
    return el('img', { src: portada, alt: proyecto.titulo, loading: 'lazy', decoding: 'async' });
  }
  return el('div', { class: 'project-placeholder' }, [icon('fas fa-camera'), 'Fotografía próximamente']);
}

export function openProject(proyecto, trigger) {
  const modal = dialog();
  if (!modal) return;
  clearTimeout(closeTimer);
  lastTrigger = trigger ?? document.activeElement;

  const galleryRoot = modal.querySelector('#modal-gallery');
  gallery?.destroy();
  galleryRoot.innerHTML = galleryMarkup(proyecto.fotos, proyecto.titulo, { eager: true });
  gallery = mountGallery(galleryRoot, proyecto);

  const $ = (id) => modal.querySelector(id);
  $('#modal-tipo').textContent = proyecto.tipo;
  $('#modal-year').textContent = proyecto.anio ?? '';
  $('#modal-year').hidden = !proyecto.anio;
  $('#modal-title').textContent = proyecto.nombre;
  $('#modal-desc').textContent = proyecto.descripcion;
  $('#modal-location').textContent = proyecto.ubicacion;
  $('#modal-area').textContent = proyecto.area ? formatArea(proyecto.area) : '';
  $('#modal-area-row').hidden = !proyecto.area;
  $('#modal-page').href = urlProyecto(proyecto);
  $('#modal-share').dataset.share = urlProyecto(proyecto);
  $('#modal-share').dataset.shareTitle = `${proyecto.titulo} | SEICAA`;
  $('.modal-scroll').scrollTop = 0;

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

  // Clic en el fondo oscuro (fuera de la caja)
  modal.addEventListener('click', (e) => {
    if (!e.target.closest('.modal-box')) closeProject();
  });

  // Flechas del teclado para recorrer las fotos
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') gallery?.next();
    if (e.key === 'ArrowLeft') gallery?.prev();
  });
}
