import { Router } from 'express';
import CreateUserService from '../services/users/CreateUserService';

const usersRouter = Router();

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

export default usersRouter;
