import { Request, Response } from "express"

import {
  cambiarEstadoDecant,
  crearDecant,
  listarDecants,
  listarDecantsPorPerfume
} from "./decant.service"

/* ===============================
   CREAR DECANT
=============================== */

export async function crearDecantController(
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
   LISTAR DECANTS
=============================== */

export async function listarDecantsController(
  _: Request,
  res: Response
) {

  try {

    const decants = await listarDecants()

    res.json(decants)

  } catch (error) {

    res.status(500).json({
      error: "Error al listar decants"
    })

  }

}

/* ===============================
   LISTAR DECANTS POR PERFUME
=============================== */

export async function listarDecantsPorPerfumeController(
  req: Request<{ perfumeId: string }>,
  res: Response
) {

  try {

    const decants = await listarDecantsPorPerfume(
      req.params.perfumeId
    )

    res.json(decants)

  } catch (error) {

    res.status(500).json({
      error: "Error al listar decants del perfume"
    })

  }

}

