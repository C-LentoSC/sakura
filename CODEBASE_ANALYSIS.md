# Sakura Saloon - Comprehensive Codebase Analysis

**Generated:** February 13, 2026  
**Project:** sakura-saloon-new  
**Framework:** Next.js 15.5.4 (App Router)  
**Language:** TypeScript  
**Database:** PostgreSQL (via Prisma)

---

## Executive Summary

Sakura Saloon is a modern beauty salon booking and e-commerce platform built with Next.js 15 App Router, React 19, Prisma ORM, and Stripe payment integration. The application features a multi-language interface (English/Japanese), role-based access control, service booking system, product shop, and comprehensive admin dashboard.

**Architecture Quality:** High  
**Code Organization:** Excellent  
**Security Posture:** Good (with noted improvements)  
**Performance Considerations:** Good (with optimization opportunities)

---

## 1. Technology Stack

### Core Framework & Runtime
- **Next.js:** 15.5.4 (App Router)
- **React:** 19.1.0
- **TypeScript:** 5.x
- **Node.js:** Target LTS (24.x recommended)

### Build & Development Tools
- **Turbopack:** Enabled for dev/build (`--turbopack` flag)
- **Tailwind CSS:** v4 (latest)
- **ESLint:** v9 with Next.js configs
- **PostCSS:** Tailwind CSS v4 plugin

### Database & ORM
- **Prisma:** 6.17.1
- **Database:** PostgreSQL (production)
- **Connection:** Uses `DATABASE_URL` and `DIRECT_DATABASE_URL`

### Authentication & Security
- **Session Management:** Custom JWT-based using `jose` library
- **Password Hashing:** bcryptjs (cost factor 12)
- **Cookie Security:** HttpOnly, Secure (production), SameSite=Lax

### Payment Processing
- **Stripe:** 19.1.0 (latest)
- **Stripe React:** @stripe/react-stripe-js 5.2.0
- **Payment Method:** Payment Intents API

### Additional Libraries
- **Form Handling:** FormData with Server Actions
- **Validation:** Zod 4.1.12
- **Image Upload:** formidable 3.5.4
- **Animations:** GSAP 3.13.0
- **Icons:** lucide-react 0.545.0
- **Photo Gallery:** react-photo-album, react-easy-crop

---

## 2. Project Structure

```
sakura-saloon-new/
├── app/
│   ├── (admin)/              # Admin route group
│   │   └── admin/            # Admin dashboard pages
│   ├── (auth)/               # Authentication route group
│   │   ├── login/
│   │   ├── register/
│   │   └── logout/
│   ├── (protected)/          # Protected user routes
│   │   ├── book/
│   │   ├── booking/
│   │   ├── bookings/
│   │   ├── checkout/
│   │   └── profile/
│   ├── api/                  # API Route Handlers
│   │   ├── admin/            # Admin-only endpoints
│   │   ├── auth/
│   │   ├── bookings/
│   │   ├── products/
│   │   ├── services/
│   │   └── upload/
│   ├── components/           # Reusable UI components
│   ├── contexts/             # React Context providers
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Core utilities & DAL
│   ├── locales/              # i18n translations
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Helper functions
│   └── constants/            # App constants
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeding
├── public/                   # Static assets
├── uploads/                  # User-uploaded files
├── middleware.ts             # Next.js middleware
└── types/                    # Global type definitions
```

---

## 3. Architecture Analysis

### 3.1 Authentication & Authorization

**Pattern:** Custom JWT-based session management with role-based access control

**Implementation:**
- **Session Storage:** Encrypted JWT tokens stored in HttpOnly cookies
- **Session Duration:** 7 days (default), 30 days (remember me)
- **Role System:** USER, ADMIN (enum-based)
- **Verification:** Server-side verification with database lookup

**Key Files:**
- `app/lib/session.ts` - JWT encryption/decryption
- `app/lib/dal.ts` - Data Access Layer with `verifySession()`, `hasRole()`, `getCurrentUser()`
- `middleware.ts` - Route protection middleware
- `app/(protected)/layout.tsx` - Protected route wrapper
- `app/(admin)/layout.tsx` - Admin route wrapper

**Security Strengths:**
- HttpOnly cookies prevent XSS attacks
- Secure flag in production
- Password hashing with bcrypt (cost 12)
- Session verification checks user existence (auto-logout on deletion)
- Role checks enforced server-side

**Potential Improvements:**
- Session expiration not validated in middleware (only in JWT)
- No rate limiting on auth endpoints
- No CSRF token validation (relies on SameSite cookies)

### 3.2 Data Access Layer (DAL)

**Pattern:** Centralized authorization logic with React cache

**Key Functions:**
- `verifySession()` - Cached session verification (prevents duplicate DB calls)
- `hasRole(role)` - Role-based authorization check
- `getCurrentUser()` - Throws if unauthenticated

**Strengths:**
- Uses React `cache()` to deduplicate requests
- Clear separation of concerns
- Type-safe with TypeScript

### 3.3 API Route Structure

**Pattern:** RESTful API routes with Next.js Route Handlers

**Organization:**
- Public routes: `/api/services`, `/api/products`, `/api/categories`
- Protected routes: `/api/bookings`, `/api/my-bookings`, `/api/me`
- Admin routes: `/api/admin/*` (all require ADMIN role)

**Error Handling:**
- Consistent JSON error responses
- Try-catch blocks in all handlers
- Status codes: 400 (bad request), 403 (unauthorized), 404 (not found), 500 (server error)

**Authorization Pattern:**
```typescript
const isAdmin = await hasRole('ADMIN');
if (!isAdmin) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}
```

### 3.4 Caching Strategy

**Implementation:** Custom in-memory cache manager (`app/lib/cache.ts`)

**Features:**
- TTL-based expiration (default: 30 minutes)
- Stale-while-revalidate pattern (60 minutes stale window)
- Background revalidation support
- Pattern-based invalidation

**Usage:**
- Currently used in `/api/services/[id]` route
- Not consistently applied across all routes
- In-memory cache (lost on server restart)

**Recommendations:**
- Consider Redis for production
- Apply caching to frequently accessed routes
- Implement cache invalidation on mutations

### 3.5 Database Schema

**Models:**
1. **User** - Authentication and user data
2. **Session** - Database-backed sessions (currently unused, JWT-only)
3. **Product** - E-commerce products
4. **Booking** - Service appointments
5. **ServiceCategory** - Level 1 categories
6. **ServiceSubCategory** - Level 2 categories
7. **ServiceSubSubCategory** - Level 3 categories
8. **Service** - Individual services

**Relationships:**
- Hierarchical service structure (Category → SubCategory → SubSubCategory → Service)
- Cascade deletes configured
- Proper indexing on foreign keys and search fields

**Observations:**
- `Session` model exists but not actively used (JWT-only sessions)
- `Booking` model lacks user relationship (uses email/name strings)
- No order/invoice models for shop purchases

---

## 4. Component Architecture

### 4.1 Component Organization

**Pattern:** Co-located components with barrel exports

**Structure:**
- `app/components/` - Shared UI components
- `app/(admin)/admin/components/` - Admin-specific components
- Barrel export via `app/components/index.ts`

**Key Components:**
- `Header` / `HeaderClient` - Navigation with language switcher
- `Footer` - Site footer
- `Chatbot` - Customer support chatbot
- `StripeProvider` - Stripe context provider
- `PaymentForm` - Stripe payment form
- `ErrorBoundary` / `ErrorFallback` - Error handling
- `BackgroundPattern`, `CherryBlossomTrees`, `FallingPetals` - Decorative elements

### 4.2 Server vs Client Components

**Pattern:** Server Components by default, Client Components when needed

**Server Components:**
- Layouts (`layout.tsx`)
- Most page components
- API routes

**Client Components (`"use client"`):**
- Interactive UI (`HeaderClient`, form handlers)
- Context providers (`LanguageContext`, `LoadingContext`)
- Hooks consumers
- Stripe integration components

**Strengths:**
- Proper boundary separation
- Minimal client bundle size
- Good use of Server Actions

### 4.3 State Management

**Pattern:** React Context + Local State + Server State

**Context Providers:**
- `LanguageContext` - i18n state (localStorage + cookie sync)
- `LoadingContext` - Global loading state

