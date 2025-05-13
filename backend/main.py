
from fastapi import FastAPI, HTTPException, BackgroundTasks, Request, Depends, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Union
import os
import uuid
import logging
from pathlib import Path
import shutil

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

# Directory for storing generated videos and uploaded files
VIDEOS_DIR = Path("./videos")
VIDEOS_DIR.mkdir(exist_ok=True)

UPLOADS_DIR = Path("./uploads")
UPLOADS_DIR.mkdir(exist_ok=True)

# Mount the static files directory
app.mount("/videos", StaticFiles(directory="videos"), name="videos")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

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

@app.post("/api/upload-voice")
async def upload_voice(file: UploadFile = File(...)):
    try:
        # Create a unique filename
        file_id = str(uuid.uuid4())
        file_extension = file.filename.split(".")[-1] if file.filename else "wav"
        filename = f"{file_id}.{file_extension}"
        
        # Save the file
        file_path = UPLOADS_DIR / filename
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Construct the URL to access the file
        voice_file_url = f"/uploads/{filename}"
        
        return {
            "voice_file_url": voice_file_url,
            "message": "Voice sample uploaded successfully"
        }
    except Exception as e:
        logger.error(f"Error uploading voice: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
        
        # Create a placeholder video file (in a real app, this would be your actual video generation)
        # Here we're just creating empty files as placeholders
        video_file_path = VIDEOS_DIR / f"{video_id}.mp4"
        captions_file_path = VIDEOS_DIR / f"{video_id}_captions.json"
        
        # Create empty files for now
        video_file_path.touch()
        with open(captions_file_path, "w") as f:
            f.write('{"captions": [{"start": 0, "end": 5, "text": "Example caption"}]}')
        
        # Construct URLs for the generated files
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
