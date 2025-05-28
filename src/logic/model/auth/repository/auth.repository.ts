import { DataSource, IsNull } from 'typeorm';
import { AuthDTO, AuthRegisterRequest } from '../auth.types';
import { User } from '@src/database/entities';
import { toAuthDTO } from './auth.mapper';
import { inject, injectable } from 'tsyringe';
import { IAuthRepository } from './auth.repository.interface';

@injectable()
export class AuthRepository implements IAuthRepository {
  private userRepo;

  constructor(@inject(DataSource) private dataSource: DataSource) {
    this.userRepo = dataSource.getRepository(User);
  }

  // Checks if a user with passed username or email already exists
  async checkUserExists(
    username: string,
    email: string,
  ): Promise<AuthDTO | null> {
    const user = await this.userRepo.findOne({
      where: [{ username }, { email }],
    });
    return user ? toAuthDTO(user) : null;
  }

  async getUserWithPassword(username: string): Promise<AuthDTO | null> {
    const user = await this.userRepo.findOne({
      where: { username, active: true, deletedAt: IsNull() },
      select: {
        username: true,
        refreshToken: true,
        email: true,
        password: true,
        uuid: true,
        createdAt: true,
      },
    });
    return user ? toAuthDTO(user) : null;
  }

  async getUserByUUID(uuid: string): Promise<AuthDTO | null> {
    const user = await this.userRepo.findOne({
      where: { uuid },
      select: {
        uuid: true,
        refreshToken: true,
        username: true,
        email: true,
        createdAt: true,        
      },
    });

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

  async updateRefreshToken(
    userUUID: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userRepo.update({ uuid: userUUID }, { refreshToken });
  }
}
