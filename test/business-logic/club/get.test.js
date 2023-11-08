import { jest, describe, expect } from '@jest/globals';
import ClubModel from '../../../src/models/club/club.model';
import get from '../../../src/business-logic/club/get';
import clubFactory from '../../factories/club.factory';

jest.mock('../../../src/models/club/club.model');

describe('Business logic: Club: Get', () => {
    const clubId = 'validClubId';
    const club = clubFactory.build({ _id: clubId });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('Should find the club', async () => {
        ClubModel.findById.mockReturnValue(club);

        const result = await get(clubId);

        expect(ClubModel.findById).toHaveBeenCalledWith(clubId);
        expect(ClubModel.findById).toHaveReturnedWith(club);
        expect(result).toEqual(club);
        expect(result._id).toBe(club._id);
    });

    it('Should return null when the club doesnt exists', async () => {
        ClubModel.findById.mockReturnValue(null);

        const result = await get(clubId);

        expect(ClubModel.findById).toHaveBeenCalledWith(clubId);
        expect(result).toBeNull();
    });
});