import { User } from "@src/database/entities"
import { AuthUserResponseSchema } from "@src/logic/model/auth/auth.schema";


describe('AuthSchemas', () => {
    describe('AuthDTOResponse', () => {
        it('should return valid DTO from User entity', () => {
            const user = new User('Test123', 'test123@example.com', 'Test123.+');

            const { data, success, error } = AuthUserResponseSchema().safeParse(user);

            expect(success).toEqual(true)
            expect(error).toBeNull()
            expect(data.email).toEqual(user.email)
            expect(data.username).toEqual(user.username)
        })
    })
})