// Initialize express server

import express ,{ Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectedToMongoDB } from "./utils/connectToMongoDB ";


dotenv.config();


const port : number|string = process.env.PORT || 7000;
const app = express();


app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

app.get("/", (req:Request, res:Response): void => {
  res.send("wellcome to Hospital Management System Server :)");
});


connectedToMongoDB()
.then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
.catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
  process.exit(1);
});
