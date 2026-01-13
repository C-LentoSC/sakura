// Booking storage utilities for managing user bookings

export interface BookingData {
  id: number;
  service: string;
  image: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  status: string; // Allow any status from server: PENDING, BOOKED, CONFIRMED, COMPLETED, CANCELLED, CANCELED, NO-SHOW
  createdAt: string;
}

// Load bookings from localStorage
export const loadBookings = (): BookingData[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('userBookings');
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

// Save bookings to localStorage
export const saveBookings = (bookings: BookingData[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userBookings', JSON.stringify(bookings));
  }
};

// Add a new booking with validation
export const addBooking = (newBooking: Omit<BookingData, 'id' | 'createdAt' | 'status'>): { success: boolean; booking?: BookingData; errors?: string[] } => {
  // Validate booking data
  const validation = validateBooking(newBooking);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }
  
  const bookings = loadBookings();
  
  // Generate new ID
  const newId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
  
  // Create booking with ID and timestamp
  const booking: BookingData = {
    ...newBooking,
    id: newId,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  };
  
  // Add to bookings and save
  const updatedBookings = [...bookings, booking];
  saveBookings(updatedBookings);
  
  return { success: true, booking };
};

// Update booking status
export const updateBookingStatus = (bookingId: number, status: string): void => {
  const bookings = loadBookings();
  const updatedBookings = bookings.map(booking =>
    booking.id === bookingId ? { ...booking, status } : booking
  );
  saveBookings(updatedBookings);
};

// Delete a booking
export const deleteBooking = (bookingId: number): void => {
  const bookings = loadBookings();
  const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
  saveBookings(updatedBookings);
};

// Get bookings by status
export const getBookingsByStatus = (status?: string): BookingData[] => {
  const bookings = loadBookings();
  return status ? bookings.filter(booking => booking.status === status) : bookings;
};

// Helper function to convert time string to minutes
const timeToMinutes = (timeStr: string): number => {
  const [time, period] = timeStr.split(' ');
  const [hoursStr, minsStr] = time.split(':');
  let hours = parseInt(hoursStr);
  const mins = parseInt(minsStr);
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return hours * 60 + mins;
};

// Helper function to convert minutes to time string
const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
};

// Get all blocked time slots for a specific date (including time ranges)
export const getBlockedTimeSlots = (date: string): string[] => {
  const bookings = loadBookings();
  const blockedSlots: string[] = [];
  
  bookings
    .filter(booking => booking.date === date && booking.status === 'CONFIRMED')
    .forEach(booking => {
      const startMinutes = timeToMinutes(booking.time);
      const durationMinutes = parseInt(booking.duration.replace(' min', ''));
      const endMinutes = startMinutes + durationMinutes;
      
      // Generate all 30-minute slots within the booking duration
      for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
        const timeSlot = minutesToTime(minutes);
        if (!blockedSlots.includes(timeSlot)) {
          blockedSlots.push(timeSlot);
        }
      }
    });
  
  return blockedSlots;
};

// Get booked time slots for a specific date (backward compatibility)
export const getBookedTimeSlots = (date: string): string[] => {
  return getBlockedTimeSlots(date);
};

// Check if a time slot conflicts with existing bookings
export const isTimeSlotAvailable = (date: string, time: string, duration: number = 30): boolean => {
  const blockedSlots = getBlockedTimeSlots(date);
  const startMinutes = timeToMinutes(time);
  const endMinutes = startMinutes + duration;
  
  // Check if any part of the requested time slot conflicts with blocked slots
  for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
    const checkTime = minutesToTime(minutes);
    if (blockedSlots.includes(checkTime)) {
      return false;
    }
  }
  
  return true;
};

// Validate booking data
export const validateBooking = (booking: Omit<BookingData, 'id' | 'createdAt' | 'status'>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check required fields
  if (!booking.service) errors.push('Service is required');
  if (!booking.date) errors.push('Date is required');
  if (!booking.time) errors.push('Time is required');
  if (!booking.duration) errors.push('Duration is required');
  if (!booking.price || booking.price <= 0) errors.push('Valid price is required');
  
  // Check date is not in the past
  const bookingDate = new Date(booking.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (bookingDate < today) {
    errors.push('Cannot book appointments in the past');
  }
  
  // Check time slot availability
  if (booking.date && booking.time && booking.duration) {
    const duration = parseInt(booking.duration.replace(' min', ''));
    if (!isTimeSlotAvailable(booking.date, booking.time, duration)) {
      errors.push('Selected time slot is not available');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
