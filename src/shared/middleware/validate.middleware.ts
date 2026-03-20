import { Request, Response, NextFunction } from "express"
import { ZodSchema, ZodError } from "zod"

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {

      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      }) as {
        body: any
        params: any
        query: any
      }

      req.body = parsed.body
      req.params = parsed.params
      req.query = parsed.query

      next()

    } catch (err) {

      if (err instanceof ZodError) {
        return res.status(400).json({
          error: "ValidationError",
          details: err.issues
        })
      }

      next(err)
    }
  }
}