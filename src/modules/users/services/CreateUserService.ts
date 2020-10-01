import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface ICreateUserServiceRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('HashProvider') private hashProvider: IHashProvider,
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute({ name, email, password }: ICreateUserServiceRequest) {
    const userByEmail = await this.usersRepository.findByEmail(
      email.toLocaleLowerCase(),
    );

    if (userByEmail) {
      throw new AppError('Email address already registered', 400);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = this.usersRepository.create({
      name,
      email: email.toLocaleLowerCase(),
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
