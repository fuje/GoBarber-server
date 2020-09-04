import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '../services/users/CreateUserService';
import ensureAuthentication from '../middlewares/ensureAuthentication';

import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/users/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createdUser = await new CreateUserService().execute({
    email,
    name,
    password,
  });

  delete createdUser.password;

  return response.json(createdUser);
});

usersRouter.patch(
  '/avatar',
  ensureAuthentication,
  upload.single('avatar'),
  async (request, response) => {
    const updatedUser = await new UpdateUserAvatarService().execute({
      avatarFileName: request.file.filename,
      user_id: request.user.id,
    });

    delete updatedUser.password;

    return response.json(updatedUser);
  },
);

export default usersRouter;
