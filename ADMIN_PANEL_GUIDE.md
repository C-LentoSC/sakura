# 🎨 Admin Panel Quick Guide

## 🚀 Getting Started

### Access the Admin Panel
1. **Login** as an admin user (set role to ADMIN in database)
2. Navigate to `/admin`
3. You'll see the new professional dashboard with sidebar

---

## 📱 Layout Overview

### Desktop View (1024px+)
```
┌─────────────────────────────────────────────┐
│ [🌸 Sakura Admin]  │  Dashboard Content    │
│                     │                        │
│ 🏠 Dashboard        │  [Statistics Cards]   │
│ 📦 Services         │                        │
│ 🏷️ Categories       │  [Recent Activity]    │
│ 📅 Bookings         │                        │
│ 👥 Users            │  [Quick Actions]      │
│ ⚙️ Settings         │                        │
│                     │                        │
│ ─────────────────   │                        │
│ [👤 Admin Profile]  │                        │
│ [View Site|Logout]  │                        │
└─────────────────────────────────────────────┘
   Sidebar (264px)         Content Area
```

### Mobile View (<1024px)
```
┌─────────────────────────────────┐
│ [☰]  Dashboard                  │
│                                 │
│  [Statistics Cards - Stacked]  │
│                                 │
│  [Recent Activity]              │
│                                 │
│  [Quick Actions]                │
└─────────────────────────────────┘

When [☰] clicked:
┌─────────────────────────────────┐
│ [Overlay Sidebar]               │
│                                 │
│ [🌸 Sakura Admin]               │
│                                 │
│ 🏠 Dashboard                    │
│ 📦 Services                     │
│ 🏷️ Categories                   │
│ 📅 Bookings                     │
│ 👥 Users                        │
│ ⚙️ Settings                     │
│                                 │
│ [👤 Admin Profile]              │
│ [View Site | Logout]            │
└─────────────────────────────────┘
```

---

## 📄 Pages Overview

### 1. Dashboard (`/admin`)
**What you'll see:**
- Welcome banner with your name
- 4 statistics cards (Users, Bookings, Services, Categories)
- Recent Users list (last 5)
- Recent Bookings list (last 5)
- Quick Actions grid (4 shortcuts)

**Actions:**
- Click any quick action card to navigate
- View recent activity at a glance
- Monitor key metrics

---

### 2. Services (`/admin/services`)
**What you'll see:**
- Page header with "Add New Service" button
- Search bar and category filter
- Table with all services
- Image previews, prices, durations
- Edit/Delete buttons per service

**Actions:**
- **Add**: Click "+ Add New Service" button
- **Search**: Type in search bar
- **Filter**: Select category from dropdown
- **Edit**: Click "Edit" on any service
- **Delete**: Click "Delete" (with confirmation)

**Modal Form Fields:**
- Name Key (translation)
- Description Key (translation)
- Price
- Duration
- Image path
- Category dropdown
- Sub-category dropdown
- Order number
- Active/Inactive checkbox

---

### 3. Categories (`/admin/categories`)
**What you'll see:**
- Page header with "Add New Category" button
- List of categories (expandable cards)
- Sub-categories under each category
- Service count per category/sub-category
- Edit/Delete buttons

**Actions:**
- **Add Category**: Click "+ Add New Category"
- **Add Sub-Category**: Click "+ Add Sub-Category" on a category card
- **Edit**: Click "Edit" on any category/sub-category
- **Delete**: Click "Delete" (warns about cascade delete)

**Category Form Fields:**
- Slug (URL-friendly ID)
- Name Key (translation)
- Display Order

**Sub-Category Form Fields:**
- Slug (URL-friendly ID)
- Name Key (translation)
- Display Order
- (Parent category auto-selected)

---

### 4. Bookings (`/admin/bookings`)
**What you'll see:**
- Page header with total bookings count
- 3 statistics cards (Pending, Confirmed, Completed)
- Table with all bookings
- Customer info, dates, times, status badges
- View button per booking

**Actions:**
- **View**: Click "View" to see booking details (coming soon)
- **Monitor**: Check status distribution in stat cards
- **Sort**: Table sorted by creation date (newest first)

**Status Colors:**
- 🟡 Pending (yellow)
- 🟢 Confirmed (green)
- 🔵 Completed (blue)

---

### 5. Users (`/admin/users`)
**What you'll see:**
- Page header with total users count
- 3 statistics cards (Admins, Users, Sessions)
- Table with all users
- Avatars, names, emails, roles
- Edit button per user

**Actions:**
- **Edit**: Click "Edit" to modify user (coming soon)
- **View Stats**: Check user distribution in stat cards
- **Identify**: "You" indicator shows your account

**Role Badges:**
- 🟣 ADMIN (purple)
- 🌸 USER (pink)

---

### 6. Settings (`/admin/settings`)
**What you'll see:**
- "Coming Soon" placeholder
- 4 setting category previews:
  - General Settings
  - Email Settings
  - Payment Settings
  - Security Settings

**Status:** Placeholder for future implementation

---

## 🎯 Navigation Tips

### Desktop
1. **Sidebar always visible** - Click any item to navigate
2. **Active page highlighted** - Gradient background shows current page
3. **Scroll content** - Sidebar stays fixed while content scrolls

### Mobile
1. **Tap hamburger menu** (☰) in top-left corner
2. **Sidebar slides in** from left with backdrop
3. **Tap any nav item** to navigate (sidebar auto-closes)
4. **Tap outside sidebar** or X button to close

### Quick Actions
- **View Site**: Opens public site in same tab
- **Logout**: Logs you out and redirects to login

---

