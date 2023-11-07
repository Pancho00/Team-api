import { expect, jest } from '@jest/globals';
import AuthLogic from '../../../src/business-logic/auth';
import login from '../../../src/controllers/auth/login.controller';
import HTTPError from '../../../src/errors/http.error';
import authErrors from '../../../src/errors/auth.errors';

jest.mock('../../../src/business-logic/auth');

describe('Controller: Auth: Login', () => {
  let resMock;
  const user = {
    email: 'email@gmail.com',
    password: '123asd',
  };

  beforeEach(() => {
    resMock = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should return a token', async () => {
    AuthLogic.login.mockReturnValue('token');
    await login({ body: user }, resMock);

    expect(resMock.status).toBeCalledWith(200);
    expect(resMock.send).toBeCalledWith({ token: 'token' });
    expect(AuthLogic.login).toBeCalledWith(user);
  });

  it('Should throw an error when email or password is not defined', async () => {
    await login({ body: {} }, resMock);

    expect(resMock.status).toBeCalledWith(400);
    expect(resMock.send).toBeCalledWith({
      error: new HTTPError({
        name: authErrors.login.validation.name,
        message: authErrors.login.validation.messages.email,
        code: 400,
      }),
    });
    expect(AuthLogic.login).not.toHaveBeenCalled();
  });

  it('Should throw an error when the logic fails', async () => {
    const error = new HTTPError({ name: 'error', message: 'some-error', code: 400 });
    AuthLogic.login.mockRejectedValue(error);

    await login({ body: user }, resMock);
    expect(resMock.status).toBeCalledWith(400);
    expect(resMock.send).toBeCalledWith({ error });
    expect(AuthLogic.login).toBeCalledWith(user);
  });
});
