import { expect, jest } from '@jest/globals';
import ClubLogic from '../../../src/business-logic/club';
//import HTTPError from '../../../src/errors/http.error';
import clubErrors from '../../../src/errors/club.errors';
import createController from '../../../src/controllers/club/create.controller';
import HTTPError from '../../../src/errors/http.error';

jest.mock('../../../src/business-logic/club');

describe('Controller: Club: Create club', () => {
  let resMock;
  const club = {
    name: 'club-test',
    description: 'club-descr',
    adminId: 'some-id',
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

  it('Should create a club', async () => {
    ClubLogic.create.mockReturnValue(club);

    await createController({ body: club }, resMock);

    expect(resMock.status).toBeCalledWith(201);
    expect(resMock.send).toBeCalledWith({ club });
    expect(ClubLogic.create).toHaveBeenCalled();
  });

  it('Should throw an error when name is not defined', async () => {
    await createController({ body: {} }, resMock);

    expect(resMock.status).toBeCalledWith(400);
    expect(resMock.send).toBeCalledWith({
      error: new HTTPError({
        name: clubErrors.validation.name,
        message: clubErrors.validation.messages.name,
        code: 400,
      }),
    });
    expect(ClubLogic.create).not.toHaveBeenCalled();
  });

  it('Should throw an error when description is not a string', async () => {
    await createController({ body: { ...club, description: true } }, resMock);

    expect(resMock.status).toBeCalledWith(400);
    expect(resMock.send).toBeCalledWith({
      error: new HTTPError({
        name: clubErrors.validation.name,
        message: clubErrors.validation.messages.description,
        code: 400,
      }),
    });
    expect(ClubLogic.create).not.toHaveBeenCalled();
  });

  it('Should throw an error when adminId is not defined', async () => {
    await createController({ body: { name: club.name } }, resMock);

    expect(resMock.status).toBeCalledWith(400);
    expect(resMock.send).toBeCalledWith({
      error: new HTTPError({
        name: clubErrors.validation.name,
        message: clubErrors.validation.messages.adminId,
        code: 400,
      }),
    });
    expect(ClubLogic.create).not.toHaveBeenCalled();
  });

  test('Should throw an error when the logic fails', async () => {
    const error = new HTTPError({ name: 'error', message: 'some-error', code: 400 });

    ClubLogic.create.mockRejectedValue(error);

    await createController({ body: club }, resMock);

    expect(resMock.status).toBeCalledWith(400);
    expect(resMock.send).toBeCalledWith({ error });
    expect(ClubLogic.create).toHaveBeenCalled();
  });
});
