import Trade, { find } from '../models/Trade';
import { findById } from '../models/Event';
import { findById as _findById } from '../models/User';
import { error as _error } from '../utils/logger';

const placeTrade = async (req, res) => {
  try {
    const { eventId, amount, outcome } = req.body;
    const event = await findById(eventId);
    
    if (!event || event.status !== 'live') {
      return res.status(400).json({ message: 'Event not available for trading' });
    }

    const user = await _findById(req.user.id);
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
    _error(error.message);
    res.status(500).send('Server Error');
  }
};

const getUserTrades = async (req, res) => {
  try {
    const trades = await find({ user: req.user.id }).populate('event');
    res.json(trades);
  } catch (error) {
    _error(error.message);
    res.status(500).send('Server Error');
  }
};

export default { placeTrade, getUserTrades };