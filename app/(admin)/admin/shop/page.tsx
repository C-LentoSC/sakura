'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { formatCurrency } from '@/app/constants/currency';

interface Product {
  id: number;
  name: string;
  nameEn?: string;
  nameJa?: string;
  category: string;
  price: number;
  originalPrice: number | null;
  image: string;
  inStock: boolean;
  badge: string | null;
  badgeType: string | null;
  description: string;
  descriptionEn?: string;
  descriptionJa?: string;
}

export default function AdminShopPage() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    nameJa: '',
    category: 'Hair Care',
    price: '',
    originalPrice: '',
    image: '',
    inStock: true,
    badge: '',
    badgeType: '',
    description: '',
    descriptionEn: '',
    descriptionJa: '',
  });

  const categories = ['Hair Care', 'Nail Care', 'Beauty', 'Wellness'];
  const badgeTypes = ['', 'Bestseller', 'New', 'Sale', 'Popular', 'Out of Stock'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Japanese Hair Serum',
          nameEn: 'Japanese Hair Serum',
          nameJa: '日本式ヘアセラム',
          category: 'Hair Care',
          price: 1299,
          originalPrice: 1599,
          image: '/services-images/head-spa.jpg',
          inStock: true,
          badge: 'Bestseller',
          badgeType: 'Bestseller',
          description: 'Premium Japanese hair serum for silky smooth hair',
          descriptionEn: 'Premium Japanese hair serum for silky smooth hair',
          descriptionJa: 'シルクのように滑らかな髪のためのプレミアム日本式ヘアセラム',
        },
        {
          id: 2,
          name: 'Sakura Scalp Treatment Oil',
          nameEn: 'Sakura Scalp Treatment Oil',
          nameJa: '桜スカルプトリートメントオイル',
          category: 'Hair Care',
          price: 999,
          originalPrice: null,
          image: '/services-images/head-spa2.jpg',
          inStock: true,
          badge: 'New',
          badgeType: 'New',
          description: 'Nourishing scalp oil with cherry blossom extract',
          descriptionEn: 'Nourishing scalp oil with cherry blossom extract',
          descriptionJa: '桜エキス配合の栄養豊富な頭皮オイル',
        },
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newProduct: Product = {
        id: editingProduct ? editingProduct.id : Date.now(),
        name: formData.name,
        nameEn: formData.nameEn || formData.name,
        nameJa: formData.nameJa,
        category: formData.category,
        price: parseInt(formData.price),
        originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : null,
        image: formData.image || '/services-images/head-spa.jpg',
        inStock: formData.inStock,
        badge: formData.badge || null,
        badgeType: formData.badgeType || null,
        description: formData.description,
        descriptionEn: formData.descriptionEn || formData.description,
        descriptionJa: formData.descriptionJa,
      };

      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
      } else {
        setProducts([...products, newProduct]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameEn: product.nameEn || '',
      nameJa: product.nameJa || '',
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      image: product.image,
      inStock: product.inStock,
      badge: product.badge || '',
      badgeType: product.badgeType || '',
      description: product.description,
      descriptionEn: product.descriptionEn || '',
      descriptionJa: product.descriptionJa || '',
    });
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (id: number, name: string) => {
    setDeleteTarget({ id, name });
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    setLoading(true);
    try {
      setProducts(products.filter(p => p.id !== deleteTarget.id));
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameEn: '',
      nameJa: '',
      category: 'Hair Care',
      price: '',
      originalPrice: '',
      image: '',
      inStock: true,
      badge: '',
      badgeType: '',
      description: '',
      descriptionEn: '',
      descriptionJa: '',
    });
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ja' ? 'ショップ管理' : 'Shop Management'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {language === 'ja' ? 'ショップ製品とオファーを管理します' : 'Manage your shop products and offerings'}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-primary to-pink-400 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {language === 'ja' ? '新しい製品を追加' : 'Add New Product'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-sm shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-pink-400 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">{products.length}</p>
              <p className="text-xs text-gray-500">{language === 'ja' ? '総製品数' : 'Total Products'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">{products.filter(p => p.inStock).length}</p>
              <p className="text-xs text-gray-500">{language === 'ja' ? '在庫あり' : 'In Stock'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-300 to-rose-300 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">{categories.length}</p>
              <p className="text-xs text-gray-500">{language === 'ja' ? 'カテゴリ' : 'Categories'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-200 to-primary rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(products.reduce((avg, p) => avg + p.price, 0) / products.length || 0)}
              </p>
              <p className="text-xs text-gray-500">{language === 'ja' ? '平均価格' : 'Avg. Price'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-sm shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'ja' ? '製品を検索' : 'Search Products'}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ja' ? '名前または説明で検索...' : 'Search by name or description...'}
              className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
            />
          </div>
          <div className="sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'ja' ? 'カテゴリで絞り込み' : 'Filter by Category'}
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
            >
              <option value="">{language === 'ja' ? 'すべてのカテゴリ' : 'All Categories'}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-sm shadow-md">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'ja' ? '製品一覧' : 'Products List'}
            </h2>
            <div className="text-sm text-gray-500">
              {loading ? 'Loading...' : `${filteredProducts.length} of ${products.length} products`}
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-sm flex items-center justify-center mx-auto mb-4 shadow-sm animate-pulse">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterCategory
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first product.'}
            </p>
            {!searchQuery && !filterCategory && (
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-primary to-pink-400 text-white font-medium rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all"
              >
                + Add Your First Product
              </button>
            )}
          </div>
        ) : (
          <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
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
                      onClick={() => handleEdit(product)}
                      className="w-full px-2 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-300 bg-gradient-to-r from-primary to-pink-400 text-white hover:shadow-md hover:scale-[1.02] active:scale-95"
                    >
                      {language === 'ja' ? '編集' : 'Edit'}
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(product.id, product.name)}
                      className="w-full px-2 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold border border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 text-center hover:scale-[1.02] active:scale-95"
                    >
                      {language === 'ja' ? '削除' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct 
                  ? (language === 'ja' ? '製品を編集' : 'Edit Product')
                  : (language === 'ja' ? '新しい製品を追加' : 'Add New Product')
                }
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(90vh-100px)] overflow-y-auto">
              {/* Product Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ja' ? '製品名（英語）' : 'Product Name (English)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({...formData, nameEn: e.target.value, name: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ja' ? '製品名（日本語）' : 'Product Name (Japanese)'}
                  </label>
                  <input
                    type="text"
                    value={formData.nameJa}
                    onChange={(e) => setFormData({...formData, nameJa: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ja' ? 'カテゴリ' : 'Category'} *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ja' ? 'バッジタイプ' : 'Badge Type'}
                  </label>
                  <select
                    value={formData.badgeType}
                    onChange={(e) => setFormData({...formData, badgeType: e.target.value, badge: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    {badgeTypes.map(type => (
                      <option key={type} value={type}>{type || 'None'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ja' ? '価格（円）' : 'Price (¥)'} *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ja' ? '元の価格（円）' : 'Original Price (¥)'}
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ja' ? '在庫状況' : 'Stock Status'}
                  </label>
                  <select
                    value={formData.inStock ? 'true' : 'false'}
                    onChange={(e) => setFormData({...formData, inStock: e.target.value === 'true'})}
                    className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option value="true">{language === 'ja' ? '在庫あり' : 'In Stock'}</option>
                    <option value="false">{language === 'ja' ? '在庫切れ' : 'Out of Stock'}</option>
                  </select>
                </div>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ja' ? '画像URL' : 'Image URL'}
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="/services-images/product.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ja' ? '説明（英語）' : 'Description (English)'} *
                </label>
                <textarea
                  required
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({...formData, descriptionEn: e.target.value, description: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ja' ? '説明（日本語）' : 'Description (Japanese)'}
                </label>
                <textarea
                  value={formData.descriptionJa}
                  onChange={(e) => setFormData({...formData, descriptionJa: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {language === 'ja' ? 'キャンセル' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-pink-400 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? (language === 'ja' ? '保存中...' : 'Saving...') : (language === 'ja' ? '保存' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmOpen && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {language === 'ja' ? '製品を削除' : 'Delete Product'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'ja' 
                ? `「${deleteTarget.name}」を削除してもよろしいですか？この操作は元に戻せません。`
                : `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setDeleteTarget(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {language === 'ja' ? 'キャンセル' : 'Cancel'}
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? (language === 'ja' ? '削除中...' : 'Deleting...') : (language === 'ja' ? '削除' : 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
