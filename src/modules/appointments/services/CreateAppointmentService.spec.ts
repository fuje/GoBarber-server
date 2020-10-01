import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('Create Appointment Service', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const createdAppointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: 'test-id',
    });

    expect(createdAppointment).toHaveProperty('id');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    await createAppointmentService.execute({
      date: new Date('2020-04-04'),
      provider_id: 'test-id',
    });

    expect(
      createAppointmentService.execute({
        date: new Date('2020-04-04'),
        provider_id: 'test-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
