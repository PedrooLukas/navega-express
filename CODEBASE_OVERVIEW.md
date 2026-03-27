# Projeti Meta 2 - Codebase Overview and Technical Assessment

## 1) System overview

This project is a full-stack ticketing platform for river transport:
- `backend/`: Express + TypeScript + Prisma + PostgreSQL, JWT auth, role-based access, operator panel APIs, payment integration (Asaas).
- `frontend/`: Next.js App Router + TypeScript + Tailwind, public marketing pages, booking flow, authentication, and operator dashboard.

Main domain entities:
- `User` (ADMIN/OPERADOR/CLIENTE)
- `Passageiro`
- `Embarcacao`
- `Rota`
- `Embarque`
- `Passagem`

## 2) Current architecture notes

Strengths:
- Clear split between public customer APIs and authenticated operator APIs.
- Prisma schema is relatively clean for an MVP.
- RBAC middleware exists and is used in operator routes.
- Frontend has reusable UI primitives and role-protected operator layout.

High-impact issues:
- Two parallel payment stacks exist (`services/asaas.ts` and `services/asaasService.ts`) with overlapping responsibilities.
- Sensitive fallback API key is hardcoded in backend payment service.
- Frontend booking flow is still mostly mock/static and not fully connected to backend search/availability.
- Seat handling and payment status coupling are fragile (`assento` field is reused as external payment ID in some flows).
- No automated tests.

## 3) File-by-file map (relevant source files)

### Backend (`backend/src`)

| File | Purpose |
|---|---|
| `backend/src/index.ts` | App bootstrap: env loading, Express setup, CORS/JSON middleware, route mounting, health check, server start. |
| `backend/src/lib/prisma.ts` | Prisma singleton instance management. |
| `backend/src/middleware/auth.ts` | JWT auth middleware (`Bearer` token validation + active user lookup). |
| `backend/src/middleware/rbac.ts` | Role checks (`requireRole`, `requireMinRole`). |
| `backend/src/utils/jwt.ts` | JWT sign/verify helpers. |
| `backend/src/utils/password.ts` | Password hashing and comparison (`bcrypt`). |
| `backend/src/routes/auth.ts` | Auth/profile endpoints: register, login, me, update profile, change password. |
| `backend/src/routes/cliente.ts` | Customer endpoints: trip listing, trip details, route listing, purchase (real/simulated), payment status polling, ticket history, cancel ticket. |
| `backend/src/routes/operador.ts` | Operator/admin APIs: dashboard, CRUD-like listings/actions for embarques, passageiros, passagens, embarcacoes, rotas, and sales reports. |
| `backend/src/routes/payment.ts` | Alternate payment route namespace (`/api/payment`) with `purchase` and `status` endpoints via controller. |
| `backend/src/controllers/paymentController.ts` | Payment purchase/status flow using `asaasService`, local passageiro/passagem creation, and status update on confirmation. |
| `backend/src/services/asaas.ts` | Asaas integration implementation using `fetch` (Portuguese-named methods), used by `cliente` routes. |
| `backend/src/services/asaasService.ts` | Asaas integration implementation using `axios` (English-named methods), used by `paymentController`. |
| `backend/src/scripts/createAdmin.ts` | CLI helper to create admin user from environment variables. |

### Backend Prisma (`backend/prisma`)

| File | Purpose |
|---|---|
| `backend/prisma/schema.prisma` | Data model, enums, relations, indexes; Prisma Client generator config. |
| `backend/prisma/seed.ts` | Seed script creating default admin user. |
| `backend/prisma/seed-cliente.ts` | Seed script creating a default CLIENTE user. |
| `backend/prisma/seed-dados.ts` | Seed script for embarcacoes, rotas, embarques, and sample passageiro. |
| `backend/prisma/migrations/*/migration.sql` | DB migration history and schema evolution. |

### Frontend app routes (`frontend/src/app`)

| File | Purpose |
|---|---|
| `frontend/src/app/layout.tsx` | Root layout: fonts, global navbar/footer, auth provider wrapping app. |
| `frontend/src/app/globals.css` | Global styles, theme tokens, animations, scrollbar styling. |
| `frontend/src/app/page.tsx` | Home/landing page with hero, features, counters, partners slider. |
| `frontend/src/app/(auth)/login/page.tsx` | Login page entry (reuses shared auth form component). |
| `frontend/src/app/(auth)/register/page.tsx` | Register page entry (reuses shared auth form component). |
| `frontend/src/app/passagens/page.tsx` | Search form page (origin/destination/date) and navigation to results. |
| `frontend/src/app/passagens/results/page.tsx` | Search results page (currently mock trip list and mock auth check). |
| `frontend/src/app/passagens/booking/page.tsx` | Booking details page (currently mock trip data + passenger count). |
| `frontend/src/app/passagens/seats/page.tsx` | Seat map selection page (mock seat inventory/state). |
| `frontend/src/app/passagens/checkout/page.tsx` | Passenger information forms + total calculation and forward to payment. |
| `frontend/src/app/passagens/payment/page.tsx` | Payment page with PIX/card UI, simulated mode, backend purchase calls, status polling. |
| `frontend/src/app/passagens/bilhete/page.tsx` | Ticket confirmation view with QR code and print/share actions. |
| `frontend/src/app/contato/page.tsx` | Contact page UI with local-only form behavior. |
| `frontend/src/app/planos/page.tsx` | Plans/pricing page for operators/companies. |
| `frontend/src/app/operador/layout.tsx` | Operator protected shell (sidebar/nav/logout). |
| `frontend/src/app/operador/page.tsx` | Operator dashboard summary page (consumes backend metrics). |
| `frontend/src/app/operador/embarques/page.tsx` | Operator embarques listing/filtering/pagination UI. |
| `frontend/src/app/operador/passageiros/page.tsx` | Operator passageiros listing/search/pagination UI. |
| `frontend/src/app/operador/passagens/page.tsx` | Operator passagens listing/filtering/pagination UI. |
| `frontend/src/app/operador/rotas/page.tsx` | Operator rotas listing cards. |
| `frontend/src/app/operador/embarcacoes/page.tsx` | Operator embarcacoes listing cards. |
| `frontend/src/app/operador/relatorios/page.tsx` | Operator sales report page with date filters and breakdown. |

