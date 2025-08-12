

import {counterModel,counterSchema} from "../Schemas/counterSchema";

export const generateSequentialUserId = async () :Promise<string> => {
  console.log(counterModel);
  const counter : counterSchema| null = await counterModel.findOneAndUpdate(
    { name: "userId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).lean();

  if (!counter) {
    throw new Error("Failed to generate user ID sequence");
  }

  const paddedNumber = counter.seq.toString().padStart(6, "0");
  return `${paddedNumber}`;
};
