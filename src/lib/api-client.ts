
import { VideoRequest, VideoResponse } from "./api-types";
import { API_URL } from "@/config";

export const apiClient = {
  async generateVideo(request: VideoRequest): Promise<VideoResponse> {
    try {
      const response = await fetch(`${API_URL}/api/generate-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw { 
          message: errorData.detail || "Video generation failed", 
          status: response.status 
        };
      }
      
      return await response.json() as VideoResponse;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  async getHealthcheck(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${API_URL}/api/health`, {
        method: "GET",
      });
      
      if (!response.ok) {
        throw { message: "API server is down", status: response.status };
      }
      
      return await response.json() as { status: string };
    } catch (error) {
      console.error("Health check error:", error);
      throw error;
    }
  }
};
