import mongoose,{Schema} from "mongoose";
import {baseUserSchema,baseUserModel} from "../Schemas/baseUserSchema";

export interface doctorSchema extends baseUserSchema {
  department_id: mongoose.Types.ObjectId[];
  doctor_id?: string; // Optional, can be generated later
  bio?: string;
  language?: string[];
  specialization: string[];
  experienceYears?: number;
  license_number: string;
  availability?: {
    day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
    date?: Date;
    status: "available" | "unavailable";
  }[];
  timeSlots?: {
    start: string;
    end: string;
  }[];
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
  bio: { type: String, default: "" },
  language: {
    type: [String], 
     default: [],  
  },

  specialization: {
    type: [String],
    required: [true, "At least one specialization is required"],
    default: [],
  },
  experienceYears: { type: Number, min: 0, default: 0 },
  license_number: { type: String, unique: true, required: true },
  availability: [
    {
      day: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
      status: { type: String, enum: ["available", "unavailable"], default: "available" },
      timeSlots: [
        {
          start: { type: String }, // e.g., "09:00"
          end: { type: String },   // e.g., "12:00"
        },
      ],
    },
  ],
  consultation_fee: { type: Number, min: 0, default: 0 },
});


export const Doctor = baseUserModel.discriminator<doctorSchema>("doctor", doctorSchema);

