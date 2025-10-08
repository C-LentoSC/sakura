'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../constants/currency';
import { addItem as addCartItem, getTotalQuantity } from '../utils/cartStorage';
import {
  Header,
  BackgroundPattern,
  CherryBlossomTrees,
  FallingPetals,
  Footer,
  Chatbot
} from '../components';

// Product data with translations
const getProducts = (lang: 'en' | 'ja') => [
  {
    id: 1,
    name: lang === 'ja' ? '日本式ヘアセラム' : 'Japanese Hair Serum',
    category: lang === 'ja' ? 'ヘアケア' : 'Hair Care',
    price: 1299,
    originalPrice: 1599,
    image: '/services-images/head-spa.jpg',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    badge: lang === 'ja' ? 'ベストセラー' : 'Bestseller',
    badgeType: 'Bestseller',
    description: lang === 'ja' ? 'シルクのように滑らかな髪のためのプレミアム日本式ヘアセラム' : 'Premium Japanese hair serum for silky smooth hair'
  },
  {
    id: 2,
    name: lang === 'ja' ? '桜スカルプトリートメントオイル' : 'Sakura Scalp Treatment Oil',
    category: lang === 'ja' ? 'ヘアケア' : 'Hair Care',
    price: 999,
    originalPrice: null,
    image: '/services-images/head-spa2.jpg',
    rating: 4.9,
    reviews: 89,
    inStock: true,
    badge: lang === 'ja' ? '新商品' : 'New',
    badgeType: 'New',
    description: lang === 'ja' ? '桜エキス配合の栄養豊富な頭皮オイル' : 'Nourishing scalp oil with cherry blossom extract'
  },
  {
    id: 3,
    name: lang === 'ja' ? 'ラグジュアリーネイルケアキット' : 'Luxury Nail Care Kit',
    category: lang === 'ja' ? 'ネイルケア' : 'Nail Care',
    price: 1499,
    originalPrice: 1899,
    image: '/services-images/nails.jpg',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    badge: lang === 'ja' ? 'セール' : 'Sale',
    badgeType: 'Sale',
    description: lang === 'ja' ? '完全なプロフェッショナルネイルケアキット' : 'Complete professional nail care kit'
  },
  {
    id: 4,
    name: lang === 'ja' ? 'プレミアムジェルポリッシュセット' : 'Premium Gel Polish Set',
    category: lang === 'ja' ? 'ネイルケア' : 'Nail Care',
    price: 1799,
    originalPrice: null,
    image: '/services-images/beauty-nails.jpg',
    rating: 4.6,
    reviews: 98,
    inStock: true,
    badge: null,
    badgeType: null,
    description: lang === 'ja' ? '12ピースジェルポリッシュコレクション' : '12-piece gel polish collection'
  },
  {
    id: 5,
    name: lang === 'ja' ? 'まつげ育成セラム' : 'Lash Growth Serum',
    category: lang === 'ja' ? 'ビューティー' : 'Beauty',
    price: 1599,
    originalPrice: 1999,
    image: '/services-images/head-spa.jpg',
    rating: 4.9,
    reviews: 203,
    inStock: true,
    badge: lang === 'ja' ? 'ベストセラー' : 'Bestseller',
    badgeType: 'Bestseller',
    description: lang === 'ja' ? 'より長く、より豊かなまつげのための高度な処方' : 'Advanced formula for longer, fuller lashes'
  },
  {
    id: 6,
    name: lang === 'ja' ? 'アイブロウスタイリングキット' : 'Eyebrow Styling Kit',
    category: lang === 'ja' ? 'ビューティー' : 'Beauty',
    price: 899,
    originalPrice: null,
    image: '/services-images/nails.jpg',
    rating: 4.5,
    reviews: 67,
    inStock: true,
    badge: null,
    badgeType: null,
    description: lang === 'ja' ? 'プロフェッショナルな眉毛グルーミングエッセンシャル' : 'Professional eyebrow grooming essentials'
  },
  {
    id: 7,
    name: lang === 'ja' ? 'アロマセラピーエッセンシャルオイル' : 'Aromatherapy Essential Oils',
    category: lang === 'ja' ? 'ウェルネス' : 'Wellness',
    price: 1199,
    originalPrice: 1499,
    image: '/services-images/head-spa2.jpg',
    rating: 4.8,
    reviews: 145,
    inStock: true,
    badge: lang === 'ja' ? '人気' : 'Popular',
    badgeType: 'Popular',
    description: lang === 'ja' ? 'プレミアムエッセンシャルオイル6本セット' : 'Set of 6 premium essential oils'
  },
  {
    id: 8,
    name: lang === 'ja' ? 'シルクヘアマスク' : 'Silk Hair Mask',
    category: lang === 'ja' ? 'ヘアケア' : 'Hair Care',
    price: 799,
    originalPrice: null,
    image: '/services-images/beauty-nails.jpg',
    rating: 4.7,
    reviews: 112,
    inStock: false,
    badge: lang === 'ja' ? '在庫切れ' : 'Out of Stock',
    badgeType: 'Out of Stock',
    description: lang === 'ja' ? 'ディープコンディショニングシルクプロテインマスク' : 'Deep conditioning silk protein mask'
  },
];

