import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../../models/User';
import AppError from '../../errors/AppError';
import auth from '../../config/auth';

interface Request {
  email: string;
  password: string;
}

interface Response {
  token: string;
  user: User;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const repository = getRepository(User);

    const foundUser = await repository.findOne({ where: { email } });

    if (!foundUser) {
      throw new AppError('Incorrect email/password', 401);
    }

    const passwordMatches = await compare(password, foundUser.password);

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
