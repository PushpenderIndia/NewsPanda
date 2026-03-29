/**
 * News related type definitions
 */

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  source: string;
  category: string;
}

export interface HomeScreenProps {
  topics: string[];
  userInfo?: any;
}

export const TOPIC_RSS_MAP: Record<string, string> = {
  Tech: "technology",
  Startups: "startup funding entrepreneurship",
  Finance: "finance stock market",
  Politics: "politics india",
  Sports: "sports cricket football",
  AI: "artificial intelligence AI",
  Crypto: "crypto bitcoin blockchain",
  "World News": "world international global",
  Entertainment: "entertainment movies bollywood",
  Fashion: "fashion style trends clothing",
};
