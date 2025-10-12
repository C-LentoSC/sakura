"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface Booking {
  id: string;
  serviceId: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string | null;
  status: string;
  createdAt: string;
}

const initialForm: Omit<Booking, "id" | "createdAt"> & { id?: string } = {
  id: undefined,
  serviceId: "",
  date: "",
  time: "",
  name: "",
  email: "",
  phone: "",
  notes: "",
  status: "pending",
};

export default function AdminBookingsPage() {
  const { t, language } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Array<{ id: string; nameKey: string; nameEn?: string | null; nameJa?: string | null; image: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  // Lightweight labels for this page without relying on locale files
  const en = {
    title: 'Bookings Management',
    subtitle: 'View and manage all service bookings',
    total: 'Total Bookings',
    new: '+ New',
    pending: 'Pending',
    booked: 'Booked',
    canceled: 'Canceled',
    thCustomer: 'Customer',
    thService: 'Service',
    thDateTime: 'Date & Time',
    thContact: 'Contact',
    thStatus: 'Status',
    thActions: 'Actions',
    noBookings: 'No bookings found',
    edit: 'Edit',
    cancelBooking: 'Cancel Booking',
    confirmTitle: 'Cancel Booking',
    confirmSub: 'This action cannot be undone',
    confirmMsg: 'Are you sure you want to cancel this booking? The customer will be notified and the booking status will be changed to canceled.',
    keep: 'Keep Booking',
    yesCancel: 'Yes, Cancel Booking',
  } as const;
  const ja = {
    title: '予約管理',
    subtitle: 'すべての予約を確認・管理します',
    total: '合計予約数',
    new: '+ 新規',
    pending: '保留中',
    booked: '予約済み',
    canceled: 'キャンセル済み',
    thCustomer: 'お客様',
    thService: 'サービス',
    thDateTime: '日時',
    thContact: '連絡先',
    thStatus: 'ステータス',
    thActions: '操作',
    noBookings: '予約はありません',
    edit: '編集',
    cancelBooking: '予約をキャンセル',
    confirmTitle: '予約をキャンセル',
    confirmSub: 'この操作は取り消せません',
    confirmMsg: 'この予約をキャンセルしてもよろしいですか？お客様に通知され、ステータスはキャンセル済みに変更されます。',
    keep: '予約を維持',
    yesCancel: 'はい、キャンセルする',
  } as const;
  const L = (k: keyof typeof en) => (language === 'ja' ? ja[k] : en[k]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bres, sres] = await Promise.all([
        fetch("/api/admin/bookings", { cache: "no-store" }),
        fetch("/api/services", { cache: "no-store" }),
      ]);
      if (!bres.ok) throw new Error("Failed to load");
      const bdata = await bres.json();
      setBookings(bdata.bookings || []);
      if (sres.ok) {
        const sdata = await sres.json();
        setServices(sdata.services || []);
      }
    } catch {
      setError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const pendingCount = useMemo(
    () => bookings.filter(b => ['pending', 'no-show'].includes(String(b.status).toLowerCase())).length,
    [bookings]
  );
  const bookedCount = useMemo(
    () => bookings.filter(b => ['booked', 'confirmed'].includes(String(b.status).toLowerCase())).length,
    [bookings]
  );
  const canceledCount = useMemo(
    () => bookings.filter(b => ['canceled', 'cancelled'].includes(String(b.status).toLowerCase())).length,
    [bookings]
  );

  const openCreate = () => {
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEdit = (b: Booking) => {
    setForm({
      id: b.id,
      serviceId: b.serviceId,
      date: b.date,
      time: b.time,
      name: b.name,
      email: b.email,
      phone: b.phone,
      notes: b.notes ?? "",
      status: b.status,
    });
    setIsModalOpen(true);
  };

  const [cancelModalId, setCancelModalId] = useState<string | null>(null);

  const handleCancelConfirm = async () => {
    if (!cancelModalId) return;
    try {
      const res = await fetch(`/api/admin/bookings/${cancelModalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "canceled" }),
      });
      if (!res.ok) throw new Error("Cancel failed");
      setBookings(prev => prev.map(b => b.id === cancelModalId ? { ...b, status: "canceled" } : b));
      setCancelModalId(null);
    } catch {
      alert("Failed to cancel booking");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (form.id) {
        const res = await fetch(`/api/admin/bookings/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceId: form.serviceId,
            date: form.date,
            time: form.time,
            name: form.name,
            email: form.email,
            phone: form.phone,
            notes: form.notes,
            status: form.status,
          }),
        });
        if (!res.ok) throw new Error("Update failed");
      } else {
        const res = await fetch(`/api/admin/bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceId: form.serviceId,
            date: form.date,
            time: form.time,
            name: form.name,
            email: form.email,
            phone: form.phone,
            notes: form.notes,
            status: form.status,
          }),
        });
        if (!res.ok) throw new Error("Create failed");
      }
      setIsModalOpen(false);
      await fetchBookings();
    } catch {
      alert("Failed to save booking");
    } finally {
      setSaving(false);
    }
  };

  const renderName = (r: { nameKey: string; nameEn?: string | null; nameJa?: string | null }) => {
    const val = language === 'ja' ? r.nameJa || r.nameEn : r.nameEn || r.nameJa;
    if (val && String(val).trim().length > 0) return String(val);
    const translated = t(r.nameKey);
    if (translated && translated !== r.nameKey) return translated;
    const key = (r.nameKey || '').split('.').pop() || '';
    return key.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getService = (id: string) => services.find((s) => s.id === id);
  const statuses = ["pending", "canceled", "booked"] as const;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-green-50/50 text-green-700 border-green-100 hover:bg-green-50 hover:border-green-200';
      case 'pending':
        return 'bg-yellow-50/50 text-yellow-700 border-yellow-100 hover:bg-yellow-50 hover:border-yellow-200';
      case 'canceled':
        return 'bg-red-50/50 text-red-700 border-red-100 hover:bg-red-50 hover:border-red-200';
      default:
        return 'bg-gray-50/50 text-gray-700 border-gray-100 hover:bg-gray-50 hover:border-gray-200';
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Status update failed");
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">{L('title')}</h1>
          <p className="text-gray-600 text-sm">{L('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-2 rounded-sm shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{bookings.length} {L('total')}</span>
          <button onClick={openCreate} className="ml-3 px-3 py-1.5 bg-gradient-to-r from-primary to-pink-400 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all">{L('new')}</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-sm p-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
              <p className="text-gray-500 text-sm">{L('pending')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-sm p-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-pink-400 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{bookedCount}</p>
              <p className="text-gray-500 text-sm">{L('booked')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-sm p-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{canceledCount}</p>
              <p className="text-gray-500 text-sm">{L('canceled')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-sm shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900">{L('thCustomer')}</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900 hidden md:table-cell">{L('thService')}</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900">{L('thDateTime')}</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900 hidden lg:table-cell">{L('thContact')}</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-900">{L('thStatus')}</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-sm font-medium text-gray-900">{L('thActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{b.name}</p>
                        <p className="text-xs text-gray-500 md:hidden">{b.email}</p>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      {(() => {
                        const svc = getService(b.serviceId);
                        return (
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-sm overflow-hidden bg-gray-100 shadow-sm">
                              <Image src={svc?.image || '/packages/1.jpg'} alt={svc ? renderName(svc) : 'Service'} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{svc ? renderName(svc) : b.serviceId}</p>
                              <p className="text-xs text-gray-500 truncate max-w-[200px]">{b.serviceId}</p>
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{b.date}</p>
                        <p className="text-xs text-gray-500">{b.time}</p>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                      <div>
                        <p className="text-sm text-gray-600">{b.email}</p>
                        <p className="text-xs text-gray-500">{b.phone}</p>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
                      <div className="relative inline-block w-full sm:w-auto min-w-[110px]">
                        <select
                          value={b.status}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                          className={`w-full appearance-none text-xs font-semibold border rounded-sm pl-3 pr-8 py-1.5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${getStatusStyle(b.status)}`}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                            backgroundPosition: 'right 0.5rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.25rem 1.25rem',
                          }}
                        >
                          {statuses.map((s) => {
                            const isSelected = s === b.status;
                            const optionColors = {
                              booked: { bg: '#dcfce7', text: '#166534', selectedBg: '#bbf7d0' },
                              pending: { bg: '#fef9c3', text: '#854d0e', selectedBg: '#fef08a' },
                              canceled: { bg: '#fee2e2', text: '#991b1b', selectedBg: '#fecaca' },
                            };
                            const colors = optionColors[s as keyof typeof optionColors];
                            return (
                              <option 
                                key={s} 
                                value={s}
                                style={{
                                  backgroundColor: isSelected ? colors.selectedBg : colors.bg,
                                  color: colors.text,
                                  padding: '8px 12px',
                                  fontWeight: isSelected ? '600' : '500',
                                }}
                              >
                                {isSelected ? '✓ ' : ''}{s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right space-x-1">
                      <button
                        onClick={() => openEdit(b)}
                        className="inline-flex items-center p-2 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m-1 14v-4m0 0l7-7a2.828 2.828 0 10-4-4l-7 7v4h4z"/></svg>
                      </button>
                      <button
                        onClick={() => setCancelModalId(b.id)}
                        className="inline-flex items-center p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Cancel Booking"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && bookings.length === 0 && !error && (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500">{L('noBookings')}</p>
          </div>
        )}
      </div>

      {cancelModalId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{L('confirmTitle')}</h3>
                <p className="text-sm text-gray-500">{L('confirmSub')}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">{L('confirmMsg')}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setCancelModalId(null)}
                className="px-4 py-2 text-sm font-medium text-secondary bg-accent/50 rounded-lg hover:bg-accent transition-colors"
              >
                {L('keep')}
              </button>
              <button
                onClick={handleCancelConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-400 to-rose-500 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                {L('yesCancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-pink-100">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-pink-400 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{form.id ? 'Edit Booking' : 'Create New Booking'}</h2>
                <p className="text-sm text-gray-500">Fill in the booking details below</p>
              </div>
            </div>
            
            <form onSubmit={handleSave} className="space-y-5">
              <div className="bg-gradient-to-r from-pink-50/50 to-rose-50/30 rounded-lg p-4 border border-pink-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Service Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service ID</label>
                  <input 
                    className="w-full px-4 py-2.5 border-2 border-pink-100 rounded-lg bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    value={form.serviceId} 
                    onChange={(e) => setForm({ ...form, serviceId: e.target.value })} 
                    placeholder="Enter service ID"
                    required 
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50/30 to-indigo-50/20 rounded-lg p-4 border border-blue-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Date & Time
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2.5 border-2 border-pink-100 rounded-lg bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      value={form.date} 
                      onChange={(e) => setForm({ ...form, date: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input 
                      type="time" 
                      className="w-full px-4 py-2.5 border-2 border-pink-100 rounded-lg bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      value={form.time} 
                      onChange={(e) => setForm({ ...form, time: e.target.value })} 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50/30 to-pink-50/30 rounded-lg p-4 border border-purple-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Customer Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input 
                      className="w-full px-4 py-2.5 border-2 border-pink-100 rounded-lg bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      value={form.name} 
                      onChange={(e) => setForm({ ...form, name: e.target.value })} 
                      placeholder="Customer name"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2.5 border-2 border-pink-100 rounded-lg bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      value={form.email} 
                      onChange={(e) => setForm({ ...form, email: e.target.value })} 
                      placeholder="email@example.com"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      className="w-full px-4 py-2.5 border-2 border-pink-100 rounded-lg bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      value={form.phone} 
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select 
                      className="w-full px-4 py-2.5 border-2 border-pink-100 rounded-lg bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                      value={form.status} 
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="booked">Booked</option>
                      <option value="canceled">Canceled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Notes (Optional)
                </label>
                <textarea 
                  className="w-full px-4 py-2.5 border-2 border-pink-100 rounded-lg bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" 
                  rows={3} 
                  value={form.notes ?? ''} 
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} 
                  placeholder="Add any special notes or requirements..."
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-pink-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-2.5 bg-accent/50 text-secondary rounded-lg hover:bg-accent transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-pink-400 text-white rounded-lg hover:shadow-lg hover:scale-105 disabled:opacity-50 transition-all font-medium inline-flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {form.id ? 'Update Booking' : 'Create Booking'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
