
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

// Setup CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize environment variables
const PYTHON_API_URL = Deno.env.get("PYTHON_API_URL") || "http://localhost:8000";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }), 
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Create Supabase client with the user's JWT
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get the user's session and identify them
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }), 
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Parse the request body
    const requestData = await req.json();
    const {
      storyPrompt,
      storyText,
      captionFont,
      imageStyle, 
      ttsModel,
      voiceSampleUrl
    } = requestData;

    if ((!storyPrompt && !storyText) || !captionFont || !imageStyle || !ttsModel) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Prepare the data to send to the Python backend
    const pythonApiPayload = {
      userId: user.id,
      storyPrompt,
      storyText,
      captionFont,
      imageStyle,
      ttsModel,
      voiceSampleUrl
    };

    // Call the Python API
    const pythonResponse = await fetch(`${PYTHON_API_URL}/api/generate-video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, // Use service role key to authenticate with Python API
      },
      body: JSON.stringify(pythonApiPayload),
    });

    if (!pythonResponse.ok) {
      const errorData = await pythonResponse.json();
      throw new Error(errorData.detail || `Python API error: ${pythonResponse.status}`);
    }

    // Get the Python API response
    const pythonData = await pythonResponse.json();

    // Store video metadata in Supabase
    const { data: storyData, error: storyError } = await supabase
      .from('stories')
      .insert({
        title: storyText ? storyText.split('.')[0].substring(0, 50) : storyPrompt.substring(0, 50),
        user_id: user.id
      })
      .select('id')
      .single();

    if (storyError) {
      console.error("Error creating story:", storyError);
    } else if (storyData && pythonData.scenes) {
      // Insert scene data
      const scenesData = pythonData.scenes.map((scene: any) => ({
        story_id: storyData.id,
        image_prompt: scene.imagePrompt,
        image_url: scene.imageUrl,
        narration_text: scene.narrationText,
        audio_url: scene.audioUrl,
        start_time: scene.startTime,
        end_time: scene.endTime
      }));

      const { error: scenesError } = await supabase
        .from('scenes')
        .insert(scenesData);

      if (scenesError) {
        console.error("Error creating scenes:", scenesError);
      }
    }

    return new Response(
      JSON.stringify({
        videoUrl: pythonData.videoUrl,
        captionsUrl: pythonData.captionsUrl,
        message: "Video generated successfully"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
