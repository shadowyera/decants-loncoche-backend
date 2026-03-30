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
   🔥 TRUST PROXY (Railway / Render / Vercel)
  */
  app.set("trust proxy", 1);

  /*
   🌐 CORS CONFIG ANTI-ERRORES
  */
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://decantsloncoche.cl",
    "https://www.decantsloncoche.cl"
  ];

  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      try {
        console.log("🌐 CORS ORIGIN:", origin);

        // ✅ permitir requests sin origin (Postman, CRON, mobile apps)
        if (!origin) {
          return callback(null, true);
        }

        // ✅ exact match
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // ✅ cualquier deploy de Vercel
        if (origin.endsWith(".vercel.app")) {
          return callback(null, true);
        }

        // ✅ permitir subdominios propios (por si agregas admin.decants...)
        if (origin.includes("decantsloncoche.cl")) {
          return callback(null, true);
        }

        // ⚠️ fallback: NO romper la app
        console.warn("⛔ CORS bloqueado:", origin);

        return callback(null, false); // ← importante: no tirar error
      } catch (error) {
        console.error("💥 CORS ERROR:", error);

        // fallback total para evitar crash
        return callback(null, true);
      }
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  };

  // ✅ manejar preflight SIEMPRE
  app.options(/.*/, cors(corsOptions));

  // ✅ aplicar CORS global
  app.use(cors(corsOptions));

  /*
   📦 BODY PARSER
  */
  app.use(express.json());

  /*
   ❤️ HEALTH CHECK
  */
  app.get("/health", (_, res) => {
    res.json({ status: "ok" });
  });

  /*
   🚀 API ROUTES
  */
  app.use("/api/catalogo", catalogoRoutes);
  app.use("/api/pedidos", pedidoRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);

  /*
   ❌ 404
  */
  app.use((_, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  /*
   🧯 ERROR HANDLER
  */
  app.use(errorMiddleware);

  return app;
}