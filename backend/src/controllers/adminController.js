import { asyncHandler } from "../utils/asyncHandler.js";
import {
  listUsersService,
  updateUserRoleService,
  suspendUserService,
  reactivateUserService,
  getReportsSummaryService,
  listAuditLogsService,
} from "../services/adminServices.js";

export const listUsers = asyncHandler(async (req, res) => {
  const data = await listUsersService(req.query);
  res.status(200).json({ success: true, ...data });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const updated = await updateUserRoleService({ req, id: req.params.id, role: req.body.role });
  res.status(200).json({ success: true, message: "Role updated", user: updated });
});

export const suspendUser = asyncHandler(async (req, res) => {
  const updated = await suspendUserService({ req, id: req.params.id, reason: req.body.reason });
  res.status(200).json({ success: true, message: "User suspended", user: updated });
});

export const reactivateUser = asyncHandler(async (req, res) => {
  const updated = await reactivateUserService({ req, id: req.params.id });
  res.status(200).json({ success: true, message: "User reactivated", user: updated });
});

export const getReportsSummary = asyncHandler(async (req, res) => {
  const summary = await getReportsSummaryService();
  res.status(200).json({ success: true, summary });
});

export const listAuditLogs = asyncHandler(async (req, res) => {
  const data = await listAuditLogsService(req.query);
  res.status(200).json({ success: true, ...data });
});
