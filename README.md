# YatraZen - AI-Based Trip Planner

## 🚀 Project Setup

Follow these steps to set up and run the project locally.

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/ayushdama11/yatrazen.git
cd yatrazen
```

### 2️⃣ Install Dependencies
```sh
npm install  # or yarn install
```

### 3️⃣ Set Up Environment Variables
Create a `.env.local` file in the root directory and add the following variables:

```sh
VITE_GOOGLE_PLACE_API_KEY=your_google_place_api_key
VITE_GOOGLE_GEMINI_AI_API_KEY=your_google_gemini_ai_api_key
VITE_GOOGLE_AUTH_CLIENT_ID=your_google_auth_client_id

VITE_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
VITE_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
VITE_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

**Important:**
- **Do NOT commit** the `.env.local` file.
- Add `.env.local` to `.gitignore` to prevent exposing credentials.

### 4️⃣ Start the Development Server
```sh
npm run dev  # or yarn dev
```

### 5️⃣ Deployment Notes
If deploying to **Vercel, Netlify, or Firebase Hosting**, make sure to add these environment variables in the platform’s dashboard settings.

---

✅ You’re all set! Enjoy using **YatraZen - AI-Based Trip Planner** 🚀

