'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatCurrency } from '../../constants/currency';
import {
  Header,
  BackgroundPattern,
  CherryBlossomTrees,
  FallingPetals,
  Footer,
  Chatbot
} from '../../components';

interface Service {
  id: string;
  nameKey: string;
  descKey: string;
  nameEn?: string | null;
  nameJa?: string | null;
  descEn?: string | null;
  descJa?: string | null;
  price: number;
  duration: string;
  image: string;
  category: {
    id: string;
    slug: string;
    nameKey: string;
    nameEn?: string | null;
    nameJa?: string | null;
  };
  subCategory?: {
    id: string;
    slug: string;
    nameKey: string;
    nameEn?: string | null;
    nameJa?: string | null;
  };
}

export default function ServiceDetailPage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'benefits'>('description');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${serviceId}?lang=${language}`);
        if (response.ok) {
          const data = await response.json();
          setService(data);
        } else {
          setService(null);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId, language]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
        <BackgroundPattern />
        <CherryBlossomTrees />
        <FallingPetals />
        <Header />
        <main className="flex-1 relative z-10 pt-20 sm:pt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4 animate-pulse">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/10" />
                <div className="flex gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-20 h-20 rounded-lg bg-secondary/10" />
                  ))}
                </div>
              </div>
              <div className="space-y-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-secondary/10 rounded w-32" />
                  <div className="h-8 bg-secondary/10 rounded w-3/4" />
                </div>
                <div className="flex gap-4 items-center">
                  <div className="h-8 bg-secondary/10 rounded w-40" />
                  <div className="h-8 bg-secondary/10 rounded w-28" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-secondary/10 rounded w-full" />
                  <div className="h-3 bg-secondary/10 rounded w-5/6" />
                  <div className="h-3 bg-secondary/10 rounded w-2/3" />
                </div>
                <div className="space-y-3">
                  <div className="h-12 bg-secondary/10 rounded w-full" />
                  <div className="h-12 bg-secondary/10 rounded w-full" />
                </div>
                <div className="border-b border-primary/10" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 bg-secondary/10 rounded-2xl h-20" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
        <BackgroundPattern />
        <CherryBlossomTrees />
        <FallingPetals />
        <Header />
        <main className="flex-1 relative z-10 pt-20 sm:pt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-16 text-center">
            <h1 className="text-4xl font-sakura text-secondary mb-4">Service Not Found</h1>
            <p className="text-secondary/70 mb-8">The service you are looking for does not exist.</p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Back to Services
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Helpers for i18n fallbacks
  const getDisplayText = (key: string, translate: (k: string) => string) => {
    const translated = translate(key);
    if (translated && translated !== key) return translated;
    const parts = (key || '').split('.');
    const last = parts[parts.length - 1] || '';
    // Prefer the entity segment before the field name when keys end with .name/.description
    const candidate = (last === 'name' || last === 'description') && parts.length >= 2
      ? parts[parts.length - 2]
      : last;
    return candidate.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getServiceName = (s: Service) => {
    const val = language === 'ja' ? s.nameJa || s.nameEn : s.nameEn || s.nameJa;
    if (val && String(val).trim().length > 0) return String(val);
    return getDisplayText(s.nameKey, t);
  };

  const getServiceDesc = (s: Service) => {
    const val = language === 'ja' ? s.descJa || s.descEn : s.descEn || s.descJa;
    if (val && String(val).trim().length > 0) return String(val);
    return getDisplayText(s.descKey, t);
  };

  const renderName = (r: { nameKey: string; nameEn?: string | null; nameJa?: string | null }) => {
    const val = language === 'ja' ? r.nameJa || r.nameEn : r.nameEn || r.nameJa;
    if (val && String(val).trim().length > 0) return String(val);
    return getDisplayText(r.nameKey, t);
  };

  // Mock additional images (in real app, these would come from the service data)
  const serviceImages = [service.image, service.image, service.image];

  const serviceName = getServiceName(service);
  const serviceDesc = getServiceDesc(service);
  const categoryName = renderName(service.category);

  const handleBookNow = () => {
    // Store service data in sessionStorage for booking page
    sessionStorage.setItem('selectedService', JSON.stringify({
      id: service.id,
      name: serviceName,
      price: service.price,
      duration: service.duration,
      image: service.image
    }));
    
    // Redirect to booking page (you'll need to create this)
    router.push('/booking');
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <BackgroundPattern />
      <CherryBlossomTrees />
      <FallingPetals />
      <Header />
      <Chatbot />

      <div className="absolute inset-0 bg-pink-100/20 backdrop-blur-xs pointer-events-none z-0" />

      <main className="flex-1 relative z-10 pt-20 sm:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-secondary/60 mb-8">
            <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
            <span>/</span>
            <Link href={`/services?category=${service.category.slug}`} className="hover:text-primary transition-colors">
              {categoryName}
            </Link>
            <span>/</span>
            <span className="text-secondary">{serviceName}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Service Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                <Image
                  src={serviceImages[selectedImage]}
                  alt={serviceName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-4">
                {serviceImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index ? 'border-primary shadow-lg' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${serviceName} ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Service Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-primary font-medium mb-2">{categoryName}</p>
                <h1 className="text-3xl sm:text-4xl font-sakura text-secondary mb-4">
                  {serviceName}
                </h1>
                
                {/* Price & Duration */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-2xl sm:text-3xl font-bold text-primary">{formatCurrency(service.price)}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-pink-50 to-rose-50 rounded-full">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-secondary font-medium">{service.duration}</span>
                  </div>
                </div>

                <p className="text-secondary/70 leading-relaxed mb-6">
                  {serviceDesc}
                </p>
              </div>

              {/* Book Now Button */}
              <div className="space-y-4">
                <button
                  onClick={handleBookNow}
                  className="w-full px-8 py-4 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300"
                >
                  Book Now
                </button>
                
                <Link
                  href="/services"
                  className="block w-full px-8 py-4 text-center bg-white border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 hover:scale-[1.02] active:scale-95 transition-all duration-300"
                >
                  Browse More Services
                </Link>
              </div>

              {/* Service Details Tabs */}
              <div className="mt-12">
                <div className="border-b border-primary/20">
                  <nav className="flex gap-8">
                    <button 
                      onClick={() => setActiveTab('description')}
                      className={`py-4 border-b-2 transition-colors ${
                        activeTab === 'description' 
                          ? 'border-primary text-primary font-medium' 
                          : 'border-transparent text-secondary/60 hover:text-secondary'
                      }`}
                    >
                      Description
                    </button>
                    <button 
                      onClick={() => setActiveTab('details')}
                      className={`py-4 border-b-2 transition-colors ${
                        activeTab === 'details' 
                          ? 'border-primary text-primary font-medium' 
                          : 'border-transparent text-secondary/60 hover:text-secondary'
                      }`}
                    >
                      Details
                    </button>
                    <button 
                      onClick={() => setActiveTab('benefits')}
                      className={`py-4 border-b-2 transition-colors ${
                        activeTab === 'benefits' 
                          ? 'border-primary text-primary font-medium' 
                          : 'border-transparent text-secondary/60 hover:text-secondary'
                      }`}
                    >
                      Benefits
                    </button>
                  </nav>
                </div>
                
                <div className="py-6">
                  {activeTab === 'description' && (
                    <div className="space-y-4">
                      <p className="text-secondary/80 leading-relaxed">
                        {serviceDesc}
                      </p>
                      <p className="text-secondary/80 leading-relaxed">
                        Our experienced professionals use premium products and techniques to ensure you receive the best care possible. Each session is tailored to your specific needs and preferences.
                      </p>
                    </div>
                  )}
                  
                  {activeTab === 'details' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10">
                        <h4 className="font-sakura text-lg text-secondary mb-2">Duration</h4>
                        <p className="text-sm text-secondary/80">{service.duration}</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10">
                        <h4 className="font-sakura text-lg text-secondary mb-2">Price</h4>
                        <p className="text-sm text-secondary/80">{formatCurrency(service.price)}</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10">
                        <h4 className="font-sakura text-lg text-secondary mb-2">Category</h4>
                        <p className="text-sm text-secondary/80">{categoryName}</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10">
                        <h4 className="font-sakura text-lg text-secondary mb-2">Booking</h4>
                        <p className="text-sm text-secondary/80">Appointment required</p>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'benefits' && (
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-secondary">Professional service by experienced specialists</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-secondary">Premium quality products and materials</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-secondary">Relaxing and comfortable environment</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-secondary">Personalized consultation and care</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-secondary">Long-lasting results and satisfaction guaranteed</span>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
