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
    "azucar"
  ],

  citrico: [
    "limon",
    "bergamota",
    "naranja",
    "pomelo",
    "mandarina"
  ],

  amaderado: [
    "cedro",
    "sandalo",
    "vetiver",
    "abedul",
    "maderas"
  ],

  floral: [
    "jazmin",
    "rosa",
    "iris",
    "lavanda"
  ],

  fresco: [
    "bambu",
    "menta",
    "jengibre",
    "notas verdes"
  ],

  tropical: [
    "piña",
    "coco",
    "mango"
  ],

  ambarado: [
    "ambar",
    "ambar gris"
  ],

  almizclado: [
    "almizcle"
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