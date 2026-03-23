import { Request, Response } from "express"
import { getDashboardData } from "./admin.dashboard.service"

/**
 * VALIDAR FECHA
 */
function isValidDate(value?: string) {
  if (!value) return true
  const date = new Date(value)
  return !isNaN(date.getTime())
}

/**
 * OBTENER DASHBOARD (ADMIN)
 */
export async function getAdminDashboard(
  req: Request,
  res: Response
) {
  try {

    const { from, to } = req.query as {
      from?: string
      to?: string
    }

    /* ===============================
       VALIDACIONES
    =============================== */

    if (!isValidDate(from) || !isValidDate(to)) {
      return res.status(400).json({
        ok: false,
        message: "Formato de fecha inválido (usar YYYY-MM-DD)"
      })
    }

    if (from && to && new Date(from) > new Date(to)) {
      return res.status(400).json({
        ok: false,
        message: "'from' no puede ser mayor que 'to'"
      })
    }

    /* ===============================
       DEFAULT: ÚLTIMOS 30 DÍAS
    =============================== */

    const today = new Date()
    const defaultFrom = new Date()
    defaultFrom.setDate(today.getDate() - 30)

    const filters = {
      from: from || defaultFrom.toISOString(),
      to: to || today.toISOString()
    }

    /* ===============================
       SERVICE
    =============================== */

    const data = await getDashboardData(filters)

    /* ===============================
       RESPONSE
    =============================== */

    res.json({
      ok: true,
      data,
      filters
    })

  } catch (error: any) {

    console.error("Dashboard error:", error)

    res.status(500).json({
      ok: false,
      message: "Error obteniendo dashboard"
    })

  }
}