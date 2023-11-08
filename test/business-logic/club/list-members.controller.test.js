import { expect, jest } from '@jest/globals';
import listMembersController from '../../../src/controllers/club/list-members.controller';
import MemberLogic from '../../../src/business-logic/member';
import HTTPError from '../../../src/errors/http.error';

jest.mock('../../../src/business-logic/member', () => ({
  listByClub: jest.fn().mockReturnThis(),
}));

const mockReq = {
  params: {
    clubId: '123',
  },
  userId: '456',
};

let mockRes = {};

const returnErrorResponse = ({ error, res }) => {
  const { code, message } = error;
  return res.status(code).send({ error: { message } });
};

describe('Controller: Club: List members', () => {
  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should list members of the club', async () => {
    MemberLogic.listByClub.mockResolvedValue([{ name: 'John Doe', email: 'johndoe@example.com' }]);

    await listMembersController(mockReq, mockRes);

    expect(MemberLogic.listByClub).toHaveBeenCalledWith({ clubId: mockReq.params.clubId, userId: mockReq.userId });
    expect(mockRes.send).toHaveBeenCalledWith({ members: [{ name: 'John Doe', email: 'johndoe@example.com' }] });
  });

  it('Should return an error when the logic fails', async () => {
    const error = new HTTPError({ name: 'error', message: 'some-error', code: 500 });

    MemberLogic.listByClub.mockRejectedValue(error);

    await listMembersController(mockReq, mockRes);

    expect(MemberLogic.listByClub).toHaveBeenCalledWith({ clubId: mockReq.params.clubId, userId: mockReq.userId });
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith({ error: error });
  });
});