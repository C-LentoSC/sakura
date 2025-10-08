'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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

// Product data with translations
const getProducts = (lang: 'en' | 'ja') => [
  {
    id: 1,
    name: lang === 'ja' ? '日本式ヘアセラム' : 'Japanese Hair Serum',
    category: lang === 'ja' ? 'ヘアケア' : 'Hair Care',
    price: 1299,
    originalPrice: 1599,
    image: '/services-images/head-spa.jpg',
    inStock: true,
    badge: lang === 'ja' ? 'ベストセラー' : 'Bestseller',
    description: lang === 'ja' ? 'シルクのように滑らかな髪のためのプレミアム日本式ヘアセラム' : 'Premium Japanese hair serum for silky smooth hair',
    longDescription: lang === 'ja' ? '本格的な日本のヘアケアの贅沢を体験してください。椿油や米ぬかエキスなどの伝統的な成分で配合されたこのセラムは、毛包の奥深くまで浸透し、ダメージを修復し、ツヤを加え、環境ストレスから保護します。すべての髪質に最適で、特にダメージを受けた髪や化学処理された髪に効果的です。' : 'Experience the luxury of authentic Japanese hair care with our premium hair serum. Formulated with traditional ingredients like camellia oil and rice bran extract, this serum penetrates deep into hair follicles to repair damage, add shine, and protect against environmental stressors. Perfect for all hair types, especially damaged or chemically treated hair.',
    ingredients: lang === 'ja' ? ['椿油', '米ぬかエキス', 'ケラチンプロテイン', 'ビタミンE', 'アルガンオイル'] : ['Camellia Oil', 'Rice Bran Extract', 'Keratin Protein', 'Vitamin E', 'Argan Oil'],
    howToUse: lang === 'ja' ? '湿った髪に2〜3滴を塗布し、中間から毛先に集中させます。通常通りスタイリングしてください。毎日使用できます。' : 'Apply 2-3 drops to damp hair, focusing on mid-lengths and ends. Style as usual. Can be used daily.',
    benefits: lang === 'ja' ? ['ダメージヘアを修復', '自然なツヤを追加', '縮れを軽減', '熱保護', '毛包を強化'] : ['Repairs damaged hair', 'Adds natural shine', 'Reduces frizz', 'Heat protection', 'Strengthens hair follicles']
  },
  {
    id: 2,
    name: 'Sakura Scalp Treatment Oil',
    category: 'Hair Care',
    price: 999,
    originalPrice: null,
    image: '/services-images/head-spa2.jpg',
    rating: 4.9,
    reviews: 89,
    inStock: true,
    badge: 'New',
    description: 'Nourishing scalp oil with cherry blossom extract',
    longDescription: 'Indulge in the therapeutic benefits of cherry blossom with our signature scalp treatment oil. This lightweight formula absorbs quickly to nourish the scalp, promote healthy hair growth, and provide a relaxing aromatherapy experience.',
    ingredients: ['Cherry Blossom Extract', 'Jojoba Oil', 'Peppermint Oil', 'Tea Tree Oil', 'Rosemary Extract'],
    howToUse: 'Massage gently into scalp before washing. Leave for 20 minutes, then shampoo as usual.',
    benefits: ['Promotes hair growth', 'Soothes scalp irritation', 'Improves circulation', 'Aromatherapy benefits', 'Reduces dandruff']
  },
  {
    id: 3,
    name: 'Luxury Nail Care Kit',
    category: 'Nail Care',
    price: 1499,
    originalPrice: 1899,
    image: '/services-images/nails.jpg',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    badge: 'Sale',
    description: 'Complete professional nail care kit',
    longDescription: 'Everything you need for salon-quality nail care at home. This comprehensive kit includes professional-grade tools and premium products for manicures and pedicures.',
    ingredients: ['Cuticle Oil', 'Base Coat', 'Top Coat', 'Nail Strengthener', 'Hand Cream'],
    howToUse: 'Follow included step-by-step guide for professional results at home.',
    benefits: ['Professional results', 'Complete nail care', 'Long-lasting manicures', 'Strengthens nails', 'Moisturizes cuticles']
  },
  // Add more products as needed...
];

export default function ProductDetailPage() {
  const { t, language } = useLanguage();
  const params = useParams();
  const productId = parseInt(params.id as string);
  const products = getProducts(language);
  const product = products.find(p => p.id === productId);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
        <BackgroundPattern />
        <CherryBlossomTrees />
        <FallingPetals />
        <Header />
        <main className="relative z-10 pt-20 sm:pt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-16 text-center">
            <h1 className="text-4xl font-sakura text-secondary mb-4">Product Not Found</h1>
            <p className="text-secondary/70 mb-8">The product you're looking for doesn't exist.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Mock additional images (in real app, these would come from the product data)
  const productImages = [product.image, product.image, product.image];

  const addToCart = () => {
    alert(`Added ${quantity} x ${product.name} to cart!`);
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-secondary/60 mb-8">
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-secondary">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                <Image
                  src={productImages[selectedImage]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                {product.badge && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                    product.badge === 'Bestseller' ? 'bg-yellow-400 text-yellow-900' :
                    product.badge === 'New' ? 'bg-green-400 text-green-900' :
                    product.badge === 'Sale' ? 'bg-red-400 text-red-900' :
                    'bg-blue-400 text-blue-900'
                  }`}>
                    {product.badge}
                  </div>
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
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-primary font-medium mb-2">{product.category}</p>
                <h1 className="text-3xl sm:text-4xl font-sakura text-secondary mb-4">
                  {product.name}
                </h1>
                
                {/* Price */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="text-2xl sm:text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-lg sm:text-xl text-secondary/40 line-through">{formatCurrency(product.originalPrice)}</span>
                  )}
                  {product.originalPrice && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs sm:text-sm font-semibold rounded">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                <p className="text-secondary/70 leading-relaxed mb-6">
                  {product.longDescription}
                </p>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-secondary font-medium">Quantity:</span>
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

                <button
                  onClick={addToCart}
                  disabled={!product.inStock}
                  className={`w-full px-8 py-4 font-semibold rounded-xl transition-all duration-300 ${
                    product.inStock
                      ? 'bg-gradient-to-r from-primary to-pink-400 text-white hover:shadow-lg hover:scale-[1.02] active:scale-95'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.inStock ? 'Buy Now' : t('shop.product.outOfStock')}
                </button>
              </div>

              {/* Product Details Tabs */}
              <div className="mt-12">
                <div className="border-b border-primary/20">
                  <nav className="flex gap-8">
                    <button className="py-4 border-b-2 border-primary text-primary font-medium">
                      Benefits
                    </button>
                    <button className="py-4 border-b-2 border-transparent text-secondary/60 hover:text-secondary">
                      Ingredients
                    </button>
                    <button className="py-4 border-b-2 border-transparent text-secondary/60 hover:text-secondary">
                      How to Use
                    </button>
                  </nav>
                </div>
                
                <div className="py-6">
                  <ul className="space-y-2">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-secondary">{benefit}</span>
                      </li>
                    ))}
                  </ul>
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
