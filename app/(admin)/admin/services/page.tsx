'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { formatCurrency } from '@/app/constants/currency';
import ImageUpload from '@/app/components/ImageUpload';
import { useServices } from '@/app/hooks/useServices';
import { useAdminCategories } from '@/app/hooks/useAdminCategories';

interface Service {
  id: string;
  nameKey: string;
  descKey: string;
  nameEn?: string | null;
  nameJa?: string | null;
  descEn?: string | null;
  descJa?: string | null;
  price: number;
  duration: string;
  image: string;
  order: number;
  isActive: boolean;
  category: {
    id: string;
    slug: string;
    nameKey: string;
  };
  subCategory?: {
    id: string;
    slug: string;
    nameKey: string;
  };
  subSubCategory?: {
    id: string;
    slug: string;
    nameKey: string;
  };
}

interface SubSubCategory {
  id: string;
  slug: string;
  nameKey: string;
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
  nameEn?: string | null;
  nameJa?: string | null;
  subCategories: SubCategory[];
  _count?: {
    services: number;
  };
}

// Utility function to get display text (handles both translation keys and direct text)
const getDisplayText = (text: string, t: (key: string) => string): string => {
  // If text contains dots and starts with known prefixes, treat as translation key
  if (text.includes('.') && (text.startsWith('services.') || text.startsWith('categories.'))) {
    const translated = t(text);
    // If translation returns the same key, it means translation doesn't exist, return the text as-is
    return translated === text ? text : translated;
  }
  // Otherwise, return the text directly
  return text;
};

