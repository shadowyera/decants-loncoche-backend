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

  notas?: string[]

  familiasOlfativas?: string[]

  precioDesde: number

  precioHasta: number

  stockTotal: number

  disponible: boolean

  nuevo?: boolean

  pocoStock?: boolean

  decants: CatalogoDecant[]

}