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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RenderHTML from 'react-native-render-html';

const mascotHappy = require('../assets/mascot-happy.png');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

interface HomeScreenProps {
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
  const [loading, setLoading] = useState(true);

  const translateY = useRef(new Animated.Value(0)).current;

  // 🔥 Fetch news
  const fetchNews = async () => {
    try {
      setLoading(true);
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
            description: item.description || "",
            image: `https://picsum.photos/600/900?random=${index}`,
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [topics]);

  // 🚀 Preload next 5
  useEffect(() => {
    const next = cards.slice(currentIndex, currentIndex + 5);
    next.forEach((item) => Image.prefetch(item.image));
  }, [currentIndex, cards]);

  // 🎯 Vertical swipe
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,

    onPanResponderMove: (_, g) => {
      translateY.setValue(g.dy);
    },

    onPanResponderRelease: (_, g) => {
      if (g.dy < -SWIPE_THRESHOLD) {
        Animated.timing(translateY, {
          toValue: -SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          translateY.setValue(0);
          setCurrentIndex((p) => p + 1);
        });
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const renderCards = () => {
    if (loading) {
      return (
        <View style={styles.skeleton}>
          <ActivityIndicator size="large" color="#58CC02" />
          <Text style={{ color: '#fff', marginTop: 10 }}>Loading news...</Text>
        </View>
      );
    }

    if (currentIndex >= cards.length) {
      return (
        <View style={styles.skeleton}>
          <Text style={{ color: '#fff' }}>🎉 No more news</Text>
        </View>
      );
    }

    return cards
      .map((card, index) => {
        if (index < currentIndex) return null;
        if (index > currentIndex + 1) return null;

        const isTop = index === currentIndex;

        return (
          <Animated.View
            key={card.id}
            style={[
              styles.card,
              isTop && { transform: [{ translateY }] },
            ]}
            {...(isTop ? panResponder.panHandlers : {})}
          >
            <Image source={{ uri: card.image }} style={styles.image} />

            <View style={styles.overlay} />

            <View style={styles.content}>
              <Text style={styles.category}>{card.category}</Text>

              <Text style={styles.title}>{card.title}</Text>

              {/* ✅ HTML RENDER */}
              <RenderHTML
                contentWidth={SCREEN_WIDTH - 40}
                source={{ html: card.description }}
                tagsStyles={{
                  a: { color: '#58CC02' },
                  font: { color: '#ddd' },
                  p: { color: '#ddd', fontSize: 14 },
                }}
              />

              <Text style={styles.source}>{card.source}</Text>
            </View>
          </Animated.View>
        );
      })
      .reverse();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔥 HEADER (ALWAYS ON TOP) */}
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
                      width: `${(currentIndex / (cards.length || 1)) * 100}%`,
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

      {/* 🔥 FEED BEHIND */}
      <View style={styles.feed}>{renderCards()}</View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  feed: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  header: {
    zIndex: 1000,
    elevation: 1000,
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

  logoImage: { width: 44, height: 44 },

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

  progressFill: { height: '100%', backgroundColor: '#58CC02' },

  progressText: { fontSize: 12, fontWeight: 'bold', color: '#777' },

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

  card: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  content: {
    position: 'absolute',
    bottom: 100,
    padding: 20,
  },

  category: {
    color: '#58CC02',
    fontWeight: 'bold',
    marginBottom: 8,
  },

  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  source: {
    color: '#aaa',
    marginTop: 10,
  },

  skeleton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});