### Frontend components/context/lib

| File | Purpose |
|---|---|
| `frontend/src/contexts/AuthContext.tsx` | Client-side auth state, token/user persistence, login/register/logout helpers, role check helper. |
| `frontend/src/components/ProtectedRoute.tsx` | Client-side route guard by auth and role level. |
| `frontend/src/components/auth/RegisterLoginForm.tsx` | Shared animated login/register form used by auth pages. |
| `frontend/src/components/Navbar.tsx` | Top navigation, mobile sheet menu, language selector UI, auth actions and redirects. |
| `frontend/src/components/Footer.tsx` | Footer + newsletter UI block. |
| `frontend/src/components/Waves.tsx` | Decorative animated wave SVG. |
| `frontend/src/components/PartnersSlider.tsx` | Auto-scrolling partners strip (currently placeholder logos/text). |
| `frontend/src/components/CounterAnimation.tsx` | Number count-up animation when in viewport. |
| `frontend/src/components/Subscription.tsx` | Subscription/pricing component (not clearly wired into current pages). |
| `frontend/src/components/ui/Button.tsx` | Reusable button primitive with variants/sizes (CVA + Radix Slot). |
| `frontend/src/components/ui/Input.tsx` | Reusable input primitive. |
| `frontend/src/components/ui/Card.tsx` | Reusable card primitive and subcomponents. |
| `frontend/src/components/ui/Sheet.tsx` | Reusable slide-over/sheet component based on Radix Dialog. |
| `frontend/src/components/ui/Toast.tsx` | Imperative toast utility using DOM insertion. |
| `frontend/src/components/ui/index.ts` | Barrel export for UI primitives. |
| `frontend/src/lib/utils.ts` | Shared `cn` className utility (`clsx` + `tailwind-merge`). |

## 4) Improvement opportunities (prioritized)

### P0 - Security and correctness

1. Remove hardcoded secrets and debug leaks
- Remove fallback Asaas key in `backend/src/services/asaasService.ts`.
- Stop printing key fragments in `backend/src/index.ts`.
- Ensure `.env.example` is used with placeholders only.

2. Consolidate payment implementation
- Keep only one service layer (`asaasService` OR `asaas`) and one route style.
- Standardize response contracts and error mapping.

3. Fix seat/payment consistency model
- Do not use `assento` to store external payment id.
- Add explicit payment fields in `Passagem` (ex: `paymentProvider`, `paymentExternalId`, `paymentStatus`, `paymentExpiresAt`).
- Reserve seat with timeout OR confirm only after payment webhook.

4. Add server-side validation and safer parsing
- Validate body/query with schema validator (Zod or similar).
- Avoid raw `parseInt` without guard; return 400 on invalid IDs.

### P1 - Product behavior and API quality

5. Replace mock frontend data with real API usage
- `results`, `booking`, and `seats` should use real `embarque` data from backend.
- Remove hardcoded auth flag (`isLoggedIn = true`).

6. Implement payment webhook flow
- Add webhook endpoint from Asaas and make confirmation event-driven (polling can remain fallback).

7. Improve auth/session strategy
- Consider HttpOnly cookie-based tokens for better XSS resilience.
- If localStorage remains for MVP, add stricter CSP and sanitize risky HTML insertions.

8. Strengthen backend middleware stack
- Add `helmet`, request logging, and request rate limiting on auth/payment endpoints.
- Restrict CORS by environment.

### P2 - Maintainability and DX

9. Add tests
- Backend: unit tests for auth/payment services + integration tests for critical routes.
- Frontend: smoke tests for booking flow and operator pages.

10. Extract domain/service layers from routes
- Routes are currently heavy with business logic.
- Move logic to `services/use-cases` for better reuse and testability.

11. Standardize naming and encoding
- Keep one language for code identifiers and API fields (Portuguese or English, but consistent).
- Fix file encoding issues causing garbled accented characters.

## 5) MVP readiness snapshot

What is already close to MVP:
- Auth/register/login/me.
- Basic operator dashboard and list pages.
- Core entity model and CRUD-like endpoints.
- PIX purchase flow skeleton.

What blocks a reliable MVP launch:
- Real availability/search and booking flow still mostly mocked on frontend.
- Payment flow duplication and inconsistent state handling.
- Missing webhook-driven payment confirmation.
- Security hardening (secrets, CORS, rate-limit, validation).
- No tests for core flows.

## 6) Suggested MVP next steps (execution order)

1. Payment/domain cleanup sprint
- Unify payment service/routes.
- Add dedicated payment fields in DB and migration.
- Implement webhook + idempotent confirmation updates.

2. Frontend integration sprint
- Replace mock trip/seat/booking data with backend APIs.
- Wire real loading/error/empty states and remove simulation-only logic from primary flow.

3. Security and quality sprint
- Env cleanup, request validation, helmet/rate-limit/CORS policy.
- Add minimal test suite for auth + purchase + cancellation + operator dashboard metrics.

4. MVP hardening sprint
- Seed strategy and admin bootstrap docs.
- Add observability basics (structured logs, health/readiness details).
- Smoke test script for full booking journey.

## 7) Conclusion

The project has a solid foundation for an MVP, but it needs one focused stabilization pass around payment consistency, frontend real-data integration, and security baseline before production use.
