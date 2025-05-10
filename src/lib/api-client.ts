
import { ApiError, VideoRequest, VideoResponse } from "./api-types";

// This should be configured in .env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const apiClient = {
  async generateVideo(request: VideoRequest): Promise<VideoResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw { message: errorData.message || "Video generation failed", status: response.status };
      }

      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  async getHealthcheck(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      if (!response.ok) {
        throw { message: "API server is down", status: response.status };
      }
      return await response.json();
    } catch (error) {
      console.error("Health check error:", error);
      throw error;
    }
  }
};
