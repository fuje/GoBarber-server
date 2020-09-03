import { getCustomRepository } from 'typeorm';
import { startOfHour } from 'date-fns';
import Appointment from '../../models/Appointment';
import AppointmentsRepository from '../../repositories/AppointmentsRepository';
import AppError from '../../errors/AppError';

interface Request {
  date: Date;
  provider: string;
}

class CreateAppointmentsService {
  public async execute({ date, provider }: Request): Promise<Appointment> {
    const repository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentByDate = await repository.findByDate(appointmentDate);
    console.log(appointmentDate, findAppointmentByDate);

    if (findAppointmentByDate) {
      throw new AppError('This appointment is already booked', 401);
    }

    const appointment = repository.create({
      provider,
      date: appointmentDate,
    });

    await repository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentsService;
