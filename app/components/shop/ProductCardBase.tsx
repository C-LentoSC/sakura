'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

export type ProductCardBadgeType = 'Bestseller' | 'New' | 'Sale' | 'Popular' | 'Out of Stock' | null;

export interface ProductCardData {
  id: number | string;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice: number | null;
  image: string;
  inStock?: boolean;
  badge?: string | null;
  badgeType?: ProductCardBadgeType;
}

interface Props {
  product: ProductCardData;
  priceNode: ReactNode;
  actions: ReactNode;
  quickViewHref?: string;
}

export default function ProductCardBase({ product, priceNode, actions, quickViewHref }: Props) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 flex flex-col hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-40 sm:h-44 lg:h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Status Badge - Smaller Pink Style */}
        {product.badge && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-primary/95 to-pink-400/95 backdrop-blur-md px-2 py-1 rounded-full shadow-md">
            <div className="flex items-center gap-1">
              {product.badgeType === 'Bestseller' && (
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
              {product.badgeType === 'New' && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
              {product.badgeType === 'Sale' && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              )}
              {product.badgeType === 'Popular' && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
              {product.badgeType === 'Out of Stock' && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364L18.364 5.636" />
                </svg>
              )}
              <span className="text-[10px] font-semibold text-white uppercase tracking-wide">
                {product.badge}
              </span>
            </div>
          </div>
        )}

        {/* Quick View Icon - Compact */}
        {quickViewHref && (
          <Link
            href={quickViewHref}
            className="absolute bottom-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-md"
          >
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
        )}
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
        {priceNode}

        {/* Actions - More Compact */}
        {actions}
      </div>
    </div>
  );
}
