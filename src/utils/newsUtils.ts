/**
 * News Utility Functions
 * Helper functions for fetching and processing news
 */
import { XMLParser } from 'fast-xml-parser';
import { NewsArticle, TOPIC_RSS_MAP } from '../types/news.types';

/**
 * Build RSS URL for a given topic
 */
export const buildRSSUrl = (topicName: string): string => {
  const query = TOPIC_RSS_MAP[topicName] || topicName;
  return `https://news.google.com/rss/search?q=${encodeURIComponent(
    query + " when:1d"
  )}&hl=en-IN&gl=IN&ceid=IN:en`;
};

/**
 * Fetch news articles for given topics
 */
export const fetchNewsArticles = async (
  topics: string[]
): Promise<NewsArticle[]> => {
  const selectedTopics = topics.length ? topics : ["Tech"];
  const parser = new XMLParser();
  let allArticles: NewsArticle[] = [];

  // Fetch news for each topic and tag them appropriately
  for (let i = 0; i < selectedTopics.length; i++) {
    const topicName = selectedTopics[i];
    const url = buildRSSUrl(topicName);

    try {
      const res = await fetch(url);
      const xml = await res.text();
      const data = parser.parse(xml);
      const items = data?.rss?.channel?.item || [];

      const formatted = items.map((item: any, index: number) => {
        const [title, source] = (item.title || "").split(" - ");

        // Clean up the description to remove duplicated title text
        let cleanDescription = item.description || "";
        if (title) {
          cleanDescription = cleanDescription.replace(
            new RegExp(title, 'g'),
            ''
          );
        }

        return {
          id: `${Math.random()}-${topicName}-${index}`,
          title: title || "No title",
          description: cleanDescription,
          image: `https://picsum.photos/600/900?random=${Date.now()}-${i}-${index}`,
          source: source || "News",
          category: topicName,
        };
      });

      allArticles = [...allArticles, ...formatted];
    } catch (topicError) {
      console.log(`Error fetching news for ${topicName}:`, topicError);
    }
  }

  // Randomize all articles after tagging them
  allArticles.sort(() => 0.5 - Math.random());

  return allArticles;
};