## 🎨 Visual Elements

### Statistics Cards
```
┌──────────────────────────────┐
│ [Icon]              [+12%]   │
│                               │
│ 42                            │
│ Total Users                   │
└──────────────────────────────┘
```
- **Icon**: Colored background with SVG icon
- **Badge**: Growth indicator (green) or status
- **Number**: Large, bold count
- **Label**: Description text

### Table Rows
```
┌────────────────────────────────────────┐
│ [Avatar] Name     | Role | Actions     │
│          Email    |      | [Edit]      │
└────────────────────────────────────────┘
```
- **Hover effect**: Light pink background
- **Responsive**: Hides columns on small screens
- **Badges**: Colored pills for status/role

### Modal Forms
```
┌──────────────────────────────┐
│ Add New Service         [X]  │
│                               │
│ [Input Fields]                │
│ [Dropdowns]                   │
│ [Checkboxes]                  │
│                               │
│ [Cancel]  [Create]            │
└──────────────────────────────┘
```
- **Backdrop**: Dark overlay
- **Centered**: Modal in viewport center
- **Scrollable**: If content exceeds height
- **Validation**: Real-time error messages

---

## 🔧 Common Tasks

### Add a New Service
1. Go to `/admin/services`
2. Click "+ Add New Service"
3. Fill in all fields:
   - Name Key: `services.packages.newService`
   - Description Key: `services.packages.newServiceDesc`
   - Price: `99.99`
   - Duration: `60 min`
   - Image: `/packages/new.jpg`
   - Select Category
   - Select Sub-Category
   - Order: `0`
   - Check "Active"
4. Click "Create"
5. Service appears in table

### Edit a Service
1. Find service in table
2. Click "Edit"
3. Modify fields
4. Click "Update"
5. Changes saved

### Delete a Service
1. Find service in table
2. Click "Delete"
3. Confirm deletion
4. Service removed

### Add a Category
1. Go to `/admin/categories`
2. Click "+ Add New Category"
3. Fill in:
   - Slug: `new-category`
   - Name Key: `services.mainCategories.newCategory`
   - Order: `4`
4. Click "Create"
5. Category card appears

### Add a Sub-Category
1. Go to `/admin/categories`
2. Find parent category card
3. Click "+ Add Sub-Category"
4. Fill in:
   - Slug: `new-sub`
   - Name Key: `services.subCategories.newSub`
   - Order: `0`
5. Click "Create"
6. Sub-category appears under parent

---

## 📊 Understanding Statistics

### Dashboard Stats
- **Total Users**: All registered users (ADMIN + USER)
- **Total Bookings**: All bookings regardless of status
- **Service Packages**: Active services in database
- **Categories**: Main service categories

### Users Stats
- **Administrators**: Users with ADMIN role
- **Regular Users**: Users with USER role
- **Active Sessions**: Total session count across all users

### Bookings Stats
- **Pending**: Bookings awaiting confirmation
- **Confirmed**: Bookings that are confirmed
- **Completed**: Bookings that are finished

---

## 🎯 Best Practices

### Content Management
1. **Use translation keys** - Don't hardcode text
2. **Set proper order** - Controls display sequence
3. **Use descriptive slugs** - URL-friendly identifiers
4. **Optimize images** - Keep file sizes reasonable
5. **Mark inactive** - Don't delete, just deactivate

### Navigation
1. **Use sidebar** - Primary navigation method
2. **Check active page** - Gradient shows where you are
3. **Use quick actions** - Shortcuts from dashboard
4. **Mobile-friendly** - Always test on mobile

### Data Management
1. **Search first** - Use search before scrolling
2. **Filter by category** - Narrow down results
3. **Check stats** - Monitor key metrics
4. **Regular backups** - Export data periodically

---

## 🐛 Troubleshooting

### Sidebar not showing
- **Check screen size**: Sidebar hidden on mobile (<1024px)
- **Use hamburger menu**: Tap ☰ button on mobile

### Can't access admin pages
- **Check role**: Must be ADMIN in database
- **Re-login**: Clear session and login again

### Statistics not updating
- **Refresh page**: Hard refresh (Ctrl+Shift+R)
- **Check database**: Verify data exists in Prisma Studio

### Modal not closing
- **Click backdrop**: Click outside modal
- **Click X button**: Top-right corner
- **Press Escape**: Keyboard shortcut

---

## 🎨 Customization Tips

### Change Sidebar Width
Edit `app/(admin)/layout.tsx`:
```tsx
// Change from 264px to your preferred width
<AdminSidebar /> // 264px default
// Then update margin:
<main className="lg:ml-64"> // Match sidebar width
```

### Add New Nav Item
Edit `app/(admin)/admin/components/AdminSidebar.tsx`:
```tsx
const navigation: NavItem[] = [
  // ... existing items
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: <svg>...</svg>,
  },
];
```

### Change Color Scheme
Edit Tailwind classes:
```tsx
// Primary color (pink)
from-primary to-pink-400

// Change to blue
from-blue-500 to-blue-400
```

---

## ✅ Quick Reference

### URLs
- Dashboard: `/admin`
- Services: `/admin/services`
- Categories: `/admin/categories`
- Bookings: `/admin/bookings`
- Users: `/admin/users`
- Settings: `/admin/settings`

### Keyboard Shortcuts
- **Escape**: Close modals
- **Tab**: Navigate form fields
- **Enter**: Submit forms

### Mobile Gestures
- **Tap ☰**: Open sidebar
- **Swipe left**: Close sidebar (on backdrop)
- **Tap outside**: Close sidebar

---

**🌸 Enjoy your new professional admin panel!**

