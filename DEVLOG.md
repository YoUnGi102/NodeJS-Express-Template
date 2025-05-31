# What I've Learned – Node.js & TypeScript

This document tracks key things I've learned while building this project, focusing on Node.js, TypeScript, backend architecture, and best practices.

---

## 🛠️ Project Setup

- How to use **tsconfig.json** to control compilation.
- How to structure a modular project using `src/logic`, `src/config`, and `interfaces`.
- Use of **`tsyringe`** for dependency injection to decouple logic.
- Using **environment variables** and `dotenv` for config separation.

---

## 🔐 Authentication

- Built a secure authentication flow with:
  - Hashed passwords using `bcrypt` (with a SHA-256 pre-hash for long tokens),
  - JWT-based access tokens,
  - Refresh token sessions stored in DB and rotated on use.

---

## 🧰 Middleware

- Implemented middleware for:
  - Input validation with **Joi**,
  - Logging and structured error handling,
  - Authentication via access tokens using Express middleware.

---

## 📦 Validation with Joi

- Created schemas using Joi and extracted request types from them using `joi-type-extract`.
- Centralized validation logic and reused it across routes.

---

## 🧪 Testing & Debugging

- Used Jest and Supertest for Integration and Unit tests
- Logged requests using a custom middleware.

---

## 📚 TypeScript Concepts Reinforced

- Interfaces vs types in modeling request/response DTOs.

---

## 📘 Swagger/OpenAPI

- Integrated `swagger-jsdoc` and `swagger-ui-express`.
- Learned how to:
  - Annotate routes with OpenAPI specs.
  - Auto-generate docs and serve them with Express.

---

## 🧼 Clean Code & Reusability

- Used DI to inject services.
- Split code into layers:
  - Controller
  - Service
  - Repository
- Followed **Separation of Concerns** and **Single Responsibility Principle**.

---

## 🚀 Future Learning Goals

- Add role-based access control (RBAC).
- Explore caching with Redis for session tokens.
- Dockerize the app for deployment.
