export type CurrencyCode =
  | 'LKR'
  | 'USD'
  | 'INR'
  | 'JPY'
  | 'EUR'
  | 'GBP'
  | 'AUD'
  | 'CAD'
  | 'SGD'
  | 'MYR'
  | 'AED';

// You can change these two values anytime (or use env vars below)
const DEFAULT_CODE: CurrencyCode = 'LKR';
const DEFAULT_LOCALE = 'en-LK';

export const currencyConfig = {
  // Prefer env if provided; otherwise fall back to defaults above
  code: (process.env.NEXT_PUBLIC_CURRENCY as CurrencyCode) || DEFAULT_CODE,
  locale: process.env.NEXT_PUBLIC_CURRENCY_LOCALE || DEFAULT_LOCALE,
};

// Helper to decide fraction digits per currency (LKR/JPY typically 0)
const zeroDecimalCurrencies = new Set<CurrencyCode>(['LKR', 'JPY']);

export function formatCurrency(amount: number): string {
  const maximumFractionDigits = zeroDecimalCurrencies.has(currencyConfig.code)
    ? 0
    : 2;
  return new Intl.NumberFormat(currencyConfig.locale, {
    style: 'currency',
    currency: currencyConfig.code,
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(amount);
}
