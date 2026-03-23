import { Types } from "mongoose"

/**
 * ESTADOS DEL PEDIDO
 */

export enum ESTADO_PEDIDO {

  PENDIENTE = "PENDIENTE",
  EN_PROCESO = "EN_PROCESO",
  PAGADO = "PAGADO",
  CANCELADO = "CANCELADO",
  ANULADO = "ANULADO"
}


/**
 * ITEM DEL PEDIDO
 */

export interface PedidoItem {

  decantId: Types.ObjectId

  cantidad: number

  precioUnitario: number
}


/**
 * PEDIDO COMPLETO
 */

export interface Pedido {

  _id: Types.ObjectId

  numeroPedido: string

  clienteNombre?: string

  clienteTelefono?: string

  direccion?: string

  items: PedidoItem[]

  total: number

  estado: ESTADO_PEDIDO

  createdAt: Date

  updatedAt: Date
}


/**
 * INPUT PARA CREAR PEDIDO
 */

export interface CrearPedidoInput {

  clienteNombre?: string

  clienteTelefono?: string

  direccion?: string

  items: {
    decantId: string
    cantidad: number
  }[]

}