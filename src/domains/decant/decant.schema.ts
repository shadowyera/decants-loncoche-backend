import { Schema, model, Types } from "mongoose"

/* =====================================================
   DECANT SCHEMA
===================================================== */

export const decantSchema = new Schema(
  {

    /* ===============================
       RELACIÓN PERFUME
    =============================== */

    perfumeId: {
      type: Schema.Types.ObjectId,
      ref: "Perfume",
      required: true,
      index: true
    },


    /* ===============================
       TAMAÑO DECANT
    =============================== */

    /**
     * Tamaño del decant en ml
     * Ej: 3ml, 5ml, 10ml, 15ml
     */

    ml: {
      type: Number,
      required: true,
      min: 1
    },


    /* ===============================
       PRECIO
    =============================== */

    /**
     * Precio de venta del decant
     */

    precio: {
      type: Number,
      required: true,
      min: 0
    },


    /* ===============================
       STOCK
    =============================== */

    /**
     * Stock disponible para venta
     */

    stockDisponible: {
      type: Number,
      default: 0,
      min: 0
    },


    /**
     * Stock reservado en pedidos
     */

    stockReservado: {
      type: Number,
      default: 0,
      min: 0
    },


    /* ===============================
       IDENTIFICACIÓN
    =============================== */

    /**
     * SKU único del decant
     * Ej:
     * JPG-LEBEAU-5ML
     */

    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      uppercase: true
    },


    /* ===============================
       ESTADO
    =============================== */

    activo: {
      type: Boolean,
      default: true,
      index: true
    }

  },
  {
    timestamps: true,
    versionKey: false
  }
)


/* =====================================================
   ÍNDICES
===================================================== */

/**
 * Un perfume solo puede tener
 * un decant por tamaño
 */

decantSchema.index(
  { perfumeId: 1, ml: 1 },
  { unique: true }
)


/**
 * Índice útil para consultas admin
 */

decantSchema.index(
  { perfumeId: 1, activo: 1 }
)


/**
 * Índice para consultas de stock
 */

decantSchema.index(
  { stockDisponible: 1 }
)


/* =====================================================
   EXPORT MODEL
===================================================== */

export const DecantModel = model(
  "Decant",
  decantSchema
)