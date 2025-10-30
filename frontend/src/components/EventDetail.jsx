import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function EventDetail() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        if (!response.ok) {
          throw new Error('Event not found');
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div className="event-detail">
      <h2>{event.title}</h2>
      <p><strong>Description:</strong> {event.description || 'N/A'}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Date & Time:</strong> {new Date(event.date).toLocaleString()}</p>
      <p>
        <strong>Participants:</strong> {event.currentParticipants} / {event.maxParticipants}
      </p>
      <Link to="/" className="btn btn-secondary">
        &larr; Back to all events
      </Link>
    </div>
  );
}

export default EventDetail;