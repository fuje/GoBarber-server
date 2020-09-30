import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updatedUser = await container
      .resolve(UpdateUserAvatarService)
      .execute({
        avatarFileName: request.file.filename,
        user_id: request.user.id,
      });

    delete updatedUser.password;

    return response.json(updatedUser);
  }
}
