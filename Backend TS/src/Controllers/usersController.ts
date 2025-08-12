import { Request, Response } from "express";
import {baseUserModel} from "../Schemas/baseUserSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

import {Doctor} from "../Schemas/doctorSchema";
import {Receptionist} from "../Schemas/receptionistSchema";
import {Admin} from "../Schemas/adminSchema";
import {Patient} from "../Schemas/patientSchema";
import { generateSequentialUserId } from "../Utils/generateUserId";
import { validateEmailDomain } from "../Utils/emailValidation";

dotenv.config();

const JWT_SECRET : any = process.env.JWT_SECRET;

type UserRole = "admin" | "doctor" | "receptionist" | "patient" | "nurse" | "pharmacist" | "lab_technician";
interface userRegisterRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    address?: string;
    profilePic?: string;
    specialization?: string[];
    license_number?: string;
    availability?: string[];
    consultation_fee?: number;
    experienceYears?: number;
    appointments?: string[];
    shift?: string;
    accessLevel?: string;
    gender?: string;
    blood_type?: string;
    dateOfBirth?: Date;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    medical_history?: string;
    bio?: string;
    department_id?: string;
  } ;
}

interface userLoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}
// USER REGISTER
export const userRegister = async (req:Request, res:Response) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      profilePic,
      specialization,
      license_number,
      availability,
      consultation_fee,
      experienceYears,
      appointments,
      shift,
      accessLevel,
      gender,
      blood_type,
      dateOfBirth,
      emergency_contact_name,
      emergency_contact_phone,
      medical_history,
      bio,
      department_id,
    } = req.body;

  
    // Basic validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }
   
    
    const validRoles: UserRole[] = ["doctor", "receptionist", "admin"];
    if (role && role !== "patient" &&!validRoles.includes(role) ) {
      return res.status(400).json({ message: "Invalid role specified" });
    }
    // Validate email domain
    const validation = validateEmailDomain(email);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.reason });
    }
    // Check for existing user
    const existingUser = await baseUserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //check duplicate and case sensitive license number for doctors
      if(role === "doctor" && license_number) {
      const existingLicense = await baseUserModel.findOne({
        license_number: { $regex: new RegExp(`^${license_number}$`, "i") },
      });
      if (existingLicense) {
        return res.status(400).json({ message: "License number already exists" });
      }
    }
    
    // Prepare shared fields
    const hashPassword = await bcrypt.hash(password, 10);
    const userId = await generateSequentialUserId();

    const baseData = {
      userId,
      name,
      email,
      password: hashPassword,
      role,
      phone,
      address,
      profilePic,
      gender,
      blood_type,
      dateOfBirth,
      emergency_contact_name,
      emergency_contact_phone,
    };

    let newUser ;

    // Role-specific logic
    switch (role) {
      case "doctor":
        newUser = new Doctor({
          ...baseData,
          department_id,
          bio,
          specialization,
          experienceYears,
          appointments,
          consultation_fee,
          license_number,
          availability,
        });
        break;

      case "receptionist":
        newUser = new Receptionist({
          ...baseData,
          shift,
        });
        break;

      case "admin":
        newUser = new Admin({
          ...baseData,
          accessLevel,
        });
        break;

      case "patient":
      default:
        newUser = new Patient({
          ...baseData,
          medical_history: medical_history || ""
        });
        break;
    }

    if(!newUser) {
      return res.status(500).json({ message: "Failed to Registration" });  
    }
    // Save the new user
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

    console.log("✅ Registered:", newUser.email);
  } catch (error: any) {
    console.error("❌ Registration error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
// USER LOGIN
export const userLogin = async (req:Request, res:Response) => {

  try {
  
     const { email, password } = req.body;
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    // Validate email domain
    const validation = validateEmailDomain(email);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.reason });
    }

      // Find user by email
    const user = await baseUserModel.findOne({ email :new RegExp(`^${email}$`, "i") });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials !!! Try Again..." });
    }
    // Generate JWT token
    const token = jwt.sign({ id:user._id ,role:user.role}, JWT_SECRET, {
      expiresIn: "30d", // Token valid for 30 days
    });

    // Respond with user data (excluding password)
    res.status(200).json({
      message: "Login successful",
       token: `Bearer ${token}`,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  
    console.log("✅ Login successful:", user.email);
  } catch (error: any) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
