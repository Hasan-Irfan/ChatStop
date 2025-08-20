import { jest } from '@jest/globals';

const mockFindUserService = jest.fn();
const mockSendRequestService = jest.fn();
const mockAcceptOrDenyRequestService = jest.fn();
const mockGetFriendsService = jest.fn();
const mockGetFriendRequestService = jest.fn();

await jest.unstable_mockModule('../../src/services/requestServices.js', () => ({
  findUserService: mockFindUserService,
  sendRequestService: mockSendRequestService,
  acceptOrDenyRequestService: mockAcceptOrDenyRequestService,
  getFriendsService: mockGetFriendsService,
  getFriendRequestService: mockGetFriendRequestService,
}));

const { findUser, sendRequest, acceptOrDenyRequest, getFriends, getFriendRequest } = await import('../../src/controllers/requestController.js');

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('requestController', () => {
  beforeEach(() => jest.clearAllMocks());

  test('findUser success', async () => {
    const req = { body: { username: 'bob' } };
    const res = createRes();
    mockFindUserService.mockResolvedValue({ id: '2', username: 'bob' });
    await findUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Searched User found', user: { id: '2', username: 'bob' } });
  });

  test('findUser error -> 404', async () => {
    const req = { body: { username: 'nope' } };
    const res = createRes();
    mockFindUserService.mockRejectedValue(new Error('Not found'));
    await findUser(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Not found' });
  });

  test('sendRequest success', async () => {
    const req = { body: { sender: 'alice', receiver: 'bob' } };
    const res = createRes();
    mockSendRequestService.mockResolvedValue(undefined);
    await sendRequest(req, res);
    expect(mockSendRequestService).toHaveBeenCalledWith('alice', 'bob');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Friend request sent successfully' });
  });

  test('acceptOrDenyRequest success', async () => {
    const req = { body: { state: 'accept', senderUsername: 'alice', receiverUsername: 'bob' } };
    const res = createRes();
    mockAcceptOrDenyRequestService.mockResolvedValue('accepted');
    await acceptOrDenyRequest(req, res);
    expect(mockAcceptOrDenyRequestService).toHaveBeenCalledWith('accept', 'alice', 'bob');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Friend request accepted successfully' });
  });

  test('getFriends success', async () => {
    const req = { body: { username: 'alice' } };
    const res = createRes();
    mockGetFriendsService.mockResolvedValue(['bob']);
    await getFriends(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Friends list retrieved successfully', friends: ['bob'] });
  });

  test('getFriendRequest success', async () => {
    const req = { user: { username: 'bob' } };
    const res = createRes();
    mockGetFriendRequestService.mockResolvedValue(['alice']);
    await getFriendRequest(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Pending Friends list retrieved successfully', friendRequests: ['alice'] });
  });
});


