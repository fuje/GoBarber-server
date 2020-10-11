import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: IUsersRepository;
let fakeUserTokensRepository: IUserTokensRepository;
let fakeHashProvider: IHashProvider;
let resetPasswordService: ResetPasswordService;

describe('Reset Password Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUserTokensRepository,
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'John.Doe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHashFn = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({ token, password: '123123' });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHashFn).toHaveBeenCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({ token: 'anything', password: '123123' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const userToken = await fakeUserTokensRepository.generate(
      'non-existing-user',
    );

    await expect(
      resetPasswordService.execute({
        token: userToken.token,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password after two hours', async () => {
    const user = await fakeUsersRepository.create({
      email: 'John.Doe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({ token, password: '123123' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
