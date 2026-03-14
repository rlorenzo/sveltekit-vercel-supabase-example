# SvelteKit + Supabase + Vercel Template

A production-ready SvelteKit template with Supabase, Tailwind CSS, and automated deployment to Vercel. Features complete CI/CD pipelines, pre-commit hooks, and database migrations.

## Features

- ⚡ **SvelteKit** - Fast, modern web framework
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🗄️ **Supabase** - PostgreSQL database with real-time subscriptions
- 🚀 **Vercel** - Automated deployments for staging and production
- 🔄 **GitHub Actions** - CI/CD for linting, testing, and deployment
- 🪝 **Husky** - Pre-commit hooks for code quality
- ✅ **Vitest** - Unit testing
- 🎭 **Playwright** - End-to-end testing
- 📝 **TypeScript** - Type safety
- 🎯 **ESLint + Prettier** - Code formatting and linting

## Prerequisites

- **Node.js 24+** (LTS - Krypton)
- **pnpm 9+**
- **Supabase CLI** (for local development)
- **Git**

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd sveltekit-vercel-supabase-template
pnpm install
```

### 2. Set Up Supabase Locally

```bash
# Install Supabase CLI (if not already installed)
pnpm install -g supabase

# Start Supabase locally
supabase start

# This will output your local Supabase credentials
# Copy the API URL and anon key to your .env file
```

### 3. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your local Supabase credentials
# For local development, use:
# PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
# PUBLIC_SUPABASE_ANON_KEY=<your-local-anon-key>
```

### 4. Run Migrations

```bash
# Apply migrations to your local database
supabase db reset

# This will run all migrations and seed data
```

### 5. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:5173` to see your app!

## Development Workflow

This section explains the complete development workflow from local development to production deployment.

### Overview

The workflow follows a standard Git branching strategy with automated CI/CD:

```text
Local Development → Feature Branch → Pull Request → Staging → Production
       ↓                  ↓               ↓            ↓           ↓
  Local Tests      GitHub Actions    Code Review   Staging    Production
                   (Lint + Test)                   Deploy      Deploy
```

### Step-by-Step Workflow

#### 1. Local Development

Start by working on your local machine:

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes to the code
# Run dev server to test locally
pnpm dev

# Run tests
pnpm test
pnpm test:e2e

# Run linter and formatter
pnpm lint
pnpm format
```

**What happens locally:**

- Supabase runs locally (via Docker) at `http://127.0.0.1:54321`
- Your app connects to the local Supabase instance
- You can test database changes by creating and running migrations locally
- Pre-commit hooks will run automatically when you commit (linting + tests)

#### 2. Create a Pull Request

When your feature is ready:

```bash
# Stage your changes
git add .

# Commit (pre-commit hooks will run: lint-staged + tests)
git commit -m "feat: add your feature description"

# Push your feature branch
git push -u origin feature/your-feature-name
```

**What happens on push:**

- Pre-commit hooks run:
  - **lint-staged**: Runs ESLint with auto-fix and Prettier on staged files
  - **Tests**: Runs all unit tests (Vitest)
- If hooks pass, code is pushed to GitHub

**Create the PR:**

1. Go to GitHub
2. Click "Compare & pull request"
3. Set base branch to `staging` (not `main`!)
4. Fill in PR description
5. Create pull request

**What happens when PR is created:**

- **Lint workflow** (`.github/workflows/lint.yml`) runs:
  - Checks code formatting with Prettier
  - Runs ESLint
- **Test workflow** (`.github/workflows/test.yml`) runs:
  - Runs unit tests (Vitest)
  - Runs E2E tests (Playwright)
- PR cannot be merged until all checks pass (recommended to enable branch protection)

#### 3. Merge to Staging

After PR is reviewed and approved:

```bash
# Merge PR via GitHub UI or CLI
gh pr merge <pr-number> --squash
```

**What happens on merge to `staging` branch:**

