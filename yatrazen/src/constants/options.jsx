export const SelectTravelsList = [
    {
        id:1,
        title:'Just Me',
        desc:'A sole traveles in exploration',
        icon:'✈️',
        people:'1 People' 
    },
    {
        id:2,
        title:'A Couple',
        desc:'Two traveles in tandem',
        icon:'🥂',
        people:'2 People'
    },
    {
        id:3,
        title:'Family',
        desc:'A group of fun loving adv',
        icon:'🏡',
        people:'3 to 5 People'
    },
    {
        id:4,
        title:'Friends',
        desc:'A bunch of thrill-seekes',
        icon:'⛵',
        people:'5 People'
    },
]

export const SelectBudgetOptions=[
    {
        id:1,
        title:'Cheap',
        desc:'Stay conscious of costs',
        icon:'💵',
    },
    {
        id:2,
        title:'Moderate',
        desc:'Keep cost on the average side',
        icon:'💰',
    },
    {
        id:3,
        title:'Luxury',
        desc:'Dont worry about cost',
        icon:'💸',
    },
]

export const AI_PROMPT = `
Generate a Travel Plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget} budget.

Provide the response in JSON format with the following structure: 
{
  "hotelOptions": [ -- minimum 4 hotels neccesary
    {
      "hotelName": "string",
      "hotelAddress": "string",
      "price": "number",
      "hotelImageUrl": "string",
      "geoCoordinates": { "latitude": "number", "longitude": "number" },
      "rating": "number",
      "description": "string"
    }
  ],
  "itinerary": [
    {
      "day": "number",
      "places": [
        {
          "placeName": "string",
          "placeDetails": "string",
          "placeImageUrl": "string",
          "geoCoordinates": { "latitude": "number", "longitude": "number" },
          "ticketPricing": "string",
          "rating": "number",
          "travelTime": "string",
          "bestTimeSlotToVisit": "string",
          "timeToTravel": "string"
        }
      ]
    }
  ]
}
Ensure "itinerary" is always an array containing "day" keys, with each day's "places" as an array.
`
