import mongoose,{Schema} from "mongoose";
import {baseUserSchema,baseUserModel} from "../Schemas/baseUserSchema.js";

export interface doctorSchema extends baseUserSchema {
  department_id: mongoose.Types.ObjectId[];
  bio?: string;
  specialization: string[];
  experienceYears?: number;
  license_number: string;
  appointments?: mongoose.Types.ObjectId[];
  availability?: string[];
  consultation_fee?: number;
} 
const doctorSchema = new Schema<doctorSchema>({
  department_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  ],
  bio: {
    type: String,
    default: "",
  },
  specialization: {
    type: [String],
    required: [true, "At least one specialization is required"],
    default: [],
  },
  experienceYears: {
    type: Number,
    min: 0,
    default: 0,
  },
  license_number: {
    type: String,
    unique: true,
    required: true,
  },
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  availability: {
    type: [String],
    enum: ["available", "unavailable"],
    default: [],
  },
  consultation_fee: {
    type: Number,
    min: 0,
    default: 0,
  },
});

export const Doctor = baseUserModel.discriminator<doctorSchema>("doctor", doctorSchema);

