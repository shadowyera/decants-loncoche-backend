import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { UsuarioModel } from "./usuario.model"
import { ApiError } from "../../shared/errors/ApiError"
import { env } from "../../config/env"

export async function login(email: string, password: string) {

  const usuario = await UsuarioModel.findOne({ email })

  if (!usuario) {
    throw new ApiError(401, "Credenciales inválidas")
  }

  const match = await bcrypt.compare(password, usuario.password)

  if (!match) {
    throw new ApiError(401, "Credenciales inválidas")
  }

  const token = jwt.sign(
    {
      userId: usuario._id,
      role: usuario.role
    },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  return { token }
}