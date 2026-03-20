import { Router } from "express"

import {
  obtenerCatalogoController,
  obtenerProductoController,
  obtenerRecomendacionesController
} from "./catalogo.controller"

const router = Router()

router.get("/", obtenerCatalogoController)

router.get("/:slug", obtenerProductoController)

router.get("/:slug/recomendaciones", obtenerRecomendacionesController)

export default router