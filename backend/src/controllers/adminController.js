import User from '../models/User.js';
import Trade from '../models/Trade.js';
import Event from '../models/Event.js';

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const settleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const trades = await Trade.find({ event: event._id, status: 'open' });

    for (const trade of trades) {
      const user = await User.findById(trade.user);
      if (event.outcome === trade.outcome) {
        user.balance += trade.amount * 2; // Assuming 1:1 payout
        trade.status = 'won';
      } else {
        trade.status = 'lost';
      }
      await user.save();
      await trade.save();
    }

    req.app.get('io').emit('event_settled', event);
    res.json({ message: 'Event settled successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export { getAllUsers, settleEvent };