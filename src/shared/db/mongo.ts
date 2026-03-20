import mongoose from "mongoose";
import { env } from "../../config/env";

export async function connectMongo() {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Error conectando MongoDB");

    throw error;
  }
}