import { SHOP_SETTINGS, EXISTING_BOOKINGS, type ExistingBooking } from '../constants/shopSettings';

export interface TimeSlot {
  time: string; // Display format (e.g., "10:00 AM")
  value: string; // 24-hour format (e.g., "10:00")
  isAvailable: boolean;
  isBooked: boolean;
  conflictReason?: string;
}

/**
 * Convert 24-hour time to 12-hour display format
 */
function formatTime12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Convert 12-hour time to 24-hour format
 */
// Removed unused parseTime24Hour helper (not referenced anywhere)

/**
 * Add minutes to a time string
 */
function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
}

/**
 * Check if a time slot conflicts with existing bookings
 */
function isTimeSlotBooked(
  date: string,
  startTime: string,
  serviceDuration: number,
  existingBookings: ExistingBooking[]
): { isBooked: boolean; conflictReason?: string } {
  const slotStart = startTime;
  const slotEnd = addMinutes(startTime, serviceDuration + SHOP_SETTINGS.bufferTime);
  
  for (const booking of existingBookings) {
    if (booking.date !== date || booking.status === 'cancelled') continue;
    
    const bookingStart = booking.time;
    const bookingEnd = addMinutes(booking.time, booking.duration + SHOP_SETTINGS.bufferTime);
    
    // Check for overlap
    if (
      (slotStart >= bookingStart && slotStart < bookingEnd) ||
      (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
      (slotStart <= bookingStart && slotEnd >= bookingEnd)
    ) {
      return {
        isBooked: true,
        conflictReason: `Conflicts with existing booking at ${formatTime12Hour(bookingStart)}`
      };
    }
  }
  
  return { isBooked: false };
}

/**
 * Generate available time slots for a specific date
 */
export function generateTimeSlots(
  selectedDate: string,
  serviceDuration: number = 60
): TimeSlot[] {
  const date = new Date(selectedDate);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  // Find shop hours for the selected day
  const dayHours = SHOP_SETTINGS.hours.find(h => h.day === dayName);
  
  if (!dayHours || !dayHours.isOpen) {
    return []; // Shop is closed on this day
  }
  
  const slots: TimeSlot[] = [];
  const { openTime, closeTime, breakStart, breakEnd } = dayHours;
  
  // Generate slots from opening to closing time
  let currentTime = openTime;
  
  while (currentTime < closeTime) {
    // Check if current time would allow service to complete before closing
    const serviceEndTime = addMinutes(currentTime, serviceDuration);
    if (serviceEndTime > closeTime) {
      break;
    }
    
    // Skip break time if defined
    const isInBreak = breakStart && breakEnd && 
      currentTime >= breakStart && currentTime < breakEnd;
    
    if (!isInBreak) {
      // Check for booking conflicts
      const { isBooked, conflictReason } = isTimeSlotBooked(
        selectedDate,
        currentTime,
        serviceDuration,
        EXISTING_BOOKINGS
      );
      
      // Check if it's too late to book (past time for today)
      const now = new Date();
      const slotDateTime = new Date(`${selectedDate}T${currentTime}`);
      const isPastTime = selectedDate === now.toISOString().split('T')[0] && 
        slotDateTime <= now;
      
      slots.push({
        time: formatTime12Hour(currentTime),
        value: currentTime,
        isAvailable: !isBooked && !isPastTime,
        isBooked,
        conflictReason: isPastTime ? 'Time has passed' : conflictReason
      });
    }
    
    // Move to next slot
    currentTime = addMinutes(currentTime, SHOP_SETTINGS.slotDuration);
  }
  
  return slots;
}

/**
 * Get shop hours for a specific day
 */
export function getShopHours(date: string): {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  hasBreak?: boolean;
  breakTime?: string;
} {
  const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const dayHours = SHOP_SETTINGS.hours.find(h => h.day === dayName);
  
  if (!dayHours || !dayHours.isOpen) {
    return { isOpen: false };
  }
  
  return {
    isOpen: true,
    openTime: formatTime12Hour(dayHours.openTime),
    closeTime: formatTime12Hour(dayHours.closeTime),
    hasBreak: !!(dayHours.breakStart && dayHours.breakEnd),
    breakTime: dayHours.breakStart && dayHours.breakEnd 
      ? `${formatTime12Hour(dayHours.breakStart)} - ${formatTime12Hour(dayHours.breakEnd)}`
      : undefined
  };
}

/**
 * Check if a date is available for booking
 */
export function isDateAvailable(date: string): boolean {
  const selectedDate = new Date(date);
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + SHOP_SETTINGS.advanceBookingDays);
  
  // Check if date is in valid range
  if (selectedDate < today || selectedDate > maxDate) {
    return false;
  }
  
  // Check if shop is open on this day
  const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const dayHours = SHOP_SETTINGS.hours.find(h => h.day === dayName);
  
  return !!(dayHours && dayHours.isOpen);
}
