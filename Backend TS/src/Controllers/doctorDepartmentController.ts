import { Request, Response } from "express";
import {Doctor_Department} from "../Schemas/doctoDepartmentSchema";

export const addDoctorDepartment = async (req:Request, res:Response) => {
  
  
  try {
    const { name, description, image } = req.body;
    

    // Basic validation
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    //check duplicate and case sensitive department name
    const existingDepartment = await Doctor_Department.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingDepartment) {
      return res.status(400).json({ message: "Department already exists" });
    }

    // Create new department
    else {
      const newDepartment = new Doctor_Department({
        name,
        description,
        image,
      });

      await newDepartment.save();

      res.status(201).json({
        message: "Department added successfully",
        department: newDepartment.name,
      });
      console.log(newDepartment.name, "department added successfully:");
    }
  } catch (error) {
    console.error("Error adding department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
