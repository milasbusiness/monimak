# User Management & RBAC - Research & Implementation Plan

## Problem Statement / Feature Goal

Transform the Monimak creator subscription platform from a mock-data prototype into a production-ready application with:
- **Real user authentication** using Supabase Auth (replacing mock Zustand state)
- **PostgreSQL database integration** for persistent data storage
- **Role-Based Access Control (RBAC)** to distinguish between regular users, creators, and admins
- **Secure data access** via Row Level Security (RLS) policies

This implementation will enable actual user registration, login, and proper authorization for the content subscription platform.

## Current State Analysis

### Key Findings from Codebase

- **Authentication System**: `app/(auth)/login/page.tsx:19-23` & `app/(auth)/register/page.tsx:20-24`
  - Current implementation: Mock authentication that accepts any email/password
  - Behavior: Calls `useAuth().login()` which simply creates a fake user object
  - No actual API calls or database validation

- **State Management**: `lib/store.ts:1-221`
  - Pattern: Zustand store with localStorage persistence
  - Current `login` function (lines 47-57): Creates mock user with hardcoded data
  - No session management or token handling
  - State persists only user auth info, not full app state

- **User Types**: `lib/types.ts:1-11`
  - Defined types: `UserRole = "user" | "admin"`
  - User interface includes: id, email, name, avatar, role, subscriptions[], savedPosts[]
  - Missing: No creator-specific user type distinction
  - No metadata fields for profile information

- **Protected Routes**: `app/(app)/layout.tsx:8-23`
  - Pattern: Client-side redirect if `!isAuthenticated`
  - Security issue: No server-side validation, easily bypassed
  - Returns `null` while checking auth state (no loading UI)

- **Database Connection**: `.env:1`
  - PostgreSQL URL configured for Supabase
  - Connection exists but not utilized in application code

- **MCP Supabase Tools Available**:
  - `execute_sql`: Run SQL queries
  - `apply_migration`: Apply DDL migrations with proper naming
  - `list_tables`: Check existing schema
  - `generate_typescript_types`: Auto-generate types from schema
  - Auth schema already exists with full user management tables

### Existing Patterns to Follow

- **Next.js App Router Pattern**: Found in entire `app/` structure
  - Server Components by default
  - Client Components explicitly marked with `"use client"`
  - File-based routing with route groups `(app)` and `(auth)`
  - Should be applied because: Modern Next.js best practices, SEO-friendly

- **Supabase Best Practices**: From official documentation
  - Use `@supabase/ssr` for server-side auth in App Router
  - Create separate client/server Supabase client utilities
  - Implement middleware for session refresh
  - Use Row Level Security policies with `auth.uid()` helper
  - Should be applied because: Official recommended approach, secure, performant

- **Component Organization**: `components/` directory
  - UI primitives in `components/ui/` (shadcn/ui pattern)
  - Feature components at root level (post-card.tsx, creator-card.tsx)
  - Should be maintained for consistency

### Technical Constraints

- **Framework**: Next.js 14 App Router (package.json:21)
  - Must use server/client component patterns appropriately
  - Cannot use middleware on client components
  - Reference: Next.js App Router documentation

- **Database**: PostgreSQL via Supabase
  - Auth schema already managed by Supabase (cannot modify)
  - Must use `public` schema for custom tables
  - RLS must be enabled on all public tables
  - Reference: Supabase RLS documentation

- **State Management**: Zustand currently used
  - Should transition to server state where possible
  - Keep client state minimal (UI preferences only)
  - Auth state should come from Supabase session

- **Existing UI/UX**: Preserve current design
  - Dark theme with gradient accents must remain
  - All existing pages and components should continue to work
  - No breaking changes to user-facing features

## Desired End State

A fully functional authentication and authorization system where:

