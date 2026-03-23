import { Request, Response } from "express"

import {
  iniciarPedido,
  confirmarPedido,
  cancelarPedido,
  anularPedido,
  listarPedidosAdmin
} from "../pedido/pedido.service"


/**
 * LISTAR PEDIDOS (ADMIN)
 * CON PAGINACIÓN
 */

export async function listarPedidosAdminController(
  req: Request,
  res: Response
) {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10

  const resultado = await listarPedidosAdmin(page, limit)

  res.json(resultado)
}


/**
 * INICIAR PEDIDO
 * Reserva stock
 */

export async function iniciarPedidoController(
  req: Request<{ id: string }>,
  res: Response
) {
  const pedido = await iniciarPedido(req.params.id)

  res.json(pedido)
}


/**
 * CONFIRMAR PEDIDO
 * Confirma venta
 */

export async function confirmarPedidoController(
  req: Request<{ id: string }>,
  res: Response
) {
  const pedido = await confirmarPedido(req.params.id)

  res.json(pedido)
}


/**
 * CANCELAR PEDIDO
 * (solo si NO está pagado)
 */

export async function cancelarPedidoController(
  req: Request<{ id: string }>,
  res: Response
) {
  const pedido = await cancelarPedido(req.params.id)

  res.json(pedido)
}


/**
 * ANULAR PEDIDO
 * (venta ya pagada → revertir)
 */

export async function anularPedidoController(
  req: Request<{ id: string }>,
  res: Response
) {
  const pedido = await anularPedido(req.params.id)

  res.json(pedido)
}