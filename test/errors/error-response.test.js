import { jest, describe, expect, afterEach } from '@jest/globals';
import HTTPError from '../../src/errors/http.error';
import { returnErrorResponse } from '../../src/errors/error-response';


describe('Errors: Error Response', () => {

    afterEach(async () => {
        jest.resetAllMocks();
    });

    it('Should return a response with the error status code and message for HTTPError instance', () => {
        const error = new HTTPError({
            name: 'Test Error',
            message: 'Test message',
            code: 400,
        });
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        returnErrorResponse({ error, res });

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ error });
    });

});