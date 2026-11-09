/* =====================================================
   CONFIGURACIÓN DE VITE
   Además de compilar la página, este archivo:
   1. Agrega al inicio la vista previa al compartir y los datos para Google.
   2. Crea una página por proyecto: dist/proyectos/<slug>.html
      (Vercel la sirve como /proyectos/<slug> gracias a "cleanUrls").
   3. Genera sitemap.xml y robots.txt.
   Todo sale de src/data/proyectos.json: agregar un proyecto en
   Pages CMS crea su página sola en la siguiente publicación.
   ===================================================== */
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { urlDelSitio } from './site.config.js';
import { cargarProyectos, headInicio, headProyecto, cuerpoProyecto, sitemap, robots } from './build/paginas.js';

const RAIZ = import.meta.dirname;
const DATOS = resolve(RAIZ, 'src/data/proyectos.json');

function rellenar(plantilla, proyecto, todos, sitio) {
  return plantilla
    .replace('<!--PROYECTO-HEAD-->', headProyecto(proyecto, sitio))
    .replace('<!--PROYECTO-BODY-->', cuerpoProyecto(proyecto, todos));
}

function paginasSeicaa() {
  let outDir;
  const sitio = urlDelSitio();

  return {
    name: 'seicaa-paginas',

    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },

    // Inicio: agrega las metas para compartir y los datos de la empresa
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.filename.endsWith('index.html')) return html;
        return html.replace('</head>', `  ${headInicio(sitio)}\n</head>`);
      },
    },

    // Mientras trabajas con "npm run dev": muestra /proyectos/<slug> al momento
    configureServer(server) {
      server.watcher.add(DATOS);
      server.middlewares.use(async (req, res, next) => {
        const match = req.url?.split('?')[0].match(/^\/proyectos\/([^/]+?)(?:\.html)?\/?$/);
        if (!match) return next();
        const todos = cargarProyectos(DATOS);
        const proyecto = todos.find((p) => p.slug === match[1]);
        if (!proyecto) return next();
        try {
          const plantilla = readFileSync(resolve(RAIZ, 'proyecto.html'), 'utf-8');
          const html = await server.transformIndexHtml(req.url, rellenar(plantilla, proyecto, todos, sitio));
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(html);
        } catch (error) {
          next(error);
        }
      });
    },

    // Al terminar la compilación: una página por proyecto + sitemap + robots
    closeBundle() {
      const plantillaPath = resolve(outDir, 'proyecto.html');
      const plantilla = readFileSync(plantillaPath, 'utf-8');
      const todos = cargarProyectos(DATOS);

      mkdirSync(resolve(outDir, 'proyectos'), { recursive: true });
      for (const proyecto of todos) {
        writeFileSync(resolve(outDir, 'proyectos', `${proyecto.slug}.html`), rellenar(plantilla, proyecto, todos, sitio));
      }
      rmSync(plantillaPath); // la plantilla vacía no se publica

      writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap(sitio, todos));
      writeFileSync(resolve(outDir, 'robots.txt'), robots(sitio));

      console.log(`\n  ✓ ${todos.length} páginas de proyecto creadas para ${sitio}`);
    },
  };
}

export default defineConfig({
  plugins: [paginasSeicaa()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(RAIZ, 'index.html'),
        proyecto: resolve(RAIZ, 'proyecto.html'),
      },
    },
  },
});
