import { Router } from 'express';
import AuthenticateUserService from '../services/sessions/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticatedUserResponse = await new AuthenticateUserService().execute(
    { email, password },
  );

  delete authenticatedUserResponse.user.password;

  return response.json(authenticatedUserResponse);
});

export default sessionsRouter;
