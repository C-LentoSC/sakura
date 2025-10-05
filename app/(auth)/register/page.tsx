'use client';

import { useMemo, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../contexts/LanguageContext';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Deterministic pseudo-randoms for petals (SSR/CSR consistent)
  const prng = (i: number) => {
    const x = Math.sin(i * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  const petals = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        left: `${(prng(i) * 100).toFixed(4)}%`,
        top: `${(prng(i + 1) * 100).toFixed(4)}%`,
        delay: `${(prng(i + 2) * 5).toFixed(3)}s`,
        duration: `${(8 + prng(i + 3) * 4).toFixed(3)}s`,
      })),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.register.errors.passwordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('auth.register.errors.passwordMin'));
      return;
    }

    setLoading(true);

    try {
      // Create user via API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: null }));
        const message = (data?.error === 'Email already in use')
          ? t('auth.register.errors.emailInUse')
          : t('auth.register.errors.registrationFailed');
        setError(message);
        return;
      }

      // Auto sign-in after registration
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t('auth.register.errors.signinFailed'));
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError(t('auth.register.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      {/* Cherry Blossom Trees */}
      <div className="fixed left-0 bottom-0 pointer-events-none z-0 opacity-70">
        <Image
          src="/sakura-saloon-images/L4-tree.png"
          alt="Cherry Blossom"
          width={400}
          height={400}
          className="h-64 sm:h-96 w-auto object-contain"
        />
      </div>
      <div className="fixed right-0 top-20 pointer-events-none z-0 opacity-50">
        <Image
          src="/sakura-saloon-images/R2-tree.png"
          alt="Cherry Blossom"
          width={400}
          height={400}
          className="h-64 sm:h-96 w-auto object-contain"
        />
      </div>

      {/* Falling Petals (SSR/CSR consistent) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {petals.map((p, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.duration }}
          >
            <svg className="w-3 h-4 sm:w-4 sm:h-5" viewBox="0 0 20 25">
              <ellipse cx="10" cy="12" rx="8" ry="10" fill="#FFB7C5" opacity="0.4" transform="rotate(15 10 12)" />
            </svg>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/sakura-saloon-images/logo3.png"
                alt="Sakura Salon"
                width={200}
                height={200}
                className="w-20 h-12 sm:w-28 sm:h-16 mx-auto"
              />
            </Link>
            <h1 className="text-3xl sm:text-4xl font-sakura text-secondary mb-2">{t('auth.register.title')}</h1>
            <p className="text-sm text-secondary/60">{t('auth.register.subtitle')}</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50/80 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm backdrop-blur-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary/80 mb-1.5">
                  {t('auth.register.name')}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white/50 border border-pink-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all text-secondary placeholder:text-secondary/30"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary/80 mb-1.5">
                  {t('auth.register.email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white/50 border border-pink-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all text-secondary placeholder:text-secondary/30"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-secondary/80 mb-1.5">
                  {t('auth.register.password')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white/50 border border-pink-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all text-secondary placeholder:text-secondary/30"
                  placeholder="Min. 6 characters"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary/80 mb-1.5">
                  {t('auth.register.confirmPassword')}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white/50 border border-pink-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all text-secondary placeholder:text-secondary/30"
                  placeholder="Confirm password"
                />
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-0.5 text-primary border-pink-300 rounded focus:ring-primary/50"
                />
                <label htmlFor="terms" className="ml-2 text-xs text-secondary/70">
                  {t('auth.register.terms')} {' '}
                  <Link href="/terms" className="text-primary hover:text-primary/80">{t('auth.register.termsLink')}</Link>
                  {' '}{t('auth.register.and')}{' '}
                  <Link href="/privacy" className="text-primary hover:text-primary/80">{t('auth.register.privacyLink')}</Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-primary to-pink-400 text-white rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('auth.register.loading')}
                  </span>
                ) : (
                  t('auth.register.submit')
                )}
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-pink-200/50" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white/60 text-secondary/60">{t('auth.register.or')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 bg-white/70 border border-pink-200/50 rounded-xl text-secondary font-medium hover:bg-white/90 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t('auth.register.continueWithGoogle')}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-secondary/60">
              {t('auth.register.haveAccount')}{' '}
              <Link href="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">
                {t('auth.register.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
