'use client';

import { useState } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { ChevronRight, Plus, Edit2, Trash2, FolderOpen, Folder, Tag } from 'lucide-react';
import { useAdminCategories } from '@/app/hooks/useAdminCategories';

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
  order?: number;
  nameEn?: string | null;
  nameJa?: string | null;
  _count?: {
    services: number;
  };
}

interface SubCategory {
  id: string;
  slug: string;
  nameKey: string;
  order?: number;
  nameEn?: string | null;
  nameJa?: string | null;
  subSubCategories?: SubSubCategory[];
  _count?: {
    services: number;
  };
}

interface Category {
  id: string;
  slug: string;
  nameKey: string;
  order?: number;
  nameEn?: string | null;
  nameJa?: string | null;
  subCategories: SubCategory[];
  _count?: {
    services: number;
  };
}

export default function AdminCategoriesPage() {
  const { t, language } = useLanguage();
  const renderName = (record: { nameKey: string; slug?: string; nameEn?: string | null; nameJa?: string | null }) => {
    const val = language === 'ja' ? record?.nameJa || record?.nameEn : record?.nameEn || record?.nameJa;
    if (val && String(val).trim().length > 0) return val as string;
    const translated = t(record.nameKey);
    if (translated !== record.nameKey) return translated;
    const key = (record.nameKey || '').split('.').pop() || record.slug || '';
    return key.replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  };
  const { categories, isLoading: loading, mutate, deleteCategory, deleteSubCategory, deleteSubSubCategory } = useAdminCategories();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ type: 'category' | 'subcategory' | 'subsubcategory'; id: string; name?: string } | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'category' | 'subcategory' | 'subsubcategory'>('category');
  const [editingItem, setEditingItem] = useState<Category | SubCategory | SubSubCategory | null>(null);
  const [parentId, setParentId] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    nameKey: '',
    nameEn: '',
    nameJa: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // For new items: auto-generate slug and translation key from user input
      // For edits: keep existing slug/key
      const slug = editingItem ? (editingItem as { slug: string }).slug : generateSlug(formData.name);
      const nameKey = editingItem ? (editingItem as { nameKey: string }).nameKey : generateTranslationKey(formData.name, modalType);

      let url = '';
      const payload: Record<string, string | number> = {
        slug,
        nameKey,
        order: editingItem?.order || 0, // Keep existing order for edits, 0 for new
        nameEn: formData.nameEn || (language === 'en' ? formData.name : ''),
        nameJa: formData.nameJa || (language === 'ja' ? formData.name : ''),
      };

      if (modalType === 'category') {
        url = editingItem ? `/api/admin/categories` : '/api/admin/categories';
      } else if (modalType === 'subcategory') {
        url = editingItem ? `/api/admin/subcategories` : '/api/admin/subcategories';
        payload.categoryId = parentId;
      } else {
        url = editingItem ? `/api/admin/subsubcategories/${editingItem.id}` : '/api/admin/subsubcategories';
        payload.subCategoryId = parentId;
      }

      const method = editingItem ? 'PUT' : 'POST';

      const editId = editingItem ? (editingItem as { id: string }).id : undefined;
      
      // Close modal immediately for better UX
      closeModal();
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem ? { id: editId as string, ...payload } : payload),
      });

      if (res.ok) {
        // Background revalidation - non-blocking
        mutate(undefined, true);
      }
    } catch (error) {
      console.error('Error saving item:', error);
      // Revalidate to show current state
      mutate(undefined, true);
    }
  };

  const handleDelete = async (type: 'category' | 'subcategory' | 'subsubcategory', id: string) => {
    // Close confirm dialog immediately
    setConfirmOpen(false);
    setConfirmTarget(null);
    
    try {
      // Use optimistic delete helpers
      if (type === 'category') {
        await deleteCategory(id);
      } else if (type === 'subcategory') {
        await deleteSubCategory(id);
      } else {
        await deleteSubSubCategory(id);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const openConfirmDelete = (type: 'category' | 'subcategory' | 'subsubcategory', id: string, name?: string) => {
    setConfirmTarget({ type, id, name });
    setConfirmOpen(true);
  };

  const openModal = (type: 'category' | 'subcategory' | 'subsubcategory', item?: Category | SubCategory | SubSubCategory | null, parent?: string) => {
    setModalType(type);
    setEditingItem(item || null);
    setParentId(parent || '');
    setFormData({
      name: item ? renderName(item) : '',
      slug: item?.slug || '',
      nameKey: item?.nameKey || '',
      nameEn: item && 'nameEn' in item && item.nameEn ? item.nameEn : '',
      nameJa: item && 'nameJa' in item && item.nameJa ? item.nameJa : '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setParentId('');
    setFormData({ name: '', slug: '', nameKey: '', nameEn: '', nameJa: '' });
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
            className="px-4 py-2 bg-gradient-to-r from-primary to-pink-400 text-white font-medium rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap inline-flex items-center gap-2"
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
              className="px-4 py-2 bg-gradient-to-r from-primary to-pink-400 text-white font-medium rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Your First Category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {(categories || []).map((category) => (
              <div key={category.id} className="hover:bg-gray-50/50 transition-colors">
                {/* Level 1: Main Category */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-50/50 to-transparent">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex-shrink-0 p-1 hover:bg-primary/10 rounded transition-colors"
                      aria-label={expandedCategories.has(category.id) ? 'Collapse' : 'Expand'}
                    >
                      <ChevronRight
                        className={`w-4 h-4 text-primary transition-transform duration-200 ${
                          expandedCategories.has(category.id) ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary to-pink-400 rounded-lg flex items-center justify-center shadow-md">
                      <FolderOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{renderName(category)}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{category.slug}</span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {(category._count?.services ?? 0)} services
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
                      className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-primary to-pink-400 text-white rounded-lg hover:shadow-md hover:scale-105 transition-all shadow-sm inline-flex items-center gap-1.5"
                      title="Add Sub-Category"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Sub
                    </button>
                    <button
                      onClick={() => openModal('category', category)}
                      className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openConfirmDelete('category', category.id, t(category.nameKey))}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Level 2: Sub-Categories */}
                {expandedCategories.has(category.id) && (
                  <div className="bg-gray-50/30">
                    {(category.subCategories || []).map((subCategory) => (
                      <div key={subCategory.id} className="border-l-2 border-pink-200 ml-6">
                        <div className="flex items-center justify-between px-6 py-3 hover:bg-rose-50/30 transition-colors">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <button
                              onClick={() => toggleSubCategory(subCategory.id)}
                              className="flex-shrink-0 p-1 hover:bg-rose-100 rounded transition-colors"
                              aria-label={expandedSubCategories.has(subCategory.id) ? 'Collapse' : 'Expand'}
                            >
                              <ChevronRight
                                className={`w-3.5 h-3.5 text-rose-400 transition-transform duration-200 ${
                                  expandedSubCategories.has(subCategory.id) ? 'rotate-90' : ''
                                }`}
                              />
                            </button>
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                              <Folder className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm truncate">{renderName(subCategory)}</h4>
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
                              className="px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-lg hover:shadow-md hover:scale-105 transition-all shadow-sm inline-flex items-center gap-1"
                              title="Add Sub-Sub-Category"
                            >
                              <Plus className="w-3 h-3" />
                              Sub
                            </button>
                            <button
                              onClick={() => openModal('subcategory', subCategory)}
                              className="p-1.5 text-rose-400 hover:bg-rose-100 rounded-lg transition-colors"
                              title="Edit Sub-Category"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openConfirmDelete('subcategory', subCategory.id, t(subCategory.nameKey))}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Sub-Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Level 3: Sub-Sub-Categories */}
                        {expandedSubCategories.has(subCategory.id) && (
                          <div className="bg-pink-50/20 border-l-2 border-rose-200 ml-6">
                            {(subCategory.subSubCategories || []).map((subSubCategory) => (
                              <div key={subSubCategory.id} className="flex items-center justify-between px-6 py-2.5 hover:bg-pink-50/50 transition-colors">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-pink-300 to-rose-300 rounded-lg flex items-center justify-center shadow-md">
                                    <Tag className="w-3.5 h-3.5 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-gray-900 text-sm truncate">{renderName(subSubCategory)}</h5>
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
                                    className="p-1.5 text-pink-400 hover:bg-pink-100 rounded-lg transition-colors"
                                    title="Edit Sub-Sub-Category"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => openConfirmDelete('subsubcategory', subSubCategory.id, t(subSubCategory.nameKey))}
                                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
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
                  readOnly={!!editingItem}
                  className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder={modalType === 'category' ? 'e.g., Head Spa, Beauty, Nails' : 
                              modalType === 'subcategory' ? 'e.g., Relaxation, Manicure, Classic' : 
                              'e.g., Aromatherapy, Gel Polish, Volume'}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">English</label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="English name (optional)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">日本語</label>
                  <input
                    type="text"
                    value={formData.nameJa}
                    onChange={(e) => setFormData({ ...formData, nameJa: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="日本語名（任意）"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-secondary bg-accent/50 rounded-lg hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-pink-400 text-white rounded-lg hover:shadow-lg hover:scale-105 disabled:opacity-50 transition-all"
                >
                  {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmOpen && confirmTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mb-6">This action cannot be undone. Do you want to delete {confirmTarget.name || 'this item'}?</p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setConfirmOpen(false); setConfirmTarget(null); }}
                className="flex-1 px-4 py-2 text-secondary bg-accent/50 rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmTarget.type, confirmTarget.id)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}