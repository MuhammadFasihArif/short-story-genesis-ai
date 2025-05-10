
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import GlowingButton from "@/components/GlowingButton";
import FuturisticBackground from "@/components/FuturisticBackground";
import FuturisticLoading from "@/components/FuturisticLoading";
import VideoPlayer from "@/components/VideoPlayer";
import { apiClient } from "@/lib/api-client";
import { FONT_OPTIONS, IMAGE_STYLES, TTS_MODELS, VideoResponse } from "@/lib/api-types";
import { ArrowRight, Download, Loader } from "lucide-react";

const CreatePage = () => {
  const navigate = useNavigate();
  
  // Form state
  const [isCustomStory, setIsCustomStory] = useState(false);
  const [storyPrompt, setStoryPrompt] = useState("");
  const [storyText, setStoryText] = useState("");
  const [captionFont, setCaptionFont] = useState(FONT_OPTIONS[0].id);
  const [imageStyle, setImageStyle] = useState(IMAGE_STYLES[0].id);
  const [ttsModel, setTtsModel] = useState(TTS_MODELS[0].id);
  
  // App state
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VideoResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isCustomStory && !storyText) {
      toast.error("Please enter your custom story text");
      return;
    }
    
    if (!isCustomStory && !storyPrompt) {
      toast.error("Please enter a prompt for generating a story");
      return;
    }
    
    try {
      setIsLoading(true);
      setResult(null);
      
      // Make API request
      const response = await apiClient.generateVideo({
        storyText: isCustomStory ? storyText : undefined,
        storyPrompt: !isCustomStory ? storyPrompt : undefined,
        captionFont,
        imageStyle,
        ttsModel
      });
      
      setResult(response);
      toast.success("Video generated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate video. Please try again.");
      console.error("Video generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (url: string, type: 'video' | 'captions') => {
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'video' ? 'video.mp4' : 'captions.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success(`${type === 'video' ? 'Video' : 'Captions'} download started`);
  };

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <FuturisticBackground />
      
      <header className="py-4 mb-8 border-b border-muted relative z-10">
        <div className="container">
          <div className="flex items-center justify-between">
            <h1 
              className="text-2xl font-bold cursor-pointer text-gradient" 
              onClick={() => navigate('/')}
            >
              AI Shorts Generator
            </h1>
          </div>
        </div>
      </header>
      
      <div className="container flex-1 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Column */}
          <div>
            <Card className="bg-card/80 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="text-gradient">Create Your Short</CardTitle>
                <CardDescription>
                  Configure your video generation settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Story Input */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="storyType">Story Input Method</Label>
                      <div className="flex items-center gap-3">
                        <span className={!isCustomStory ? "text-white" : "text-muted-foreground"}>
                          Generate
                        </span>
                        <Switch 
                          checked={isCustomStory} 
                          onCheckedChange={setIsCustomStory} 
                        />
                        <span className={isCustomStory ? "text-white" : "text-muted-foreground"}>
                          Custom
                        </span>
                      </div>
                    </div>
                    
                    {isCustomStory ? (
                      <div className="space-y-2">
                        <Label htmlFor="storyText">Your Story</Label>
                        <Textarea 
                          id="storyText" 
                          placeholder="Once upon a time..." 
                          className="resize-none h-32"
                          value={storyText}
                          onChange={(e) => setStoryText(e.target.value)}
                          disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter your complete story text. It will be divided into scenes automatically.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="storyPrompt">Story Prompt</Label>
                        <Input
                          id="storyPrompt"
                          placeholder="A futuristic city where..."
                          value={storyPrompt}
                          onChange={(e) => setStoryPrompt(e.target.value)}
                          disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                          Provide a prompt and AI will generate a complete story.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Style Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Font Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="captionFont">Caption Font</Label>
                      <Select 
                        value={captionFont}
                        onValueChange={setCaptionFont}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          {FONT_OPTIONS.map((font) => (
                            <SelectItem 
                              key={font.id} 
                              value={font.id}
                              className={font.className}
                            >
                              {font.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* TTS Model */}
                    <div className="space-y-2">
                      <Label htmlFor="ttsModel">TTS Voice Model</Label>
                      <Select 
                        value={ttsModel} 
                        onValueChange={setTtsModel}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select voice model" />
                        </SelectTrigger>
                        <SelectContent>
                          {TTS_MODELS.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Image Style */}
                  <div className="space-y-3">
                    <Label>Image Style</Label>
                    <RadioGroup 
                      value={imageStyle} 
                      onValueChange={setImageStyle}
                      className="grid grid-cols-2 md:grid-cols-3 gap-2"
                      disabled={isLoading}
                    >
                      {IMAGE_STYLES.map((style) => (
                        <div key={style.id} className="flex items-start space-x-2">
                          <RadioGroupItem value={style.id} id={style.id} className="mt-1" />
                          <Label htmlFor={style.id} className="font-normal cursor-pointer">
                            <span className="font-medium block">{style.name}</span>
                            <span className="text-xs text-muted-foreground block">
                              {style.description}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="pt-4 flex justify-center">
                    <GlowingButton isLoading={isLoading}>
                      Generate Video
                    </GlowingButton>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Preview Column */}
          <div>
            <Card className="bg-card/80 backdrop-blur-sm h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-gradient">Video Preview</CardTitle>
                <CardDescription>
                  {result ? "Your generated video" : "Your video will appear here"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {isLoading ? (
                  <FuturisticLoading />
                ) : result ? (
                  <div className="space-y-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <VideoPlayer 
                        videoUrl={result.videoUrl} 
                        title="Generated Short"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-3">
                        <h3 className="text-lg font-medium">Download Files</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
                            onClick={() => handleDownload(result.videoUrl, 'video')}
                          >
                            <Download className="w-4 h-4" /> 
                            Download Video
                          </button>
                          <button
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                            onClick={() => handleDownload(result.captionsUrl, 'captions')}
                          >
                            <Download className="w-4 h-4" /> 
                            Download Captions
                          </button>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Share</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <button className="px-4 py-3 bg-[#FF0000]/20 border border-[#FF0000]/40 rounded-md hover:bg-[#FF0000]/30 transition-colors text-sm">
                            Upload to YouTube
                          </button>
                          <button className="px-4 py-3 bg-[#E1306C]/20 border border-[#E1306C]/40 rounded-md hover:bg-[#E1306C]/30 transition-colors text-sm">
                            Share to Instagram
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <div className="w-24 h-24 border-2 border-dashed border-muted rounded-full flex items-center justify-center">
                      <Loader className="w-8 h-8 text-muted-foreground animate-pulse" />
                    </div>
                    <div className="space-y-2 max-w-sm">
                      <h3 className="font-medium text-lg">No Video Generated Yet</h3>
                      <p className="text-muted-foreground text-sm">
                        Fill out the form and click the Generate button to create your AI-powered short video.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
