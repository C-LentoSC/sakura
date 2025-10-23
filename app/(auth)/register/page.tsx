'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { register } from './actions';
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
      {pending ? t('auth.register.loading') : t('auth.register.submit')}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(register, {});
  const { t } = useLanguage();
  const [password, setPassword] = useState('');

  // Simple password strength indicator
  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { label: '', color: '' };
    if (pwd.length < 6) return { label: 'Weak', color: 'text-red-500' };
    if (pwd.length < 10) return { label: 'Good', color: 'text-yellow-500' };
    return { label: 'Strong', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-primary/10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-sakura text-secondary mb-2">
          {t('auth.register.title')}
        </h1>
        <p className="text-secondary/70 text-sm">
          {t('auth.register.subtitle')}
        </p>
      </div>

      {/* Registration Form */}
      <form action={formAction} className="space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-secondary mb-2">
            {t('auth.register.name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className={`w-full px-4 py-2.5 rounded-lg border-2 focus:ring-2 focus:ring-primary/20 outline-none transition-colors ${
              state?.errors?.name
                ? 'border-red-300 focus:border-red-500'
                : 'border-primary/20 focus:border-primary'
            }`}
            placeholder={t('auth.register.namePlaceholder')}
          />
          {state?.errors?.name && (
            <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-secondary mb-2">
            {t('auth.register.email')}
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
            placeholder={t('auth.register.emailPlaceholder')}
          />
          {state?.errors?.email && (
            <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-secondary mb-2">
            {t('auth.register.password')}
          </label>
          <div className="relative">
            <input
              type={password ? 'password' : 'password'}
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2.5 pr-10 rounded-lg border-2 focus:ring-2 focus:ring-primary/20 outline-none transition-colors ${
                state?.errors?.password
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-primary/20 focus:border-primary'
              }`}
              placeholder={t('auth.register.passwordPlaceholder')}
            />
            {/* Simple visibility toggle could be added later if needed */}
          </div>
          {password && passwordStrength.label && (
            <p className={`mt-1 text-xs ${passwordStrength.color}`}>
              {passwordStrength.label}
            </p>
          )}
          {state?.errors?.password && (
            <p className="mt-1 text-sm text-red-600">{state.errors.password[0]}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-secondary mb-2">
            {t('auth.register.confirmPassword')}
          </label>
          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              className={`w-full px-4 py-2.5 pr-10 rounded-lg border-2 focus:ring-2 focus:ring-primary/20 outline-none transition-colors ${
                state?.errors?.confirmPassword
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-primary/20 focus:border-primary'
              }`}
              placeholder={t('auth.register.confirmPasswordPlaceholder')}
            />
          </div>
          {state?.errors?.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{state.errors.confirmPassword[0]}</p>
          )}
        </div>

        {/* Terms and Privacy */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            required
            className="w-4 h-4 mt-1 text-primary border-primary/30 rounded focus:ring-primary/20"
          />
          <label htmlFor="terms" className="ml-2 text-xs text-secondary/70">
            {t('auth.register.terms')}{' '}
            <Link href="/terms-of-service" className="text-primary hover:text-pink-600">
              {t('auth.register.termsLink')}
            </Link>{' '}
            {t('auth.register.and')}{' '}
            <Link href="/privacy-policy" className="text-primary hover:text-pink-600">
              {t('auth.register.privacyLink')}
            </Link>
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
          <span className="px-4 bg-white text-secondary/60">{t('auth.register.or')}</span>
        </div>
      </div>

      {/* Sign In Link */}
      <div className="text-center">
        <p className="text-sm text-secondary/70">
          {t('auth.register.haveAccount')}{' '}
          <Link
            href="/login"
            className="text-primary hover:text-pink-600 font-semibold transition-colors"
          >
            {t('auth.register.signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
}

