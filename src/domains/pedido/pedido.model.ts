import { model } from "mongoose"
import { pedidoSchema } from "./pedido.schema"

export const PedidoModel = model("Pedido", pedidoSchema)