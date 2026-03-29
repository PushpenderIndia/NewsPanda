/**
 * NewsCard Component
 * Displays a single news article card with image, title, description
 */
import React from 'react';
import { View, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RenderHTML from 'react-native-render-html';
import { NewsArticle } from '../../types/news.types';
import { newsCardStyles, SCREEN_WIDTH } from '../../styles/homeScreen.styles';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  return (
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
    </View>
  );
};

export default NewsCard;
