# 🛒 Tijara

Tijara is the backend of a fullstack e-commerce project, built with NestJS. It exposes both a REST API and a GraphQL API over the same modules.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat&logo=stripe&logoColor=white)

## 🧱 Stack

| Layer | Tech |
| --- | --- |
| 🚀 Framework | NestJS (Express) |
| 🗄️ Database | MongoDB (Mongoose) |
| ⚡ Cache | Redis |
| 🔗 API | REST + GraphQL (Apollo) |
| 🔐 Auth | JWT (access/refresh tokens), argon2 password hashing |
| 💳 Payments | Stripe |
| 📦 File storage | AWS S3 |
| ✉️ Email | Nodemailer |
| ✅ Validation | class-validator, Zod |

## ✨ Features

- 🔑 Auth — signup, login, email verification, password reset
- 🏷️ Product, category, and brand catalog
- 🛍️ Cart and wishlist
- 📦 Checkout and order management (Stripe integration)
- 🎟️ Coupons
- ⭐ Product reviews
- 👤 User accounts (profile, addresses, payment methods) and admin management

## ⚙️ Project setup

```bash
npm install
```

## ▶️ Running the project

```bash
# development
npm run start

# watch mode
npm run start:dev

# production
npm run start:prod
```

## 🧪 Tests

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## 📡 API

- REST endpoints are grouped by module under `src/modules/*`.
- GraphQL playground is available at `/graphql` (schema in `src/schema.gql`).
