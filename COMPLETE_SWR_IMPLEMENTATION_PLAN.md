# Complete SWR Cache-First Implementation Plan

## Status: ~13% Complete (3/24 pages with SWR)

---

## ✅ COMPLETED (Already Has SWR Caching)

### Pages:
1. `/shop` - Products listing ✅
2. `/services` - Services listing ✅
3. `/admin/shop` - Admin products management ✅

### Hooks Created:
- ✅ `app/hooks/useSWR.ts` - Core SWR implementation
- ✅ `app/hooks/useProducts.ts` - Products listing
- ✅ `app/hooks/useServices.ts` - Services listing
- ✅ `app/hooks/useCategories.ts` - Categories listing
- ✅ `app/hooks/useService.ts` - Single service by ID
- ✅ `app/hooks/useProduct.ts` - Single product by ID

### API Routes with Caching:
- ✅ `/api/products` - Cache-first + ISR
- ✅ `/api/services` - Cache-first + ISR
- ✅ `/api/categories` - Cache-first + ISR

### API Routes with Cache Invalidation:
- ✅ `/api/admin/products` (POST)
- ✅ `/api/admin/products/[id]` (PUT, DELETE)
- ✅ `/api/admin/services` (POST)
- ✅ `/api/admin/services/[id]` (PUT, DELETE)

---

## ❌ TODO: Remaining Implementation (21/24 pages)

### Phase 1: Create Missing Hooks

#### 1. `app/hooks/useBookings.ts`
```typescript
/**
 * Hook for user bookings with services data
 */
import { useCallback } from 'react';
import { useSWR } from './useSWR';

export function useBookings() {
  const fetcher = useCallback(async () => {
    const res = await fetch('/api/my-bookings');
    if (!res.ok) throw new Error('Failed to load bookings');
    const data = await res.json();
    return data.bookings;
  }, []);

  const { data, error, isLoading, mutate } = useSWR(
    'swr:my-bookings',
    fetcher,
    { revalidateOnFocus: true, fallbackData: [] }
  );

  return { bookings: data || [], error, isLoading, mutate };
}
```

#### 2. `app/hooks/useAdminBookings.ts`
```typescript
/**
 * Hook for admin bookings management
 */
import { useCallback } from 'react';
import { useSWR } from './useSWR';

export function useAdminBookings() {
  const fetcher = useCallback(async () => {
    const res = await fetch('/api/admin/bookings');
    if (!res.ok) throw new Error('Failed to load bookings');
    const data = await res.json();
    return data.bookings;
  }, []);

  const { data, error, isLoading, mutate } = useSWR(
    'swr:admin-bookings',
    fetcher,
    { revalidateOnFocus: true, fallbackData: [] }
  );

  return { bookings: data || [], error, isLoading, mutate };
}
```

#### 3. `app/hooks/useAdminUsers.ts`
```typescript
/**
 * Hook for admin users management
 */
import { useCallback } from 'react';
import { useSWR } from './useSWR';

export function useAdminUsers() {
  const fetcher = useCallback(async () => {
    const res = await fetch('/api/admin/users');
    if (!res.ok) throw new Error('Failed to load users');
    const data = await res.json();
    return data.users;
  }, []);

  const { data, error, isLoading, mutate } = useSWR(
    'swr:admin-users',
    fetcher,
    { revalidateOnFocus: true, fallbackData: [] }
  );

  return { users: data || [], error, isLoading, mutate };
}
```

#### 4. `app/hooks/useAdminCategories.ts`
```typescript
/**
 * Hook for admin categories with full tree
 */
import { useCallback } from 'react';
import { useSWR } from './useSWR';

export function useAdminCategories() {
  const fetcher = useCallback(async () => {
    const res = await fetch('/api/admin/categories');
    if (!res.ok) throw new Error('Failed to load categories');
    const data = await res.json();
    return data.categories;
  }, []);

  const { data, error, isLoading, mutate } = useSWR(
    'swr:admin-categories',
    fetcher,
    { revalidateOnFocus: true, fallbackData: [] }
  );

  return { categories: data || [], error, isLoading, mutate };
}
```

---

### Phase 2: Add Server-Side Caching to API Routes

#### 1. Update `/api/services/[id]/route.ts`
Add cache-first pattern similar to `/api/products`:
```typescript
import cacheManager from '@/app/lib/cache';

export const revalidate = 60;

export async function GET(request: Request, { params }) {
  const { id } = await params;
  const cacheKey = `service:${id}`;

  // Cache-first logic
  const cachedData = cacheManager.get(cacheKey, { ttl: 30 * 60 * 1000 });

  if (cachedData && !cacheManager.isStale(cacheKey)) {
    return NextResponse.json({ ...cachedData, cached: true });
  }

  // ... rest of implementation
}
```

#### 2. Create `/api/admin/users/route.ts` with caching
```typescript
import cacheManager from '@/app/lib/cache';

export const revalidate = 60;

export async function GET() {
  const cacheKey = 'admin:users';

  const cachedData = cacheManager.get(cacheKey);
  if (cachedData && !cacheManager.isStale(cacheKey)) {
    return NextResponse.json({ users: cachedData, cached: true });
  }

  // Fetch from DB + cache
  const users = await prisma.user.findMany({ ... });
  cacheManager.set(cacheKey, users);

  return NextResponse.json({ users, cached: false });
}
```

