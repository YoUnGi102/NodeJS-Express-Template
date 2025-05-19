import { Entity, Column } from 'typeorm';
import { AuditableEntityUUID } from './AuditableEntityUUID';

@Entity()
export class User extends AuditableEntityUUID {
  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  timezone: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'varchar', nullable: true, unique: true, select: false })
  refreshToken?: string | null;

  constructor(
    username: string,
    email: string,
    password: string,
    timezone: string = 'Europe/Copenhagen',
    active: boolean = true,
  ) {
    super();
    this.username = username;
    this.email = email;
    this.password = password;
    this.timezone = timezone;
    this.active = active;
  }
}
