This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# Handyman Booking App

A Next.js application for scheduling handyman services online. Customers can register, manage their profile and addresses, and create/track bookings.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite via Prisma ORM
- **Auth**: JWT (access + refresh tokens), bcrypt password hashing
- **Styling**: Tailwind CSS v4

## Prerequisites

- Node.js ≥ 18
- npm

## Setup

```bash
cd handyman-app
npm install

# Create a .env file with required variables (see below)

# Run database migrations
npx prisma migrate dev

# Seed service types
node scripts/seed.js
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite path, e.g. `file:./dev.db` |
| `JWT_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |

## Development

```bash
npm run dev       # Start dev server on http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint
```

## API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new customer |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/profile` | Bearer | Get profile + addresses |
| PUT | `/api/profile` | Bearer | Update name/phone |
| GET | `/api/profile/addresses` | Bearer | List addresses |
| POST | `/api/profile/addresses` | Bearer | Add address |
| PUT | `/api/profile/addresses/:id` | Bearer | Update address |
| DELETE | `/api/profile/addresses/:id` | Bearer | Delete address |
| GET | `/api/bookings` | Bearer | List customer bookings |
| POST | `/api/bookings` | Bearer | Create booking |
| GET | `/api/bookings/:id` | Bearer | Get single booking |
| PUT | `/api/bookings/:id` | Bearer | Update booking status |
| GET | `/api/service-types` | Bearer | List available service types |

## Booking Status Flow

```
REQUESTED → ACCEPTED → IN_PROGRESS → COMPLETED
         ↘            ↗
           CANCELLED
```

Customers can cancel from `REQUESTED` or `ACCEPTED`. Transitions to `ACCEPTED` and `IN_PROGRESS` are performed by the service operator.

## Pages

- `/` — Landing page with register/login links
- `/register` — Customer registration form
- `/login` — Login form
- `/profile` — Profile info + address management (add / edit / delete)
- `/bookings` — Booking list + create new booking
