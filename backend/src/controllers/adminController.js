import { find, findById } from '../models/User';
import { find as _find } from '../models/Trade';
import { error as _error } from '../utils/logger';

const getAllUsers = async (req, res) => {
  try {
    const users = await find().select('-password');
    res.json(users);
  } catch (error) {
    _error(error.message);
    res.status(500).send('Server Error');
  }
};

const settleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const trades = await _find({ event: event._id, status: 'open' });

    for (const trade of trades) {
      const user = await findById(trade.user);
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
    _error(error.message);
    res.status(500).send('Server Error');
  }
};

export default { getAllUsers, settleEvent };