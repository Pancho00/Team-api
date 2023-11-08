import { verifyToken } from '../../src/utils/jwt.util';
import authMiddleware from '../../src/middlewares/auth.middleware';
import HTTPError from '../../src/errors/http.error';

jest.mock('../../src/utils/jwt.util');

describe('Middleware: Auth', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  let resMock;
  let reqMock;
  let nextMock;
  beforeEach(() => {
    resMock = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    reqMock = { headers: { Authorization: 'Bearer token' } };
    nextMock = jest.fn();
  });
  it('should call next if a valid token is provided', () => {
    verifyToken.mockReturnValue({ userId: 1 });
    authMiddleware(reqMock, resMock, nextMock);
    expect(nextMock).toHaveBeenCalled();
  });

  it('should return an error if the token is not provided', () => {
    reqMock.headers.Authorization = undefined;
    authMiddleware(reqMock, resMock, nextMock);
    expect(resMock.status).toHaveBeenCalledWith(401);
    expect(resMock.send).toHaveBeenCalledWith({
      error: new HTTPError({
        name: 'auhtorization_token_is_required',
        message: 'the authorization header is needed and the token',
        code: 401,
      }),
    });
  });
  it('should return an error if the token is not valid', () => {
    verifyToken.mockImplementation(() => {
      throw new Error();
    });
    authMiddleware(reqMock, resMock, nextMock);
    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.send).toHaveBeenCalledWith({
      error: 'Error',
    });
  });
});
