/* =====================================================
   FORMULARIO DE CONTACTO — validación y envío a Formspree
   La URL de Formspree se configura en src/config.js
   ===================================================== */
import { FORMSPREE_URL, CONTACTO } from '../config.js';
import { el } from './utils.js';

const RULES = {
  'cf-nombre': (v) => v.trim().length >= 2,
  'cf-email': (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  'cf-servicio': (v) => v !== '',
  'cf-mensaje': (v) => v.trim().length >= 10,
};

const isConfigured = () => /^https:\/\/formspree\.io\/f\/\w+$/.test(FORMSPREE_URL) && !FORMSPREE_URL.includes('TU_ENDPOINT');

function contactFallback() {
  const tel = CONTACTO.telefono;
  return [
    ' Escríbenos a ',
    el('a', { href: `mailto:${CONTACTO.email}` }, CONTACTO.email),
    ' o llama al ',
    el('a', { href: `tel:${tel.replace(/[^\d+]/g, '')}` }, tel),
    '.',
  ];
}

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const submit = document.getElementById('cf-submit');
  const submitLabel = submit.querySelector('span');
  const submitIcon = submit.querySelector('i');
  let attempted = false;

  const setStatus = (type, content) => {
    status.className = `form-status${type ? ` is-${type}` : ''}`;
    status.replaceChildren(...[].concat(content ?? []));
  };

  const validateField = (input) => {
    const ok = RULES[input.id]?.(input.value) ?? true;
    if (ok) input.removeAttribute('aria-invalid');
    else input.setAttribute('aria-invalid', 'true');
    return ok;
  };

  const setSending = (sending) => {
    submit.disabled = sending;
    submitLabel.textContent = sending ? 'Enviando…' : 'Enviar mensaje';
    if (sending) submitIcon.replaceWith(el('span', { class: 'spinner', 'aria-hidden': 'true' }));
    else submit.querySelector('.spinner')?.replaceWith(submitIcon);
  };

  // Después del primer intento, valida mientras la persona corrige
  form.addEventListener('input', (e) => {
    if (attempted && RULES[e.target.id]) validateField(e.target);
  });
  form.addEventListener('change', (e) => {
    if (attempted && RULES[e.target.id]) validateField(e.target);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    attempted = true;
    setStatus(null);

    const fields = Object.keys(RULES).map((id) => document.getElementById(id));
    const invalid = fields.filter((input) => !validateField(input));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    if (!isConfigured()) {
      setStatus('error', ['El formulario todavía no está conectado.', ...contactFallback()]);
      return;
    }

    setSending(true);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      form.reset();
      attempted = false;
      setSending(false);
      setStatus('success', 'Mensaje enviado. Te responderemos lo antes posible.');
    } catch (error) {
      setSending(false);
      const offline = !navigator.onLine;
      setStatus('error', [
        offline
          ? 'No hay conexión a internet. Revisa tu conexión y vuelve a enviar.'
          : 'No se pudo enviar el mensaje. Vuelve a intentarlo.',
        ...contactFallback(),
      ]);
    }
  });
}
