import 'reflect-metadata';
import '@config/container';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { Express } from 'express';
import { User } from '../src/database/entities';
import { createApp } from '../src/app';
import logger from '@src/logic/shared/utils/logger';

export const testDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  synchronize: true,
  entities: [User],
  logging: false,
});

export const setupApp = async (): Promise<Express> => {
  logger.info('Database initialized');
  await testDataSource.initialize();
  container.registerInstance(DataSource, testDataSource);
  const app = await createApp(testDataSource);
  return app;
};

export const destroyApp = async () => {
  if (testDataSource.isInitialized) {
    logger.info('Database destroyed');
    await testDataSource.destroy();
    await new Promise((res) => setTimeout(res, 50));
  }
};
