# GearUp

GearUp is a professional backend API for a gear rental and marketplace application. It provides authenticated user flows, provider management, administrative operations, rental order processing, reviews, and Stripe-based payment handling.

## Project overview

The API is built with TypeScript and Express and uses Prisma as the ORM layer for PostgreSQL. It is designed to separate concerns across modules and enforce role-based access control for customers, providers, and admins.

Key capabilities:

- User authentication using JWT access tokens
- Provider gear creation and management
- Customer rental order creation and tracking
- Stripe checkout and webhook processing
- Admin dashboards for users, gear, and rentals
- Category management and review submission

## Architecture

The application follows a modular structure:

- `src/app.ts` configures middleware, CORS, JSON parsing, and routes
- `src/server.ts` connects to Prisma and starts the HTTP server
- `src/routes/index.ts` composes route modules under `/api`
- `src/middlewares` implements auth, error handling, and 404 responses
- `src/modules` contains feature modules for auth, gear, categories, rentals, payments, reviews, and admin operations
- `src/lib/prisma.ts` exposes the Prisma client instance
- `src/config/index.ts` loads configuration from environment variables

## Supported roles

- `ADMIN`: manage users, view gear and rental history, manage categories
- `PROVIDER`: create, update, and delete gear listings
- `CUSTOMER`: browse gear, create rentals, submit reviews, and complete payments

## Primary endpoints

- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — log in and receive a JWT token
- `GET /api/auth/me` — retrieve the current authenticated user
- `GET /api/gear` — list all gear items
- `GET /api/gear/:id` — get details for a single gear item
- `POST /api/provider/gear` — provider creates a gear item
- `PUT /api/provider/gear/:id` — provider updates a gear item
- `DELETE /api/provider/gear/:id` — provider removes a gear item
- `POST /api/rentals` — customer creates a rental order
- `GET /api/rentals/:id` — customer views a rental order
- `POST /api/payments/create` — create a Stripe checkout session
- `GET /api/payments` — retrieve payment history
- `GET /api/payments/:id` — retrieve a single payment record
- `POST /api/payments/webhook` — Stripe webhook endpoint
- `POST /api/categories` — admin creates a category
- `GET /api/categories` — list categories
- `GET /api/categories/:id` — get category details
- `DELETE /api/categories/:id` — admin deletes a category
- `POST /api/reviews` — customer submits a review
- `GET /api/admin/users` — admin lists users
- `PATCH /api/admin/users/:id` — admin updates a user
- `GET /api/admin/gear` — admin lists all gear
- `GET /api/admin/rentals` — admin lists rental records

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with the required values:
   - `PORT`
   - `DATABASE_URL`
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
   - `JWT_ACCESS_EXPIRES_IN`
   - `JWT_REFRESH_EXPIRES_IN`
   - `BCRYPT_SALT_ROUNDS`
   - `APP_URL`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PRODUCT_ID`
3. Run migrations, generate the Prisma client, and build the server:
   ```bash
   npm run build
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev`: start the server with `tsx` in watch mode
- `npm run build`: deploy Prisma migrations, generate client code, and compile the application
- `npm run start`: run the compiled production build
- `npm run seed`: execute the Prisma seed script

## Notes

- The API uses a raw Stripe webhook endpoint at `/api/payments/webhook` and expects the request body in raw JSON format.
- The server validates user roles and active status before allowing protected operations.
- `config.database_url` must point to a PostgreSQL instance and be available before startup.

## Tech stack

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Stripe
- JSON Web Tokens
- bcrypt
- CORS

