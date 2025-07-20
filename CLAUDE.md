# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Database Commands

- `npm run db:generate` - Generate Prisma client from schema
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio for database management

## Architecture Overview

This is a multilingual AI-powered coaching application built with Next.js 15 (App Router), featuring internationalization, authentication, and a comprehensive coaching program system.

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **API**: tRPC for type-safe API calls
- **AI Integration**: OpenAI API for coaching interactions
- **Styling**: Tailwind CSS with shadcn/ui components
- **Internationalization**: next-intl with English and Hebrew support (RTL)

### Key Architecture Patterns

#### Internationalization Structure

- Locale-based routing with `[locale]` dynamic segments
- Two supported locales: English (`en`) and Hebrew (`he`) with RTL support
- Middleware handles locale detection and routing: `src/middleware.ts`
- Translation files in `src/messages/` (en.json, he.json)
- Configuration in `src/i18n/config.ts`

#### Database Schema (Prisma)

Core entities represent a comprehensive coaching system:

- **Users**: Profile data, assessment results, language preferences
- **CoachingProgram**: Structured coaching programs with phases
- **Phase**: Organizational units within programs containing tasks
- **Task**: Individual coaching activities (reflection, exercise, assessment, etc.)
- **UserProgress**: Tracks user advancement through programs
- **TaskProgress**: Individual task completion status and responses
- **ChatSession/ChatMessage**: AI coach conversations

#### API Architecture (tRPC)

- **Location**: `src/server/api/`
- **Main Router**: `root.ts` combines all feature routers
- **Routers**: user, programs, tasks, chat, ai, assessment
- **Authentication**: Uses `protectedProcedure` for authenticated endpoints
- **Context**: Integrates Supabase auth with Prisma database access

#### Authentication Flow

- **Provider**: Supabase with session management
- **Context**: `src/contexts/auth-context.tsx` provides user state
- **Server Integration**: tRPC context includes authenticated user ID
- **Middleware**: Locale routing only (auth handled by Supabase)

#### UI Component Structure

- **Design System**: shadcn/ui components in `src/components/ui/`
- **Feature Components**:
  - `assessment/` - User onboarding questionnaire components
  - `landing/` - Marketing page sections
  - `navigation/` - App navigation components
- **Layout**: App-wide layout in `src/components/layout/app-layout.tsx`
- **RTL Support**: Direction provider and Tailwind RTL plugin

### Development Workflow

#### Making Database Changes

1. Modify `prisma/schema.prisma`
2. Run `npm run db:generate` to update Prisma client
3. Run `npm run db:push` to apply changes to database

#### Adding New Features

1. Create tRPC router in `src/server/api/routers/`
2. Add router to `src/server/api/root.ts`
3. Create UI components following existing patterns
4. Add translations to both `src/messages/en.json` and `src/messages/he.json`

#### Internationalization Guidelines

- All user-facing text must be internationalized
- Use `useTranslations()` hook in components
- Consider RTL layout implications for Hebrew
- Text direction handled by `direction-provider.tsx`

### Project-Specific Notes

#### Assessment System

Multi-step user onboarding collecting relationship goals, challenges, communication preferences, and personality traits. Results stored in User model as structured data.

#### Coaching Program Logic

Hierarchical structure: Programs contain Phases, Phases contain Tasks. User progress tracked at both program and individual task levels.

#### AI Integration

OpenAI integration for coaching conversations and task feedback. Configuration in `src/lib/openai.ts`.

#### Environment Dependencies

- Supabase credentials for authentication and database
- OpenAI API key for AI features
- PostgreSQL database connection

always check translations in `src/messages/en.json` and `src/messages/he.json`
