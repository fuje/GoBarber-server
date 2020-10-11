import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

let fakeUsersRepository: IUsersRepository;
let fakeHashProvider: IHashProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe('Authenticate User Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeHashProvider,
      fakeUsersRepository,
    );
    authenticateUserService = new AuthenticateUserService(
      fakeHashProvider,
      fakeUsersRepository,
    );
  });

  it('should be able to authenticate an user', async () => {
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
    const authenticateUserPromise = authenticateUserService.execute({
      email: 'John.Doe@example.com',
      password: '123456',
    });

    await expect(authenticateUserPromise).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUserService.execute({
      email: 'John.Doe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    const authenticateUserPromise = authenticateUserService.execute({
      email: 'John.Doe@example.com',
      password: '12345678',
    });

    await expect(authenticateUserPromise).rejects.toBeInstanceOf(AppError);
  });
});
