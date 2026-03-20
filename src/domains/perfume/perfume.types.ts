import { Types } from "mongoose"

/* ===============================
   PERFUME
=============================== */

export interface Perfume {

  _id: Types.ObjectId

  marca: string

  nombre: string

  slug: string

  descripcion?: string | null

  notas?: string[]

  familiasOlfativas?: string[]

  imagen?: string | null

  /* ======================
     DATOS BOTELLA
  ====================== */

  precioBotella?: number | null

  mlBotella?: number

  multiplicadorDecant?: number

  /* ======================
     NEGOCIO
  ====================== */

  baseSku: string

  activo: boolean

  createdAt: Date

  updatedAt: Date

}

/* ===============================
   CREAR PERFUME
=============================== */

export interface CrearPerfumeInput {

  marca: string

  nombre: string

  descripcion?: string

  notas?: string[]

  imagen?: string

  precioBotella?: number

  mlBotella?: number

  multiplicadorDecant?: number

}

/* ===============================
   SUGERENCIA DECANT
=============================== */

export interface SugerenciaDecant {

  ml: number

  precioSugerido: number

}

/* ===============================
   DETALLE PERFUME ADMIN
=============================== */

export interface PerfumeDetalleAdmin {

  perfume: Perfume

  decants: any[]

  sugerenciasDecants: SugerenciaDecant[]

  mlDisponibles: number

}