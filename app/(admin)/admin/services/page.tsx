'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { formatCurrency } from '@/app/constants/currency';

interface Service {
  id: string;
  nameKey: string;
  descKey: string;
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
  subCategory: {
    id: string;
    slug: string;
    nameKey: string;
  };
}

interface Category {
  id: string;
  slug: string;
  nameKey: string;
  subCategories: {
    id: string;
    slug: string;
    nameKey: string;
  }[];
}

export default function AdminServicesPage() {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    nameKey: '',
    descKey: '',
    price: '',
    duration: '',
    image: '',
    categoryId: '',
    subCategoryId: '',
    order: '0',
    isActive: true,
  });

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingService
        ? '/api/admin/services'
        : '/api/admin/services';
      const method = editingService ? 'PUT' : 'POST';

      const payload = editingService
        ? { id: editingService.id, ...formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchServices();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const res = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchServices();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      nameKey: service.nameKey,
      descKey: service.descKey,
      price: service.price.toString(),
      duration: service.duration,
      image: service.image,
      categoryId: service.category.id,
      subCategoryId: service.subCategory.id,
      order: service.order.toString(),
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
    setFormData({
      nameKey: '',
      descKey: '',
      price: '',
      duration: '',
      image: '',
      categoryId: '',
      subCategoryId: '',
      order: '0',
      isActive: true,
    });
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      searchQuery === '' ||
      service.nameKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.descKey.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !filterCategory || service.category.slug === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedCategory = categories.find((c) => c.id === formData.categoryId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-sm shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Service Management
            </h1>
            <p className="text-gray-600 text-sm">
              Manage your service packages and offerings
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-gray-900 text-white font-medium rounded-sm shadow-md hover:bg-gray-800 hover:shadow-lg transition-all whitespace-nowrap"
          >
            + Add New Service
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-sm shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-sm flex items-center justify-center shadow-sm">
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
            <div className="w-10 h-10 bg-emerald-600 rounded-sm flex items-center justify-center shadow-sm">
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
            <div className="w-10 h-10 bg-purple-600 rounded-sm flex items-center justify-center shadow-sm">
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
            <div className="w-10 h-10 bg-amber-600 rounded-sm flex items-center justify-center shadow-sm">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Services</label>
            <input
              type="text"
              placeholder="Search by name, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none text-sm transition-all"
            />
          </div>
          <div className="sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none text-sm transition-all"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {t(cat.nameKey)}
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
            <h2 className="text-lg font-semibold text-gray-900">Services List</h2>
            <div className="text-sm text-gray-500">
              {loading ? 'Loading...' : `${filteredServices.length} of ${services.length} services`}
            </div>
          </div>
        </div>

        {loading ? (
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
                className="px-4 py-2 bg-gray-900 text-white font-medium rounded-sm shadow-md hover:bg-gray-800 hover:shadow-lg transition-all"
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
                    Service Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 flex-shrink-0 relative rounded-sm overflow-hidden shadow-sm">
                          <Image
                            src={service.image}
                            alt={t(service.nameKey)}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900 mb-1">
                            {t(service.nameKey)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {service.nameKey}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {t(service.category.nameKey)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {t(service.subCategory.nameKey)}
                      </div>
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
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-sm shadow-sm ${
                          service.isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            service.isActive ? 'bg-emerald-400' : 'bg-gray-400'
                          }`}
                        />
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-sm transition-all shadow-sm"
                          title="Edit Service"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleActive(service.id, !service.isActive)}
                          className={`p-2 rounded-sm transition-all shadow-sm ${
                            service.isActive
                              ? 'text-amber-600 hover:text-amber-800 hover:bg-amber-50'
                              : 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50'
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
                          onClick={() => handleDelete(service.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-sm transition-all shadow-sm"
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
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Name Key (Translation)
                  </label>
                  <input
                    type="text"
                    value={formData.nameKey}
                    onChange={(e) =>
                      setFormData({ ...formData, nameKey: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description Key (Translation)
                  </label>
                  <input
                    type="text"
                    value={formData.descKey}
                    onChange={(e) =>
                      setFormData({ ...formData, descKey: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="60 min"
                    className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryId: e.target.value,
                        subCategoryId: '',
                      })
                    }
                    className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {t(cat.nameKey)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Sub-Category
                  </label>
                  <select
                    value={formData.subCategoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, subCategoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                    required
                    disabled={!formData.categoryId}
                  >
                    <option value="">Select Sub-Category</option>
                    {selectedCategory?.subCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {t(sub.nameKey)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Image Path
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="/packages/1.jpg"
                    className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-sm bg-white shadow-sm focus:shadow-md focus:ring-2 focus:ring-gray-400 outline-none transition-all"
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
                      Active
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
                  className="flex-1 px-4 py-2 bg-white text-gray-700 font-medium rounded-sm shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white font-medium rounded-sm shadow-md hover:bg-gray-800 hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingService ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

