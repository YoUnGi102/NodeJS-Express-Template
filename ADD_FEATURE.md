# 🛠️ Adding a New Feature

This guide outlines the step-by-step process for introducing a new feature into the codebase using a **Test-Driven Development (TDD)** approach. Follow this checklist to ensure consistency, scalability, and maintainability.

---

## 🌿 Step 00: Create a New Git Branch

Before making any changes:

```bash
git checkout -b feature/[feature-name]
```

Use clear and descriptive names.
**Example:** `feature/auth-register`

---

## 🧱 Step 0 (If Using ORM): Define ORM Entities

If your feature involves data persistence:

- Define new `@Entity()` classes in `src/database/entities/`
- Use appropriate decorators (`@Column`, `@ManyToOne`, etc.)
- Add entity relations, constraints, and indexes as needed

---

## 📁 Step 1: Create Feature Directory

Create a new folder under `src/logic/model`:

```bash
mkdir src/logic/model/[feature]
```

---

## 📏 Step 2: Define Validation Schema

- Create a Joi schema
- Create a `VALIDATOR` object with `body`, `params`, and/or `query`

**Naming Conventions**:

- Joi schema: `post[Feature][Action]`
- Validator object: `POST_[FEATURE]_[ACTION]`

📄 File: `src/logic/model/[feature]/[feature].schema.ts`

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

📄 File: `src/logic/model/[feature]/[feature].types.ts`

```ts
import '@goodrequest/joi-type-extract/index.d.ts';

export type AuthRegisterRequest = Joi.extractType<
  ReturnType<typeof postAuthRegister>
>;
```

---

## 🧾 Step 4: Define DTOs and Response Types

Also in `*.types.ts`, define:

- DTOs
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

Create interfaces for each layer:

```ts
// repository/[feature].repository.interface.ts
export interface IAuthRepository {
  create(auth: AuthRegisterRequest): Promise<AuthDTO>;
}

// service/[feature].service.interface.ts
export interface IAuthService {
  register(
    auth: AuthRegisterRequest,
    sessionInfo?: AuthSessionInfo,
  ): Promise<AuthResponse>;
}

// controller/[feature].controller.interface.ts
export interface IAuthController {
  register(req: Request, res: Response, next: NextFunction): Promise<void>;
}
```

---

## 🧩 Step 6: Register Interfaces in the DI Container

📄 Update `src/config/index.ts`:

```ts
export const INJECTION_TOKENS = {
  IAuthController: 'AuthController',
  IAuthService: 'IAuthService',
  IAuthRepository: 'IAuthRepository',
};
```

📄 Then, in `src/config/container.ts`:

```ts
container.register(INJECTION_TOKENS.IAuthController, {
  useClass: AuthController,
});
container.register(INJECTION_TOKENS.IAuthService, {
  useClass: AuthService,
});
container.register(INJECTION_TOKENS.IAuthRepository, {
  useClass: TypeormAuthRepository,
});
```

---

## ⚙️ Step 7: Implement Interfaces

Write code + unit and integration tests.

- 🧠 **Service = Business logic**
- 🗂️ **Repository = DB logic**
- 📡 **Controller = HTTP logic**

Examples:

- `auth.repository.ts` & `auth.repository.unit.test.ts`
- `auth.service.ts` & `auth.service.unit.test.ts`
- `auth.controller.ts` & `auth.int.test.ts`

(See earlier content for example implementations.)

---

## 🌐 Step 8: Define Routes

📄 File: `src/routes/[feature].routes.ts`

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

📄 File: `src/app.ts`

```ts
const registerRoutes = async (): Promise<Router> => {
  const router = Router();

  const auth = (await import('@model/auth/auth.routes')).default;
  router.use('/auth', auth);

  return router;
};
```

---

## ✅ Step 10: Validate Commits

Before pushing your code, run:

```bash
npm run commit:check
```

- This ensures your commits follow the conventional format and pass all hooks:
  - npm run format
  - npm run lint
  - npm run test
  - npm run build

---

## 🚀 Step 11: Push and Open a Pull Request

Push your feature branch:

```bash
git add .
git commit -m "Descriptive commit message"
git push origin feature/[feature-name]
```

Then:

1. Open your Git platform (e.g., GitHub/GitLab)
2. Create a **Pull Request (PR)** to `main`
3. Fill out the PR template (if available)
4. Request code review

---

## 🏁 Done!

Your feature is now:

- ✅ Fully implemented
- ✅ Tested
- ✅ Integrated into architecture
- ✅ Ready for code review and deployment

---
