
import { VideoRequest, VideoResponse } from "./api-types";

// Mock data for frontend-only development
const mockResponse: VideoResponse = {
  videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  captionsUrl: "https://example.com/captions.json",
  message: "Video generated successfully"
};

export const apiClient = {
  async generateVideo(request: VideoRequest): Promise<VideoResponse> {
    console.log("Mock generateVideo called with:", request);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockResponse;
  },

  async getHealthcheck(): Promise<{ status: string }> {
    console.log("Mock health check called");
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { status: "ok" };
  }
};
