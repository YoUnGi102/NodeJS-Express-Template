import { AuthDTO, AuthRegisterRequest } from '../auth.types';

export interface IAuthRepository {
  /**
   * Checks whether a user with the given username or email exists.
   * Includes soft-deleted and deactivated users in the check.
   *
   * ⚠️ Use this method **only** for validating register requests.
   *
   * @param username - The username to check.
   * @param email - The email to check.
   * @returns The user DTO if a match is found, otherwise null.
   */
  findByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<AuthDTO | null>;

  /**
   * Retrieves an active user along with their hashed password.
   *
   * ⚠️ Use this method **only** during login for password verification.
   *
   * @param username - The username of the user.
   * @returns The user DTO including the hashed password, or null if not found.
   */
  findByUsernameWithPassword(username: string): Promise<AuthDTO | null>;

  /**
   * Retrieves a user by their UUID.
   *
   * @param uuid - The UUID of the user.
   * @returns The user DTO if found, otherwise null.
   */
  findByUUID(uuid: string): Promise<AuthDTO | null>;

  /**
   * Creates and persists a new user.
   *
   * @param auth - The registration request data.
   * @returns The created user DTO.
   */
  create(auth: AuthRegisterRequest): Promise<AuthDTO>;
}
