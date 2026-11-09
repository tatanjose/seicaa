/** true si la persona pidió menos movimiento en su sistema operativo. */
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Crea un elemento del DOM de forma segura (el texto nunca se interpreta como HTML).
 *   el('p', { class: 'x' }, 'Hola')
 *   el('div', {}, [el('span', {}, 'a'), 'texto'])
 */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === false || value == null) continue;
    if (key === 'class') node.className = value;
    else if (key === 'style') node.style.cssText = value;
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of [].concat(children)) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

/** Icono de Font Awesome decorativo (oculto para lectores de pantalla). */
export const icon = (classes) => el('i', { class: classes, 'aria-hidden': 'true' });
