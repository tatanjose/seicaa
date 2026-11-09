/* =====================================================
   DATOS DE PROYECTOS — lee src/data/proyectos.json y
   los deja listos para usar (tolerante a campos vacíos).
   Los proyectos se editan desde Pages CMS o a mano en el JSON.
   ===================================================== */
import raw from '../data/proyectos.json';
import { normalizarProyectos } from '../data/normalize.js';

export { formatArea, urlProyecto, ordenarProyectos } from '../data/normalize.js';

export const PROYECTOS = normalizarProyectos(raw);
