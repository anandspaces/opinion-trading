import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import EventsList from './components/EventsList';
import TradeForm from './components/TradeForm';
import AdminPanel from './components/AdminPanel';
import AuthForm from './components/AuthForm';
import { User, Event } from './types/types';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [eventsRes] = await Promise.all([
          axios.get<Event[]>('/api/events')
        ]);
        setEvents(eventsRes.data);
      } catch (err) {
        console.error('Initial data fetch failed:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleEventUpdate = (updatedEvent: Event) => {
    setEvents(prev => prev.map(event => 
      event._id === updatedEvent._id ? updatedEvent : event
    ));
  };

  // Update user state after auth
  const handleAuthSuccess = (userData: User) => {
    setUser({
      _id: userData._id,
      username: userData.username,
      role: userData.role,
      balance: userData.balance
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={
            <div className="max-w-7xl mx-auto p-6">
              <h1 className="text-4xl font-bold mb-8 text-gray-800">Trading Platform</h1>
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <EventsList events={events} onEventUpdate={handleEventUpdate} />
                </div>
                <div className="lg:col-span-1">
                  {user ? (
                    <TradeForm userId={user._id} events={events} />
                  ) : (
                    <AuthForm onAuthSuccess={handleAuthSuccess} />
                  )}
                </div>
              </div>
            </div>
          } />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;