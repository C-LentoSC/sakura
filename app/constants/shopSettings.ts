// Shop Settings Configuration
// In the future, this will be managed via admin panel

export interface ShopHours {
  day: string;
  isOpen: boolean;
  openTime: string; // 24-hour format (e.g., "08:00")
  closeTime: string; // 24-hour format (e.g., "22:00")
  breakStart?: string; // Optional lunch break
  breakEnd?: string;
}

export interface ShopSettings {
  name: string;
  timezone: string;
  slotDuration: number; // minutes per slot
  bufferTime: number; // minutes between appointments
  advanceBookingDays: number; // how many days in advance can book
  hours: ShopHours[];
}

// Default shop settings - will be configurable via admin panel
export const SHOP_SETTINGS: ShopSettings = {
  name: "Sakura Saloon",
  timezone: "Asia/Kolkata",
  slotDuration: 30, // 30-minute slots
  bufferTime: 15, // 15-minute buffer between appointments
  advanceBookingDays: 30, // Can book up to 30 days in advance
  hours: [
    {
      day: "monday",
      isOpen: true,
      openTime: "09:00",
      closeTime: "21:00",
      breakStart: "13:00",
      breakEnd: "14:00"
    },
    {
      day: "tuesday",
      isOpen: true,
      openTime: "09:00",
      closeTime: "21:00",
      breakStart: "13:00",
      breakEnd: "14:00"
    },
    {
      day: "wednesday",
      isOpen: true,
      openTime: "09:00",
      closeTime: "21:00",
      breakStart: "13:00",
      breakEnd: "14:00"
    },
    {
      day: "thursday",
      isOpen: true,
      openTime: "09:00",
      closeTime: "21:00",
      breakStart: "13:00",
      breakEnd: "14:00"
    },
    {
      day: "friday",
      isOpen: true,
      openTime: "09:00",
      closeTime: "22:00", // Extended Friday hours
      breakStart: "13:00",
      breakEnd: "14:00"
    },
    {
      day: "saturday",
      isOpen: true,
      openTime: "08:00", // Early Saturday start
      closeTime: "22:00",
      breakStart: "13:00",
      breakEnd: "14:00"
    },
    {
      day: "sunday",
      isOpen: true,
      openTime: "10:00", // Late Sunday start
      closeTime: "19:00", // Early Sunday close
      breakStart: "14:00",
      breakEnd: "15:00"
    }
  ]
};

// Mock existing bookings - in real app this would come from database
export interface ExistingBooking {
  id: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  duration: number; // minutes
  serviceId: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

// Mock data - will be replaced with API calls
export const EXISTING_BOOKINGS: ExistingBooking[] = [
  {
    id: "1",
    date: "2025-01-08",
    time: "10:00",
    duration: 60,
    serviceId: 1,
    status: "confirmed"
  },
  {
    id: "2", 
    date: "2025-01-08",
    time: "14:30",
    duration: 90,
    serviceId: 2,
    status: "confirmed"
  },
  {
    id: "3",
    date: "2025-01-09",
    time: "11:00",
    duration: 120,
    serviceId: 3,
    status: "confirmed"
  }
];
