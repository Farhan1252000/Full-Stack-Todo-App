# Quickstart Guide: Todo App Frontend

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- A code editor (VS Code recommended)

## Setup Instructions

1. **Clone and Navigate**:
   ```bash
   git clone [repository-url]
   cd [repository-directory]
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**:
   Create a `.env.local` file in the root with the following:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open Your Browser**:
   Visit `http://localhost:3000` to see the application

## Folder Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── task/          # Task management components
│   │   ├── layout/        # Layout and navigation components
│   │   └── ui/            # Base UI components (buttons, inputs, etc.)
│   ├── pages/             # Next.js pages
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── dashboard.tsx
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API communication logic
│   ├── utils/             # Utility functions
│   ├── styles/            # CSS and styling
│   └── types/             # TypeScript type definitions
├── tests/                 # Test files
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json
```

## Key Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## Running Tests

- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:integration`
- End-to-end tests: `npm run test:e2e`

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_SITE_NAME` - Site name for SEO
- `NEXTAUTH_SECRET` - Secret for authentication
- `NEXTAUTH_URL` - Authentication callback URL

## First Steps for Development

1. Review the UI specifications in `specs/ui/`
2. Examine the data models in `specs/ui/data-model.md`
3. Look at the planned tasks in `specs/ui/tasks.md` (after generation)
4. Start with authentication components (login/signup)
5. Move to dashboard and task management features

## Common Issues

- **Port already in use**: Change PORT environment variable
- **Dependency conflicts**: Run `npm install` to reinstall all dependencies
- **TypeScript errors**: Ensure TypeScript version is 4.5+
- **ESLint errors**: Run `npm run lint -- --fix` to auto-fix