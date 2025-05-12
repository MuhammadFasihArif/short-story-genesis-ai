
from fastapi import FastAPI, HTTPException, BackgroundTasks, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Union
import os
import uuid
import logging
from pathlib import Path

app = FastAPI(title="AI Shorts Generator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Directory for storing generated videos
VIDEOS_DIR = Path("./videos")
VIDEOS_DIR.mkdir(exist_ok=True)

# Models
class VideoRequest(BaseModel):
    storyPrompt: Optional[str] = None
    storyText: Optional[str] = None
    captionFont: str
    imageStyle: str
    ttsModel: str
    voiceSampleUrl: Optional[str] = None

class VideoResponse(BaseModel):
    videoUrl: str
    captionsUrl: str
    message: str = "Video generated successfully"

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/generate-video", response_model=VideoResponse)
async def generate_video(request: VideoRequest, background_tasks: BackgroundTasks):
    try:
        # Validate request
        if not request.storyPrompt and not request.storyText:
            raise HTTPException(
                status_code=400, 
                detail="Either storyPrompt or storyText must be provided"
            )

        # Generate a unique ID for this video
        video_id = str(uuid.uuid4())
        
        # In a real implementation, generate the video here
        # For now, return a placeholder
        
        # Construct URLs for the generated files - in development they'll be served
        # by a static file server in the Python backend
        video_url = f"/videos/{video_id}.mp4"
        captions_url = f"/videos/{video_id}_captions.json"
        
        return VideoResponse(
            videoUrl=video_url,
            captionsUrl=captions_url
        )
        
    except Exception as e:
        logger.error(f"Error generating video: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
