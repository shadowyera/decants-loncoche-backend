import mongoose from "mongoose"
import bcrypt from "bcrypt"

import { UsuarioModel } from "../domains/usuario/usuario.model"
import process from "process"

async function seedAdmin() {

  await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://shadowyera_db_user:CGmO9UxZit69venB@decantsloncoche.twqzily.mongodb.net/decants-loncoche")

  const existe = await UsuarioModel.findOne({
    email: "admin@decants.cl"
  })

  if (existe) {
    console.log("Admin ya existe")
    process.exit()
  }

  const passwordHash = await bcrypt.hash("admin123", 10)

  await UsuarioModel.create({
    email: "admin@decants.cl",
    password: passwordHash,
    role: "ADMIN"
  })

  console.log("Admin creado")
  process.exit()
}

seedAdmin()