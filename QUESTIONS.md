# QUESTIONS.md

This file contains architecture/refactoring/technical questions found during a full review of the repository.
Please answer each question directly under it (or annotate inline with `ANSWER:`), so we can execute improvements in the next pass.

## 1) Product Scope and Business Rules

1. Is the official product name `Navega Afua`, `Navega Express`, or `Projeti`? Which one should be canonical across backend API responses, frontend copy, and branding assets?
2. Should this system support only the Afua <-> Macapa route for now, or is multi-route/multi-city operation already required in MVP?
3. Are boats (`navio`) and launches (`lancha`) truly different business models, or just different `Embarcacao` types sharing the same booking rules?
4. Is seat assignment mandatory for all vessels, or only for launch/poltrona trips?
5. Are discounts by age (0-5 free, 6-10 discounted, 60+ discounted) official rules, and if yes, what exact percentage should apply for each bracket?
6. Should `PcD` receive a discount, full fare, quota control, or operator-side manual approval?
7. Is there any legal/operational limit for free/discounted tickets per trip that must be enforced server-side?
8. Can one purchase create multiple tickets at once, or is MVP explicitly one ticket per purchase request?
9. Should ticket cancellation trigger automatic financial refund flow, or only status change + seat release?
10. What is the cancellation cutoff (hours before departure), and does it differ by payment method?
11. Should operator users see all company data or only data for their own company/fleet?
12. Is multi-tenant support (multiple companies/operators isolated by tenant ID) already in scope?

## 2) Architecture and Code Organization

13. Do you want to keep route handlers with business logic (current style), or move to service/use-case layers before feature expansion?
14. Should we keep both payment entry points (`/api/cliente/*` and `/api/payment/*`) or consolidate into one canonical payment API?
15. Should identifier naming stay in Portuguese (current domain names) or migrate to English for consistency with technical conventions?
16. Are there planned domain modules (auth, booking, payment, reporting) that should become explicit folder boundaries now?
17. Is there a target API versioning strategy (`/api/v1`) we should introduce before frontend integration grows?
18. Should we adopt request/response schema contracts (e.g., Zod/OpenAPI) as a mandatory layer?

## 3) Backend Bootstrapping, Middleware, and Security Baseline

19. Why does `backend/src/index.ts` load `.env` twice (`import 'dotenv/config'` plus two `dotenv.config` calls)? Can we simplify this to one pattern?
20. Is logging part of the Asaas key prefix in `backend/src/index.ts` intentional for debugging, or should all secret-derived logs be removed now?
21. Should CORS in `backend/src/index.ts` stay fully open (`app.use(cors())`) for all environments, or be restricted by allowlist?
22. Do you want centralized error middleware in Express instead of repeating try/catch in every route?
23. Should we add security middleware (`helmet`, rate limiting, body-size limits) before launch?
24. Do you require structured logs (JSON with request IDs) for production observability?

## 4) Authentication and Session Model

25. `Session` table exists in Prisma but JWT auth currently ignores it; should sessions be persisted/revocable or is stateless JWT intended?
26. Do you need logout invalidation (token blocklist/session revoke), or is client-only token deletion acceptable?
27. Should JWT include token version / session ID to support invalidation on password change?
28. Must `auth/register` validate email format and normalize case server-side before user creation?
29. Should duplicate emails be prevented case-insensitively (`User@x.com` vs `user@x.com`)?
30. Is password policy only minimum 6 chars, or do you want stronger complexity requirements?
31. Should `auth/profile` allow partial update only when values are provided, instead of potentially writing `undefined`?
32. Should login include brute-force protection / lockout / delay after repeated failures?
33. Should auth tokens move to HttpOnly cookies instead of localStorage for XSS resilience?
34. Is there a requirement for refresh tokens / short-lived access tokens?

## 5) Backend Payment Layer and Financial Integrity

35. `backend/src/services/asaasService.ts` contains a hardcoded fallback API key; can we remove it immediately and fail fast when env is missing?
36. Do you want to keep both `asaas.ts` (fetch, PT-BR methods) and `asaasService.ts` (axios, EN methods), or unify into one service?
37. Is payment status polling the intended final flow, or should webhook confirmation be the canonical source of truth?
38. Should seat inventory be decremented before payment confirmation (current behavior), or only after confirmed payment?
39. If payment expires/fails, should seat inventory be automatically restored by job/webhook?
40. `Passagem.assento` is being reused to store external payment ID; should we add dedicated payment columns instead?
41. Can one Asaas payment map to multiple tickets, or must every ticket have exactly one external payment ID?
42. Is idempotency required for purchase endpoint retries to avoid duplicated charges/tickets?
43. Should purchase endpoints validate CPF consistency with logged-in user identity, or allow buying for any passenger CPF?
44. When customer already exists in Asaas, should we search-by-CPF before creating new customer in `paymentController` (currently helper exists but not used)?
45. Is `billingType` allowed to include card now, or only `PIX` and `BOLETO` in MVP?
46. Should the frontend still mention `Mercado Pago` while backend uses Asaas, or is this copy outdated?
47. Do you need antifraud metadata, payment attempt audit trail, and reconciliation reports from day one?
48. Should simulated purchase endpoint (`/api/cliente/comprar-simulado`) be disabled outside development?
49. Should payment endpoints return normalized statuses (internal enum) instead of provider-native strings?
50. Do you need signed webhook verification from Asaas for security?

