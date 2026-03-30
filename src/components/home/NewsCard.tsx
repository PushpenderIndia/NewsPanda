/**
 * NewsCard Component
 * Displays a single news article card with image, title, description
 * Includes like, share, bookmark functionality and double-tap to like
 */
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import RenderHTML from 'react-native-render-html';
import Icon from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import LottieView from 'lottie-react-native';
import { NewsArticle } from '../../types/news.types';
import { newsCardStyles, SCREEN_WIDTH } from '../../styles/homeScreen.styles';
import { getUserInfo } from '../../services/storage';
import { likeArticle, unlikeArticle, bookmarkArticle, removeBookmark, trackShare } from '../../services/api';
import animations from '../../assets/animations';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const lottieRef = useRef<LottieView>(null);
  const doubleTapRef = useRef<TapGestureHandler>(null);

  // Handle double-tap event
  const onDoubleTap = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const { x, y } = event.nativeEvent;
      console.log('Double tap detected at:', x, y);

      // Set animation position
      const posX = x - 75;
      const posY = y - 75;
      setTapPosition({ x: posX, y: posY });

      // Show animation
      setShowHeartAnimation(true);

      // Trigger like if not already liked
      if (!isLiked) {
        handleLike();
      }

      // Hide animation after 1 second
      setTimeout(() => {
        setShowHeartAnimation(false);
      }, 1000);
    }
  };

  // Auto-play Lottie animation when it becomes visible
  useEffect(() => {
    if (showHeartAnimation) {
      lottieRef.current?.reset();
      lottieRef.current?.play();
    }
  }, [showHeartAnimation]);

  const handleLike = async () => {
    try {
      const userInfo = await getUserInfo();
      if (!userInfo?.email) {
        Alert.alert('Error', 'Please login to like articles');
        return;
      }

      // Optimistic update - update UI immediately
      const previousState = isLiked;
      setIsLiked(!isLiked);

      try {
        // Make API call in background
        if (previousState) {
          await unlikeArticle(userInfo.email, article.link);
        } else {
          await likeArticle({
            email: userInfo.email,
            news_link: article.link,
            news_provider: article.source,
            news_category: article.category,
          });
        }
      } catch (apiError) {
        // Revert on failure
        console.error('Error handling like:', apiError);
        setIsLiked(previousState);
        Alert.alert('Error', 'Failed to update like. Please try again.');
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      const userInfo = await getUserInfo();
      if (!userInfo?.email) {
        Alert.alert('Error', 'Please login to bookmark articles');
        return;
      }

      // Optimistic update - update UI immediately
      const previousState = isBookmarked;
      setIsBookmarked(!isBookmarked);

      try {
        // Make API call in background
        if (previousState) {
          await removeBookmark(userInfo.email, article.link);
        } else {
          await bookmarkArticle({
            email: userInfo.email,
            news_link: article.link,
            news_provider: article.source,
            news_category: article.category,
          });
        }
      } catch (apiError) {
        // Revert on failure
        console.error('Error handling bookmark:', apiError);
        setIsBookmarked(previousState);
        Alert.alert('Error', 'Failed to update bookmark. Please try again.');
      }
    } catch (error) {
      console.error('Error handling bookmark:', error);
    }
  };

  const handleShare = async () => {
    try {
      const userInfo = await getUserInfo();

      const shareOptions = {
        title: article.title,
        message: `${article.title}\n\nRead more at: ${article.link}`,
        url: article.link,
      };

      const result = await Share.open(shareOptions);

      // Track share if user shared successfully
      if (userInfo?.email && result) {
        await trackShare({
          email: userInfo.email,
          news_link: article.link,
          news_provider: article.source,
          news_category: article.category,
          share_platform: result.app || 'unknown',
        });
      }
    } catch (error: any) {
      // User cancelled share, do nothing
      if (error.message !== 'User did not share') {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <TapGestureHandler
      ref={doubleTapRef}
      onHandlerStateChange={onDoubleTap}
      numberOfTaps={2}
    >
      <View style={newsCardStyles.card}>
        <Image source={{ uri: article.image }} style={newsCardStyles.image} />

        {/* Overlay & Gradient */}
        <View style={newsCardStyles.overlay} />
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
          style={newsCardStyles.gradientOverlay}
        />

        {/* Double-tap heart animation at tap position */}
        <View
          style={[
            newsCardStyles.doubleTapHeart,
            {
              left: tapPosition.x,
              top: tapPosition.y,
              opacity: showHeartAnimation ? 1 : 0,
            },
          ]}
          pointerEvents="none"
        >
          <LottieView
            ref={lottieRef}
            source={animations.heart}
            autoPlay={false}
            loop={false}
            cacheComposition={true}
            hardwareAccelerationAndroid={true}
            renderMode="HARDWARE"
            style={{ width: 150, height: 150 }}
          />
        </View>

        {/* Action buttons */}
        <View style={newsCardStyles.actionButtons}>
          <TouchableOpacity onPress={handleLike} style={newsCardStyles.actionButton}>
            <Icon
              name={isLiked ? "heart" : "heart-outline"}
              size={32}
              color={isLiked ? "#FF0050" : "#FFF"}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare} style={newsCardStyles.actionButton}>
            <Icon name="share-outline" size={32} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBookmark} style={newsCardStyles.actionButton}>
            <Icon
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={32}
              color="#FFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowMenu(true)}
            style={newsCardStyles.actionButton}
          >
            <Icon name="ellipsis-vertical" size={32} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={newsCardStyles.content}>
          <Text style={newsCardStyles.category}>{article.category}</Text>
          <Text style={newsCardStyles.title}>{article.title}</Text>
          <RenderHTML
            contentWidth={SCREEN_WIDTH - 40}
            source={{ html: article.description }}
            tagsStyles={{
              a: { color: '#58CC02' },
              font: { color: '#ddd' },
              p: { color: '#ddd', fontSize: 14 },
            }}
          />
          <Text style={newsCardStyles.source}>{article.source}</Text>
        </View>

        {/* Three-dot menu modal */}
        <Modal
          visible={showMenu}
          transparent
          animationType="fade"
          onRequestClose={() => setShowMenu(false)}
        >
          <TouchableOpacity
            style={newsCardStyles.menuOverlay}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          >
            <View style={newsCardStyles.menuContainer}>
              <TouchableOpacity
                style={newsCardStyles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  Alert.alert('Report', 'Report this article?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Report', onPress: () => console.log('Reported') }
                  ]);
                }}
              >
                <Icon name="flag-outline" size={24} color="#333" />
                <Text style={newsCardStyles.menuItemText}>Report</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={newsCardStyles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  Alert.alert('Not Interested', 'You will see fewer articles like this');
                }}
              >
                <Icon name="eye-off-outline" size={24} color="#333" />
                <Text style={newsCardStyles.menuItemText}>Not Interested</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={newsCardStyles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  handleShare();
                }}
              >
                <Icon name="share-social-outline" size={24} color="#333" />
                <Text style={newsCardStyles.menuItemText}>Share via...</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[newsCardStyles.menuItem, newsCardStyles.menuItemLast]}
                onPress={() => setShowMenu(false)}
              >
                <Icon name="close-outline" size={24} color="#333" />
                <Text style={newsCardStyles.menuItemText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </TapGestureHandler>
  );
};

export default NewsCard;
