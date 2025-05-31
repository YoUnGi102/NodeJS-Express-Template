import { DataSource, FindOptionsSelect, FindOptionsSelectByString, FindOptionsSelectProperty, FindOptionsWhere, IsNull } from 'typeorm';
import { AuthDTO, AuthRegisterRequest } from '../auth.types';
import { User } from '@src/database/entities';
import { toAuthDTO } from './auth.mapper';
import { inject, injectable } from 'tsyringe';
import { IAuthRepository } from './auth.repository.interface';

const USER_ACTIVE_CONDITION = {
  active: true,
  deletedAt: IsNull()
}

const DEFAULT_SELECT = {
  username: true,
  email: true,
  uuid: true,
  createdAt: true
}

@injectable()
export class TypeormAuthRepository implements IAuthRepository {
  private userRepo;

  constructor(@inject(DataSource) private dataSource: DataSource) {
    this.userRepo = dataSource.getRepository(User);
  }

  private async findUserBy(condition: FindOptionsWhere<User> | FindOptionsWhere<User>[], extraFields?: FindOptionsSelect<User>) : Promise<User> {
    try{
      const user = await this.userRepo.findOneOrFail({where: {...condition}, select: {...DEFAULT_SELECT, ...extraFields}})
      return user
    }catch(err){
      throw new Error('USER_NOT_FOUND');
    }
  }

  // Checks if a user with passed username or email already exists
  async checkUserExists(
    username: string,
    email: string,
  ): Promise<AuthDTO | null> {
    const user = await this.findUserBy([{username}, {email}])
    return user ? toAuthDTO(user) : null;
  }

  async getUserWithPassword(username: string): Promise<AuthDTO | null> {
    const user = await this.findUserBy({...USER_ACTIVE_CONDITION, username}, {password: true})
    return user ? toAuthDTO(user) : null;
  }

  async getUserByUUID(uuid: string): Promise<AuthDTO | null> {
    const user = await this.findUserBy({...USER_ACTIVE_CONDITION, uuid});

    return user ? toAuthDTO(user) : null;
  }

  async registerUser(auth: AuthRegisterRequest): Promise<AuthDTO> {
    const user = this.userRepo.create({
      username: auth.username,
      email: auth.email,
      password: auth.password,
    });
    const userCreated = await this.userRepo.save(user);
    return toAuthDTO(userCreated);
  }
}
