'use client';

import {
  Header,
  BackgroundPattern,
  CherryBlossomTrees,
  FallingPetals,
  HeroSection,
  Features
} from './components';
import ServicesSection from './components/ServicesSection';
import ExclusiveServices from './components/ExclusiveServices';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <BackgroundPattern />
      <CherryBlossomTrees />
      <FallingPetals />
      <Header />

      <main className="relative z-10 px-0 sm:px-6 lg:mx-8 xl:mx-32 pt-10">
        <div className="max-w-7xl mx-auto w-full py-8 sm:py-0 min-h-screen flex items-center">
          <div className="w-full">
            <HeroSection />
            <Features />
          </div>
        </div>
        <ServicesSection />
        <ExclusiveServices />
      </main>
    </div>
  );
}