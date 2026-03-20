export interface CalcularPrecioDecantParams {
  precioBotella: number
  mlBotella: number
  multiplicador: number
  mlDecant: number
}

/* ===============================
   PRECIO BASE
=============================== */

export function calcularPrecioDecant({
  precioBotella,
  mlBotella,
  multiplicador,
  mlDecant
}: CalcularPrecioDecantParams): number {

  const precioMl = precioBotella / mlBotella

  const precioVentaMl = precioMl * multiplicador

  const precioDecant = precioVentaMl * mlDecant

  return precioDecant

}

/* ===============================
   REDONDEO COMERCIAL
=============================== */

export function redondearPrecio(precio: number): number {

  if (precio < 5000) {
    return Math.round(precio / 500) * 500
  }

  if (precio < 20000) {
    return Math.round(precio / 1000) * 1000
  }

  return Math.round(precio / 5000) * 5000

}

/* ===============================
   PRECIO FINAL SUGERIDO
=============================== */

export function sugerirPrecioDecant(params: CalcularPrecioDecantParams) {

  const base = calcularPrecioDecant(params)

  return redondearPrecio(base)

}