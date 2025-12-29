## Prerequisites

Before running this project, make sure you have the following installed on your system:

- **Node.js** version 18 or newer
- **npm**, **yarn**, **pnpm**, or **bun** as your package manager
- A **Supabase** project for authentication and database features

Verify Node.js installation:

```bash
node -v
```

## Environment Variables

This project uses Supabase. Create a file named **.env** in the root directory and add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Restart the development server after creating or updating the `.env` file.

## Install Dependencies

Install dependencies using **npm** or **bun**:

```bash
npm install
# or
bun install
```

You may also use **pnpm** or **yarn** if preferred.

## Running the Development Server

Start the development server using any of the following commands:

```bash
npm run dev
# or
pnpm run dev
# or
yarn dev
# or
bun dev
```

Open `http://localhost:3000` in your browser to view the application.

## Git Commit Convention

This project follows **Conventional Commits** for clear and consistent commit messages.

### Commit Format

```text
<type>: <short description>
```

### Common Types

- `feat:` add a new feature
- `fix:` fix a bug
- `docs:` documentation changes
- `style:` formatting, missing semicolons, etc
- `refactor:` code changes without feature or bug fixes
- `perf:` performance improvements
- `test:` adding or updating tests
- `chore:` tooling, config, or dependency updates

### Examples

```bash
git commit -m "feat: add supabase authentication"
git commit -m "fix: handle null session on refresh"
git commit -m "docs: update setup instructions"
```

## Branch & Pull Request Policy

All changes **must be submitted via Pull Requests** targeting the **development** branch.
Direct commits to `development` or other protected branches are **not allowed**.

- PRs should follow the **Conventional Commits** format.
- Ensure your branch is up to date with `development` before submitting a PR.
- All PRs should be reviewed and approved before merging.

This ensures a clean commit history and proper code review workflow.
