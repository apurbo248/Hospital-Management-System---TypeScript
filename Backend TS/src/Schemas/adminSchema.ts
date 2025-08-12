import mongoose ,{Schema}from "mongoose";
import { baseUserSchema,baseUserModel } from "./baseUserSchema";

export interface adminSchema extends baseUserSchema {
  accessLevel: "super" | "moderate";
} 

const adminSchema = new Schema<adminSchema>({
  accessLevel: {
    type: String,
    enum: ["super", "moderate"],
    default: "moderate",
  },
});

export const Admin = baseUserModel.discriminator<adminSchema>("admin", adminSchema);