1. **Users can register** with email/password and receive confirmation emails
2. **Users can login** with secure session management via JWT tokens
3. **Sessions persist** across page reloads and are automatically refreshed
4. **Three distinct roles** exist: `user` (fan), `creator`, and `admin` with different permissions
5. **All data is stored** in PostgreSQL and accessed securely via RLS policies
6. **Server-side protection** prevents unauthorized access to routes and data
7. **Role switching** allows users to become creators (upgrade path)

**Success indicators:**
- Users can register and receive confirmation email
- Login creates valid Supabase session with JWT
- Protected routes redirect unauthenticated users server-side
- Creators can only access their own admin dashboard and data
- Users can only view posts they're subscribed to (locked content enforcement)
- All database queries respect RLS policies
- No console errors related to authentication
- TypeScript types auto-generated from database schema

## What We're NOT Doing

- Social OAuth providers (Google, GitHub) - UI exists but not implementing
- Password reset flow - can be added later
- Email verification enforcement - will implement but not block access
- Multi-factor authentication (MFA) - future enhancement
- Advanced RBAC with custom permissions - only three roles for now
- Migrating existing mock data to database - starting fresh
- Real payment processing - subscription management remains UI-only
- File upload to Supabase Storage - will continue using URLs
- Real-time features via WebSockets - keep mock message system

## Implementation Approach

### High-Level Strategy

Follow Supabase's official Next.js App Router integration pattern with these key principles:

1. **Database First**: Create schema with proper RLS policies before building features
2. **Server-Side Auth**: Use middleware and server components for auth checks
3. **Progressive Enhancement**: Migrate one feature at a time from mock to real data
4. **Type Safety**: Generate TypeScript types from database schema
5. **RBAC via Custom Claims**: Use Auth Hooks to add role to JWT

### Architecture Impact

- **Auth Layer**: Replaces Zustand auth with Supabase session management
- **Data Layer**: Introduces API route handlers or Server Actions for data mutations
- **Security Layer**: RLS policies enforce data access at database level
- **Type System**: Database-generated types replace manual type definitions
- **Routing**: Middleware intercepts all requests to validate sessions

## Phase 1: Database Schema & RLS Foundation

### Overview

Establish the PostgreSQL database schema that mirrors the current application structure and implement Row Level Security policies to enforce data access control.

### Files & Components Affected

#### 1. Create Migration File: `supabase/migrations/20260201_initial_schema.sql`

**Current state**: No migrations exist, no tables in public schema

**Required changes**:
- Create `profiles` table extending auth.users with app-specific data
- Create `creators` table for creator-specific information
- Create `posts` table for content
- Create `subscriptions` table for user-creator relationships
- Create `saved_posts` table for user favorites
- Create `user_roles` table for RBAC
- Create `role_permissions` table for permission management
- Add RLS policies for each table
- Create trigger to auto-create profile on user signup

**Implementation notes**:
- Follow pattern from Supabase documentation (RLS guide)
- Use `auth.uid()` helper in policies for user identification
- Enable RLS on all tables immediately
- Reference existing type definitions in `lib/types.ts:1-76`

**Schema Design**:

