# SEICAA — sitio web

Sitio de SEICAA, empresa constructora de Chiantla, Huehuetenango. Hecho con HTML, CSS y JavaScript modular, empaquetado con [Vite](https://vite.dev) y publicado en [Vercel](https://vercel.com).

## Requisitos

- [Node.js](https://nodejs.org) 20.19 o superior (recomendado: versión LTS)
- [Git](https://git-scm.com)

## Comandos

```bash
npm install       # solo la primera vez (o al cambiar de computadora)
npm run dev       # abre la página en http://localhost:5173 y se recarga sola al guardar
npm run build     # genera la versión final en la carpeta dist/
npm run preview   # prueba la versión final en http://localhost:4173
```

## ¿Dónde edito cada cosa?

| Quiero cambiar… | Archivo |
| --- | --- |
| Proyectos (agregar, quitar, fotos, m²) | Panel de Pages CMS, o `src/data/proyectos.json` |
| Textos, servicios, teléfono, cifras | `index.html` (busca los comentarios ✏️ EDITA) |
| Teléfono, correo y dirección para Google | `site.config.js` (y también en `index.html` y `proyecto.html`) |
| Diseño de la página de cada proyecto | `proyecto.html`, `build/paginas.js`, `src/styles/proyecto.css` |
| Colores, sombras, velocidad de animaciones | `src/styles/tokens.css` |
| Estilos de una sección | `src/styles/<sección>.css` |
| Comportamiento (menú, filtro, galería) | `src/modules/*.js` |

## Agregar proyectos desde el panel (recomendado)

El sitio está configurado para [Pages CMS](https://pagescms.org), un panel gratuito que edita el repositorio de GitHub por ti. La configuración del formulario está en `.pages.yml`.

Configuración (solo una vez):

1. Entra a [app.pagescms.org](https://app.pagescms.org) e inicia sesión con GitHub.
2. Instala la GitHub App en tu cuenta y dale acceso al repositorio `seicaa`.
3. Abre el repositorio `seicaa`. Verás la sección **Proyectos**.

Para agregar un proyecto:

1. En **Proyectos**, agrega un elemento nuevo.
2. Llena el nombre corto, el nombre oficial, el año, el tipo, los metros cuadrados, la ubicación y la descripción.
3. Sube las fotos. La primera es la portada de la tarjeta.
4. Guarda. Pages CMS hace el commit en GitHub y Vercel publica la página en uno o dos minutos.

Antes de subir una foto, redúcela a unos 1600 px de ancho y menos de 300 KB. [squoosh.app](https://squoosh.app) lo hace gratis y la convierte a WebP. Así la página carga rápido con datos móviles.

Si haces cambios desde el panel, ejecuta `git pull` en tu computadora antes de editar ahí, para traer lo que el panel guardó.

## Agregar proyectos a mano

Edita `src/data/proyectos.json`. Cada proyecto es un bloque así; copia uno, pégalo después de una coma y cambia los valores:

```json
{
  "titulo": "Puesto de salud, Caserío La Laguna",
  "nombre": "Construcción Puesto de Salud Caserío La Laguna, Aldea Paquix, Chiantla, Huehuetenango",
  "anio": 2025,
  "tipo": "Institucional",
  "area": 186,
  "ubicacion": "Caserío La Laguna, Aldea Paquix, Chiantla, Huehuetenango",
  "descripcion": "Construcción del puesto de salud…",
  "fotos": ["/img/proyectos/puesto-salud-1.webp", "/img/proyectos/puesto-salud-2.webp"]
}
```

- `area`: escribe solo el número (sin "m²"). Usa `null` si no aplica, por ejemplo en un camino.
- `fotos`: guarda cada foto en `public/img/proyectos/`. En el JSON escribe la ruta empezando con `/img/proyectos/`, sin `public`. La primera foto es la portada. Usa `[]` si todavía no hay fotos.
- Nombres de archivo en minúsculas, sin espacios ni tildes. Vercel distingue `.jpg` de `.JPG`.
- JSON no admite comas sobrantes: el último proyecto no lleva coma después de su `}`.

Las fotos del inicio y de "Nosotros" vienen de Unsplash. Para usar fotos propias, guárdalas en `public/img/` y cambia la URL en `src/styles/hero.css` (inicio) o en `index.html` (Nosotros) por `/img/tu-foto.webp`.

## Página de cada proyecto

Cada proyecto tiene su propia página, por ejemplo `/proyectos/puesto-de-salud-caserio-la-laguna`. Se crean solas al compilar a partir de `src/data/proyectos.json`: al agregar un proyecto en Pages CMS, su página aparece en la siguiente publicación.

- La dirección sale del **nombre corto**. Si después lo cambias, la dirección también cambia y el enlace anterior deja de funcionar.
- Al compartir esa dirección por WhatsApp o Facebook se ve la primera foto del proyecto. Si no tiene fotos, se usa `public/og-image.jpg`.
- El detalle de la página de inicio tiene los botones **Ver página del proyecto** y **Compartir**.

## Google

Al compilar se generan solos:

- **Vista previa al compartir** (título, descripción e imagen) para el inicio y para cada proyecto.
- **Datos de la empresa** para Google (nombre, dirección, teléfono, servicios), tomados de `site.config.js`.
- **`/sitemap.xml`** con todas las páginas, y **`/robots.txt`**.

La dirección del sitio la toma Vercel sola, y cambia sola si conectas un dominio propio.

## Publicar cambios

El repositorio está conectado a Vercel: cada `git push` a la rama `main` publica la página sola en uno o dos minutos.

```bash
git add .
git commit -m "Agrega foto del puesto de salud"
git push
```

## Estructura

```
index.html              estructura de la página de inicio
proyecto.html           plantilla de la página de cada proyecto
site.config.js          datos de la empresa para Google y para compartir
vite.config.js          crea las páginas de proyectos, sitemap y robots al compilar
build/paginas.js        el HTML de cada página de proyecto
public/                 archivos que se copian tal cual (fotos, favicon, og-image.jpg)
  img/proyectos/        fotos de los proyectos
src/
  main.js               punto de entrada: carga estilos y módulos
  data/proyectos.json   lista de proyectos (la edita Pages CMS)
  modules/              un archivo por comportamiento
  styles/               un archivo por sección + tokens.css con las variables
vercel.json             le indica a Vercel cómo compilar (Vite → dist/)
.pages.yml              formulario de proyectos para Pages CMS
```
