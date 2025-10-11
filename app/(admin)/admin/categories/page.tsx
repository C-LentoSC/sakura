'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';

// Utility function to generate translation keys from user input
const generateTranslationKey = (text: string, type: 'category' | 'subcategory' | 'subsubcategory'): string => {
  if (!text) return '';
  
  // Convert to camelCase and remove special characters
  const camelCase = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
    .split(' ')
    .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  const prefix = type === 'category' ? 'services.mainCategories' : 
                 type === 'subcategory' ? 'services.subCategories' : 
                 'services.subSubCategories';
  
  return `${prefix}.${camelCase}`;
};

// Utility function to generate slug from user input
const generateSlug = (text: string): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

interface SubSubCategory {
  id: string;
  slug: string;
  nameKey: string;
  order: number;
  _count?: {
    services: number;
  };
}

interface SubCategory {
  id: string;
  slug: string;
  nameKey: string;
  order: number;
  subSubCategories?: SubSubCategory[];
  _count?: {
    services: number;
  };
}

interface Category {
  id: string;
  slug: string;
  nameKey: string;
  order: number;
  subCategories: SubCategory[];
  _count: {
    services: number;
  };
}

export default function AdminCategoriesPage() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'category' | 'subcategory' | 'subsubcategory'>('category');
  const [editingItem, setEditingItem] = useState<Category | SubCategory | SubSubCategory | null>(null);
  const [parentId, setParentId] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    name: '', // User-friendly name input
    slug: '', // Auto-generated slug
    nameKey: '', // Auto-generated translation key
    order: '0',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Ensure categories is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Auto-generate slug and translation key from user input
      const slug = generateSlug(formData.name);
      const nameKey = generateTranslationKey(formData.name, modalType);

      let url = '';
      const { name: _name, ...payloadData } = formData; // Remove name from payload
      const payload: Record<string, string | number> = {
        ...payloadData,
        slug,
        nameKey,
      };

      if (modalType === 'category') {
        url = editingItem ? `/api/admin/categories/${editingItem.id}` : '/api/admin/categories';
      } else if (modalType === 'subcategory') {
        url = editingItem ? `/api/admin/subcategories/${editingItem.id}` : '/api/admin/subcategories';
        payload.categoryId = parentId;
      } else {
        url = editingItem ? `/api/admin/subsubcategories/${editingItem.id}` : '/api/admin/subsubcategories';
        payload.subCategoryId = parentId;
      }

      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchCategories();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: 'category' | 'subcategory' | 'subsubcategory', id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      let url = '';
      if (type === 'category') url = `/api/admin/categories/${id}`;
      else if (type === 'subcategory') url = `/api/admin/subcategories/${id}`;
      else url = `/api/admin/subsubcategories/${id}`;

      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const openModal = (type: 'category' | 'subcategory' | 'subsubcategory', item?: Category | SubCategory | SubSubCategory | null, parent?: string) => {
    setModalType(type);
    setEditingItem(item || null);
    setParentId(parent || '');
    setFormData({
      name: item ? t(item.nameKey) : '', // Show translated name when editing
      slug: item?.slug || '',
      nameKey: item?.nameKey || '',
      order: item?.order?.toString() || '0',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setParentId('');
    setFormData({ name: '', slug: '', nameKey: '', order: '0' });
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubCategory = (subCategoryId: string) => {
    const newExpanded = new Set(expandedSubCategories);
    if (newExpanded.has(subCategoryId)) {
      newExpanded.delete(subCategoryId);
    } else {
      newExpanded.add(subCategoryId);
    }
    setExpandedSubCategories(newExpanded);
  };

  const getModalTitle = () => {
    const action = editingItem ? 'Edit' : 'Add';
    const type = modalType === 'category' ? 'Category' : modalType === 'subcategory' ? 'Sub-Category' : 'Sub-Sub-Category';
    return `${action} ${type}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-sm shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Category Management
            </h1>
            <p className="text-gray-600 text-sm">
              Manage your 3-level category structure
            </p>
          </div>
          <button
            onClick={() => openModal('category')}
            className="px-4 py-2 bg-gray-900 text-white font-medium rounded-sm shadow-md hover:bg-gray-800 hover:shadow-lg transition-all whitespace-nowrap"
          >
            + Add Main Category
          </button>
        </div>
      </div>

      {/* Categories Tree */}
      <div className="bg-white rounded-sm shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Category Hierarchy</h2>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-sm flex items-center justify-center mx-auto mb-4 shadow-sm animate-pulse">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p className="text-gray-500">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first category.</p>
            <button
              onClick={() => openModal('category')}
              className="px-4 py-2 bg-gray-900 text-white font-medium rounded-sm shadow-md hover:bg-gray-800 hover:shadow-lg transition-all"
            >
              + Add Your First Category
            </button>
          </div>
        ) : (
          <div className="p-6">
            {(categories || []).map((category) => (
              <div key={category.id} className="mb-4 last:mb-0">
                {/* Level 1: Main Category */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-sm shadow-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="p-1 hover:bg-blue-100 rounded-sm transition-colors"
                    >
                      <svg
                        className={`w-4 h-4 text-blue-600 transition-transform ${
                          expandedCategories.has(category.id) ? 'rotate-90' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold text-sm">L1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t(category.nameKey)}</h3>
                      <p className="text-sm text-gray-500">
                        {category.slug} • {category._count.services} services • {category.subCategories.length} sub-categories
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal('subcategory', null, category.id)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      + Sub
                    </button>
                    <button
                      onClick={() => openModal('category', category)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-sm transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete('category', category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Level 2: Sub-Categories */}
                {expandedCategories.has(category.id) && (
                  <div className="ml-8 mt-2 space-y-2">
                    {(category.subCategories || []).map((subCategory) => (
                      <div key={subCategory.id}>
                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-sm shadow-sm">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleSubCategory(subCategory.id)}
                              className="p-1 hover:bg-emerald-100 rounded-sm transition-colors"
                            >
                              <svg
                                className={`w-4 h-4 text-emerald-600 transition-transform ${
                                  expandedSubCategories.has(subCategory.id) ? 'rotate-90' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                            <div className="w-7 h-7 bg-emerald-600 rounded-sm flex items-center justify-center shadow-sm">
                              <span className="text-white font-semibold text-xs">L2</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{t(subCategory.nameKey)}</h4>
                              <p className="text-xs text-gray-500">
                                {subCategory.slug} • {subCategory._count?.services || 0} services • {subCategory.subSubCategories?.length || 0} sub-sub-categories
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openModal('subsubcategory', null, subCategory.id)}
                              className="px-2 py-1 text-xs bg-emerald-600 text-white rounded-sm hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                              + Sub-Sub
                            </button>
                            <button
                              onClick={() => openModal('subcategory', subCategory)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-sm transition-colors shadow-sm"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete('subcategory', subCategory.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-colors shadow-sm"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Level 3: Sub-Sub-Categories */}
                        {expandedSubCategories.has(subCategory.id) && (
                          <div className="ml-8 mt-2 space-y-1">
                            {(subCategory.subSubCategories || []).map((subSubCategory) => (
                              <div key={subSubCategory.id} className="flex items-center justify-between p-2 bg-amber-50 rounded-sm shadow-sm">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 bg-amber-600 rounded-sm flex items-center justify-center shadow-sm">
                                    <span className="text-white font-semibold text-xs">L3</span>
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-gray-900 text-sm">{t(subSubCategory.nameKey)}</h5>
                                    <p className="text-xs text-gray-500">
                                      {subSubCategory.slug} • {subSubCategory._count?.services || 0} services
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => openModal('subsubcategory', subSubCategory)}
                                    className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-sm transition-colors shadow-sm"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDelete('subsubcategory', subSubCategory.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-colors shadow-sm"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {getModalTitle()}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {modalType === 'category' ? 'Category Name' : 
                   modalType === 'subcategory' ? 'Sub-Category Name' : 
                   'Sub-Sub-Category Name'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                  placeholder={modalType === 'category' ? 'e.g., Head Spa, Beauty, Nails' : 
                              modalType === 'subcategory' ? 'e.g., Relaxation, Manicure, Classic' : 
                              'e.g., Aromatherapy, Gel Polish, Volume'}
                  required
                />
                {/* {formData.name && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-gray-500">
                      Slug: <code className="bg-gray-100 px-1 rounded">{generateSlug(formData.name)}</code>
                    </div>
                    <div className="text-xs text-gray-500">
                      Translation key: <code className="bg-gray-100 px-1 rounded">{generateTranslationKey(formData.name, modalType)}</code>
                    </div>
                  </div>
                )} */}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                  min="0"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}