// Categories will be translated dynamically

export default function ShopPage() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartQty, setCartQty] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Get products based on current language
  const products = getProducts(language);

  const filteredProducts = products.filter(product => {
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
    const load = () => setCartQty(getTotalQuantity());
    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'sakura-cart') load();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addToCart = (productId: number) => {
    const p = products.find(pr => pr.id === productId);
    if (!p) return;
    // Persist to cart storage
    addCartItem({ id: p.id, name: p.name, price: p.price, image: p.image, quantity: 1 });
    setCartQty(getTotalQuantity());
    // Show toast notification
    setNotification({message: t('shop.product.addToCart') + '!', show: true});
    setTimeout(() => setNotification({message: '', show: false}), 3000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <BackgroundPattern />
      <CherryBlossomTrees />
      <FallingPetals />
      <Header />
      <Chatbot />

      <div className="absolute inset-0 bg-pink-100/20 backdrop-blur-xs pointer-events-none z-0" />

      <main className="relative z-10 pt-20 sm:pt-24">
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
              {cartQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartQty}
                </span>
              )}
            </Link>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
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
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 flex flex-col hover:-translate-y-1"
              >
                {/* Product Image */}
                <div className="relative h-40 sm:h-44 lg:h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Status Badge - Pink Style like ExclusiveServices */}
                  {product.badge && (
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-primary/95 to-pink-400/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
                      <div className="flex items-center gap-1.5">
                        {product.badgeType === 'Bestseller' && (
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        )}
                        {product.badgeType === 'New' && (
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        )}
                        {product.badgeType === 'Sale' && (
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        )}
                        {product.badgeType === 'Popular' && (
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )}
                        {product.badgeType === 'Out of Stock' && (
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364L18.364 5.636" />
                          </svg>
                        )}
                        <span className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wide">
                          {product.badge}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Quick View Icon - Compact */}
                  <Link
                    href={`/shop/${product.id}`}
                    className="absolute bottom-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-md"
                  >
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Link>
                </div>

                {/* Product Info - More Compact */}
                <div className="p-2.5 sm:p-3 flex flex-col">
                  {/* Category */}
                  <p className="text-[10px] text-primary/70 font-medium mb-1 uppercase tracking-wide">{product.category}</p>
                  
                  {/* Product Name */}
                  <h3 className="text-xs sm:text-sm font-medium text-secondary mb-1.5 line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                  
                  {/* Description - Hidden on mobile, compact on desktop */}
                  <p className="hidden lg:block text-[11px] text-secondary/60 mb-2 line-clamp-1 leading-tight">
                    {product.description}
                  </p>

                  {/* Price - More Compact */}
                  <div className="flex flex-wrap items-baseline gap-1 mb-2">
                    <span className="text-base sm:text-lg font-bold text-primary">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-[10px] text-secondary/40 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                        <span className="text-[9px] bg-red-100 text-red-600 px-1 py-0.5 rounded-full font-semibold">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Actions - More Compact */}
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
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
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
