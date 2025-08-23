export type Tweet = {
  text: string;
  created_at: string;
  id: string;
  referenced_tweets?: { type: string; id: string }[];
};