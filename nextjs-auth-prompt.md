# Next.js 15 Role-Based Authentication System - Complete Implementation Prompt

## Overview
Implement a production-ready, secure, role-based authentication system using Next.js 15's latest features and modern authentication best practices.

## Project Requirements

### Current Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Database ORM**: Prisma
- **Database**: PostgreSQL/MySQL (specify your preference)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (optional)

### Core Authentication Requirements

#### 1. User Roles
- **Two roles**: `ADMIN` and `USER`
- Default role assignment: `USER` for new registrations
- Role stored in database with user record
- Future-proof design for additional roles

#### 2. Authentication Features
- **Registration**: Email/password with role assignment
- **Login**: Secure credential-based authentication
- **Logout**: Clear session and redirect
- **Remember Me**: Optional persistent sessions
- **Password Security**: Bcrypt/Argon2 hashing

#### 3. Session Management
**Implement using modern Next.js 15 recommendations:**
- Use authentication library (NextAuth.js v5/Auth.js recommended)
- Database sessions for enhanced security
- Session validation on each request
- Auto-logout on user deletion from database
- Session refresh mechanism

#### 4. Route Protection

**Protected Routes Requirements:**
- Unauthenticated users → Redirect to `/login`
- Authenticated users accessing `/login` or `/register` → Redirect to `/dashboard`
- Admin-only routes → Check role and redirect if unauthorized

**Route Categories:**
```
- Public Routes: /, /about, /contact
- Auth Routes: /login, /register (accessible only when not logged in)
- Protected Routes: /dashboard, /profile, /settings (require authentication)
- Admin Routes: /admin/* (require ADMIN role)
```

#### 5. Real-time Session Validation
- Check user existence in database on each request
- Immediate logout if user record deleted
- Handle stale sessions gracefully
- Revalidate on page refresh/navigation
- Implement proper error boundaries

#### 6. Security Requirements
- **Password**: Minimum 8 characters, hashed with bcrypt (cost factor 12)
- **CSRF Protection**: Built-in with authentication library
- **Session Storage**: HTTP-only, secure cookies
- **Rate Limiting**: Prevent brute force attacks on auth endpoints
- **Input Validation**: Use Zod for schema validation
- **SQL Injection Prevention**: Use Prisma parameterized queries
- **XSS Protection**: Sanitize all user inputs

### Technical Implementation

#### 1. Database Schema (Prisma)
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String?
  role          Role      @default(USER)
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([email])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

enum Role {
  USER
  ADMIN
}
```

#### 2. File Structure
```
project-root/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── actions.ts
│   │   ├── register/
│   │   │   ├── page.tsx
│   │   │   └── actions.ts
│   │   └── layout.tsx
│   ├── (protected)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (admin)/
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   └── users/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   ├── logout-button.tsx
│   │   └── auth-provider.tsx
│   └── ui/
│       └── ... (UI components)
├── lib/
│   ├── auth.ts         (NextAuth configuration)
│   ├── dal.ts          (Data Access Layer)
│   ├── prisma.ts       (Prisma client singleton)
│   ├── session.ts      (Session helpers)
│   └── validations.ts  (Zod schemas)
├── middleware.ts
├── prisma/
│   └── schema.prisma
└── types/
    └── next-auth.d.ts  (TypeScript declarations)
```

#### 3. Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# NextAuth Configuration
AUTH_SECRET="minimum-32-character-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Security
BCRYPT_ROUNDS=12
SESSION_MAX_AGE=2592000  # 30 days in seconds
```

### Implementation Patterns

#### 1. Use Modern Next.js 15 Features
- **Server Components** for initial auth checks
- **Server Actions** for form submissions
- **Middleware** for optimistic route protection
- **Parallel Routes** for loading states
- **Error Boundaries** for error handling

#### 2. Data Access Layer (DAL) Pattern
Create centralized authorization logic:
```typescript
// lib/dal.ts
- verifySession()
- getUserById()
- hasRole()
- canAccessResource()
```

#### 3. Data Transfer Objects (DTO)
Return only necessary data:
```typescript
// Never return password hashes
// Strip sensitive fields
// Use select/include in Prisma queries
```

#### 4. Authentication Flow

**Registration Flow:**
1. User fills registration form
2. Validate input with Zod
3. Check if email exists
4. Hash password with bcrypt
5. Create user in database
6. Auto-login after registration
7. Redirect to dashboard

**Login Flow:**
1. User submits credentials
2. Validate input format
3. Find user by email
4. Verify password hash
5. Create session
6. Set secure cookie
7. Redirect to dashboard

