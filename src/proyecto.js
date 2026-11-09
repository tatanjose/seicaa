/* =====================================================
   PÁGINA DE UN PROYECTO — /proyectos/<slug>
   El contenido ya viene en el HTML (lo crea vite.config.js);
   aquí solo se activan el menú, la galería y el botón de compartir.
   ===================================================== */
import './styles/main.css';
import './styles/proyecto.css';

import { initNavbar } from './modules/navbar.js';
import { mountGallery } from './modules/gallery.js';
import { initShare } from './modules/share.js';

initNavbar();
initShare();

const galeria = document.getElementById('pp-gallery');
if (galeria) {
  const fotos = [...galeria.querySelectorAll('.gallery-thumb img')].map((img) => img.getAttribute('src'));
  const titulo = document.getElementById('pp-title')?.textContent.trim() ?? '';
  const controles = mountGallery(galeria, { fotos, titulo });

  // Flechas del teclado, salvo que se esté escribiendo en algún campo
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select')) return;
    if (e.key === 'ArrowRight') controles.next();
    if (e.key === 'ArrowLeft') controles.prev();
  });
}

const year = document.getElementById('footer-year');
if (year) year.textContent = new Date().getFullYear();
