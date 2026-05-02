# CLAUDE.md

## Build & Run Commands

- `npm run dev` — Start dev server with nodemon (port 8000)
- `npm run prod` — Start in production mode with nodemon
- `npm start` — Start production server (no nodemon)
- `npm run build:js` — Bundle frontend JS (esbuild, minified + sourcemap)
- `npm run watch:js` — Watch mode for frontend JS bundling
- No test framework configured

## Linting & Formatting

- ESLint: Airbnb + Prettier + Node plugin (flat config in `eslint.config.mjs`)
- Prettier: 80-char width, 4-space tabs, single quotes, semicolons required (`.prettierrc`)
- No npm lint/format scripts are configured; run ESLint/Prettier directly if needed

## Architecture

**Stack**: Node.js 20.x, Express 5.x, MongoDB/Mongoose 9.x, Pug (SSR), Stripe, esbuild

**Pattern**: MVC with factory-based CRUD handlers

```
server.js        → Entry point (DB connect, listen, graceful shutdown)
app.js           → Express app setup (middleware stack, route mounting)
controllers/     → Business logic (8 files including handlerFactory.js)
models/          → Mongoose schemas (Tour, User, Review, Booking)
routes/          → Express routers (nested: reviews under tours)
utils/           → AppError, catchAsync, APIFeatures, Email
views/           → Pug templates (base layout + pages + email templates)
public/          → Static assets (CSS, images, frontend JS)
```

## Key Patterns

- **Error handling**: Custom `AppError` class + `catchAsync` HOF wrapper + global `errorController`
- **CRUD factory**: `handlerFactory.js` exports `getAll`, `getOne`, `createOne`, `updateOne`, `deleteOne`
- **API features**: `APIFeatures` class for query filtering, sorting, pagination, field limiting
- **Auth**: JWT stored in cookies, `authController` handles login/signup/protect/restrictTo
- **File uploads**: Multer + Sharp for image processing
- **CommonJS**: All files use `require()`/`module.exports`/`exports.functionName`
- **Named exports**: Controllers use `exports.fnName = catchAsync(async (req, res, next) => {...})`

## Coding Conventions

- File naming: camelCase (e.g., `tourController.js`, `userModel.js`, `tourRoutes.js`)
- Function naming: camelCase (e.g., `getAllTours`, `createBookingCheckout`)
- API responses: `{ status: 'success', data: { doc } }` format
- Errors: `next(new AppError('message', statusCode))` inside catchAsync handlers
- Route mounting: `/api/v1/tours`, `/api/v1/users`, `/api/v1/reviews`, `/api/v1/bookings`

## Security Middleware Stack (app.js)

Helmet (CSP), CORS, rate limiting (100 req/hr), body parser (10kb limit),
cookie parser, mongo sanitize, XSS clean, HPP, compression

## Environment

Config via `config.env` (see `config.env.example` for core values): MongoDB URI,
JWT secret/expiry, email (Mailtrap dev / OAuth prod), and login lockout settings.
Code also expects `MAILTRAP_FROM`, `STRIPE_SECRET_KEY`, and
`STRIPE_WEBHOOK_SECRET`; keep these in local/hosting env only.

## Gotchas

- Keep `/webhook-checkout` in `app.js` before `express.json()` so Stripe can
  verify the raw request body.
- Express 5 makes `req.query` read-only; sanitizers in `app.js` intentionally
  sanitize body/headers rather than assigning to `req.query`.

## CI/CD

- Dependabot (`.github/dependabot.yml`) + auto-merge workflow (`.github/workflows/dependabot-automerge.yml`)
  - Auto-approves and squash-merges patch/minor dependency updates
- Deployed on Render.com
