# FBR Invoice Frontend

A modern Next.js 14 application with TypeScript, Tailwind CSS, and React Query.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Query (TanStack Query v5)
- **HTTP Client**: Axios
- **Validation**: Zod
- **Date Handling**: date-fns
- **Utilities**: clsx, tailwind-merge

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` with your API configuration.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── layouts/          # Layout components
│   ├── providers/        # Context providers (React Query)
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
│   └── useUsers.ts       # Example React Query hooks
├── lib/                  # Utility libraries
│   ├── axios.ts         # Axios instance and interceptors
│   ├── query-client.ts  # React Query client configuration
│   └── utils.ts         # Helper functions (cn, etc.)
├── services/            # API service functions
│   └── example.service.ts
├── types/               # TypeScript type definitions
│   └── api.ts          # API response types
├── public/             # Static assets
└── .env.local          # Environment variables
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Features

### React Query Setup
- Pre-configured query client with optimal defaults
- React Query DevTools included in development
- Example hooks for CRUD operations

### Axios Configuration
- Centralized API client with interceptors
- Automatic token management
- Error handling for common HTTP status codes

### TypeScript
- Strict type checking enabled
- Type definitions for API responses
- Type-safe API services and hooks

### Tailwind CSS
- Tailwind CSS 4 with PostCSS
- Utility-first styling approach
- `cn()` helper for conditional classes

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## Next Steps

1. Replace the example service with your actual API endpoints
2. Create your UI components in `components/ui`
3. Add your pages in the `app` directory
4. Configure your API base URL in `.env.local`
5. Customize the theme in `tailwind.config.ts`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)
