import { expect, jest } from '@jest/globals';
import SubscriptionLogic from '../../../src/business-logic/subscription';
import listSubscriptionsController from '../../../src/controllers/club/list-subscriptions.controller';
import HTTPError from '../../../src/errors/http.error';

jest.mock('../../../src/business-logic/subscription', () => ({
  listByClub: jest.fn().mockReturnThis(),
}));

const mockReq = {
  userId: 'user123',
  params: {
    clubId: 'club123',
  },
};

let resMock;

describe('Controller: Club: List subscriptions', () => {
  beforeEach(() => {
    resMock = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should return a list of subscriptions', async () => {
    const subscriptions = [{ userId: 'user123', clubId: 'club123' }];
    SubscriptionLogic.listByClub.mockReturnValue(subscriptions);

    await listSubscriptionsController(mockReq, resMock);

    expect(resMock.send).toBeCalledWith({ subscriptions });
    expect(SubscriptionLogic.listByClub).toHaveBeenCalledWith({ clubId: 'club123', userId: 'user123' });
  });

  it('Should throw an error when the logic fails', async () => {
    const error = new HTTPError({ name: 'error', message: 'some-error', code: 400 });

    SubscriptionLogic.listByClub.mockRejectedValue(error);

    await listSubscriptionsController(mockReq, resMock);

    expect(resMock.status).toBeCalledWith(400);
    expect(resMock.send).toBeCalledWith({ error });
    expect(SubscriptionLogic.listByClub).toHaveBeenCalledWith({ clubId: 'club123', userId: 'user123' });
  });
});