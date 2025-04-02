import OpenAI from 'openai';
import { DayPlan } from '../components/Itinerary';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // This is needed for client-side usage
});

export interface DayPlanWithTravelTimes extends DayPlan {
  travelTime?: string;
  attractionTravelTimes?: string[];
  image?: string; // URL to the generated image
}

export async function generateTripItinerary(
  startLocation: string,
  destination: string,
  duration: number,
  generateImages: boolean = true
): Promise<DayPlanWithTravelTimes[]> {
  try {
    const prompt = `Create a road trip itinerary from ${startLocation} to ${destination} over ${duration} days.
    For each day include:
    1. The starting point
    2. The destination for that day
    3. Where to stay overnight
    4. 3-5 interesting attractions or landmarks to visit along the way
    5. Estimated driving time between the starting point and destination for each day
    
    Format your response as JSON with the following structure:
    {
      "itinerary": [
        {
          "day": 1,
          "from": "Starting City",
          "to": "Destination City",
          "overnight": "Overnight Stay Location",
          "travelTime": "X hours Y minutes", 
          "attractions": ["Attraction 1", "Attraction 2", "Attraction 3"]
        },
        ...
      ]
    }
    
    Only respond with the JSON, no additional text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        { role: 'system', content: 'You are a helpful travel planning assistant. Provide realistic travel times based on typical driving speeds and routes.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the response to extract the itinerary
    const parsedResponse = JSON.parse(content);
    
    let itinerary: DayPlanWithTravelTimes[];
    
    // Ensure we're returning an array
    if (parsedResponse.itinerary && Array.isArray(parsedResponse.itinerary)) {
      itinerary = parsedResponse.itinerary;
    } else if (Array.isArray(parsedResponse)) {
      itinerary = parsedResponse;
    } else {
      // If we get an unexpected format, create a default array with an error message
      console.error('Unexpected response format:', parsedResponse);
      return [{
        day: 1,
        from: startLocation,
        to: destination,
        overnight: destination,
        travelTime: "Unknown",
        attractions: ['Unable to generate attractions. Please try again.']
      }];
    }

    // Now enhance each day with attraction travel times and images (if enabled)
    for (let i = 0; i < itinerary.length; i++) {
      const day = itinerary[i];
      
      if (day.attractions && day.attractions.length > 0) {
        await enhanceWithAttractionTravelTimes(day);
        
        // Only generate images if the option is enabled
        if (generateImages) {
          await enhanceWithImage(day);
        }
      }
    }

    return itinerary;
  } catch (error) {
    console.error('Error generating trip itinerary:', error);
    throw error;
  }
}

async function enhanceWithAttractionTravelTimes(day: DayPlanWithTravelTimes): Promise<void> {
  try {
    // Create a list of locations including from, attractions, and to
    const locations = [day.from, ...day.attractions, day.to];
    
    const prompt = `Calculate estimated driving times between these consecutive locations for a road trip:
    ${locations.join(' → ')}
    
    Provide realistic estimates for driving between these locations.
    Return the response as a JSON object with this exact format:
    {
      "times": ["X hours Y minutes", "X hours Y minutes", ...]
    }
    
    The array should have ${locations.length - 1} elements, representing the time to drive from each location to the next.
    Be realistic with driving estimates based on typical routes and speeds.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        { role: 'system', content: 'You are a helpful travel planning assistant that provides accurate travel time estimates.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3, // Lower temperature for more consistent estimates
      response_format: { type: 'json_object' }
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI for travel times');
    }
    
    console.log('Travel times response:', content);
    
    const parsedResponse = JSON.parse(content);
    
    if (parsedResponse.times && Array.isArray(parsedResponse.times)) {
      day.attractionTravelTimes = parsedResponse.times;
    } else if (Array.isArray(parsedResponse)) {
      day.attractionTravelTimes = parsedResponse;
    } else {
      // Fallback: Generate reasonable travel time estimates based on the locations
      console.log('Falling back to generated travel times');
      day.attractionTravelTimes = locations.slice(0, -1).map((_, i) => {
        // Generate a random time between 20 and 60 minutes for attractions
        const minutes = Math.floor(Math.random() * 40) + 20;
        return `${Math.floor(minutes / 60) > 0 ? Math.floor(minutes / 60) + ' hours ' : ''}${minutes % 60} minutes`;
      });
    }
    
    console.log('Processed travel times:', day.attractionTravelTimes);
  } catch (error) {
    console.error('Error generating attraction travel times:', error);
    
    // Fallback: Generate reasonable travel time estimates
    const locations = [day.from, ...day.attractions, day.to];
    day.attractionTravelTimes = locations.slice(0, -1).map((_, i) => {
      // Generate a random time between 20 and 60 minutes for attractions
      const minutes = Math.floor(Math.random() * 40) + 20;
      return `${Math.floor(minutes / 60) > 0 ? Math.floor(minutes / 60) + ' hours ' : ''}${minutes % 60} minutes`;
    });
  }
}

async function enhanceWithImage(day: DayPlanWithTravelTimes): Promise<void> {
  try {
    // Create a prompt that includes both the overnight location and top attractions
    const attractionsText = day.attractions.slice(0, 3).join(', '); // Include up to 3 attractions
    const prompt = `A beautiful travel photo showing highlights of a road trip from ${day.from} to ${day.to}, featuring ${day.overnight} and attractions like ${attractionsText}. High quality, scenic landscape photography style.`;

    console.log('Generating image with prompt:', prompt);

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'natural'
    });

    day.image = response.data[0]?.url;
    console.log('Generated image URL:', day.image);
  } catch (error) {
    console.error('Error generating image:', error);
    // Keep day.image as undefined, the component will fall back to Unsplash
  }
} 