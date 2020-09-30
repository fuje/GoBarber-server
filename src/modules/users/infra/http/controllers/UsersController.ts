import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createdUser = await container.resolve(CreateUserService).execute({
      email,
      name,
      password,
    });

    delete createdUser.password;

    return response.json(createdUser);
  }
}
