/* =====================================================
   HTML COMPARTIDO — lo usan la página (detalle de proyecto)
   y la compilación (páginas de cada proyecto).
   Todo el texto pasa por esc() para que nunca se interprete como HTML.
   ===================================================== */

export const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const placeholder = `
  <div class="project-placeholder">
    <i class="fas fa-camera" aria-hidden="true"></i>
    Fotografía próximamente
  </div>`;

/**
 * Galería: foto principal + flechas + contador + miniaturas.
 * Con una sola foto no lleva flechas ni miniaturas; sin fotos muestra el aviso.
 */
export function galleryMarkup(fotos, titulo, { eager = false } = {}) {
  if (!fotos.length) return `<div class="gallery-main">${placeholder}</div>`;

  const total = fotos.length;
  const several = total > 1;
  const alt = several ? `${titulo}, foto 1 de ${total}` : titulo;

  const main = `
  <div class="gallery-main">
    <img class="gallery-img" src="${esc(fotos[0])}" alt="${esc(alt)}" decoding="async"${eager ? ' fetchpriority="high"' : ''} />
    ${several ? `
    <button class="gallery-nav prev" type="button" data-step="-1" aria-label="Foto anterior"><i class="fas fa-chevron-left" aria-hidden="true"></i></button>
    <button class="gallery-nav next" type="button" data-step="1" aria-label="Foto siguiente"><i class="fas fa-chevron-right" aria-hidden="true"></i></button>
    <span class="gallery-counter" aria-live="polite">1 / ${total}</span>` : ''}
  </div>`;

  const thumbs = several
    ? `
  <div class="gallery-thumbs" role="group" aria-label="Fotos del proyecto">
    ${fotos
      .map(
        (src, i) => `<button class="gallery-thumb" type="button" data-index="${i}" aria-label="Ver foto ${i + 1} de ${total}" aria-current="${i === 0}"><img src="${esc(src)}" alt="" loading="lazy" decoding="async" /></button>`,
      )
      .join('\n    ')}
  </div>`
    : '';

  return main + thumbs;
}
