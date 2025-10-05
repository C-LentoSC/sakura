# Project Structure

This document outlines the folder structure and organization of the Sakura Salon application following Next.js best practices.

## Folder Structure

```
app/
├── components/           # Reusable UI components
│   ├── Header.tsx       # Navigation header with mobile menu
│   ├── BackgroundPattern.tsx  # SVG background pattern
│   ├── CherryBlossomTrees.tsx # Decorative tree images
│   ├── FallingPetals.tsx     # Animated falling petals
│   ├── HeroSection.tsx       # Main hero section with title and CTA
│   ├── Features.tsx          # Feature cards section
│   └── index.ts             # Component exports barrel file
│
├── constants/           # Application constants
│   └── index.ts        # Petal animations, features data, SVG patterns
│
├── types/              # TypeScript type definitions
│   └── index.ts       # PetalAnimation, Feature interfaces
│
├── layout.tsx         # Root layout with fonts and metadata
├── page.tsx           # Home page (clean, uses components)
└── globals.css        # Global styles and Tailwind config

public/
├── fonts/             # Custom fonts
└── sakura-saloon-images/  # Images and assets
```

## Design Principles

### 1. **Separation of Concerns**
- Each component has a single responsibility
- Business logic separated from presentation
- Constants extracted from components

### 2. **Component Organization**
- **Presentational Components**: Pure UI components (Features, HeroSection)
- **Layout Components**: Structure components (Header, BackgroundPattern)
- **Decorative Components**: Visual enhancement (FallingPetals, CherryBlossomTrees)

### 3. **Type Safety**
- TypeScript interfaces defined in `types/`
- Proper typing for all props and data structures

### 4. **Maintainability**
- Constants centralized for easy updates
- Barrel exports for cleaner imports
- Small, focused components

## Component Breakdown

### Page Level (`page.tsx`)
- **Role**: Route definition and layout composition
- **Size**: ~26 lines (reduced from 200 lines)
- **Responsibility**: Compose components, no business logic

### Components

#### `Header.tsx`
- Navigation with mobile menu
- Login/Register links
- Language selector

#### `BackgroundPattern.tsx`
- SVG pattern background
- Uses constant from `constants/index.ts`

#### `CherryBlossomTrees.tsx`
- Decorative tree images (left and right)
- Responsive visibility (hidden on mobile)

#### `FallingPetals.tsx`
- Animated petal elements
- Uses `PETAL_ANIMATIONS` constant
- Configurable animation timing

#### `HeroSection.tsx`
- Main title and tagline
- Call-to-action buttons
- Decorative elements

#### `Features.tsx`
- Feature cards grid
- Uses `FEATURES` constant
- Responsive layout

## Constants

### `PETAL_ANIMATIONS`
Array of petal animation configurations with position, delay, and duration.

### `FEATURES`
Array of feature objects with icon, title, description, and SVG path.

### `MAGIC_PATTERN_SVG`
SVG background pattern as data URI.

## Best Practices Applied

1. ✅ **Component Composition**: Small, reusable components
2. ✅ **Single Responsibility**: Each component does one thing well
3. ✅ **DRY Principle**: No repeated code, constants extracted
4. ✅ **Type Safety**: TypeScript interfaces for all data
5. ✅ **Clean Imports**: Barrel exports for better developer experience
6. ✅ **Separation of Concerns**: UI, logic, and data separated
7. ✅ **Maintainability**: Easy to find and update code
8. ✅ **Scalability**: Easy to add new features and components

## Future Improvements

- Add `lib/` folder for utility functions
- Create `hooks/` folder for custom React hooks
- Add `services/` folder for API calls
- Implement `app/(routes)/` for additional pages
- Add unit tests in `__tests__/` folders
