import { createApp } from "./app";
import { connectMongo } from "./shared/db/mongo";
import { env } from "./config/env";

async function start() {
  await connectMongo();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${env.PORT}`);
  });
}

start();