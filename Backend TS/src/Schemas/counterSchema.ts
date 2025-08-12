import mongoose,{Model,Schema,Document} from "mongoose";

export interface counterSchema extends Document {
  name: string;
  seq: number;
}

const counterSchema = new Schema<counterSchema>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

export const counterModel= mongoose.model<counterSchema>("Counter", counterSchema);