/**
 * SkeletonLoader Component
 * Displays animated loading placeholder for news cards
 */
import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { skeletonStyles, newsCardStyles } from '../../styles/homeScreen.styles';

const SkeletonLoader: React.FC = () => {
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
    <View style={skeletonStyles.skeletonCard}>
      <Animated.View
        style={[skeletonStyles.skeletonBackground, { opacity: fadeAnim }]}
      />
      <View style={skeletonStyles.skeletonContent}>
        <Animated.View
          style={[
            skeletonStyles.skeletonLine,
            {
              width: 80,
              height: 16,
              backgroundColor: '#58CC02',
              marginBottom: 12,
              opacity: fadeAnim,
            },
          ]}
        />
        <Animated.View
          style={[
            skeletonStyles.skeletonLine,
            { width: '90%', height: 28, opacity: fadeAnim },
          ]}
        />
        <Animated.View
          style={[
            skeletonStyles.skeletonLine,
            { width: '70%', height: 28, marginBottom: 16, opacity: fadeAnim },
          ]}
        />
        <Animated.View
          style={[
            skeletonStyles.skeletonLine,
            { width: '100%', height: 14, opacity: fadeAnim },
          ]}
        />
        <Animated.View
          style={[
            skeletonStyles.skeletonLine,
            { width: '100%', height: 14, opacity: fadeAnim },
          ]}
        />
        <Animated.View
          style={[
            skeletonStyles.skeletonLine,
            { width: '80%', height: 14, marginBottom: 16, opacity: fadeAnim },
          ]}
        />
        <Animated.View
          style={[
            skeletonStyles.skeletonLine,
            { width: 100, height: 12, opacity: fadeAnim },
          ]}
        />
      </View>
    </View>
  );
};

export default SkeletonLoader;
