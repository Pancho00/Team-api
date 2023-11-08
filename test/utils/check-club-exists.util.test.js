import { jest, describe, expect, beforeEach, afterEach } from '@jest/globals';
import ClubLogic from '../../src/business-logic/club';
import checkClubExists from '../../src/utils/check-club-exists.util';
import HTTPError from '../../src/errors/http.error';
import clubFactory from '../factories/club.factory';

jest.mock('../../src/business-logic/club');

describe('Utils: Check Club Exists', () => {
    const clubId = '123';
    const errorObject = new HTTPError({ name: 'Club not found', message: 'Club not found', code: 404 });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should throw an error if the club does not exist', async () => {
        ClubLogic.get.mockResolvedValueOnce(null);

        await expect(checkClubExists({ clubId, errorObject })).rejects.toThrow(errorObject);
        expect(ClubLogic.get).toHaveBeenCalledTimes(1);
        expect(ClubLogic.get).toHaveBeenCalledWith(clubId);
    });

    it('should not throw an error if the club exists', async () => {
        const club = clubFactory.build()
        ClubLogic.get.mockResolvedValueOnce(club._id);

        await expect(checkClubExists({ clubId, errorObject })).resolves.not.toThrow();
        expect(ClubLogic.get).toHaveBeenCalledTimes(1);
        expect(ClubLogic.get).toHaveBeenCalledWith(clubId);
    });
});