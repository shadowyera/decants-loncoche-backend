import { Schema } from "mongoose"

export const usuarioSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["ADMIN"],
      default: "ADMIN"
    }
  },
  {
    timestamps: true
  }
)