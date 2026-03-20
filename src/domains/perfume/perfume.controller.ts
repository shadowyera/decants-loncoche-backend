import { Request, Response } from "express"

import {
  crearPerfume,
  listarPerfumes,
  obtenerPerfumePorSlug,
  obtenerDetallePerfumeAdmin
} from "./perfume.service"

import { CrearPerfumeInput } from "./perfume.types"

/* ===============================
   CREAR PERFUME
=============================== */

export async function crearPerfumeController(
  req: Request<{}, {}, CrearPerfumeInput>,
  res: Response
) {

  const perfume = await crearPerfume(req.body)

  return res.status(201).json({
    success: true,
    data: perfume
  })

}

/* ===============================
   LISTAR PERFUMES
=============================== */

export async function listarPerfumesController(
  _req: Request,
  res: Response
) {

  const perfumes = await listarPerfumes()

  return res.json({
    success: true,
    data: perfumes
  })

}

/* ===============================
   OBTENER PERFUME POR SLUG
=============================== */

export async function obtenerPerfumeController(
  req: Request<{ slug: string }>,
  res: Response
) {

  const perfume = await obtenerPerfumePorSlug(req.params.slug)

  return res.json({
    success: true,
    data: perfume
  })

}

