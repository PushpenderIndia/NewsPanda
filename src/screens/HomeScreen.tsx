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
  TouchableOpacity,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import RenderHTML from 'react-native-render-html';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getStreak, saveStreak, getUserInfo, getXP, saveXP } from '../services/storage';
import { updateStreak as updateStreakAPI, addXP } from '../services/api';

const mascotHappy = require('../assets/mascot-happy.png');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

interface HomeScreenProps {
  topics: string[];
  userInfo?: any;
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

// 🔥 ANIMATED SKELETON COMPONENT
const SkeletonLoader = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.skeletonBackground, { opacity: fadeAnim }]} />
      <View style={styles.content}>
        <Animated.View style={[styles.skeletonLine, { width: 80, height: 16, backgroundColor: '#58CC02', marginBottom: 12, opacity: fadeAnim }]} />
        <Animated.View style={[styles.skeletonLine, { width: '90%', height: 28, opacity: fadeAnim }]} />
        <Animated.View style={[styles.skeletonLine, { width: '70%', height: 28, marginBottom: 16, opacity: fadeAnim }]} />
        <Animated.View style={[styles.skeletonLine, { width: '100%', height: 14, opacity: fadeAnim }]} />
        <Animated.View style={[styles.skeletonLine, { width: '100%', height: 14, opacity: fadeAnim }]} />
        <Animated.View style={[styles.skeletonLine, { width: '80%', height: 14, marginBottom: 16, opacity: fadeAnim }]} />
        <Animated.View style={[styles.skeletonLine, { width: 100, height: 12, opacity: fadeAnim }]} />
      </View>
    </View>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ topics }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [showStatsModal, setShowStatsModal] = useState(false);

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
          
          // Clean up the description to remove the duplicated title text injected by Google News
          let cleanDescription = item.description || "";
          if (title) {
            cleanDescription = cleanDescription.replace(new RegExp(title, 'g'), '');
          }

          return {
            id: `${Math.random()}`,
            title: title || "No title",
            description: cleanDescription,
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
    // Reset index and fetch news when topics change
    setCurrentIndex(0);
    fetchNews();
  }, [topics]);

  // 🔥 Load and update streak and XP
  useEffect(() => {
    const loadAndUpdateData = async () => {
      try {
        // Load local data first
        const localStreak = await getStreak();
        const localXp = await getXP();
        setStreak(localStreak);
        setXp(localXp);

        // Try to update from backend
        const userInfo = await getUserInfo();
        if (userInfo?.email) {
          const response = await updateStreakAPI(userInfo.email);
          if (response.streak !== undefined) {
            setStreak(response.streak);
            await saveStreak(response.streak);
          }
        }
      } catch (error) {
        console.error('Error updating streak:', error);
        // Keep local data if backend fails
      }
    };

    loadAndUpdateData();
  }, []);

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

    onPanResponderRelease: async (_, g) => {
      if (g.dy < -SWIPE_THRESHOLD) {
        // Award XP for swipe
        try {
          const userInfo = await getUserInfo();
          if (userInfo?.email) {
            const response = await addXP(userInfo.email, 1);
            if (response.success && response.xp !== undefined) {
              setXp(response.xp);
              await saveXP(response.xp);
            }
          }
        } catch (error) {
          console.error('Error adding XP:', error);
        }

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
      return <SkeletonLoader />;
    }

    if (cards.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No news available</Text>
        </View>
      );
    }

    if (currentIndex >= cards.length) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>🎉 You're all caught up!</Text>
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

            {/* 🔥 FIXED OVERLAY & GRADIENT */}
            <View style={styles.overlay} />
            <LinearGradient
              colors={[
                'rgba(0,0,0,0)',
                'rgba(0,0,0,0.05)',
                'rgba(0,0,0,0.15)',
                'rgba(0,0,0,0.35)',
                'rgba(0,0,0,0.6)',
                'rgba(0,0,0,0.8)',
                'rgba(0,0,0,0.95)',
              ]}
              locations={[0, 0.35, 0.55, 0.65, 0.75, 0.85, 1]}
              style={styles.gradientOverlay}
            />

            <View style={styles.content}>
              <Text style={styles.category}>{card.category}</Text>

              <Text style={styles.title}>{card.title}</Text>

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
      {/* 🔥 HEADER */}
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

        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => setShowStatsModal(true)}
          activeOpacity={0.8}
        >
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Icon name="fire" size={20} color="#FF6B35" />
              <Text style={styles.statValue}>{streak}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon name="star" size={20} color="#FFC107" />
              <Text style={styles.statValue}>{xp}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Modal */}
      <Modal
        visible={showStatsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowStatsModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Stats</Text>
              <TouchableOpacity onPress={() => setShowStatsModal(false)}>
                <Icon name="close" size={24} color="#3C3C3C" />
              </TouchableOpacity>
            </View>

            <View style={styles.statsDetailContainer}>
              <View style={styles.statsDetailCard}>
                <View style={styles.statsDetailIconContainer}>
                  <Icon name="fire" size={32} color="#FF6B35" />
                </View>
                <View style={styles.statsDetailInfo}>
                  <Text style={styles.statsDetailLabel}>Daily Streak</Text>
                  <Text style={styles.statsDetailValue}>{streak} days</Text>
                  <Text style={styles.statsDetailDescription}>
                    Keep reading daily to maintain your streak!
                  </Text>
                </View>
              </View>

              <View style={styles.statsDetailCard}>
                <View style={styles.statsDetailIconContainer}>
                  <Icon name="star" size={32} color="#FFC107" />
                </View>
                <View style={styles.statsDetailInfo}>
                  <Text style={styles.statsDetailLabel}>Experience Points</Text>
                  <Text style={styles.statsDetailValue}>{xp} XP</Text>
                  <Text style={styles.statsDetailDescription}>
                    Earn 1 XP for every news article you swipe!
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 🔥 FEED */}
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

  statsButton: {
    marginLeft: 12,
  },

  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3C3C3C',
  },

  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C3C3C',
  },

  statsDetailContainer: {
    gap: 16,
  },

  statsDetailCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    padding: 16,
  },

  statsDetailIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  statsDetailInfo: {
    flex: 1,
  },

  statsDetailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777777',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  statsDetailValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3C3C3C',
    marginBottom: 8,
  },

  statsDetailDescription: {
    fontSize: 14,
    color: '#777777',
    lineHeight: 20,
  },

  card: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#1a1a1a', // Dark base for the card
  },

  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 2,
  },
  
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '65%',
    zIndex: 3,
  },

  content: {
    position: 'absolute',
    bottom: 100,
    padding: 20,
    zIndex: 4,
    width: '100%',
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
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  source: {
    color: '#aaa',
    marginTop: 10,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Skeleton Styles
  skeletonBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#333',
  },
  
  skeletonLine: {
    backgroundColor: '#555',
    borderRadius: 4,
    marginBottom: 8,
  },
});