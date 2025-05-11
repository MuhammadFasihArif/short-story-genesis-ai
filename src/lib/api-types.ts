
export type TtsModel = {
  id: string;
  name: string;
  multilingual: boolean;
};

export type ImageStyle = {
  id: string;
  name: string;
  description: string;
};

export type VideoRequest = {
  storyPrompt?: string;
  storyText?: string;
  captionFont: string;
  imageStyle: string;
  ttsModel: string;
  voiceSampleUrl?: string;
};

export type VideoResponse = {
  videoUrl: string;
  captionsUrl: string;
  message: string;
};

export type ApiError = {
  message: string;
  status: number;
};

// These match the options in the Python script
export const IMAGE_STYLES: ImageStyle[] = [
  {
    id: "realistic",
    name: "Realistic",
    description: "Highly detailed, 8K, professional photography",
  },
  {
    id: "cartoon",
    name: "Cartoon",
    description: "Vibrant colors, Pixar animation, 3D render",
  },
  {
    id: "anime",
    name: "Anime",
    description: "Studio Ghibli style, vibrant colors, detailed",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    description: "Magical, dreamlike, highly detailed digital painting",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Neon lights, futuristic, cinematic lighting",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Soft edges, artistic, pastel colors",
  },
];

export const TTS_MODELS: TtsModel[] = [
  {
    id: "1",
    name: "English (High Quality)",
    multilingual: false,
  },
  {
    id: "2",
    name: "Multilingual (XTTS v2)",
    multilingual: true,
  },
];

export const FONT_OPTIONS = [
  { id: "roboto", name: "Roboto", className: "font-roboto" },
  { id: "opensans", name: "Open Sans", className: "font-opensans" },
  { id: "inter", name: "Inter", className: "font-inter" },
  { id: "space", name: "Space Grotesk", className: "font-space" },
  { id: "poppins", name: "Poppins", className: "font-poppins" },
];
