import { expect, jest } from '@jest/globals';
import addMemberController from '../../../src/controllers/club/add-member.controller';
import MemberLogic from '../../../src/business-logic/member';
import HTTPError from '../../../src/errors/http.error';
import addValidation from '../../../src/validations/member.validations';

jest.mock('../../../src/business-logic/member', () => ({
  create: jest.fn().mockReturnThis(),
}));

const mockReq = {
  body: {
    name: 'John Doe',
    email: 'johndoe@example.com',
  },
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

describe('Controller: Club: Add member', () => {
  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should add a member to the club', async () => {
    MemberLogic.create.mockResolvedValue({ name: 'John Doe', email: 'johndoe@example.com' });

    await addMemberController(mockReq, mockRes);

    expect(addValidation.validateAsync).toHaveBeenCalledWith(mockReq.body);
    expect(MemberLogic.create).toHaveBeenCalledWith({ ...mockReq.body, clubId: mockReq.params.clubId, userId: mockReq.userId });
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.send).toHaveBeenCalledWith({ member: { name: 'John Doe', email: 'johndoe@example.com' } });
  });

  it('Should return an error when validation fails', async () => {
    const error = new HTTPError({ name: 'error', message: 'some-error', code: 400 });

    addValidation.validateAsync.mockRejectedValue(error);

    await addMemberController(mockReq, mockRes);

    expect(addValidation.validateAsync).toHaveBeenCalledWith(mockReq.body);
    expect(MemberLogic.create).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({ error: { message: 'some-error' } });
  });

  it('Should return an error when the logic fails', async () => {
    const error = new HTTPError({ name: 'error', message: 'some-error', code: 500 });

    addValidation.validateAsync.mockResolvedValue();
    MemberLogic.create.mockRejectedValue(error);

    await addMemberController(mockReq, mockRes);

    expect(addValidation.validateAsync).toHaveBeenCalledWith(mockReq.body);
    expect(MemberLogic.create).toHaveBeenCalledWith({ ...mockReq.body, clubId: mockReq.params.clubId, userId: mockReq.userId });
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith({ error: error });
  });
});