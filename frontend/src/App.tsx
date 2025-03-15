import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import EventsList from './components/EventsList.tsx';
import TradeForm from './components/TradeForm.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import { User, Event } from './types/types';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [eventsRes] = await Promise.all([
          axios.get<Event[]>('http://localhost:5000/api/events')
        ]);
        setEvents(eventsRes.data);
      } catch (err) {
        console.error('Initial data fetch failed:', err);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="container">
            <h1>Trading Platform</h1>
            <EventsList events={events} />
            {user && <TradeForm userId={user._id} />}
          </div>
        } />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;