# Sakura Saloon

A modern beauty salon booking and e-commerce platform built with Next.js, Prisma, and Stripe.

## Features

- Service Booking System: Schedule appointments with real-time availability
- Admin Dashboard: Manage services, bookings, users, and inventory
- E-Commerce Shop: Browse and purchase beauty products
- User Authentication: Secure login and registration
- Payment Integration: Stripe for secure payment processing
- Multi-Language Support: English and Japanese localization
- Responsive Design: Mobile-friendly interface

## Technology Stack

- Frontend: Next.js 15.5.4, React, TypeScript
- Database: Prisma ORM with SQLite
- Styling: Tailwind CSS
- Payment: Stripe API
- Hosting: Netlify
- Build Tool: Turbopack

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ZERO-DAWN-X/sakura-saloon-zero.git
cd sakura-saloon-zero
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables by creating a `.env.local` file with required variables

4. Set up the database:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

6. Open http://localhost:3000 in your browser

## Project Structure

```
app/
  (admin)/        - Admin dashboard pages
  (auth)/         - Authentication pages
  (protected)/    - Protected user pages
  api/            - API routes
  components/     - Reusable UI components
  hooks/          - Custom React hooks
  utils/          - Utility functions
  constants/      - App constants
  types/          - TypeScript types

prisma/
  schema.prisma   - Database schema
  seed.ts         - Database seeding

public/           - Static assets
```

## Key Features

### Service Booking
- Browse available services
- View time slot availability
- Book appointments
- Cancel or reschedule bookings

### Admin Panel
- Create and manage services
- Manage product inventory
- View and handle booking requests
- User management
- Business settings

### Shopping
- Product catalog with categories
- Shopping cart functionality
- Secure checkout with Stripe
- Order history

## Development

### Build
```bash
npm run build
```

### Database Management

View data in Prisma Studio:
```bash
npx prisma studio
```

Reset database:
```bash
npx prisma migrate reset
```

## API Routes

- `/api/services` - Public services list
- `/api/admin/services` - Admin services management
- `/api/bookings` - Booking operations
- `/api/products` - Product management
- `/api/auth` - Authentication endpoints

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

This project is proprietary software.