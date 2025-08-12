import express ,{Router}from "express";
import { addDoctorDepartment } from "../Controllers/doctorDepartmentController";

const router:Router = express.Router();

router.post("/add_doctor_department", addDoctorDepartment);

export default router;
