import {
  DataSource,
  FindOptionsSelect,
  FindOptionsWhere,
  IsNull,
} from 'typeorm';
import { AuthDTO, AuthRegisterRequest } from '../auth.types';
import { User } from '@src/database/entities';
import { toAuthDTO } from './auth.mapper';
import { inject, injectable } from 'tsyringe';
import { IAuthRepository } from './auth.repository.interface';

const USER_ACTIVE_CONDITION = {
  active: true,
  deletedAt: IsNull(),
};

const DEFAULT_SELECT = {
  id: true,
  username: true,
  email: true,
  uuid: true,
  createdAt: true,
};

@injectable()
export class TypeormAuthRepository implements IAuthRepository {
  private userRepo;

  constructor(@inject(DataSource) private dataSource: DataSource) {
    this.userRepo = dataSource.getRepository(User);
  }

  private async findBy(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    extraFields: FindOptionsSelect<User> = {},
  ): Promise<User | null> {
    const select = {
      ...DEFAULT_SELECT,
      ...extraFields,
    };

    const user = await this.userRepo.findOne({ where, select });
    return user;
  }

  async findByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<AuthDTO | null> {
    const user = await this.findBy([{ username }, { email }]);
    return user ? toAuthDTO(user) : null;
  }

  async findByUsernameWithPassword(username: string): Promise<AuthDTO | null> {
    const user = await this.findBy(
      { ...USER_ACTIVE_CONDITION, username },
      { password: true },
    );
    return user ? toAuthDTO(user) : null;
  }

  async findByUUID(uuid: string): Promise<AuthDTO | null> {
    const user = await this.findBy({ ...USER_ACTIVE_CONDITION, uuid });

    return user ? toAuthDTO(user) : null;
  }

  async create(auth: AuthRegisterRequest): Promise<AuthDTO> {
    const user = this.userRepo.create({
      username: auth.username,
      email: auth.email,
      password: auth.password,
    });
    const userCreated = await this.userRepo.save(user);
    return toAuthDTO(userCreated);
  }
}
