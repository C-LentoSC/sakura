'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { ChevronRight, Plus, Edit2, Trash2, FolderOpen, Folder, Tag } from 'lucide-react';

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
        order: editingItem?.order || 0, // Keep existing order for edits, 0 for new
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
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setParentId('');
    setFormData({ name: '', slug: '', nameKey: '' });
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
            className="px-4 py-2 bg-gray-900 text-white font-medium rounded-sm shadow-md hover:bg-gray-800 hover:shadow-lg transition-all whitespace-nowrap inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Main Category
          </button>
        </div>
      </div>

      {/* Categories Tree */}
      <div className="bg-white rounded-sm shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Category Hierarchy</h2>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-sm flex items-center justify-center mx-auto mb-4 shadow-sm animate-pulse">
              <Folder className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Folder className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first category.</p>
            <button
              onClick={() => openModal('category')}
              className="px-4 py-2 bg-gray-900 text-white font-medium rounded-sm shadow-md hover:bg-gray-800 hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Your First Category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {(categories || []).map((category, categoryIndex) => (
              <div key={category.id} className="hover:bg-gray-50/50 transition-colors">
                {/* Level 1: Main Category */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50/50 to-transparent">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex-shrink-0 p-1 hover:bg-blue-100 rounded transition-colors"
                      aria-label={expandedCategories.has(category.id) ? 'Collapse' : 'Expand'}
                    >
                      <ChevronRight
                        className={`w-4 h-4 text-blue-600 transition-transform duration-200 ${
                          expandedCategories.has(category.id) ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    <div className="flex-shrink-0 w-9 h-9 bg-blue-600 rounded flex items-center justify-center shadow-sm">
                      <FolderOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{t(category.nameKey)}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{category.slug}</span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {category._count.services} services
                        </span>
                        <span className="flex items-center gap-1">
                          <Folder className="w-3 h-3" />
                          {category.subCategories.length} sub-categories
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
                    <button
                      onClick={() => openModal('subcategory', null, category.id)}
                      className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center gap-1.5"
                      title="Add Sub-Category"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Sub
                    </button>
                    <button
                      onClick={() => openModal('category', category)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('category', category.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Level 2: Sub-Categories */}
                {expandedCategories.has(category.id) && (
                  <div className="bg-gray-50/30">
                    {(category.subCategories || []).map((subCategory, subIndex) => (
                      <div key={subCategory.id} className="border-l-2 border-blue-200 ml-6">
                        <div className="flex items-center justify-between px-6 py-3 hover:bg-emerald-50/30 transition-colors">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <button
                              onClick={() => toggleSubCategory(subCategory.id)}
                              className="flex-shrink-0 p-1 hover:bg-emerald-100 rounded transition-colors"
                              aria-label={expandedSubCategories.has(subCategory.id) ? 'Collapse' : 'Expand'}
                            >
                              <ChevronRight
                                className={`w-3.5 h-3.5 text-emerald-600 transition-transform duration-200 ${
                                  expandedSubCategories.has(subCategory.id) ? 'rotate-90' : ''
                                }`}
                              />
                            </button>
                            <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded flex items-center justify-center shadow-sm">
                              <Folder className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm truncate">{t(subCategory.nameKey)}</h4>
                              <div className="flex items-center gap-2.5 text-xs text-gray-500 mt-0.5">
                                <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">{subCategory.slug}</span>
                                <span className="flex items-center gap-1">
                                  <Tag className="w-3 h-3" />
                                  {subCategory._count?.services || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Folder className="w-3 h-3" />
                                  {subCategory.subSubCategories?.length || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
                            <button
                              onClick={() => openModal('subsubcategory', null, subCategory.id)}
                              className="px-2.5 py-1 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors shadow-sm inline-flex items-center gap-1"
                              title="Add Sub-Sub-Category"
                            >
                              <Plus className="w-3 h-3" />
                              Sub
                            </button>
                            <button
                              onClick={() => openModal('subcategory', subCategory)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                              title="Edit Sub-Category"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete('subcategory', subCategory.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete Sub-Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Level 3: Sub-Sub-Categories */}
                        {expandedSubCategories.has(subCategory.id) && (
                          <div className="bg-amber-50/20 border-l-2 border-emerald-200 ml-6">
                            {(subCategory.subSubCategories || []).map((subSubCategory, subSubIndex) => (
                              <div key={subSubCategory.id} className="flex items-center justify-between px-6 py-2.5 hover:bg-amber-50/50 transition-colors">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="flex-shrink-0 w-7 h-7 bg-amber-600 rounded flex items-center justify-center shadow-sm">
                                    <Tag className="w-3.5 h-3.5 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-gray-900 text-sm truncate">{t(subSubCategory.nameKey)}</h5>
                                    <div className="flex items-center gap-2.5 text-xs text-gray-500 mt-0.5">
                                      <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">{subSubCategory.slug}</span>
                                      <span className="flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {subSubCategory._count?.services || 0}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
                                  <button
                                    onClick={() => openModal('subsubcategory', subSubCategory)}
                                    className="p-1.5 text-amber-600 hover:bg-amber-100 rounded transition-colors"
                                    title="Edit Sub-Sub-Category"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete('subsubcategory', subSubCategory.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete Sub-Sub-Category"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
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