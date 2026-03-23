import { PedidoModel } from "./pedido.model"
import { CrearPedidoInput, ESTADO_PEDIDO } from "./pedido.types"

import { DecantModel } from "../decant/decant.model"

import { ApiError } from "../../shared/errors/ApiError"

import {
  reservarStock,
  confirmarVenta,
  liberarStock
} from "../decant/decant.service"

import { generarNumeroPedido } from "./counter/pedidoCounter.service"


/**
 * CREAR PEDIDO
 * NO RESERVA STOCK
 */

export async function crearPedido(data: CrearPedidoInput) {

  if (!data.items.length) {
    throw new ApiError(400, "El pedido debe tener al menos un item")
  }

  const itemsFinal = []
  let total = 0

  /**
   * OBTENER DECANTS
   */

  const decantIds = data.items.map(i => i.decantId)

  const decants = await DecantModel.find({
    _id: { $in: decantIds }
  })

  const mapaDecants = new Map(
    decants.map(d => [d._id.toString(), d])
  )

  /**
   * VALIDAR STOCK
   */

  for (const item of data.items) {

    const decant = mapaDecants.get(item.decantId)

    if (!decant) {
      throw new ApiError(404, "Decant no encontrado")
    }

    if (item.cantidad > 5) {
      throw new ApiError(400, "Máximo 5 unidades por producto")
    }

    if (decant.stockDisponible < item.cantidad) {
      throw new ApiError(400, "Stock insuficiente")
    }

  }

  /**
   * ARMAR ITEMS
   */

  for (const item of data.items) {

    const decant = mapaDecants.get(item.decantId)!

    const subtotal = decant.precio * item.cantidad

    total += subtotal

    itemsFinal.push({
      decantId: decant._id,
      cantidad: item.cantidad,
      precioUnitario: decant.precio
    })

  }

  /**
   * GENERAR NUMERO DE PEDIDO
   */

  const numeroPedido = await generarNumeroPedido()

  /**
   * CREAR PEDIDO
   */

  const pedido = await PedidoModel.create({

    numeroPedido,

    clienteNombre: data.clienteNombre,
    clienteTelefono: data.clienteTelefono,
    direccion: data.direccion,

    items: itemsFinal,

    total,

    estado: ESTADO_PEDIDO.PENDIENTE

  })

  return pedido

}


/**
 * INICIAR PEDIDO
 * RESERVA STOCK
 */

export async function iniciarPedido(pedidoId: string) {

  const pedido = await PedidoModel.findById(pedidoId)

  if (!pedido) {
    throw new ApiError(404, "Pedido no encontrado")
  }

  if (pedido.estado !== ESTADO_PEDIDO.PENDIENTE) {
    throw new ApiError(400, "Pedido no válido para iniciar")
  }

  for (const item of pedido.items) {
    await reservarStock(item.decantId.toString(), item.cantidad)
  }

  pedido.estado = ESTADO_PEDIDO.EN_PROCESO

  await pedido.save()

  return pedido

}


/**
 * CONFIRMAR PEDIDO
 * CONFIRMA VENTA
 */

export async function confirmarPedido(pedidoId: string) {

  const pedido = await PedidoModel.findById(pedidoId)

  if (!pedido) {
    throw new ApiError(404, "Pedido no encontrado")
  }

  if (pedido.estado !== ESTADO_PEDIDO.EN_PROCESO) {
    throw new ApiError(400, "Pedido no está en proceso")
  }

  for (const item of pedido.items) {
    await confirmarVenta(item.decantId.toString(), item.cantidad)
  }

  pedido.estado = ESTADO_PEDIDO.PAGADO

  await pedido.save()

  return pedido

}


/**
 * CANCELAR PEDIDO
 */

export async function cancelarPedido(pedidoId: string) {

  const pedido = await PedidoModel.findById(pedidoId)

  if (!pedido) {
    throw new ApiError(404, "Pedido no encontrado")
  }

  if (pedido.estado === ESTADO_PEDIDO.PAGADO) {
    throw new ApiError(400, "No se puede cancelar un pedido pagado")
  }

  /**
   * SI ESTABA EN PROCESO
   * LIBERAR STOCK
   */

  if (pedido.estado === ESTADO_PEDIDO.EN_PROCESO) {

    for (const item of pedido.items) {
      await liberarStock(item.decantId.toString(), item.cantidad)
    }

  }

  pedido.estado = ESTADO_PEDIDO.CANCELADO

  await pedido.save()

  return pedido

}


/**
 * OBTENER PEDIDO
 */

export async function obtenerPedido(id: string) {

  const pedido = await PedidoModel.findById(id)
    .populate({
      path: "items.decantId",
      populate: {
        path: "perfumeId",
        select: "nombre marca"
      }
    })

  if (!pedido) {
    throw new ApiError(404, "Pedido no encontrado")
  }

  return pedido

}


/**
 * LISTAR PEDIDOS ADMIN
 * PAGINADO
 */

export async function listarPedidosAdmin(
  page: number = 1,
  limit: number = 10
) {

  const skip = (page - 1) * limit

  const [pedidos, total] = await Promise.all([

    PedidoModel.find()
      .populate({
        path: "items.decantId",
        populate: {
          path: "perfumeId",
          select: "nombre marca"
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    PedidoModel.countDocuments()

  ])

  const totalPages = Math.ceil(total / limit)

  return {
    data: pedidos,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  }

}

export async function anularPedido(pedidoId: string) {

  const pedido = await PedidoModel.findById(pedidoId)

  if (!pedido) {
    throw new ApiError(404, "Pedido no encontrado")
  }

  if (pedido.estado !== ESTADO_PEDIDO.PAGADO) {
    throw new ApiError(400, "Solo se pueden anular pedidos pagados")
  }

  for (const item of pedido.items) {
    await liberarStock(item.decantId.toString(), item.cantidad)
  }

  pedido.estado = ESTADO_PEDIDO.ANULADO

  await pedido.save()

  return pedido
}