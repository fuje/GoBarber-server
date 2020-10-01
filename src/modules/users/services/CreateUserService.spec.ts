import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('Create User Service', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeHashProvider,
      fakeUsersRepository,
    );

    const createdUser = await createUserService.execute({
      email: 'John.Doe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    expect(createdUser).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeHashProvider,
      fakeUsersRepository,
    );

    await createUserService.execute({
      email: 'John.Doe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    expect(
      createUserService.execute({
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
