# diopside api

## Setup

```bash
cp .env.example .env
npm install
npm run prisma:generate
```

## Database migration

```bash
npm run prisma:migrate
```

## Commands

- `npm run dev`: start local API server
- `npm run typecheck`: run TypeScript typecheck
- `npm test`: run unit tests
