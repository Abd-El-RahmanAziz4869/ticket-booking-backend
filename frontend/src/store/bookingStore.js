import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  // State
  currentBooking: {
    eventId: null,
    eventName: null,
    eventDate: null,
    eventPrice: null,
    selectedSeats: [],
    totalPrice: 0,
    paymentMethod: 'card',
    customerEmail: '',
    customerName: '',
  },

  // Actions
  setEvent: (event) =>
    set((state) => ({
      currentBooking: {
        ...state.currentBooking,
        eventId: event.id,
        eventName: event.name,
        eventDate: event.date,
        eventPrice: event.ticketPrice,
      },
    })),

  setSelectedSeats: (seats) =>
    set((state) => ({
      currentBooking: {
        ...state.currentBooking,
        selectedSeats: seats,
        totalPrice: seats.length * (state.currentBooking.eventPrice || 0),
      },
    })),

  setCustomerInfo: (email, name) =>
    set((state) => ({
      currentBooking: {
        ...state.currentBooking,
        customerEmail: email,
        customerName: name,
      },
    })),

  setPaymentMethod: (method) =>
    set((state) => ({
      currentBooking: {
        ...state.currentBooking,
        paymentMethod: method,
      },
    })),

  resetBooking: () =>
    set({
      currentBooking: {
        eventId: null,
        eventName: null,
        eventDate: null,
        eventPrice: null,
        selectedSeats: [],
        totalPrice: 0,
        paymentMethod: 'card',
        customerEmail: '',
        customerName: '',
      },
    }),

  getBookingSummary: (state) => ({
    eventId: state.currentBooking.eventId,
    eventName: state.currentBooking.eventName,
    seatCount: state.currentBooking.selectedSeats.length,
    totalPrice: state.currentBooking.totalPrice,
    seats: state.currentBooking.selectedSeats,
    email: state.currentBooking.customerEmail,
    name: state.currentBooking.customerName,
  }),
}));
