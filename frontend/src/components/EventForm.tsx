// src/components/EventForm.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateEventData } from '../types';
import { geocodeLocation } from '../utils/geocoding';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function EventForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    location: '',
    latitude: undefined,
    longitude: undefined,
    date: '',
    maxParticipants: 50,
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [gettingLocation, setGettingLocation] = useState<boolean>(false);
  const [geocoding, setGeocoding] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxParticipants' ? parseInt(value) || 0 : value,
    }));
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setGettingLocation(false);
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
        setGettingLocation(false);
      }
    );
  };

  const handleGeocodeLocation = async () => {
    if (!formData.location || formData.location.trim() === '') {
      setError('Please enter a location first');
      return;
    }

    setGeocoding(true);
    setError(null);

    try {
      const result = await geocodeLocation(formData.location);
      
      if (result) {
        setFormData((prev) => ({
          ...prev,
          latitude: result.latitude,
          longitude: result.longitude,
        }));
        // Optionally update location with more precise name
        // setFormData(prev => ({ ...prev, location: result.displayName }));
      } else {
        setError('Could not find coordinates for this location. Please try a more specific address.');
      }
    } catch (err) {
      setError('Failed to geocode location. Please try again.');
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Auto-geocode if location is provided but no coordinates
    let finalFormData = { ...formData };
    
    if (formData.location && !formData.latitude && !formData.longitude) {
      const result = await geocodeLocation(formData.location);
      if (result) {
        finalFormData = {
          ...formData,
          latitude: result.latitude,
          longitude: result.longitude,
        };
      }
    }

    try {
      const response = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to create event');
      }

      // Redirect to homepage on success
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="event-form-page">
      <h2>Create a New Event</h2>

      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Miami, FL or 123 Main St, New York"
            required
          />
          <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
            💡 Enter any address, city, or landmark - coordinates will be found automatically!
          </small>
        </div>

        <div className="form-group">
          <label>Event Coordinates (Auto-detected or Manual)</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button
              type="button"
              onClick={handleGeocodeLocation}
              disabled={geocoding || !formData.location}
              className="btn"
              style={{ flex: 1 }}
            >
              {geocoding ? '🔍 Finding...' : '🗺️ Get Coordinates from Location'}
            </button>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              {gettingLocation ? '📍 Getting...' : '📍 Use My Current Location'}
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              name="latitude"
              value={formData.latitude || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  latitude: e.target.value ? parseFloat(e.target.value) : undefined,
                }))
              }
              style={{ flex: 1 }}
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              name="longitude"
              value={formData.longitude || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  longitude: e.target.value ? parseFloat(e.target.value) : undefined,
                }))
              }
              style={{ flex: 1 }}
            />
          </div>
          
          {formData.latitude && formData.longitude && (
            <small style={{ color: '#28a745', display: 'block', marginTop: '5px' }}>
              ✓ Coordinates set: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date and Time *</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxParticipants">Max Participants *</label>
          <input
            type="number"
            id="maxParticipants"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        {error && <p className="error">Error: {error}</p>}

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Event'}
        </button>
        
        <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
          💡 <strong>Tip:</strong> Coordinates will be automatically detected from your location name when you submit. 
          You can also click "Get Coordinates from Location" to preview them first.
        </p>
      </form>
    </div>
  );
}

export default EventForm;