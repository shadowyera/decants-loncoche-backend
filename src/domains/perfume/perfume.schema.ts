import { Schema } from "mongoose"

export const perfumeSchema = new Schema(
  {
    /* ===============================
       INFORMACIÓN BÁSICA
    =============================== */

    marca: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    nombre: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    descripcion: {
      type: String,
      trim: true
    },

    /* ===============================
       NOTAS DEL PERFUME
    =============================== */

    notas: {
      type: [String],
      default: []
    },

    /* ===============================
       FAMILIAS OLFATIVAS
    =============================== */

    familiasOlfativas: {
      type: [String],
      default: [],
      index: true
    },

    /* ===============================
       IMAGEN
    =============================== */

    imagen: {
      type: String,
      trim: true
    },

    /* ===============================
       DATOS BOTELLA (DECANTS)
    =============================== */

    /**
     * Precio pagado por la botella
     * usado para calcular precio sugerido de decants
     */

    precioBotella: {
      type: Number,
      min: 0
    },

    /**
     * Cantidad total de ml de la botella
     */

    mlBotella: {
      type: Number,
      default: 100,
      min: 1
    },

    /**
     * Multiplicador para calcular
     * precio final de los decants
     */

    multiplicadorDecant: {
      type: Number,
      default: 1.8,
      min: 1
    },

    /* ===============================
       ESTADO
    =============================== */

    activo: {
      type: Boolean,
      default: true,
      index: true
    },

    /* ===============================
       SKU BASE
    =============================== */

    /**
     * SKU base del perfume
     * Ejemplo:
     * JPG-LEBEAU
     */

    baseSku: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
)