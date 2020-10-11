import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IUsersRepository from '../repositories/IUsersRepository';

let fakeUsersRepository: IUsersRepository;
let fakeMailProvider: IMailProvider;
let fakeUserTokensRepository: IUserTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('Send Forgot Password Email Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUserTokensRepository,
      fakeMailProvider,
      fakeUsersRepository,
    );
  });

  it('should be able to recover the password providing an email address', async () => {
    const sendMailSpy = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      email: 'John.Doe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'John.Doe@example.com',
    });

    expect(sendMailSpy).toHaveBeenCalledTimes(1);
    // expect(sendMailSpy).toHaveBeenCalledWith('John.Doe@example.com');
  });

  it('should not be able to recover the password from an user that does not exist', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({ email: 'John.Doe@example.com' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateTokenSpy = jest.spyOn(fakeUserTokensRepository, 'generate');

    await fakeUsersRepository.create({
      email: 'John.Doe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'John.Doe@example.com',
    });

    expect(generateTokenSpy).toHaveBeenCalledTimes(1);
  });
});
