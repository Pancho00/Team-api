import { expect, jest } from '@jest/globals';
import listByClub from '../../../src/business-logic/member/list-by-club';
import authErrors from '../../../src/errors/auth.errors';
import MemberModel from '../../../src/models/member/member.model';
import ClubLogic from '../../../src/business-logic/club';

jest.mock('../../../src/models/member/member.model');
jest.mock('../../../src/business-logic/club');

describe('Logic: Members: ListByClub', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should return a quantity of clubs', async () => {
    ClubLogic.checkIfUserIsAdmin.mockReturnValue(true);
    MemberModel.find.mockReturnValue([
      {
        name: 'juan',
        _id: 1,
        email: 'email',
      },
    ]);

    const result = await listByClub({ clubId: '1', userId: '1' });
    expect(result).toEqual([
      {
        name: 'juan',
        _id: 1,
        email: 'email',
      },
    ]);

    expect(MemberModel.find).toBeCalledWith({ clubId: '1' });
    expect(ClubLogic.checkIfUserIsAdmin).toBeCalledWith({ clubId: '1', userId: '1' });
  });

  it('Should throw an error when ClubLogic.checkIfUserIsAdmin throws', async () => {
    ClubLogic.checkIfUserIsAdmin.mockRejectedValue(new Error('club-logic-error'));
    try {
      await listByClub({ clubId: '1', userId: '1' });
      throw new Error('other-error');
    } catch (error) {
      expect(error.message).toEqual('club-logic-error');
      expect(MemberModel.find).not.toBeCalled();
      expect(ClubLogic.checkIfUserIsAdmin).toBeCalledWith({ clubId: '1', userId: '1' });
    }
  });

  it('Should throw an error when MemberModel.find throws', async () => {
    ClubLogic.checkIfUserIsAdmin.mockReturnValue(true);
    MemberModel.find.mockRejectedValue(new Error('member-model-error'));
    try {
      await listByClub({ clubId: '1', userId: '1' });
      throw new Error('other-error');
    } catch (error) {
      expect(error.message).toEqual('member-model-error');
      expect(MemberModel.find).toBeCalledWith({ clubId: '1' });
      expect(ClubLogic.checkIfUserIsAdmin).toBeCalledWith({ clubId: '1', userId: '1' });
    }
  });
});
