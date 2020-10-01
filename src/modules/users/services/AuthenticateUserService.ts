import { sign } from 'jsonwebtoken';
import auth from '@config/auth';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  token: string;
  user: User;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('HashProvider') private hashProvider: IHashProvider,
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const foundUser = await this.usersRepository.findByEmail(
      email.toLocaleLowerCase(),
    );

    if (!foundUser) {
      throw new AppError('Incorrect email/password', 401);
    }

    const passwordMatches = await this.hashProvider.compareHash(
      password,
      foundUser.password,
    );

    if (!passwordMatches) {
      throw new AppError('Incorrect email/password', 401);
    }

    const token = sign({}, auth.jwt.secret, {
      expiresIn: auth.jwt.expiresIn,
      subject: foundUser.id,
    });

    return {
      token,
      user: foundUser,
    };
  }
}

export default AuthenticateUserService;
