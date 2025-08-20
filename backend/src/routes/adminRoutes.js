import { Router } from "express";
import { jwtVerify } from "../middlewares/AuthChecker.js";
import { adminChecker } from "../middlewares/adminChecker.js";
import { listUsers, updateUserRole, suspendUser, reactivateUser, getReportsSummary, listAuditLogs } from "../controllers/adminController.js";
import { 
  validateQuery,
  validateBody,
  validateParams,
  listUsersValidation, 
  updateUserRoleValidation, 
  suspendUserValidation, 
  reactivateUserValidation, 
  listAuditLogsValidation
} from "../validations/adminValidations.js";

const router = Router();

// admin-only routes
router.use(jwtVerify, adminChecker);

// List users with query validation
router.get("/admin/users", validateQuery(listUsersValidation), listUsers);

// Update user role with body and parameter validation
router.patch("/admin/users/:id/role", 
  validateParams(updateUserRoleValidation), 
  validateBody(updateUserRoleValidation), 
  updateUserRole
);

// Suspend user with body and parameter validation
router.patch("/admin/users/:id/suspend", 
  validateParams(suspendUserValidation), 
  validateBody(suspendUserValidation), 
  suspendUser
);

// Reactivate user with parameter validation
router.patch("/admin/users/:id/reactivate", 
  validateParams(reactivateUserValidation), 
  reactivateUser
);

// reporting endpoints
router.get("/admin/reports/summary", getReportsSummary);
router.get("/admin/audit-logs", validateQuery(listAuditLogsValidation), listAuditLogs);

export default router;


