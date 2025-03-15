export interface Event {
  _id: string;
  name: string;
  category: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'live' | 'completed';
  outcome?: string;
  odds: Record<string, number>;
}

export interface Trade {
  _id: string;
  user: string;
  event: Event;
  amount: number;
  outcome: string;
  status: 'open' | 'won' | 'lost';
  createdAt: string;
}

export interface User {
  _id: string;
  username: string;
  role: 'user' | 'admin';
  balance: number;
}