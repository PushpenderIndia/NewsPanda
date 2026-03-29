import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';

const mascotHappy = require('../assets/mascot-happy.png');

// Topic animations mapping
const TOPIC_ANIMATIONS: Record<string, any> = {
  Tech: require('../assets/animations/tech.json'),
  Startups: require('../assets/animations/startups.json'),
  Finance: require('../assets/animations/finance.json'),
  Politics: require('../assets/animations/politics.json'),
  Sports: require('../assets/animations/sports.json'),
  AI: require('../assets/animations/ai.json'),
  Crypto: require('../assets/animations/crypto.json'),
  'World News': require('../assets/animations/world-news.json'),
  Entertainment: require('../assets/animations/entertainment.json'),
};

// Topic colors mapping
const TOPIC_COLORS: Record<string, string> = {
  Tech: '#58CC02',
  Startups: '#FF9600',
  Finance: '#1CB0F6',
  Politics: '#CE82FF',
  Sports: '#FF4B4B',
  AI: '#FFD900',
  Crypto: '#00CD9C',
  'World News': '#FF6E83',
  Entertainment: '#8E44AD',
};

interface NewsPodcastScreenProps {
  topics?: string[];
}

const NewsPodcastScreen: React.FC<NewsPodcastScreenProps> = ({ topics = [] }) => {
  // Generate podcasts based on selected topics
  const generatePodcasts = () => {
    if (topics.length === 0) {
      return [{
        id: '1',
        title: 'No topics selected',
        description: 'Please select topics from settings to see personalized podcasts',
        duration: '0 min',
        category: 'Tech',
      }];
    }

    return topics.map((topic, index) => ({
      id: `${index + 1}`,
      title: `${topic} News Daily Briefing`,
      description: `Your daily dose of ${topic} news in a quick podcast`,
      duration: `${Math.floor(Math.random() * 5) + 8} min`,
      category: topic,
    }));
  };

  const podcasts = generatePodcasts();
  return (
    <SafeAreaView style={styles.container}>
      {/* Header matching HomeScreen style */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Image source={mascotHappy} style={styles.logoImage} />
          </View>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>NewsPanda</Text>
            <Text style={styles.headerSubtitle}>Listen to your daily news briefings</Text>
          </View>
        </View>

      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {podcasts.map((podcast) => {
          const topicColor = TOPIC_COLORS[podcast.category] || '#58CC02';
          const topicAnimation = TOPIC_ANIMATIONS[podcast.category] || TOPIC_ANIMATIONS.Tech;

          return (
            <View key={podcast.id} style={styles.podcastCard}>
              <View style={[styles.podcastIcon, { backgroundColor: `${topicColor}15` }]}>
                <LottieView
                  source={topicAnimation}
                  autoPlay
                  loop
                  style={styles.podcastLottie}
                />
              </View>
              <View style={styles.podcastInfo}>
                <View style={[styles.categoryBadge, { backgroundColor: topicColor }]}>
                  <Text style={styles.categoryText}>{podcast.category}</Text>
                </View>
                <Text style={styles.podcastTitle}>{podcast.title}</Text>
                <Text style={styles.podcastDescription}>{podcast.description}</Text>
                <Text style={styles.podcastDuration}>{podcast.duration}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
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
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3C3C3C',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#777777',
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  podcastCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  podcastIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  podcastLottie: {
    width: 70,
    height: 70,
  },
  podcastInfo: {
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  podcastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3C3C3C',
    marginBottom: 4,
  },
  podcastDescription: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 8,
  },
  podcastDuration: {
    fontSize: 12,
    color: '#ADADAD',
    fontWeight: '600',
  },
});

export default NewsPodcastScreen;
