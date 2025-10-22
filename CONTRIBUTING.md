# Contributing to LoFocus

Thank you for your interest in contributing to LoFocus! This document provides guidelines and best practices for contributing to the project.

## 🏗️ Project Structure

LoFocus follows a well-organized structure to maintain code quality and readability:

### Folder Organization

```
app/
├── lib/                    # Shared utilities and configurations
│   ├── types/             # TypeScript type definitions
│   ├── constants/         # Application constants
│   └── utils/             # Helper functions
├── components/            # React components
├── stores/                # Zustand state management
└── api/                   # API routes
```

### Best Practices

#### 1. Type Definitions (`app/lib/types/`)

- Store all shared TypeScript types in the `app/lib/types/` folder
- Create separate files for different domains (e.g., `pomodoro.ts`, `session.ts`)
- Export types through the central `index.ts` file
- Use explicit types instead of `any`

Example:
```typescript
// app/lib/types/session.ts
export type Session = {
  id: string;
  title: string;
  // ... other fields
};
```

#### 2. Constants (`app/lib/constants/`)

- Store all application-wide constants in `app/lib/constants/`
- Group related constants in separate files (e.g., `defaults.ts`, `media.ts`)
- Export constants through the central `index.ts` file

Example:
```typescript
// app/lib/constants/defaults.ts
export const DEFAULT_POMODORO_DURATION = 25;
export const DEFAULT_SHORT_BREAK = 5;
```

#### 3. Utility Functions (`app/lib/utils/`)

- Create reusable utility functions in `app/lib/utils/`
- Document functions with JSDoc comments
- Write pure functions when possible
- Export utilities through the central `index.ts` file

Example:
```typescript
// app/lib/utils/time.ts
/**
 * Formats time in seconds to MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  // implementation
}
```

#### 4. API Routes (`app/api/`)

- Use centralized error handling from `app/lib/utils/api.ts`
- Always validate user authentication
- Use consistent error responses via `ApiErrors` helper
- Use the `getAuthenticatedUser` utility to reduce code duplication

Example:
```typescript
import { ApiErrors, getAuthenticatedUser } from "@/app/lib/utils";

export async function GET() {
  const session = await auth();
  const user = await getAuthenticatedUser(session);

  if (!user) {
    return ApiErrors.unauthorized();
  }
  
  // ... implementation
}
```

#### 5. Components

- Keep components focused and single-responsibility
- Extract reusable logic to custom hooks or utilities
- Use TypeScript for all components
- Import types, constants, and utilities from centralized locations

Example:
```typescript
import { formatTime } from "@/app/lib/utils";
import { DEFAULT_POMODORO_DURATION } from "@/app/lib/constants";
import type { Session } from "@/app/lib/types";
```

## 🎨 Code Style

- Use **Biome** for linting and formatting
- Run `npm run lint` before committing
- Run `npm run format` to auto-format code
- Follow TypeScript best practices
- Avoid using `any` type - use proper type definitions

## 🧪 Testing

- Build the project before submitting: `npm run build`
- Test your changes locally
- Ensure no TypeScript errors
- Verify linting passes

## 📝 Commit Messages

Use clear, descriptive commit messages:

- `feat: add new feature`
- `fix: resolve bug`
- `refactor: improve code structure`
- `docs: update documentation`
- `style: format code`
- `test: add tests`

## 🔒 Security

- Never commit sensitive data (API keys, passwords, etc.)
- Use environment variables for configuration
- Follow security best practices
- Report security issues privately

## 📄 Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes following the guidelines above
4. Run linting and build to verify
5. Submit a pull request with a clear description

## 🤝 Questions?

If you have questions or need help, please open an issue or reach out to the maintainers.

Thank you for contributing to LoFocus! 🎉
