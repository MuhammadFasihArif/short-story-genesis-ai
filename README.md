
# AI Shorts Generator

A futuristic, full-stack AI-powered app for generating short videos from text prompts or custom stories.

## 📋 Features

- Generate short videos from text prompts or custom stories
- Select from multiple visual styles (Realistic, Anime, Cartoon, etc.)
- Choose from different TTS voice models
- Select caption fonts
- Download generated videos and caption JSON files
- Placeholder UI for social media sharing

## 🚀 Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- React Query for data fetching
- React Router for navigation

### Backend (Python)
- FastAPI for the API server
- Integration with external AI services:
  - Groq LLM for story generation
  - Stability AI for image generation
  - TTS models for voice synthesis
- Optional MongoDB integration for metadata storage

## ⚙️ Setup Instructions

### Frontend Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```
   VITE_API_URL=http://localhost:8000
   ```
4. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup

1. Install Python dependencies:
   ```
   pip install fastapi uvicorn python-multipart nltk pillow torch TTS groq stability-sdk pydub moviepy
   ```

2. Create a `.env` file in the backend directory with your API keys:
   ```
   STABILITY_API_KEY=your-stability-api-key
   GROQ_API_KEY=your-groq-api-key
   MONGODB_URI=mongodb://username:password@localhost:27017/ai_shorts (optional)
   ```

3. Start the FastAPI server:
   ```
   uvicorn main:app --reload
   ```

## 🔗 Backend Integration

The provided Python script (`video_generator.py`) needs to be integrated with the FastAPI backend:

1. Move your existing Python script to the backend directory
2. Import the necessary functions in the FastAPI app
3. Follow the integration pattern in the `backend_reference.py` file

### Key Integration Points:

- The `/api/generate-video` endpoint accepts POST requests with the video configuration
- The backend processes the request, generates the video, and returns URLs to the video and captions files
- For production, consider implementing background tasks or job queues for video processing
- Optional MongoDB integration for storing video metadata

## 📁 Project Structure

```
/
├── src/
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utilities and API client
│   ├── pages/              # Page components
│   └── App.tsx             # Main app component with routes
├── backend/                # Python FastAPI backend (not included)
│   ├── main.py             # FastAPI application
│   └── video_generator.py  # Your video generation script
└── .env.example            # Example environment variables
```

## 📝 Environment Variables

### Frontend (.env)
- `VITE_API_URL`: URL of the backend API server

### Backend (.env)
- `STABILITY_API_KEY`: Your Stability AI API key
- `GROQ_API_KEY`: Your Groq API key
- `MONGODB_URI`: Optional MongoDB connection string

## 📜 License

[MIT License](LICENSE)
