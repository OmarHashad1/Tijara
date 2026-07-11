# Tijara — Frontend Build Specification

Build the customer storefront and admin dashboard for **Tijara**, a single-vendor
e-commerce platform. The backend (NestJS + MongoDB) already exists and is fully
implemented — this is a frontend-only build against a live REST + GraphQL API.

Follow `Design_Guide.md` (attached separately) for every color, type, spacing,
radius, and component token. Do not invent new visual tokens — extend the
existing commerce components documented there (`product-card`, `pdp-gallery-frame`,
`cart-drawer`, etc.) rather than styling ad hoc.

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS, tokens mapped from `Design_Guide.md` |
| Server state | TanStack Query |
| Client state | Zustand (cart UI state, filters, admin UI state) |
| HTTP client | Axios (`withCredentials: true` — see Auth below), one instance per API (REST + GraphQL) |
| Forms | React Hook Form + Zod |
| Animation | Motion (motion.dev) |
| Admin charts | Recharts |
| Toasts | Sonner (colored variants, `position="top-center"`) |
| Icons / images | lucide-react, `next/image` |

## 2. Backend & API

- **Base URL:** `http://localhost:3000` (dev)
- **Auth:** cookie-based, not bearer tokens. `POST /auth/login` sets `accessToken`
  and `refreshToken` as httpOnly cookies. Axios must be configured with
  `withCredentials: true` on every instance — there is no token to store in
  JS state. On a `401`, call `POST /auth/refresh-token` once, then retry the
  original request; on repeat failure, redirect to `/login`.
- **Categories are GraphQL, not REST.** Only one Category route exists in REST
  (`GET /categories/{id}/brands`). List/get/create/update/delete for categories
  go through `POST /graphql` (`categories`, `category`, `createCategory`,
  `updateCategory`, `deleteCategory`). Use a small `graphql-request` client
  alongside Axios rather than pulling in full Apollo Client for one resource.
- **File uploads** (brand logo, product images) are `multipart/form-data`, not
  JSON — build separate Axios calls for these two endpoints with `FormData`.
- **Payment:** `POST /orders` accepts `provider: stripe | cash_on_delivery`.
  The Stripe webhook (`POST /orders/webhook`) is server-to-server only — no
  frontend work needed for it beyond redirecting to Stripe Checkout / Elements
  if `provider: stripe` is chosen, and showing an order-pending state until
  status updates.
- **Roles:** `ROLE = user | admin`, returned on `GET /user/me`. Gate `/admin/*`
  routes client-side on this and expect the backend to also enforce it (403 on
  admin endpoints for non-admins).
- **Pagination:** list endpoints (`products`, `admin/users`, `admin/orders`,
  `admin/coupons`, `admin/reviews`, product reviews) take `page`/`size` query
  params — build one reusable pagination hook/component.

## 3. Storefront Pages (Customer-Facing)

| Route | Purpose | Key endpoints |
|---|---|---|
| `/` | Home — hero, featured/new products, category & brand rails | `GET /products`, `GET /brands` |
| `/products` | Catalog grid with filters (category, brand, price range, search) + pagination | `GET /products` |
| `/products/[slug]` | PDP — gallery, price (+ discount), stock state, add to cart/wishlist, reviews | `GET /products/{slug}`, `GET /products/{id}/reviews` |
| `/brands` | Brand directory | `GET /brands` |
| `/brands/[slug]` | Brand page — brand info + its products | `GET /brands/{slug}`, `GET /products?brandId=` |
| `/cart` | Full cart page (in addition to the `cart-drawer`) | `GET/POST/PATCH/DELETE /cart`, `/cart/items` |
| `/wishlist` | Saved items | `GET/POST/DELETE /wishlist` |
| `/checkout` | Address select, payment method (card via Stripe / cash on delivery), coupon code | `POST /orders`, `POST /coupons/validate`, `GET /user/me/addresses`, `GET /user/me/payment-methods` |
| `/orders` | Order history, filter by status | `GET /orders` |
| `/orders/[id]` | Order detail, cancel action, leave-a-review entry point | `GET /orders/{id}`, `PATCH /orders/{id}/cancel`, `POST /products/{productId}/reviews` |
| `/account` | Profile edit, change password, delete account | `GET/PATCH/DELETE /user/me`, `PATCH /user/me/password` |
| `/account/addresses` | Manage addresses | `GET/POST/PATCH/DELETE /user/me/addresses` |
| `/account/payment-methods` | Manage saved payment methods | `GET/POST/DELETE /user/me/payment-methods` |
| `/login`, `/signup` | Auth | `POST /auth/login`, `POST /auth/signup` |
| `/verify-email` | OTP entry after signup | `POST /auth/send-verify-email`, `POST /auth/check-verify-email` |
| `/forgot-password`, `/reset-password` | OTP-based reset flow | `POST /auth/send-forgot-password-otp`, `/verify-forgot-password-otp`, `PATCH /auth/reset-password` |

## 4. Admin Dashboard Pages

All under `/admin/*`, gated to `role: admin`.

| Route | Purpose | Key endpoints |
|---|---|---|
| `/admin` | Overview dashboard — Recharts visualizations (orders over time, order status breakdown, revenue trend, low-stock list) built client-side from list data | `GET /admin/orders`, `GET /admin/products` — **note:** there is no dedicated analytics/aggregation endpoint, so charts must aggregate paginated results client-side; flag this rather than inventing a stats endpoint |
| `/admin/products` | Product table — create/edit/delete, image upload (up to 10), stock adjustment | `GET/POST/PATCH/DELETE /admin/products`, `PATCH /admin/products/{id}/stock` |
| `/admin/brands` | Brand table — create/edit/delete, logo upload | `GET /brands`, `POST/PATCH/DELETE /admin/brands` |
| `/admin/categories` | Category tree — GraphQL CRUD | `POST /graphql` (`categories`/`createCategory`/etc.) |
| `/admin/coupons` | Coupon table — create/edit/delete, expiry/usage limit | `GET/POST/PATCH/DELETE /admin/coupons` |
| `/admin/orders` | Order table — filter by status/user, status update | `GET /admin/orders`, `GET /admin/orders/{id}`, `PATCH /admin/orders/{id}/status` |
| `/admin/users` | User table — search/filter by status & role, ban/unban, soft/hard delete, restore | `GET/DELETE /admin/users`, `PATCH /admin/users/{id}/ban|unban|restore`, `DELETE /admin/users/{id}/hard` |
| `/admin/reviews` | Review moderation — filter by product/user/rating, delete | `GET /admin/reviews`, `DELETE /admin/reviews/{id}` |

## 5. Known Gaps to Flag, Not Improvise

- **No product variants.** The `Product` schema has no size/color/variant
  concept — only `price`, `discountPercent`, `stock`, one `categoryId`, one
  `brandId`. Do **not** build a variant-swatch selector on the PDP unless
  variants are added to the backend later; show a single price/stock/add-to-cart
  block instead.
- **No analytics endpoint.** Admin dashboard charts must be derived from
  existing paginated list endpoints (orders, products) rather than a purpose-built
  stats API.
- **`address.id` and `payment-method.id` path params are raw strings**, not
  ObjectId-validated — don't assume a specific ID format when building routes.
- **Reviews require a completed order** (`orderId` is required on `CreateReviewDto`)
  — the "leave a review" action should be surfaced from the order detail page,
  not generically from the PDP.

## 6. Non-Goals for This Build

- No deployment/containerization config (handled separately).
- No implementation of the Stripe webhook handler (backend-owned).
- No multi-vendor features (single brand/store only).
