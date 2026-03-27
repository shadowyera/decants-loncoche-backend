import express from "express";
import cors from "cors";

import { errorMiddleware } from "./shared/middleware/error.middleware";

import catalogoRoutes from "./domains/catalogo/catalogo.routes";
import pedidoRoutes from "./domains/pedido/pedido.routes";
import authRoutes from "./domains/usuario/auth.routes";
import adminRoutes from "./domains/admin/admin.routes";
import "./jobs/pedidos.cron";

export function createApp() {
  const app = express();

  /*
   CORS CONFIG
  */

  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://decants-loncoche-frontend.vercel.app",
    "https://decantsloncoche.cl",
    "https://www.decantsloncoche.cl"
  ];

  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      // Permitir requests sin origin (Postman, mobile apps, etc)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, origin); // 🔥 CLAVE: devolver el origin exacto
      }

      return callback(new Error("Not allowed by CORS")); // ❌ bloquear lo no permitido
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  };

  app.use(cors(corsOptions));

  // ⚠️ IMPORTANTE: preflight requests (OPTIONS)
  app.options("*", cors(corsOptions));

  /*
   BODY PARSER
  */
  app.use(express.json());

  /*
   HEALTH CHECK
  */
  app.get("/health", (_, res) => {
    res.json({ status: "ok" });
  });

  /*
   API ROUTES
  */
  app.use("/api/catalogo", catalogoRoutes);
  app.use("/api/pedidos", pedidoRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);

  /*
   404
  */
  app.use((_, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  /*
   ERROR HANDLER
  */
  app.use(errorMiddleware);

  return app;
}