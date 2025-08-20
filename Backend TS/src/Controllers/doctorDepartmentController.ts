import { Request, Response } from "express";
import {Doctor_Department} from "../Schemas/doctoDepartmentSchema";


import bcrypt from "bcrypt";

import { Doctor } from "../Schemas/doctorSchema"; // adjust path
import { generateSequentialUserId } from "../Utils/generateUserId"; // adjust path

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
export const getAllDepartment = async (req: Request, res: Response) => {
  try {
    const departments = await Doctor_Department.find();
    if(!departments || departments.length === 0) {
      return res.status(404).json({ message: "No departments found" });
    }
    res.status(200).json(departments.map(department=>({
      id : department._id,
      name: department.name,
     // description: department.description,
    })));
   

  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const insertDoctorsBatch = async (req: Request, res: Response) => {
  try {
    const doctorsData = [
      {
        name: "Dr. Amelia Carter",
        email: "amelia.carter@hospital.com",
        password: "123456",
        phone: "+61 400 111 001",
        gender: "female",
        blood_type: "O+",
        dateOfBirth: "1980-04-15",
        license_number: "DOC-AUS-1001",
        specialization: ["Cardiology"],
        experienceYears: 15,
        bio: "Senior cardiologist specializing in interventional cardiology.",
        department_id: ["689ac96af58615aed3e466c4"],
        consultation_fee: 250,
        language: ["English", "French"],
        availability: [
          { day: "Monday", status: "available", timeSlots: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "16:00" }] },
          { day: "Wednesday", status: "available", timeSlots: [{ start: "10:00", end: "13:00" }, { start: "15:00", end: "17:00" }] }
        ]
      },
      {
        name: "Dr. Benjamin Lee",
        email: "benjamin.lee@hospital.com",
        password: "123456",
        phone: "+61 400 111 002",
        gender: "male",
        blood_type: "A+",
        dateOfBirth: "1975-07-20",
        license_number: "DOC-AUS-1002",
        specialization: ["Neurology"],
        experienceYears: 18,
        bio: "Expert in neurological disorders and stroke management.",
        department_id: ["689aca27f58615aed3e466c7"],
        consultation_fee: 300,
        language: ["English", "German"],
        availability: [
          { day: "Tuesday", status: "available", timeSlots: [{ start: "08:00", end: "11:00" }, { start: "13:00", end: "15:00" }] },
          { day: "Thursday", status: "available", timeSlots: [{ start: "09:00", end: "12:00" }] }
        ]
      },
      {
        name: "Dr. Chloe Zhang",
        email: "chloe.zhang@hospital.com",
        password: "123456",
        phone: "+61 400 111 003",
        gender: "female",
        blood_type: "B+",
        dateOfBirth: "1982-11-05",
        license_number: "DOC-AUS-1003",
        specialization: ["Dermatology"],
        experienceYears: 12,
        bio: "Dermatologist specializing in skin cancer and cosmetic procedures.",
        department_id: ["689aca51f58615aed3e466d1"],
        consultation_fee: 200,
        language: ["English", "Mandarin"],
        availability: [
          { day: "Monday", status: "available", timeSlots: [{ start: "10:00", end: "13:00" }, { start: "14:00", end: "17:00" }] },
          { day: "Friday", status: "available", timeSlots: [{ start: "09:00", end: "12:00" }] }
        ]
      },
      {
        name: "Dr. Daniel Murphy",
        email: "daniel.murphy@hospital.com",
        password: "123456",
        phone: "+61 400 111 004",
        gender: "male",
        blood_type: "O-",
        dateOfBirth: "1978-02-12",
        license_number: "DOC-AUS-1004",
        specialization: ["Orthopedics"],
        experienceYears: 20,
        bio: "Orthopedic surgeon focused on joint replacement and sports injuries.",
        department_id: ["689aca38f58615aed3e466ca"],
        consultation_fee: 280,
        language: ["English"],
        availability: [
          { day: "Wednesday", status: "available", timeSlots: [{ start: "08:00", end: "12:00" }] },
          { day: "Thursday", status: "available", timeSlots: [{ start: "13:00", end: "17:00" }] }
        ]
      },
      {
        name: "Dr. Emily Davis",
        email: "emily.davis@hospital.com",
        password: "123456",
        phone: "+61 400 111 005",
        gender: "female",
        blood_type: "AB+",
        dateOfBirth: "1985-09-22",
        license_number: "DOC-AUS-1005",
        specialization: ["Pediatrics"],
        experienceYears: 10,
        bio: "Pediatrician providing care for newborns and children.",
        department_id: ["689aca44f58615aed3e466cd"],
        consultation_fee: 220,
        language: ["English", "French"],
        availability: [
          { day: "Monday", status: "available", timeSlots: [{ start: "09:00", end: "11:00" }, { start: "13:00", end: "15:00" }] },
          { day: "Tuesday", status: "available", timeSlots: [{ start: "10:00", end: "12:00" }] }
        ]
      },
      {
        name: "Dr. Frank Wilson",
        email: "frank.wilson@hospital.com",
        password: "123456",
        phone: "+61 400 111 006",
        gender: "male",
        blood_type: "A-",
        dateOfBirth: "1976-12-18",
        license_number: "DOC-AUS-1006",
        specialization: ["Gastroenterology"],
        experienceYears: 17,
        bio: "Gastroenterologist specializing in liver and digestive disorders.",
        department_id: ["689aca74f58615aed3e466d7"],
        consultation_fee: 260,
        language: ["English", "Spanish"],
        availability: [
          { day: "Wednesday", status: "available", timeSlots: [{ start: "09:00", end: "12:00" }] },
          { day: "Friday", status: "available", timeSlots: [{ start: "13:00", end: "16:00" }] }
        ]
      },
      {
        name: "Dr. Grace Kim",
        email: "grace.kim@hospital.com",
        password: "123456",
        phone: "+61 400 111 007",
        gender: "female",
        blood_type: "B-",
        dateOfBirth: "1983-06-30",
        license_number: "DOC-AUS-1007",
        specialization: ["Endocrinology"],
        experienceYears: 14,
        bio: "Endocrinologist specializing in diabetes and thyroid disorders.",
        department_id: ["689aca9cf58615aed3e466e0"],
        consultation_fee: 240,
        language: ["English", "Korean"],
        availability: [
          { day: "Tuesday", status: "available", timeSlots: [{ start: "09:00", end: "12:00" }] },
          { day: "Thursday", status: "available", timeSlots: [{ start: "14:00", end: "17:00" }] }
        ]
      },
      {
        name: "Dr. Henry Thompson",
        email: "henry.thompson@hospital.com",
        password: "123456",
        phone: "+61 400 111 008",
        gender: "male",
        blood_type: "O+",
        dateOfBirth: "1979-03-14",
        license_number: "DOC-AUS-1008",
        specialization: ["Ophthalmology"],
        experienceYears: 16,
        bio: "Ophthalmologist specializing in cataract and glaucoma surgery.",
        department_id: ["689aca6af58615aed3e466d4"],
        consultation_fee: 270,
        language: ["English", "French"],
        availability: [
          { day: "Monday", status: "available", timeSlots: [{ start: "08:00", end: "11:00" }] },
          { day: "Wednesday", status: "available", timeSlots: [{ start: "13:00", end: "16:00" }] }
        ]
      },
      {
        name: "Dr. Isabella Nguyen",
        email: "isabella.nguyen@hospital.com",
        password: "123456",
        phone: "+61 400 111 009",
        gender: "female",
        blood_type: "AB-",
        dateOfBirth: "1986-01-25",
        license_number: "DOC-AUS-1009",
        specialization: ["Psychiatry"],
        experienceYears: 11,
        bio: "Psychiatrist specializing in mood disorders and therapy.",
        department_id: ["689aca8bf58615aed3e466dd"],
        consultation_fee: 230,
        language: ["English", "Vietnamese"],
        availability: [
          { day: "Tuesday", status: "available", timeSlots: [{ start: "09:00", end: "12:00" }] },
          { day: "Friday", status: "available", timeSlots: [{ start: "13:00", end: "16:00" }] }
        ]
      },
      {
        name: "Dr. James Patel",
        email: "james.patel@hospital.com",
        password: "123456",
        phone: "+61 400 111 010",
        gender: "male",
        blood_type: "A+",
        dateOfBirth: "1981-08-08",
        license_number: "DOC-AUS-1010",
        specialization: ["Oncology"],
        experienceYears: 19,
        bio: "Oncologist specializing in cancer treatment and chemotherapy.",
        department_id: ["689aca82f58615aed3e466da"],
        consultation_fee: 260,
        language: ["English", "Hindi"],
        availability: [
          { day: "Monday", status: "available", timeSlots: [{ start: "10:00", end: "13:00" }] },
          { day: "Thursday", status: "available", timeSlots: [{ start: "14:00", end: "17:00" }] }
        ]
      }
    ];

   const doctorInstances = [];

    // ✅ Use for...of so each doctor waits for userId
    for (const doc of doctorsData) {
      const hashedPassword = await bcrypt.hash(doc.password, 10);

      // Get unique sequential userId
      const newUserId = await generateSequentialUserId();

      const doctor = new Doctor({
        ...doc,
        password: hashedPassword,
        userId: newUserId,   // ✅ Required field filled
        role: "doctor"
      });

      doctorInstances.push(doctor);
    }


    const insertedDoctors = await Doctor.insertMany(doctorsData);

    res.status(201).json({
      message: "10 doctors inserted successfully",
      users: insertedDoctors.map((doc) => ({ id: doc._id, userId: doc.userId })),
    });

    console.log(`✅ Inserted ${insertedDoctors.length} doctors successfully`);
  } catch (error: any) {
    console.error("❌ Batch insertion error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
