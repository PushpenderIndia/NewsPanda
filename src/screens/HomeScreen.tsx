import React, { useRef, useState, useEffect } from 'react';
import { XMLParser } from 'fast-xml-parser';
import {
  View,
  Text,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mascotHappy = require('../assets/mascot-happy.png');

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

interface HomeScreenProps {
  userInfo?: any;
  topics: string[];
}

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  source: string;
  category: string;
}

const TOPIC_RSS_MAP: Record<string, string> = {
  Tech: "technology",
  Startups: "startup funding entrepreneurship",
  Finance: "finance stock market",
  Politics: "politics india",
  Sports: "sports cricket football",
  AI: "artificial intelligence AI",
  Crypto: "crypto bitcoin blockchain",
  "World News": "world news",
  Entertainment: "entertainment movies bollywood",
};

const buildRSSUrls = (topics: string[]) => {
  return topics.map((topicName) => {
    const query = TOPIC_RSS_MAP[topicName] || topicName;

    return `https://news.google.com/rss/search?q=${encodeURIComponent(
      query + " when:1d"
    )}&hl=en-IN&gl=IN&ceid=IN:en`;
  });
};

const HomeScreen: React.FC<HomeScreenProps> = ({ topics }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<NewsArticle[]>([]);
  const swipeDirection = useRef(new Animated.Value(0)).current;

  // 🔥 Fetch news
  const fetchNews = async () => {
    try {
      const urls = buildRSSUrls(topics.length ? topics : ["Tech"]);
      const parser = new XMLParser();

      let allArticles: NewsArticle[] = [];

      for (const url of urls) {
        const res = await fetch(url);
        const xml = await res.text();

        const data = parser.parse(xml);
        const items = data?.rss?.channel?.item || [];

        const formatted = items.map((item: any, index: number) => {
          const [title, source] = (item.title || "").split(" - ");

          return {
            id: `${Math.random()}`,
            title: title || "No title",
            description: item.description || "No description",
            image: `https://picsum.photos/400/500?random=${index}`,
            source: source || "News",
            category: "General",
          };
        });

        allArticles = [...allArticles, ...formatted];
      }

      // Shuffle (important UX)
      allArticles.sort(() => 0.5 - Math.random());

      setCards(allArticles);
      setCurrentIndex(0);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [topics]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      swipeDirection.setValue(gesture.dx);
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe('left');
      }
      swipeDirection.setValue(0);
    },
  });

  const forceSwipe = (direction: 'left' | 'right') => {
    const item = cards[currentIndex];
    if (!item) return;

    console.log(`${direction === 'right' ? 'Liked' : 'Skipped'}: ${item.title}`);
    setCurrentIndex((prev) => prev + 1);
  };

  const renderCards = () => {
    if (cards.length === 0) {
      return (
        <View style={styles.noMoreCards}>
          <Text>Loading news...</Text>
        </View>
      );
    }

    if (currentIndex >= cards.length) {
      return (
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreCardsText}>🎉 You've seen all the news!</Text>
          <Text style={styles.noMoreCardsSubtext}>
            Check back later for more updates
          </Text>
        </View>
      );
    }

    return cards
      .map((card, index) => {
        if (index < currentIndex) return null;
        if (index > currentIndex + 1) return null;

        const isTopCard = index === currentIndex;

        return (
          <Animated.View
            key={card.id}
            style={[styles.card, { zIndex: 1000 - index }]}
            pointerEvents={isTopCard ? 'auto' : 'none'}
            {...(isTopCard ? panResponder.panHandlers : {})}
          >
            <Image source={{ uri: card.image }} style={styles.cardImage} />

            {isTopCard && (
              <>
                <Animated.View
                  style={[
                    styles.likeLabel,
                    {
                      opacity: swipeDirection.interpolate({
                        inputRange: [0, SWIPE_THRESHOLD],
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                      }),
                    },
                  ]}
                >
                  <Text style={styles.likeLabelText}>INTERESTED</Text>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.nopeLabel,
                    {
                      opacity: swipeDirection.interpolate({
                        inputRange: [-SWIPE_THRESHOLD, 0],
                        outputRange: [1, 0],
                        extrapolate: 'clamp',
                      }),
                    },
                  ]}
                >
                  <Text style={styles.nopeLabelText}>SKIP</Text>
                </Animated.View>
              </>
            )}

            <View style={styles.cardContent}>
              <View style={styles.cardTopSection}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{card.category}</Text>
                </View>

                <Text style={styles.cardTitle} numberOfLines={2}>
                  {card.title}
                </Text>

                <Text style={styles.cardDescription} numberOfLines={2}>
                  {card.description}
                </Text>
              </View>

              <View style={styles.cardBottomSection}>
                <Text style={styles.cardSource} numberOfLines={1}>
                  {card.source}
                </Text>
              </View>
            </View>
          </Animated.View>
        );
      })
      .reverse();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Image source={mascotHappy} style={styles.logoImage} />
          </View>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>NewsPanda</Text>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${((currentIndex) / (cards.length || 1)) * 100}%`,
                    },
                  ]}
                />
              </View>

              <Text style={styles.progressText}>
                {currentIndex}/{cards.length}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.streakContainer}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakNumber}>0</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardsContainer}>{renderCards()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF4E6',
    borderWidth: 3,
    borderColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  logoImage: { width: 44, height: 44, resizeMode: 'contain' },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#3C3C3C' },
  progressContainer: { flexDirection: 'row', alignItems: 'center' },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: '#E5E5E5',
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
  },
  progressText: { fontSize: 12, fontWeight: 'bold', color: '#777777' },
  headerRight: { marginLeft: 12 },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FF9500',
  },
  streakEmoji: { fontSize: 18, marginRight: 4 },
  streakNumber: { fontSize: 16, fontWeight: 'bold', color: '#FF9500' },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 32,
    height: '96%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    elevation: 8,
    overflow: 'hidden',
  },
  cardImage: { width: '100%', height: '60%' },
  cardContent: { height: '40%', padding: 20, justifyContent: 'space-between' },
  categoryBadge: {
    backgroundColor: '#58CC02',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  categoryText: { color: '#fff', fontWeight: 'bold' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  cardDescription: { fontSize: 14, color: '#777' },
  cardSource: { fontSize: 12, color: '#999' },
  likeLabel: {
    position: 'absolute',
    top: 50,
    left: 30,
    borderWidth: 3,
    borderColor: '#58CC02',
    padding: 8,
  },
  likeLabelText: { color: '#58CC02', fontWeight: 'bold' },
  nopeLabel: {
    position: 'absolute',
    top: 50,
    right: 30,
    borderWidth: 3,
    borderColor: '#FF4B4B',
    padding: 8,
  },
  nopeLabelText: { color: '#FF4B4B', fontWeight: 'bold' },
  noMoreCards: { justifyContent: 'center', alignItems: 'center' },
  noMoreCardsText: { fontSize: 22, fontWeight: 'bold' },
  noMoreCardsSubtext: { color: '#777' },
});

export default HomeScreen;