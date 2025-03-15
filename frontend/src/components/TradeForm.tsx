import { useState } from 'react';
import axios from 'axios';
import { Event } from '../types/types';

interface TradeFormProps {
  userId: string;
}

const TradeForm = ({ userId }: TradeFormProps) => {
  const [formState, setFormState] = useState({
    eventId: '',
    amount: 0,
    outcome: ''
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/trades', {
        ...formState,
        userId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Reset form
      setFormState({ eventId: '', amount: 0, outcome: '' });
    } catch (err) {
      console.error('Trade submission failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="trade-form">
      <div className="form-group">
        <label htmlFor="eventId">Event ID</label>
        <input
          id="eventId"
          type="text"
          value={formState.eventId}
          onChange={(e) => setFormState({ ...formState, eventId: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          min="1"
          value={formState.amount}
          onChange={(e) => setFormState({ ...formState, amount: Number(e.target.value) })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="outcome">Outcome</label>
        <select
          id="outcome"
          value={formState.outcome}
          onChange={(e) => setFormState({ ...formState, outcome: e.target.value })}
        >
          {selectedEvent?.odds && Object.keys(selectedEvent.odds).map(outcome => (
            <option key={outcome} value={outcome}>{outcome}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="submit-btn">Place Trade</button>
    </form>
  );
};

export default TradeForm;