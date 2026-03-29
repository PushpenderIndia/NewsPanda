import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type TabType = 'home' | 'podcast' | 'settings';

interface BottomTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'home' && styles.activeTab]}
        onPress={() => onTabChange('home')}
      >
        <Icon
          name={activeTab === 'home' ? 'home' : 'home-outline'}
          size={26}
          color={activeTab === 'home' ? '#58CC02' : '#777777'}
        />
        <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'podcast' && styles.activeTab]}
        onPress={() => onTabChange('podcast')}
      >
        <Icon
          name={activeTab === 'podcast' ? 'microphone' : 'microphone-outline'}
          size={26}
          color={activeTab === 'podcast' ? '#58CC02' : '#777777'}
        />
        <Text style={[styles.tabText, activeTab === 'podcast' && styles.activeTabText]}>
          Podcast
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
        onPress={() => onTabChange('settings')}
      >
        <Icon
          name={activeTab === 'settings' ? 'cog' : 'cog-outline'}
          size={26}
          color={activeTab === 'settings' ? '#58CC02' : '#777777'}
        />
        <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#E5E5E5',
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#F0FDE4',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777777',
    marginTop: 4,
  },
  activeTabText: {
    color: '#58CC02',
    fontWeight: 'bold',
  },
});

export default BottomTabBar;
