import { getCustomRepository } from 'typeorm';
import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  date: Date;
  provider_id: string;
}

class CreateAppointmentsService {
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const repository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentByDate = await repository.findByDate(appointmentDate);

    if (findAppointmentByDate) {
      throw new AppError('This appointment is already booked', 401);
    }

    const appointment = repository.create({
      provider_id,
      date: appointmentDate,
    });

    await repository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentsService;
