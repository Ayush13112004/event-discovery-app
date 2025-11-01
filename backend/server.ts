import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Type Definitions ---
interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  date: string;
  maxParticipants: number;
  currentParticipants: number;
}

interface CreateEventBody {
  title: string;
  description?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  date: string;
  maxParticipants: number;
}

// --- In-Memory Database ---
let events: Event[] = [
  {
    id: 1,
    title: 'React Conference 2025',
    description: 'Annual conference for React developers.',
    location: 'Miami',
    latitude: 25.7617,
    longitude: -80.1918,
    date: '2025-12-10T09:00:00',
    maxParticipants: 100,
    currentParticipants: 45,
  },
  {
    id: 2,
    title: 'Node.js Meetup',
    description: 'Monthly meetup for the Node.js community.',
    location: 'Online',
    date: '2025-11-20T18:30:00',
    maxParticipants: 50,
    currentParticipants: 30,
  },
  {
    id: 3,
    title: 'Local Art Fair',
    description: 'Discover local artists and creators.',
    location: 'Miami',
    latitude: 25.7743,
    longitude: -80.1937,
    date: '2025-11-15T11:00:00',
    maxParticipants: 200,
    currentParticipants: 112,
  },
  {
    id: 4,
    title: 'Tech Startup Pitch Night',
    description: 'Watch innovative startups pitch their ideas.',
    location: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
    date: '2025-11-25T19:00:00',
    maxParticipants: 150,
    currentParticipants: 89,
  },
  {
    id: 5,
    title: 'Marathon Training Group',
    description: 'Weekly long run with experienced marathoners.',
    location: 'New York',
    latitude: 40.7128,
    longitude: -74.0060,
    date: '2025-11-18T07:00:00',
    maxParticipants: 30,
    currentParticipants: 22,
  },
];
let nextId = 6;

// --- API Endpoints ---

// 1. GET /api/events - List all events (with optional location filter)
app.get('/api/events', (req: Request, res: Response) => {
  const { location, search } = req.query;

  let filteredEvents = events;

  // Filter by location
  if (location && typeof location === 'string') {
    filteredEvents = filteredEvents.filter(
      (e) => e.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  // Search functionality
  if (search && typeof search === 'string') {
    const searchLower = search.toLowerCase();
    filteredEvents = filteredEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(searchLower) ||
        e.description.toLowerCase().includes(searchLower) ||
        e.location.toLowerCase().includes(searchLower)
    );
  }

  res.json(filteredEvents);
});

// 2. GET /api/events/:id - Get single event details
app.get('/api/events/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const event = events.find((e) => e.id === parseInt(id, 10));

  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

// 3. POST /api/events - Create a new event
app.post('/api/events', (req: Request<{}, {}, CreateEventBody>, res: Response) => {
  const { title, description, location, latitude, longitude, date, maxParticipants } = req.body;

  // Basic validation
  if (!title || !location || !date || !maxParticipants) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newEvent: Event = {
    id: nextId++,
    title,
    description: description || '',
    location,
    latitude,
    longitude,
    date,
    maxParticipants: parseInt(maxParticipants.toString(), 10),
    currentParticipants: 0,
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
});

// 4. PUT /api/events/:id/register - Register for an event
app.put('/api/events/:id/register', (req: Request, res: Response) => {
  const { id } = req.params;
  const event = events.find((e) => e.id === parseInt(id, 10));

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (event.currentParticipants >= event.maxParticipants) {
    return res.status(400).json({ message: 'Event is full' });
  }

  event.currentParticipants++;
  res.json(event);
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});