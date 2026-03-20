import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { cloudinary } from "./cloudinary"

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "decants-loncoche",
    allowed_formats: ["jpg", "png", "jpeg", "webp"]
  })
})

export const upload = multer({ storage })