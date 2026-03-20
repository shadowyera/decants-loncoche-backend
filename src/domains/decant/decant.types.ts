/* ===============================
   DECANT
=============================== */

export interface Decant {

  _id: string

  perfumeId: string

  ml: number

  precio: number

  stockDisponible: number

  stockReservado: number

  sku: string

  activo: boolean

  createdAt: Date

  updatedAt: Date

}


/* ===============================
   CREAR DECANT
=============================== */

export interface CrearDecantInput {

  perfumeId: string

  ml: number

  precio: number

  stockDisponible: number

}


/* ===============================
   ACTUALIZAR DECANT
=============================== */

export interface ActualizarDecantInput {

  precio?: number

  activo?: boolean

}


/* ===============================
   ACTUALIZAR STOCK
=============================== */

export interface ActualizarStockDecantInput {

  stockDisponible: number

}