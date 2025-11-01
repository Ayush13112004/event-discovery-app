// src/utils/distance.ts

import { Event, UserLocation } from '../types';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get user's current location using Geolocation API
 * @returns Promise with user location or null if unavailable
 */
export async function getUserLocation(): Promise<UserLocation | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser.');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn('Error getting user location:', error.message);
        resolve(null);
      },
      {
        timeout: 5000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

/**
 * Add distance to events based on user location
 * @param events - Array of events
 * @param userLocation - User's location
 * @returns Events with distance property added
 */
export function addDistanceToEvents(
  events: Event[],
  userLocation: UserLocation | null
): Event[] {
  if (!userLocation) {
    return events;
  }

  return events.map((event) => {
    if (event.latitude !== undefined && event.longitude !== undefined) {
      return {
        ...event,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          event.latitude,
          event.longitude
        ),
      };
    }
    return event;
  });
}

/**
 * Sort events by distance (closest first)
 * @param events - Array of events
 * @returns Sorted events array
 */
export function sortEventsByDistance(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    // Events without distance go to the end
    if (a.distance === undefined && b.distance === undefined) return 0;
    if (a.distance === undefined) return 1;
    if (b.distance === undefined) return -1;
    return a.distance - b.distance;
  });
}

/**
 * Format distance for display
 * @param distance - Distance in kilometers
 * @param unit - Unit to display (km or mi)
 * @returns Formatted distance string
 */
export function formatDistance(distance: number, unit: 'km' | 'mi' = 'km'): string {
  if (unit === 'mi') {
    const miles = distance * 0.621371;
    return `${Math.round(miles * 10) / 10} mi`;
  }
  return `${distance} km`;
}