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

/**
 * 🔥 Normalizar notas (trim + sin duplicados)
 */
function normalizarNotas(notas?: string[]) {
  if (!notas) return []

  return [...new Set(
    notas.map(n => n.trim()).filter(Boolean)
  )]
}

/**
 * 🔥 Clasificación con orden + límite (UX ready)
 */
function calcularFamilias(notas?: string[]) {
  if (!notas || notas.length === 0) return []

  const familias = clasificarFamilias(notas)

  const prioridad = [
    "dulce",
    "fresco",
    "acuatico",
    "tropical",
    "citrico",
    "frutal",
    "amaderado",
    "ambarado",
    "almizclado",
    "floral",
    "especiado",
    "gourmand",
    "aromatico",
    "verde",
    "cuero",
    "tabaco"
  ]

  const ordenadas = [...familias].sort((a, b) => {
    const indexA = prioridad.indexOf(a)
    const indexB = prioridad.indexOf(b)

    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
  })

  return ordenadas.slice(0, 4)
}

/**
 * 🔥 SKU ÚNICO (ANTI COLISIONES)
 */
async function generarSkuUnico(marca: string, nombre: string) {
  const base = generarSkuPerfume(marca, nombre)

  let sku = base
  let contador = 1

  while (true) {
    const existe = await PerfumeModel.exists({ baseSku: sku })

    if (!existe) return sku

    sku = `${base}-${contador}`
    contador++
  }
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

  const existeSlug = await PerfumeModel.findOne({ slug })

  if (existeSlug) {
    throw new ApiError(400, "El perfume ya existe")
  }

  const baseSku = await generarSkuUnico(data.marca, data.nombre)

  const notasNormalizadas = normalizarNotas(data.notas)
  const familiasOlfativas = calcularFamilias(notasNormalizadas)

  const perfume = await PerfumeModel.create({
    ...data,
    notas: notasNormalizadas,
    slug,
    baseSku,
    familiasOlfativas,

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

  Object.assign(perfume, data)

  if (data.notas) {
    const notasNormalizadas = normalizarNotas(data.notas)
    perfume.notas = notasNormalizadas
    perfume.familiasOlfativas = calcularFamilias(notasNormalizadas)
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