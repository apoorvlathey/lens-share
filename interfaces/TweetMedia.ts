export interface TweetMedia {
  media_key: string;
  type: "photo" | "video";
  url?: string;
  preview_image_url?: string;
}
