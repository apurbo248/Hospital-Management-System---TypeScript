import express ,{Router}from "express";
import { userRegister,userLogin ,userProfile} from "../Controllers/usersController";
import { authorizeToken } from "../Middleware/auth";

const router:Router = express.Router();

router.post("/user_registration", userRegister);
router.post("/user_login", userLogin);
router.get("/user_profile/:id",authorizeToken, userProfile);

export default router;
