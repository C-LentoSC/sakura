'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../contexts/LanguageContext';
import { addItem as addCartItem } from '../../utils/cartStorage';
import { formatCurrency } from '../../constants/currency';
import { useProduct } from '../../hooks/useProduct';
import {
  Header,
  BackgroundPattern,
  CherryBlossomTrees,
  FallingPetals,
  Footer,
  Chatbot
} from '../../components';

type ApiProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  image: string;
  inStock: boolean;
  badge: string | null;
  description: string;
};

export default function ProductDetailPage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState<{message: string; show: boolean}>({message: '', show: false});

  // SWR hook for instant loading
  const { product, isLoading: loading } = useProduct(productId, language);

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
              {/* Image skeleton */}
              <div className="space-y-4 animate-pulse">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/10" />
                <div className="flex gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-20 h-20 rounded-lg bg-secondary/10" />
                  ))}
                </div>
              </div>
              {/* Content skeleton */}
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
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!loading && !product) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
        <BackgroundPattern />
        <CherryBlossomTrees />
        <FallingPetals />
        <Header />
        <main className="flex-1 relative z-10 pt-20 sm:pt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-16 text-center">
            <h1 className="text-4xl font-sakura text-secondary mb-4">{t('productDetail.notFound.title')}</h1>
            <p className="text-secondary/70 mb-8">{t('productDetail.notFound.message')}</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              {t('productDetail.notFound.backToShop')}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Mock additional images (use same image as placeholder)
  const productImages = [product?.image || '', product?.image || '', product?.image || ''];

  const addToCart = () => {
    // Persist to localStorage cart
    if (!product) return;
    addCartItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity
    });
    // UI notification
    setNotification({message: `Added ${quantity} x ${product.name} to cart!`, show: true});
    setTimeout(() => setNotification({message: '', show: false}), 3000);
  };

  const buyNow = () => {
    // Create checkout data for direct purchase
    if (!product) return;
    const checkoutData = {
      items: [{
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image
      }],
      total: product.price * quantity,
      type: 'direct_purchase'
    };
    
    // Store in sessionStorage for checkout page
    sessionStorage.setItem('directPurchase', JSON.stringify(checkoutData));
    
    // Redirect to checkout
    router.push('/checkout?type=direct');
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
            <Link href="/shop" className="hover:text-primary transition-colors">{t('nav.shop')}</Link>
            <span>/</span>
            {product && (
              <Link href={`/shop?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
            )}
            <span>/</span>
            <span className="text-secondary">{product ? product.name : ''}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                {product && (
                  <>
                    <Image
                      src={productImages[selectedImage]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    {product.badge && (
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gradient-to-r from-primary/95 to-pink-400/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
                        <div className="flex items-center gap-1.5">
                          {product.badge === 'Bestseller' && (
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                          {product.badge === 'New' && (
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          )}
                          {product.badge === 'Sale' && (
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          )}
                          {product.badge === 'Popular' && (
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                          {product.badge === 'Out of Stock' && (
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
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index ? 'border-primary shadow-lg' : 'border-transparent'
                    }`}
                  >
                    {product && (
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                {product && <p className="text-sm text-primary font-medium mb-2">{product.category}</p>}
                <h1 className="text-3xl sm:text-4xl font-sakura text-secondary mb-4">
                  {product ? product.name : ''}
                </h1>
                
                {/* Price */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {product && (
                    <>
                      <span className="text-2xl sm:text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-lg sm:text-xl text-secondary/40 line-through">{formatCurrency(product.originalPrice)}</span>
                      )}
                      {product.originalPrice && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs sm:text-sm font-semibold rounded">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </>
                  )}
                </div>

                <p className="text-secondary/70 leading-relaxed mb-6">
                  {product ? product.description : ''}
                </p>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-secondary font-medium">{t('shop.product.quantity')}:</span>
                  <div className="flex items-center border border-primary/20 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-primary hover:bg-primary/10 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 font-semibold text-secondary">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-primary hover:bg-primary/10 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={addToCart}
                    disabled={!product || !product.inStock}
                    className={`px-6 py-4 font-semibold rounded-xl transition-all duration-300 ${
                      product && product.inStock
                        ? 'bg-white border-2 border-primary text-primary hover:bg-primary/5 hover:scale-[1.02] active:scale-95'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {product && product.inStock ? t('shop.product.addToCart') : t('shop.product.outOfStock')}
                  </button>
                  
                  <button
                    onClick={buyNow}
                    disabled={!product || !product.inStock}
                    className={`px-6 py-4 font-semibold rounded-xl transition-all duration-300 ${
                      product && product.inStock
                        ? 'bg-gradient-to-r from-primary to-pink-400 text-white hover:shadow-lg hover:scale-[1.02] active:scale-95'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {product && product.inStock ? t('shop.product.buyNow') : t('shop.product.outOfStock')}
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="mt-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10">
                    <h4 className="font-sakura text-lg text-secondary mb-2">{t('shop.product.quantity')}</h4>
                    <p className="text-sm text-secondary/80">{quantity}</p>
                  </div>
                  {product && (
                    <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10">
                      <h4 className="font-sakura text-lg text-secondary mb-2">Category</h4>
                      <p className="text-sm text-secondary/80">{product.category}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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
