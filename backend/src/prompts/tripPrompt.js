const createTripPrompt = (tripInput) => {
  const {
    destination,
    startDate,
    interests,
    numberOfDays,
    budgetType,
    travelStyle,
    travelersCount,
  } = tripInput;

  return `
    You are an expert AI travel planner.
    
    Create a complete travel plan for the following user request:
    
    Destination: ${destination}
    Start Date: ${new Date(startDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
    Number of Days: ${numberOfDays}
    Budget Type: ${budgetType}
    Travel Style: ${travelStyle}
    Number of Travelers: ${travelersCount}
    Interests: ${interests.join(", ")}
    
    Travel Style meanings:
    - Relaxed: Fewer activities, more rest time and comfortable timing
    - Balanced: 2-3 main activities per day with breaks
    - Packed: early starts, more activities, maximum coverage
    
    Return ONLY valid JSON. No markdown. No explanation.
    
    JSON structure:
    {
        "itinerary": [
            {
                "dayNumber": 1,
                "title": "Short day title",
                "activities": [
                    {
                        "time": "09:00 AM",
                        "title": "Activity name",
                        "description": "Short useful description",
                        "location": "Area or landmark",
                        "category": "Food",
                        "estimatedCost": 20
                    }
                ]
            }
        ],
        "estimatedBudget": {
            "flights": 0,
            "accommodation": 0,
            "food": 0,
            "transport": 0,
            "activities": 0,
            "total": 0,
            "currency": "USD"
        },
        "hotels": [
            {
                "name": "Hotel name",
                "category": "Budget",
                "pricePerNight": 80,
                "rating": "4.3/5",
                "reason": "Why this hotel fits the trip"
            }
        ],
        "safetyTips": [
            {
                "title": "Tip title",
                "description": "Useful local safety or cultural tip"
            }
        ]
    }
        
    Rules:
    - Generate exactly ${numberOfDays} itinerary days.
    - Each day must have activities according to travel style.
    - Relaxed: 2 activities per day.
    - Balanced: 3 activities per day.
    - Packed: 4 activities per day.
    - Budget must be realistic for ${travelersCount} traveler(s).
    - Hotel category must be one of: Budget, Mid Range, Luxury.
    - Generate 3 to 5 hotels.
    - Generate 5 to 7 safety tips.
    - Use numbers only for cost fields.`;
};

const createRegenerateDayPrompt = ({ trip, dayNumber, instruction }) => {
  return `
    You are an expert AI travel planner.

    Regenerate ONLY Day ${dayNumber} for this trip.
    
    Trip Context:
    Destination: ${trip.destination}
    Budget Type: ${trip.budgetType}
    Interests: ${trip.interests.join(", ")}
    Start Date: ${trip.startDate}
    Travelers Count: ${trip.travelersCount}
    Travel Style: ${trip.travelStyle}
    
    User Instruction:
    ${instruction}
    
    Return ONLY valid JSON. No markdown. No explanation.
    
    JSON Structure:
    {
        "dayNumber": ${dayNumber},
        "title": "Short day title",
        "activities": [
            {
                "time": "09:00 AM",
                "title": "Activity name",
                "description": "Short useful description",
                "location": "Area or landmark",
                "category": "Food",
                "estimatedCost": 20
            }
        ]
    }
        
    Rules:
    - Keep the same destination, budget type, interests, travelers count, and travel style.
    - Follow the user instruction strongly.
    - Use numbers only for estimatedCost.`;
};

module.exports = { createTripPrompt, createRegenerateDayPrompt };
