import UserModel from '../../src/models/user/user.model';
import isAdminMiddleware from '../../src/middlewares/is-admin.middleware';
import HTTPError from '../../src/errors/http.error';

jest.mock('../../src/models/user/user.model');

describe('Middleware: isAdmin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  let resMock;
  let reqMock;
  let nextMock;
  beforeEach(() => {
    resMock = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    reqMock = {
      userId: 1,
    };
    nextMock = jest.fn();
  });

  it('should call next if the user is admin', async () => {
    UserModel.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({ isAdmin: true }),
    });
    await isAdminMiddleware(reqMock, resMock, nextMock);

    expect(nextMock).toHaveBeenCalled();
  });

  it("should return a 403 error if the user isn't admin", async () => {
    UserModel.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({ isAdmin: false }),
    });
    await isAdminMiddleware(reqMock, resMock, nextMock);

    expect(resMock.status).toHaveBeenCalledWith(403);
    expect(resMock.send).toHaveBeenCalledWith({
      error: new HTTPError({
        name: 'forbidden_not_admin',
        message: 'the users is not admin',
        code: 403,
      }),
    });
  });

  it("should return error 500 if the user doesn't exists", async () => {
    UserModel.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockImplementation(() => {
        throw new Error();
      }),
    });
    await isAdminMiddleware(reqMock, resMock, nextMock);
    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.send).toHaveBeenCalledWith({
      error: 'Error',
    });
  });
});
