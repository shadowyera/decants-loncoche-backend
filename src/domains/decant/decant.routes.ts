import { Router } from "express"
import {
  crearDecantController,
  listarDecantsController,
  listarDecantsPorPerfumeController
} from "./decant.controller"

const router = Router()

router.get("/", listarDecantsController)

router.get("/perfume/:perfumeId", listarDecantsPorPerfumeController)


export default router