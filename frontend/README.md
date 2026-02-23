# Ticket Booking System - Frontend

A modern React-based frontend for a comprehensive ticket booking system with event management, secure authentication, and Stripe payment integration.

## Features

- **Event Discovery**: Browse and search for upcoming events
- **User Authentication**: Secure registration and login with JWT
- **Seat Selection**: Interactive seat selection interface with real-time availability
- **Secure Payments**: Stripe integration for safe and reliable payments
- **Booking Management**: View, manage, and cancel bookings
- **Admin Dashboard**: Comprehensive dashboard for event and booking management
- **Responsive Design**: Mobile-first design that works on all devices

## Tech Stack

- **React 18**: Modern UI framework
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **React Hook Form + Zod**: Form validation with strong typing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **Zustand**: Lightweight state management
- **Stripe**: Payment processing
- **Lucide React**: Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 16+
- npm, yarn, pnpm, or bun

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file with your environment variables:
```env
VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── EventDetailsPage.jsx
│   │   ├── BookingPage.jsx
│   │   ├── BookingConfirmationPage.jsx
│   │   ├── BookingHistoryPage.jsx
│   │   └── AdminDashboard.jsx
│   ├── components/         # Reusable components
│   │   ├── Layout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── PaymentForm.jsx
│   │   └── ...
│   ├── services/           # API and external services
│   │   ├── api.js
│   │   └── stripe.js
│   ├── context/            # React Context
│   │   └── AuthContext.jsx
│   ├── store/              # State management (Zustand)
│   │   └── bookingStore.js
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Key Features Explained

### Authentication

- **JWT-based authentication**: Secure token-based authentication
- **Auto-logout on token expiration**: Automatic redirect to login when token expires
- **Protected routes**: Admin routes require admin role verification
- **User profile management**: Persistent user state across sessions

### Event Management

- **Event listing with search**: Filter events by name and description
- **Detailed event information**: View comprehensive event details
- **Real-time seat availability**: See available seats in real-time
- **Seat status tracking**: Distinguish between available, booked, and selected seats

### Booking System

- **Multi-step booking flow**: Intuitive seat selection → payment → confirmation
- **Seat selection interface**: Visual seat grid with status indicators
- **Order summary**: Real-time price calculation
- **Booking history**: Track all past and current bookings
- **Cancellation**: Cancel bookings with automatic refund processing (up to 48 hours before event)

### Payment Integration

- **Stripe integration**: Secure payment processing with Stripe
- **Multiple payment methods**: Support for card and other payment methods
- **3D Secure support**: Enhanced security for sensitive transactions
- **Payment validation**: Server-side validation of payment amounts
- **Error handling**: Clear error messages for payment failures

### Admin Dashboard

- **Revenue tracking**: Monitor total revenue and monthly earnings
- **Event analytics**: View event performance and booking statistics
- **User metrics**: Track total users and bookings
- **Event management**: Create, edit, and manage events
- **Booking overview**: Monitor all bookings and user activity

## API Integration

The frontend communicates with the backend API at `http://localhost:3000/api`.

### Main API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `GET /events` - List all events
- `GET /events/:id` - Get event details
- `GET /events/:id/seats` - Get event seats
- `POST /bookings` - Create booking
- `GET /bookings/user/bookings` - Get user's bookings
- `PATCH /bookings/:id/cancel` - Cancel booking
- `POST /payments/initiate` - Initiate payment
- `POST /payments/confirm` - Confirm payment

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |

## Component Documentation

### Protected Routes

Secure routes that require authentication:

```jsx
<Route
  path="/booking/:eventId"
  element={
    <ProtectedRoute>
      <BookingPage />
    </ProtectedRoute>
  }
/>
```

### Auth Context

Access authentication state and methods:

```jsx
const { user, isAuthenticated, login, logout } = useAuth();
```

### Booking Store

Manage booking state across components:

```jsx
const { currentBooking, setEvent, setSelectedSeats } = useBookingStore();
```

## Error Handling

The application includes comprehensive error handling:

- **API errors**: Display user-friendly error messages
- **Form validation**: Real-time validation with Zod
- **Network errors**: Automatic retry logic with exponential backoff
- **Authentication errors**: Auto-redirect to login on token expiration

## Performance Optimizations

- **Code splitting**: Lazy load routes for faster initial load
- **Caching**: Axios configuration with smart caching
- **Memoization**: React.memo for expensive components
- **Tailwind CSS**: Purged unused styles in production

## Security

- **JWT tokens**: Stored in localStorage with XSS protection
- **Input validation**: Zod for strict input validation
- **HTTPS ready**: Works with both HTTP and HTTPS
- **CORS handling**: Proper CORS configuration for API calls
- **Stripe security**: PCI-compliant payment handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is part of the Ticket Booking System and follows the same license as the main project.

## Support

For issues or questions, please refer to the main project documentation or contact the development team.
