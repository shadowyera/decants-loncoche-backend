import { Request, Response, NextFunction } from "express"
import { ApiError } from "../errors/ApiError"

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {

  /* ===============================
     API ERROR (errores controlados)
  =============================== */

  if (err instanceof ApiError) {

    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message
      }
    })

  }

  /* ===============================
     ERRORES MONGOOSE
  =============================== */

  if (err instanceof Error && "code" in err && err.code === 11000) {

    return res.status(400).json({
      success: false,
      error: {
        message: "Valor duplicado en un campo único"
      }
    })

  }

  /* ===============================
     ERROR DESCONOCIDO
  =============================== */

  console.error(err)

  return res.status(500).json({
    success: false,
    error: {
      message: "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && err instanceof Error
        ? { stack: err.stack }
        : {})
    }
  })

}