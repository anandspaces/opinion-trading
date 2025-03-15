import { io, Socket } from 'socket.io-client';
import { Event, Trade } from './types/types';

let socket: Socket;

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: false
    });
  }
  return socket;
};

export const connectSocket = (
  onTradeUpdate: (trade: Trade) => void,
  onEventUpdate: (event: Event) => void
) => {
  socket.connect();
  
  socket.on('new_trade', onTradeUpdate);
  socket.on('event_update', onEventUpdate);
  
  return () => {
    socket.off('new_trade', onTradeUpdate);
    socket.off('event_update', onEventUpdate);
    socket.disconnect();
  };
};