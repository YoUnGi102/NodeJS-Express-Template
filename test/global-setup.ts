import { DataSource } from 'typeorm';
import { container } from 'tsyringe';
import { User } from '../src/database/entities';
import logger from '../src/logic/shared/utils/logger';

console.log('NODE_ENV', process.env.NODE_ENV);

export const createTestDataSource = () =>
  new DataSource({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    entities: [User],
    logging: false,
  });

export default async () => {};