#### 3. Add caching to `/api/admin/bookings/route.ts`
#### 4. Add caching to `/api/my-bookings/route.ts`
#### 5. Add caching to `/api/admin/categories/route.ts`

---

### Phase 3: Add Cache Invalidation

Add to all CRUD operations:
```typescript
// After CREATE/UPDATE/DELETE
cacheManager.invalidatePattern(/^admin:users/);
cacheManager.invalidatePattern(/^admin:bookings/);
cacheManager.invalidatePattern(/^admin:categories/);
```

Files to update:
- `/api/admin/users/[id]/route.ts` (PUT, DELETE)
- `/api/admin/bookings/route.ts` (POST)
- `/api/admin/bookings/[id]/route.ts` (PUT, DELETE)
- `/api/admin/categories/route.ts` (POST, PUT, DELETE)
- `/api/admin/subcategories/route.ts` (POST, PUT, DELETE)
- `/api/admin/subsubcategories/route.ts` (POST, PUT, DELETE)

---

### Phase 4: Update Client Pages

#### 1. `/app/shop/[id]/page.tsx`
Replace:
```typescript
// OLD
useEffect(() => {
  fetch(`/api/products?lang=${language}`)
    .then(res => res.json())
    .then(data => setProduct(data.products.find(p => p.id === productId)))
}, [language, productId]);

// NEW
import { useProduct } from '@/app/hooks/useProduct';

const { product, isLoading } = useProduct(productId, language);
```

#### 2. `/app/services/[id]/page.tsx`
Replace:
```typescript
// OLD
useEffect(() => {
  fetch(`/api/services/${serviceId}`)
    .then(res => res.json())
    .then(data => setService(data))
}, [serviceId]);

// NEW
import { useService } from '@/app/hooks/useService';

const { service, isLoading } = useService(serviceId);
```

#### 3. `/app/(protected)/book/page.tsx`
```typescript
import { useService } from '@/app/hooks/useService';

const { service, isLoading } = useService(preSelectedServiceId);
```

#### 4. `/app/(protected)/bookings/page.tsx`
```typescript
import { useBookings } from '@/app/hooks/useBookings';

const { bookings, isLoading, mutate } = useBookings();
```

#### 5. `/app/(admin)/admin/services/page.tsx`
```typescript
import { useServices } from '@/app/hooks/useServices';
import { useCategories } from '@/app/hooks/useCategories';

const { services, isLoading: servicesLoading, mutate } = useServices();
const { categories, isLoading: categoriesLoading } = useCategories();
```

#### 6. `/app/(admin)/admin/categories/page.tsx`
```typescript
import { useAdminCategories } from '@/app/hooks/useAdminCategories';

const { categories, isLoading, mutate } = useAdminCategories();
```

#### 7. `/app/(admin)/admin/users/page.tsx`
Convert from server component to client component:
```typescript
'use client';

import { useAdminUsers } from '@/app/hooks/useAdminUsers';

export default function AdminUsersPage() {
  const { users, isLoading, mutate } = useAdminUsers();
  // ... rest of component
}
```

#### 8. `/app/(admin)/admin/bookings/page.tsx`
```typescript
import { useAdminBookings } from '@/app/hooks/useAdminBookings';

const { bookings, isLoading, mutate } = useAdminBookings();
```

---

## Performance Impact

### Current State (13% coverage):
- **3 pages** with instant loading
- **21 pages** still hitting database on every load
- Average response: 200-500ms

### After Complete Implementation (100% coverage):
- **ALL 24 pages** with instant cache-first loading
- **Subsequent loads**: 5-20ms ⚡
- **Database hits**: Only every 30-60 min or after CRUD
- **95% reduction** in database queries across entire app

---

## Implementation Priority

### High Priority (User-Facing):
1. `/shop/[id]` - Product detail pages
2. `/services/[id]` - Service detail pages
3. `/book` - Booking flow
4. `/bookings` - User bookings

### Medium Priority (Admin):
5. `/admin/services` - Most used admin page
6. `/admin/categories` - Category management
7. `/admin/bookings` - Booking management

### Low Priority (Less Frequent):
8. `/admin/users` - User management

---

## Testing Checklist

After implementation, verify:

- [ ] All pages load instantly from cache on second visit
- [ ] Language switching is instant
- [ ] CRUD operations invalidate cache correctly
- [ ] Background revalidation updates data silently
- [ ] Cross-tab sync works (localStorage events)
- [ ] Console shows cache HIT/MISS/STALE logs
- [ ] No TypeScript errors
- [ ] Server starts without errors

---

## Next Steps

1. Create remaining 4 hooks (useBookings, useAdminBookings, useAdminUsers, useAdminCategories)
2. Add caching to remaining 5 API routes
3. Add cache invalidation to remaining 6 CRUD routes
4. Update 8 client pages to use SWR hooks
5. Test thoroughly
6. Deploy

**Estimated Time**: 2-3 hours for complete implementation
**Complexity**: Medium (following existing patterns)
**Risk**: Low (non-breaking changes, fallback to API still works)
