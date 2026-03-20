import { Schema, model } from "mongoose"

const pedidoCounterSchema = new Schema({
  _id: {
    type: String,
    required: true
  },

  seq: {
    type: Number,
    default: 0
  }
})

export const PedidoCounterModel = model(
  "PedidoCounter",
  pedidoCounterSchema
)