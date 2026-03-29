import React, { useRef, useState } from 'react';
import { View, Text, Image, Animated, PanResponder, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DuoButton from '../components/DuoButton';

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
      position.setValue({ x: gesture.dx, y: gesture.dy });
      swipeDirection.setValue(gesture.dx);
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        // Swipe right - Like
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        // Swipe left - Skip
        forceSwipe('left');
      } else {
        // Reset position
        resetPosition();
      }
    },
  });

  const forceSwipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'left' | 'right') => {
    const item = cards[currentIndex];

    // Handle the swipe action here (save to liked/skipped)
    console.log(`${direction === 'right' ? 'Liked' : 'Skipped'}: ${item.title}`);

    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(currentIndex + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const handleLike = () => {
    forceSwipe('right');
  };

  const handleSkip = () => {
    forceSwipe('left');
  };

  const getCardStyle = (index: number) => {
    if (index === currentIndex) {
      const rotate = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        outputRange: ['-30deg', '0deg', '30deg'],
      });

      const opacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        outputRange: [0.5, 1, 0.5],
      });

      return {
        ...position.getLayout(),
        transform: [{ rotate }],
        opacity,
      };
    }

    // Cards behind the current one
    const scale = 1 - (index - currentIndex) * 0.05;
    const translateY = (index - currentIndex) * 10;

    return {
      transform: [{ scale }, { translateY }],
      opacity: 1 - (index - currentIndex) * 0.2,
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
        if (index > currentIndex + 2) return null;

        const isTopCard = index === currentIndex;

        return (
          <Animated.View
            key={card.id}
            style={[styles.card, getCardStyle(index)]}
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
              <View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{card.category}</Text>
                </View>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {card.description}
                </Text>
                <Text style={styles.cardSource}>{card.source}</Text>
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
        <Text style={styles.headerTitle}>NewsPanda</Text>
        <Text style={styles.headerSubtitle}>
          {cards.length - currentIndex} articles remaining
        </Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
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
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT * 0.6,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '55%',
    backgroundColor: '#E5E5E5',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  categoryBadge: {
    backgroundColor: '#58CC02',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3C3C3C',
    marginTop: 12,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#777777',
    lineHeight: 20,
    marginBottom: 8,
  },
  cardSource: {
    fontSize: 12,
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