- **Deploy to Staging workflow** (`.github/workflows/deploy-staging.yml`) triggers:
  1. **Lint and Test Job**: Runs linter and all tests
  2. **Migrate Database Job**: Runs Supabase migrations on **staging database**
     - Uses `STAGING_SUPABASE_DB_URL` from GitHub Secrets
     - Applies any new migrations via `supabase db push`
  3. **Deploy Vercel Job**: Deploys to **Vercel staging environment**
     - Uses `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
     - Deploys with staging environment variables
     - Creates preview URL (e.g., `staging.yourdomain.com`)

**Accessing Staging:**

- Staging URL: `https://staging.yourdomain.com` (or Vercel-provided URL)
- Uses staging Supabase project
- Environment variables from Vercel staging environment

#### 4. Deploy to Production

After testing on staging, create a PR from `staging` → `main`:

```bash
# Create PR from staging to main
gh pr create --base main --head staging --title "Release: staging to production"
```

**Review and merge:**

1. Review all changes that will go to production
2. Merge PR to `main` branch

**What happens on merge to `main` branch:**

- **Deploy to Production workflow** (`.github/workflows/deploy-production.yml`) triggers:
  1. **Lint and Test Job**: Runs linter and all tests
  2. **Migrate Database Job**: Runs Supabase migrations on **production database**
     - Uses `PRODUCTION_SUPABASE_DB_URL` from GitHub Secrets
     - Applies migrations to production
  3. **Deploy Vercel Job**: Deploys to **Vercel production environment**
     - Deploys to your production domain
     - Uses production environment variables

**Accessing Production:**

- Production URL: `https://yourdomain.com`
- Uses production Supabase project
- Environment variables from Vercel production environment

### Environment Setup Guide

To enable this workflow, you need to configure three services:

#### GitHub Secrets Setup

1. Go to your repository on GitHub
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click "New repository secret" and add each of these:

**Vercel Secrets:**

```text
VERCEL_TOKEN          - Get from vercel.com/account/tokens
VERCEL_ORG_ID         - Get from Vercel project settings
VERCEL_PROJECT_ID     - Get from Vercel project settings
```

**Supabase Secrets:**

```text
SUPABASE_ACCESS_TOKEN       - Get from supabase.com/dashboard/account/tokens
STAGING_SUPABASE_DB_URL     - Connection string for staging project
PRODUCTION_SUPABASE_DB_URL  - Connection string for production project
```

**Optional Secrets:**

```text
STAGING_ALIAS_DOMAIN        - (Optional) Custom domain for staging deployments
                              If not set, Vercel will provide a default preview URL
```

#### Vercel Setup

