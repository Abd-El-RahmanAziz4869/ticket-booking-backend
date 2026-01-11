const Event = require('./event.model');
const Seat = require('../seats/seat.model');

const createEvent = async ({ name, venue, date, seatCount }) => {
  const event = await Event.create({
    name,
    venue,
    date,
    seatsTotal: seatCount
  });

  const seats = [];
  for (let i = 1; i <= seatCount; i++) {
    seats.push({
      eventId: event._id,
      seatNumber: `S${i}`
    });
  }

  await Seat.insertMany(seats);

  return event;
};

const listEvents = async () => {
  return Event.find({ isPublished: true });
};

module.exports = {
  createEvent,
  listEvents
};
