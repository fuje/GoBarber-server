import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

describe('Authenticate User Service', () => {
  it('should be able to authenticate an user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUserService = new CreateUserService(fakeUsersRepository);
    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
    );

    await createUserService.execute({
      email: 'John.Doe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    const authenticateUserResponse = await authenticateUserService.execute({
      email: 'John.Doe@example.com',
      password: '123456',
    });

    expect(authenticateUserResponse).toHaveProperty('token');
  });
});
