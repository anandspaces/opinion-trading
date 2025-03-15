import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Event } from '../types/types';

interface EventsListProps {
  events: Event[];
}

const EventsList = ({ events }: EventsListProps) => {
  useEffect(() => {
    const socket: Socket = io('http://localhost:5000');

    socket.on('event_update', (updatedEvent: Event) => {
      // Handle real-time updates
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="events-grid">
      {events.map(event => (
        <div key={event._id} className="event-card">
          <h3>{event.name}</h3>
          <div className="event-details">
            <p>Status: <span className={`status-${event.status}`}>{event.status}</span></p>
            <div className="odds-container">
              {Object.entries(event.odds).map(([outcome, odds]) => (
                <div key={outcome} className="odd-item">
                  <span>{outcome}:</span>
                  <span>{odds.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsList;