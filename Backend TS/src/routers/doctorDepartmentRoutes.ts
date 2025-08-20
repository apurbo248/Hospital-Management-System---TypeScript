import express ,{Router}from "express";
import { addDoctorDepartment ,getAllDepartment} from "../Controllers/doctorDepartmentController";

const router:Router = express.Router();

router.post("/add_doctor_department", addDoctorDepartment);
router.get("/get_all_department", getAllDepartment);
export default router;