1. **Create Vercel account** at [vercel.com](https://vercel.com)

2. **Import your GitHub repository:**

   ```bash
   # Via Vercel CLI (alternative to web UI)
   pnpm install -g vercel
   vercel link
   ```

3. **Configure environment variables in Vercel:**

   **For Production environment:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `PUBLIC_SUPABASE_URL` = `https://your-prod-project.supabase.co`
     - `PUBLIC_SUPABASE_ANON_KEY` = `your-production-anon-key`
   - Select "Production" environment

   **For Preview environment (staging):**
   - Add the same variables
   - `PUBLIC_SUPABASE_URL` = `https://your-staging-project.supabase.co`
   - `PUBLIC_SUPABASE_ANON_KEY` = `your-staging-anon-key`
   - Select "Preview" environment

4. **Get Vercel IDs:**

   ```bash
   # Install Vercel CLI
   pnpm install -g vercel

   # Link project
   vercel link

   # Get org and project IDs (from .vercel/project.json)
   cat .vercel/project.json
   ```

5. **Generate Vercel token:**
   - Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Create a new token
   - Add it to GitHub Secrets as `VERCEL_TOKEN`

#### Supabase Setup

1. **Create Supabase projects:**
   - Go to [supabase.com](https://supabase.com)
   - Create two projects:
     - One for **staging**
     - One for **production**

2. **Get Supabase credentials for Vercel:**

   For each project (staging and production):
   - Go to Project Settings → API
   - Copy:
     - **Project URL** (PUBLIC_SUPABASE_URL)
     - **anon/public key** (PUBLIC_SUPABASE_ANON_KEY)
   - Add these to Vercel environment variables (see above)

3. **Get database connection strings for migrations:**

   For each project:
   - Go to Project Settings → Database
   - Copy the **Connection string** (choose "URI" format)
   - Add to GitHub Secrets:
     - Staging: `STAGING_SUPABASE_DB_URL`
     - Production: `PRODUCTION_SUPABASE_DB_URL`

   Format: `postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres`

4. **Generate Supabase access token:**
   - Go to [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
   - Generate a new access token
   - Add it to GitHub Secrets as `SUPABASE_ACCESS_TOKEN`

5. **Link local project to Supabase (optional):**

   ```bash
   # Link to your staging project for testing
   supabase link --project-ref your-staging-project-ref

   # Test migrations
   supabase db push
   ```

### Branch Protection (Recommended)

Set up branch protection to ensure code quality:

1. Go to **Settings → Branches** on GitHub
2. Add branch protection rule for `main`:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1+)
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Select required checks: `lint`, `unit-tests`, `e2e-tests`
   - ✅ Do not allow bypassing the above settings

3. Add branch protection rule for `staging`:
   - Same settings as `main`

### Creating Database Migrations

When you need to change the database schema:

**Local development:**

```bash
# Create a new migration file
supabase migration new add_user_profile_table

# Edit the SQL file in supabase/migrations/
# Example: supabase/migrations/20250115120000_add_user_profile_table.sql

# Test locally
supabase db reset

# Verify your app works with the new schema
pnpm dev
```

**The migration will automatically run:**

- When you commit and it triggers on staging/production deploy
- Migrations are applied in order before deployment
- Failed migrations will stop the deployment

### Workflow Diagram

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Developer Machine                                                    │
│                                                                      │
│  1. Make changes                                                    │
│  2. Test locally (pnpm dev, pnpm test)                             │
│  3. Commit (pre-commit hooks run)                                   │
│  4. Push to feature branch                                          │
└────────────────────────────┬────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ GitHub - Pull Request to staging                                    │
│                                                                      │
│  → Lint workflow runs (ESLint + Prettier)                           │
│  → Test workflow runs (Vitest + Playwright)                         │
│  → Code review by team                                              │
│  → Merge to staging branch                                          │
└────────────────────────────┬────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Staging Deployment (auto-triggered on merge to staging)            │
│                                                                      │
│  1. Run lint + tests                                                │
│  2. Run migrations on Staging Supabase ───►  📊 Staging DB         │
│  3. Deploy to Vercel Staging           ───►  🌐 staging.domain.com │
└────────────────────────────┬────────────────────────────────────────┘
                              │
                              │  Test on staging
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ GitHub - Pull Request: staging → main                               │
│                                                                      │
│  → Review all changes                                               │
│  → Merge to main branch                                             │
└────────────────────────────┬────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Production Deployment (auto-triggered on merge to main)            │
│                                                                      │
│  1. Run lint + tests                                                │
│  2. Run migrations on Production Supabase ───►  📊 Production DB   │
│  3. Deploy to Vercel Production            ───►  🌐 domain.com     │
└─────────────────────────────────────────────────────────────────────┘
```

### Common Scenarios

#### Scenario 1: Adding a new feature

```bash
git checkout staging
git pull
git checkout -b feature/new-dashboard
# Make changes
pnpm dev  # Test locally
pnpm test # Run tests
git add .
git commit -m "feat: add user dashboard"
git push -u origin feature/new-dashboard
# Create PR to staging on GitHub
# After approval, merge to staging
# Test on staging.yourdomain.com
# Create PR from staging to main
# After approval, merge to main
```

#### Scenario 2: Database schema change

```bash
# On your feature branch
supabase migration new add_user_role_column
# Edit the generated SQL file
supabase db reset  # Test locally
git add supabase/migrations/
git commit -m "feat: add user role column"
git push
# Migration will run automatically on staging/production deploy
```

#### Scenario 3: Hotfix for production

```bash
git checkout main
git pull
git checkout -b hotfix/critical-bug
# Make fix
git add .
git commit -m "fix: resolve critical bug"
git push -u origin hotfix/critical-bug
# Create PR directly to main (skip staging for critical fixes)
# After approval and merge, deployment happens automatically
```

### Troubleshooting Deployments

**Failed GitHub Actions:**

- Check the Actions tab on GitHub
- View logs for the failed job
- Common issues:
  - Missing GitHub Secrets
  - Linting errors
  - Test failures
  - Migration errors

**Failed Vercel Deployment:**

- Check Vercel dashboard for build logs
- Common issues:
  - Missing environment variables
  - Build errors
  - TypeScript errors

**Failed Supabase Migrations:**

- Check GitHub Actions logs for migration job
- Common issues:
  - Invalid SQL syntax
  - Conflicting migrations
  - Missing permissions
- Fix: Roll back migration and create a new one

## Project Structure

```text
├── .github/
│   └── workflows/          # GitHub Actions CI/CD workflows
│       ├── lint.yml        # Linting workflow
│       ├── test.yml        # Testing workflow
│       ├── deploy-staging.yml
│       └── deploy-production.yml
├── .husky/
│   └── pre-commit          # Pre-commit hooks
├── src/
│   ├── lib/
│   │   ├── supabaseClient.ts      # Supabase client setup
│   │   └── supabaseClient.test.ts # Unit tests
│   ├── routes/
│   │   ├── +layout.svelte  # Root layout (imports global CSS)
│   │   └── +page.svelte    # Home page with items table
│   ├── app.css             # Tailwind CSS imports
│   ├── app.d.ts            # TypeScript declarations
│   └── app.html            # HTML template
├── supabase/
│   ├── config.toml         # Supabase configuration
│   └── migrations/         # Database migrations
│       ├── 20240101000000_create_items_table.sql
│       ├── 20240101000001_add_columns_to_items.sql
│       └── 20240101000002_seed_items_data.sql
├── tests/
│   └── home.spec.ts        # E2E tests
├── static/                 # Static assets
├── .prettierrc             # Prettier configuration
├── eslint.config.js        # ESLint configuration
├── playwright.config.ts    # Playwright configuration
├── svelte.config.js        # SvelteKit configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vercel.json             # Vercel deployment config
└── vite.config.ts          # Vite configuration
```

## Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm check            # Type-check with svelte-check

# Testing
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:e2e         # Run E2E tests with Playwright
```

## Database Migrations

### Creating a New Migration

```bash
# Create a new migration file
supabase migration new <migration_name>

# Edit the generated SQL file in supabase/migrations/
```

### Running Migrations Locally

```bash
# Reset database and run all migrations
supabase db reset

# Or apply migrations incrementally
supabase db push
```

### Migration Examples

The template includes three example migrations:

1. **`20240101000000_create_items_table.sql`** - Creates the initial `items` table with:
   - `id` (auto-incrementing primary key)
   - `name` (text)
   - `created_at` (timestamp)
   - Row Level Security (RLS) enabled
   - Public access policy (adjust for production!)

2. **`20240101000001_add_columns_to_items.sql`** - Adds columns:
   - `description` (text)
   - `status` (text with constraints)

3. **`20240101000002_seed_items_data.sql`** - Seeds sample data

## Deployment

### Setting Up Vercel

1. **Create a Vercel project:**

   ```bash
   # Install Vercel CLI (optional)
   pnpm install -g vercel

   # Link your project
   vercel link
   ```

2. **Set environment variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add for **Production**:
     - `PUBLIC_SUPABASE_URL` - Your production Supabase URL
     - `PUBLIC_SUPABASE_ANON_KEY` - Your production anon key
   - Add for **Preview** (staging):
     - `PUBLIC_SUPABASE_URL` - Your staging Supabase URL
     - `PUBLIC_SUPABASE_ANON_KEY` - Your staging anon key

3. **Configure GitHub Secrets:**

   Go to GitHub → Repository → Settings → Secrets and variables → Actions

   Add the following secrets:
   - `VERCEL_TOKEN` - Your Vercel access token
   - `VERCEL_ORG_ID` - Your Vercel organization ID
   - `VERCEL_PROJECT_ID` - Your Vercel project ID
   - `SUPABASE_ACCESS_TOKEN` - Your Supabase access token
   - `STAGING_SUPABASE_DB_URL` - Staging database connection string
   - `PRODUCTION_SUPABASE_DB_URL` - Production database connection string

### Setting Up Supabase for Production

1. **Create Supabase projects:**
   - Create a staging project at [supabase.com](https://supabase.com)
   - Create a production project at [supabase.com](https://supabase.com)

2. **Link your local project:**

   ```bash
   # Link to your remote project
   supabase link --project-ref <your-project-ref>
   ```

3. **Push migrations to remote:**

   ```bash
   # Push to staging
   supabase db push --db-url <staging-db-url>

   # Push to production
   supabase db push --db-url <production-db-url>
   ```

### Deployment Workflow

The template includes automated deployment workflows:

- **Staging**: Push to `staging` branch triggers:
  1. Lint and test
  2. Run database migrations on staging Supabase
  3. Deploy to Vercel staging environment

- **Production**: Push to `main` branch triggers:
  1. Lint and test
  2. Run database migrations on production Supabase
  3. Deploy to Vercel production environment

### Creating the Staging Branch

```bash
# Create and push the staging branch
git checkout -b staging
git push -u origin staging

# Set up branch protection rules in GitHub (recommended)
```

## Pre-commit Hooks

Husky is configured to run before each commit:

1. **Lint-staged** - Runs ESLint and Prettier on staged files
2. **Tests** - Runs all unit tests

To bypass hooks (not recommended):

```bash
git commit --no-verify
```

## Testing

### Unit Tests (Vitest)

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test -- --coverage
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
pnpm test:e2e

# Run in UI mode
pnpm exec playwright test --ui

# Generate tests
pnpm exec playwright codegen
```

## Customization

### Updating the Database Schema

1. Create a new migration:

   ```bash
   supabase migration new add_new_feature
   ```

2. Edit the SQL file in `supabase/migrations/`

3. Test locally:

   ```bash
   supabase db reset
   ```

4. Commit and push - migrations will run automatically on deploy

### Modifying Tailwind Theme

Edit `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        brand: '#your-color',
      },
    },
  },
};
```

### Adding New Routes

Create files in `src/routes/`:

```text
src/routes/
  about/
    +page.svelte          # /about
  blog/
    +page.svelte          # /blog
    [slug]/
      +page.svelte        # /blog/[slug]
```

## Troubleshooting

### Supabase Connection Issues

```bash
# Check if Supabase is running
supabase status

# Restart Supabase
supabase stop
supabase start
```

### Build Errors

```bash
# Clear build cache
rm -rf .svelte-kit
rm -rf node_modules/.vite

# Reinstall dependencies
pnpm install

# Rebuild
pnpm build
```

### Pre-commit Hook Issues

```bash
# Reinstall Husky hooks
pnpm exec husky install

# Make pre-commit executable
chmod +x .husky/pre-commit
```

## Production Checklist

Before deploying to production:

- [ ] Update Row Level Security (RLS) policies in migrations
- [ ] Set up proper authentication (Supabase Auth)
- [ ] Configure environment variables in Vercel
- [ ] Set up custom domain in Vercel
- [ ] Enable branch protection on `main` and `staging` branches
- [ ] Review and update CORS settings in Supabase
- [ ] Set up monitoring and error tracking (e.g., Sentry)
- [ ] Configure analytics (e.g., Vercel Analytics, Plausible)
- [ ] Update `site_url` in `supabase/config.toml` for auth redirects
- [ ] Review and optimize bundle size
- [ ] Set up database backups in Supabase dashboard

## Resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
