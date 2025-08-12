// Initialize express server

import express ,{ Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyparser from "body-parser";
import { connectedToMongoDB } from "./Utils/connectToMongoDB ";
import  doctorDepartmentRoutes  from "./routers/doctorDepartmentRoutes";
import userRoutes from "./routers/userRoutes"

dotenv.config();
const app = express();

const port : number|string = process.env.PORT || 7000;



app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

app.get("/", (req:Request, res:Response): void => {
  res.send("wellcome to Hospital Management System Server :)");
});

app.use("/v1", doctorDepartmentRoutes);
app.use("/v1",userRoutes);

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
