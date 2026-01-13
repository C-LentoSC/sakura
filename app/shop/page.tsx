'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../constants/currency';
import { addItem as addCartItem, getTotalQuantity } from '../utils/cartStorage';
import ProductCardBase, { ProductCardData } from '../components/shop/ProductCardBase';
import {
  Header,
  BackgroundPattern,
  CherryBlossomTrees,
  FallingPetals,
  Footer,
  Chatbot
} from '../components';

// Product type
interface Product {
  id: number;
  name: string;
  nameEn: string;
  nameJa: string;
  category: string;
  description: string;
  descEn: string;
  descJa: string;
  price: number;
  originalPrice: number | null;
  image: string;
  inStock: boolean;
  badge: string | null;
  badgeType: string | null;
}

export default function ShopPage() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartQty, setCartQty] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  // Direct state for products
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch products directly
  useEffect(() => {
    setMounted(true);
    setIsLoading(true);
    
    fetch(`/api/products?lang=${language}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data.products || []);
        setError(null);
      })
      .catch(err => {
        console.error('Error loading products:', err);
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [language]);

  // Handle error state
  if (error) {
    console.error('Error loading products:', error);
  }

  const filteredProducts = products.filter((product: Product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { key: 'All', label: t('shop.categories.all') },
    { key: 'Hair Care', label: t('shop.categories.hairCare') },
    { key: 'Nail Care', label: t('shop.categories.nailCare') },
    { key: 'Beauty', label: t('shop.categories.beauty') },
    { key: 'Wellness', label: t('shop.categories.wellness') }
  ];

  const [notification, setNotification] = useState<{message: string; show: boolean}>({message: '', show: false});

  // Load cart quantity from storage
  useEffect(() => {
    setMounted(true);
    const load = () => setCartQty(getTotalQuantity());
    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'sakura-cart') load();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addToCart = (productId: number) => {
    const p = products.find((pr: Product) => pr.id === productId);
    if (!p) return;
    // Persist to cart storage
    addCartItem({ id: p.id, name: p.name, price: p.price, image: p.image, quantity: 1 });
    setCartQty(getTotalQuantity());
    // Show toast notification
    setNotification({message: t('shop.product.addToCart') + '!', show: true});
    setTimeout(() => setNotification({message: '', show: false}), 3000);
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
        {/* Hero Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-sakura text-secondary mb-4">
              {t('shop.hero.title')}
            </h1>
            <p className="text-base sm:text-lg text-secondary/70 leading-relaxed max-w-2xl mx-auto">
              {t('shop.hero.subtitle')}
            </p>
          </div>

          {/* Search and Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder={t('shop.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-secondary bg-white/80 backdrop-blur-sm"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <Link
              href="/cart"
              className="relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {t('shop.cart.title')}
              {mounted && cartQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartQty}
                </span>
              )}
            </Link>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.key
                    ? 'bg-gradient-to-r from-primary to-pink-400 text-white shadow-lg scale-105'
                    : 'bg-white/80 text-secondary hover:bg-white hover:shadow-md'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-12">
            {mounted ? (
              isLoading
                ? [...Array(10)].map((_, i) => (
                    <div key={i} className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md border border-primary/10 animate-pulse">
                      <div className="h-28 sm:h-32 bg-secondary/10" />
                      <div className="p-2 sm:p-3 space-y-2">
                        <div className="h-3 bg-secondary/10 rounded w-4/5" />
                        <div className="h-3 bg-secondary/10 rounded w-2/3" />
                        <div className="h-6 bg-secondary/10 rounded w-1/2" />
                        <div className="h-7 bg-secondary/10 rounded w-full" />
                      </div>
                    </div>
                  ))
                : filteredProducts.map((product) => (
                    <ProductCardBase
                      key={product.id}
                      product={product as unknown as ProductCardData}
                      quickViewHref={`/shop/${product.id}`}
                      priceNode={
                        <div className="flex flex-wrap items-baseline gap-1 mb-2">
                          <span className="text-base sm:text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
                          {product.originalPrice && (
                            <>
                              <span className="text-[10px] text-secondary/40 line-through">{formatCurrency(product.originalPrice)}</span>
                              <span className="text-[9px] bg-red-100 text-red-600 px-1 py-0.5 rounded-full font-semibold">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      }
                      actions={
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => addToCart(product.id)}
                            disabled={!product.inStock}
                            className={`w-full px-2 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-300 ${
                              product.inStock
                                ? 'bg-gradient-to-r from-primary to-pink-400 text-white hover:shadow-md hover:scale-[1.02] active:scale-95'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {product.inStock ? t('shop.product.addToCart') : t('shop.product.outOfStock')}
                          </button>
                          {product.inStock && (
                            <Link
                              href={`/shop/${product.id}`}
                              className="w-full px-2 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold border border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 text-center hover:scale-[1.02] active:scale-95"
                            >
                              Buy Now
                            </Link>
                          )}
                        </div>
                      }
                    />
                  ))
            ) : (
              // Server/render fallback: render same skeletons to avoid hydration mismatch
              [...Array(10)].map((_, i) => (
                <div key={i} className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md border border-primary/10 animate-pulse">
                  <div className="h-28 sm:h-32 bg-secondary/10" />
                  <div className="p-2 sm:p-3 space-y-2">
                    <div className="h-3 bg-secondary/10 rounded w-4/5" />
                    <div className="h-3 bg-secondary/10 rounded w-2/3" />
                    <div className="h-6 bg-secondary/10 rounded w-1/2" />
                    <div className="h-7 bg-secondary/10 rounded w-full" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* No Results */}
          {mounted && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-24 h-24 mx-auto text-secondary/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-2xl font-sakura text-secondary mb-2">{t('shop.noResults.title')}</h3>
              <p className="text-secondary/60">{t('shop.noResults.message')}</p>
            </div>
          )}
        </div>
      </main>

      {/* Toast Notification */}
      {notification.show && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right-2 fade-in duration-300">
          <div className="bg-white/95 backdrop-blur-md border border-primary/20 rounded-xl px-4 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-secondary font-medium text-sm">{notification.message}</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
