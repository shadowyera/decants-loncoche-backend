import { Request, Response } from "express"
import { login } from "./auth.service"
import { ApiError } from "../../shared/errors/ApiError"

export async function loginController(req: Request, res: Response) {

  const { email, password } = req.body || {}

  if (!email || !password) {
    throw new ApiError(400, "Email y password requeridos")
  }

  const result = await login(email, password)

  res.json(result)
}