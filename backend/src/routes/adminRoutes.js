import { Router } from "express";
import { jwtVerify } from "../middlewares/AuthChecker.js";
import { adminChecker } from "../middlewares/adminChecker.js";
import { listUsers, updateUserRole, suspendUser, reactivateUser, getReportsSummary, listAuditLogs } from "../controllers/adminController.js";

const router = Router();

// admin-only routes
router.use(jwtVerify, adminChecker);

router.get("/admin/users", listUsers);
router.patch("/admin/users/:id/role", updateUserRole);
router.patch("/admin/users/:id/suspend", suspendUser);
router.patch("/admin/users/:id/reactivate", reactivateUser);

// reporting endpoints
router.get("/admin/reports/summary", getReportsSummary);
router.get("/admin/audit-logs", listAuditLogs);

export default router;


