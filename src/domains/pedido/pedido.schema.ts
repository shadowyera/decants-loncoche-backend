import { Schema } from "mongoose"
import { ESTADO_PEDIDO } from "./pedido.types"

export const pedidoItemSchema = new Schema(
  {
    decantId: {
      type: Schema.Types.ObjectId,
      ref: "Decant",
      required: true
    },

    cantidad: {
      type: Number,
      required: true,
      min: 1
    },

    precioUnitario: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
)

export const pedidoSchema = new Schema(
  {
    numeroPedido: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    clienteNombre: {
      type: String,
      trim: true
    },

    clienteTelefono: {
      type: String,
      trim: true
    },

    direccion: {
      type: String,
      trim: true
    },

    items: {
      type: [pedidoItemSchema],
      required: true
    },

    total: {
      type: Number,
      required: true,
      min: 0
    },

    estado: {
      type: String,
      enum: Object.values(ESTADO_PEDIDO),
      default: ESTADO_PEDIDO.PENDIENTE,
      index: true
    }
  },
  {
    timestamps: true
  }
)