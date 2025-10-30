import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/events';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = locationFilter
          ? `${API_URL}?location=${locationFilter}`
          : API_URL;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [locationFilter]);

  return (
    <div className="event-list-page">
      <h2>Upcoming Events</h2>
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Filter by location (e.g., Miami)"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
      </div>

      {loading && <p>Loading events...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!loading && !error && (
        <div className="event-list">
          {events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
                <p>
                  <strong>Spots:</strong> {event.currentParticipants} / {event.maxParticipants}
                </p>
                <Link to={`/events/${event.id}`} className="btn">
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default EventList;