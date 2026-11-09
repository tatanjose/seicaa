/* =====================================================
   DETALLE DE PROYECTO — usa <dialog> nativo:
   atrapa el foco, cierra con Escape y devuelve el foco al cerrar.
   ===================================================== */
import { el, icon } from './utils.js';

const dialog = () => document.getElementById('project-dialog');
let lastTrigger = null;
let closeTimer = null;

export function projectMedia(proyecto, { eager = false } = {}) {
  if (proyecto.imagen) {
    return el('img', {
      src: proyecto.imagen,
      alt: proyecto.titulo || proyecto.nombre,
      loading: eager ? 'eager' : 'lazy',
      decoding: 'async',
    });
  }
  return el('div', { class: 'project-placeholder' }, [
    icon('fas fa-camera'),
    'Fotografía próximamente',
  ]);
}

export function openProject(proyecto, trigger) {
  const modal = dialog();
  if (!modal) return;
  clearTimeout(closeTimer);
  lastTrigger = trigger ?? document.activeElement;

  modal.querySelector('#modal-media').replaceChildren(projectMedia(proyecto, { eager: true }));
  modal.querySelector('#modal-tipo').textContent = proyecto.tipo;
  modal.querySelector('#modal-year').textContent = proyecto.anio;
  modal.querySelector('#modal-title').textContent = proyecto.nombre;
  modal.querySelector('#modal-desc').textContent = proyecto.descripcion;
  modal.querySelector('#modal-location').textContent = proyecto.ubicacion;
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

  // Clic en el fondo oscuro (fuera de la caja)
  modal.addEventListener('click', (e) => {
    if (!e.target.closest('.modal-box')) closeProject();
  });
}