**Server State:**
- Custom hooks (`useServices`, `useProducts`, `useBookings`)
- Direct fetch calls (no React Query/TanStack Query)

**Recommendations:**
- Consider TanStack Query for better caching, refetching, and error handling
- Reduce prop drilling with context where appropriate

---

## 5. Internationalization (i18n)

**Implementation:** Custom i18n system

**Features:**
- Language detection from cookie (server-side)
- localStorage persistence (client-side)
- Cookie sync for SSR consistency
- Nested translation keys support

**Languages:**
- English (`en`) - Default
- Japanese (`ja`)

**Files:**
- `app/locales/en.json` - English translations
- `app/locales/ja.json` - Japanese translations
- `app/locales/config.ts` - Configuration
- `app/contexts/LanguageContext.tsx` - Provider

**Usage:**
```typescript
const { t, language, setLanguage } = useLanguage();
const text = t('common.welcome');
```

**Strengths:**
- Server-side rendering support
- Hydration-safe
- Easy to extend

---

## 6. Security Analysis

### 6.1 Authentication Security

**Strengths:**
- Password hashing with bcrypt (cost 12)
- HttpOnly cookies prevent XSS
- Secure flag in production
- Session expiration (7/30 days)
- No password exposure in error messages

**Weaknesses:**
- No rate limiting on login/register endpoints
- No account lockout after failed attempts
- No email verification requirement
- Session expiration not validated in middleware (only JWT expiry)

### 6.2 Authorization Security

**Strengths:**
- Role checks enforced server-side
- Protected routes use layout-level checks
- Admin routes require explicit ADMIN role

**Weaknesses:**
- Middleware only checks session existence, not role (role check in layout)
- No fine-grained permissions (only USER/ADMIN)

### 6.3 Input Validation

**Strengths:**
- Zod schemas for form validation
- Server-side validation in Server Actions
- Type-safe with TypeScript

**Weaknesses:**
- No input sanitization for HTML content
- File upload validation could be stricter
- No SQL injection risk (Prisma handles it)

### 6.4 API Security

**Strengths:**
- Admin endpoints check role before processing
- Error messages don't leak sensitive info
- CORS handled by Next.js

**Weaknesses:**
- No rate limiting on API routes
- No request size limits
- File upload size limits not enforced

### 6.5 Recommendations

1. **Add Rate Limiting:**
   - Use middleware or library (e.g., `@upstash/ratelimit`)
   - Limit login attempts (5 per 15 minutes)
   - Limit API requests per IP

2. **Enhance Session Security:**
   - Validate expiration in middleware
   - Implement session rotation
   - Add CSRF tokens for state-changing operations

3. **File Upload Security:**
   - Validate file types (MIME type + extension)
   - Enforce size limits (e.g., 5MB)
   - Scan for malware (production)
   - Store uploads outside public directory

4. **Add Email Verification:**
   - Require email verification for registration
   - Implement password reset flow

---

## 7. Performance Analysis

### 7.1 Current Optimizations

**Strengths:**
- Server Components reduce client bundle
- Image optimization via `next/image`
- Font optimization with `next/font`
- React `cache()` for session verification
- Custom cache manager for API responses

### 7.2 Opportunities

**Database Queries:**
- Some routes fetch without `select` (fetches all fields)
- Missing `select_related` / `prefetch_related` equivalents in some queries
- No query result pagination

**Caching:**
- In-memory cache lost on restart
- No CDN for static assets
- No ISR (Incremental Static Regeneration) for public pages

**Bundle Size:**
- GSAP included but may not be needed everywhere
- Consider code splitting for admin routes
- Lazy load heavy components (chatbot, image galleries)

**Recommendations:**
1. Add pagination to list endpoints
2. Use Redis for distributed caching
3. Implement ISR for service/product pages
4. Add bundle analysis and optimize imports
5. Use `select` in Prisma queries to fetch only needed fields

---

## 8. Code Quality

### 8.1 TypeScript Usage

**Strengths:**
- Strict mode enabled
- Type definitions for all major entities
- Type-safe API responses
- Proper use of `server-only` for server code

**Areas for Improvement:**
- Some `any` types in error handlers
- Missing return types on some functions
- API response types could be more specific

### 8.2 Code Organization

