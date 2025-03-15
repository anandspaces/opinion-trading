import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trade, Event } from '../types/types';

const AdminPanel = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [tradesRes, eventsRes] = await Promise.all([
          axios.get<Trade[]>('http://localhost:5000/api/admin/trades'),
          axios.get<Event[]>('http://localhost:5000/api/admin/events')
        ]);
        setTrades(tradesRes.data);
        setEvents(eventsRes.data);
      } catch (err) {
        console.error('Admin data fetch failed:', err);
      }
    };

    fetchAdminData();
  }, []);

  const settleEvent = async (eventId: string) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/events/${eventId}/settle`);
      setEvents(prev => prev.filter(e => e._id !== eventId));
    } catch (err) {
      console.error('Settlement failed:', err);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Dashboard</h2>
      
      <section className="events-section">
        <h3>Active Events</h3>
        <div className="events-list">
          {events.map(event => (
            <div key={event._id} className="admin-event-card">
              <div className="event-header">
                <h4>{event.name}</h4>
                <button onClick={() => settleEvent(event._id)}>Settle Event</button>
              </div>
              <p>Status: {event.status}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="trades-section">
        <h3>Recent Trades</h3>
        <table className="trades-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Event</th>
              <th>Amount</th>
              <th>Outcome</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(trade => (
              <tr key={trade._id}>
                <td>{trade.user}</td>
                <td>{trade.event.name}</td>
                <td>${trade.amount}</td>
                <td>{trade.outcome}</td>
                <td className={`status-${trade.status}`}>{trade.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminPanel;