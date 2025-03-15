import { get } from 'axios';
import Event from '../models/Event.js';
import { schedule } from 'node-cron';

// Mock API integration
const fetchEvents = async () => {
  try {
    // Replace with actual API endpoint
    const response = await get('https://mock-sports-api.com/events');
    await Event.bulkWrite(response.data.map(event => ({
      updateOne: {
        filter: { externalId: event.id },
        update: { $set: event },
        upsert: true
      }
    })));
    console.log('Events data updated');
  } catch (error) {
    console.error(`Event fetch error: ${error.message}`);
  }
};

// Schedule event settlement every minute
schedule('* * * * *', async () => {
  try {
    const events = await Event.find({
      endTime: { $lte: new Date() },
      status: { $ne: 'completed' }
    });

    for (const event of events) {
      event.status = 'completed';
      event.outcome = calculateOutcome(event); // Implement your outcome logic
      await event.save();
      await settleTrades(event);
    }
  } catch (error) {
    _error(`Settlement error: ${error.message}`);
  }
});

export default { fetchEvents };