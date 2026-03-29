import React, { useRef, useState } from 'react';
import { View, Text, Image, Animated, PanResponder, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DuoButton from '../components/DuoButton';

const mascotHappy = require('../assets/mascot-happy.png');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  source: string;
  category: string;
}

// Mock news data
const mockNewsData: NewsArticle[] = [
  {
    id: '1',
    title: 'Breaking: Major Tech Company Announces Revolutionary AI Product',
    description: 'A groundbreaking development in artificial intelligence promises to change the way we interact with technology.',
    image: 'https://picsum.photos/400/500?random=1',
    source: 'Tech News Daily',
    category: 'Technology',
  },
  {
    id: '2',
    title: 'Climate Summit Reaches Historic Agreement',
    description: 'World leaders unite to commit to ambitious carbon reduction targets in landmark environmental accord.',
    image: 'https://picsum.photos/400/500?random=2',
    source: 'Global Times',
    category: 'Environment',
  },
  {
    id: '3',
    title: 'Stock Markets Hit Record Highs Amid Economic Recovery',
    description: 'Major indices reach all-time peaks as investors show renewed confidence in global economic outlook.',
    image: 'https://picsum.photos/400/500?random=3',
    source: 'Financial Post',
    category: 'Business',
  },
  {
    id: '4',
    title: 'Breakthrough in Medical Research Offers Hope for Patients',
    description: 'Scientists discover promising new treatment approach that could revolutionize healthcare.',
    image: 'https://picsum.photos/400/500?random=4',
    source: 'Health Journal',
    category: 'Health',
  },
  {
    id: '5',
    title: 'Championship Game Delivers Thrilling Overtime Victory',
    description: 'Underdog team stuns favorites with incredible comeback in the final moments of the season.',
    image: 'https://picsum.photos/400/500?random=5',
    source: 'Sports Weekly',
    category: 'Sports',
  },
];

interface HomeScreenProps {
  userInfo?: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ userInfo }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState(mockNewsData);
  const position = useRef(new Animated.ValueXY()).current;
  const swipeDirection = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      swipeDirection.setValue(gesture.dx);
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        // Swipe right - Like
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        // Swipe left - Skip
        forceSwipe('left');
      }
      swipeDirection.setValue(0);
    },
  });

  const forceSwipe = (direction: 'left' | 'right') => {
    const item = cards[currentIndex];

    // Handle the swipe action here (save to liked/skipped)
    console.log(`${direction === 'right' ? 'Liked' : 'Skipped'}: ${item.title}`);

    setCurrentIndex(currentIndex + 1);
  };

  const handleLike = () => {
    forceSwipe('right');
  };

  const handleSkip = () => {
    forceSwipe('left');
  };

  const getCardStyle = (index: number) => {
    return {
      zIndex: 1000 - index,
    };
  };

  const renderCards = () => {
    if (currentIndex >= cards.length) {
      return (
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreCardsText}>🎉 You've seen all the news!</Text>
          <Text style={styles.noMoreCardsSubtext}>Check back later for more updates</Text>
        </View>
      );
    }

    return cards
      .map((card, index) => {
        if (index < currentIndex) return null;
        if (index > currentIndex + 1) return null; // Only show current and next card

        const isTopCard = index === currentIndex;

        return (
          <Animated.View
            key={card.id}
            style={[styles.card, getCardStyle(index)]}
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
                <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">
                  {card.title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2} ellipsizeMode="tail">
                  {card.description}
                </Text>
              </View>
              <View style={styles.cardBottomSection}>
                <Text style={styles.cardSource} numberOfLines={1} ellipsizeMode="tail">
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
                    { width: `${((mockNewsData.length - (cards.length - currentIndex)) / mockNewsData.length) * 100}%` }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {mockNewsData.length - (cards.length - currentIndex)}/{mockNewsData.length}
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

      {currentIndex < cards.length && (
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonWrapper}>
            <DuoButton
              title="SKIP"
              onPress={handleSkip}
              variant="outline"
              size="large"
              fullWidth
            />
          </View>
          <View style={styles.buttonSpacer} />
          <View style={styles.buttonWrapper}>
            <DuoButton
              title="INTERESTED"
              onPress={handleLike}
              variant="primary"
              size="large"
              fullWidth
            />
          </View>
        </View>
      )}
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
    resizeMode: 'contain',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3C3C3C',
    marginBottom: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  headerRight: {
    marginLeft: 12,
  },
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
  streakEmoji: {
    fontSize: 18,
    marginRight: 4,
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 32,
    height: '96%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '60%',
    backgroundColor: '#E5E5E5',
  },
  cardContent: {
    height: '40%',
    padding: 20,
    justifyContent: 'space-between',
  },
  cardTopSection: {
    flex: 1,
    overflow: 'hidden',
  },
  cardBottomSection: {
    paddingTop: 8,
    minHeight: 20,
  },
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3C3C3C',
    marginTop: 12,
    marginBottom: 8,
    lineHeight: 24,
  },
  cardDescription: {
    fontSize: 14,
    color: '#777777',
    lineHeight: 20,
  },
  cardSource: {
    fontSize: 13,
    color: '#ADADAD',
    fontWeight: '600',
  },
  likeLabel: {
    position: 'absolute',
    top: 50,
    left: 30,
    borderWidth: 4,
    borderColor: '#58CC02',
    borderRadius: 8,
    padding: 10,
    transform: [{ rotate: '-20deg' }],
    zIndex: 1000,
  },
  likeLabelText: {
    color: '#58CC02',
    fontSize: 24,
    fontWeight: 'bold',
  },
  nopeLabel: {
    position: 'absolute',
    top: 50,
    right: 30,
    borderWidth: 4,
    borderColor: '#FF4B4B',
    borderRadius: 8,
    padding: 10,
    transform: [{ rotate: '20deg' }],
    zIndex: 1000,
  },
  nopeLabelText: {
    color: '#FF4B4B',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#F7F7F7',
  },
  buttonWrapper: {
    flex: 1,
  },
  buttonSpacer: {
    width: 16,
  },
  noMoreCards: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noMoreCardsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C3C3C',
    textAlign: 'center',
  },
  noMoreCardsSubtext: {
    fontSize: 16,
    color: '#777777',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HomeScreen;
