import { Request, Response } from "express"

import { DecantModel } from "../decant/decant.model"
import { PerfumeModel } from "../perfume/perfume.model"

import { crearDecant, listarDecantsPorPerfume } from "../decant/decant.service"


/* ===============================
   CREAR DECANT
=============================== */

export async function crearDecantAdminController(
  req: Request,
  res: Response
) {

  try {

    const decant = await crearDecant(req.body)

    res.status(201).json(decant)

  } catch (error) {

    res.status(400).json({
      error: (error as Error).message
    })

  }

}


/* ===============================
   LISTAR DECANTS (ADMIN)
=============================== */

export async function listarDecantsAdminController(
  _: Request,
  res: Response
) {

  try {

    const decants = await DecantModel
      .find()
      .sort({ createdAt: -1 })
      .lean()

    res.json(decants)

  } catch (error) {

    res.status(500).json({
      error: "Error al listar decants"
    })

  }

}


/* ===============================
   OBTENER DECANT
=============================== */

export async function obtenerDecantAdminController(
  req: Request<{ id: string }>,
  res: Response
) {

  try {

    const decant = await DecantModel
      .findById(req.params.id)
      .lean()

    if (!decant) {

      return res.status(404).json({
        error: "Decant no encontrado"
      })

    }

    res.json(decant)

  } catch (error) {

    res.status(500).json({
      error: "Error al obtener decant"
    })

  }

}


/* ===============================
   ACTUALIZAR STOCK (CON VALIDACIÓN ML)
=============================== */

export async function actualizarStockDecantController(
  req: Request<{ id: string }>,
  res: Response
) {

  try {

    const { stockDisponible } = req.body

    const decant = await DecantModel.findById(req.params.id)

    if (!decant) {

      return res.status(404).json({
        error: "Decant no encontrado"
      })

    }

    const perfume = await PerfumeModel.findById(decant.perfumeId)

    if (!perfume) {

      return res.status(404).json({
        error: "Perfume no encontrado"
      })

    }

    const decants = await DecantModel.find({
      perfumeId: decant.perfumeId
    })

    let mlReservados = 0

    for (const d of decants) {

      if (!d.activo) continue

      mlReservados += d.ml * d.stockDisponible

    }

    const mlBotella = perfume.mlBotella ?? 100

    const mlActual = decant.ml * decant.stockDisponible
    const mlNuevo = decant.ml * stockDisponible

    const deltaMl = mlNuevo - mlActual

    const mlDisponibles = mlBotella - mlReservados

    if (deltaMl > mlDisponibles) {

      return res.status(400).json({
        error: "No hay suficiente perfume disponible para ese stock"
      })

    }

    decant.stockDisponible = stockDisponible

    await decant.save()

    res.json(decant.toObject())

  } catch (error) {

    res.status(500).json({
      error: "Error al actualizar stock"
    })

  }

}


/* ===============================
   ACTUALIZAR DECANT
=============================== */

export async function actualizarDecantAdminController(
  req: Request<{ id: string }>,
  res: Response
) {

  try {

    const decant = await DecantModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean()

    if (!decant) {

      return res.status(404).json({
        error: "Decant no encontrado"
      })

    }

    res.json(decant)

  } catch (error) {

    res.status(500).json({
      error: "Error al actualizar decant"
    })

  }

}


/* ===============================
   CAMBIAR ESTADO
=============================== */

export async function cambiarEstadoDecantAdminController(
  req: Request<{ id: string }>,
  res: Response
) {

  try {

    const decant = await DecantModel.findById(req.params.id)

    if (!decant) {

      return res.status(404).json({
        error: "Decant no encontrado"
      })

    }

    decant.activo = !decant.activo

    await decant.save()

    res.json(decant.toObject())

  } catch (error) {

    res.status(500).json({
      error: "Error al cambiar estado del decant"
    })

  }

}


/* ===============================
   LISTAR DECANTS POR PERFUME
=============================== */

export async function listarDecantsPorPerfumeAdminController(
  req: Request<{ id: string }>,
  res: Response
) {

  try {

    const decants = await listarDecantsPorPerfume(
      req.params.id
    )

    res.json(decants)

  } catch (error) {

    res.status(500).json({
      error: "Error al listar decants del perfume"
    })

  }

}