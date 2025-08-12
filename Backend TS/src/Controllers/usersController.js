import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';


import { generateSequentialUserId } from "../utils/generateUserId.js";

import Doctor from "../models/doctorSchema.js";
import Receptionist from "../models/receptionistSchema.js";
import Admin from "../models/adminSchema.js";
import Patient from "../models/patientSchema.js";
import { validateEmailDomain } from "../utils/emailValidation.js";

dotenv.config();


// USER REGISTER
export const userRegister = async (req, res) => {
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
    // Validate email domain
    const validation = validateEmailDomain(email);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.reason });
    }
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //check duplicate and case sensitive license number for doctors
      const existingLicense = await User.findOne({
        license_number: { $regex: new RegExp(`^${license_number}$`, "i") },
      });

      if (existingLicense) {
        return res.status(400).json({ message: "License number already exists" });
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

    let newUser;

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
          medical_history,
        });
        break;
    }

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
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
// USER LOGIN
export const userLogin = async (req, res) => {

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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials !!! Try Again..." });
    }
    // Generate JWT token
  const token = jwt.sign({ id:user._id ,role:user.role}, process.env.JWT_SECRET, {
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
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
