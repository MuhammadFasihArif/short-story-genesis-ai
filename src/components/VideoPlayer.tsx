
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title }) => {
  return (
    <Card className="bg-secondary/80 backdrop-blur-sm border-secondary">
      {title && (
        <CardHeader>
          <CardTitle className="text-gradient">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0 overflow-hidden rounded-b-lg">
        <video
          className="w-full aspect-[9/16] rounded-b-lg"
          controls
          src={videoUrl}
        ></video>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
