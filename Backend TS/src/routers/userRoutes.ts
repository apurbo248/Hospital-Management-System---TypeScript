import express ,{Router}from "express";
import { userRegister,userLogin ,userProfile,userProfileUpdate,allUserProfile } from "../Controllers/usersController";
import { authorizeToken,authorizeRole } from "../Middleware/auth";

const router:Router = express.Router();

router.post("/user_registration", userRegister);
router.post("/user_login", userLogin);
// admin and receptionist can access this route
router.get ("/users", authorizeToken, authorizeRole(["admin","receptionists"]), allUserProfile); 
router.get("/user_profile/:id",authorizeToken, userProfile);
router.put("/user_profile_update/:id", authorizeToken,userProfileUpdate ); // Assuming you want to use the same controller for update

export default router;
