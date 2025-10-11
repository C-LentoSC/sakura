'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface SubCategory {
  id: string;
  slug: string;
  nameKey: string;
  order: number;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);

  // Form state for main category
  const [categoryForm, setCategoryForm] = useState({
    slug: '',
    nameKey: '',
    order: '0',
  });

  // Form state for sub-category
  const [subCategoryForm, setSubCategoryForm] = useState({
    slug: '',
    nameKey: '',
    categoryId: '',
    order: '0',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const payload = editingCategory
        ? { id: editingCategory.id, ...categoryForm }
        : categoryForm;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchCategories();
        setIsModalOpen(false);
        resetCategoryForm();
      }
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/admin/subcategories';
      const method = editingSubCategory ? 'PUT' : 'POST';

      const payload = editingSubCategory
        ? { id: editingSubCategory.id, ...subCategoryForm }
        : subCategoryForm;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchCategories();
        setIsSubModalOpen(false);
        resetSubCategoryForm();
      }
    } catch (error) {
      console.error('Error saving sub-category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category? All sub-categories and services will also be deleted!')) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleDeleteSubCategory = async (id: string) => {
    if (!confirm('Delete this sub-category? All services in it will also be deleted!')) return;

    try {
      const res = await fetch(`/api/admin/subcategories?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting sub-category:', error);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      slug: category.slug,
      nameKey: category.nameKey,
      order: category.order.toString(),
    });
    setIsModalOpen(true);
  };

  const handleEditSubCategory = (subCategory: SubCategory, categoryId: string) => {
    setEditingSubCategory(subCategory);
    setSubCategoryForm({
      slug: subCategory.slug,
      nameKey: subCategory.nameKey,
      categoryId: categoryId,
      order: subCategory.order.toString(),
    });
    setIsSubModalOpen(true);
  };

  const handleAddSubCategory = (categoryId: string) => {
    setSubCategoryForm({
      slug: '',
      nameKey: '',
      categoryId: categoryId,
      order: '0',
    });
    setIsSubModalOpen(true);
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryForm({
      slug: '',
      nameKey: '',
      order: '0',
    });
  };

  const resetSubCategoryForm = () => {
    setEditingSubCategory(null);
    setSubCategoryForm({
      slug: '',
      nameKey: '',
      categoryId: '',
      order: '0',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-sakura text-secondary mb-2">
            Manage Categories
          </h1>
          <p className="text-secondary/70 text-sm sm:text-base">
            Organize service categories and sub-categories
          </p>
        </div>
        <button
          onClick={() => {
            resetCategoryForm();
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-gray-900 text-white font-medium rounded-sm shadow-md hover:bg-gray-800 hover:shadow-lg transition-all whitespace-nowrap"
        >
          + Add New Category
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-6">
        {loading && categories.length === 0 ? (
          <div className="bg-white rounded-sm shadow-md p-12 text-center text-gray-500">
            Loading...
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-sm shadow-md p-12 text-center text-gray-500">
            No categories found
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-sm shadow-lg overflow-hidden"
            >
              {/* Category Header */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {t(category.nameKey)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Slug: <span className="font-mono">{category.slug}</span> •{' '}
                      {category._count.services} services
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddSubCategory(category.id)}
                    className="px-3 py-1.5 bg-white text-gray-700 rounded-sm shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-sm font-medium"
                  >
                    + Add Sub-Category
                  </button>
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="px-3 py-1.5 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="px-3 py-1.5 text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Sub-Categories */}
              {category.subCategories.length > 0 && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.subCategories.map((subCat) => (
                      <div
                        key={subCat.id}
                        className="border border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-secondary">
                              {t(subCat.nameKey)}
                            </h4>
                            <p className="text-xs text-secondary/60 font-mono">
                              {subCat.slug}
                            </p>
                          </div>
                          <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                            {subCat._count?.services || 0}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEditSubCategory(subCat, category.id)}
                            className="text-xs text-primary hover:text-pink-600 font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSubCategory(subCat.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Slug (URL-friendly ID)
                </label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, slug: e.target.value })
                  }
                  placeholder="head-spa"
                  className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Name Key (Translation Key)
                </label>
                <input
                  type="text"
                  value={categoryForm.nameKey}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, nameKey: e.target.value })
                  }
                  placeholder="services.mainCategories.headSpa"
                  className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={categoryForm.order}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, order: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetCategoryForm();
                  }}
                  className="flex-1 px-4 py-2 bg-white text-gray-700 font-medium rounded-sm shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white font-medium rounded-sm shadow-md hover:bg-gray-800 hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-Category Modal */}
      {isSubModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingSubCategory ? 'Edit Sub-Category' : 'Add New Sub-Category'}
            </h2>

            <form onSubmit={handleSubCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Slug (URL-friendly ID)
                </label>
                <input
                  type="text"
                  value={subCategoryForm.slug}
                  onChange={(e) =>
                    setSubCategoryForm({ ...subCategoryForm, slug: e.target.value })
                  }
                  placeholder="beauty"
                  className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Name Key (Translation Key)
                </label>
                <input
                  type="text"
                  value={subCategoryForm.nameKey}
                  onChange={(e) =>
                    setSubCategoryForm({ ...subCategoryForm, nameKey: e.target.value })
                  }
                  placeholder="services.subCategories.beauty"
                  className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={subCategoryForm.order}
                  onChange={(e) =>
                    setSubCategoryForm({ ...subCategoryForm, order: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubModalOpen(false);
                    resetSubCategoryForm();
                  }}
                  className="flex-1 px-4 py-2 bg-white text-gray-700 font-medium rounded-sm shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white font-medium rounded-sm shadow-md hover:bg-gray-800 hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingSubCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