```sql
-- Enums for type safety
create type public.user_role as enum ('user', 'creator', 'admin');
create type public.post_type as enum ('image', 'video');
create type public.post_visibility as enum ('public', 'subscribers');

-- Profiles: Extends auth.users with app data
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text not null,
  avatar_url text,
  role user_role not null default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Creators: Additional info for users who are creators
create table public.creators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  username text unique not null,
  bio text,
  banner_url text,
  subscription_price numeric(10,2) default 9.99,
  is_verified boolean default false,
  subscriber_count integer default 0,
  post_count integer default 0,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Posts: Creator content
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.creators(id) on delete cascade not null,
  type post_type not null,
  media_url text not null,
  thumbnail_url text,
  caption text,
  tags text[] default '{}',
  visibility post_visibility not null default 'public',
  likes_count integer default 0,
  comments_count integer default 0,
  created_at timestamptz default now()
);

-- Subscriptions: User-Creator relationships
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  creator_id uuid references public.creators(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, creator_id)
);

-- Saved Posts: User favorites
create table public.saved_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, post_id)
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.creators enable row level security;
alter table public.posts enable row level security;
alter table public.subscriptions enable row level security;
alter table public.saved_posts enable row level security;

-- Profiles: Users can read all, but only update their own
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  to authenticated, anon
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id);

-- Creators: Public read, only creator can update their own
create policy "Creators are viewable by everyone"
  on public.creators for select
  to authenticated, anon
  using (true);

create policy "Users can create creator profile"
  on public.creators for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Creators can update own profile"
  on public.creators for update
  to authenticated
  using ((select auth.uid()) = user_id);

-- Posts: Public/subscriber based on visibility
create policy "Public posts viewable by everyone"
  on public.posts for select
  to authenticated, anon
  using (
    visibility = 'public' OR
    creator_id in (
      select creator_id from public.subscriptions
      where user_id = (select auth.uid())
    )
  );

create policy "Creators can manage own posts"
  on public.posts for all
  to authenticated
  using (
    creator_id in (
      select id from public.creators where user_id = (select auth.uid())
    )
  );

-- Subscriptions: Users manage their own
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can manage own subscriptions"
  on public.subscriptions for all
  to authenticated
  using ((select auth.uid()) = user_id);

-- Saved Posts: Users manage their own
create policy "Users can manage own saved posts"
  on public.saved_posts for all
  to authenticated
  using ((select auth.uid()) = user_id);

-- Trigger: Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'user')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

#### 2. Execute Migration via MCP

**Using tool**: `apply_migration` from user-supabase_mia MCP

**Parameters**:
- name: `initial_schema`
- query: [SQL from above]

#### 3. Generate TypeScript Types: `lib/database.types.ts` (new file)

**Current state**: Manual types in `lib/types.ts`

**Required changes**:
- Generate types from database schema using MCP tool
- Export Database type for use throughout app
- Keep old types.ts temporarily for backwards compatibility

**Using tool**: `generate_typescript_types` from user-supabase_mia MCP

### Success Criteria

**Automated:**
- Migration applies without errors via MCP
- `list_tables` shows all new tables in public schema
- TypeScript types generated successfully
- `npm run typecheck` passes
- `npx eslint .` passes

**Manual:**
- Can query tables via Supabase Studio
- RLS policies block unauthorized access when tested
- Trigger creates profile when user signs up
- Database types match application expectations

## Phase 2: Supabase Client Setup & Utilities

### Overview

Implement Supabase authentication client utilities following the official Next.js App Router pattern, including browser client, server client, and middleware for session management.

### Files & Components Affected

#### 1. Install Dependencies

**Current state**: No Supabase packages installed (package.json:11-29)

**Required changes**:
- Add `@supabase/supabase-js` - Core Supabase client
- Add `@supabase/ssr` - Server-side rendering helpers for Next.js

**Command**:
```bash
npm install @supabase/supabase-js @supabase/ssr
```

#### 2. Environment Variables: `.env.local` (new file)

**Current state**: Only `DATABASE_URL` in `.env`

**Required changes**:
- Add `NEXT_PUBLIC_SUPABASE_URL` for client access
- Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` for public API access
- Keep existing `DATABASE_URL` for reference

**Values**: Get from Supabase Dashboard → Project Settings → API

#### 3. Browser Client: `lib/supabase/client.ts` (new file)

**Current state**: N/A

**Implementation notes**:
- Follow pattern from Supabase Next.js documentation
- Use `createBrowserClient` from `@supabase/ssr`
- Export singleton instance

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

#### 4. Server Client: `lib/supabase/server.ts` (new file)

**Current state**: N/A

