import { createTestDataSource } from '../global-setup';

export const setupTestDataSource = async () => {
  const testDataSource = createTestDataSource();
  await testDataSource.initialize();
  return testDataSource;
};
