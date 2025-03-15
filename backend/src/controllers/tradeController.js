import Trade from '../models/Trade.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

const placeTrade = async (req, res) => {
  try {
    const { eventId, amount, outcome } = req.body;
    const event = await Event.findById(eventId);
    
    if (!event || event.status !== 'live') {
      return res.status(400).json({ message: 'Event not available for trading' });
    }

    const user = await User.findById(req.user.id);
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.balance -= amount;
    await user.save();

    const trade = new Trade({
      user: req.user.id,
      event: eventId,
      amount,
      outcome,
      status: 'open'
    });

    await trade.save();
    req.app.get('io').emit('new_trade', trade);
    res.status(201).json(trade);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const getUserTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user.id }).populate('event');
    res.json(trades);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export { placeTrade, getUserTrades };