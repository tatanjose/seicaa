/* =====================================================
   GENERADOR DE PÁGINAS (se ejecuta solo al compilar, en Node)
   - Vista previa al compartir y datos para Google del inicio
   - Una página por proyecto: /proyectos/<slug>
   - sitemap.xml y robots.txt
   ===================================================== */
import { readFileSync } from 'node:fs';
import { EMPRESA } from '../site.config.js';
import { normalizarProyectos, ordenarProyectos, formatArea, urlProyecto } from '../src/data/normalize.js';
import { esc, galleryMarkup } from '../src/data/markup.js';

export function cargarProyectos(rutaJson) {
  const raw = JSON.parse(readFileSync(rutaJson, 'utf-8'));
  return ordenarProyectos(normalizarProyectos(raw));
}

const absoluta = (ruta, sitio) => (/^https?:\/\//.test(ruta) ? ruta : `${sitio}${ruta.startsWith('/') ? '' : '/'}${ruta}`);

/** Recorta un texto para meta description (≈155 caracteres, sin cortar palabras) */
function resumen(texto, max = 155) {
  const limpio = texto.replace(/\s+/g, ' ').trim();
  if (limpio.length <= max) return limpio;
  return `${limpio.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

const jsonLd = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

function negocio(sitio) {
  const { direccion } = EMPRESA;
  return {
    '@type': 'GeneralContractor',
    '@id': `${sitio}/#empresa`,
    name: EMPRESA.nombre,
    url: `${sitio}/`,
    description: EMPRESA.descripcion,
    image: absoluta(EMPRESA.imagenCompartir, sitio),
    telephone: EMPRESA.telefono,
    email: EMPRESA.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: direccion.calle,
      addressLocality: direccion.municipio,
      addressRegion: direccion.departamento,
      addressCountry: direccion.pais,
    },
    areaServed: EMPRESA.areaServida.map((name) => ({ '@type': 'AdministrativeArea', name })),
    knowsAbout: EMPRESA.servicios,
  };
}

function metasCompartir({ titulo, descripcion, url, imagen, imagenAlt, tipo = 'website', dimensiones }) {
  return [
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:site_name" content="${esc(EMPRESA.nombre)}" />`,
    `<meta property="og:locale" content="es_GT" />`,
    `<meta property="og:type" content="${tipo}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(titulo)}" />`,
    `<meta property="og:description" content="${esc(descripcion)}" />`,
    `<meta property="og:image" content="${esc(imagen)}" />`,
    `<meta property="og:image:alt" content="${esc(imagenAlt)}" />`,
    ...(dimensiones
      ? [`<meta property="og:image:width" content="${dimensiones[0]}" />`, `<meta property="og:image:height" content="${dimensiones[1]}" />`]
      : []),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(titulo)}" />`,
    `<meta name="twitter:description" content="${esc(descripcion)}" />`,
    `<meta name="twitter:image" content="${esc(imagen)}" />`,
  ].join('\n  ');
}

/* ---------- Inicio ---------- */

export function headInicio(sitio) {
  return [
    metasCompartir({
      titulo: 'SEICAA - 26 años construyendo Guatemala',
      descripcion: 'Soluciones integrales en ingeniería civil y construcción en Huehuetenango, Guatemala.',
      url: `${sitio}/`,
      imagen: absoluta(EMPRESA.imagenCompartir, sitio),
      imagenAlt: 'SEICAA, empresa constructora en Huehuetenango',
      dimensiones: [1200, 630],
    }),
    jsonLd({ '@context': 'https://schema.org', ...negocio(sitio) }),
  ].join('\n  ');
}

/* ---------- Página de un proyecto ---------- */

export function headProyecto(p, sitio) {
  const url = `${sitio}${urlProyecto(p)}`;
  const descripcion = resumen(p.descripcion || `${p.nombre}. Proyecto de SEICAA en ${p.ubicacion}.`);
  const imagen = p.fotos[0] ? absoluta(p.fotos[0], sitio) : absoluta(EMPRESA.imagenCompartir, sitio);

  return [
    `<title>${esc(p.titulo)} | SEICAA</title>`,
    `<meta name="description" content="${esc(descripcion)}" />`,
    metasCompartir({
      titulo: `${p.titulo} | SEICAA`,
      descripcion,
      url,
      imagen,
      imagenAlt: p.titulo,
      tipo: 'article',
      dimensiones: p.fotos[0] ? null : [1200, 630],
    }),
    jsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${sitio}/` },
            { '@type': 'ListItem', position: 2, name: 'Proyectos', item: `${sitio}/#proyectos` },
            { '@type': 'ListItem', position: 3, name: p.titulo, item: url },
          ],
        },
        {
          '@type': 'WebPage',
          '@id': url,
          url,
          name: `${p.titulo} | SEICAA`,
          description: descripcion,
          inLanguage: 'es-GT',
          ...(p.fotos.length ? { image: p.fotos.map((f) => absoluta(f, sitio)) } : {}),
          about: { '@id': `${sitio}/#empresa` },
        },
        negocio(sitio),
      ],
    }),
  ].join('\n  ');
}

