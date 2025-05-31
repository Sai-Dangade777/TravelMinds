TravelMinds - AI-Based Trip Planner
TravelMinds is a modern web application that generates personalized travel itineraries using AI. Users can specify their destination, trip duration, budget, and group size to receive customized travel plans including hotel recommendations, places to visit, and day-by-day itineraries.

🚀 Tech Stack
Frontend
React - UI library for building the user interface
Vite - Build tool and development server
React Router - For client-side routing
Tailwind CSS - Utility-first CSS framework for styling
shadcn/ui - UI component library

State Management & Authentication
React Context - For managing application state
Google OAuth - For user authentication via Google

Backend Services
Firebase Firestore - NoSQL database for storing trip data
Firebase Authentication - For user authentication

Maps & Location Services
OpenStreetMap/Nominatim API - For location search and geocoding

External APIs
OpenRouter API - Gateway to AI models (Claude 3 Haiku)
Pexels API - For fetching location and hotel images

🤖 AI Integration
YatraZen uses the Claude 3 Haiku model through OpenRouter for generating personalized travel plans. The model processes user inputs to create:

=>Custom itineraries based on user preferences
=>Recommended hotel options
=>Day-by-day schedules with places to visit
=>Time estimates and travel information

🗺️ Key Features
=>AI-Generated Itineraries - Personalized travel plans created based on your preferences
=>Interactive Maps - View hotels and attractions on interactive maps
=>User Authentication - Google Sign-In for saving and accessing trips
=>Responsive Design - Works seamlessly on all devices
=>Trip Storage - Save and revisit your generated trips
=>Image Integration - Automatically fetches relevant images for locations and hotels

🛠️ Project Setup
1. Clone the repository
git clone https://github.com/Sai-Dangade777/yatrazen.git
cd yatrazen

2. Install dependencies
npm install

3. Create environment variables Create a .env.local file with the following variables:

VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_GOOGLE_AUTH_CLIENT_ID=your_google_auth_client_id
VITE_PEXELS_API_KEY=your_pexels_api_key

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

4. Start the development server
npm run dev

5. Build for production
npm run build

📱 Application Flow
1. Home Page - Introduction to YatraZen with a call-to-action to create a trip
2. Create Trip - Form to input trip preferences (location, duration, budget, travelers)
3. AI Processing - Generation of a personalized trip itinerary
4. View Trip - Display of the generated trip with maps, hotels, and daily itineraries
5. My Trips - Collection of saved trips for authenticated users

🌐 Deployment
The application is deployed on Netlify with client-side routing properly handled. 

1. A `_redirects` file in the public directory with the content:

2. Alternatively, a `netlify.toml` configuration file at the root with:
``toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

Workspace
(rerun without)
Collecting workspace information

Based on your workspace, I can see that you've developed YatraZen, an AI-powered travel planning application. Let me help you update your README to reflect that you're deploying on Netlify instead of Vercel.

Here's how you should update the deployment section in your README:

/* index.html 200

This ensures that all routes are handled by the React application and prevents 404 errors when accessing routes directly.

You should create one of these files in your project to handle client-side routing properly on Netlify. The `_redirects` file is simpler but the `netlify.toml` approach gives you more configuration options if needed later.


🔐 Security Notes
API keys are stored in environment variables and are not exposed to the client
User authentication is handled securely through Google OAuth
Sensitive information is stored securely in Firebase

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgements
OpenRouter for AI model access
Pexels for image API
shadcn/ui for component library
All open-source libraries and tools used in this project

____________________________________________________________________
✨ Enjoy planning your next adventure with TravelMinds! ✨

