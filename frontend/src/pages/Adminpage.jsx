import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../services/authApi";
import { handleSuccess } from "../utils/toastUtil";
import { ToastContainer } from "react-toastify";
import {
  useListUsersQuery,
  useUpdateUserRoleMutation,
  useSuspendUserMutation,
  useReactivateUserMutation,
  useGetReportsSummaryQuery,
  useListAuditLogsQuery,
} from "../services/adminApi";
import { logout as clearUser } from "../services/userSlice";
import { useDispatch } from "react-redux";

export const Adminpage = () => {


  const [loggedInUser, SetloggedInUser] = useState("");
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: usersData, refetch, isFetching } = useListUsersQuery({ search, role: roleFilter, status: statusFilter, page, limit });
  const { data: reports } = useGetReportsSummaryQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [suspendUser] = useSuspendUserMutation();
  const [reactivateUser] = useReactivateUserMutation();
  const [logsPage, setLogsPage] = useState(1);
  const [logsLimit, setLogsLimit] = useState(20);
  const { data: logsData, isFetching: logsFetching } = useListAuditLogsQuery({ page: logsPage, limit: logsLimit });

  useEffect(() => {
    SetloggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const handleLogout = async () => {
    try {
      // Optimistic clear and navigate to avoid reload loops
      dispatch(clearUser());
      navigate("/login");
      await logout().unwrap().catch(() => {});
    } catch (error) {
      console.error(error);
    }
  };

  const users = usersData?.users || [];
  const pagination = usersData?.pagination;

  const handleChangeRole = async (id, role) => {
    await updateUserRole({ id, role });
    refetch();
  };

  const handleSuspend = async (id) => {
    const reason = prompt("Reason for suspension (optional)") || "";
    await suspendUser({ id, reason });
    refetch();
  };

  const handleReactivate = async (id) => {
    await reactivateUser({ id });
    refetch();
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
    <div>
          <h2 className="text-xl font-semibold">{loggedInUser}</h2>
          <p className="text-gray-600">Admin Panel</p>
        </div>
        <button onClick={handleLogout} className="px-3 py-2 bg-black text-white rounded">
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 border rounded">
          <div className="text-gray-500 text-sm">Total Users</div>
          <div className="text-2xl font-bold">{reports?.summary?.totalUsers ?? "-"}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-gray-500 text-sm">Active Users</div>
          <div className="text-2xl font-bold">{reports?.summary?.activeUsers ?? "-"}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-gray-500 text-sm">Suspended</div>
          <div className="text-2xl font-bold">{reports?.summary?.suspendedUsers ?? "-"}</div>
        </div>
      </div>

      <div className="p-4 border rounded space-y-3">
        <div className="flex gap-2 items-center">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search username/email" className="border px-2 py-1 rounded w-full max-w-sm" />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="border px-2 py-1 rounded">
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="visitor">Visitor</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border px-2 py-1 rounded">
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Username</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Last Login</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b">
                  <td className="py-2 pr-4">{u.username}</td>
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">
                    <select
                      className="border px-2 py-1 rounded"
                      value={u.role}
                      onChange={(e) => handleChangeRole(u._id, e.target.value)}
                    >
                      <option value="admin">admin</option>
                      <option value="user">user</option>
                      <option value="visitor">visitor</option>
                    </select>
                  </td>
                  <td className="py-2 pr-4">{u.isSuspended ? "Suspended" : "Active"}</td>
                  <td className="py-2 pr-4">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "-"}</td>
                  <td className="py-2 pr-4 flex gap-2">
                    {u.isSuspended ? (
                      <button className="px-2 py-1 border rounded" onClick={() => handleReactivate(u._id)}>Reactivate</button>
                    ) : (
                      <button className="px-2 py-1 border rounded" onClick={() => handleSuspend(u._id)}>Suspend</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={isFetching || (pagination?.page || 1) <= 1}
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination?.page || 1} of {pagination?.totalPages || 1}
            </span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(p + 1, pagination?.totalPages || 1))}
              disabled={isFetching || (pagination?.page || 1) >= (pagination?.totalPages || 1)}
            >
              Next
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows:</span>
            <select
              className="border px-2 py-1 rounded"
              value={limit}
              onChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPage(1); }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Audit Logs</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Rows:</span>
            <select
              className="border px-2 py-1 rounded"
              value={logsLimit}
              onChange={(e) => { setLogsLimit(parseInt(e.target.value, 10)); setLogsPage(1); }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Action</th>
                <th className="py-2 pr-4">Actor</th>
                <th className="py-2 pr-4">Target</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">IP</th>
              </tr>
            </thead>
            <tbody>
              {logsData?.logs?.map((log) => (
                <tr key={log._id} className="border-b">
                  <td className="py-2 pr-4">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="py-2 pr-4">{log.action}</td>
                  <td className="py-2 pr-4">{log.actorUsername}</td>
                  <td className="py-2 pr-4">{log.targetUserId || "-"}</td>
                  <td className="py-2 pr-4">{log.status}</td>
                  <td className="py-2 pr-4">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-3">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setLogsPage((p) => Math.max(p - 1, 1))}
            disabled={logsFetching || (logsData?.pagination?.page || 1) <= 1}
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {logsData?.pagination?.page || 1} of {logsData?.pagination?.totalPages || 1}
          </span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setLogsPage((p) => Math.min(p + 1, logsData?.pagination?.totalPages || 1))}
            disabled={logsFetching || (logsData?.pagination?.page || 1) >= (logsData?.pagination?.totalPages || 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Note: Audit logs omitted for now per instruction */}
      <ToastContainer />
    </div>
  );
};
