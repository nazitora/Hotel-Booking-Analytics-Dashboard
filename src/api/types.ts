export interface Booking {
  id: string;
  guestName: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  amount: number;
  currency: string;
  roomType: string;
  paymentStatus: 'paid' | 'pending' | 'unpaid';
  bookingDate: string;
}

export interface Metrics {
  totalBookings: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  totalRevenue: number;
  averageBookingValue: number;
  occupancyRate: number;
  conversionRate: number;
}

export interface Trend {
  month: string;
  bookings: number;
  revenue: number;
  avgRoomRate: number;
}

export interface APIResponse<T> {
  success: boolean;
  count?: number;
  period?: string;
  data: T;
}
