import React, { useState } from 'react';

interface TripFormProps {
  onSubmit: (startLocation: string, destination: string, duration: number, generateImages: boolean) => void;
  isLoading: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading }) => {
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(3);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [generateImages, setGenerateImages] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(startLocation, destination, duration, generateImages);
  };

  return (
    <div className="bg-green-50 border border-green-100 rounded-lg shadow-md overflow-hidden">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="px-6 py-5">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="startLocation" className="block text-sm font-extrabold text-gray-800 mb-1 uppercase tracking-wide">
              Start
            </label>
            <input
              type="text"
              id="startLocation"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              placeholder="New York, NY"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          
          <div className="flex-1">
            <label htmlFor="destination" className="block text-sm font-extrabold text-gray-800 mb-1 uppercase tracking-wide">
              Destination
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Miami, FL"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          
          <div className="w-24">
            <label htmlFor="duration" className="block text-sm font-extrabold text-gray-800 mb-1 uppercase tracking-wide">
              Days
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 whitespace-nowrap"
            >
              {isLoading ? 'Planning...' : 'Plan Trip'}
            </button>
          </div>
        </div>
        
        {/* Advanced options toggle */}
        <div className="mt-3">
          <button 
            type="button" 
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="text-sm text-green-700 hover:text-green-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Advanced Options
          </button>
          
          {/* Advanced options panel */}
          {isAdvancedOpen && (
            <div className="mt-3 p-4 bg-green-100 bg-opacity-50 rounded-md animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <div className="mr-3">
                        <input 
                          type="checkbox" 
                          checked={generateImages} 
                          onChange={() => setGenerateImages(!generateImages)}
                          className="sr-only"
                        />
                        <div className={`relative w-10 h-5 rounded-full transition-all duration-200 ease-in-out ${generateImages ? 'bg-green-600' : 'bg-gray-400'}`}>
                          <div className={`absolute left-0 top-0 w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${generateImages ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                      <span className="text-gray-700 font-medium">Generate Custom Images</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-13">
                    Creates AI-generated images for each day of your trip. <span className="text-amber-600">Planning will take longer.</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default TripForm; 