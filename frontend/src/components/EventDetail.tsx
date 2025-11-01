// src/components/EventDetail.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Event, UserLocation } from '../types';
import { getUserLocation, calculateDistance, formatDistance } from '../utils/distance';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function EventDetail() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const { id } = useParams<{ id: string }>();

  // Get user location
  useEffect(() => {
    const fetchUserLocation = async () => {
      const location = await getUserLocation();
      setUserLocation(location);
    };
    fetchUserLocation();
  }, []);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/events/${id}`);
        if (!response.ok) {
          throw new Error('Event not found');
        }
        const data: Event = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleRegister = async () => {
    if (!event || !id) return;

    setRegistering(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/events/${id}/register`, {
        method: 'PUT',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register');
      }

      const updatedEvent: Event = await response.json();
      setEvent(updatedEvent);
      alert('Successfully registered for the event!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!event) return <p>Event not found.</p>;

  const isFull = event.currentParticipants >= event.maxParticipants;
  const distance =
    userLocation && event.latitude !== undefined && event.longitude !== undefined
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          event.latitude,
          event.longitude
        )
      : undefined;

  return (
    <div className="event-detail">
      <h2>{event.title}</h2>
      <p>
        <strong>Description:</strong> {event.description || 'N/A'}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
        {distance !== undefined && (
          <span style={{ marginLeft: '8px', color: '#007bff' }}>
            ({formatDistance(distance)} away)
          </span>
        )}
      </p>
      <p>
        <strong>Date & Time:</strong> {new Date(event.date).toLocaleString()}
      </p>
      <p>
        <strong>Participants:</strong> {event.currentParticipants} / {event.maxParticipants}
        {isFull && <span style={{ color: '#d9534f', marginLeft: '8px' }}>(FULL)</span>}
      </p>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={handleRegister}
          className="btn"
          disabled={registering || isFull}
        >
          {registering ? 'Registering...' : isFull ? 'Event Full' : 'Register for Event'}
        </button>
        <Link to="/" className="btn btn-secondary">
          &larr; Back to all events
        </Link>
      </div>
    </div>
  );
}

export default EventDetail;