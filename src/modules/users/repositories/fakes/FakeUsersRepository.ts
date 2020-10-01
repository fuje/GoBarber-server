import { uuid } from 'uuidv4';
import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '../IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { ...data, id: uuid() });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const idx = this.users.findIndex(u => user.id === u.id);

    if (idx > -1) {
      this.users[idx] = user;
    }

    return user;
  }
}

export default FakeUsersRepository;
