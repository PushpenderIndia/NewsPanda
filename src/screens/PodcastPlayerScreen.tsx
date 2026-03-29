import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';

const podcastAnimation = require('../assets/animations/podcast.json');

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PodcastPlayerScreenProps {
  podcastTitle: string;
  podcastCategory: string;
  onClose: () => void;
}

// Enable playback in silence mode
Sound.setCategory('Playback');

const PodcastPlayerScreen: React.FC<PodcastPlayerScreenProps> = ({
  podcastTitle,
  podcastCategory,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Sound | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load the audio file
    const sound = new Sound('tech_podcast.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      // Set duration
      setDuration(sound.getDuration());
      soundRef.current = sound;
    });

    return () => {
      // Cleanup on unmount
      if (soundRef.current) {
        soundRef.current.release();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      // Update progress every 100ms
      intervalRef.current = setInterval(() => {
        if (soundRef.current) {
          soundRef.current.getCurrentTime((seconds) => {
            setCurrentTime(seconds);

            // Stop at end
            if (seconds >= duration && duration > 0) {
              setIsPlaying(false);
              setCurrentTime(0);
              soundRef.current?.setCurrentTime(0);
            }
          });
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration]);

  const togglePlayPause = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    } else {
      soundRef.current.play((success) => {
        if (success) {
          setIsPlaying(false);
          setCurrentTime(0);
        }
      });
      setIsPlaying(true);
    }
  };

  const handleSliderChange = (value: number) => {
    if (!soundRef.current) return;
    soundRef.current.setCurrentTime(value);
    setCurrentTime(value);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      {/* Podcast Animation */}
      <View style={styles.animationContainer}>
        <LottieView
          source={podcastAnimation}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>

      {/* Podcast Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.category}>{podcastCategory}</Text>
        <Text style={styles.title}>{podcastTitle}</Text>
      </View>

      {/* Audio Progress Slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration || 1}
          value={currentTime}
          onSlidingComplete={handleSliderChange}
          minimumTrackTintColor="#58CC02"
          maximumTrackTintColor="#E5E5E5"
          thumbTintColor="#58CC02"
        />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      {/* Play/Pause Button - Duolingo Style */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={togglePlayPause}
          activeOpacity={0.8}
        >
          <View style={styles.playButtonInner}>
            {isPlaying ? (
              <View style={styles.pauseIcon}>
                <View style={styles.pauseBar} />
                <View style={styles.pauseBar} />
              </View>
            ) : (
              <View style={styles.playIcon} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#3C3C3C',
    fontWeight: 'bold',
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  animation: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  category: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#58CC02',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3C3C3C',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 12,
    color: '#777777',
    fontWeight: '600',
    minWidth: 40,
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  playButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#58CC02',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  playButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Play Icon - Triangle
  playIcon: {
    width: 0,
    height: 0,
    marginLeft: 6,
    borderLeftWidth: 28,
    borderLeftColor: '#FFFFFF',
    borderTopWidth: 18,
    borderTopColor: 'transparent',
    borderBottomWidth: 18,
    borderBottomColor: 'transparent',
  },
  // Pause Icon - Two Bars
  pauseIcon: {
    flexDirection: 'row',
    gap: 8,
  },
  pauseBar: {
    width: 8,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
});

export default PodcastPlayerScreen;
