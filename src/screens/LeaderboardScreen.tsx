import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getUserInfo, getStreak } from '../services/storage';
import { getLeaderboard } from '../services/api';

const mascotHappy = require('../assets/mascot-happy.png');

interface LeaderboardUser {
  rank: number;
  name: string;
  email: string;
  streak: number;
  isCurrentUser?: boolean;
}

// 🔥 ANIMATED SKELETON COMPONENT
const SkeletonLoader = () => {
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
    <View style={styles.skeletonContainer}>
      {/* Skeleton Podium */}
      <View style={styles.podiumContainer}>
        {[90, 120, 70].map((height, i) => (
          <View key={i} style={styles.podiumItem}>
            <Animated.View style={[styles.skeletonAvatar, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.skeletonText, { width: 40, opacity: fadeAnim }]} />
            <Animated.View style={[styles.skeletonPedestal, { height, opacity: fadeAnim }]} />
          </View>
        ))}
      </View>
      
      {/* Skeleton List Items */}
      {[1, 2, 3, 4].map((i) => (
        <Animated.View key={i} style={[styles.skeletonListItem, { opacity: fadeAnim }]}>
          <View style={styles.skeletonText} />
          <View style={styles.skeletonAvatarSmall} />
          <View style={[styles.skeletonText, { flex: 1, height: 20 }]} />
          <View style={[styles.skeletonText, { width: 40 }]} />
        </Animated.View>
      ))}
    </View>
  );
};

