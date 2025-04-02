import React from 'react';
import { DayPlanWithTravelTimes } from '../services/openAiService';

export interface DayPlan {
  day: number;
  from: string;
  to: string;
  overnight: string;
  attractions: string[];
  travelTime?: string;
}

interface ItineraryProps {
  itinerary: DayPlanWithTravelTimes[] | null;
  startLocation: string;
  destination: string;
}

const Itinerary: React.FC<ItineraryProps> = ({ itinerary, startLocation, destination }) => {
  // Safety check - if itinerary is null, undefined, or not an array, return null
  if (!itinerary || !Array.isArray(itinerary) || itinerary.length === 0) {
    return null;
  }

  // Check if any day has an image - if none do, we assume image generation was disabled
  const hasImages = itinerary.some(day => day.image);

  const getBookingUrl = (location: string) => {
    // Encode the location for a URL
    const encodedLocation = encodeURIComponent(location);
    return `https://www.booking.com/searchresults.html?ss=${encodedLocation}`;
  };

  // Function to get a fallback stock image URL based on location
  const getFallbackImageUrl = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://source.unsplash.com/300x200/?${encodedLocation},landmark`;
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-xl card-on-bg">
      <h2 className="text-2xl font-bold mb-2 text-center">Your Road Trip Itinerary</h2>
      <p className="text-gray-600 mb-8 text-center">
        From <span className="font-semibold">{startLocation}</span> to{' '}
        <span className="font-semibold">{destination}</span>
      </p>

      <div className="relative pb-12">
        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 h-full border-l-2 border-blue-400"></div>

        {itinerary.map((day, index) => (
          <div key={day.day || index} className="relative mb-16">
            {/* Day circle */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center z-10">
              <span className="text-white font-bold">{day.day || index + 1}</span>
            </div>
            
            {/* Journey content */}
            <div className="bg-blue-50 rounded-lg shadow-md p-5 mx-4 mt-4">
              <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3 text-center">
                Day {day.day || index + 1}: {day.from} → {day.to}
              </h3>
              
              {/* Main travel time for the day */}
              {day.travelTime && (
                <div className="mb-4 text-center">
                  <span className="inline-flex items-center bg-blue-100 px-3 py-1 rounded-full text-blue-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Total Drive Time: <span className="font-semibold ml-1">{day.travelTime}</span>
                  </span>
                </div>
              )}

              {/* Content container - with or without image based on hasImages flag */}
              <div className={`flex flex-col ${hasImages ? 'md:flex-row gap-6' : ''}`}>
                {/* Left side content - full width if no images */}
                <div className={hasImages ? 'flex-1' : 'w-full'}>
                  {/* Attractions Section */}
                  {Array.isArray(day.attractions) && day.attractions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-md font-semibold text-gray-700 mb-2">Attractions along the way:</h4>
                      <div className="space-y-4">
                        {day.attractions.map((attraction, attrIndex) => (
                          <div key={attrIndex} className="border-l-2 border-blue-200 pl-4 py-2">
                            <div className="flex items-start">
                              <div className="bg-blue-100 rounded-full p-1 mr-2 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-gray-700">{attraction}</span>
                            </div>
                            
                            {/* Travel time to next location */}
                            {day.attractionTravelTimes && day.attractionTravelTimes[attrIndex] && (
                              <div className="ml-7 mt-2 flex items-center text-gray-600 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="italic">
                                  {attrIndex < day.attractions.length - 1 
                                    ? `${day.attractionTravelTimes[attrIndex]} to next attraction` 
                                    : `${day.attractionTravelTimes[attrIndex]} to overnight stay`}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Overnight Stay Card - Highlighted in a modal-like design */}
                  <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">Overnight Stay</h4>
                          <p className="text-blue-600 font-medium text-lg">{day.overnight}</p>
                        </div>
                      </div>
                      
                      {/* Book Hotel Button - On the right side */}
                      <a 
                        href={getBookingUrl(day.overnight)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition duration-150 ease-in-out"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Book Hotel
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right side image - only shown if images are enabled */}
                {hasImages && (
                  <div className="md:w-1/3 flex flex-col">
                    <div className="rounded-lg overflow-hidden shadow-md h-48 md:h-full bg-gray-50">
                      {/* Use OpenAI generated image with fallback to Unsplash */}
                      {day.image ? (
                        <img 
                          src={day.image} 
                          alt={`Road trip day ${day.day || index + 1}: ${day.from} to ${day.to}`}
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <>
                          <img 
                            src={getFallbackImageUrl(day.overnight)} 
                            alt={`${day.overnight} - Day ${day.day || index + 1}`}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                            loading="lazy"
                          />
                          <div className="absolute bottom-0 right-0 bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded-tl-md">
                            Unsplash Image
                          </div>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center italic">
                      {day.from} to {day.to} via {day.attractions.length} attractions
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Final destination marker */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Itinerary; 