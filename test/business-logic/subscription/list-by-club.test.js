import { expect, jest } from '@jest/globals';
import ClubLogic from '../../../src/business-logic/club';
import SubscriptionModel from '../../../src/models/subscription/subscription.model';
import listByClub from '../../../src/business-logic/subscription/list-by-club';

jest.mock('../../../src/business-logic/club');
jest.mock('../../../src/models/subscription/subscription.model');

describe('listByClub', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call ClubLogic.checkIfUserIsAdmin with the correct arguments', async () => {
    const clubId = 'club123';
    const userId = 'user123';

    const checkIfUserIsAdminMock = jest.fn();
    ClubLogic.checkIfUserIsAdmin = checkIfUserIsAdminMock;

    await listByClub({ clubId, userId });

    expect(checkIfUserIsAdminMock).toHaveBeenCalledWith({ clubId, userId });
  });

  it('should call SubscriptionModel.find with the correct arguments', async () => {
    const clubId = 'club123';
    const userId = 'user123';

    const findMock = jest.fn();
    SubscriptionModel.find = findMock;

    await listByClub({ clubId, userId });

    expect(findMock).toHaveBeenCalledWith({ clubId });
  });

  it('should return the subscriptions returned by SubscriptionModel.find', async () => {
    const clubId = 'club123';
    const userId = 'user123';

    const subscriptions = [
      {
        name: 'Example Subscription 1',
        price: 10,
        description: 'Example description 1',
        clubId,
      },
      {
        name: 'Example Subscription 2',
        price: 20,
        description: 'Example description 2',
        clubId,
      },
    ];

    SubscriptionModel.find.mockResolvedValue(subscriptions);

    const result = await listByClub({ clubId, userId });

    expect(result).toEqual(subscriptions);
  });
});