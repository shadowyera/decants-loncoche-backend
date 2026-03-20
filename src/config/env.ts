import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variable de entorno faltante: ${name}`);
  }

  return value;
}

export const env = {
  PORT: Number(process.env.PORT || 4000),

  MONGO_URI: requireEnv("MONGO_URI"),

  JWT_SECRET: requireEnv("JWT_SECRET"),
};