import mongoose from "mongoose"
import bcrypt from "bcrypt"
import process from "process"
import "dotenv/config"
import { UsuarioModel } from "../domains/usuario/usuario.model"

async function seedAdmin() {
  try {
    /* =========================
       VALIDACIÓN ENV
    ========================= */

    const mongoUri = process.env.MONGO_URI
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!mongoUri) {
      throw new Error("Falta MONGO_URI en .env")
    }

    if (!adminEmail || !adminPassword) {
      throw new Error("Faltan ADMIN_EMAIL o ADMIN_PASSWORD en .env")
    }

    /* =========================
       CONEXIÓN DB
    ========================= */

    await mongoose.connect(mongoUri)
    console.log("Mongo conectado")

    /* =========================
       CHECK EXISTENTE
    ========================= */

    const existe = await UsuarioModel.findOne({
      email: adminEmail
    })

    if (existe) {
      console.log("Admin ya existe, no se crea otro")
      process.exit(0)
    }

    /* =========================
       CREAR ADMIN
    ========================= */

    const passwordHash = await bcrypt.hash(adminPassword, 10)

    await UsuarioModel.create({
      email: adminEmail,
      password: passwordHash,
      role: "ADMIN"
    })

    console.log("Admin creado correctamente")

    process.exit(0)

  } catch (error) {
    console.error("Error en seedAdmin:", error)
    process.exit(1)
  }
}

seedAdmin()