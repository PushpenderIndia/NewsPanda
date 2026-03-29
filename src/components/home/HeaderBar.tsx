/**
 * HeaderBar Component
 * Top navigation bar with logo, progress, and stats
 */
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { headerStyles } from '../../styles/homeScreen.styles';

const mascotHappy = require('../../assets/mascot-happy.png');

interface HeaderBarProps {
  currentIndex: number;
  totalCards: number;
  streak: number;
  xp: number;
  onStatsPress: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  currentIndex,
  totalCards,
  streak,
  xp,
  onStatsPress,
}) => {
  return (
    <View style={headerStyles.header}>
      <View style={headerStyles.headerLeft}>
        <View style={headerStyles.logoContainer}>
          <Image source={mascotHappy} style={headerStyles.logoImage} />
        </View>

        <View style={headerStyles.headerTextContainer}>
          <Text style={headerStyles.headerTitle}>NewsPanda</Text>

          <View style={headerStyles.progressContainer}>
            <View style={headerStyles.progressBar}>
              <View
                style={[
                  headerStyles.progressFill,
                  {
                    width: `${(currentIndex / (totalCards || 1)) * 100}%`,
                  },
                ]}
              />
            </View>

            <Text style={headerStyles.progressText}>
              {currentIndex}/{totalCards}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={headerStyles.statsButton}
        onPress={onStatsPress}
        activeOpacity={0.8}
      >
        <View style={headerStyles.statsCard}>
          <View style={headerStyles.statItem}>
            <Icon name="fire" size={20} color="#FF6B35" />
            <Text style={headerStyles.statValue}>{streak}</Text>
          </View>
          <View style={headerStyles.statDivider} />
          <View style={headerStyles.statItem}>
            <Icon name="star" size={20} color="#FFC107" />
            <Text style={headerStyles.statValue}>{xp}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderBar;
