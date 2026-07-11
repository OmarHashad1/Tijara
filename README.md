# Tijara

Tijara is the backend of a fullstack e-commerce project, built with NestJS. It exposes both a REST API and a GraphQL API over the same modules.

## Stack

- **Framework:** NestJS (Express)
- **Database:** MongoDB (Mongoose)
- **Cache:** Redis
- **API:** REST + GraphQL (Apollo)
- **Auth:** JWT (access/refresh tokens), argon2 password hashing
- **Payments:** Stripe
- **File storage:** AWS S3
- **Email:** Nodemailer
- **Validation:** class-validator, Zod

## Features

- Auth (signup, login, email verification, password reset)
- Product, category, and brand catalog
- Cart and wishlist
- Checkout and order management (Stripe integration)
- Coupons
- Product reviews
- User accounts (profile, addresses, payment methods) and admin management

## Project setup

```bash
npm install
```

## Running the project

```bash
# development
npm run start

# watch mode
npm run start:dev

# production
npm run start:prod
```

## Tests

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## API

- REST endpoints are grouped by module under `src/modules/*`.
- GraphQL playground is available at `/graphql` (schema in `src/schema.gql`).
