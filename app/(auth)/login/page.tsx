'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { login } from './actions';
import Link from 'next/link';
import { useLanguage } from '@/app/contexts/LanguageContext';

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useLanguage();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 px-4 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? t('auth.login.loading') : t('auth.login.submit')}
    </button>
  );
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';
  const [state, formAction] = useActionState(login, {});
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-primary/10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-sakura text-secondary mb-2">
          {t('auth.login.title')}
        </h1>
        <p className="text-secondary/70 text-sm">
          {t('auth.login.subtitle')}
        </p>
      </div>

      {/* Login Form */}
      <form action={formAction} className="space-y-5">
        {/* Hidden field for redirect */}
        <input type="hidden" name="redirectTo" value={from} />
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-secondary mb-2">
            {t('nav.email') || 'Email'}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={`w-full px-4 py-2.5 rounded-lg border-2 focus:ring-2 focus:ring-primary/20 outline-none transition-colors ${
              state?.errors?.email
                ? 'border-red-300 focus:border-red-500'
                : 'border-primary/20 focus:border-primary'
            }`}
            placeholder={t('auth.login.emailPlaceholder')}
          />
          {state?.errors?.email && (
            <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-semibold text-secondary">
              {t('auth.login.password')}
            </label>
            <span
              className="text-xs text-secondary/50 cursor-not-allowed"
              aria-disabled
              title="Coming soon"
            >
              {t('auth.login.forgot')}
            </span>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              required
              className={`w-full px-4 py-2.5 pr-10 rounded-lg border-2 focus:ring-2 focus:ring-primary/20 outline-none transition-colors ${
                state?.errors?.password
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-primary/20 focus:border-primary'
              }`}
              placeholder={t('auth.login.passwordPlaceholder')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-2 flex items-center text-secondary/50 hover:text-secondary"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.082.172-2.123.491-3.098M6.3 6.3C8.056 5.158 9.98 4.5 12 4.5c5.523 0 10 4.477 10 10 0 1.69-.42 3.283-1.162 4.684M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {state?.errors?.password && (
            <p className="mt-1 text-sm text-red-600">{state.errors.password[0]}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            className="w-4 h-4 text-primary border-primary/30 rounded focus:ring-primary/20"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-secondary/70">
            {t('auth.login.remember')}
          </label>
        </div>

        {/* Submit Button */}
        <SubmitButton />
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-primary/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-secondary/60">{t('auth.login.or')}</span>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-sm text-secondary/70">
          {t('auth.login.noAccount')}{' '}
          <Link
            href="/register"
            className="text-primary hover:text-pink-600 font-semibold transition-colors"
          >
            {t('auth.login.signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
}

