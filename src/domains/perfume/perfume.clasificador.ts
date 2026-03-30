/* ===============================
   MAPA DE FAMILIAS
=============================== */

const mapaFamilias: Record<string, string[]> = {

  dulce: [
    "vainilla",
    "haba tonka",
    "caramelo",
    "coco",
    "chocolate",
    "azucar",
    "miel",
    "praline"
  ],

  citrico: [
    "limon",
    "bergamota",
    "naranja",
    "pomelo",
    "mandarina",
    "toronja"
  ],

  frutal: [
    "manzana",
    "pera",
    "durazno",
    "ciruela",
    "frutas",
    "frutal"
  ],

  amaderado: [
    "cedro",
    "sandalo",
    "vetiver",
    "abedul",
    "madera",
    "oud",
    "patchouli"
  ],

  floral: [
    "jazmin",
    "rosa",
    "iris",
    "lavanda",
    "mimosa",
    "loto",
    "flor",
    "azahar"
  ],

  fresco: [
    "bambu",
    "menta",
    "jengibre",
    "verde",
    "aire",
    "limpio"
  ],

  especiado: [
    "canela",
    "pimienta",
    "cardamomo",
    "clavo",
    "nuez moscada",
    "especias"
  ],

  tropical: [
    "piña",
    "coco",
    "mango",
    "maracuya"
  ],

  ambarado: [
    "ambar",
    "ambar gris",
    "resina"
  ],

  almizclado: [
    "almizcle"
  ],

  acuatico: [
    "acuatico",
    "marino",
    "sal",
    "algas",
    "agua"
  ],

  verde: [
    "verde",
    "hojas",
    "hierba",
    "galbano"
  ],

  cuero: [
    "cuero"
  ],

  tabaco: [
    "tabaco"
  ],

  gourmand: [
    "vainilla",
    "caramelo",
    "chocolate",
    "cafe",
    "praline"
  ],

  aromatico: [
    "lavanda",
    "romero",
    "salvia",
    "tomillo"
  ]

}

/* ===============================
   NORMALIZAR TEXTO
=============================== */

function normalizar(texto: string) {

  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos

}

/* ===============================
   CLASIFICAR FAMILIAS
=============================== */

export function clasificarFamilias(notas: string[]): string[] {

  const familias = new Set<string>()

  for (const nota of notas) {

    const notaNormalizada = normalizar(nota)

    for (const [familia, keywords] of Object.entries(mapaFamilias)) {

      if (keywords.some(keyword =>
        notaNormalizada.includes(keyword)
      )) {

        familias.add(familia)

      }

    }

  }

  return [...familias]

}