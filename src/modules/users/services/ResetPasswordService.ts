import AppError from '@shared/errors/AppError';
import { differenceInHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IResetPasswordService {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IResetPasswordService) {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User Token does not exists');
    }

    if (Math.abs(differenceInHours(Date.now(), userToken.created_at)) > 2) {
      throw new AppError('User Token is expired');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
