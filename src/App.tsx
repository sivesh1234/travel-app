import React, { useState } from 'react';
import './App.css';
import TripForm from './components/TripForm';
import Itinerary from './components/Itinerary';
import LoadingSpinner from './components/LoadingSpinner';
import { generateTripItinerary, DayPlanWithTravelTimes } from './services/openAiService';
import backgroundImage from './images/road-trip-bg.jpg';

function App() {
  const [itinerary, setItinerary] = useState<DayPlanWithTravelTimes[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tripDetails, setTripDetails] = useState({
    startLocation: '',
    destination: ''
  });

  const handleSubmit = async (startLocation: string, destination: string, duration: number, generateImages: boolean) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verify that API key is set
      if (!process.env.REACT_APP_OPENAI_API_KEY) {
        throw new Error('OpenAI API key is missing. Please add it to your .env file.');
      }
      
      const generatedItinerary = await generateTripItinerary(startLocation, destination, duration, generateImages);
      
      // Verify that we got a valid array back
      if (!Array.isArray(generatedItinerary)) {
        throw new Error('Invalid itinerary format received from API');
      }
      
      setItinerary(generatedItinerary);
      setTripDetails({ startLocation, destination });
    } catch (err: any) {
      console.error('Error generating itinerary:', err);
      // Check if this is an OpenAI API rate limit or image generation error
      if (err.message?.includes('rate limit') || err.message?.includes('dall-e')) {
        // If it's a rate limit issue, still display the itinerary but with a warning
        if (itinerary) {
          setError('Some images could not be generated due to API limits. Using fallback images instead.');
        } else {
          setError(err.message || 'Failed to generate itinerary. Please try again later.');
          setItinerary(null);
        }
      } else {
        setError(err.message || 'Failed to generate itinerary. Please try again later.');
        setItinerary(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen app-background" 
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative'
      }}
    >
      <div className="app-content py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8 text-shadow">
            Road Trip Planner
          </h1>
          
          <div className="rounded-lg overflow-hidden shadow-lg">
            <TripForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          
          {isLoading && (
            <div className="mt-6 card-on-bg p-4 rounded-lg">
              <LoadingSpinner />
            </div>
          )}
          
          {error && (
            <div className="mt-6 bg-red-50 p-4 rounded-md border border-red-200 shadow-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {itinerary && (
            <div className="mt-6">
              <Itinerary 
                itinerary={itinerary}
                startLocation={tripDetails.startLocation}
                destination={tripDetails.destination}
              />
            </div>
          )}
          
          <div className="mt-10 text-center text-sm text-gray-800 font-medium">
            <p>Powered by OpenAI</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
