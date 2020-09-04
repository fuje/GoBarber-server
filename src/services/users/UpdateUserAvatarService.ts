import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../../models/User';
import AppError from '../../errors/AppError';
import uploadConfig from '../../config/upload';

interface Request {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: Request) {
    const repository = getRepository(User);

    const user = await repository.findOne(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;

    await repository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
