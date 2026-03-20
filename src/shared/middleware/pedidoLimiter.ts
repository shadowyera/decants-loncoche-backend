import rateLimit from "express-rate-limit"

export const pedidoLimiter = rateLimit({

  windowMs: 10 * 60 * 1000, // 10 minutos

  max: 5, // máximo 5 pedidos por IP

  message: {
    error: "Demasiados pedidos. Intenta nuevamente en unos minutos."
  },

  standardHeaders: true,
  legacyHeaders: false

})