const LeaderboardScreen: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);

      const userInfo = await getUserInfo();
      const userStreak = await getStreak();
      const response = await getLeaderboard(10);

      if (response.success && response.leaderboard) {
        const leaderboardData = response.leaderboard;

        if (userInfo?.email) {
          const userRank = leaderboardData.findIndex((u: LeaderboardUser) => u.email === userInfo.email);
          if (userRank !== -1) {
            leaderboardData[userRank].isCurrentUser = true;
            setCurrentUserRank(userRank + 1);
          } else {
            leaderboardData.push({
              rank: leaderboardData.length + 1,
              name: userInfo.name || 'You',
              streak: userStreak,
              isCurrentUser: true,
            });
            setCurrentUserRank(leaderboardData.length);
          }
        }
        setLeaderboard(leaderboardData);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFC800'; // Duolingo Gold
      case 2: return '#CECECE'; // Duolingo Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#E5E5E5';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Image source={mascotHappy} style={styles.logoImage} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Leaderboard</Text>
            <Text style={styles.headerSubtitle}>Top news readers</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <SkeletonLoader />
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Trophy Section */}
          <View style={styles.trophySection}>
            <View style={styles.trophyTitleContainer}>
              <Icon name="trophy" size={28} color="#FFC800" />
              <Text style={styles.trophyTitle}>Hall of Fame</Text>
              <Icon name="trophy" size={28} color="#FFC800" />
            </View>
            <Text style={styles.trophySubtitle}>Keep your streak alive to climb the ranks!</Text>
          </View>

          {/* Podium for Top 3 */}
          {leaderboard.length >= 3 && (
            <View style={styles.podiumContainer}>
              {/* 2nd Place */}
              <View style={styles.podiumItem}>
                <View style={[styles.podiumAvatar, { backgroundColor: getRankColor(2) }]}>
                  <Text style={styles.podiumAvatarText}>{leaderboard[1].name.charAt(0)}</Text>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>{leaderboard[1].name.split(' ')[0]}</Text>
                <View style={[styles.podiumPedestal, styles.podiumSecond]}>
                  <Icon name="medal" size={28} color="#FFFFFF" style={styles.podiumIcon} />
                  <View style={styles.podiumStreakContainer}>
                    <Text style={styles.podiumStreak}>{leaderboard[1].streak}</Text>
                    <Icon name="fire" size={16} color="#FFFFFF" />
                  </View>
                </View>
              </View>

              {/* 1st Place */}
              <View style={[styles.podiumItem, styles.podiumItemFirst]}>
                <View style={[styles.podiumAvatar, styles.podiumAvatarFirst, { backgroundColor: getRankColor(1) }]}>
                  <Text style={styles.podiumAvatarTextFirst}>{leaderboard[0].name.charAt(0)}</Text>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>{leaderboard[0].name.split(' ')[0]}</Text>
                <View style={[styles.podiumPedestal, styles.podiumFirst]}>
                  <Icon name="crown" size={32} color="#FFFFFF" style={styles.podiumIcon} />
                  <View style={styles.podiumStreakContainer}>
                    <Text style={styles.podiumStreak}>{leaderboard[0].streak}</Text>
                    <Icon name="fire" size={18} color="#FFFFFF" />
                  </View>
                </View>
              </View>

              {/* 3rd Place */}
              <View style={styles.podiumItem}>
                <View style={[styles.podiumAvatar, { backgroundColor: getRankColor(3) }]}>
                  <Text style={styles.podiumAvatarText}>{leaderboard[2].name.charAt(0)}</Text>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>{leaderboard[2].name.split(' ')[0]}</Text>
                <View style={[styles.podiumPedestal, styles.podiumThird]}>
                  <Icon name="medal" size={24} color="#FFFFFF" style={styles.podiumIcon} />
                  <View style={styles.podiumStreakContainer}>
                    <Text style={styles.podiumStreak}>{leaderboard[2].streak}</Text>
                    <Icon name="fire" size={16} color="#FFFFFF" />
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Rest of Leaderboard */}
          <View style={styles.leaderboardList}>
            {leaderboard.slice(3).map((user) => (
              <View
                key={user.email}
                style={[
                  styles.leaderboardItem,
                  user.isCurrentUser && styles.leaderboardItemHighlight,
                ]}
              >
                <View style={styles.leaderboardRank}>
                  <Icon name="medal-outline" size={20} color="#AFAFAF" />
                  <Text style={styles.leaderboardRankNumber}>{user.rank}</Text>
                </View>

                <View style={styles.leaderboardAvatar}>
                  <Text style={styles.leaderboardAvatarText}>{user.name.charAt(0)}</Text>
                </View>

                <View style={styles.leaderboardInfo}>
                  <Text style={styles.leaderboardName}>
                    {user.isCurrentUser ? 'You' : user.name}
                  </Text>
                </View>

                <View style={styles.leaderboardStreak}>
                  <Text style={styles.leaderboardStreakNumber}>{user.streak}</Text>
                  <Icon name="fire" size={20} color="#FF9600" />
                </View>
              </View>
            ))}
          </View>

          {/* Motivational Message */}
          <View style={styles.motivationBox}>
            <Icon name="book-open-page-variant" size={24} color="#58CC02" />
            <Text style={styles.motivationText}>
              Keep reading daily to climb the ranks!
            </Text>
            <Icon name="star-face" size={24} color="#FFC800" />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default LeaderboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Clean white background
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
    zIndex: 10,
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
    borderWidth: 2,
    borderColor: '#FF9600',
    borderBottomWidth: 4, // 3D effect
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  logoImage: {
    width: 44,
    height: 44,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#4B4B4B',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#AFB2B6',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  trophySection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  trophyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  trophyTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#4B4B4B',
  },
  trophySubtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#AFB2B6',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 8,
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
  },
  podiumItemFirst: {
    zIndex: 2,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 4, // 3D effect
  },
  podiumAvatarFirst: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderColor: '#E5E5E5',
    borderBottomWidth: 5,
  },
  podiumAvatarText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  podiumAvatarTextFirst: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  podiumName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B4B4B',
    marginBottom: 8,
  },
  podiumPedestal: {
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 0,
  },
  podiumFirst: {
    height: 140,
    backgroundColor: '#FFC800',
  },
  podiumSecond: {
    height: 100,
    backgroundColor: '#2CB3FF', // Duolingo blue for nice contrast, or silver #CECECE
  },
  podiumThird: {
    height: 80,
    backgroundColor: '#FF9600', // Bronze/Orange
  },
  podiumIcon: {
    marginBottom: 4,
  },
  podiumStreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  podiumStreak: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  leaderboardList: {
    paddingHorizontal: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 4, // 3D button style
  },
  leaderboardItemHighlight: {
    backgroundColor: '#FFF4E6',
    borderColor: '#FF9600',
    borderBottomWidth: 4,
  },
  leaderboardRank: {
    alignItems: 'center',
    marginRight: 12,
    minWidth: 40,
  },
  leaderboardRankNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: '#AFB2B6',
    marginTop: 2,
  },
  leaderboardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#58CC02',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  leaderboardAvatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#4B4B4B',
  },
  leaderboardStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  leaderboardStreakNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF9600',
    marginRight: 4,
  },
  motivationBox: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#4B4B4B',
    textAlign: 'center',
    flex: 1,
  },

  // Skeleton Styles
  skeletonContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 24,
  },
  skeletonAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E5E5',
    marginBottom: 8,
  },
  skeletonAvatarSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E5E5',
    marginRight: 16,
  },
  skeletonText: {
    height: 16,
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    marginBottom: 8,
    width: 20,
  },
  skeletonPedestal: {
    width: '100%',
    backgroundColor: '#E5E5E5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  skeletonListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 4,
  },
});