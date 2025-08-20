import { jest } from '@jest/globals';

const mockListUsersService = jest.fn();
const mockUpdateUserRoleService = jest.fn();
const mockSuspendUserService = jest.fn();
const mockReactivateUserService = jest.fn();
const mockGetReportsSummaryService = jest.fn();
const mockListAuditLogsService = jest.fn();

await jest.unstable_mockModule('../../src/services/adminServices.js', () => ({
  listUsersService: mockListUsersService,
  updateUserRoleService: mockUpdateUserRoleService,
  suspendUserService: mockSuspendUserService,
  reactivateUserService: mockReactivateUserService,
  getReportsSummaryService: mockGetReportsSummaryService,
  listAuditLogsService: mockListAuditLogsService,
}));

const { listUsers, updateUserRole, suspendUser, reactivateUser, getReportsSummary, listAuditLogs } = await import('../../src/controllers/adminController.js');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('adminController', () => {
  beforeEach(() => jest.clearAllMocks());

  test('listUsers returns data', async () => {
    const req = { query: { page: 1 } };
    const res = createRes();
    mockListUsersService.mockResolvedValue({ users: [{ id: 1 }], total: 1 });
    await listUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, users: [{ id: 1 }], total: 1 });
  });

  test('updateUserRole returns updated user', async () => {
    const req = { params: { id: 'u1' }, body: { role: 'admin' } };
    const res = createRes();
    const updated = { id: 'u1', role: 'admin' };
    mockUpdateUserRoleService.mockResolvedValue(updated);
    await updateUserRole(req, res);
    expect(mockUpdateUserRoleService).toHaveBeenCalledWith({ req, id: 'u1', role: 'admin' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Role updated', user: updated });
  });

  test('suspendUser returns updated user', async () => {
    const req = { params: { id: 'u1' }, body: { reason: 'abuse' } };
    const res = createRes();
    const updated = { id: 'u1', suspended: true };
    mockSuspendUserService.mockResolvedValue(updated);
    await suspendUser(req, res);
    expect(mockSuspendUserService).toHaveBeenCalledWith({ req, id: 'u1', reason: 'abuse' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'User suspended', user: updated });
  });

  test('reactivateUser returns updated user', async () => {
    const req = { params: { id: 'u1' } };
    const res = createRes();
    const updated = { id: 'u1', suspended: false };
    mockReactivateUserService.mockResolvedValue(updated);
    await reactivateUser(req, res);
    expect(mockReactivateUserService).toHaveBeenCalledWith({ req, id: 'u1' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'User reactivated', user: updated });
  });

  test('getReportsSummary returns summary', async () => {
    const req = {};
    const res = createRes();
    mockGetReportsSummaryService.mockResolvedValue({ reports: [] });
    await getReportsSummary(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, summary: { reports: [] } });
  });

  test('listAuditLogs returns data', async () => {
    const req = { query: { page: 1 } };
    const res = createRes();
    mockListAuditLogsService.mockResolvedValue({ logs: [], total: 0 });
    await listAuditLogs(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, logs: [], total: 0 });
  });
});


