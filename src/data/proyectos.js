/* =====================================================
   PROYECTOS — edita este archivo para agregar obras
   =====================================================
   Para agregar un proyecto nuevo, copia uno de los objetos
   y cambia sus valores. Campos:

     id          → número único (usa el siguiente al último)
     titulo      → nombre corto que se ve en la tarjeta
     nombre      → nombre oficial completo (se ve en el detalle)
     anio        → año de conclusión (número, sin comillas)
     tipo        → categoría: "Institucional", "Residencial", "Comercial",
                   "Industrial", "Vial", "Hidráulico" u "Otro"
     imagen      → ruta de la foto. Guarda la foto en
                   public/img/proyectos/ y escribe "/img/proyectos/archivo.jpg".
                   Si aún no hay foto, deja "" y se mostrará un aviso.
     descripcion → texto del proyecto
     ubicacion   → lugar de la obra

   Los botones de año del filtro se crean solos a partir de "anio".
   ===================================================== */

export const PROYECTOS = [
  {
    id: 1,
    titulo: 'Escuela primaria, Caserío Carbonero',
    nombre:
      'Construcción Escuela Primaria Oficial Rural Mixta, Caserío Carbonero, Aldea Sacpic, Santa Bárbara, Huehuetenango',
    anio: 2025,
    tipo: 'Institucional',
    imagen: '/img/proyectos/escuela-carbonero.webp',
    descripcion:
      'Construcción de la escuela primaria del Caserío Carbonero, Aldea Sacpic, Santa Bárbara, Huehuetenango, con 315 m² de área. La escuela contará con 3 aulas puras, cocina, dirección y módulos de baños con biodigestor y pozo de absorción.',
    ubicacion: 'Yerbabuena, Aldea Sacpic, Santa Bárbara, Huehuetenango',
  },
  {
    id: 2,
    titulo: 'Camino rural, Caserío Yerbabuena',
    nombre:
      'Mejoramiento Camino Rural Caserío Yerbabuena, Aldea Sacpic, Santa Bárbara, Huehuetenango',
    anio: 2025,
    tipo: 'Institucional',
    imagen: '',
    descripcion:
      'Mejoramiento del camino rural entre el Caserío Yerbabuena y la Aldea Sacpic, para mejorar la conectividad y facilitar el acceso entre las comunidades.',
    ubicacion: 'Yerbabuena, Aldea Sacpic, Santa Bárbara, Huehuetenango',
  },
  {
    id: 3,
    titulo: 'Puesto de salud, Caserío La Laguna',
    nombre:
      'Construcción Puesto de Salud Caserío La Laguna, Aldea Paquix, Chiantla, Huehuetenango',
    anio: 2025,
    tipo: 'Institucional',
    imagen: '',
    descripcion:
      'Construcción del puesto de salud del Caserío La Laguna, Aldea Paquix, Chiantla, Huehuetenango, con 186 m² de área.',
    ubicacion: 'Caserío La Laguna, Aldea Paquix, Chiantla, Huehuetenango',
  },

  /*
  ✏️ AGREGA MÁS PROYECTOS AQUÍ — copia este bloque, quita los /* y pégalo arriba:
  {
    id: 4,
    titulo: 'Nombre corto',
    nombre: 'Nombre oficial completo del proyecto',
    anio: 2024,
    tipo: 'Residencial',
    imagen: '/img/proyectos/mi-foto.jpg',
    descripcion: 'Breve descripción de este proyecto.',
    ubicacion: 'Municipio, Departamento',
  },
  */
];