**Logout Flow:**
1. User clicks logout
2. Delete session from database
3. Clear cookies
4. Redirect to home/login

#### 5. Middleware Configuration
```typescript
// Optimistic checks only (no DB calls)
- Read session from cookie
- Check route permissions
- Redirect based on auth state
- Skip API routes and static files
```

### Performance Optimizations

1. **Caching**
   - Use React `cache()` for session checks
   - Implement Redis for session storage (optional)
   - Cache user permissions

2. **Database**
   - Add indexes on frequently queried fields
   - Use connection pooling
   - Optimize Prisma queries with select

3. **Client-Side**
   - Prefetch auth status
   - Optimistic UI updates
   - Progressive enhancement

### Error Handling

1. **Authentication Errors**
   - Invalid credentials
   - Account locked
   - Email not verified
   - Session expired

2. **Authorization Errors**
   - Insufficient permissions
   - Role not authorized
   - Resource access denied

3. **User Feedback**
   - Clear error messages
   - Toast notifications
   - Loading states
   - Success confirmations

### Testing Requirements

1. **Unit Tests**
   - Authentication functions
   - Authorization checks
   - Password hashing
   - Session management

2. **Integration Tests**
   - Login/Register flow
   - Protected routes
   - Role-based access
   - Session expiry

3. **E2E Tests**
   - Complete user journey
   - Error scenarios
   - Edge cases

### API Endpoints

#### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session
- `POST /api/auth/refresh` - Refresh session

#### Protected Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `DELETE /api/users/account` - Delete account
- `GET /api/admin/users` - List all users (Admin only)

### Security Checklist

- [ ] Passwords hashed with bcrypt (min cost 12)
- [ ] Sessions stored in database
- [ ] HTTPS only cookies in production
- [ ] CSRF protection enabled
- [ ] Rate limiting on auth endpoints
- [ ] Input validation on all forms
- [ ] SQL injection prevention via Prisma
- [ ] XSS protection headers
- [ ] Secure session secret (32+ chars)
- [ ] Auto-logout on user deletion
- [ ] Session expiry implemented
- [ ] Proper error messages (no info leakage)

### Libraries to Use

**Required:**
- `next`: ^15.0.0
- `next-auth`: @beta (v5)
- `@auth/prisma-adapter`: Latest
- `prisma`: Latest
- `@prisma/client`: Latest
- `bcryptjs`: Latest
- `zod`: Latest

**Optional but Recommended:**
- `jose`: For JWT handling
- `@radix-ui/react-*`: UI components
- `react-hook-form`: Form handling
- `sonner`: Toast notifications
- `rate-limiter-flexible`: Rate limiting

### Additional Features (Optional)

1. **Email Verification**
   - Send verification email on registration
   - Block login until verified
   - Resend verification option

2. **Password Reset**
   - Forgot password flow
   - Email reset link
   - Token expiry (1 hour)

3. **Two-Factor Authentication**
   - TOTP support
   - Backup codes
   - Recovery options

4. **OAuth Integration**
   - Google OAuth
   - GitHub OAuth
   - Social login buttons

5. **Account Management**
   - Profile update
   - Password change
   - Account deletion
   - Session management (view/revoke)

### Deliverables

Please provide:

1. **Complete implementation** with all files
2. **TypeScript types** for auth
3. **Environment variables** template
4. **Database migrations** ready to run
5. **Clear comments** explaining logic
6. **README** with setup instructions
7. **Security best practices** implemented
8. **Error handling** throughout
9. **Loading states** for better UX
10. **Responsive design** for auth pages

### Success Criteria

The implementation should:
- ✅ Allow user registration with email/password
- ✅ Support login with role-based access
- ✅ Protect routes based on authentication
- ✅ Prevent authenticated users from accessing auth pages
- ✅ Auto-logout when user deleted from database
- ✅ Use Next.js 15 latest features
- ✅ Follow security best practices
- ✅ Be production-ready
- ✅ Have proper TypeScript types
- ✅ Include comprehensive error handling

### References

- [Next.js 15 Authentication Guide](https://nextjs.org/docs/pages/guides/authentication)
- [NextAuth.js Documentation](https://authjs.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [OWASP Authentication Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## Implementation Notes

When implementing this system, prioritize:

1. **Security first** - Never compromise on security for convenience
2. **User experience** - Clear feedback, fast responses, intuitive flow
3. **Maintainability** - Clean code, proper structure, documentation
4. **Performance** - Optimize database queries, implement caching
5. **Scalability** - Design for future growth and features

This prompt provides a complete blueprint for implementing a modern, secure, role-based authentication system using Next.js 15's latest features and best practices.
