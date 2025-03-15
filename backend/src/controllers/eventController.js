import Event from '../models/Event.js';

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ startTime: 1 });
    res.json(events);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Admin controllers
const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    req.app.get('io').emit('event_update', event);
    res.status(201).json(event);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    req.app.get('io').emit('event_update', event);
    res.json(event);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export { getEvents, getEventById, createEvent, updateEvent };