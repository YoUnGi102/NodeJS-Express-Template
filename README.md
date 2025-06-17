# 🧩 Node.js / Express / TypeScript Template

A fully featured, production-ready Node.js / Express.js boilerplate using TypeScript. Includes multi-session user authentication with JWT, PostgreSQL integration via TypeORM, and full test coverage with Vitest and Supertest.

---

## ✨ Features

- ✅ User registration (email, password, username)
- ✅ Login with access & refresh tokens
- ✅ Multiple session support via refresh tokens
- ✅ Logout invalidates the current session
- ✅ JWT authentication with token rotation
- ✅ Dependency injection with `tsyringe`
- ✅ Environment-based configuration
- ✅ Swagger API documentation
- ✅ ESLint + Prettier setup
- ✅ Unit & integration tests with Vitest + Supertest
- ✅ Centralized logging with Winston

---

## ⚙️ Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL + TypeORM
- **Auth**: JWT (access & refresh tokens)
- **Testing**: Vitest, Supertest
- **DI**: tsyringe
- **Docs**: Swagger
- **Logging**: Winston

---

## 📁 Project Structure

<details>
<summary>Click to view the structure</summary>

```ts
src/
├── config/
├── database/
├── logic/
│   ├── model/
│   └── shared/
├── app.ts
├── index.ts
test/
├── integration/
├── unit/
├── global-setup.ts
├── global-teardown.ts
├── setup-env.ts
```

</details>

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- Docker (optional)

---

### 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/YoUnGi102/NodeJS-Express-Template.git

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

Update `.env` with your database credentials and secrets.

---

## 📜 NPM Scripts

| Script                       | Description                                            |
| ---------------------------- | ------------------------------------------------------ |
| `npm run dev`                | Start development server with hot reload via `tsx`     |
| `npm run start`              | Start the production server using compiled JS          |
| `npm run build`              | Compile TypeScript using `tsup`                        |
| `npm run ci`                 | Clean install, format check, lint, and run unit tests  |
| `npm run test`               | Run both integration and unit tests                    |
| `npm run lint`               | Run biome linter on `src` and `test` directories       |
| `npm run format`             | Format all files with biome formatter                  |
| `npm run format:check`       | Check formatting without writing changes               |
| `npm run migration:generate` | Generate new TypeORM migration file                    |
| `npm run migration:run`      | Run pending database migrations                        |
| `npm run migration:revert`   | Revert the latest migration                            |

> Migrations require a build (`npm run build`) to ensure `dist/database/data-source.js` exists.

---

## 🛠️ Running the Project

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm run start
```

---

## 🔐 Authentication

- **Access Token**: Short-lived token for API requests
- **Refresh Token**: Long-lived token to issue new access tokens
- **Multi-Session**: Each device/browser maintains its own refresh session
- **Logout**: Removes the current session record and invalidates the token

Token secrets and expiration settings are configured via environment variables.

---

## 🔧 Logging

The project uses [Winston](https://github.com/winstonjs/winston) for structured, centralized logging.

- Defined in: `src/logic/shared/utils/logger.ts`
- Logs info, warnings, errors, and slow requests
- Configurable via: `SLOW_REQUEST_THRESHOLD_MS`

```ts
import logger from './logic/shared/utils/logger';

logger.info('Server started');
logger.error('Something went wrong');
```

Custom transports, formats, or levels can be configured in `logger.ts`.

---

## 📖 API Documentation

- Swagger UI available at:

  ```
  GET /docs
  ```

Documentation is auto-generated from request validation schemas using `swagger-jsdoc`.

---

## 📂 Environment Variables

`.env.example` provides a base for all environments:

```env
NODE_ENV=development
PORT=5000

FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:5000

JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

DB_HOST=localhost
DB_USER=postgres
DB_PASS=postgres
DB_NAME=user_register_db
DB_PORT=5432

SLOW_REQUEST_THRESHOLD_MS=1000

HIDE_API_ERRORS=false
HIDE_API_LOGS=false
```

Generate secure JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🧪 Testing

Tests are split into unit and integration categories using **Vitest** and **Supertest**.

```bash
# Run all tests
npm run test
```

Test utilities include `global-setup.ts`, `global-teardown.ts`, and custom test environment setup.

---

## 📌 Linting & Formatting

```bash
# Run Biome Linter
npm run lint

# Format code with Biome
npm run format
```

---

## 🧰 Tooling

- **TypeORM** – PostgreSQL ORM
- **tsyringe** – Dependency injection
- **Swagger** – API docs
- **Winston** – Logging
- **Biome** – Code quality
- **Tsup** – TypeScript build tool

---

## 🪪 License

[MIT](https://choosealicense.com/licenses/mit/).

---

## 🧩 TODO / Roadmap
- [ ] Add rate-limiting & security middleware
- [ ] Add role-based access control
- [ ] E2E Tests?

---

## 🗂 Credits

Maintained by **Tomáš Greš** ([@YoUnGi102](https://github.com/YoUnGi102)).
