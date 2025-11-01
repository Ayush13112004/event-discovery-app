const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allows frontend to make requests
app.use(express.json()); // Parses incoming JSON bodies

// --- In-Memory Database ---
let events = [
  {
    id: 1,
    title: 'React Conference 2025',
    description: 'Annual conference for React developers.',
    location: 'Miami',
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
    date: '2025-11-15T11:00:00',
    maxParticipants: 200,
    currentParticipants: 112,
  },
];
let nextId = 4;
// --------------------------

// --- API Endpoints ---

// 1. GET /api/events - List all events (with optional location filter)
app.get('/api/events', (req, res) => {
  const { location } = req.query;

  if (location) {
    const filteredEvents = events.filter(
      (e) => e.location.toLowerCase() === location.toLowerCase()
    );
    res.json(filteredEvents);
  } else {
    res.json(events);
  }
});

// 2. GET /api/events/:id - Get single event details
app.get('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const event = events.find((e) => e.id === parseInt(id));

  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

// 3. POST /api/events - Create a new event
app.post('/api/events', (req, res) => {
  const { title, description, location, date, maxParticipants } = req.body;

  // Basic validation
  if (!title || !location || !date || !maxParticipants) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newEvent = {
    id: nextId++,
    title,
    description: description || '',
    location,
    date,
    maxParticipants: parseInt(maxParticipants),
    currentParticipants: 0, // New events start with 0 participants
  };

  events.push(newEvent);
  res.status(201).json(newEvent); // 201 Created
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});