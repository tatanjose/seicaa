/* =====================================================
   COMPARTIR — usa el menú de compartir del celular
   (WhatsApp, Facebook…) y, si no existe, copia el enlace.
   Cualquier botón con data-share="<url>" funciona.
   ===================================================== */

async function compartir(btn) {
  const url = new URL(btn.dataset.share || location.href, location.origin).href;
  const title = btn.dataset.shareTitle || document.title;

  if (navigator.share) {
    try {
      await navigator.share({ title, url });
    } catch {
      /* la persona cerró el menú: no hay nada que hacer */
    }
    return;
  }

  const label = btn.querySelector('span');
  const original = label?.textContent;
  try {
    await navigator.clipboard.writeText(url);
    if (label) label.textContent = 'Enlace copiado';
  } catch {
    window.prompt('Copia este enlace:', url);
    return;
  }
  clearTimeout(btn._shareTimer);
  btn._shareTimer = setTimeout(() => {
    if (label) label.textContent = original;
  }, 2000);
}

export function initShare() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-share]');
    if (btn) compartir(btn);
  });
}
