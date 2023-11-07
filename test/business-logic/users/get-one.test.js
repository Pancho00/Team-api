import { jest, describe, expect, afterEach } from '@jest/globals';
import userFactory from '../../factories/user.factory.v2';
import UserModel from '../../../src/models/user/user.model';
import getOne from '../../../src/business-logic/users/get-one';

describe('Business logic: Users: Get One', () => {

    afterEach(async () => {
        jest.resetAllMocks();
        await UserModel.deleteMany({});
    });


    it('Should return a user that matches the query', async () => {
        // Crear y guardar usuario en la base de datos
        const user = userFactory.build();
        await UserModel.create(user);

        // Query
        const query = { name: user.name };

        const result = await getOne({ query });

        expect(result).toBeDefined();
        expect(result.name).toBe(user.name);
    });

    it('Should return a user that matches the query and only contains the attributes specified in the select', async () => {
        // Crear y guardar usuario en la base de datos
        const user = userFactory.build();
        await UserModel.create(user);

        // Query y select
        const query = { name: user.name };
        const select = ['name', 'email'];
        const propertiesShouldNotBeDefined = ['password', 'isAdmin'];

        const result = await getOne({ query, select });

        expect(result.name).toBe(user.name);
        propertiesShouldNotBeDefined.forEach((prop) => {
            expect(result[prop]).toBeUndefined();
        });
    });

});