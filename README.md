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
| Proyectos (agregar, quitar, fotos) | `src/data/proyectos.js` |
| Formulario (Formspree), redes sociales | `src/config.js` |
| Textos, servicios, teléfono, cifras | `index.html` (busca los comentarios ✏️ EDITA) |
| Colores, sombras, velocidad de animaciones | `src/styles/tokens.css` |
| Estilos de una sección | `src/styles/<sección>.css` |
| Comportamiento (menú, filtro, detalle, formulario) | `src/modules/*.js` |

## Cómo subir fotos de proyectos

1. **Prepara la foto.** Usa un ancho de 1600 px como máximo y procura que pese menos de 300 KB. En [squoosh.app](https://squoosh.app) puedes reducirla y convertirla a WebP gratis.
2. **Ponle un nombre simple**: minúsculas, sin espacios, sin tildes ni ñ.
   Bien: `puesto-salud-la-laguna.webp`. Mal: `Foto Puesto Salud Ñ (1).JPG`
3. **Cópiala a la carpeta** `public/img/proyectos/`
4. **Escribe la ruta en el proyecto**, dentro de `src/data/proyectos.js`:

   ```js
   imagen: '/img/proyectos/puesto-salud-la-laguna.webp',
   ```

   La ruta empieza con `/img/...`. No lleva `public` ni `C:\Users\...`: Vite sirve todo lo de `public/` desde la raíz del sitio.
5. **Revisa** con `npm run dev`. Si la foto no aparece, revisa que el nombre coincida exactamente, incluidas mayúsculas y la extensión (`.jpg` y `.JPG` son distintos en Vercel).
6. **Publica** (ver abajo).

Si un proyecto todavía no tiene foto, deja `imagen: ''` y la tarjeta muestra "Fotografía próximamente".

Las fotos del inicio y de "Nosotros" vienen de Unsplash. Para usar fotos propias, guárdalas en `public/img/` y cambia la URL en `src/styles/hero.css` (inicio) o en `index.html` (Nosotros) por `/img/tu-foto.webp`.

## Publicar cambios

El repositorio está conectado a Vercel: cada `git push` a la rama `main` publica la página sola en uno o dos minutos.

```bash
git add .
git commit -m "Agrega foto del puesto de salud"
git push
```

## Estructura

```
index.html              estructura de la página
public/                 archivos que se copian tal cual (fotos, favicon)
  img/proyectos/        fotos de los proyectos
src/
  main.js               punto de entrada: carga estilos y módulos
  config.js             Formspree, redes sociales, contacto
  data/proyectos.js     lista de proyectos
  modules/              un archivo por comportamiento
  styles/               un archivo por sección + tokens.css con las variables
vercel.json             le indica a Vercel cómo compilar (Vite → dist/)
```
