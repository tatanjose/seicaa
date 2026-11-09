/* =====================================================
   REDES SOCIALES — se muestran solo las que tengan URL en config.js
   ===================================================== */
import { REDES } from '../config.js';
import { el, icon } from './utils.js';

const NETWORKS = {
  facebook: { label: 'Facebook', icon: 'fab fa-facebook-f' },
  instagram: { label: 'Instagram', icon: 'fab fa-instagram' },
  linkedin: { label: 'LinkedIn', icon: 'fab fa-linkedin-in' },
};

export function initSocial() {
  const container = document.getElementById('social-links');
  if (!container) return;

  const links = Object.entries(REDES)
    .filter(([key, url]) => NETWORKS[key] && /^https?:\/\//.test(url ?? ''))
    .map(([key, url]) =>
      el('a', {
        href: url,
        target: '_blank',
        rel: 'noopener',
        class: `social-btn ${key}`,
        'aria-label': `SEICAA en ${NETWORKS[key].label}`,
      }, icon(NETWORKS[key].icon)),
    );

  container.replaceChildren(...links);
  container.hidden = links.length === 0;
}