## 6) Backend Customer Routes (`backend/src/routes/cliente.ts`)

51. Should `/viagens` filter by both `now` and selected `data`, or does selected date intentionally override current-time filter?
52. Should invalid `data` query values return `400` instead of silently producing invalid Date behavior?
53. Should `/viagens/:id` validate numeric ID and return `400` when parse fails (instead of relying on Prisma errors)?
54. In `/comprar`, CPF is stored unnormalized in some paths and normalized in others; should CPF normalization be mandatory and consistent?
55. Should customer purchase support multiple passengers in one request instead of single `passageiro` object?
56. For `/pagamento/:paymentId/status`, should confirming payment also validate ownership (`userId`) before returning status?
57. In `/minhas-passagens`, do you want pagination/filtering, or is full list acceptable for expected volume?
58. For cancel route, should cancellation of `PENDENTE` payment tickets also cancel provider charge when possible?
59. Should cancel route block cancellation if departure is near (e.g., less than X hours) rather than only `date < now`?
60. Do you want ticket status enum values in DB instead of free text (`String`) for stronger integrity?

## 7) Backend Operator Routes (`backend/src/routes/operador.ts`)

61. Should all operator mutation routes (`POST/PUT`) have field-level validation and business constraints server-side?
62. Should operators be allowed to create/update trips with arbitrary `assentosDisp`, including values above vessel capacity?
63. Should creating a `Passagem` from operator route require `userId` for audit attribution?
64. Should operator-created tickets default to `CONFIRMADA` without payment workflow, or must they follow payment confirmation too?
65. Do you need soft-delete/inactivation for `rota` and `embarcacao` instead of only create/list?
66. Should report endpoint support timezone-aware date windows (currently raw `new Date(query)`) for business-day accuracy?
67. Do you need CSV/Excel export endpoints for reports now?
68. Should operator dashboard metrics be scoped by role/company, not global counts?
69. Is `requireMinRole('OPERADOR')` enough, or should some actions be `ADMIN`-only?
70. Should operator routes implement optimistic locking/version checks for concurrent updates?

## 8) Prisma Schema, Migrations, and Seed Data

71. Should `status` fields (`Embarque.status`, `Passagem.status`) be converted from `String` to Prisma enums for safety?
72. Should `formaPagamento` also be enum-constrained (`PIX`, `BOLETO`, etc.)?
73. Do we need unique constraints to prevent duplicate logical tickets (same passenger + same trip + same seat)?
74. Should `Passagem` include explicit seat type/number separate from payment fields?
75. Should `User.asaasId` be unique to prevent accidental duplicate linkage?
76. Do you want DB-level check constraints for non-negative `assentosDisp` and `preco`?
77. `seed.ts` and `seed-cliente.ts` use hardcoded credentials; should seed credentials come only from env?
78. `seed-dados.ts` uses `create` for embarques (not upsert), which can duplicate data; should reseeding be idempotent?
79. Should seed scripts be consolidated into one deterministic seed command?
80. Should migrations include backfill scripts for future payment field migration (if we split payment/seat data)?

## 9) Frontend Auth and Global App Behavior

81. Should frontend auth continue using localStorage token, or migrate to cookie session strategy?
82. In `AuthContext`, should token validation run on every tab focus / interval to reduce stale sessions?
83. `AuthContext` effect currently ignores `validateToken` dependency (lint warning); do you want hook-stable refactor now?
84. Should `logout()` always route to home, or preserve intended post-logout destination?
85. `Navbar` currently redirects authenticated operator/admin users to `/operador` from any public page; is forced redirect desired UX?
86. Should public users with operator role still be able to browse marketing pages without redirect?
87. Is the language selector in `Navbar` supposed to actually localize content, or is it placeholder only?
88. Should footer newsletter be wired to backend, or removed until integrated?
89. `layout.tsx` uses `dangerouslySetInnerHTML` for scroll restoration; should we replace this with safer Next-native behavior?

## 10) Frontend Booking Flow Consistency (Passagens)

