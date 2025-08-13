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

interface userInfoRequest extends Request<{id:string}> {
  user: {
    id: string;
    role: UserRole;
  };
  body: {
    //For all users
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    address?: string;
    profilePic?: string;
    gender?: string;
    blood_type?: string;
    dateOfBirth?: Date;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;

    //For doctors
    specialization?: string[];
    license_number?: string;
    availability?: string[];
    consultation_fee?: number;
    experienceYears?: number;
    appointments?: string[];
    bio?: string;
    department_id?: string;

    //For receptionists
    shift?: string;
    
    //For admins
    accessLevel?: string;
    //For patients
    medical_history?: string;
    
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
      // Common fields
      name,
      email,
      password,
      role,
      phone,
      address,
      profilePic,
      gender,
      blood_type,
      dateOfBirth,
      emergency_contact_name,
      emergency_contact_phone,
      // Doctor specific fields
      specialization,
      license_number,
      availability,
      consultation_fee,
      experienceYears,
      appointments,
       bio,
      department_id,

      // Receptionist specific fields
      shift,

      // Admin specific fields
      accessLevel,
      
      // Patient specific fields
      medical_history,
     
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
       // Common fields
      name,
      email,
      password,
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
          specialization,
          license_number,
          availability,
          consultation_fee,
          experienceYears,
          appointments,
          bio,
          department_id
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

    console.log("✅ Registered successfully:)", newUser.name);
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
  
    console.log("✅ Login successful :)");
  } catch (error: any) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
//ALL USER PROFILE
export const allUserProfile = async (req:Request, res:Response) => {
  try {
    // Find all users
    const users = await baseUserModel.find().select("-password");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
 // Count users by role
    const countsByRole = users.reduce<Record<string, number>>((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    
    // Respond with user data (excluding password)
    res.status(200).json({   
      totalUsers: users.length,
      countsByRole,
      users,
        //code to count total users 


      }),
 
    console.log("✅ All user profiles fetched successfully :)");
  } catch (error: any) {
    console.error("❌ Error fetching all user profiles:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
// USER PROFILE
export const userProfile = async (req:Request, res:Response) => {
  try {
    const userId = req.params.id;

    // Find user by ID
    const user = await baseUserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user data (excluding password)
    res.status(200).json({
      user

    });
    console.log("✅ User profile fetched successfully:)");
  } catch (error: any) {
    console.error("❌ Error fetching user profile:", error.message);
    res.status(500).json({ message: "Internal server error" });   
  }
};
// USER PROFILE UPDATE
export const userProfileUpdate = async (
  req:Request<{id:string},any,any>, 
  res:Response) => {
  try {

      const typedReq = req as userInfoRequest;
      const userId = typedReq.params.id;

   //access restriction
    if (typedReq.user.id !== userId && typedReq.user.role !== "receptionist" ) {
      return res.status(403).json({ message: "Access denied. You can only update your own profile." });
    }

    const {
         // Common fields
      name,
      email,
      password,
      role,
      phone,
      address,
      profilePic,
      gender,
      blood_type,
      dateOfBirth,
      emergency_contact_name,
      emergency_contact_phone,
      // Doctor specific fields
      specialization,
      license_number,
      availability,
      consultation_fee,
      experienceYears,
      appointments,
       bio,
      department_id,

      // Receptionist specific fields
      shift,

      // Admin specific fields
      accessLevel,
      
      // Patient specific fields
      medical_history,
    }
    = typedReq.body;

    // Find user by ID
    const user = await baseUserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }     
    // Check for duplicate email
    const existingUser = await baseUserModel.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {   
      return res.status(400).json({ message: "Email already in use" });
    }
    // Check for duplicate license number for doctors
    if (user.role === "doctor" && license_number) {
      const existingLicense = await baseUserModel.findOne({
        license_number: { $regex: new RegExp(`^${license_number}$`, "i") },
        _id: { $ne: userId },
      });
      if (existingLicense) {
        return res.status(400).json({ message: "License number already exists" });
      }
    }
    // Prepare update data
    const updateData: any = {
         // Common fields
      name,
      email,
      password,
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
     if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
 
    switch (user.role) {
      case "doctor":
        Object.assign(updateData, {
          specialization,
          license_number,
          availability,
          consultation_fee,
          experienceYears,
          appointments,
          bio,
          department_id
        });
        break;
      case "receptionist":
        updateData.shift = shift; 
        break;
      case "admin":
        updateData.accessLevel = accessLevel;
        break;
      case "patient":
        updateData.medical_history = medical_history;
        break;
      default:
        console.warn(`⚠ Unknown role '${user.role}', no role-specific updates applied.`);
        break;
    }
    // Update user
    const updatedUser = await baseUserModel
    .findByIdAndUpdate(userId, updateData, { new: true })
    .select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Respond with updated user data
    res.status(200).json({
      message: "User profile updated successfully",
      user: {
        id: updatedUser._id,
        userId: updatedUser.userId,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
    console.log("✅ User profile updated successfully :)");
  } catch (error: any) {
    console.error("❌ Error updating user profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}