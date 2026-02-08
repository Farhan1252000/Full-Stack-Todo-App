# Todo App Frontend

A modern, responsive todo application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User authentication (login/signup)
- Task management (create, read, update, delete)
- Task filtering (all, completed, pending)
- Responsive design for all device sizes
- Offline capability with service worker
- Accessibility compliant (WCAG 2.1 AA)
- Form validation and error handling
- Loading states and skeleton screens

## Tech Stack

- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Date Utilities**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the `frontend/` directory with the following content:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── task/          # Task management components
│   │   ├── layout/        # Layout and navigation components
│   │   ├── ui/            # Base UI components (button, input, etc.)
│   │   └── common/        # Shared components
│   ├── pages/             # Next.js pages
│   ├── services/          # API communication logic
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles and CSS modules
│   └── types/             # TypeScript type definitions
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API endpoint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)