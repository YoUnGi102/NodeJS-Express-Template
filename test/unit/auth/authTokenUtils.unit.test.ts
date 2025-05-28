// import { AuthRepository } from "@src/logic/model/auth/repository/auth.repository";
// import { AuthService } from "@src/logic/model/auth/service/auth.service";
// import { testDataSource } from "../../unit/setup";
// import authTokenUtils from "@src/logic/model/auth/utils/authTokenUtils";
// import { destroyUnit, setupUnit } from "../setup";

// let authRepository: AuthRepository
// let authService: AuthService

// beforeAll(async () => {
//     await setupUnit();
//     authRepository = new AuthRepository(testDataSource)
//     authService = new AuthService(authRepository);
// })

// afterAll(async () => {
//     await destroyUnit();
// })

// describe('AuthTokenUtils - signRefreshToken', ()=>{
//     it('should return a different refresh token on each call', async () => {
//         const userUUID = '68b360a7-8624-40bb-9f66-854b537dc50c';

//         const token1 = authTokenUtils.signRefreshToken(userUUID);
//         const token2 = authTokenUtils.signRefreshToken(userUUID);

//         expect(typeof token1).toBe('string');
//         expect(typeof token2).toBe('string');
//         expect(token1).not.toEqual(token2);
//     })

//     it('should not accept old refresh token for refresh', async () => {
//         const userUUID = '68b360a7-8624-40bb-9f66-854b537dc50c';

//         const token1 = authTokenUtils.signRefreshToken(userUUID);
//         const token2 = authTokenUtils.signRefreshToken(userUUID);

//         expect(typeof token1).toBe('string');
//         expect(typeof token2).toBe('string');
//         expect(token1).not.toEqual(token2);
//     });
// })