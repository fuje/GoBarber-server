import { Router } from 'express';
import ensureAuthentication from '@modules/users/infra/http/middlewares/ensureAuthentication';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthentication);

// appointmentsRouter.get('/', async (request, response) => {
//   const repository = getCustomRepository(AppointmentsRepository);
//   const appointments = await repository.find();

//   return response.json(appointments);
// });

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;