import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import ensureAuthentication from '../middlewares/ensureAuthentication';

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
