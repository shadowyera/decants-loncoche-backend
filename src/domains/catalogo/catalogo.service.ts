import { PerfumeModel } from "../perfume/perfume.model"
import { ApiError } from "../../shared/errors/ApiError"
import { CatalogoProducto } from "./catalogo.types"

/**
 * OBTENER CATÁLOGO
 */

export async function obtenerCatalogo(): Promise<CatalogoProducto[]> {

  const catalogo = await PerfumeModel.aggregate([

    { $match: { activo: true } },

    /**
     * DECANTS
     */

    {
      $lookup: {
        from: "decants",
        localField: "_id",
        foreignField: "perfumeId",
        as: "decants"
      }
    },

    // 🔥 filtrar activos + precio válido
    {
      $addFields: {
        decants: {
          $filter: {
            input: "$decants",
            as: "d",
            cond: {
              $and: [
                { $eq: ["$$d.activo", true] },
                { $gt: ["$$d.precio", 0] }
              ]
            }
          }
        }
      }
    },

    // 🔥 ordenar por ml
    {
      $addFields: {
        decants: {
          $sortArray: {
            input: "$decants",
            sortBy: { ml: 1 }
          }
        }
      }
    },

    /**
     * PRECIOS Y STOCK
     */

    {
      $addFields: {
        precioDesde: { $ifNull: [{ $min: "$decants.precio" }, 0] },
        precioHasta: { $ifNull: [{ $max: "$decants.precio" }, 0] },
        stockTotal: { $ifNull: [{ $sum: "$decants.stockDisponible" }, 0] }
      }
    },

    /**
     * VENTAS
     */

    {
      $lookup: {
        from: "pedidos",
        let: { perfumeId: "$_id" },
        pipeline: [

          { $match: { estado: "PAGADO" } },
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
            $match: {
              $expr: {
                $eq: ["$decant.perfumeId", "$$perfumeId"]
              }
            }
          },

          {
            $group: {
              _id: null,
              ventas: { $sum: "$items.cantidad" }
            }
          }

        ],
        as: "ventasData"
      }
    },

    {
      $addFields: {
        ventas: {
          $ifNull: [
            { $arrayElemAt: ["$ventasData.ventas", 0] },
            0
          ]
        }
      }
    },

    /**
     * BADGES
     */

    {
      $addFields: {

        disponible: { $gt: ["$stockTotal", 0] },

        pocoStock: { $lte: ["$stockTotal", 5] },

        nuevo: {
          $gte: [
            "$createdAt",
            new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)
          ]
        },

        masVendido: { $gte: ["$ventas", 5] }

      }
    },

    /**
     * RESPONSE
     */

    {
      $project: {

        id: { $toString: "$_id" },

        marca: 1,
        nombre: 1,
        slug: 1,
        imagen: 1,

        descripcion: 1,
        notas: 1,
        familiasOlfativas: 1,

        precioDesde: 1,
        precioHasta: 1,

        stockTotal: 1,
        disponible: 1,

        nuevo: 1,
        pocoStock: 1,
        masVendido: 1,

        decants: {
          $map: {
            input: "$decants",
            as: "d",
            in: {
              id: { $toString: "$$d._id" },
              ml: "$$d.ml",
              precio: "$$d.precio",
              stockDisponible: "$$d.stockDisponible",
              sku: "$$d.sku"
            }
          }
        }

      }
    }

  ])

  return catalogo
}


/**
 * OBTENER PRODUCTO POR SLUG
 */

export async function obtenerProductoPorSlug(slug: string) {

  const producto = await PerfumeModel.aggregate([

    { $match: { slug, activo: true } },

    {
      $lookup: {
        from: "decants",
        localField: "_id",
        foreignField: "perfumeId",
        as: "decants"
      }
    },

    // 🔥 filtrar + ordenar igual que catálogo
    {
      $addFields: {
        decants: {
          $sortArray: {
            input: {
              $filter: {
                input: "$decants",
                as: "d",
                cond: {
                  $and: [
                    { $eq: ["$$d.activo", true] },
                    { $gt: ["$$d.precio", 0] }
                  ]
                }
              }
            },
            sortBy: { ml: 1 }
          }
        }
      }
    },

    {
      $project: {

        id: { $toString: "$_id" },

        marca: 1,
        nombre: 1,
        slug: 1,
        imagen: 1,

        descripcion: 1,
        notas: 1,
        familiasOlfativas: 1,

        decants: {
          $map: {
            input: "$decants",
            as: "d",
            in: {
              id: { $toString: "$$d._id" },
              ml: "$$d.ml",
              precio: "$$d.precio",
              stockDisponible: "$$d.stockDisponible",
              sku: "$$d.sku"
            }
          }
        }

      }
    }

  ])

  if (!producto.length) {
    throw new ApiError(404, "Producto no encontrado")
  }

  return producto[0]
}


/**
 * RECOMENDACIONES
 */

export async function obtenerRecomendaciones(slug: string) {

  const perfume = await PerfumeModel.findOne({
    slug,
    activo: true
  })

  if (!perfume) {
    throw new ApiError(404, "Perfume no encontrado")
  }

  const recomendaciones = await PerfumeModel.aggregate([

    {
      $match: {
        activo: true,
        slug: { $ne: slug },
        familiasOlfativas: {
          $in: perfume.familiasOlfativas || []
        }
      }
    },

    {
      $lookup: {
        from: "decants",
        localField: "_id",
        foreignField: "perfumeId",
        as: "decants"
      }
    },

    // 🔥 mismo estándar
    {
      $addFields: {
        decants: {
          $filter: {
            input: "$decants",
            as: "d",
            cond: {
              $and: [
                { $eq: ["$$d.activo", true] },
                { $gt: ["$$d.precio", 0] }
              ]
            }
          }
        }
      }
    },

    {
      $addFields: {
        precioDesde: { $ifNull: [{ $min: "$decants.precio" }, 0] },
        stockTotal: { $ifNull: [{ $sum: "$decants.stockDisponible" }, 0] }
      }
    },

    {
      $addFields: {
        disponible: { $gt: ["$stockTotal", 0] }
      }
    },

    {
      $project: {

        id: { $toString: "$_id" },

        marca: 1,
        nombre: 1,
        slug: 1,
        imagen: 1,

        precioDesde: 1,
        disponible: 1

      }
    },

    { $limit: 4 }

  ])

  return recomendaciones
}