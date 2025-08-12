import mongoose from "mongoose";
import {baseUserSchema, baseUserModel} from "./baseUserSchema.js";

const appointmentSchema = new mongoose.Schema({
 
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, // or use Date if storing full datetime
    required: true,
  },
  reason: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
},{timestamps: true}); // Automatically manage created_at and updated_at fields

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
