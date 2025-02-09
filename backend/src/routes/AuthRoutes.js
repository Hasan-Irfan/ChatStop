import { Router } from "express";
import { login, Signup, logout, products, resetPassword, updatePassword } from "../controllers/authController.js";
import { jwtVerify } from "../middlewares/AuthChecker.js";
import { adminChecker } from "../middlewares/adminChecker.js";
const router = Router();

router.route("/login").post(login);
router.route("/signup").post(Signup);
router.route("/logout").post( jwtVerify , logout);

router.route("/reset-password").post(resetPassword);
router.route("/update-password/:resetToken").post(updatePassword);

router.route("/verify").post(jwtVerify ,  (req,res) => {
    return res
    .status(200)
    .json({ success: true, message: "User is verified" });
});

router.route("/products").post( jwtVerify,  adminChecker , products);

export default router;
