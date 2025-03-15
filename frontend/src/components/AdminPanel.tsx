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
          axios.get<Trade[]>('/api/admin/trades'),
          axios.get<Event[]>('/api/admin/events')
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
      await axios.post(`/api/admin/events/${eventId}/settle`);
      setEvents(prev => prev.filter(e => e._id !== eventId));
    } catch (err) {
      console.error('Settlement failed:', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h2>
      
      <section className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Active Events</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <div key={event._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">{event.name}</h4>
                <button 
                  onClick={() => settleEvent(event._id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Settle
                </button>
              </div>
              <p className={`text-sm ${
                event.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                Status: {event.status}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Recent Trades</h3>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Event</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Outcome</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trades.map(trade => (
                <tr key={trade._id}>
                  <td className="px-4 py-3 text-sm text-gray-700">{trade.user}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{trade.event.name}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">${trade.amount}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{trade.outcome}</td>
                  <td className={`px-4 py-3 text-sm font-medium ${
                    trade.status === 'won' ? 'text-green-600' : 
                    trade.status === 'lost' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {trade.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;