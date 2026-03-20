import { model } from "mongoose";
import { perfumeSchema } from "./perfume.schema";

export const PerfumeModel = model("Perfume", perfumeSchema);