**Strengths:**
- Clear separation of concerns
- Consistent naming conventions
- Barrel exports for components
- Logical folder structure

**Patterns:**
- Server Actions in `actions.ts` files
- Hooks in `hooks/` directory
- Utilities in `utils/` directory
- Constants in `constants/` directory

### 8.3 Error Handling

**Strengths:**
- Try-catch blocks in async operations
- Error boundaries for React errors
- Consistent error response format
- User-friendly error messages

**Weaknesses:**
- No centralized error logging (only console.error)
- No error tracking service (Sentry, etc.)
- Some errors swallowed silently

### 8.4 Testing

**Status:** No test files found

**Recommendations:**
- Add unit tests for utilities and hooks
- Add integration tests for API routes
- Add E2E tests for critical flows (booking, checkout)
- Consider Vitest or Jest + React Testing Library

---

## 9. Dependencies Analysis

### 9.1 Production Dependencies

**Core:**
- `next@15.5.4` ✅ Latest stable
- `react@19.1.0` ✅ Latest
- `@prisma/client@6.17.1` ✅ Latest
- `stripe@19.1.0` ✅ Latest

**Security:**
- `bcryptjs@3.0.2` ✅
- `jose@6.1.0` ✅ JWT library

**Validation:**
- `zod@4.1.12` ✅ Latest

**Observations:**
- All major dependencies are up-to-date
- No known security vulnerabilities (based on versions)
- Consider auditing with `npm audit`

### 9.2 Dev Dependencies

**Build Tools:**
- `typescript@5` ✅
- `tailwindcss@4` ✅ Latest
- `eslint@9` ✅ Latest
- `prisma@6.17.1` ✅

**All dependencies appear current and well-maintained.**

---

## 10. Deployment Considerations

### 10.1 Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_DATABASE_URL` - Direct PostgreSQL connection (for migrations)
- `NEXTAUTH_SECRET` / `AUTH_SECRET` - JWT encryption secret
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (client-side)

**Optional:**
- `NODE_ENV` - Environment (development/production)

### 10.2 Build Configuration

**Current:**
- Uses Turbopack for faster builds
- TypeScript compilation
- Tailwind CSS v4 PostCSS processing

**Production Checklist:**
- ✅ Environment variables configured
- ✅ Database migrations ready
- ⚠️ No build-time environment validation
- ⚠️ No health check endpoint

### 10.3 Hosting Considerations

**README mentions Netlify:**
- Ensure serverless function limits are adequate
- Database connection pooling required
- File uploads may need external storage (S3, etc.)

**Recommendations:**
- Add health check endpoint (`/api/health`)
- Validate environment variables at startup
- Use external storage for uploads (not filesystem)
- Configure database connection pooling

---

## 11. Feature Completeness

### 11.1 Implemented Features

✅ **Service Booking System**
- Browse services with hierarchical categories
- Book appointments with date/time selection
- View booking history

✅ **Admin Dashboard**
- Service management (CRUD)
- Category management (3-level hierarchy)
- User management
- Booking management
- Product management
- Settings page

✅ **E-Commerce Shop**
- Product catalog
- Shopping cart (localStorage)
- Stripe checkout integration
- Product categories

✅ **User Authentication**
- Registration
- Login with "remember me"
- Logout
- Protected routes
- Profile page

✅ **Multi-Language Support**
- English/Japanese
- Server-side rendering support
- Cookie + localStorage sync

### 11.2 Missing Features

❌ **Email Verification**
- No email verification on registration
- No password reset flow

❌ **Order Management**
- No order history for shop purchases
- No order tracking
- No invoice generation

❌ **Booking Enhancements**
- No booking cancellation by user
- No booking rescheduling
- No email confirmations

❌ **Admin Features**
- No analytics dashboard
- No reporting
- No bulk operations

❌ **User Features**
- No favorites/wishlist
- No reviews/ratings (schema exists but not implemented)
- No notification system

---

## 12. Critical Issues & Recommendations

### 12.1 High Priority

1. **Session Model Unused**
   - `Session` model in Prisma but not used
   - Either implement database sessions or remove model
   - **Impact:** Schema confusion, unused code

