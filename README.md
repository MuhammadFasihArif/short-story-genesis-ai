
# AI Short Video Generator

This project is a web application that generates short-form videos using AI.

## Project Structure
- `frontend/`: React frontend application
- `backend/`: Python FastAPI backend

## Backend Setup

1. Navigate to the backend directory
   ```
   cd backend
   ```

2. Create a virtual environment
   ```
   python -m venv venv
   ```

3. Activate the virtual environment
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies
   ```
   pip install -r requirements.txt
   ```

5. Run the backend server
   ```
   python main.py
   ```
   The server will run at http://localhost:8000

## Frontend Setup

1. Navigate to the frontend directory
   ```
   cd frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Run the development server
   ```
   npm run dev
   ```
   The frontend will run at http://localhost:5173

## API Routes

- `GET /api/health`: Check if the API server is running
- `POST /api/generate-video`: Generate a video from text or prompt

## Generating Videos

To generate a video, send a POST request to `/api/generate-video` with the following JSON body:

```json
{
  "storyPrompt": "A futuristic city where...",
  "captionFont": "roboto",
  "imageStyle": "realistic",
  "ttsModel": "1"
}
```

or

```json
{
  "storyText": "Once upon a time...",
  "captionFont": "roboto",
  "imageStyle": "realistic",
  "ttsModel": "1"
}
```
