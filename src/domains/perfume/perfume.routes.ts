import { Router } from "express";
import {
  listarPerfumesController,
  obtenerPerfumeController,
} from "./perfume.controller";

const router = Router();

router.get("/", listarPerfumesController);

router.get("/:slug", obtenerPerfumeController);

export default router;