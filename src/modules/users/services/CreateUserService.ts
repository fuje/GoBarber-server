import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

interface CreateUserServiceRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: CreateUserServiceRequest) {
    const repository = getRepository(User);
    const userByEmail = await repository.findOne({ where: { email } });

    if (userByEmail) {
      throw new AppError('Email address already registered', 400);
    }

    const hashedPassword = await hash(password, 8);

    const user = repository.create({
      name,
      email,
      password: hashedPassword,
    });

    await repository.save(user);

    return user;
  }
}

export default CreateUserService;
