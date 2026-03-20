import slugify from "slugify"

import { PerfumeModel } from "./perfume.model"
import {
  CrearPerfumeInput,
  PerfumeDetalleAdmin,
  SugerenciaDecant
} from "./perfume.types"

import { ApiError } from "../../shared/errors/ApiError"
import { generarSkuPerfume } from "../../shared/utils/sku"

import { clasificarFamilias } from "./perfume.clasificador"
import { DecantModel } from "../decant/decant.model"
import { sugerirPrecioDecant } from "../../shared/utils/decant.pricing"

/* ===============================
   HELPERS
=============================== */

function generarSlugPerfume(marca: string, nombre: string) {
  return slugify(`${marca}-${nombre}`, {
    lower: true,
    strict: true
  })
}

function calcularFamilias(notas?: string[]) {
  if (!notas || notas.length === 0) {
    return []
  }

  return clasificarFamilias(notas)
}

/**
 * Calcula cuantos ml están reservados por decants
 */

function calcularMlReservados(decants: any[]) {

  let total = 0

  for (const decant of decants) {
    total += decant.ml * decant.stockDisponible
  }

  return total

}

/* ===============================
   CREAR PERFUME
=============================== */

export async function crearPerfume(data: CrearPerfumeInput) {

  const slug = generarSlugPerfume(data.marca, data.nombre)

  const baseSku = generarSkuPerfume(data.marca, data.nombre)

  const [existeSlug, existeSku] = await Promise.all([
    PerfumeModel.findOne({ slug }),
    PerfumeModel.findOne({ baseSku })
  ])

  if (existeSlug) {
    throw new ApiError(400, "El perfume ya existe")
  }

  if (existeSku) {
    throw new ApiError(400, "SKU base ya existe para otro perfume")
  }

  const familiasOlfativas = calcularFamilias(data.notas)

  const perfume = await PerfumeModel.create({

    ...data,

    slug,
    baseSku,
    familiasOlfativas,

    /* defaults negocio */

    mlBotella: data.mlBotella ?? 100,
    multiplicadorDecant: data.multiplicadorDecant ?? 1.8

  })

  return perfume

}

/* ===============================
   LISTAR PERFUMES
=============================== */

export async function listarPerfumes() {

  return PerfumeModel
    .find()
    .sort({ createdAt: -1 })
    .lean()

}

/* ===============================
   OBTENER PERFUME POR SLUG
=============================== */

export async function obtenerPerfumePorSlug(slug: string) {

  const perfume = await PerfumeModel
    .findOne({ slug })
    .lean()

  if (!perfume) {
    throw new ApiError(404, "Perfume no encontrado")
  }

  return perfume

}

/* ===============================
   OBTENER PERFUME POR ID
=============================== */

export async function obtenerPerfumePorId(id: string) {

  const perfume = await PerfumeModel
    .findById(id)
    .lean()

  if (!perfume) {
    throw new ApiError(404, "Perfume no encontrado")
  }

  return perfume

}

/* ===============================
   ACTUALIZAR PERFUME
=============================== */

export async function actualizarPerfume(
  id: string,
  data: Partial<CrearPerfumeInput>
) {

  const perfume = await PerfumeModel.findById(id)

  if (!perfume) {
    throw new ApiError(404, "Perfume no encontrado")
  }

  /* actualizar campos */

  Object.assign(perfume, data)

  /* recalcular familias si cambian notas */

  if (data.notas) {
    perfume.familiasOlfativas = clasificarFamilias(data.notas)
  }

  await perfume.save()

  return perfume

}

/* ===============================
   TOGGLE ESTADO
=============================== */

export async function cambiarEstadoPerfume(id: string) {

  const perfume = await PerfumeModel.findById(id)

  if (!perfume) {
    throw new ApiError(404, "Perfume no encontrado")
  }

  perfume.activo = !perfume.activo

  await perfume.save()

  return perfume

}

/* ===============================
   DETALLE ADMIN PERFUME
=============================== */

export async function obtenerDetallePerfumeAdmin(
  id: string
): Promise<PerfumeDetalleAdmin & { mlDisponibles: number }> {

  const perfume = await PerfumeModel
    .findById(id)
    .lean()

  if (!perfume) {
    throw new ApiError(404, "Perfume no encontrado")
  }

  const decants = await DecantModel
    .find({ perfumeId: id })
    .sort({ ml: 1 })
    .lean()

  /* ===============================
     ML DISPONIBLES
  =============================== */

  const mlBotella = perfume.mlBotella ?? 100

  const mlReservados = calcularMlReservados(decants)

  const mlDisponibles = Math.max(
    mlBotella - mlReservados,
    0
  )

  /* ===============================
     SUGERENCIAS DECANTS
  =============================== */

  let sugerenciasDecants: SugerenciaDecant[] = []

  if (perfume.precioBotella) {

    const tamaños = [3, 5, 10, 15]

    sugerenciasDecants = tamaños.map((ml) => ({

      ml,

      precioSugerido: sugerirPrecioDecant({
        precioBotella: perfume.precioBotella!,
        mlBotella,
        multiplicador: perfume.multiplicadorDecant ?? 1.8,
        mlDecant: ml
      })

    }))

  }

  return {
    perfume,
    decants,
    sugerenciasDecants,
    mlDisponibles
  }

}