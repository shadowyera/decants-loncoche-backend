import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import { env } from "../../config/env"

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const auth = req.headers.authorization

  if (!auth) {
    return res.status(401).json({ error: "No autorizado" })
  }

  const token = auth.split(" ")[1]

  try {

    const payload = jwt.verify(token, env.JWT_SECRET)

    ;(req as any).user = payload

    next()

  } catch {

    return res.status(401).json({ error: "Token inválido" })
  }
}