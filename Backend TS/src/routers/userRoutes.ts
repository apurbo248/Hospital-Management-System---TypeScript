import express ,{Router}from "express";
import { userRegister,userLogin ,getCurrentUser,individualUserProfile,userProfileUpdate,allUserProfile ,logoutUser} from "../Controllers/usersController";
import { authorizeToken,authorizeRole } from "../Middleware/auth";

const router:Router = express.Router();

router.post("/user_registration", userRegister);
router.post("/user_login", userLogin);
router.get("/my_profile",getCurrentUser)
router.get ("/users", authorizeToken, authorizeRole(["admin","receptionists"]), allUserProfile); 
router.get("/user_profile/:id",authorizeToken, individualUserProfile);
router.put("/user_profile_update/:id", authorizeToken,userProfileUpdate ); // Assuming you want to use the same controller for update
router.post("/logout",logoutUser);
export default router;
