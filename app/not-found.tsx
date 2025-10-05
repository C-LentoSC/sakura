import Link from 'next/link';
import { Header, BackgroundPattern, FallingPetals } from './components';

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <BackgroundPattern />
      <FallingPetals />
      <Header />

      <main className="relative z-10 flex items-center justify-center px-4 sm:px-8 lg:px-12 py-24 sm:py-32 md:py-40">
        {/* Giant backdrop 404 */}
        <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center">
          <span className="font-sans text-[28vw] sm:text-[22vw] md:text-[18vw] lg:text-[14vw] font-black tracking-tighter text-secondary/5 leading-none">
            404
          </span>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm sm:text-base mb-8">
            <span>404</span>
            <span className="w-1 h-1 rounded-full bg-secondary/40" />
            <span>Page not found</span>
          </div>

          <h1 className="font-sakura text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-secondary tracking-wide drop-shadow-sm">
            Lost among the blossoms
          </h1>
          <p className="mt-6 sm:mt-8 text-secondary/70 text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
            The page you’re looking for doesn’t exist or has been moved. Let’s guide you back
            to a peaceful place.
          </p>

          <div className="mt-10 sm:mt-12 md:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Link
              href="/"
              className="px-7 sm:px-9 md:px-12 py-3.5 sm:py-4 md:py-5 text-lg sm:text-xl bg-gradient-to-r from-primary to-pink-400 text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Go to Home
            </Link>
            <Link
              href="/services"
              className="px-7 sm:px-9 md:px-12 py-3.5 sm:py-4 md:py-5 text-lg sm:text-xl bg-secondary/10 text-secondary rounded-full font-medium hover:bg-secondary/20 transition-all duration-300"
            >
              View Services
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
