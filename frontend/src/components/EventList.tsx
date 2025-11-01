// src/components/EventList.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Event, UserLocation } from '../types';
import {
  getUserLocation,
  addDistanceToEvents,
  sortEventsByDistance,
  formatDistance,
} from '../utils/distance';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [sortByDistance, setSortByDistance] = useState<boolean>(false);

  // Get user location on mount
  useEffect(() => {
    const fetchUserLocation = async () => {
      const location = await getUserLocation();
      if (location) {
        setUserLocation(location);
        setSortByDistance(true); // Auto-enable sorting when location is available
      }
    };
    fetchUserLocation();
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (locationFilter) params.append('location', locationFilter);
        if (searchQuery) params.append('search', searchQuery);

        const url = `${API_URL}/api/events${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data: Event[] = await response.json();
        
        // Add distance to events
        let processedEvents = addDistanceToEvents(data, userLocation);
        
        // Sort by distance if enabled
        if (sortByDistance && userLocation) {
          processedEvents = sortEventsByDistance(processedEvents);
        }
        
        setEvents(processedEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [locationFilter, searchQuery, userLocation, sortByDistance]);

  return (
    <div className="event-list-page">
      <h2>Upcoming Events</h2>
      
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search events by title, description, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <input
          type="text"
          placeholder="Filter by location (e.g., Miami)"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
        
        {userLocation && (
          <div style={{ marginTop: '10px' }}>
            <label>
              <input
                type="checkbox"
                checked={sortByDistance}
                onChange={(e) => setSortByDistance(e.target.checked)}
              />
              {' '}Sort by distance from my location
            </label>
          </div>
        )}
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
                <p>
                  <strong>Location:</strong> {event.location}
                  {event.distance !== undefined && (
                    <span style={{ marginLeft: '8px', color: '#007bff', fontSize: '0.9rem' }}>
                      ({formatDistance(event.distance)})
                    </span>
                  )}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(event.date).toLocaleString()}
                </p>
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