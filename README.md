# SkyView

A lightweight React + Vite weather app that shows current weather by city with unit switching (Celsius/Fahrenheit/Kelvin). State is managed with a simple store and data is fetched from OpenWeatherMap.

If your repo uses a different name, replace “SkyView” with your project name.

## Features
- Search by city with a sensible default fallback
- Current weather display with unit toggle (°C/°F/K)
- Loading and error states
- Mobile-first UI (utility CSS classes)
- State management via a small global store
- API-driven via OpenWeatherMap

## Tech Stack
- React (Vite)
- Zustand (global state)
- Axios (HTTP)
- Tailwind CSS (utility classes), if configured
- OpenWeatherMap API

## Getting Started

### Prerequisites
- Node.js 18+ (recommended LTS)
- A package manager: npm, yarn, or pnpm
- An OpenWeatherMap API key

### 1) Clone the repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo

Copy

Insert

2) Install dependencies
Using npm:

npm install

Copy

Insert

Or with yarn:

yarn

Copy

Insert

Or with pnpm:

pnpm install

Copy

Insert

3) Configure environment variables
Create a .env file in the project root with:

# Vite requires env vars to be prefixed with VITE_
VITE_API_KEY=your_openweathermap_api_key

Copy

Insert

How to get an API key:

Create an account at https://home.openweathermap.org/users/sign_up
Generate an API key in your account settings
Paste it as VITE_API_KEY in the .env file
Restart the dev server after editing .env
Note: Never commit your real API key. Keep .env out of version control.

4) Run the app locally
Start the dev server:

npm run dev
# or
yarn dev
# or
pnpm dev

Copy

Insert

Open the printed local URL (commonly http://localhost:5173).

Project Structure (key paths)
src/components/weatherCards/CurrentWeatherCard.jsx
src/services/WeatherService.js
src/store.js
src/... (other components, pages, styles)
Environment Details
This app reads the API key via import.meta.env.VITE_API_KEY
Weather requests call OpenWeatherMap’s current weather endpoint
Some UI strings and default behavior (e.g., default city) can be configured in the service or component
Available Scripts
dev: starts the Vite dev server
build: production build
preview: serves the production build locally
lint/format/test: if configured in your package.json and tooling
Examples:

npm run dev
npm run build
npm run preview
npm run lint
npm run test

Copy

Insert

Troubleshooting
API key issues
Error: 401 Unauthorized or “Invalid API key”
Verify VITE_API_KEY is set in .env (not .env.local unless configured)
Ensure the variable name starts with VITE_
Restart the dev server after changes
City not found (404)
Make sure the city name is valid
Check for extra spaces; the app trims input
“Network Error”
Ensure you’re online and OpenWeatherMap is reachable
Verify axios is installed
Check the console for the exact request URL
Env not loading in production
Set the VITE_API_KEY in your hosting provider’s environment settings (Netlify/Vercel)
Re-deploy after updating environment variables
Loading stuck or UI not updating
Confirm the store/state updates are not blocked by early returns
Check that you’re handling errors and resetting loading states in finally blocks
Deployment
Netlify or Vercel recommended
Set VITE_API_KEY in the project’s environment variables on the hosting platform
Build command: npm run build
Publish directory: dist
Roadmap (optional)
7‑day forecast
Geolocation-based weather
Favorites / recent searches
Accessibility improvements and tests