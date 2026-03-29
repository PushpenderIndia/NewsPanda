import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './HomeScreen';
import NewsPodcastScreen from './NewsPodcastScreen';
import TopicsScreen from './TopicsScreen';
import BottomTabBar from '../components/BottomTabBar';
import { getSelectedTopics, saveSelectedTopics } from '../services/storage';
import { convertIdsToNames } from '../utils/topicMapping';

type TabType = 'home' | 'podcast' | 'map' | 'settings';

interface MainScreenProps {
  userInfo?: any;
}

const MainScreen: React.FC<MainScreenProps> = ({ userInfo }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load saved topics on mount
  useEffect(() => {
    const loadTopics = async () => {
      const savedTopicIds = await getSelectedTopics();
      // Convert IDs to names for HomeScreen
      const topicNames = convertIdsToNames(savedTopicIds);
      setSelectedTopics(topicNames);
    };
    loadTopics();
  }, []);

  // Reload topics when switching tabs (to catch settings changes)
  useEffect(() => {
    if (activeTab === 'home' || activeTab === 'podcast') {
      const loadTopics = async () => {
        const savedTopicIds = await getSelectedTopics();
        const topicNames = convertIdsToNames(savedTopicIds);
        setSelectedTopics(topicNames);

        // Trigger refresh in HomeScreen by updating the key
        if (activeTab === 'home') {
          setRefreshKey(prev => prev + 1);
        }
      };
      loadTopics();
    }
  }, [activeTab]);

  const handleTopicsUpdate = async (topics?: string[]) => {
    if (topics) {
      // Topics are already saved in TopicsScreen, just update local state
      const topicNames = convertIdsToNames(topics);
      setSelectedTopics(topicNames);
    }
    setActiveTab('home');
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen key={refreshKey} userInfo={userInfo} topics={selectedTopics} />;
      case 'podcast':
        return <NewsPodcastScreen topics={selectedTopics} />;
      case 'settings':
        return (
          <TopicsScreen
            onContinue={handleTopicsUpdate}
            isSettingsMode
            userInfo={userInfo}
          />
        );
      default:
        return <HomeScreen key={refreshKey} userInfo={userInfo} topics={selectedTopics} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  screenContainer: {
    flex: 1,
  },
});

export default MainScreen;
