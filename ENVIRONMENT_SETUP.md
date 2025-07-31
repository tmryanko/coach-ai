# Environment Setup Guide

This guide will help you set up development, staging, and production environments for the Coach AI application.

## Overview

The application supports three environments:
- **Development**: Local development with isolated database
- **Staging**: Testing environment for pre-production validation
- **Production**: Live application environment

## Step 1: Create Supabase Projects

### 1.1 Development Environment

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Name: `coach-ai-dev`
4. Database password: Generate strong password
5. Region: Choose same as production (eu-central-1)
6. Wait for project creation

### 1.2 Staging Environment

1. Create another new project
2. Name: `coach-ai-staging`
3. Database password: Generate strong password
4. Region: Same as above
5. Wait for project creation

### 1.3 Get Project Credentials

For each project (dev, staging), collect:
- Project URL: `Settings > API > Project URL`
- Anon key: `Settings > API > anon public`
- Service role key: `Settings > API > service_role` (keep secret)
- Database URL: `Settings > Database > Connection string > URI`
- Direct URL: Same as above but change port from 6543 to 5432

## Step 2: Configure Environment Files

### 2.1 Update .env.development

```bash
# Development Environment Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-role-key

# Development Database
DATABASE_URL="postgresql://postgres.your-dev-project:your-dev-password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.your-dev-project:your-dev-password@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# OpenAI API Key (can use same key or separate dev key)
OPENAI_API_KEY=your-openai-key

# Google OAuth (dev credentials - create separate OAuth app)
GOOGLE_CLIENT_ID=your-dev-google-client-id
GOOGLE_CLIENT_SECRET=your-dev-google-client-secret

# Environment identifier
NODE_ENV=development
NEXT_PUBLIC_ENV=development
```

### 2.2 Update .env.staging

```bash
# Staging Environment Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-staging-service-role-key

# Staging Database
DATABASE_URL="postgresql://postgres.your-staging-project:your-staging-password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.your-staging-project:your-staging-password@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# OpenAI API Key
OPENAI_API_KEY=your-openai-key

# Google OAuth (staging credentials)
GOOGLE_CLIENT_ID=your-staging-google-client-id
GOOGLE_CLIENT_SECRET=your-staging-google-client-secret

# Environment identifier
NODE_ENV=production
NEXT_PUBLIC_ENV=staging
```

## Step 3: Set Up Databases

### 3.1 Install Dependencies

```bash
pnpm install
```

### 3.2 Set Up Development Database

```bash
npm run db:push:dev
```

### 3.3 Set Up Staging Database

```bash
npm run db:push:staging
```

### 3.4 Verify Database Setup

```bash
# Check development
npm run db:studio:dev

# Check staging  
npm run db:studio:staging

# Check production
npm run db:studio:production
```

## Step 4: Configure Google OAuth

### 4.1 Development OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: `coach-ai-dev`
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Authorized redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `https://your-dev-project-id.supabase.co/auth/v1/callback`

### 4.2 Staging OAuth App

1. Create new project: `coach-ai-staging`
2. Same setup as dev but with staging URLs:
   - `https://your-staging-domain.vercel.app/auth/callback`
   - `https://your-staging-project-id.supabase.co/auth/v1/callback`

### 4.3 Configure Supabase Auth

For each Supabase project:
1. Go to `Authentication > Providers > Google`
2. Enable Google provider
3. Add your Google OAuth credentials
4. Set redirect URL

## Step 5: Configure Vercel Environments

### 5.1 Production Environment Variables

In Vercel dashboard, set these environment variables for **Production**:

```
NEXT_PUBLIC_SUPABASE_URL=https://uuikzarwsfrjyaejsupw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-role-key
DATABASE_URL=your-prod-database-url
DIRECT_URL=your-prod-direct-url
OPENAI_API_KEY=your-openai-key
GOOGLE_CLIENT_ID=your-prod-google-client-id
GOOGLE_CLIENT_SECRET=your-prod-google-client-secret
NODE_ENV=production
NEXT_PUBLIC_ENV=production
```

### 5.2 Preview Environment Variables

Set these for **Preview** deployments (staging):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-staging-service-role-key
DATABASE_URL=your-staging-database-url
DIRECT_URL=your-staging-direct-url
OPENAI_API_KEY=your-openai-key
GOOGLE_CLIENT_ID=your-staging-google-client-id
GOOGLE_CLIENT_SECRET=your-staging-google-client-secret
NODE_ENV=production
NEXT_PUBLIC_ENV=staging
```

## Step 6: Test Environments

### 6.1 Test Local Development

```bash
npm run dev:local
```

### 6.2 Test Staging

```bash
npm run dev:staging
```

### 6.3 Test Production

```bash
npm run dev
```

## Step 7: Deployment

### 7.1 Deploy to Staging

Push to a feature branch, Vercel will create preview deployment using staging environment.

### 7.2 Deploy to Production

Push to main branch, Vercel will deploy to production using production environment.

## Troubleshooting

### Database Connection Issues

1. Verify environment variables are correct
2. Check Supabase project status
3. Ensure IP allowlist includes your IP (if configured)

### OAuth Issues

1. Verify redirect URIs match exactly
2. Check domain configuration in Google Console
3. Ensure Supabase auth provider is enabled

### Build/Deployment Issues

1. Check Vercel function logs
2. Verify environment variables are set correctly
3. Ensure Prisma client is generated: `npm run db:generate:env`

## Security Notes

- Never commit environment files to git
- Use different API keys for each environment when possible
- Regularly rotate service role keys
- Monitor Supabase logs for suspicious activity
- Use strong passwords for database connections