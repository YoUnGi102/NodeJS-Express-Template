# 🛠️ Adding a New Feature

This guide outlines the step-by-step process for introducing a new feature into the codebase using a **Test-Driven Development (TDD)** approach. Follow this checklist to ensure consistency, scalability, and maintainability.

---

## 🧱 Step 0 (If Using ORM): Define ORM Entities

If your feature involves data persistence:

- Define new `@Entity()` classes in `src/database/entities/`.
- Use appropriate decorators (`@Column`, `@ManyToOne`, etc.).
- Add entity relations, constraints, and indexes as needed.

---

## 📁 Step 1: Create Feature Directory

Create a new folder under `src/logic/model`:

```bash
mkdir src/logic/model/[feature]
```

---

## 📏 Step 2: Define Validation Schema

- Create a Joi schema.
- Create a `VALIDATOR` object with `body`, `params`, and/or `query` (depending on what part of the request you want to validate).

**Naming Conventions**:

- Validation schema: `[requestType][Feature][Action]`, e.g. `postAuthRegister`
- Validator object: `[REQUEST_TYPE]_[FEATURE]_[ACTION]`

📄 Example: `src/logic/model/[feature]/[feature].schema.ts`

```ts
export const postAuthRegister = () =>
  Joi.object({
    username: Joi.string()
      .min(JOI_CONFIG.USER.MIN_USERNAME_LENGTH)
      .max(50)
      .required(),
    password: Joi.string()
      .min(JOI_CONFIG.USER.MIN_PASSWORD_LENGTH)
      .max(50)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$'))
      .required()
      .messages({
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    email: Joi.string().email().required(),
  }).options(JOI_CONFIG.DEFAULT_OPTIONS);

const POST_AUTH_REGISTER: SchemaMap = {
  body: postAuthRegister(),
};

export default { POST_AUTH_REGISTER };
```

---

## 🧠 Step 3: Infer Types from Joi Schema

Use `JoiExtract` to derive request types.

📄 Add inferred types to `src/logic/model/[feature]/[feature].types.ts`

```ts
import '@goodrequest/joi-type-extract/index.d.ts';

export type AuthRegisterRequest = Joi.extractType<
  ReturnType<typeof postAuthRegister>
>;
```

---

## 🧾 Step 4: Define DTOs and Response Types

Inside `src/logic/model/[feature]/[feature].types.ts`, define:

- DTOs (Data Transfer Objects)
- Response types
- Utility types

```ts
export interface AuthDTO {
  id: number;
  username: string;
  email: string;
  password?: string;
  uuid: string;
  createdAt: Date;
}

export type AuthUserResponse = Pick<
  AuthDTO,
  'username' | 'email' | 'createdAt' | 'uuid'
>;

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: AuthUserResponse;
}
```

---

## 🔌 Step 5: Define Interfaces

Create interface files in the feature directory:

- `repository/[feature].repository.interface.ts`
- `service/[feature].service.interface.ts`
- `controller/[feature].controller.interface.ts`

Example:

```ts
// repository
export interface IAuthRepository {
  create(auth: AuthRegisterRequest): Promise<AuthDTO>;
}

// service
export interface IAuthService {
  register(
    auth: AuthRegisterRequest,
    sessionInfo?: AuthSessionInfo,
  ): Promise<AuthResponse>;
}

// controller
export interface IAuthController {
  register(req: Request, res: Response, next: NextFunction): Promise<void>;
}
```

---

## 🧩 Step 6: Register Interfaces in the DI Container

Add the interfaces to `src/config/index.ts` under `INJECTION_TOKENS`:

```ts
export const INJECTION_TOKENS = {
  IAuthController: 'AuthController',
  IAuthService: 'IAuthService',
  IAuthRepository: 'IAuthRepository',
};
```

Then, register the dependencies in `src/config/container.ts`:

```ts
container.register(INJECTION_TOKENS.IAuthController, {
  useClass: AuthController,
});
container.register(INJECTION_TOKENS.IAuthService, { useClass: AuthService });
container.register(INJECTION_TOKENS.IAuthRepository, {
  useClass: TypeormAuthRepository,
});
```

Use `tsyringe` for dependency injection.

---

## ⚙️ Step 7: Implement Interfaces

Write unit tests and integration tests alongside implementations.

### 💡 Architecture Rules:

