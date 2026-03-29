import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './HomeScreen';
import NewsPodcastScreen from './NewsPodcastScreen';
import TopicsScreen from './TopicsScreen';
import BottomTabBar from '../components/BottomTabBar';

type TabType = 'home' | 'podcast' | 'settings';

interface MainScreenProps {
  userInfo?: any;
}

const MainScreen: React.FC<MainScreenProps> = ({ userInfo }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen userInfo={userInfo} />;
      case 'podcast':
        return <NewsPodcastScreen />;
      case 'settings':
        return <TopicsScreen onContinue={() => setActiveTab('home')} isSettingsMode />;
      default:
        return <HomeScreen userInfo={userInfo} />;
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
