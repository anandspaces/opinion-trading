import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Event } from '../types/types';

interface EventsListProps {
  events: Event[] | null | undefined;
  onEventUpdate: (updatedEvent: Event) => void;
}

const EventsList = ({ events, onEventUpdate }: EventsListProps) => {
  useEffect(() => {
    const socket: Socket = io('/');

    socket.on('event_update', (updatedEvent: Event) => {
      onEventUpdate(updatedEvent);
    });

    return () => {
      socket.disconnect();
    };
  }, [onEventUpdate]);

  if (!events || !Array.isArray(events)) {
    return (
      <div className="text-center text-gray-500">
        No events available.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map(event => (
        <div key={event._id} className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-2 text-gray-800">{event.name}</h3>
          <div className="space-y-2">
            <p className="text-sm">
              Status: <span className={`font-medium ${
                event.status === 'live' ? 'text-green-600' :
                event.status === 'completed' ? 'text-gray-500' : 'text-yellow-600'
              }`}>
                {event.status}
              </span>
            </p>
            <div className="space-y-1">
              {Object.entries(event.odds).map(([outcome, odds]) => (
                <div key={outcome} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{outcome}</span>
                  <span className="text-sm font-medium text-gray-800">{odds.toFixed(2)}</span>
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