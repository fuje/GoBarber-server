import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import { container } from 'tsyringe';
import ListAppointmentsService from '@modules/appointments/services/ListAppointmentsService';

export default class AppointmentsController {
  public async list(request: Request, response: Response): Promise<Response> {
    const appointments = await container
      .resolve(ListAppointmentsService)
      .execute();

    return response.json(appointments);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { date, provider_id } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      date: parsedDate,
      provider_id,
    });

    return response.json(appointment);
  }
}
