import { DecantModel } from "./decant.model"
import { CrearDecantInput } from "./decant.types"

import { PerfumeModel } from "../perfume/perfume.model"

import { ApiError } from "../../shared/errors/ApiError"
import { generarSkuDecant } from "../../shared/utils/sku"

/* ===============================
   HELPERS
=============================== */

async function calcularMlReservados(perfumeId: string) {

  const decants = await DecantModel.find({
    perfumeId
  }).lean()

  let total = 0

  for (const decant of decants) {
    total += decant.ml * decant.stockDisponible
  }

  return total

}

/* ===============================
   CREAR DECANT
=============================== */

export async function crearDecant(data: CrearDecantInput) {

  const perfume = await PerfumeModel.findById(data.perfumeId)

  if (!perfume) {
    throw new ApiError(404, "Perfume no encontrado")
  }

  /* ===============================
     VALIDAR DUPLICADO
  =============================== */

  const existe = await DecantModel.findOne({
    perfumeId: data.perfumeId,
    ml: data.ml
  })

  if (existe) {
    throw new ApiError(
      400,
      "Este decant ya existe para el perfume"
    )
  }

  /* ===============================
     VALIDAR ML DISPONIBLES
  =============================== */

  const mlBotella = perfume.mlBotella ?? 100

  const mlReservados = await calcularMlReservados(
    data.perfumeId
  )

  const mlDisponibles = mlBotella - mlReservados

  const mlNecesarios =
    data.ml * data.stockDisponible

  if (mlNecesarios > mlDisponibles) {
    throw new ApiError(
      400,
      "No hay suficiente perfume disponible en la botella"
    )
  }

  /* ===============================
     SKU
  =============================== */

  const sku = generarSkuDecant(
    perfume.baseSku,
    data.ml
  )

  /* ===============================
     CREAR DECANT
  =============================== */

  const decant = await DecantModel.create({
    perfumeId: data.perfumeId,
    ml: data.ml,
    precio: data.precio,
    stockDisponible: data.stockDisponible,
    stockReservado: 0,
    sku
  })

  return decant

}

/* ===============================
   LISTAR DECANTS
=============================== */

export async function listarDecants() {

  return DecantModel
    .find({ activo: true })
    .populate("perfumeId")
    .sort({ createdAt: -1 })
    .lean()

}

/* ===============================
   LISTAR DECANTS POR PERFUME
=============================== */

export async function listarDecantsPorPerfume(
  perfumeId: string
) {

  return DecantModel
    .find({
      perfumeId,
      activo: true
    })
    .sort({ ml: 1 })
    .lean()

}

/* ===============================
   OBTENER DECANT
=============================== */

export async function obtenerDecantPorId(
  id: string
) {

  const decant = await DecantModel
    .findById(id)
    .lean()

  if (!decant) {
    throw new ApiError(404, "Decant no encontrado")
  }

  return decant

}

/* ===============================
   RESERVAR STOCK
   (al crear pedido)
=============================== */

export async function reservarStock(
  decantId: string,
  cantidad: number
) {

  const decant = await DecantModel.findOneAndUpdate(
    {
      _id: decantId,
      stockDisponible: { $gte: cantidad }
    },
    {
      $inc: {
        stockDisponible: -cantidad,
        stockReservado: cantidad
      }
    },
    {
      new: true
    }
  )

  if (!decant) {
    throw new ApiError(
      400,
      "Stock insuficiente"
    )
  }

  return decant

}

/* ===============================
   CONFIRMAR VENTA
   (pago exitoso)
=============================== */

export async function confirmarVenta(
  decantId: string,
  cantidad: number
) {

  const decant = await DecantModel.findById(
    decantId
  )

  if (!decant) {
    throw new ApiError(404, "Decant no encontrado")
  }

  decant.stockReservado -= cantidad

  await decant.save()

  return decant

}

/* ===============================
   LIBERAR STOCK
   (pedido cancelado)
=============================== */

export async function liberarStock(
  decantId: string,
  cantidad: number
) {

  const decant = await DecantModel.findOneAndUpdate(
    {
      _id: decantId,
      stockReservado: { $gte: cantidad }
    },
    {
      $inc: {
        stockDisponible: cantidad,
        stockReservado: -cantidad
      }
    },
    { new: true }
  )

  if (!decant) {
    throw new ApiError(
      400,
      "No se pudo liberar stock"
    )
  }

  return decant

}

/* ===============================
   TOGGLE ESTADO DECANT
=============================== */

export async function cambiarEstadoDecant(id: string) {

  const decant = await DecantModel.findById(id)

  if (!decant) {
    throw new ApiError(404, "Decant no encontrado")
  }

  decant.activo = !decant.activo

  await decant.save()

  return decant

}