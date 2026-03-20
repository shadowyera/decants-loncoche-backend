export function generarSkuPerfume(
  marca: string,
  nombre: string
): string {

  const base = `${marca} ${nombre}`

  return base
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function generarSkuDecant(
  baseSku: string,
  ml: number
): string {

  return `${baseSku}-${ml}ML`
}