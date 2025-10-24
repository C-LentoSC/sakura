'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../constants/currency';
import { getCart, updateQuantity as setCartQuantity, removeItem as removeCartItem } from '../utils/cartStorage';
import {
  Header,
  BackgroundPattern,
  CherryBlossomTrees,
  FallingPetals,
  Footer,
  Chatbot
} from '../components';

// No more mock data. We load from persistent cart storage.

export default function CartPage() {
  const { t } = useLanguage();
  const [cartItems, setCartItems] = useState(getCart());
  const [mounted, setMounted] = useState(false);

  // Load cart on mount and when storage changes (multi-tab support)
  useEffect(() => {
    setMounted(true);
    const load = () => setCartItems(getCart());
    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'sakura-cart') load();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartQuantity(id, Math.max(0, newQuantity));
    setCartItems(getCart());
  };

  const removeItem = (id: number) => {
    removeCartItem(id);
    setCartItems(getCart());
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 99;
  const total = subtotal + shipping;

  if (!mounted) {
    // Avoid hydration mismatch: render nothing until client mount
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <BackgroundPattern />
      <CherryBlossomTrees />
      <FallingPetals />
      <Header />
      <Chatbot />

      <div className="absolute inset-0 bg-pink-100/20 backdrop-blur-xs pointer-events-none z-0" />

      <main className="flex-1 relative z-10 pt-20 sm:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-sakura text-secondary mb-4">
              {t('shop.cart.title')}
            </h1>
            <p className="text-base sm:text-lg text-secondary/70 leading-relaxed">
              {t('shop.cart.subtitle')}
            </p>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-sakura text-secondary mb-4">{t('shop.cart.empty')}</h3>
              <p className="text-secondary/60 mb-8">{t('shop.cart.emptyMessage')}</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {t('shop.cart.continueShopping')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md border border-primary/10 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Product Image */}
                      <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 128px"
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="mb-4 sm:mb-0">
                            <h3 className="text-lg font-semibold text-secondary mb-2">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-primary">
                                {formatCurrency(item.price)}
                              </span>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-primary/20 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-3 py-2 text-primary hover:bg-primary/10 transition-colors"
                              >
                                -
                              </button>
                              <span className="px-4 py-2 font-semibold text-secondary">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-2 text-primary hover:bg-primary/10 transition-colors"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-primary/10 sticky top-24">
                  <h3 className="text-xl font-sakura text-secondary mb-6">{t('shop.cart.title')}</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-secondary/70">{t('shop.cart.subtotal')}</span>
                      <span className="font-semibold text-secondary">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary/70">{t('shop.cart.shipping')}</span>
                      <span className="font-semibold text-secondary">
                        {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                      </span>
                    </div>
                    {shipping === 0 && (
                      <p className="text-xs text-green-600">{t('shop.cart.freeShipping')}</p>
                    )}
                    <div className="border-t border-primary/10 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-secondary">{t('shop.cart.total')}</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full px-6 py-4 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 mb-4 text-center"
                  >
                    {t('shop.cart.proceedCheckout')}
                  </Link>

                  <Link
                    href="/shop"
                    className="block w-full px-6 py-3 text-center border-2 border-primary text-primary font-medium rounded-xl hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    {t('shop.cart.continueShopping')}
                  </Link>

                  {/* Security Badge */}
                  <div className="mt-6 pt-6 border-t border-primary/10">
                    <div className="flex items-center gap-2 text-xs text-secondary/60">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>{t('shop.cart.secureCheckout')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
