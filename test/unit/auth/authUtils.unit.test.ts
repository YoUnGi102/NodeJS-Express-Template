import authTokenUtils from '@model/auth/utils/authUtils';

describe('authUtils', () => {
  describe('signRefreshToken', () => {
    it('should return a different refresh token on each call', async () => {
      // Arrange
      const userUUID = 'test-user-uuid';

      // Act
      const token1 = authTokenUtils.signRefreshToken(userUUID);
      const token2 = authTokenUtils.signRefreshToken(userUUID);

      // Assert
      expect(typeof token1).toBe('string');
      expect(typeof token2).toBe('string');
      expect(token1).not.toEqual(token2);
    });
  });
});
