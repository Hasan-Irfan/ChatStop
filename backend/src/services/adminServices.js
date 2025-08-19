import { User } from "../model/userModel.js";
import { AuditLog } from "../model/auditLogModel.js";
import { logAudit } from "../utils/auditLogger.js";

// List Users with filters + pagination
export const listUsersService = async ({ search, role, status, page, limit }) => {
  const filter = {};
  if (search) {
    filter.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (role) filter.role = role;
  if (status === "suspended") filter.isSuspended = true;
  if (status === "active") filter.isSuspended = { $ne: true };

  const numericPage = Math.max(parseInt(page, 10) || 1, 1);
  const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (numericPage - 1) * numericLimit;

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(numericLimit),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      total,
      page: numericPage,
      limit: numericLimit,
      totalPages: Math.max(Math.ceil(total / numericLimit), 1),
    },
  };
};

// Update user role
export const updateUserRoleService = async ({ req, id, role }) => {
  const allowedRoles = ["admin", "user", "visitor"];
  if (!allowedRoles.includes(role)) throw new Error("Invalid role");

  const updated = await User.findByIdAndUpdate(
    id,
    { $set: { role } },
    { new: true, select: "-password -refreshToken" }
  );

  if (!updated) throw new Error("User not found");

  await logAudit({ req, action: "update_user_role", targetUserId: id, details: { role } });
  return updated;
};

// Suspend user
export const suspendUserService = async ({ req, id, reason }) => {
  const updated = await User.findByIdAndUpdate(
    id,
    { $set: { isSuspended: true, suspendedAt: new Date(), suspensionReason: reason } },
    { new: true, select: "-password -refreshToken" }
  );

  if (!updated) throw new Error("User not found");

  await logAudit({ req, action: "suspend_user", targetUserId: id, details: { reason } });
  return updated;
};

// Reactivate user
export const reactivateUserService = async ({ req, id }) => {
  const updated = await User.findByIdAndUpdate(
    id,
    { $set: { isSuspended: false, suspendedAt: null, suspensionReason: "" } },
    { new: true, select: "-password -refreshToken" }
  );

  if (!updated) throw new Error("User not found");

  await logAudit({ req, action: "reactivate_user", targetUserId: id });
  return updated;
};

// Reports summary
export const getReportsSummaryService = async () => {
  const totalUsers = await User.countDocuments();
  const suspendedCount = await User.countDocuments({ isSuspended: true });
  const activeCount = totalUsers - suspendedCount;

  // Role distribution
  const roleAgg = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);
  const roleDistribution = roleAgg.reduce((acc, cur) => {
    acc[cur._id || "unknown"] = cur.count;
    return acc;
  }, {});

  // Login activity (last 7 days)
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const recent = await User.find({ lastLoginAt: { $gte: start } }).select("lastLoginAt");

  const trends = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    const count = recent.filter((u) => u.lastLoginAt && u.lastLoginAt >= day && u.lastLoginAt < nextDay).length;
    trends.push({ date: day.toISOString().slice(0, 10), count });
  }

  return { totalUsers, activeUsers: activeCount, suspendedUsers: suspendedCount, roleDistribution, loginTrends: trends };
};

// Audit logs list
export const listAuditLogsService = async ({ page, limit, action, actor, target }) => {
  const numericPage = Math.max(parseInt(page, 10) || 1, 1);
  const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const skip = (numericPage - 1) * numericLimit;

  const filter = {};
  if (action) filter.action = action;
  if (actor) filter.$or = [{ actorUsername: { $regex: actor, $options: "i" } }];
  if (target) filter.targetUserId = target;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(numericLimit),
    AuditLog.countDocuments(filter),
  ]);

  return {
    logs,
    pagination: {
      total,
      page: numericPage,
      limit: numericLimit,
      totalPages: Math.max(Math.ceil(total / numericLimit), 1),
    },
  };
};
