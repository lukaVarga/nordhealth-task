# Project overview
The project showcases a simple nuxt app that allows you to sign up.

It includes usage of:
- pinia for state management
- drizzle ORM for the purposes of simulating a proper BE with a DB
- middleware acting as route guards (eg. allowing some routes to only be accessible for logged in users, some only for logged out users)
- vee-validate for form validation
- custom async validations
- usage of provet components, of course :)
- husky for pre-commit hooks (running linter on staged files, triggering semantic release commit message prompts)
- semantic release versioning for standardized commit messages
- vitest with coverage requirements for testing
- linter


---

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