const icono = (clase) => `<i class="${clase}" aria-hidden="true"></i>`;

function dato(iconoClase, etiqueta, valor) {
  if (!valor) return '';
  return `
          <div>
            <dt>${icono(iconoClase)}${esc(etiqueta)}</dt>
            <dd>${esc(valor)}</dd>
          </div>`;
}

function tarjeta(p) {
  const portada = p.fotos[0]
    ? `<img src="${esc(p.fotos[0])}" alt="${esc(p.titulo)}" loading="lazy" decoding="async" />`
    : `<div class="project-placeholder">${icono('fas fa-camera')}Fotografía próximamente</div>`;
  return `
        <article class="project-card">
          <div class="project-media">
            ${portada}
            <span class="project-tag">${esc(p.tipo)}</span>
          </div>
          <div class="project-info">
            <div class="project-meta">
              <span class="project-year">${esc(p.anio ?? '')}</span>
              ${p.area ? `<span class="project-area">${icono('fas fa-ruler-combined')}${esc(formatArea(p.area))}</span>` : ''}
            </div>
            <h3><a class="project-open" href="${urlProyecto(p)}">${esc(p.titulo)}</a></h3>
            <p class="project-location">${icono('fas fa-map-marker-alt')}${esc(p.ubicacion)}</p>
          </div>
        </article>`;
}

export function cuerpoProyecto(p, todos) {
  const otros = todos.filter((o) => o.slug !== p.slug).slice(0, 3);
  const mostrarNombreOficial = p.nombre && p.nombre.toLowerCase() !== p.titulo.toLowerCase();

  return `
    <section class="pp-hero" aria-labelledby="pp-title">
      <div class="container">
        <a class="pp-back" href="/#proyectos">${icono('fas fa-arrow-left')} Todos los proyectos</a>
        <div class="modal-meta">
          <span class="modal-tag tipo">${esc(p.tipo)}</span>
          ${p.anio ? `<span class="modal-tag year">${esc(p.anio)}</span>` : ''}
        </div>
        <h1 class="pp-title" id="pp-title">${esc(p.titulo)}</h1>
        ${mostrarNombreOficial ? `<p class="pp-official">${esc(p.nombre)}</p>` : ''}
      </div>
    </section>

    <section class="section section--white pp-main">
      <div class="container pp-grid">
        <div class="pp-content">
          <div class="gallery gallery--page" id="pp-gallery">
            ${galleryMarkup(p.fotos, p.titulo, { eager: true })}
          </div>
          ${p.descripcion ? `
          <h2 class="pp-heading">Sobre la obra</h2>
          <p class="pp-desc">${esc(p.descripcion)}</p>` : ''}
        </div>

        <aside class="pp-aside">
          <dl class="modal-facts pp-facts">${dato('fas fa-ruler-combined', 'Área de construcción', p.area && formatArea(p.area))}${dato('fas fa-map-marker-alt', 'Ubicación', p.ubicacion)}${dato('fas fa-calendar-check', 'Año', p.anio)}${dato('fas fa-hard-hat', 'Tipo de obra', p.tipo)}
          </dl>
          <button class="btn btn-ghost btn-block" type="button" data-share="${urlProyecto(p)}" data-share-title="${esc(p.titulo)} | SEICAA">
            ${icono('fas fa-share-alt')} <span>Compartir proyecto</span>
          </button>

          <div class="pp-cta">
            <h2>¿Tienes un proyecto similar?</h2>
            <p>Llámanos o escríbenos y te asesoramos.</p>
            <!-- ✏️ EDITA: datos de contacto -->
            <a class="btn btn-primary btn-block" href="tel:+50240739801">${icono('fas fa-phone')} Llamar al +502 4073-9801</a>
            <a class="pp-cta-mail" href="mailto:seicaa@gmail.com?subject=${encodeURIComponent(`Consulta: ${p.titulo}`)}">${icono('fas fa-envelope')} seicaa@gmail.com</a>
          </div>
        </aside>
      </div>
    </section>
${otros.length ? `
    <section class="section section--light" aria-labelledby="pp-more-title">
      <div class="container">
        <h2 class="section-title pp-more-title" id="pp-more-title">Otros proyectos</h2>
        <div class="projects-grid">${otros.map(tarjeta).join('')}
        </div>
      </div>
    </section>` : ''}`;
}

/* ---------- sitemap.xml y robots.txt ---------- */

export function sitemap(sitio, proyectos) {
  const urls = [`${sitio}/`, ...proyectos.map((p) => `${sitio}${urlProyecto(p)}`)];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join('\n')}
</urlset>
`;
}

export const robots = (sitio) => `User-agent: *
Allow: /

Sitemap: ${sitio}/sitemap.xml
`;
