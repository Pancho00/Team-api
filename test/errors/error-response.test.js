import { jest, describe, expect, afterEach } from '@jest/globals';
import HTTPError from '../../src/errors/http.error';
import { returnErrorResponse } from '../../src/errors/error-response';
import { JsonWebTokenError } from 'jsonwebtoken';

describe('Errors: Error Response', () => {

    afterEach(async () => {
        jest.resetAllMocks();
    });

    it('Should return a response with the error status code 400 and message for HTTPError instance', () => {
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

    it('Should return a response with the error status code 403 and message for JsonWebTokenError instance', () => {
        const error = new JsonWebTokenError('Test message', 'Test Error');

        const errorExpected = new HTTPError({
            name: error.name,
            message: error.message,
            code: 403,
        });

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        returnErrorResponse({ error, res });

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: errorExpected });
    });

    it('Should return a response with the error status code 500 and message for any other error instance', () => {
        const error = new Error('Test message');

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        returnErrorResponse({ error, res });

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({ error: error.toString() });
    });

});