2. **Booking Model Lacks User Relationship**
   - Uses email/name strings instead of User ID
   - Cannot track bookings per user properly
   - **Impact:** Data integrity, user experience

3. **No Rate Limiting**
   - Auth endpoints vulnerable to brute force
   - API endpoints vulnerable to abuse
   - **Impact:** Security risk

4. **File Upload Security**
   - No strict validation
   - Files stored in `uploads/` directory
   - **Impact:** Security risk, potential storage issues

### 12.2 Medium Priority

1. **No Error Tracking**
   - Only console.error logging
   - No production error monitoring
   - **Recommendation:** Add Sentry or similar

2. **In-Memory Cache**
   - Lost on server restart
   - Not shared across instances
   - **Recommendation:** Use Redis

3. **No Pagination**
   - List endpoints return all results
   - **Recommendation:** Add pagination (cursor or offset)

4. **Missing Tests**
   - No test coverage
   - **Recommendation:** Add unit and integration tests

### 12.3 Low Priority

1. **Code Splitting**
   - Admin routes could be lazy loaded
   - Heavy libraries (GSAP) loaded globally

2. **Type Safety**
   - Some API responses use generic types
   - Add stricter types

3. **Documentation**
   - API endpoints not documented
   - Add OpenAPI/Swagger docs

---

## 13. Best Practices Compliance

### 13.1 Next.js Best Practices

✅ **App Router Usage**
- Proper use of route groups
- Server Components by default
- Correct use of `"use client"`

✅ **Server Actions**
- Used for form submissions
- Proper error handling
- Type-safe with Zod

✅ **Image Optimization**
- Uses `next/image`
- Remote patterns configured

⚠️ **Caching**
- No explicit cache configuration
- Relying on custom cache manager
- Consider Next.js built-in caching

### 13.2 React Best Practices

✅ **Component Structure**
- Functional components
- Proper hooks usage
- Context for global state

✅ **Performance**
- React `cache()` used appropriately
- Minimal re-renders

⚠️ **State Management**
- Could benefit from TanStack Query
- Some prop drilling

### 13.3 TypeScript Best Practices

✅ **Type Safety**
- Strict mode enabled
- Type definitions present
- Server-only code marked

⚠️ **Type Coverage**
- Some `any` types
- Missing return types

### 13.4 Security Best Practices

✅ **Authentication**
- Secure password hashing
- HttpOnly cookies
- Session expiration

⚠️ **Authorization**
- Role checks could be more granular
- No rate limiting

✅ **Input Validation**
- Zod schemas
- Server-side validation

⚠️ **File Uploads**
- Needs stricter validation
- Storage location concerns

---

## 14. Migration & Upgrade Path

### 14.1 Next.js Version

**Current:** 15.5.4 ✅ Latest stable

**Future Considerations:**
- Monitor Next.js 16 release
- Plan migration if breaking changes
- Test thoroughly before upgrading

### 14.2 React Version

**Current:** 19.1.0 ✅ Latest

**Stable:** No immediate upgrade needed

### 14.3 Database Migrations

**Current:** Prisma migrations in place

**Recommendations:**
- Review migration history
- Test migrations on staging
- Backup before production migrations

---

## 15. Conclusion

### Overall Assessment

**Strengths:**
- Modern tech stack (Next.js 15, React 19)
- Clean architecture and code organization
- Type-safe with TypeScript
- Good separation of concerns
- Proper use of Server Components
- Security-conscious authentication

**Areas for Improvement:**
- Add rate limiting and enhanced security
- Implement error tracking
- Add test coverage
- Improve file upload security
- Add pagination and optimize queries
- Consider Redis for caching

### Priority Actions

1. **Immediate:** Add rate limiting, enhance file upload security
2. **Short-term:** Add error tracking, implement pagination
3. **Medium-term:** Add test coverage, migrate to Redis caching
4. **Long-term:** Add missing features (email verification, order management)

### Final Verdict

The codebase is **well-structured and production-ready** with minor security and performance improvements needed. The architecture follows Next.js best practices and demonstrates good engineering discipline. With the recommended improvements, this would be an excellent production application.

---

**Analysis Date:** February 13, 2026  
**Analyzed By:** AI Code Analysis  
**Version:** 1.0
