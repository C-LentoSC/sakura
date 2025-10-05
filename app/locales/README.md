# Internationalization (i18n) Guide

This folder contains all language translations for the Sakura Salon website.

## Current Languages

- **English** (`en.json`) - Default
- **Japanese** (`ja.json`) - 日本語

## File Structure

```
locales/
├── config.ts       # Language configuration and setup
├── en.json         # English translations
├── ja.json         # Japanese translations
└── README.md       # This file
```

## How to Add a New Language

### Step 1: Create Translation File

Create a new JSON file with the language code (e.g., `es.json` for Spanish, `fr.json` for French):

```json
{
  "nav": {
    "home": "INICIO",
    "about": "SOBRE NOSOTROS",
    "services": "SERVICIOS",
    "contact": "CONTACTO",
    "login": "Iniciar sesión",
    "register": "Registrarse"
  },
  "hero": {
    "quote": "Donde la belleza florece como flores de cerezo",
    "title": "Sakura",
    "subtitle": "salón",
    "description": "Bienvenido a Sakura Salon...",
    "booking": "RESERVAR AHORA",
    "story": "Ver nuestra historia"
  },
  "features": {
    "premium": {
      "title": "Productos Premium",
      "description": "Productos de belleza orgánicos y naturales"
    },
    "experts": {
      "title": "Estilistas Expertos",
      "description": "Equipo profesional con años de experiencia"
    },
    "relaxing": {
      "title": "Ambiente Relajante",
      "description": "Entorno tranquilo para tu completa relajación"
    }
  }
}
```

### Step 2: Update config.ts

Open `config.ts` and make these changes:

1. **Import the new translation file:**
```typescript
import es from './es.json';
```

2. **Add the language code to the Language type:**
```typescript
export type Language = 'en' | 'ja' | 'es';
```

3. **Add the language to the languages array:**
```typescript
export const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' }
];
```

4. **Add the translation to the translations object:**
```typescript
export const translations: Record<Language, any> = {
  en,
  ja,
  es
};
```

### Step 3: Test

That's it! The language will automatically appear in the language selector dropdown.

## Translation Keys Structure

```
nav.*              - Navigation menu items
hero.*             - Hero section content
features.*.*       - Feature cards (premium, experts, relaxing)
```

## Tips

- Keep the JSON structure consistent across all language files
- Use the same keys in all files
- Test thoroughly after adding a new language
- Consider cultural context when translating
- For right-to-left languages (Arabic, Hebrew), additional CSS may be needed

## Adding New Translation Keys

When adding new features to the website:

1. Add the key to `en.json` first
2. Copy the structure to all other language files
3. Translate the content for each language
4. Use the key in your component: `t('section.key')`

Example:
```typescript
// In your component
const { t } = useLanguage();
<h1>{t('hero.title')}</h1>
```
