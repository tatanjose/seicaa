/* =====================================================
   NORMALIZA LOS PROYECTOS — lo usan la página (navegador)
   y la compilación (para crear una página por proyecto).
   No usa nada exclusivo del navegador ni de Node.
   ===================================================== */

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};

/** "Puesto de Salud, Caserío La Laguna" → "puesto-de-salud-caserio-la-laguna" */
export function slugify(texto) {
  const slug = String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita tildes
    .toLowerCase()
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (slug.length <= 70) return slug;
  return slug.slice(0, 70).replace(/-[^-]*$/, ''); // corta en una palabra completa
}

export function normalizarProyectos(raw) {
  const usados = new Set();

  return (Array.isArray(raw) ? raw : [])
    .map((p, index) => {
      const titulo = String(p.titulo || p.nombre || '').trim();
      const anio = toNumber(p.anio);

      // Dirección de su página: /proyectos/<slug>. Si se repite, se le agrega el año o un número.
      let slug = slugify(p.slug || titulo) || `proyecto-${index + 1}`;
      if (usados.has(slug) && anio) slug = `${slug}-${anio}`;
      const base = slug;
      for (let n = 2; usados.has(slug); n++) slug = `${base}-${n}`;
      usados.add(slug);

      return {
        id: index + 1,
        slug,
        titulo,
        nombre: String(p.nombre || p.titulo || '').trim(),
        anio,
        tipo: String(p.tipo || 'Otro').trim(),
        area: toNumber(p.area),
        ubicacion: String(p.ubicacion || '').trim(),
        descripcion: String(p.descripcion || '').trim(),
        // Acepta "fotos" (lista) y el campo antiguo "imagen" (una sola foto)
        fotos: [].concat(p.fotos ?? [], p.imagen ?? []).filter(Boolean),
      };
    })
    .filter((p) => p.titulo);
}

/** Más recientes primero; dentro del mismo año, en el orden del archivo */
export const ordenarProyectos = (lista) =>
  [...lista].sort((a, b) => (b.anio ?? 0) - (a.anio ?? 0) || a.id - b.id);

/** 315 → "315 m²" (con separador de miles: 1,250 m²) */
export const formatArea = (area) => `${area.toLocaleString('es-GT')} m²`;

export const urlProyecto = (proyecto) => `/proyectos/${proyecto.slug}`;
