import { Request, Response } from "express"

import {
  crearPedido,
  confirmarPedido,
  cancelarPedido,
  obtenerPedido
} from "./pedido.service"

export async function crearPedidoController(req: Request, res: Response) {

  const pedido = await crearPedido(req.body)

  res.status(201).json(pedido)
}

export async function confirmarPedidoController(
  req: Request<{ id: string }>,
  res: Response
) {

  const pedido = await confirmarPedido(req.params.id)

  res.json(pedido)
}

export async function cancelarPedidoController(
  req: Request<{ id: string }>,
  res: Response
) {

  const pedido = await cancelarPedido(req.params.id)

  res.json(pedido)
}

export async function obtenerPedidoController(
  req: Request<{ id: string }>,
  res: Response
) {

  const pedido = await obtenerPedido(req.params.id)

  res.json(pedido)
}