**Implementation notes**:
- Use `createServerClient` with cookie handling
- Import `cookies` from `next/headers`
- Handle cookie operations for session persistence

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component, ignore
          }
        },
      },
    }
  )
}
```

#### 5. Middleware: `middleware.ts` (new file at root)

**Current state**: No middleware exists

**Implementation notes**:
- Refresh auth token on every request
- Pass refreshed token to server components
- Return updated session to browser

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

#### 6. Middleware Helper: `lib/supabase/middleware.ts` (new file)

**Current state**: N/A

**Implementation notes**:
- Create server client in middleware context
- Call `auth.getUser()` to refresh token
- Set cookies in response

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => 
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session
  const { data: { user }, error } = await supabase.auth.getUser()

  // Optionally redirect to login if no user
  // if (error || !user) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  return supabaseResponse
}
```

### Success Criteria

**Automated:**
- `npm install` completes successfully
- TypeScript compilation passes
- No import errors in new files

**Manual:**
- Can import and use clients in test component
- Middleware logs show on each request (verify in terminal)
- Environment variables accessible in both server and client

## Phase 3: Authentication Flow Implementation

### Overview

Replace mock authentication with real Supabase Auth, implementing registration, login, logout, and session management.

### Files & Components Affected

#### 1. Registration: `app/(auth)/register/page.tsx`

**Current state**: Lines 20-24 call mock `login()` function

**Required changes**:
- Create Server Action for signup in `app/(auth)/register/actions.ts`
- Replace form `onSubmit` with `formAction` pointing to Server Action
- Add proper error handling and validation
- Collect name field for user metadata
- Redirect to email confirmation message

**Implementation notes**:
- Follow pattern from Supabase docs: login/signup actions
- Use `supabase.auth.signUp()` method
- Store name in `user_metadata`
- Handle duplicate email errors gracefully

**New file**: `app/(auth)/register/actions.ts`
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        name: formData.get('name') as string,
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error?message=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Check your email to confirm your account')
}
```

**Updated**: `app/(auth)/register/page.tsx`
- Import signup action
- Change form to use `formAction={signup}`
- Remove client-side state management for form submission
- Add hidden form submission handling

#### 2. Login: `app/(auth)/login/page.tsx`

**Current state**: Lines 19-23 call mock `login()` function

**Required changes**:
- Create Server Action for login in `app/(auth)/login/actions.ts`
- Replace form `onSubmit` with `formAction`
- Add error handling for invalid credentials
- Redirect to home page on success

**New file**: `app/(auth)/login/actions.ts`
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error?message=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/home')
}
```

#### 3. Error Page: `app/error/page.tsx` (new file)

**Current state**: No error page exists

**Required changes**:
- Create error page to display auth errors
- Read error message from URL params
- Match existing UI design (dark theme, gradients)
- Provide link back to login/register

#### 4. Email Confirmation: `app/auth/confirm/route.ts` (new file)

**Current state**: No confirmation handler

**Required changes**:
- Create Route Handler to exchange token_hash for session
- Read `token_hash` and `type` from URL params
- Call `supabase.auth.verifyOtp()`
- Redirect to home or account page on success

**Implementation notes**:
- Follow pattern from Supabase docs: confirmation endpoint
- Handle email confirmation flow
- This enables email verification links to work

#### 5. Update Auth Template in Supabase Dashboard

**Current state**: Default Supabase email templates

**Required changes**:
- Navigate to Supabase Dashboard → Authentication → Email Templates
- Update "Confirm signup" template
- Change `{{ .ConfirmationURL }}` to:
  `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`

**Why**: Enables server-side token verification for security

#### 6. Logout: `app/auth/signout/route.ts` (new file)

**Current state**: Logout handled in client via Zustand (`lib/store.ts:59-61`)

**Required changes**:
- Create POST Route Handler for signout
- Check if user is logged in
- Call `supabase.auth.signOut()`
- Redirect to login page

**Implementation notes**:
- Must be POST route for security
- Clear all cookies
- Can be called from any page via form

#### 7. Update App Layout: `app/(app)/layout.tsx`

**Current state**: Lines 8-23 use client-side auth check

