# Copilot Instructions

## Build & Run Commands

- `npm run dev` - Start dev server with nodemon (port 8000)
- `npm run prod` - Start in production mode with nodemon
- `npm start` - Start production server (no nodemon)
- `npm run build:js` - Bundle frontend JS with esbuild, minified + sourcemap
- `npm run watch:js` - Watch mode for frontend JS bundling
- `npm test` is a placeholder that exits 1; no test framework is configured

## Linting & Formatting

- ESLint uses Airbnb + Prettier + Node plugin via flat config in
  `eslint.config.mjs`
- Prettier uses 80-char width, 4-space tabs, single quotes, semicolons, and
  `arrowParens: "always"` in `.prettierrc`
- No npm lint/format scripts are configured; run ESLint/Prettier directly if
  needed

## Architecture

**Stack**: Node.js 20.x, Express 5.x, MongoDB/Mongoose 9.x, Pug SSR, Stripe,
esbuild

**Pattern**: MVC with factory-based CRUD handlers.

```text
server.js        -> Entry point: env loading, MongoDB connection, listen
app.js           -> Express setup: middleware stack and route mounting
controllers/     -> Business logic, including handlerFactory.js CRUD helpers
models/          -> Mongoose schemas for Tour, User, Review, Booking
routes/          -> Express routers; reviews/bookings can nest under tours
utils/           -> AppError, catchAsync, APIFeatures, Email
views/           -> Pug templates for pages, partials, and emails
public/          -> Static CSS/images/frontend JS and esbuild output
```

## Key Patterns

- Application code uses CommonJS (`require`, `module.exports`,
  `exports.fnName`); `eslint.config.mjs` is the ESM exception.
- Async route handlers should use `catchAsync` and pass operational errors with
  `next(new AppError(message, statusCode))`.
- Reuse `controllers/handlerFactory.js` for standard CRUD (`getAll`, `getOne`,
  `createOne`, `updateOne`, `deleteOne`) before adding bespoke controller
  logic.
- API responses generally use `{ status: 'success', data: { doc } }`, with
  `results` for list endpoints.
- `utils/apiFeatures.js` provides chainable filtering, sorting, field limiting,
  and pagination for list endpoints.
- Auth stores JWTs in cookies and uses `protect` then `restrictTo(...)` for
  protected/role-limited routes.

## Coding Conventions

- Files and functions use camelCase, e.g. `tourController.js`,
  `getAllTours`, `createBookingCheckout`.
- Controllers use named exports: `exports.fnName = catchAsync(async (...) => {})`.
- Route mounting follows `/api/v1/tours`, `/api/v1/users`,
  `/api/v1/reviews`, and `/api/v1/bookings`.
- File upload/image processing uses Multer memory storage plus Sharp, following
  the existing tour/user controller patterns.

## Security Middleware Stack

`app.js` configures Helmet CSP, CORS, rate limiting, static assets, body parsers
with a 10kb limit, cookie parsing, NoSQL sanitization, XSS sanitization, HPP,
compression, and development-only Morgan logging.

## Environment

Config is loaded from `config.env`; use `config.env.example` for the core shape.
The code expects MongoDB, JWT, Mailtrap/Gmail OAuth, login lockout, and Stripe
values. Keep secrets out of source control. The example omits some code-required
values, including `MAILTRAP_FROM`, `STRIPE_SECRET_KEY`, and
`STRIPE_WEBHOOK_SECRET`.

## Gotchas

- Keep `/webhook-checkout` in `app.js` before `express.json()` so Stripe can
  verify the raw request body.
- Express 5 makes `req.query` read-only; sanitizers in `app.js` intentionally
  sanitize body/headers rather than assigning to `req.query`.
- `config.env` is local secret material; do not read, print, or commit it.

## CI/CD

- Dependabot checks npm dependencies weekly via `.github/dependabot.yml`.
- `.github/workflows/dependabot-automerge.yml` auto-approves and squash-merges
  Dependabot patch/minor updates.
- Deployment is documented as Render.com in `README.md`.
