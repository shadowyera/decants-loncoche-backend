export interface CatalogoDecant {

  id: string

  ml: number

  precio: number

  stockDisponible: number

  sku: string

}

export interface CatalogoProducto {

  id: string

  marca: string
  nombre: string
  slug: string

  imagen?: string
  descripcion?: string

  /* ======================
     PERFUME INFO
  ====================== */

  notas?: string[]
  familiasOlfativas?: string[]

  /* ======================
     PRECIOS
  ====================== */

  precioDesde: number
  precioHasta: number

  /* ======================
     STOCK
  ====================== */

  stockTotal: number
  disponible: boolean

  /* ======================
     BADGES
  ====================== */

  nuevo: boolean
  pocoStock: boolean
  masVendido: boolean

  /* ======================
     DECANTS
  ====================== */

  decants: CatalogoDecant[]

}