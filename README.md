# Project Name

A full-stack application that demonstrates location-based services with geocoding capabilities, built with modern web technologies and deployed across multiple platforms.

## Project Overview

This project is a comprehensive web application that leverages geocoding services to calculate distances between locations, manage user data, and provide a seamless user experience. The application features a React-based frontend hosted on Vercel and a Node.js/Express backend deployed on Render.

## File Structure

```
project-root/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── utils/
│   │   │   ├── geocoding.ts
│   │   │   └── distance.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
└── .gitignore
```

## Key Features

### 🌍 Geocoding Integration

The project includes a robust geocoding system that:
- Converts addresses to geographic coordinates (latitude/longitude)
- Uses third-party geocoding APIs (Google Maps, OpenCage, or similar)
- Handles address validation and normalization
- Provides accurate location data for distance calculations

### 📏 Distance Calculation

Built on top of the geocoding service, the distance calculation module:
- Computes distances between two geographic points
- Supports multiple distance formulas (Haversine, Vincenty)
- Returns distances in various units (kilometers, miles)
- Optimizes calculations for performance

### 🚀 Deployment

- **Frontend (Vercel)**: [https://event-discovery-app-chi.vercel.app/](https://your-app.vercel.app)
- **Backend (Render)**: [https://event-discovery-app.onrender.com](https://your-api.onrender.com)

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```bash
VITE_API_URL=http://localhost:5000
# or your production backend URL
VITE_API_URL=https://your-api.onrender.com
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
PORT=5000
GEOCODING_API_KEY=your_geocoding_api_key_here
DATABASE_URL=your_database_connection_string
NODE_ENV=development
```

## Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```
The server will start on `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm run dev
```
The application will open on `http://localhost:5173`

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
npm run build
npm start
```

## Geocoding and Distance Calculation Architecture

### Why `geocoding.ts` was Created

The `distance.ts` file requires geographic coordinates (latitude and longitude) to calculate distances between two points. However, users typically provide addresses in human-readable format (e.g., "123 Main St, New York, NY"). This created a dependency problem that was solved by implementing `geocoding.ts`.

#### The Problem
```typescript
// distance.ts needs coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  // Calculate distance using Haversine formula
}

// But users provide addresses
const userInput = "123 Main St, New York, NY";
```

#### The Solution: `geocoding.ts`

We created a dedicated geocoding module that:

1. **Accepts Address Input**: Takes human-readable addresses as strings
2. **API Integration**: Connects to geocoding services (Google Maps, OpenCage, etc.)
3. **Returns Coordinates**: Converts addresses to precise lat/lng coordinates
4. **Error Handling**: Manages invalid addresses and API failures
5. **Caching**: Optionally caches results to reduce API calls

```typescript
// geocoding.ts
export async function geocodeAddress(address: string): Promise<{
  lat: number;
  lng: number;
  formattedAddress: string;
}> {
  // API call to geocoding service
  // Returns coordinates for distance.ts to use
}
```

#### Workflow

```
User Address → geocoding.ts → Coordinates → distance.ts → Distance Result
```

1. User provides two addresses
2. `geocoding.ts` converts both addresses to coordinates
3. `distance.ts` uses these coordinates to calculate distance
4. Result is returned to the user

This separation of concerns makes the code:
- More modular and testable
- Easier to maintain
- Flexible (can swap geocoding providers)
- Reusable across different parts of the application

## Environment Variables

### Frontend (`frontend/.env`)
```
VITE_API_URL=https://event-discovery-app.onrender.com
```

### Backend (`backend/.env`)
```
PORT=5000
GEOCODING_API_KEY=<your-api-key>
DATABASE_URL=<database-connection>
NODE_ENV=development|production
ALLOWED_ORIGINS=http://localhost:5173,https://event-discovery-app-chi.vercel.app/
```




