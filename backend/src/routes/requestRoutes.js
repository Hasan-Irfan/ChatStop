import { Router } from "express";
import { jwtVerify } from "../middlewares/AuthChecker.js";
import { acceptOrDenyRequest, findUser, getFriends, sendRequest , getFriendRequest} from "../controllers/requestController.js";

const router = Router();

router.route("/find-user").get(jwtVerify, findUser);
router.route("/send-request").post(jwtVerify , sendRequest);
router.route("/handle-request").post( jwtVerify ,acceptOrDenyRequest );
router.route("/get-friends").post( jwtVerify ,getFriends );
router.route("/get-friend-requests").get( jwtVerify ,getFriendRequest );


export default router;
