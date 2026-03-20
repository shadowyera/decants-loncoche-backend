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

  app.use(cors());
  app.use(express.json());

  /*
   SERVIR ARCHIVOS ESTÁTICOS
   Esto permite acceder a /uploads desde el navegador
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