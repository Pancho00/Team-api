import { expect, jest } from '@jest/globals';
import addSubscriptionController from '../../../src/controllers/club/add-subscription.controller';
import SubscriptionLogic from '../../../src/business-logic/subscription';
import HTTPError from '../../../src/errors/http.error';
import addValidation from '../../../src/validations/subscription.validations';

jest.mock('../../../src/business-logic/subscription', () => ({
  create: jest.fn().mockReturnThis(),
}));

const mockReq = {
  body: {
    name: 'Monthly subscription',
    price: 10,
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

describe('Controller: Club: Add subscription', () => {
  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should add a subscription to the club', async () => {
    SubscriptionLogic.create.mockResolvedValue({ name: 'Monthly subscription', price: 10 });

    await addSubscriptionController(mockReq, mockRes);

    expect(addValidation.validateAsync).toHaveBeenCalledWith(mockReq.body);
    expect(SubscriptionLogic.create).toHaveBeenCalledWith({ ...mockReq.body, clubId: mockReq.params.clubId, userId: mockReq.userId });
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.send).toHaveBeenCalledWith({ subscription: { name: 'Monthly subscription', price: 10 } });
  });

  it('Should return an error when validation fails', async () => {
    const error = new HTTPError({ name: 'error', message: 'some-error', code: 400 });

    addValidation.validateAsync.mockRejectedValue(error);

    await addSubscriptionController(mockReq, mockRes);

    expect(addValidation.validateAsync).toHaveBeenCalledWith(mockReq.body);
    expect(SubscriptionLogic.create).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({ error: { message: 'some-error' } });
  });

  it('Should return an error when the logic fails', async () => {
    const error = new HTTPError({ name: 'error', message: 'some-error', code: 500 });

    addValidation.validateAsync.mockResolvedValue();
    SubscriptionLogic.create.mockRejectedValue(error);

    await addSubscriptionController(mockReq, mockRes);

    expect(addValidation.validateAsync).toHaveBeenCalledWith(mockReq.body);
    expect(SubscriptionLogic.create).toHaveBeenCalledWith({ ...mockReq.body, clubId: mockReq.params.clubId, userId: mockReq.userId });
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith({ error: error });
  });
});