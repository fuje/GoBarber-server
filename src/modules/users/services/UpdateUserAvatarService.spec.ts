import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('Update User Avatar Service', () => {
  it('should be able to update the avatar from an user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeStorageProvider,
      fakeUsersRepository,
    );

    const user = await fakeUsersRepository.create({
      email: 'John.Doe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'TestName.png',
    });

    expect(user.avatar).toEqual('TestName.png');
  });

  it('should not be able to update avatar from an user that does not exist', () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeStorageProvider,
      fakeUsersRepository,
    );

    expect(
      updateUserAvatarService.execute({
        user_id: 'test',
        avatarFileName: 'TestName.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should update old avatar before adding a new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFileSpy = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeStorageProvider,
      fakeUsersRepository,
    );

    const user = await fakeUsersRepository.create({
      email: 'John.Doe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'TestName.png',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'TestName2.png',
    });

    expect(deleteFileSpy).toHaveBeenCalledTimes(1);
    expect(deleteFileSpy).toHaveBeenCalledWith('TestName.png');
    expect(user.avatar).toEqual('TestName2.png');
  });
});
