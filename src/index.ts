import 'reflect-metadata';
import '@config/container';
import { createApp } from './app';
import dotenv from 'dotenv';
import logger from '@src/logic/shared/utils/logger';
import AppDataSource from './database/data-source';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';

dotenv.config();

logger.info(`NODE_ENV=${process.env.NODE_ENV}`);

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(async () => {
    logger.info('DB initialized');

    container.registerInstance(DataSource, AppDataSource);

    const app = await createApp(AppDataSource);
    app.listen(PORT, () => {
      if (NODE_ENV !== 'production') {
        logger.info(`Listening on http://localhost:${PORT}`);
      }
    });
  })
  .catch((error: Error) => {
    logger.error('Database connection failed:', error);
  });

export { createApp };
