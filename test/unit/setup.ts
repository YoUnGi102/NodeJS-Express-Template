import 'reflect-metadata';
import '@config/container';
import { Express } from 'express';
import { DataSource } from 'typeorm';
import { createTestDataSource } from '../global-setup';
import { container } from 'tsyringe';
import { createApp } from '@src/app';

export const setupUnit = async (): Promise<{
  app: Express;
  testDataSource: DataSource;
}> => {
  const testDataSource = createTestDataSource();
  await testDataSource.initialize();
  container.registerInstance(DataSource, testDataSource);
  const app = await createApp(container.resolve(DataSource));
  return { app, testDataSource };
};