**Required changes**:
- Convert to Server Component (remove `"use client"`)
- Get user from `supabase.auth.getUser()` server-side
- Redirect to login if no user using `redirect()` from next/navigation
- Pass user data to AppShell as prop if needed

**Implementation notes**:
- Server-side check is more secure
- Use `createClient()` from `lib/supabase/server.ts`
- Remove dependency on Zustand auth store

### Success Criteria

**Automated:**
- TypeScript compilation passes
- ESLint shows no errors
- `npm run build` succeeds

**Manual:**
- Can register new user and receive confirmation email
- Email link confirms account successfully
- Can login with correct credentials
- Login with wrong password shows error
- Accessing `/home` without login redirects to `/login`
- Logout button works and redirects to login
- Session persists after page reload

## Phase 4: State Management Migration

### Overview

Migrate from Zustand mock data to real database queries using Server Components and Server Actions.

### Files & Components Affected

#### 1. User Context Provider: `lib/contexts/user-context.tsx` (new file)

**Current state**: User state in Zustand (`lib/store.ts:8-9`)

**Required changes**:
- Create React Context for user data
- Fetch user on mount from Supabase
- Provide user to all Client Components
- Listen for auth state changes

**Implementation notes**:
- Use `supabase.auth.onAuthStateChange()` to sync state
- Fetch profile data from `profiles` table
- Include role information for RBAC

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

