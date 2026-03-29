/**
 * HomeScreen - Main news feed screen
 * Refactored with clean architecture and separated concerns
 */
import React, { useRef, useEffect } from 'react';
import { View, Image } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreenProps } from '../types/news.types';
import { useHomeScreen } from '../hooks/useHomeScreen';
import HeaderBar from '../components/home/HeaderBar';
import StatsModal from '../components/home/StatsModal';
import NewsCard from '../components/home/NewsCard';
import SkeletonLoader from '../components/home/SkeletonLoader';
import { homeScreenStyles } from '../styles/homeScreen.styles';

const HomeScreen: React.FC<HomeScreenProps> = ({ topics }) => {
  const {
    currentIndex,
    cards,
    loading,
    streak,
    xp,
    showStatsModal,
    setShowStatsModal,
    handlePageChange,
  } = useHomeScreen(topics);

  const pagerRef = useRef<PagerView>(null);

  // Preload next 5 images
  useEffect(() => {
    const next = cards.slice(currentIndex, currentIndex + 5);
    next.forEach((item) => Image.prefetch(item.image));
  }, [currentIndex, cards]);

  // Handle page selection event
  const onPageSelected = (e: any) => {
    const newIndex = e.nativeEvent.position;
    handlePageChange(newIndex);
  };

  return (
    <SafeAreaView style={homeScreenStyles.container}>
      {/* Header */}
      <HeaderBar
        currentIndex={currentIndex}
        totalCards={cards.length}
        streak={streak}
        xp={xp}
        onStatsPress={() => setShowStatsModal(true)}
      />

      {/* Stats Modal */}
      <StatsModal
        visible={showStatsModal}
        streak={streak}
        xp={xp}
        onClose={() => setShowStatsModal(false)}
      />

      {/* News Feed */}
      <View style={homeScreenStyles.feed}>
        {loading ? (
          <SkeletonLoader />
        ) : cards.length === 0 ? (
          <View style={homeScreenStyles.feed}>
            {/* Empty state could be a separate component */}
          </View>
        ) : (
          <PagerView
            ref={pagerRef}
            style={homeScreenStyles.pagerView}
            initialPage={0}
            orientation="vertical"
            onPageSelected={onPageSelected}
          >
            {cards.map((card) => (
              <NewsCard key={card.id} article={card} />
            ))}
          </PagerView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
