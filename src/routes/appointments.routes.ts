import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import CreateAppointmentsService from '../services/appointments/CreateAppointmentsService';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import ensureAuthentication from '../middlewares/ensureAuthentication';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthentication);

appointmentsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(AppointmentsRepository);
  const appointments = await repository.find();

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  const { date, provider_id } = request.body;

  const parsedDate = parseISO(date);

  const createAppointment = new CreateAppointmentsService();

  const appointment = await createAppointment.execute({
    date: parsedDate,
    provider_id,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
