# Road Trip Planner

A React application that uses OpenAI to generate personalized road trip itineraries.

## Features

- Input start location and destination 
- Specify trip duration
- AI-generated itinerary with overnight stops and attractions
- Clean, responsive UI built with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

### Running the App

Start the development server:
```
cd .../travel-app
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## How It Works

1. Enter your start location, destination, and trip duration
2. The app calls the OpenAI API to generate a detailed itinerary
3. View your day-by-day road trip plan with overnight locations and attractions
4. Toggle image generation in advanced settings. Turned off will speed up itinerary generation

## Customization

You can modify the OpenAI prompt in `src/services/openAiService.ts` to adjust the type of recommendations you receive.

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- OpenAI API
