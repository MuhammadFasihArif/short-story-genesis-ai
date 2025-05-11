
import React, { useState } from "react";
import { toast } from "sonner";
import { Upload, FileAudio, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface VoiceUploadProps {
  onUploadComplete?: (url: string) => void;
  className?: string;
}

const VoiceUpload = ({ onUploadComplete, className }: VoiceUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [recordingMode, setRecordingMode] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('audio')) {
      toast.error("Please upload an audio file (mp3 or wav)");
      return;
    }

    try {
      setIsUploading(true);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to upload voice samples");
        return;
      }
      
      const userId = session.user.id;
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      
      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
      
      // Save to voice_samples table
      const { error: dbError } = await supabase
        .from('voice_samples')
        .insert({
          user_id: userId,
          voice_file_url: publicUrl
        });
      
      if (dbError) {
        throw dbError;
      }
      
      toast.success("Voice sample uploaded successfully");
      
      // Call the callback if provided
      if (onUploadComplete) {
        onUploadComplete(publicUrl);
      }
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload voice sample");
    } finally {
      setIsUploading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      setRecorder(mediaRecorder);
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        setAudioChunks(chunks);
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });
        
        // Create a file input event to reuse the upload logic
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(audioFile);
        
        const event = {
          target: {
            files: dataTransfer.files
          }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        
        handleFileUpload(event);
      };
      
      mediaRecorder.start();
      setRecordingMode(true);
      toast.info("Recording started");
      
    } catch (error: any) {
      console.error("Recording error:", error);
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      setRecordingMode(false);
      
      // Stop all audio tracks
      recorder.stream.getTracks().forEach(track => track.stop());
      toast.info("Recording stopped");
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="voiceFile" className="text-sm font-medium">
          Upload Voice Sample
        </Label>
        <div className="flex flex-col space-y-3">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/30">
            <FileAudio className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload .mp3 or .wav file for custom voice TTS
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                disabled={isUploading || recordingMode}
                className="relative"
                onClick={() => document.getElementById("voiceFile")?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
                <input
                  type="file"
                  id="voiceFile"
                  accept="audio/mp3,audio/wav,.mp3,.wav"
                  className="sr-only"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </Button>
              
              {!recordingMode ? (
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={startRecording}
                  disabled={isUploading}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Record
                </Button>
              ) : (
                <Button 
                  variant="destructive" 
                  type="button" 
                  onClick={stopRecording}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceUpload;
