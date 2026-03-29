import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

      // Get current user info
      const userInfo = await getUserInfo();
      const userStreak = await getStreak();

      // Fetch leaderboard from backend
      const response = await getLeaderboard(10);

      if (response.success && response.leaderboard) {
        const leaderboardData = response.leaderboard;

        // Mark current user
        if (userInfo?.email) {
          const userRank = leaderboardData.findIndex(u => u.email === userInfo.email);
          if (userRank !== -1) {
            leaderboardData[userRank].isCurrentUser = true;
            setCurrentUserRank(userRank + 1);
          } else {
            // User not in top 10, add them at the end
            leaderboardData.push({
              rank: leaderboardData.length + 1,
              name: userInfo.name || 'You',
              email: userInfo.email,
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

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '🏅';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return '#E5E5E5';
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#58CC02" />
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Trophy Section */}
        <View style={styles.trophySection}>
          <Text style={styles.trophyTitle}>🏆 Hall of Fame 🏆</Text>
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
                <Text style={styles.podiumRank}>🥈</Text>
                <Text style={styles.podiumStreak}>{leaderboard[1].streak}🔥</Text>
              </View>
            </View>

            {/* 1st Place */}
            <View style={styles.podiumItem}>
              <View style={[styles.podiumAvatar, styles.podiumAvatarFirst, { backgroundColor: getRankColor(1) }]}>
                <Text style={styles.podiumAvatarTextFirst}>{leaderboard[0].name.charAt(0)}</Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{leaderboard[0].name.split(' ')[0]}</Text>
              <View style={[styles.podiumPedestal, styles.podiumFirst]}>
                <Text style={styles.podiumRank}>🥇</Text>
                <Text style={styles.podiumStreak}>{leaderboard[0].streak}🔥</Text>
              </View>
            </View>

            {/* 3rd Place */}
            <View style={styles.podiumItem}>
              <View style={[styles.podiumAvatar, { backgroundColor: getRankColor(3) }]}>
                <Text style={styles.podiumAvatarText}>{leaderboard[2].name.charAt(0)}</Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{leaderboard[2].name.split(' ')[0]}</Text>
              <View style={[styles.podiumPedestal, styles.podiumThird]}>
                <Text style={styles.podiumRank}>🥉</Text>
                <Text style={styles.podiumStreak}>{leaderboard[2].streak}🔥</Text>
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
                <Text style={styles.leaderboardRankText}>{getRankEmoji(user.rank)}</Text>
                <Text style={styles.leaderboardRankNumber}>#{user.rank}</Text>
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
                <Text style={styles.leaderboardStreakIcon}>🔥</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Motivational Message */}
        <View style={styles.motivationBox}>
          <Text style={styles.motivationText}>
            📚 Keep reading daily to climb the ranks! 📚
          </Text>
        </View>
      </ScrollView>
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
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3C3C3C',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#777777',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  trophySection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  trophyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C3C3C',
    marginBottom: 8,
  },
  trophySubtitle: {
    fontSize: 14,
    color: '#777777',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 8,
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  podiumAvatarFirst: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
  },
  podiumAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  podiumAvatarTextFirst: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  podiumName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3C3C3C',
    marginBottom: 4,
  },
  podiumPedestal: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  podiumFirst: {
    height: 120,
    backgroundColor: '#FFD700',
  },
  podiumSecond: {
    height: 90,
    backgroundColor: '#C0C0C0',
  },
  podiumThird: {
    height: 70,
    backgroundColor: '#CD7F32',
  },
  podiumRank: {
    fontSize: 28,
    marginBottom: 4,
  },
  podiumStreak: {
    fontSize: 18,
    fontWeight: 'bold',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leaderboardItemHighlight: {
    backgroundColor: '#FFF4E6',
    borderWidth: 2,
    borderColor: '#FF9500',
  },
  leaderboardRank: {
    alignItems: 'center',
    marginRight: 12,
    minWidth: 50,
  },
  leaderboardRankText: {
    fontSize: 20,
  },
  leaderboardRankNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#777777',
    marginTop: 2,
  },
  leaderboardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#58CC02',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  leaderboardAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3C3C3C',
  },
  leaderboardStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF9500',
  },
  leaderboardStreakNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9500',
    marginRight: 4,
  },
  leaderboardStreakIcon: {
    fontSize: 18,
  },
  motivationBox: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#58CC02',
  },
  motivationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#777777',
    fontWeight: '600',
  },
});

export default LeaderboardScreen;
