import { Entity, Column, OneToMany } from 'typeorm';
import { AuditableEntityUUID } from './AuditableEntityUUID';
import { UserSession } from './UserSession';

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

  @OneToMany(() => UserSession, (session) => session.user)
  sessions?: UserSession[];

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
