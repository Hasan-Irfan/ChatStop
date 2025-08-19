// routes/userRoutes.js
import { Router } from "express";
import { updateProfile } from "../controllers/userController.js";
import { upload } from "../middlewares/multer.js";
import { jwtVerify } from "../middlewares/AuthChecker.js";

const router = Router();

router.route("/update").put(jwtVerify, upload.single("profilePicture"), updateProfile);

export default router;
