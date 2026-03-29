import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const mascotHappy = require('../assets/mascot-happy.png');

// Mock "danger zones" (later from news + AI)
const dangerZones = [
  {
    id: '1',
    title: 'Heavy Traffic',
    description: 'Severe congestion reported',
    latitude: 12.9716,
    longitude: 77.5946,
    type: 'traffic',
  },
  {
    id: '2',
    title: 'Road Damage',
    description: 'Broken road reported',
    latitude: 12.9352,
    longitude: 77.6245,
    type: 'road',
  },
  {
    id: '3',
    title: 'Protest Area',
    description: 'Public protest ongoing',
    latitude: 12.9784,
    longitude: 77.6408,
    type: 'protest',
  },
];

const getColor = (type: string) => {
  switch (type) {
    case 'traffic':
      return '#FF9500';
    case 'road':
      return '#FF4B4B';
    case 'protest':
      return '#8E44AD';
    default:
      return '#58CC02';
  }
};

const MapScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header (same vibe as HomeScreen) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Image source={mascotHappy} style={styles.logoImage} />
          </View>
          <Text style={styles.headerTitle}>NewsPanda Map</Text>
        </View>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 12.9716,
          longitude: 77.5946,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {dangerZones.map((zone) => (
          <React.Fragment key={zone.id}>
            <Marker
              coordinate={{
                latitude: zone.latitude,
                longitude: zone.longitude,
              }}
              title={zone.title}
              description={zone.description}
              pinColor={getColor(zone.type)}
            />

            {/* Radius highlight */}
            <Circle
              center={{
                latitude: zone.latitude,
                longitude: zone.longitude,
              }}
              radius={500}
              strokeColor={getColor(zone.type)}
              fillColor={getColor(zone.type) + '33'}
            />
          </React.Fragment>
        ))}
      </MapView>
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF4E6',
    borderWidth: 2,
    borderColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  logoImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3C3C3C',
  },

  map: {
    flex: 1,
  },
});