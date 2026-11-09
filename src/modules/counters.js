/* =====================================================
   CONTADORES — cuentan hasta data-target al aparecer
   El HTML ya trae el número final, así que sin JavaScript
   (o con movimiento reducido) se ve la cifra correcta.
   ===================================================== */
import { prefersReducedMotion } from './utils.js';

const DURATION = 1600;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function animate(node) {
  const target = Number(node.dataset.target) || 0;
  const suffix = node.dataset.suffix ?? '+';
  const start = performance.now();

  const frame = (now) => {
    const progress = Math.min((now - start) / DURATION, 1);
    node.textContent = `${Math.round(target * easeOutCubic(progress))}${suffix}`;
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

export function initCounters() {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  const counters = document.querySelectorAll('[data-target]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 },
  );

  counters.forEach((node) => {
    // Solo arranca desde 0 si todavía no está en pantalla
    const rect = node.getBoundingClientRect();
    const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
    node.textContent = `0${node.dataset.suffix ?? '+'}`;
    if (onScreen) {
      // El hero entra con su propia secuencia: espera a que termine de aparecer
      setTimeout(() => animate(node), 450);
    } else {
      observer.observe(node);
    }
  });
}
