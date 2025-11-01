// src/types.ts

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  date: string;
  maxParticipants: number;
  currentParticipants: number;
  distance?: number; // Calculated on frontend
}

export interface CreateEventData {
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  date: string;
  maxParticipants: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface FormState {
  success: boolean;
  message: string | null;
  eventId: number | null;
}