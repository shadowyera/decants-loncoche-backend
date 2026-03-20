import { Router } from "express"

import {
  crearPedidoController,
  obtenerPedidoController
} from "./pedido.controller"

import { pedidoLimiter } from "../../shared/middleware/pedidoLimiter"

const router = Router()

/**
 * CREAR PEDIDO
 * limitamos pedidos por IP
 */

router.post("/", pedidoLimiter, crearPedidoController)

/**
 * OBTENER PEDIDO
 */

router.get("/:id", obtenerPedidoController)

export default router