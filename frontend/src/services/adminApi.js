import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:8080/main";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    listUsers: builder.query({
      query: ({ search = "", role, status, page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (role) params.set("role", role);
        if (status) params.set("status", status);
        if (page) params.set("page", String(page));
        if (limit) params.set("limit", String(limit));
        const qs = params.toString();
        return { url: `/admin/users${qs ? `?${qs}` : ""}` };
      },
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
    }),
    suspendUser: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/admin/users/${id}/suspend`,
        method: "PATCH",
        body: { reason },
      }),
    }),
    reactivateUser: builder.mutation({
      query: ({ id }) => ({
        url: `/admin/users/${id}/reactivate`,
        method: "PATCH",
      }),
    }),
    getReportsSummary: builder.query({
      query: () => ({ url: "/admin/reports/summary" }),
    }),
    listAuditLogs: builder.query({
      query: ({ page = 1, limit = 20, action, actor, target } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set("page", String(page));
        if (limit) params.set("limit", String(limit));
        if (action) params.set("action", action);
        if (actor) params.set("actor", actor);
        if (target) params.set("target", target);
        const qs = params.toString();
        return { url: `/admin/audit-logs${qs ? `?${qs}` : ""}` };
      },
    }),
  }),
});

export const {
  useListUsersQuery,
  useUpdateUserRoleMutation,
  useSuspendUserMutation,
  useReactivateUserMutation,
  useGetReportsSummaryQuery,
  useListAuditLogsQuery,
} = adminApi;


