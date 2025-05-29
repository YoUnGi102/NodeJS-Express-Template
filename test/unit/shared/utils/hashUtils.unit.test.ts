import hashUtils from '@src/logic/shared/utils/hashUtils';
import { TEST_PASSWORD } from '@test/utils/factories';

describe('hashUtils', () => {
  it('should hash a string and return hashed value', async () => {
    // Arrange
    const value = TEST_PASSWORD;

    // Act
    const hashedValue = await hashUtils.hash(value);

    // Assert
    expect(typeof hashedValue).toEqual('string');
    expect(hashedValue).toMatch(/^\$2[aby]\$.{56}$/);
  });

  it('should compare value with its hash and return true', async () => {
    // Arrange
    const value = TEST_PASSWORD;
    const hashedValue = await hashUtils.hash(value);

    // Act
    const valid = await hashUtils.compare(value, hashedValue);

    // Assert
    expect(valid).toEqual(true);
  });
});
