import mongoose,{Schema} from "mongoose";
import {baseUserSchema,baseUserModel} from "./baseUserSchema";

export interface ReceptionistSchema extends baseUserSchema{
  shift: string; // morning, evening, night
}
const receptionistSchema = new Schema <ReceptionistSchema>({
  // morning,evening,night
  shift: {
    type: String,
    default: "",
  },
});

export const Receptionist = baseUserModel.discriminator<ReceptionistSchema>("receptionist", receptionistSchema);

