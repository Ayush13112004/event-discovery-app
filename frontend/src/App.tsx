// src/App.tsx

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';
import EventForm from './components/EventForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <Link to="/">Event Discovery</Link>
        <Link to="/create">Create Event</Link>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/create" element={<EventForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;