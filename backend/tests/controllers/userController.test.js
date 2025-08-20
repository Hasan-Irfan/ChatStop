import { jest } from '@jest/globals';

const mockUpdateUserProfile = jest.fn();

await jest.unstable_mockModule('../../src/services/userServices.js', () => ({
  updateUserProfile: mockUpdateUserProfile,
}));

const { updateProfile } = await import('../../src/controllers/userController.js');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('userController.updateProfile', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns 200 and payload on success', async () => {
    const req = { user: { id: 'u1' }, body: { bio: 'hello' }, file: undefined };
    const res = createRes();
    const toObject = () => ({ id: 'u1', username: 'alice', bio: 'hello' });
    mockUpdateUserProfile.mockResolvedValue({ toObject });

    await updateProfile(req, res);
    expect(mockUpdateUserProfile).toHaveBeenCalledWith('u1', { bio: 'hello' }, undefined);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Profile updated successfully', username: 'alice' }));
  });

  test('returns 400 on error', async () => {
    const req = { user: { id: 'u1' }, body: {}, file: undefined };
    const res = createRes();
    mockUpdateUserProfile.mockRejectedValue(new Error('boom'));

    await updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'boom' });
  });
});


