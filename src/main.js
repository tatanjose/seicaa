/* =====================================================
   SEICAA — punto de entrada
   Cada parte de la página vive en su propio módulo en src/modules/
   ===================================================== */
import './styles/main.css';

import { initNavbar } from './modules/navbar.js';
import { initReveal } from './modules/reveal.js';
import { initCounters } from './modules/counters.js';
import { initProjects } from './modules/projects.js';
import { initModal } from './modules/modal.js';
import { initContactForm } from './modules/contact-form.js';

initNavbar();
initReveal();
initCounters();
initModal();
initProjects();
initContactForm();

// Año actual en el pie de página
const year = document.getElementById('footer-year');
if (year) year.textContent = new Date().getFullYear();
