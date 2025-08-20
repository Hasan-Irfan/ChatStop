import { jest } from '@jest/globals';

const mockLoginUser = jest.fn();
const mockRegisterUser = jest.fn();
const mockVerifyUserEmail = jest.fn();
const mockLogoutUser = jest.fn();
const mockRefreshTokenService = jest.fn();
const mockSendResetPasswordEmail = jest.fn();
const mockUpdateUserPassword = jest.fn();

await jest.unstable_mockModule('../../src/services/authServices.js', () => ({
  loginUser: mockLoginUser,
  registerUser: mockRegisterUser,
  verifyUserEmail: mockVerifyUserEmail,
  logoutUser: mockLogoutUser,
  refreshTokenService: mockRefreshTokenService,
  sendResetPasswordEmail: mockSendResetPasswordEmail,
  updateUserPassword: mockUpdateUserPassword,
}));

const { login, Signup, verifyEmail, logout, refreshAccessToken, resetPassword, updatePassword } = await import('../../src/controllers/authController.js');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

describe('authController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login success sets cookies and returns user info', async () => {
    const req = { body: { email: 'a@b.com', password: 'pass' } };
    const res = createRes();
    const fakeUser = { _id: '1', username: 'alice', email: 'a@b.com', role: 'user', profilePicture: 'x', friends: [], friendRequests: [] };
    mockLoginUser.mockResolvedValue({ user: fakeUser, accessToken: 'at', refreshToken: 'rt' });

    await login(req, res);

    expect(mockLoginUser).toHaveBeenCalledWith('a@b.com', 'pass');
    expect(res.cookie).toHaveBeenCalledWith('accessToken', 'at', expect.any(Object));
    expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'rt', expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, username: 'alice', userID: '1' }));
  });

  test('login error returns 400', async () => {
    const req = { body: { email: 'a@b.com', password: 'bad' } };
    const res = createRes();
    mockLoginUser.mockResolvedValue({ error: 'Invalid' });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid' });
  });

  test('Signup success', async () => {
    const req = { body: { username: 'alice', email: 'a@b.com', password: 'p' } };
    const res = createRes();
    mockRegisterUser.mockResolvedValue({ message: 'Registered' });

    await Signup(req, res);
    expect(mockRegisterUser).toHaveBeenCalledWith('alice', 'a@b.com', 'p');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Registered' });
  });

  test('verifyEmail success and error', async () => {
    let req = { params: { token: 't' } };
    let res = createRes();
    mockVerifyUserEmail.mockResolvedValue({ message: 'ok' });
    await verifyEmail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'ok' });

    req = { params: { token: 'bad' } };
    res = createRes();
    mockVerifyUserEmail.mockResolvedValue({ error: 'invalid' });
    await verifyEmail(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'invalid' });
  });

  test('logout clears cookies', async () => {
    const req = { user: { _id: '1' } };
    const res = createRes();
    mockLogoutUser.mockResolvedValue({ message: 'Logged out' });

    await logout(req, res);
    expect(mockLogoutUser).toHaveBeenCalledWith('1');
    expect(res.clearCookie).toHaveBeenCalledWith('accessToken', expect.any(Object));
    expect(res.clearCookie).toHaveBeenCalledWith('refreshToken', expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Logged out' });
  });

  test('refreshAccessToken success sets cookies', async () => {
    const req = { cookies: { refreshToken: 'rt' }, body: {} };
    const res = createRes();
    mockRefreshTokenService.mockResolvedValue({ accessToken: 'newAt', refreshToken: 'newRt' });

    await refreshAccessToken(req, res);
    expect(mockRefreshTokenService).toHaveBeenCalledWith('rt');
    expect(res.cookie).toHaveBeenCalledWith('accessToken', 'newAt', expect.any(Object));
    expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'newRt', expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('resetPassword error -> 400', async () => {
    const req = { body: { email: 'a@b.com' } };
    const res = createRes();
    mockSendResetPasswordEmail.mockResolvedValue({ error: 'no user' });
    await resetPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('updatePassword success -> 200', async () => {
    const req = { params: { resetToken: 't' }, body: { password: 'new' } };
    const res = createRes();
    mockUpdateUserPassword.mockResolvedValue({ message: 'updated' });
    await updatePassword(req, res);
    expect(mockUpdateUserPassword).toHaveBeenCalledWith('t', 'new');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'updated' });
  });
});


