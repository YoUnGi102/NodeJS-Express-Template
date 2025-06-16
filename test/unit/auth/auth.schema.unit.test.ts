import { User } from "@src/database/entities";
import { AuthUserResponseSchema } from "@src/logic/model/auth/auth.schema";
import { DB_USER_MOCK } from "@test/utils/fixtures";

describe("AuthSchema", () => {
	describe("AuthDTOResponse", () => {
		it("should return valid DTO from User entity", () => {
			// Arrange
			const user: Partial<User> = { ...DB_USER_MOCK };

			// Act
			const { data, success, error } = AuthUserResponseSchema().safeParse(user);

			// Assert
			expect(success).toEqual(true);
			expect(error).toBeUndefined();
			expect(data.email).toEqual(user.email);
			expect(data.username).toEqual(user.username);
			expect(data.createdAt).toEqual(user.createdAt);
			expect(data.uuid).toEqual(user.uuid);
		});

		it("should return valid DTO from User entity without password", () => {
			// Arrange
			const user: Partial<User> = { ...DB_USER_MOCK, password: undefined };

			// Act
			const data = AuthUserResponseSchema().parse(user);

			// Assert
			expect(user.password).toBeUndefined();
			expect(data.email).toEqual(user.email);
			expect(data.username).toEqual(user.username);
			expect(data.createdAt).toEqual(user.createdAt);
			expect(data.uuid).toEqual(user.uuid);
		});
	});
});