90. Should booking flow use real API data now, or remain mocked until backend v2 is ready?
91. `results/page.tsx` hardcodes `isLoggedIn = true`; should it consume `useAuth()` immediately?
92. `results/page.tsx` currently uses static trips independent of query date; should results strictly reflect backend `/api/cliente/viagens`?
93. `booking/page.tsx` overwrites selected `viagemId` by hardcoding `viagem.id = 1`; is this a known bug to fix?
94. `booking/page.tsx` contains unused state (`tipoAcomodacao`); should accommodation become user-selectable and persisted?
95. Should `seats/page.tsx` use backend seat map/availability instead of static occupied seat array?
96. Are there truly 300 seats in the launch layout, or should seat grid be vessel-specific from backend data?
97. `checkout/page.tsx` currently sends only first passenger to payment; should all passengers be sent and persisted?
98. Discount calculation in checkout gives 70% off for age 60+ (`*0.3`) while copy says 50%; which rule is correct?
99. Should checkout prevent duplicate CPF across passengers in same booking?
100. Should CPF/phone/email formatting and validation be centralized/shared utility instead of duplicated page logic?
101. `payment/page.tsx` falls back to fake CPF/email/phone when missing; should purchase be blocked instead of auto-filling fake values?
102. `payment/page.tsx` references hardcoded travel date/time/boat text; should these always come from selected trip API payload?
103. Payment page allows card flow entirely client-side with no backend charge creation; should card option be hidden until implemented?
104. Should we keep both simulated and real purchase CTAs in production UI?
105. Payment polling runs every 5s without timeout/backoff; should there be max attempts and user-facing expiration handling?
106. When payment confirms, should we fetch final ticket data from backend instead of passing query params through URL?
107. `bilhete/page.tsx` displays fixed price `R$ 50.00` despite computed `valor`; should this be dynamic from confirmed purchase?
108. Should ticket QR payload be signed/verified server-side to prevent forged client-generated tickets?
109. Should ticket share/download include secure tokenized URL instead of exposing raw query params?

## 11) Frontend Operator Pages

110. Should operator list pages support server-side sorting/filtering for all relevant fields (not only status/search)?
111. Several operator pages have `useEffect` missing function deps (lint warnings); should we standardize with `useCallback` or query library?
112. Do you want retry/error states beyond console logging in operator dashboards/lists?
113. Should "Novo Embarque", "Nova Passagem", "Novo Passageiro" buttons already open forms/modals, or remain placeholders?
114. Should operator dashboard and lists auto-refresh (polling/websocket), or manual refresh only?
115. Should operator pages be moved to Server Components + API proxy for better security and SSR?

## 12) UI Components and Accessibility

116. `showToast` uses `innerHTML`; should we replace this with React component-based toasts to avoid XSS risk from dynamic messages?
117. Should we enforce accessible labeling and ARIA for all custom controls (seat buttons, icon-only actions, dropdowns)?
118. `PartnersSlider` uses emoji placeholders; should this be replaced with real partner logos/assets now?
119. Do you want to keep large global gradients/animations on all pages, or reduce motion for performance/accessibility preferences?
120. Should we add `prefers-reduced-motion` handling for wave/counter/slider animations?

## 13) Build, Quality Gates, and Tooling

121. Backend `npm run build` fails on `src/utils/jwt.ts` typing; should this be treated as release-blocking and fixed before any refactor?
122. Should lint warnings (currently 30 in frontend) be escalated to CI-failing errors?
123. Do you want Prettier + lint-staged + commit hooks to enforce consistency?
124. Should we add automated tests now for auth, purchase, cancellation, and operator dashboard endpoints before new feature work?
125. Is there any required minimum coverage target for backend/frontend tests?
126. Should we adopt e2e tests (Playwright/Cypress) for full booking journey, including simulated payment flow?

## 14) Deployment, Environments, and Ops

127. Should `.env.example` be added/updated with every required variable for backend and frontend?
128. Do you already have separate env values for local/staging/prod, including distinct Asaas credentials and callback URLs?
129. Should we introduce health/readiness checks that validate DB connectivity and external provider reachability?
130. Do you need containerization (Dockerfile + compose) for reproducible local and deployment setup?
131. Should production build include migration + seed strategy, or seed only in local/dev?
132. Is there an expected observability stack (Sentry, OpenTelemetry, log aggregation) we should wire during hardening?

## 15) Data Privacy and Compliance

133. Are there LGPD requirements for storing CPF, phone, and passenger personal data (retention period, masking, consent logs)?
134. Should CPF be masked in operator list endpoints/UI by default except for privileged roles?
135. Do you need audit logs for sensitive actions (status changes, cancellations, user updates, refunds)?
136. Should backups and recovery procedures be documented now due to financial/identity data criticality?

---

If you answer these questions, I can turn each confirmed decision into a prioritized implementation plan and then apply the changes directly in code.
