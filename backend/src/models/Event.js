import { Schema, model } from 'mongoose';

const eventSchema = new Schema({
  name: { type: String, required: true },
  category: String,
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['upcoming', 'live', 'completed'], 
    default: 'upcoming' 
  },
  outcome: String,
  odds: { type: Map, of: Number },
  externalId: String
});

export default model('Event', eventSchema);