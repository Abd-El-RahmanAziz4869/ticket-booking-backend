const eventService = require('./event.service');

const createEvent = async (req, res) => {
  const event = await eventService.createEvent(req.body);
  res.status(201).json(event);
};

const listEvents = async (req, res) => {
  const events = await eventService.listEvents();
  res.json(events);
};

module.exports = {
  createEvent,
  listEvents
};
