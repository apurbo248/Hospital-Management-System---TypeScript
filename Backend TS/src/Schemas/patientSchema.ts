import mongoose,{Schema} from "mongoose";
import {baseUserSchema,baseUserModel} from "../Schemas/baseUserSchema";

export interface IPatientSchema extends baseUserSchema {
  medical_history?: string;
}

const patientSchema = new Schema<IPatientSchema>({
  medical_history: {
    type: String,
    default: "",
  },
});

export const Patient = baseUserModel.discriminator<IPatientSchema>("patient", patientSchema);

