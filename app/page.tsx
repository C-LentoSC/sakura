'use client';

import {
  Header,
  BackgroundPattern,
  CherryBlossomTrees,
  FallingPetals,
  HeroSection,
  Features,
  GallerySection,
  TestimonialsSection,
  ContactSection,
  Footer,
  Chatbot
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
      <Chatbot />

      <main className="relative z-10 px-0 sm:px-6 lg:mx-8 xl:mx-32 pt-10">
        <div className="max-w-7xl mx-auto w-full py-8 sm:py-0 min-h-screen flex items-center">
          <div className="w-full">
            <HeroSection />
            <Features />
          </div>
        </div>
        <div className="space-y-16 sm:space-y-20 md:space-y-24 lg:space-y-32 mb-16 sm:mb-20 md:mb-24 lg:mb-32">
          <ServicesSection />
          <ExclusiveServices />
          <GallerySection />
          <TestimonialsSection />
          <ContactSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}