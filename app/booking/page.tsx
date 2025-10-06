'use client';

import { useState } from 'react';
import {
  Header,
  BackgroundPattern,
  CherryBlossomTrees,
  FallingPetals,
  Footer,
  Chatbot
} from '../components';

export default function BookingsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle bookings submission
    console.log('bookings submitted:', formData);
    alert('bookings request submitted! We will contact you soon to confirm.');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <BackgroundPattern />
      <CherryBlossomTrees />
      <FallingPetals />
      <Header />
      <Chatbot />

      <main className="relative z-10 pt-20 sm:pt-24">
        {/* Hero Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 sm:py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-sakura text-secondary mb-4">
              Book Your Appointment
            </h1>
            <p className="text-base sm:text-lg text-secondary/70 leading-relaxed max-w-2xl mx-auto">
              Schedule your relaxing experience at Sakura Saloon. Choose your preferred service and time.
            </p>
          </div>

          {/* bookings Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-primary/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-secondary bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-secondary bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-secondary mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-secondary bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-secondary mb-2">
                    Service *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-secondary bg-white/80 backdrop-blur-sm"
                  >
                    <option value="">Select a service</option>
                    <option value="japanese-head-spa">Japanese Head SPA (90 min)</option>
                    <option value="dry-head-spa">Dry Head SPA (60 min)</option>
                    <option value="imperial-retreat">Imperial Retreat (120 min)</option>
                    <option value="nail-art">Nail Art (60 min)</option>
                    <option value="lash-extension">Lash Extension (90 min)</option>
                    <option value="brow-styling">Brow Styling (45 min)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-secondary mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-secondary bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-secondary mb-2">
                    Preferred Time *
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-secondary bg-white/80 backdrop-blur-sm"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-secondary mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-secondary bg-white/80 backdrop-blur-sm resize-none"
                  placeholder="Any special requests or notes..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
