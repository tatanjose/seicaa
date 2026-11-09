/* =====================================================
   PROYECTOS — tarjetas y filtro por año
   Los datos viven en src/data/proyectos.json
   ===================================================== */
import { PROYECTOS, formatArea } from './data.js';
import { el, icon } from './utils.js';
import { openProject, projectMedia } from './modal.js';

function projectCard(proyecto, index) {
  const openBtn = el('button', { class: 'project-open', type: 'button' }, proyecto.titulo);
  const totalFotos = proyecto.fotos.length;

  const card = el('article', { class: 'project-card is-entering', style: `--i:${index}` }, [
    el('div', { class: 'project-media' }, [
      projectMedia(proyecto),
      el('span', { class: 'project-tag' }, proyecto.tipo),
      totalFotos > 1 &&
        el('span', { class: 'project-photos', 'aria-label': `${totalFotos} fotos` }, [icon('fas fa-images'), totalFotos]),
      el('span', { class: 'project-hint', 'aria-hidden': 'true' }, [icon('fas fa-eye'), 'Ver detalles']),
    ]),
    el('div', { class: 'project-info' }, [
      el('div', { class: 'project-meta' }, [
        el('span', { class: 'project-year' }, proyecto.anio),
        proyecto.area &&
          el('span', { class: 'project-area' }, [icon('fas fa-ruler-combined'), formatArea(proyecto.area)]),
      ]),
      el('h3', {}, openBtn),
      el('p', { class: 'project-desc' }, proyecto.descripcion),
      el('p', { class: 'project-location' }, [icon('fas fa-map-marker-alt'), proyecto.ubicacion]),
    ]),
  ]);

  openBtn.addEventListener('click', () => openProject(proyecto, openBtn));
  // Quita la clase de entrada al terminar, para que no se repita al volver a pintar
  card.addEventListener('animationend', () => card.classList.remove('is-entering'), { once: true });
  return card;
}

export function initProjects() {
  const grid = document.getElementById('projects-grid');
  const filterBar = document.getElementById('filter-bar');
  if (!grid || !filterBar) return;

  // Más recientes primero; dentro del mismo año, en el orden del archivo
  const proyectos = [...PROYECTOS].sort((a, b) => (b.anio ?? 0) - (a.anio ?? 0) || a.id - b.id);

  // Un botón por cada año que exista en los datos
  const years = [...new Set(proyectos.map((p) => p.anio).filter(Boolean))];
  if (years.length > 1) {
    years.forEach((year) => {
      filterBar.append(
        el('button', { class: 'filter-btn', type: 'button', 'data-year': year, 'aria-pressed': 'false' }, year),
      );
    });
  } else {
    filterBar.hidden = true; // con un solo año el filtro no aporta nada
  }

  const render = (year) => {
    const list = year === 'all' ? proyectos : proyectos.filter((p) => p.anio === Number(year));
    grid.replaceChildren(
      ...(list.length
        ? list.map(projectCard)
        : [el('p', { class: 'projects-empty' }, 'No hay proyectos registrados para este año.')]),
    );
  };

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn || btn.getAttribute('aria-pressed') === 'true') return;
    filterBar.querySelectorAll('.filter-btn').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    render(btn.dataset.year);
  });

  render('all');
}
