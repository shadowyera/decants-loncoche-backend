import { model } from "mongoose"
import { decantSchema } from "./decant.schema"

export const DecantModel = model("Decant", decantSchema)