# Movie App

A React + Vite application that integrates with The Movie Database (TMDB) API to browse and search movies.

## Environment Variables

This project requires environment variables to connect to the TMDB API. Create a `.env` file in the root directory with the following variables:

```env
VITE_TMDB_ACCOUNT_ID="your_tmdb_account_id_here"
VITE_TMDB_AUTH_KEY="Bearer your_tmdb_read_access_token_here"
VITE_TMDB_ACCESS_TOKEN_WITHWRITEPMS="your_tmdb_write_access_token_here"
```

To get your TMDB API keys:
1. Sign up at [The Movie Database](https://www.themoviedb.org/)
2. Navigate to Settings > API
3. Create an API key
4. Add your API key to the `.env` file

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Start the development server: `npm run dev`

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build locally

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Agentic Engineering

This project follows the **PRP (Product Requirement Prompt)** methodology for AI-assisted development. We use specialized agents to ensure code quality and maintain documentation.

- See [AGENTS.md](./AGENTS.md) for a list of specialized agents and their roles.
- Follow the guidelines in [PRPs-agentic-eng/CLAUDE.md](./PRPs-agentic-eng/CLAUDE.md) for contribution rules.
- Run `/prp-review-agents` before submitting pull requests.
