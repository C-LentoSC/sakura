'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { formatCurrency } from '@/app/constants/currency';
import ProductCardBase, { ProductCardData } from '@/app/components/shop/ProductCardBase';
import ImageUpload from '@/app/components/ImageUpload';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ price?: string; originalPrice?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  // Direct state for products
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products directly
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?lang=${language}`);
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      const fetchedProducts = (data.products || []).map((p: Record<string, unknown>) => ({
        id: p.id as number,
        name: p.name as string,
        nameEn: p.nameEn as string,
        nameJa: p.nameJa as string,
        category: p.category as string,
        price: p.price as number,
        originalPrice: p.originalPrice as number | null,
        image: p.image as string,
        inStock: p.inStock as boolean,
        badge: p.badge as string | null,
        badgeType: p.badgeType as string | null,
        description: p.description as string,
        descriptionEn: p.descEn as string,
        descriptionJa: p.descJa as string,
      }));
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validations
    const priceNum = parseInt(formData.price || '0');
    const origNum = formData.originalPrice ? parseInt(formData.originalPrice) : null;
    const newErrors: { price?: string; originalPrice?: string } = {};
    if (!priceNum || priceNum <= 0) {
      newErrors.price = language === 'ja' ? '価格は0より大きい必要があります。' : 'Price must be greater than 0.';
    }
    if (origNum !== null && priceNum > origNum) {
      newErrors.originalPrice = language === 'ja' ? '価格は元の価格以下である必要があります。' : 'Price must be less than or equal to Original Price.';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({});
    }

    const currentFormData = { ...formData };
    const isEditing = !!editingProduct;
    const editingId = editingProduct?.id;
    
    // Close modal immediately for instant feedback
    setIsModalOpen(false);
    setSubmitting(true);

    try {
      // Upload image if file is selected
      let finalImageUrl = currentFormData.image;
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', selectedFile);
        uploadFormData.append('serviceName', currentFormData.nameEn || currentFormData.name);
        if (finalImageUrl) uploadFormData.append('oldImageUrl', finalImageUrl);
        const uploadRes = await fetch('/api/upload/image', {
          method: 'POST',
          body: uploadFormData,
        });
        if (uploadRes.ok) {
          const { imageUrl } = await uploadRes.json();
          finalImageUrl = imageUrl;
        }
      }

      const productData = {
        nameEn: currentFormData.nameEn || currentFormData.name,
        nameJa: currentFormData.nameJa,
        category: currentFormData.category,
        descEn: currentFormData.descriptionEn || currentFormData.description,
        descJa: currentFormData.descriptionJa,
        price: priceNum,
        originalPrice: origNum,
        image: finalImageUrl || '/services-images/head-spa.jpg',
        inStock: currentFormData.inStock,
        badge: currentFormData.badge || null,
        badgeType: currentFormData.badgeType || null,
      };

      if (isEditing && editingId) {
        // Update existing product
        const res = await fetch(`/api/admin/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
        if (!res.ok) throw new Error('Failed to update product');
      } else {
        // Create new product
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
        if (!res.ok) throw new Error('Failed to create product');
      }

      // Refetch products to get fresh data
      await fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setSubmitting(false);
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

    const idToDelete = deleteTarget.id;
    
    // Close modal immediately for instant feedback
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/products/${idToDelete}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product');

      // Refetch products to get fresh data
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setSubmitting(false);
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
    setSelectedFile(null);
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
          className="px-4 py-2 bg-linear-to-r from-primary to-pink-400 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
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
            <div className="w-10 h-10 bg-linear-to-br from-primary to-pink-400 rounded-lg flex items-center justify-center shadow-md">
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
            <div className="w-10 h-10 bg-linear-to-br from-rose-400 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
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
            <div className="w-10 h-10 bg-linear-to-br from-pink-300 to-rose-300 rounded-lg flex items-center justify-center shadow-md">
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
            <div className="w-10 h-10 bg-linear-to-br from-pink-200 to-primary rounded-lg flex items-center justify-center shadow-md">
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
                className="px-4 py-2 bg-linear-to-r from-primary to-pink-400 text-white font-medium rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all"
              >
                + Add Your First Product
              </button>
            )}
          </div>
        ) : (
          <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCardBase
                key={product.id}
                product={product as unknown as ProductCardData}
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
                      onClick={() => handleEdit(product)}
                      className="w-full px-2 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-300 bg-linear-to-r from-primary to-pink-400 text-white hover:shadow-md hover:scale-[1.02] active:scale-95"
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
                }
              />
            ))}
          </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => { setIsModalOpen(false); resetForm(); }}>
          <div className="bg-white rounded-lg max-w-3xl w-full my-8" onClick={(e) => e.stopPropagation()}>
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
                    <span className="text-xs text-gray-400 ml-2">
                      {language === 'ja' ? '(アイコンスタイル)' : '(Icon style)'}
                    </span>
                  </label>
                  <select
                    value={formData.badgeType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      // Auto-fill badge label when type is selected (if badge is empty or matches old type)
                      const shouldAutoFill = !formData.badge || 
                        formData.badge.toUpperCase() === formData.badgeType?.toUpperCase() ||
                        badgeTypes.map(t => t.toUpperCase()).includes(formData.badge.toUpperCase());
                      setFormData({
                        ...formData, 
                        badgeType: newType,
                        badge: shouldAutoFill ? (newType || '') : formData.badge
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    {badgeTypes.map(type => (
                      <option key={type} value={type}>{type || 'None'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ja' ? 'バッジラベル' : 'Badge Label'}
                  <span className="text-xs text-gray-400 ml-2">
                    {language === 'ja' ? '(バッジに表示されるテキスト)' : '(Text shown on badge)'}
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({...formData, badge: e.target.value})}
                  placeholder={language === 'ja' ? '例: 20%オフ' : 'e.g., 20% OFF'}
                  className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
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
                    onChange={(e) => { setFormData({...formData, price: e.target.value}); if (errors.price) setErrors(prev => ({ ...prev, price: undefined })); }}
                    className={`w-full px-3 py-2 rounded-lg border-2 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all ${errors.price ? 'border-red-300' : 'border-pink-100'}`}
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ja' ? '元の価格（円）' : 'Original Price (¥)'}
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => { setFormData({...formData, originalPrice: e.target.value}); if (errors.originalPrice) setErrors(prev => ({ ...prev, originalPrice: undefined })); }}
                    className={`w-full px-3 py-2 rounded-lg border-2 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all ${errors.originalPrice ? 'border-red-300' : 'border-pink-100'}`}
                  />
                  {errors.originalPrice && (
                    <p className="mt-1 text-xs text-red-600">{errors.originalPrice}</p>
                  )}
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
                  {language === 'ja' ? '商品画像' : 'Product Image'}
                </label>
                <ImageUpload
                  value={formData.image}
                  file={selectedFile}
                  onChange={(imageUrl) => setFormData({...formData, image: imageUrl})}
                  onFileChange={setSelectedFile}
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
                  disabled={loading || submitting}
                  className="flex-1 px-4 py-2 bg-linear-to-r from-primary to-pink-400 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? (language === 'ja' ? '保存中...' : 'Saving...') : (language === 'ja' ? '保存' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmOpen && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setDeleteConfirmOpen(false); setDeleteTarget(null); }}>
          <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
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
                disabled={loading || submitting}
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
