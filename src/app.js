const express = require('express');

const authRoutes = require('./modules/auth/auth.routes');
const eventRoutes = require('./modules/events/event.routes');
const seatRoutes = require('./modules/seats/seat.routes');
const bookingRoutes = require('./modules/bookings/booking.routes');
const reservationRoutes = require('./modules/reservations/reservation.routes');
const paymentRoutes = require('./modules/payments/payment.routes');

const errorHandler = require('./common/middleware/error.middleware');

const app = express();
app.use(express.json());


app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});


app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/', seatRoutes);
app.use('/reservations', reservationRoutes);
app.use('/payments', paymentRoutes);
app.use('/bookings', bookingRoutes);


app.use(errorHandler);

module.exports = app;
