import { DataSource } from 'typeorm';
import { User, UserSession } from '../src/database/entities';

console.log('NODE_ENV', process.env.NODE_ENV);

export const createTestDataSource = () =>
  new DataSource({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    entities: [User, UserSession],
    logging: false,
  });

export default async () => {};
