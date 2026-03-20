import express from "express";
import cors from "cors";
import path from "path";

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
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // 🔥 abierto (luego puedes restringir)
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  };

  app.use(cors(corsOptions));

  /*
   ⚠️ IMPORTANTE:
   Express 5 ya maneja OPTIONS automáticamente con cors()
   👉 NO usar app.options("*")
  */

  /*
   BODY PARSER
  */

  app.use(express.json());

  /*
   STATIC FILES
  */

  app.use(
    "/uploads",
    express.static(path.resolve(process.cwd(), "uploads"))
  );

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