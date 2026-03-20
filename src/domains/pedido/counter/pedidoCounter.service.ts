import { PedidoCounterModel } from "./pedidoCounter.model"

export async function generarNumeroPedido() {

  const counter = await PedidoCounterModel.findByIdAndUpdate(
    "pedido",
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true
    }
  )

  const numero = 1000 + counter.seq

  return `DL-${numero}`

}