import { jest, describe, expect, afterEach, beforeAll } from '@jest/globals';
import ClubModel from '../../../src/models/club/club.model';
import clubFactory from '../../factories/club.factory';
import userFactory from '../../factories/user.factory.v2';
import UserModel from '../../../src/models/user/user.model';
import list from '../../../src/business-logic/club/list';

describe('Business logic: Club: List', () => {
    beforeAll(async () => {
        await ClubModel.deleteMany({});
        await UserModel.deleteMany({});
    });

    afterEach(async () => {
        jest.resetAllMocks();
        // await UserModel.deleteMany({});
        // await ClubModel.deleteMany({});
    });

    it('should return an empty list when there are no clubs in the database', async () => {
        const result = await list();

        expect(result).toHaveLength(0);
        expect(result).toEqual([]);
    });

    it('Should return a list of clubs with admin an manager.userId populated', async () => {
        // Crear y guardar usuario admin y usuario manager en la base de datos
        const admin = await UserModel.create(userFactory.build());
        const userManager = await UserModel.create(userFactory.build());

        // Crear y guardar clubs en la base de datos
        const manager = {
            userId: userManager._id,
            role: 'manager'
        }

        await ClubModel.create(
            clubFactory.build({ managers: [manager], admin: admin._id })
        );

        // Expects
        const result = await list();

        expect(result).toHaveLength(1);
        expect(result[0].admin.name).toEqual(expect.anything());
        expect(result[0].admin.email).toEqual(expect.anything());
        expect(result[0].managers[0].userId.name).toBe(userManager.name);
        expect(result[0].managers[0].userId.email).toBe(userManager.email);
    });

});