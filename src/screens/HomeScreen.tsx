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

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
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

const HomeScreen: React.FC<HomeScreenProps> = ({ userInfo, topics }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<NewsArticle[]>([]);
  const position = useRef(new Animated.Value(0)).current;

  // 🔥 Fetch News
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
            image: `https://picsum.photos/500/900?random=${index}`,
            source: source || "News",
            category: "General",
          };
        });

        allArticles = [...allArticles, ...formatted];
      }

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

  // 🔥 Vertical swipe
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) =>
      Math.abs(gesture.dy) > 10,

    onPanResponderMove: (_, gesture) => {
      position.setValue(gesture.dy);
    },

    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy < -SWIPE_THRESHOLD) {
        swipeUp();
      } else if (gesture.dy > SWIPE_THRESHOLD) {
        swipeDown();
      } else {
        resetPosition();
      }
    },
  });

  const swipeUp = () => {
    Animated.timing(position, {
      toValue: -SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prev) => prev + 1);
      position.setValue(0);
    });
  };

  const swipeDown = () => {
    if (currentIndex === 0) return resetPosition();

    Animated.timing(position, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prev) => prev - 1);
      position.setValue(0);
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
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

    return cards.map((card, index) => {
      if (index < currentIndex - 1 || index > currentIndex + 1) return null;

      const isCurrent = index === currentIndex;

      const translateY = isCurrent
        ? position
        : new Animated.Value((index - currentIndex) * SCREEN_HEIGHT);

      return (
        <Animated.View
          key={card.id}
          style={[
            styles.feedCard,
            { transform: [{ translateY }] },
          ]}
          {...(isCurrent ? panResponder.panHandlers : {})}
        >
          <Image source={{ uri: card.image }} style={styles.cardImage} />

          <View style={styles.cardContent}>
            <View style={styles.cardTopSection}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{card.category}</Text>
              </View>

              <Text style={styles.cardTitle}>{card.title}</Text>

              <Text style={styles.cardDescription}>
                {card.description}
              </Text>
            </View>

            <View style={styles.cardBottomSection}>
              <Text style={styles.cardSource}>{card.source}</Text>
            </View>
          </View>
        </Animated.View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ HEADER — EXACTLY SAME */}
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

      {/* 🔥 FEED */}
      <View style={styles.feedContainer}>{renderCards()}</View>
    </SafeAreaView>
  );
};

/* 🔥 IMPORTANT: HEADER STYLES UNTOUCHED */
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
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
  logoImage: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  headerTextContainer: { flex: 1 },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3C3C3C',
    marginBottom: 4,
  },
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
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#777777',
    minWidth: 40,
  },
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
  streakNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9500',
  },

  // 🔥 Feed styles
  feedContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  feedCard: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cardTopSection: { marginBottom: 10 },
  cardBottomSection: {},
  categoryBadge: {
    backgroundColor: '#58CC02',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#ddd',
    marginTop: 6,
  },
  cardSource: {
    fontSize: 13,
    color: '#aaa',
  },

  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreCardsText: { fontSize: 24, fontWeight: 'bold' },
  noMoreCardsSubtext: { fontSize: 16, color: '#777' },
});

export default HomeScreen;