export default function AdminServicesPage() {
  const { t, language } = useLanguage();
  const renderName = (r: { nameKey: string; slug?: string; nameEn?: string | null; nameJa?: string | null }) => {
    const val = language === 'ja' ? r.nameJa || r.nameEn : r.nameEn || r.nameJa;
    if (val && String(val).trim().length > 0) return String(val);
    const translated = t(r.nameKey);
    if (translated !== r.nameKey) return translated;
    const key = (r.nameKey || '').split('.').pop() || r.slug || '';
    return key.replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  };
  const getServiceName = (s: Service) => {
    const val = language === 'ja' ? s.nameJa || s.nameEn : s.nameEn || s.nameJa;
    if (val && String(val).trim().length > 0) return String(val);
    return getDisplayText(s.nameKey, t);
  };

  const getServiceDesc = (s: Service) => {
    const val = language === 'ja' ? s.descJa || s.descEn : s.descEn || s.descJa;
    if (val && String(val).trim().length > 0) return String(val);
    return getDisplayText(s.descKey, t);
  };
  const { services, isLoading: servicesLoading, mutate: mutateServices } = useServices({});
  const { categories, isLoading: categoriesLoading } = useAdminCategories();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '', // User-friendly name input
    description: '', // User-friendly description input
    nameKey: '', // Auto-generated translation key
    descKey: '', // Auto-generated translation key
    nameEn: '',
    nameJa: '',
    descEn: '',
    descJa: '',
    price: '',
    duration: '',
    image: '',
    categoryId: '',
    subCategoryId: '',
    subSubCategoryId: '',
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const isDataLoading = servicesLoading || categoriesLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;

      // Upload image if a new file is selected
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', selectedFile);
        uploadFormData.append('serviceName', formData.name); // Send service name for filename
        // If we are editing and there's an existing image, pass it so the server can replace/delete
        if (editingService?.image) {
          uploadFormData.append('oldImageUrl', editingService.image);
        }

        const uploadRes = await fetch('/api/upload/image', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const error = await uploadRes.json();
          throw new Error(error.error || 'Failed to upload image');
        }

        const uploadResult = await uploadRes.json();
        imageUrl = uploadResult.imageUrl;
      }

      const url = editingService
        ? `/api/admin/services/${editingService.id}`
        : '/api/admin/services';
      const method = editingService ? 'PUT' : 'POST';

      // Store the actual name and description from the form
      const payload = {
        nameKey: editingService ? editingService.nameKey : formData.name, // keep key on edit
        descKey: editingService ? editingService.descKey : formData.description, // keep key on edit
        nameEn: formData.nameEn || (language === 'en' ? formData.name : ''),
        nameJa: formData.nameJa || (language === 'ja' ? formData.name : ''),
        descEn: formData.descEn || (language === 'en' ? formData.description : ''),
        descJa: formData.descJa || (language === 'ja' ? formData.description : ''),
        price: formData.price,
        duration: formData.duration,
        image: imageUrl,
        categoryId: formData.categoryId,
        subCategoryId: formData.subCategoryId || null,
        subSubCategoryId: formData.subSubCategoryId || null,
        isActive: formData.isActive,
        order: editingService ? editingService.order : 0, // Keep existing order for edits, 0 for new
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await mutateServices();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert(error instanceof Error ? error.message : 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirm = (id: string, name: string) => {
    setDeleteTarget({ id, name });
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/admin/services?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await mutateServices();
        setDeleteConfirmOpen(false);
        setDeleteTarget(null);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: getServiceName(service),
      description: getServiceDesc(service),
      nameKey: service.nameKey,
      descKey: service.descKey,
      nameEn: service.nameEn || '',
      nameJa: service.nameJa || '',
      descEn: service.descEn || '',
      descJa: service.descJa || '',
      price: service.price.toString(),
      duration: service.duration,
      image: service.image,
      categoryId: service.category.id,
      subCategoryId: service.subCategory?.id || '',
      subSubCategoryId: service.subSubCategory?.id || '',
      isActive: service.isActive,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        setServices(services.map(service => 
          service.id === id ? { ...service, isActive } : service
        ));
      } else {
        console.error('Failed to toggle service status');
      }
    } catch (error) {
      console.error('Error toggling service status:', error);
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setSelectedFile(null);
    setFormData({
      name: '',
      description: '',
      nameKey: '',
      descKey: '',
      nameEn: '',
      nameJa: '',
      descEn: '',
      descJa: '',
      price: '',
      duration: '',
      image: '',
      categoryId: '',
      subCategoryId: '',
      subSubCategoryId: '',
      isActive: true,
    });
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      searchQuery === '' ||
      getDisplayText(service.nameKey, t).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getDisplayText(service.descKey, t).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !filterCategory || service.category.slug === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedCategory = categories.find((c) => c.id === formData.categoryId);
  const selectedSubCategory = selectedCategory?.subCategories.find((s) => s.id === formData.subCategoryId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-sm shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              {t('admin.services.title')}
            </h1>
            <p className="text-gray-600 text-sm">
              {t('admin.services.subtitle')}
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-primary to-pink-400 text-white font-medium rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap"
          >
            {t('admin.services.add')}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-sm shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-pink-400 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">{services.length}</p>
              <p className="text-xs text-gray-500">Total Services</p>
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
              <p className="text-xl font-semibold text-gray-900">{services.filter(s => s.isActive).length}</p>
              <p className="text-xs text-gray-500">Active Services</p>
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
              <p className="text-xs text-gray-500">Categories</p>
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
                {formatCurrency(services.reduce((avg, service) => avg + service.price, 0) / services.length || 0)}
              </p>
              <p className="text-xs text-gray-500">Avg. Price</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-sm shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.services.searchLabel')}</label>
            <input
              type="text"
              placeholder={t('admin.services.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
            />
          </div>
          <div className="sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.services.filterByCategory')}</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
            >
              <option value="">{t('admin.services.allCategories')}</option>
                    {(categories || []).map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {renderName(cat)}
                      </option>
                    ))}
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid/Table */}
      <div className="bg-white rounded-sm shadow-md">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{t('admin.services.table.services')}</h2>
            <div className="text-sm text-gray-500">
              {isDataLoading ? 'Loading...' : `${filteredServices.length} of ${services.length} services`}
            </div>
          </div>
        </div>

        {isDataLoading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-sm flex items-center justify-center mx-auto mb-4 shadow-sm animate-pulse">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterCategory
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first service.'}
            </p>
            {!searchQuery && !filterCategory && (
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-primary to-pink-400 text-white font-medium rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all"
              >
                + Add Your First Service
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('admin.services.table.details')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('admin.services.table.category')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('admin.services.table.pricing')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('admin.services.table.status')}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('admin.services.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {(filteredServices || []).map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 flex-shrink-0 relative rounded-lg overflow-hidden shadow-md border-2 border-pink-100">
                          <Image
                            src={service.image}
                            alt={getServiceName(service)}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                         <div className="min-w-0 flex-1">
                           <div className="text-sm font-semibold text-gray-900 mb-1">
                             {getServiceName(service)}
                           </div>
                           <div className="text-xs text-gray-500 line-clamp-2">
                             {getServiceDesc(service)}
                           </div>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {renderName(service.category)}
                      </div>
                      {service.subCategory && (
                        <div className="text-xs text-gray-500 mt-1">
                          {renderName(service.subCategory)}
                        </div>
                      )}
                      {service.subSubCategory && (
                        <div className="text-xs text-primary mt-1 font-medium">
                          {renderName(service.subSubCategory)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(service.price)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {service.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full shadow-sm ${
                          service.isActive
                            ? 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            service.isActive ? 'bg-rose-400' : 'bg-gray-400'
                          }`}
                        />
                        {service.isActive ? t('admin.services.status.active') : t('admin.services.status.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-2 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-all shadow-sm"
                          title="Edit Service"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleActive(service.id, !service.isActive)}
                          className={`p-2 rounded-lg transition-all shadow-sm ${
                            service.isActive
                              ? 'text-rose-400 hover:text-rose-500 hover:bg-rose-50'
                              : 'text-pink-400 hover:text-pink-500 hover:bg-pink-50'
                          }`}
                          title={service.isActive ? 'Deactivate Service' : 'Activate Service'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {service.isActive ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(service.id, getServiceName(service))}
                          className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all shadow-sm"
                          title="Delete Service"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingService ? t('admin.services.modal.editTitle') : t('admin.services.modal.addTitle')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t('admin.services.form.name')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    readOnly={!!editingService}
                    placeholder="e.g., Back Facial, Aromatherapy Session"
                    className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 col-span-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">{t('admin.services.form.nameEn')}</label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder={t('admin.services.form.nameEn')}
                      className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">{t('admin.services.form.nameJa')}</label>
                    <input
                      type="text"
                      value={formData.nameJa}
                      onChange={(e) => setFormData({ ...formData, nameJa: e.target.value })}
                      placeholder={t('admin.services.form.nameJa')}
                      className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t('admin.services.form.desc')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the service benefits and what's included..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{t('admin.services.form.descEn')}</label>
                      <textarea
                        value={formData.descEn}
                        onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                        rows={3}
                        placeholder={t('admin.services.form.descEn')}
                        className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{t('admin.services.form.descJa')}</label>
                      <textarea
                        value={formData.descJa}
                        onChange={(e) => setFormData({ ...formData, descJa: e.target.value })}
                        rows={3}
                        placeholder={t('admin.services.form.descJa')}
                        className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  {/* {formData.description && (
                    <div className="mt-1 text-xs text-gray-500">
                      Translation key: <code className="bg-gray-100 px-1 rounded">{generateTranslationKey(formData.description, 'description')}</code>
                    </div>
                  )} */}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t('admin.services.form.price')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full pl-8 pr-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="5000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t('admin.services.form.duration')}
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="e.g., 60 min, 90 min, 2 hours"
                    className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t('admin.services.form.category')}
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryId: e.target.value,
                        subCategoryId: '',
                        subSubCategoryId: '',
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                  >
                    <option value="">{t('admin.services.form.selectCategory')}</option>
                    {(categories || []).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {renderName(cat)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t('admin.services.form.subcategory')}
                  </label>
                  <select
                    value={formData.subCategoryId}
                    onChange={(e) =>
                      setFormData({ 
                        ...formData, 
                        subCategoryId: e.target.value,
                        subSubCategoryId: '',
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    disabled={!formData.categoryId}
                  >
                    <option value="">{t('admin.services.form.selectSubCategory')}</option>
                    {selectedCategory?.subCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {renderName(sub)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t('admin.services.form.specialty')}
                  </label>
                  <select
                    value={formData.subSubCategoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, subSubCategoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border-2 border-pink-100 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    disabled={!formData.subCategoryId}
                  >
                    <option value="">{t('admin.services.form.selectSpecialty')}</option>
                    {(selectedSubCategory?.subSubCategories || []).map((subSub) => (
                      <option key={subSub.id} value={subSub.id}>
                        {renderName(subSub)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t('admin.services.form.image')}
                  </label>
                  <ImageUpload
                    value={formData.image}
                    file={selectedFile}
                    onChange={(imageUrl) =>
                      setFormData({ ...formData, image: imageUrl })
                    }
                    onFileChange={(file) => setSelectedFile(file)}
                  />
                </div>


                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="mr-2 rounded-sm"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {t('admin.services.status.active')}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 text-secondary bg-accent/50 rounded-lg hover:bg-accent transition-colors"
                >
                  {t('admin.services.form.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-pink-400 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  {loading ? t('admin.services.form.saving') : editingService ? t('admin.services.form.update') : t('admin.services.form.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Service</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteTarget.name}</span>? This will permanently remove the service from your system.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 text-sm font-medium text-secondary bg-accent/50 rounded-lg hover:bg-accent transition-colors"
              >
                Keep Service
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-400 to-rose-500 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                Yes, Delete Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
