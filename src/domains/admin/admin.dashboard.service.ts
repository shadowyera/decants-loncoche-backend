import { PedidoModel } from "../pedido/pedido.model"
import { DecantModel } from "../decant/decant.model"
import { ESTADO_PEDIDO } from "../pedido/pedido.types"

type DashboardFilters = {
  from?: string
  to?: string
}

/**
 * PARSE FECHAS
 */
function buildDateFilter(filters?: DashboardFilters) {

  if (!filters?.from && !filters?.to) return {}

  const date: any = {}

  if (filters.from) {
    date.$gte = new Date(filters.from)
  }

  if (filters.to) {
    date.$lte = new Date(filters.to)
  }

  return { createdAt: date }
}

/**
 * DASHBOARD SERVICE PRO
 */
export async function getDashboardData(filters?: DashboardFilters) {

  const dateFilter = buildDateFilter(filters)

  const matchStage = {
    estado: ESTADO_PEDIDO.PAGADO,
    ...dateFilter
  }

  const [
    resumen,
    topPerfumes,
    ventasPorDia,
    stockCritico
  ] = await Promise.all([

    /* ===============================
       1. RESUMEN
    =============================== */

    PedidoModel.aggregate([

      { $match: matchStage },

      { $unwind: "$items" },

      {
        $group: {
          _id: null,
          revenue: { $sum: "$total" },
          pedidos: { $addToSet: "$_id" },
          decants: { $sum: "$items.cantidad" }
        }
      },

      {
        $project: {
          revenue: 1,
          decants: 1,
          pedidos: { $size: "$pedidos" },
          aov: {
            $cond: [
              { $eq: [{ $size: "$pedidos" }, 0] },
              0,
              { $divide: ["$revenue", { $size: "$pedidos" }] }
            ]
          }
        }
      }

    ]),

    /* ===============================
       2. TOP PERFUMES
    =============================== */

    PedidoModel.aggregate([

      { $match: matchStage },

      { $unwind: "$items" },

      {
        $lookup: {
          from: "decants",
          localField: "items.decantId",
          foreignField: "_id",
          as: "decant"
        }
      },

      { $unwind: "$decant" },

      {
        $lookup: {
          from: "perfumes",
          localField: "decant.perfumeId",
          foreignField: "_id",
          as: "perfume"
        }
      },

      { $unwind: "$perfume" },

      {
        $group: {
          _id: "$perfume._id",
          nombre: { $first: "$perfume.nombre" },
          cantidad: { $sum: "$items.cantidad" },
          revenue: {
            $sum: {
              $multiply: ["$items.cantidad", "$items.precioUnitario"]
            }
          }
        }
      },

      { $sort: { cantidad: -1 } },
      { $limit: 5 }

    ]),

    /* ===============================
       3. VENTAS POR DÍA
    =============================== */

    PedidoModel.aggregate([

      { $match: matchStage },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          revenue: { $sum: "$total" },
          pedidos: { $sum: 1 }
        }
      },

      { $sort: { _id: 1 } }

    ]),

    /* ===============================
       4. STOCK CRÍTICO
    =============================== */

    DecantModel.find({
      stockDisponible: { $lte: 5 },
      activo: true
    })
      .populate("perfumeId", "nombre marca")
      .sort({ stockDisponible: 1 })
      .limit(10)
      .lean()

  ])

  const resumenFinal = resumen[0] || {
    revenue: 0,
    pedidos: 0,
    decants: 0,
    aov: 0
  }

  return {
    resumen: resumenFinal,
    topPerfumes,
    ventasPorDia,
    stockCritico
  }

}