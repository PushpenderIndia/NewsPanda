import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import DuoButton from '../components/DuoButton';

interface TopicsScreenProps {
  onContinue: (topics: string[]) => void;
  isSettingsMode?: boolean;
}

const TOPICS = [
  { id: '1', name: 'Tech', animation: require('../assets/animations/tech.json'), color: '#58CC02' },
  { id: '2', name: 'Startups', animation: require('../assets/animations/startups.json'), color: '#FF9600' },
  { id: '3', name: 'Finance', animation: require('../assets/animations/finance.json'), color: '#1CB0F6' },
  { id: '4', name: 'Politics', animation: require('../assets/animations/politics.json'), color: '#CE82FF' },
  { id: '5', name: 'Sports', animation: require('../assets/animations/sports.json'), color: '#FF4B4B' },
  { id: '6', name: 'AI', animation: require('../assets/animations/ai.json'), color: '#FFD900' },
  { id: '7', name: 'Crypto', animation: require('../assets/animations/crypto.json'), color: '#00CD9C' },
  { id: '8', name: 'World News', animation: require('../assets/animations/world-news.json'), color: '#FF6E83' },
  { id: '9', name: 'Entertainment', animation: require('../assets/animations/entertainment.json'), color: '#8E44AD' },
];

const TopicsScreen: React.FC<TopicsScreenProps> = ({ onContinue, isSettingsMode = false }) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const selectAll = () => {
    setSelectedTopics(TOPICS.map(topic => topic.id));
  };

  const deselectAll = () => {
    setSelectedTopics([]);
  };

  return (
    <View className="flex-1 bg-blue-50">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 120 }}>
        {/* Header with Mascot and Speech Bubble */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 32 }}>
          {/* Large Panda Avatar with Orange Border */}
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 4,
            borderColor: '#FB923C',
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}>
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              borderWidth: 2,
              borderColor: '#FED7AA',
              overflow: 'hidden',
            }}>
              <Image
                source={require('../assets/mascot-happy.png')}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Speech Bubble */}
          <View style={{ position: 'relative', marginLeft: 12, marginBottom: 24 }}>
            <View style={{
              backgroundColor: 'white',
              borderWidth: 2,
              borderColor: '#E5E7EB',
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151' }}>
                Let's get started
              </Text>
            </View>
            {/* Speech bubble tail */}
            <View style={{
              position: 'absolute',
              left: -8,
              bottom: 8,
              width: 0,
              height: 0,
              borderTopWidth: 8,
              borderTopColor: 'transparent',
              borderRightWidth: 10,
              borderRightColor: 'white',
              borderBottomWidth: 8,
              borderBottomColor: 'transparent',
            }} />
            <View style={{
              position: 'absolute',
              left: -10,
              bottom: 8,
              width: 0,
              height: 0,
              borderTopWidth: 8,
              borderTopColor: 'transparent',
              borderRightWidth: 10,
              borderRightColor: '#E5E7EB',
              borderBottomWidth: 8,
              borderBottomColor: 'transparent',
            }} />
          </View>
        </View>

        {/* Title and Subtitle */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#1F2937', marginBottom: 8, letterSpacing: -0.5 }}>
            What are you into?
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '500', color: '#6B7280' }}>
            Pick a few topics you like
          </Text>
        </View>

        {/* Select/Deselect All Buttons */}
        <View className="flex-row mb-6" style={{ gap: 12 }}>
          <View className="flex-1">
            <DuoButton
              title="Select All"
              onPress={selectAll}
              variant="success"
              size="small"
              fullWidth
            />
          </View>
          <View className="flex-1">
            <DuoButton
              title="Deselect All"
              onPress={deselectAll}
              variant="danger"
              size="small"
              fullWidth
            />
          </View>
        </View>

        {/* Topics Grid */}
        <View className="flex-row flex-wrap" style={{ gap: 16, justifyContent: 'space-between' }}>
          {TOPICS.map((topic) => {
            const isSelected = selectedTopics.includes(topic.id);
            return (
              <TouchableOpacity
                key={topic.id}
                onPress={() => toggleTopic(topic.id)}
                style={{
                  width: '47%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  paddingVertical: 24,
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2.5,
                  borderColor: isSelected ? topic.color : '#E5E5E5',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.03,
                  shadowRadius: 4,
                  elevation: 1,
                  minHeight: 140,
                }}
                activeOpacity={0.7}
              >
                {/* Large Icon - No background circle */}
                <View style={{
                  marginBottom: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <LottieView
                    source={topic.animation}
                    autoPlay
                    loop
                    style={{ width: 80, height: 80 }}
                  />
                </View>

                {/* Topic Name */}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#1F1F1F',
                    textAlign: 'center',
                  }}
                >
                  {topic.name}
                </Text>

                {/* Checkmark Badge */}
                {isSelected && (
                  <View style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: topic.color,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Fixed Bottom Button - Only show if not in settings mode */}
      {!isSettingsMode && (
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 32,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        }}>
          <DuoButton
            title={`CONTINUE${selectedTopics.length > 0 ? ` (${selectedTopics.length})` : ''}`}
            onPress={() => onContinue(selectedTopics)}
            disabled={selectedTopics.length === 0}
            variant="primary"
            fullWidth
          />
        </View>
      )}
    </View>
  );
};

export default TopicsScreen;
