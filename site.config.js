/* =====================================================
   DATOS DE LA EMPRESA — los usa la compilación para:
   vista previa al compartir (WhatsApp, Facebook), datos
   para Google, páginas de proyectos y sitemap.
   ✏️ Si cambias teléfono, correo o dirección, cámbialos aquí
   y también en index.html y proyecto.html.
   ===================================================== */
export const EMPRESA = {
  nombre: 'SEICAA',
  titulo: 'SEICAA - Empresa Constructora en Huehuetenango, Guatemala',
  descripcion:
    'Empresa constructora con 26 años de experiencia en Guatemala. Construcción, remodelación, ingeniería civil, venta de agregados y renta de maquinaria en Huehuetenango.',
  telefono: '+502 4073-9801',
  email: 'seicaa@gmail.com',
  direccion: {
    calle: '7ma. Avenida 4-41, Zona 4, Chuscaj',
    municipio: 'Chiantla',
    departamento: 'Huehuetenango',
    pais: 'GT',
  },
  areaServida: ['Huehuetenango', 'Guatemala'],
  servicios: [
    'Construcción',
    'Remodelación',
    'Venta de agregados',
    'Renta de maquinaria',
    'Asesoría técnica',
    'Ingeniería civil',
  ],
  // Imagen que aparece al compartir la página de inicio (1200 × 630)
  imagenCompartir: '/og-image.jpg',
};

/**
 * Dirección pública del sitio, sin "/" al final.
 * En Vercel se toma sola (y cambia sola si conectas un dominio propio).
 * Para forzar una, define la variable de entorno SITE_URL.
 */
export function urlDelSitio() {
  const desdeEntorno = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const url = desdeEntorno || 'seicaa.vercel.app';
  return (url.startsWith('http') ? url : `https://${url}`).replace(/\/+$/, '');
}
