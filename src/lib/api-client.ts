
import { ApiError, VideoRequest, VideoResponse } from "./api-types";
import { supabase } from "@/integrations/supabase/client";

export const apiClient = {
  async generateVideo(request: VideoRequest): Promise<VideoResponse> {
    try {
      const { data, error } = await supabase.functions.invoke("generate-video", {
        body: request
      });
      
      if (error) {
        throw { message: error.message || "Video generation failed", status: 500 };
      }
      
      return data as VideoResponse;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  async getHealthcheck(): Promise<{ status: string }> {
    try {
      const { data, error } = await supabase.functions.invoke("health", {
        method: "GET"
      });
      
      if (error) {
        throw { message: "API server is down", status: 500 };
      }
      
      return data as { status: string };
    } catch (error) {
      console.error("Health check error:", error);
      throw error;
    }
  }
};
