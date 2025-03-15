import { Schema, model } from 'mongoose';

const tradeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  amount: { type: Number, required: true, min: 1 },
  outcome: { type: String, required: true },
  status: { type: String, enum: ['open', 'won', 'lost'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

export default model('Trade', tradeSchema);