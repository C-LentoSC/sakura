'use client';

import { useActionState } from 'react';
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
            placeholder="your.email@example.com"
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
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:text-pink-600 transition-colors"
            >
              {t('auth.login.forgot')}
            </Link>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            required
            className={`w-full px-4 py-2.5 rounded-lg border-2 focus:ring-2 focus:ring-primary/20 outline-none transition-colors ${
              state?.errors?.password
                ? 'border-red-300 focus:border-red-500'
                : 'border-primary/20 focus:border-primary'
            }`}
            placeholder="••••••••"
          />
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

