# Weathermar

A React Native weather app built with Expo and TypeScript as a learning project.

## Purpose

This project is being built to learn and practice:

- React Native
- Expo
- TypeScript
- component-based UI design
- React state and effects
- loading and error states
- mapping API data into app-specific data shapes
- real API integration with Open-Meteo

The long-term goal is to evolve this into a more hurricane-focused weather app, with possible NOAA/NWS integration later.

## Current Features

- Current weather section
- 7-day forecast
- Loading state
- Error state
- Real weather data fetched from Open-Meteo
- Scrollable mobile layout
- Reusable UI components for current conditions and forecast rows

## Tech Stack

- React Native
- Expo
- TypeScript
- Open-Meteo Forecast API

## Project Structure

- `HomeScreen` manages:
  - current weather state
  - forecast state
  - loading state
  - error state
- `CurrentWeatherSection` renders the current conditions card
- `ForecastRow` renders each daily forecast card

## Learning Notes

This project started with fully hardcoded mock data, then gradually added:

1. reusable components
2. mapped forecast rows from arrays
3. scrollable layout with `ScrollView`
4. React state with `useState`
5. side effects with `useEffect`
6. loading and error handling
7. real API fetches from Open-Meteo
8. transformation of raw API data into clean UI-ready objects

The app currently uses a hardcoded Wilmington, NC location while the weather-fetching flow is being built out.

## Future Improvements

- Search by city using geocoding
- Device location support
- Better date/time formatting
- Weather condition icons
- Unit toggles
- NOAA / NWS alert integration
- Hurricane-focused features and data sources
- Better styling and responsive layout cleanup
- Testing

## Running the App

1. Install dependencies
2. Start the Expo development server
3. Open on Android with Expo Go

```bash
npm install
npx expo start
