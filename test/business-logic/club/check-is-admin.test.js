import { describe, it, jest, expect } from '@jest/globals';
import ClubModel from '../../../src/models/club/club.model';
import checkIfTheUserIsTheClubAdmin from '../../../src/business-logic/club/check-is-admin';
import clubFactory from '../../factories/club.factory';
import userFactory from '../../factories/user.factory.v2';
import clubErrors from '../../../src/errors/club.errors';

jest.mock('../../../src/models/club/club.model');

describe('Business logic: Club: Check is admin', () => {
    const clubId = "validClubId";
    const userId = "validAdminUserId";

    const club = clubFactory.build({ _id: clubId, admin: userFactory.build({ _id: userId, isAdmin: true }) });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('Should find the club and check that the user is admin', async () => {
        ClubModel.findOne.mockReturnValue(club);

        await checkIfTheUserIsTheClubAdmin({ clubId, userId });

        expect(ClubModel.findOne).toHaveBeenCalledWith({ _id: clubId, admin: userId });
        expect(ClubModel.findOne).toHaveReturnedWith(club);
        expect(ClubModel.findOne().admin._id).toEqual(userId);
    });

    it('Should throw an error when the user is not admin', async () => {

        ClubModel.findOne.mockReturnValue(undefined);

        try {
            await checkIfTheUserIsTheClubAdmin({ clubId, userId });
            throw new Error('unexpected error');
        } catch (error) {
            expect(ClubModel.findOne).toHaveBeenCalledWith({ _id: clubId, admin: userId });
            expect(ClubModel.findOne()).toBeUndefined();
            expect(error.message).toEqual(clubErrors.userIsNotTheAdmin.message);
        }
    });
});