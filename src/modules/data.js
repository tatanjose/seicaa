/* =====================================================
   DATOS DE PROYECTOS — lee src/data/proyectos.json y
   los deja listos para usar (tolerante a campos vacíos).
   Los proyectos se editan desde Pages CMS o a mano en el JSON.
   ===================================================== */
import raw from '../data/proyectos.json';

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export const PROYECTOS = raw
  .map((p, index) => ({
    id: index + 1,
    titulo: (p.titulo || p.nombre || '').trim(),
    nombre: (p.nombre || p.titulo || '').trim(),
    anio: toNumber(p.anio),
    tipo: (p.tipo || 'Otro').trim(),
    area: toNumber(p.area),
    ubicacion: (p.ubicacion || '').trim(),
    descripcion: (p.descripcion || '').trim(),
    // Acepta "fotos" (lista) y el campo antiguo "imagen" (una sola foto)
    fotos: [].concat(p.fotos ?? [], p.imagen ?? []).filter(Boolean),
  }))
  .filter((p) => p.titulo);

/** 315 → "315 m²" (con separador de miles: 1,250 m²) */
export const formatArea = (area) => `${area.toLocaleString('es-GT')} m²`;
