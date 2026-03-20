import { model } from "mongoose"
import { usuarioSchema } from "./usuario.schema"

export const UsuarioModel = model("Usuario", usuarioSchema)