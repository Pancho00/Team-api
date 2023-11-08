import { describe, expect } from '@jest/globals';
import jwt from 'jsonwebtoken';
import envs from '../../src/configs/environment';
import { generateToken, verifyToken } from '../../src/utils/jwt.util';

jest.mock('jsonwebtoken');

const { JWT } = envs;

describe('Utils: JWT Util', () => {
    const data = { id: '123', name: 'John Doe' };
    const token = 'generated-token';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('Generate Token', () => {
        it('should generate a JWT token with the given data and expiresIn', () => {
            jwt.sign.mockReturnValueOnce(token);

            const result = generateToken({ data, expiresIn: '1h' });

            expect(result).toBe(token);
            expect(jwt.sign).toHaveBeenCalledTimes(1);
            expect(jwt.sign).toHaveBeenCalledWith(data, JWT.SECRET, { expiresIn: '1h' });
        });

        it('should generate a JWT token with the default expiresIn if not provided', () => {
            jwt.sign.mockReturnValueOnce(token);

            const result = generateToken({ data });

            expect(result).toBe(token);
            expect(jwt.sign).toHaveBeenCalledTimes(1);
            expect(jwt.sign).toHaveBeenCalledWith(data, JWT.SECRET, { expiresIn: JWT.DEFAULT_EXPIRES });
        });
    });

    describe('Verify Token', () => {
        it('should verify and decode the given JWT token', () => {
            const decodedToken = { ...data, iat: 1234567890, exp: 1234567890 + JWT.DEFAULT_EXPIRES };

            jwt.verify.mockReturnValueOnce(decodedToken);

            const result = verifyToken(token);

            expect(result).toEqual(decodedToken);
            expect(jwt.verify).toHaveBeenCalledTimes(1);
            expect(jwt.verify).toHaveBeenCalledWith(token, JWT.SECRET);
        });

        it('should throw an error if the token is expired', () => {
            jwt.verify.mockImplementationOnce(() => {
                throw new jwt.TokenExpiredError('jwt expired');
            });

            expect(() => verifyToken(token)).toThrow(jwt.TokenExpiredError);
            expect(jwt.verify).toHaveBeenCalledTimes(1);
            expect(jwt.verify).toHaveBeenCalledWith(token, JWT.SECRET);
        });

        it('should throw an error if the secret key is invalid', () => {
            jwt.verify.mockImplementationOnce(() => {
                throw new jwt.JsonWebTokenError('invalid signature');
            });

            expect(() => verifyToken(token)).toThrow(jwt.JsonWebTokenError);
            expect(jwt.verify).toHaveBeenCalledTimes(1);
            expect(jwt.verify).toHaveBeenCalledWith(token, JWT.SECRET);
        });
    });

});