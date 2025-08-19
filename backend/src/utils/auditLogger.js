import { AuditLog } from "../model/auditLogModel.js";

export const logAudit = async ({ req, action, status = "success", targetUserId = null, details = {} }) => {
  try {
    const actorId = req.user?._id || null;
    const actorUsername = req.user?.username || "anonymous";
    const ip = req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress || "";
    const userAgent = req.headers["user-agent"] || "";
    const route = `${req.method} ${req.originalUrl}`;

    await AuditLog.create({
      action,
      actorId,
      actorUsername,
      targetUserId,
      status,
      ip: Array.isArray(ip) ? ip[0] : ip,
      userAgent,
      route,
      details,
    });
  } catch (e) {
    // Do not throw; logging failures shouldn't break the app
    console.error("Audit log error:", e?.message || e);
  }
};


