import { Router } from "express"

import { authMiddleware } from "../../shared/middleware/auth.middleware"
import { upload } from "../../shared/config/multerCloudinary"
/* =========================================================
   PERFUME CONTROLLERS
========================================================= */

import {
  crearPerfumeAdminController,
  listarPerfumesAdminController,
  obtenerPerfumeAdminController,
  actualizarPerfumeAdminController,
  cambiarEstadoPerfumeAdminController,
  obtenerDetallePerfumeAdminController
} from "./admin.perfume.controller"

/* =========================================================
   DECANT CONTROLLERS
========================================================= */

import {
  crearDecantAdminController,
  listarDecantsAdminController,
  obtenerDecantAdminController,
  actualizarDecantAdminController,
  actualizarStockDecantController,
  cambiarEstadoDecantAdminController,
  listarDecantsPorPerfumeAdminController
} from "./admin.decant.controller"

/* =========================================================
   PEDIDO CONTROLLERS
========================================================= */

import {
  listarPedidosAdminController,
  iniciarPedidoController,
  confirmarPedidoController,
  cancelarPedidoController
} from "./admin.pedido.controller"

import { getAdminDashboard } from "./admin.dashboard.controller"

const router = Router()

/* =========================================================
   PROTEGER TODAS LAS RUTAS ADMIN
========================================================= */

router.use(authMiddleware)





/* =========================================================
   PERFUMES
========================================================= */

/**
 * Crear perfume
 */
router.post(
  "/perfumes",
  upload.single("imagen"),
  crearPerfumeAdminController
)

/**
 * Listar perfumes
 */
router.get(
  "/perfumes",
  listarPerfumesAdminController
)

/**
 * Obtener perfume por ID
 */
router.get(
  "/perfumes/:id",
  obtenerPerfumeAdminController
)

/**
 * Detalle completo del perfume (admin)
 * Incluye:
 * - perfume
 * - decants
 * - sugerenciasDecants
 * - mlDisponibles
 */
router.get(
  "/perfumes/:id/detalle",
  obtenerDetallePerfumeAdminController
)

/**
 * Actualizar perfume
 */
router.patch(
  "/perfumes/:id",
  actualizarPerfumeAdminController
)

/**
 * Activar / desactivar perfume
 */
router.patch(
  "/perfumes/:id/estado",
  cambiarEstadoPerfumeAdminController
)





/* =========================================================
   DECANTS
========================================================= */

/**
 * Crear decant
 */
router.post(
  "/decants",
  crearDecantAdminController
)

/**
 * Listar decants
 */
router.get(
  "/decants",
  listarDecantsAdminController
)

/**
 * Obtener decant por ID
 */
router.get(
  "/decants/:id",
  obtenerDecantAdminController
)

/**
 * Actualizar decant (precio, etc.)
 */
router.patch(
  "/decants/:id",
  actualizarDecantAdminController
)

/**
 * Actualizar stock del decant
 */
router.patch(
  "/decants/:id/stock",
  actualizarStockDecantController
)

/**
 * Activar / desactivar decant
 */
router.patch(
  "/decants/:id/estado",
  cambiarEstadoDecantAdminController
)

/**
 * Listar decants de un perfume
 */
router.get(
  "/perfumes/:id/decants",
  listarDecantsPorPerfumeAdminController
)





/* =========================================================
   PEDIDOS
========================================================= */

/**
 * Listar pedidos (PAGINADO)
 * 
 * Query params:
 * 
 * /admin/pedidos?page=1&limit=10
 */
router.get(
  "/pedidos",
  listarPedidosAdminController
)

/**
 * Iniciar pedido
 * Reserva stock
 */
router.post(
  "/pedidos/:id/iniciar",
  iniciarPedidoController
)

/**
 * Confirmar pedido
 * Confirma venta
 */
router.post(
  "/pedidos/:id/confirmar",
  confirmarPedidoController
)

/**
 * Cancelar pedido
 */
router.post(
  "/pedidos/:id/cancelar",
  cancelarPedidoController
)

/**
 * Dashboard
 */
router.get("/dashboard", 
  getAdminDashboard
)


export default router