type UserContextType = {
  user: User | null
  profile: Profile | null
  isLoading: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  isLoading: true,
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Fetch profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setProfile(data)
            setIsLoading(false)
          })
      } else {
        setIsLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setProfile(data)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <UserContext.Provider value={{ user, profile, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
```

#### 2. Root Layout: `app/layout.tsx`

**Current state**: Basic HTML wrapper

**Required changes**:
- Wrap children with `UserProvider`
- Make provider available to all Client Components

#### 3. Home Feed: `app/(app)/home/page.tsx`

**Current state**: Uses mock data from Zustand (`lib/mock/data.ts`)

**Required changes**:
- Convert to Server Component
- Fetch posts from database using Server Client
- Filter by subscribed creators
- Pass data to Client Component for interactivity

**Implementation notes**:
- Query `posts` table with joins to `creators`
- Use RLS to automatically filter based on subscriptions
- Create separate Client Component for likes/saves

#### 4. Creator Actions: `app/(app)/home/actions.ts` (new file)

**Current state**: Client-side Zustand actions

**Required changes**:
- Create Server Actions for post interactions:
  - `toggleLike(postId: string)`
  - `toggleSave(postId: string)`
  - `toggleSubscription(creatorId: string)`
- Update database tables accordingly
- Revalidate page data after mutations

#### 5. Discover Page: `app/(app)/discover/page.tsx`

**Current state**: Uses `mockCreators` from mock data

**Required changes**:
- Fetch all creators from `creators` table
- Include subscriber counts and post counts
- Show subscription status for current user
- Pass to Client Component for filtering/search

#### 6. Library Page: `app/(app)/library/page.tsx`

**Current state**: Uses Zustand state for subscriptions and saved posts

**Required changes**:
- Fetch user's subscriptions from `subscriptions` table
- Fetch user's saved posts from `saved_posts` table
- Show both lists with creator/post details

#### 7. Update Store: `lib/store.ts`

**Current state**: Lines 1-221 handle all app state

**Required changes**:
- Remove auth functions (login, logout) - replaced by Supabase
- Remove post/subscription/message data - now in database
- Keep only UI state (filters, search, preferences)
- Reduce to minimal client state

**Implementation notes**:
- Keep Zustand for UI-only state
- Remove persistence of data that's now in database
- Maintain backwards compatibility temporarily

### Success Criteria

**Automated:**
- `npm run typecheck` passes
- `npm run build` succeeds
- No console errors on page load

**Manual:**
- Home feed shows real posts from database
- Like button updates post likes count in database
- Save button adds to saved_posts table
- Library shows actual subscriptions and saved posts
- Discover shows all creators with real data
- Subscribing to creator updates database

## Phase 5: Role-Based Access Control (RBAC)

### Overview

Implement three-tier role system (user, creator, admin) using Supabase Auth Hooks and custom claims in JWT.

### Files & Components Affected

#### 1. User Roles Migration: `supabase/migrations/20260201_user_roles.sql`

**Current state**: Basic role field in profiles table

**Required changes**:
- Keep existing `role` enum in profiles
- No separate user_roles table needed (simpler approach)
- Role stored directly in profiles.role column
- Update trigger to respect role from metadata if provided

**Implementation notes**:
- RBAC docs show complex permission system, but we only need 3 roles
- Simpler to check role directly from profile than separate table
- Can expand to permissions table later if needed

#### 2. Auth Hook: `supabase/migrations/20260201_auth_hook.sql`

**Current state**: No auth hooks

**Required changes**:
- Create PL/pgSQL function `custom_access_token_hook`
- Fetch user role from profiles table
- Add `user_role` claim to JWT
- Grant necessary permissions to `supabase_auth_admin`

**Implementation notes**:
- Follow exact pattern from Supabase Custom Claims docs
- Hook runs before token issuance
- Enables RLS policies to check role from JWT

```sql
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
  declare
    claims jsonb;
    user_role public.user_role;
  begin
    -- Fetch user role
    select role into user_role 
    from public.profiles 
    where id = (event->>'user_id')::uuid;

    claims := event->'claims';

    if user_role is not null then
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    else
      claims := jsonb_set(claims, '{user_role}', '"user"');
    end if;

    event := jsonb_set(event, '{claims}', claims);
    return event;
  end;
$$;

grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;
grant select on table public.profiles to supabase_auth_admin;
```

#### 3. Enable Hook in Supabase Dashboard

**Current state**: No hooks configured

**Required changes**:
- Navigate to Dashboard → Authentication → Hooks (Beta)
- Select "custom_access_token_hook" from dropdown
- Enable the hook

**Why**: Dashboard configuration required to activate hook

#### 4. Admin Guard Utility: `lib/guards/admin.ts` (new file)

**Current state**: No role checking

**Required changes**:
- Create server-side function to check if user is creator or admin
- Use in Server Components and Route Handlers
- Throw error or redirect if unauthorized

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function requireCreator() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'creator' && profile.role !== 'admin')) {
    redirect('/home')
  }

  return { user, profile }
}
```

#### 5. Admin Pages: `app/(app)/admin/page.tsx`, `upload/page.tsx`, `messages/page.tsx`

**Current state**: Client-side pages, no auth check

**Required changes**:
- Add `requireCreator()` call at top of each page
- Convert to Server Components where possible
- Fetch real stats from database for dashboard
- Keep upload form as Client Component

**Implementation notes**:
- Admin dashboard should show stats from actual tables
- Upload page creates posts in database
- Messages page can remain mock for now (future feature)

#### 6. Creator Profile Utility: `lib/utils/creator.ts` (new file)

**Current state**: No creator management

**Required changes**:
- Function to create creator profile from user
- Function to check if user is creator
- Function to upgrade user to creator role

```typescript
export async function createCreatorProfile(
  userId: string,
  username: string,
  bio: string
) {
  const supabase = await createClient()
  
  // Create creator entry
  const { data: creator, error: creatorError } = await supabase
    .from('creators')
    .insert({
      user_id: userId,
      username,
      bio,
    })
    .select()
    .single()

  if (creatorError) throw creatorError

  // Update profile role
  const { error: roleError } = await supabase
    .from('profiles')
    .update({ role: 'creator' })
    .eq('id', userId)

  if (roleError) throw roleError

  return creator
}
```

#### 7. Settings Page: `app/(app)/settings/page.tsx`

**Current state**: Lines showing role switch functionality

**Required changes**:
- Add "Become a Creator" flow for users
- Show creator dashboard link for creators
- Admin badge for admin users
- Form to create creator profile (username, bio)

#### 8. Update RLS Policies

**Current state**: Basic policies created in Phase 1

**Required changes**:
- Add role-based policies to posts table
- Creators can CRUD their own posts
- Admins can delete any post
- Users can only read based on subscriptions

```sql
create policy "Creators can delete own posts"
  on public.posts for delete
  to authenticated
  using (
    creator_id in (
      select id from public.creators where user_id = (select auth.uid())
    )
  );

create policy "Admins can delete any post"
  on public.posts for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );
```

### Success Criteria

**Automated:**
- Migration applies successfully
- Auth hook enabled in dashboard
- TypeScript types updated
- Build succeeds

**Manual:**
- JWT token includes `user_role` claim (check in browser devtools)
- Admin pages require creator role
- Users redirected when accessing admin routes
- Creators can create and manage posts
- Users can upgrade to creator
- Role persists across sessions

## Phase 6: Testing, Polish & Documentation

### Overview

Comprehensive testing of all auth flows, error handling, and creation of developer documentation.

### Files & Components Affected

#### 1. Error Handling: All auth-related files

**Current state**: Basic error redirects

**Required changes**:
- Add proper error messages to error page
- Toast notifications for actions (like, save, subscribe)
- Loading states for async operations
- Validation messages for forms

**Implementation notes**:
- Use existing UI patterns from mock implementation
- Add `react-hot-toast` or similar for notifications
- Show skeleton loaders while fetching data

#### 2. Type Safety: All files

**Current state**: Mix of manual and generated types

**Required changes**:
- Replace manual types with database-generated types
- Update imports across all files
- Remove old `lib/types.ts` when fully migrated
- Ensure no `any` types remain

#### 3. Developer Documentation: `documentation/Feb/auth-implementation-guide.md` (new file)

**Current state**: N/A

**Required changes**:
- Document auth flow for developers
- Explain RBAC system
- Show how to add new protected routes
- Describe RLS policy patterns
- Include troubleshooting guide

#### 4. User Documentation: Update `README.md`

**Current state**: Describes mock system (lines 120-129)

**Required changes**:
- Update "Getting Started" to explain real registration
- Document three user roles
- Explain creator upgrade process
- Update deployment instructions with env vars
- Remove references to "demo mode"

#### 5. Environment Setup: `.env.example` (new file)

**Current state**: No example file

**Required changes**:
- Create template for required env vars
- Add comments explaining each variable
- Include instructions to get values from Supabase

```bash
# Supabase Configuration
# Get these from: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Database (for reference only, not used by Next.js)
DATABASE_URL=your-database-url
```

#### 6. Migration Scripts: `scripts/seed-data.ts` (new file)

**Current state**: Mock data in `lib/mock/data.ts`

**Required changes**:
- Script to seed database with sample creators and posts
- Create test accounts for each role
- Useful for development and demos

#### 7. Testing Checklist: `documentation/Feb/test-checklist.md` (new file)

**Current state**: N/A

**Required changes**:
- Comprehensive test cases for all features
- Manual testing procedures
- Expected results for each test
- Bug tracking template

### Testing Checklist Content

```markdown
# Authentication & RBAC Testing Checklist

## Registration Flow
- [ ] Register with valid email/password
- [ ] Receive confirmation email
- [ ] Click confirmation link → account activated
- [ ] Try to register with existing email → error shown
- [ ] Try weak password → validation error
- [ ] Register without name → uses email prefix

## Login Flow
- [ ] Login with correct credentials → redirects to /home
- [ ] Login with wrong password → error shown
- [ ] Login with unconfirmed email → error shown
- [ ] Session persists after browser reload
- [ ] Session auto-refreshes before expiry

## Authorization
- [ ] Unauthenticated user redirected to /login
- [ ] User can access /home, /discover, /library
- [ ] User cannot access /admin routes
- [ ] Creator can access /admin routes
- [ ] Creator sees own posts in admin
- [ ] Admin can access all admin features

## Creator Upgrade
- [ ] User can become creator via settings
- [ ] Username must be unique
- [ ] Creator profile created successfully
- [ ] Role updated to 'creator'
- [ ] Creator dashboard accessible

## Data Access
- [ ] User sees only subscribed content
- [ ] Public posts visible to all
- [ ] Subscriber-only posts locked for non-subscribers
- [ ] Like/save actions persist to database
- [ ] Subscribe action updates database
- [ ] Unsubscribe removes access to locked content

## RLS Enforcement
- [ ] Cannot read other users' saved posts via API
- [ ] Cannot update other users' profiles
- [ ] Cannot delete other creators' posts (unless admin)
- [ ] Creators can only manage own posts

## Error Handling
- [ ] Network errors shown gracefully
- [ ] Invalid tokens redirect to login
- [ ] Database errors don't expose sensitive info
- [ ] Form validation prevents invalid submissions
```

### Success Criteria

**Automated:**
- All TypeScript errors resolved
- ESLint passes with no warnings
- Build completes successfully
- All imports use correct types

**Manual:**
- Complete testing checklist 100%
- Documentation reviewed and accurate
- Seed data script populates database
- No console errors in production build
- All features work as specified in user stories

## Implementation Notes

### Key Code References

- **Supabase Auth Setup**: Reference official docs at https://supabase.com/docs/guides/auth/server-side/nextjs
- **RLS Patterns**: Reference docs at https://supabase.com/docs/guides/database/postgres/row-level-security
- **RBAC Implementation**: Reference docs at https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac
- **Next.js App Router**: Use Server Components by default, Client Components only when needed
- **Database Types**: Auto-generate with `supabase gen types typescript` (via MCP tool)

### Testing Strategy

1. **Unit Testing**: Not required for this phase, focus on integration testing
2. **Integration Testing**: Manual testing of all user flows
3. **Database Testing**: Test RLS policies by attempting unauthorized access
4. **End-to-End Testing**: Complete user journeys from registration to content access

### Security Considerations

- Never expose `service_role` key in client code
- Always use RLS policies, never trust client input
- Server Components for auth checks, not Client Components
- Validate all user input before database operations
- Use parameterized queries (Supabase handles this)
- Keep JWT secrets secure

### Performance Optimizations

- Use `(select auth.uid())` pattern in RLS for caching
- Add indexes to foreign keys and commonly queried columns
- Minimize joins in RLS policies
- Consider adding database indexes:
  - `profiles(email)`
  - `creators(user_id)`
  - `posts(creator_id)`
  - `subscriptions(user_id, creator_id)`

### Migration Strategy

1. **Phase 1-2**: Set up infrastructure (no user-facing changes)
2. **Phase 3**: Switch auth (breaking change, requires re-registration)
3. **Phase 4-5**: Gradual feature migration (can be done page by page)
4. **Phase 6**: Polish and production readiness

### Rollback Plan

If critical issues arise:
1. Revert middleware.ts to allow bypass
2. Temporarily disable RLS on tables for emergency access
3. Restore Zustand mock auth temporarily
4. Fix issues in dev environment
5. Re-deploy with fixes

## Open Questions

- **Email Provider**: Should we customize email templates beyond confirmation?
- **Password Requirements**: Current Supabase defaults (8 chars min), change?
- **Creator Approval**: Should creators be auto-approved or require admin review?
- **Free vs Paid Tiers**: All creators start free, or different subscription tiers?
- **Rate Limiting**: Should we add rate limiting to registration/login?
- **Session Duration**: Default is good, or customize refresh token expiry?
- **Multi-Device**: Allow same user logged in on multiple devices?

---

**Plan Created**: February 1, 2026
**Target Completion**: Phased rollout over 2-3 development sessions
**Priority**: High - Foundational feature for production readiness
