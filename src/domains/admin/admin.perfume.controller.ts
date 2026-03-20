import { Request, Response } from "express"

import {
  crearPerfume,
  listarPerfumes,
  obtenerPerfumePorId,
  actualizarPerfume,
  cambiarEstadoPerfume,
  obtenerDetallePerfumeAdmin
} from "../perfume/perfume.service"

/**
 * CREAR PERFUME
 */

export async function crearPerfumeAdminController(
  req: Request,
  res: Response
) {

  try {

    const imagen = req.file?.path

    const perfume = await crearPerfume({
      ...req.body,
      imagen
    })

    res.status(201).json(perfume)

  } catch (error) {

    res.status(400).json({
      error: (error as Error).message
    })

  }

}

/**
 * LISTAR PERFUMES
 */

export async function listarPerfumesAdminController(
  req: Request,
  res: Response
) {

  try {

    const perfumes = await listarPerfumes()

    res.json(perfumes)

  } catch (error) {

    res.status(500).json({
      error: "Error al listar perfumes"
    })

  }

}

/**
 * OBTENER PERFUME
 */

export async function obtenerPerfumeAdminController(
  req: Request<{ id: string }>,
  res: Response
) {

  try {

    const perfume = await obtenerPerfumePorId(req.params.id)

    res.json(perfume)

  } catch (error) {

    res.status(404).json({
      error: "Perfume no encontrado"
    })

  }

}

/**
 * DETALLE PERFUME ADMIN
 * Devuelve:
 * - perfume
 * - decants
 * - sugerencias de precios
 * - ml disponibles
 */

export async function obtenerDetallePerfumeAdminController(
  req: Request<{ id: string }>,
  res: Response
) {

  try {

    const data = await obtenerDetallePerfumeAdmin(
      req.params.id
    )

    res.json(data)

  } catch (error) {

    res.status(404).json({
      error: "Perfume no encontrado"
    })

  }

}

/**
 * ACTUALIZAR PERFUME
 */

export async function actualizarPerfumeAdminController(
  req: Request<{ id: string }>,
  res: Response
) {

  try {

    const perfume = await actualizarPerfume(
      req.params.id,
      req.body
    )

    res.json(perfume)

  } catch (error) {

    res.status(404).json({
      error: "Perfume no encontrado"
    })

  }

}

/**
 * ACTIVAR / DESACTIVAR PERFUME
 */

export async function cambiarEstadoPerfumeAdminController(
  req: Request<{ id: string }>,
  res: Response
) {

  try {

    const perfume = await cambiarEstadoPerfume(
      req.params.id
    )

    res.json(perfume)

  } catch (error) {

    res.status(404).json({
      error: "Perfume no encontrado"
    })

  }

}