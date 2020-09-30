import { uuid } from 'uuidv4';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async create(data: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    appointment.id = uuid();
    appointment.date = data.date;
    appointment.provider_id = data.provider_id;

    this.appointments.push(appointment);

    return appointment;
  }

  public async findAll() {
    return this.appointments;
  }

  public async findByDate(date: Date) {
    const foundAppointment = this.appointments.find(
      appointment => appointment.date === date,
    );

    return foundAppointment;
  }
}

export default FakeAppointmentsRepository;
