import { Router } from "express";
import { jwtVerify } from "../middlewares/AuthChecker.js";
import { getConversation, sendMessage } from "../controllers/messageController.js";

const router = Router();

router.route("/send-message").post(jwtVerify, sendMessage);
router.route("/messages/:friend").get(jwtVerify, getConversation);

export default router;
