# financialPlanning-backend

Backend for a personal finance management system built with Node.js, Express, Prisma, and SQLite using a simplified Clean Architecture structure.

## Stack

- Node.js
- Express
- Prisma ORM
- SQLite
- JWT
- bcryptjs
- Zod
- dotenv
- Vitest + Supertest

## Structure

```text
src/
  domain/
  application/
  infrastructure/
  presentation/
  shared/
```

## Setup

```bash
npm install
npm run prisma:migrate -- --name init
npm run prisma:generate
npm run prisma:seed
npm run dev
```

API base URL: `http://localhost:3000/api`

Swagger UI: `http://localhost:3000/docs`

OpenAPI JSON: `http://localhost:3000/docs.json`

## Environment

```env
DATABASE_URL="file:./dev.db"
PORT=3000
JWT_SECRET="change-me-in-production"
```

## Main Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/health`
- `POST|GET|PATCH|DELETE /api/wallets`
- `POST|GET|PATCH|DELETE /api/categories`
- `POST|GET|PATCH|DELETE /api/transactions`
- `POST /api/transfers`
- `GET /api/reports/summary`
- `GET /api/reports/by-category`
- `GET /api/reports/by-period`

## API Documentation

The project exposes Swagger/OpenAPI documentation for all routes.

- Interactive UI: `GET /docs`
- Raw OpenAPI spec: `GET /docs.json`

Protected endpoints use Bearer JWT authentication. In Swagger UI, use the `Authorize` button and send the token as `Bearer <token>`.

## Scripts

- `npm run dev`
- `npm run start`
- `npm run prisma:migrate -- --name init`
- `npm run prisma:generate`
- `npm run prisma:seed`
- `npm run test`
