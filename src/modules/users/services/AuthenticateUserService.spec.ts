import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('Authenticate User Service', () => {
  it('should be able to authenticate an user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeHashProvider,
      fakeUsersRepository,
    );
    const authenticateUserService = new AuthenticateUserService(
      fakeHashProvider,
      fakeUsersRepository,
    );

    const user = await createUserService.execute({
      email: 'John.Doe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    const authenticateUserResponse = await authenticateUserService.execute({
      email: 'John.Doe@example.com',
      password: '123456',
    });

    expect(authenticateUserResponse).toHaveProperty('token');
    expect(authenticateUserResponse.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const authenticateUserService = new AuthenticateUserService(
      fakeHashProvider,
      fakeUsersRepository,
    );

    const authenticateUserPromise = authenticateUserService.execute({
      email: 'John.Doe@example.com',
      password: '123456',
    });

    expect(authenticateUserPromise).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeHashProvider,
      fakeUsersRepository,
    );
    const authenticateUserService = new AuthenticateUserService(
      fakeHashProvider,
      fakeUsersRepository,
    );

    await createUserService.execute({
      email: 'John.Doe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    const authenticateUserPromise = authenticateUserService.execute({
      email: 'John.Doe@example.com',
      password: '12345678',
    });

    expect(authenticateUserPromise).rejects.toBeInstanceOf(AppError);
  });
});
