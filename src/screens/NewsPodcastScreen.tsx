import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockPodcasts = [
  {
    id: '1',
    title: 'Tech News Daily Briefing',
    description: 'Your daily dose of technology news in 10 minutes',
    duration: '10 min',
    category: 'Technology',
  },
  {
    id: '2',
    title: 'Global Affairs Today',
    description: 'International news and world events analysis',
    duration: '15 min',
    category: 'World',
  },
  {
    id: '3',
    title: 'Business Hour',
    description: 'Market updates and business insights',
    duration: '12 min',
    category: 'Business',
  },
];

const NewsPodcastScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>News Podcasts</Text>
        <Text style={styles.headerSubtitle}>Listen to your daily news briefings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mockPodcasts.map((podcast) => (
          <View key={podcast.id} style={styles.podcastCard}>
            <View style={styles.podcastIcon}>
              <Text style={styles.podcastIconText}>🎙️</Text>
            </View>
            <View style={styles.podcastInfo}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{podcast.category}</Text>
              </View>
              <Text style={styles.podcastTitle}>{podcast.title}</Text>
              <Text style={styles.podcastDescription}>{podcast.description}</Text>
              <Text style={styles.podcastDuration}>{podcast.duration}</Text>
            </View>
          </View>
        ))}

        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>🎧 More podcasts coming soon!</Text>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3C3C3C',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#777777',
    marginTop: 4,
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
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F0FDE4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  podcastIconText: {
    fontSize: 32,
  },
  podcastInfo: {
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#58CC02',
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
  comingSoon: {
    padding: 32,
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#777777',
    fontWeight: '600',
  },
});

export default NewsPodcastScreen;
