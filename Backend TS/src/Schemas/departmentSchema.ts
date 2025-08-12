import mongoose, { Schema ,Document,Model} from "mongoose";

export interface departmentSchema extends Document {
  image?: string[],
  name: string;
  description?: string;
}
const departmentSchema = new Schema<departmentSchema>(
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

export const Department = mongoose.model<departmentSchema>("Department", departmentSchema);

