import { useState, useEffect } from 'react';
import axios from 'axios';
import { Event } from '../types/types';

interface TradeFormProps {
  userId: string;
  events: Event[];
}

const TradeForm = ({ userId, events }: TradeFormProps) => {
  const [formState, setFormState] = useState({
    eventId: '',
    amount: 0,
    outcome: ''
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (formState.eventId) {
      const event = events.find(e => e._id === formState.eventId);
      setSelectedEvent(event || null);
    }
  }, [formState.eventId, events]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/trades', {
        ...formState,
        userId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFormState({ eventId: '', amount: 0, outcome: '' });
    } catch (err) {
      console.error('Trade submission failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
          <select
            value={formState.eventId}
            onChange={(e) => setFormState({ ...formState, eventId: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Event</option>
            {events.map(event => (
              <option key={event._id} value={event._id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            min="1"
            value={formState.amount}
            onChange={(e) => setFormState({ ...formState, amount: Number(e.target.value) })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
          <select
            value={formState.outcome}
            onChange={(e) => setFormState({ ...formState, outcome: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
            disabled={!selectedEvent}
          >
            <option value="">Select Outcome</option>
            {selectedEvent?.odds && Object.keys(selectedEvent.odds).map(outcome => (
              <option key={outcome} value={outcome}>{outcome}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Place Trade
        </button>
      </div>
    </form>
  );
};

export default TradeForm;