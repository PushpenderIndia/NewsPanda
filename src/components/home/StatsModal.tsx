/**
 * StatsModal Component
 * Modal displaying user stats (streak and XP)
 */
import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { modalStyles } from '../../styles/homeScreen.styles';

interface StatsModalProps {
  visible: boolean;
  streak: number;
  xp: number;
  onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({
  visible,
  streak,
  xp,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={modalStyles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={modalStyles.modalContent}>
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>Your Stats</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#3C3C3C" />
            </TouchableOpacity>
          </View>

          <View style={modalStyles.statsDetailContainer}>
            {/* Streak Card */}
            <View style={modalStyles.statsDetailCard}>
              <View style={modalStyles.statsDetailIconContainer}>
                <Icon name="fire" size={32} color="#FF6B35" />
              </View>
              <View style={modalStyles.statsDetailInfo}>
                <Text style={modalStyles.statsDetailLabel}>Daily Streak</Text>
                <Text style={modalStyles.statsDetailValue}>{streak} days</Text>
                <Text style={modalStyles.statsDetailDescription}>
                  Keep reading daily to maintain your streak!
                </Text>
              </View>
            </View>

            {/* XP Card */}
            <View style={modalStyles.statsDetailCard}>
              <View style={modalStyles.statsDetailIconContainer}>
                <Icon name="star" size={32} color="#FFC107" />
              </View>
              <View style={modalStyles.statsDetailInfo}>
                <Text style={modalStyles.statsDetailLabel}>
                  Experience Points
                </Text>
                <Text style={modalStyles.statsDetailValue}>{xp} XP</Text>
                <Text style={modalStyles.statsDetailDescription}>
                  Earn 1 XP for every 10 news articles you swipe!
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default StatsModal;
