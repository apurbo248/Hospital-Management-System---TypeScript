import express ,{Router}from "express";
import { userRegister,userLogin } from "../Controllers/usersController";

const router:Router = express.Router();

router.post("/user_registration", userRegister);
router.post("/user_login", userLogin);

export default router;