- **Controllers**: Should only:

  - Forward request data to services
  - Send status and response
  - Pass errors to the error middleware

- **Repositories**: Should only:

  - Perform DB queries (create, find, update, delete)
  - Map entities to DTOs

- **Services**: Contain all business logic

### 📦 Repository

- `auth.repository.unit.test.ts`
- `auth.repository.ts`

```ts
@injectable()
export class TypeormAuthRepository implements IAuthRepository {
  private userRepo;

  constructor(@inject(DataSource) private dataSource: DataSource) {
    this.userRepo = dataSource.getRepository(User);
  }

  async create(auth: AuthRegisterRequest): Promise<AuthDTO> {
    const user = this.userRepo.create({
      username: auth.username,
      email: auth.email,
      password: auth.password,
    });
    const userCreated = await this.userRepo.save(user);
    return toAuthDTO(userCreated);
  }
}
```

### 🔧 Service

- `auth.service.unit.test.ts`

```typescript
let authService: IAuthService;
let app: Express;

beforeAll(async () => {
  app = await setupApp();
  authService = container.resolve<IAuthService>(INJECTION_TOKENS.IAuthService);
});

afterAll(async () => {});

describe('IAuthService', () => {

  describe('register', () => {
    it('should create a user if request is valid', async ()=>{
      // Arrange
      const userRequest = createTestUserRequest();

      // Act
      const authResponse: AuthResponse = await authService.register(userRequest);

      // Assert
      expect(authResponse).toBeDefined();
      expect(authResponse.user).toBeDefined();
      expect(authResponse.user.username).toEqual(userRequest.username);

    })
  })
}
```

- `auth.service.ts`

```ts
@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(INJECTION_TOKENS.IAuthRepository)
    private authRepo: IAuthRepository,
  ) {}

  async register(
    request: AuthRegisterRequest,
    sessionInfo: AuthSessionInfo = {},
  ): Promise<AuthResponse> {
    const userExists = await this.authRepo.findByUsernameOrEmail(
      request.username,
      request.email,
    );

    if (userExists?.username === request.username) {
      throw ERRORS.AUTH.USERNAME_EXISTS();
    } else if (userExists?.email === request.email) {
      throw ERRORS.AUTH.EMAIL_EXISTS();
    }

    const hashedPassword = await hashUtils.hash(request.password, 10);
    const user = await this.authRepo.create({
      ...request,
      password: hashedPassword,
    });

    if (!user) {
      throw ERRORS.AUTH.REGISTRATION_FAILED();
    }

    const token = authTokenUtils.signAccessToken(
      user.username,
      user.uuid,
      user.email,
    );

    const { refreshToken } = await this.sessionService.createSession(
      user.uuid,
      sessionInfo.ipAddress,
      sessionInfo.userAgent,
    );

    return toAuthResponse(token, refreshToken, user);
  }
}
```

### 🎮 Controller

- `auth.int.test.ts`
- `auth.controller.ts`

```ts
@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(INJECTION_TOKENS.IAuthService) private authService: IAuthService,
  ) {}

  async register(
    req: Request,
    res: Response<AuthResponse>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = req.body as AuthRegisterRequest;
      const sessionInfo: AuthSessionInfo = this.getSessionInfo(req);
      const auth = await this.authService.register(authRequest, sessionInfo);
      res.status(201).json(auth);
    } catch (err) {
      next(err);
    }
  }
}
```

---

## 🌐 Step 8: Define Routes

Create a routes file:
📄 `src/routes/[feature].routes.ts`

Configure:

- Middleware (validation, logging, auth)
- Controller binding

```ts
const rawController = container.resolve<IAuthController>(
  INJECTION_TOKENS.IAuthController,
);
const authController = bindAll(rawController);
const router = Router();

router.post(
  '/register',
  validate(VALIDATOR.POST_AUTH_REGISTER),
  loggingMiddleware,
  authController.register,
);

export default router;
```

---

## 🚦 Step 9: Register Routes in `app.ts`

Import and mount routes in the router:

📄 `src/app.ts`

```ts
const registerRoutes = async (): Promise<Router> => {
  const router = Router();

  // Lazy-load routes
  const auth = (await import('@model/auth/auth.routes')).default;
  router.use('/auth', auth);

  return router;
};
```

---

## ✅ Done!

Your feature should now be **fully implemented, tested, and integrated** according to project architecture.

---
