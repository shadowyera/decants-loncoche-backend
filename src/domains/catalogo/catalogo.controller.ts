import { Request, Response } from "express"

import {
  obtenerCatalogo,
  obtenerProductoPorSlug,
  obtenerRecomendaciones
} from "./catalogo.service"

/**
 * GET /api/catalogo
 */

export async function obtenerCatalogoController(
  _: Request,
  res: Response
) {

  const catalogo = await obtenerCatalogo()

  res.json(catalogo)

}

/**
 * GET /api/catalogo/:slug
 */

export async function obtenerProductoController(
  req: Request<{ slug: string }>,
  res: Response
) {

  const producto = await obtenerProductoPorSlug(req.params.slug)

  res.json(producto)

}

/**
 * GET /api/catalogo/:slug/recomendaciones
 */

export async function obtenerRecomendacionesController(
  req: Request<{ slug: string }>,
  res: Response
) {

  const data = await obtenerRecomendaciones(req.params.slug)

  res.json(data)

}