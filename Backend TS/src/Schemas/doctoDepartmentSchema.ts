import mongoose, { Schema ,Document,Model} from "mongoose";

export interface doctorDepartmentSchema extends Document {
  image?: string[],
  name: string;
  description?: string;
}
const doctorDepartmentSchema = new Schema<doctorDepartmentSchema>(
  {
    image: [
      {
        type: String,
        default: "",
      },
    ],
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Automatically manage created_at and updated_at fields
  }
);

export const Doctor_Department = mongoose.model<doctorDepartmentSchema>("Doctor_Department", doctorDepartmentSchema);

