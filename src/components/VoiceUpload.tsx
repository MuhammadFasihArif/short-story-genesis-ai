
import React, { useState } from "react";
import { toast } from "sonner";
import { Upload, FileAudio, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
      
      // Mock upload process 
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock URL
      const mockVoiceUrl = "https://example.com/voice-sample.mp3";
      
      toast.success("Voice sample uploaded successfully");
      
      // Call the callback if provided
      if (onUploadComplete) {
        onUploadComplete(mockVoiceUrl);
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
        
        // Mock file upload instead of actually sending to backend
        toast.success("Recording processed successfully");
        
        // Call callback with mock URL
        if (onUploadComplete) {
          onUploadComplete("https://example.com/recorded-voice.mp3");
        }
        
        // Stop all audio tracks
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
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
