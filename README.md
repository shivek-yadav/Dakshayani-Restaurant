# Dakshayani Restaurant — Premium MERN / MVC Edition

A maintainable full-stack restaurant platform and client-presentation concept built from the supplied Dakshayani plan. **This version replaces the old monolithic structure** with independent domain models, thin Express routers, controllers, services, middlewares, feature-scoped React screens, and layered CSS.

> The files are source code, **not a deployed website**. The presentation preview is an interactive **simulation**, while actual accounts, orders, reservations and admin changes run through Express + MongoDB. Payment-gateway support is intentionally deferred in accordance with the project brief.

## What the client sees

- Premium Indian dining visual identity: editorial photography, burgundy / antique gold / warm cream palette, polished typography, mobile-first experiences.
- A refreshed homepage with **date / time / guest quick-reservation widget**, visual storytelling, signature-dish cards, gallery, FAQ, testimonials and compelling calls to action.
- Full public website: **Home, Our Story, Menu, Gallery, Contact, Reserve a Table**.
- Customers: account creation, login, password reset, saved cart, authenticated checkout, order history, booking history and cancellation.
- Admin: **completely separate sidebar / topbar**, menu and categories CRUD, ImageKit uploads, orders, reservations, customers, inquiries, CMS content, image gallery, testimonials, FAQs, settings, reports and activity logs.

## Two ways to present

### A. Instant client-facing presentation (zero setup)

Open **`client-preview/index.html`** in Chrome, Edge or Firefox. This is a stylish standalone sales/demo screen. It includes interactive dish filters, search, sample cart and reservation-dialog demonstrations. It does **not** connect to MongoDB or send real requests. Requires the internet for Google Fonts and sample Unsplash photography; screenshots/images are placeholders for client-approved assets.

### B. Full MERN application (actual persistent data)

Prerequisites: **Node.js 20.19+**, npm, and MongoDB locally or MongoDB Atlas.

1. Extract the ZIP and open its root in VS Code.
2. Copy `server/.env.example` to `server/.env` and provide a valid **MONGO_URI**, long **JWT_SECRET**, secure **ADMIN_EMAIL** and **ADMIN_PASSWORD**. Replace the example secrets; do not commit `.env`.
3. Optionally copy `client/.env.example` to `client/.env` for local API URL. Default proxy also works with no client `.env`.
4. Start a local MongoDB instance, or use the bundled Docker Compose configuration.
5. Install and start:

```bash
npm install
npm run seed
npm run dev
```

Windows PowerShell copies:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

If using Docker Desktop for MongoDB:

```bash
docker compose up -d
```

| Link | Address |
|---|---|
| Public website | http://localhost:5173 |
| Customer login | http://localhost:5173/login |
| Admin login | http://localhost:5173/admin/login |
| Backend health | http://localhost:5000/api/v1/health |

**Admin login:** use the values you set as `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env`, followed by `npm run seed`. **Development demo customer:** `guest@dakshayani.local` / `DemoGuest123!` after seeding. Demo user is not created for `NODE_ENV=production`.

**Remember:** if an admin account already exists, re-running the seed does not reset its password. Sample restaurant name, phone, location, dishes, testimonials and imagery must be replaced for a paying client.

## Project architecture

```text
Dakshayani_Premium_MERN_MVC/
├── client-preview/                 # Instant concept preview: HTML + CSS + demo-only JS
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── README.md
├── client/                         # Real React + Vite application
│   ├── src/
│   │   ├── app/App.jsx             # Route registry + layout boundaries
│   │   ├── features/
│   │   │   ├── public/pages/       # Home, About, Menu, Gallery, Contact, Booking
│   │   │   ├── public/components/  # QuickReservation
│   │   │   ├── auth/pages/         # Login, Register, Forgot / Reset Password
│   │   │   ├── auth/components/    # Shared authentication UI
│   │   │   ├── customer/pages/     # Cart, Checkout, Profile, History
│   │   │   └── admin/
│   │   │       ├── pages/          # One module per admin screen
│   │   │       └── components/     # Reusable tables, forms and modal
│   │   ├── components/            # Shared public navigation and UI
│   │   ├── context/AppContext.jsx # Session, cart and settings state
│   │   ├── styles/                # 13 independent design-system CSS layers
│   │   ├── styles.css             # Ordered layer imports
│   │   └── api.js                 # Axios instance and HTTP error handling
│   └── vite.config.js
├── server/                         # Express MVC backend
│   ├── src/
│   │   ├── app.js                 # Express middleware, routing, error pipeline
│   │   ├── server.js              # Runtime startup
│   │   ├── config/database.js     # MongoDB connection
│   │   ├── models/                # One Mongoose model per file + index.js
│   │   ├── routes/                # Small routers: public, auth, customer, admin/*
│   │   ├── controllers/           # Request handlers by domain
│   │   │   └── admin/             # Separate admin operations
│   │   ├── services/              # Price totals, state transitions, audit, CMS config
│   │   ├── middlewares/           # Authentication, authorization, origin, errors
│   │   └── lib/utils.js          # Pure helpers: IDs, validation, serialization
│   ├── scripts/seed.js            # Repeatable sample dataset & credentials
│   ├── tests/                     # Node test suite
│   └── .env.example
├── docs/API.md                     # Full REST API contract
├── docs/CLIENT_HANDOFF.md          # Demo / delivery / acceptance guidance
├── docker-compose.yml             # Optional local MongoDB
└── package.json                   # npm workspaces and task scripts
```

## Critical user workflows

**Ordering:** anonymous menu browsing → add and edit cart → authenticate at checkout → backend loads menu items / current prices / availability → order snapshot and number created → admin accepts, prepares and completes → customer sees progress. Initial payment modes: pay at pickup or cash on delivery **only where enabled**. Offline payment status is tracked separately from order state.

**Reservations:** select date, time and guests → authenticated request → backend validates date / hours / guest limits → **pending** reservation number created → admin manually confirms or rejects → customer sees status. The homepage widget prefills the proper reservation screen but does not promise real-time availability.

**Content editing:** admin creates / edits menu, gallery, FAQs and page records through authenticated endpoints. ImageKit upload keys remain server-side. Existing order snapshots remain stable if menu prices change.

## Testing

```bash
npm test        # Pure-service and utility tests
npm run check  # Server syntax checks + frontend production build (after npm install)
npm run build  # Frontend production build
```

Current authoring validation: **91 JS/JSX files parsed successfully**, local module resolution passed, **353 local named imports** were checked without missing exports, and **11 Node unit tests passed**. **A full Vite bundle build, live MongoDB integration, ImageKit delivery and browser interaction tests have not been independently verified in this environment** because dependency installation and browser access were restricted. Run `npm install`, `npm run check` and the manual acceptance steps in `docs/CLIENT_HANDOFF.md` on your machine before promising production delivery.

## Production safety and readiness

Passwords are hashed with bcrypt; session JWTs use HttpOnly cookies; sensitive customer/admin routes check identity and role on the server; inputs are validated; error responses avoid internal stack traces; login and contact forms are rate-limited; Images use server-only ImageKit keys; offline-payment status changes generate audit logs; backup and monitoring must be configured at deployment time.

For a deployment split across different cross-site domains, adjust and thoroughly test CORS and secure `SameSite` cookies. Prefer hosting the API behind the website origin via a secure proxy. Configure SMTP for password-reset email, production ImageKit credentials, a unique admin password, trusted domain names, SSL, monitoring and backups. Replace demo data, reviews, images and contact information with verified client-provided information.

**Online gateway payments are excluded from this phase.** They will require signed checkout and verified payment webhooks, idempotent reconciliation and refund support.
