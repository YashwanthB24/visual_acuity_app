import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import { useRouter } from 'expo-router';

export default function EyeExerciseVideos() {
  const router = useRouter();

  // Array of videos with titles
  const videos = [
    {
      id: 1,
      title: 'Palming Exercise',
      source: require('@/assets/videos/video1.mp4'),
    },
    {
      id: 2,
      title: 'Blinking Game',
      source: require('@/assets/videos/video2.mp4'),
    },
    {
      id: 3,
      title: 'Focus Shifting Exercise',
      source: require('@/assets/videos/video3.mp4'),
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Eye Exercise Videos</Text>
        <Text style={styles.headerSubtitle}>
          Enhance Your Vision with Simple Eye Exercises
        </Text>
      </View>

      {/* Video Cards */}
      {videos.map((video) => (
        <View key={video.id} style={styles.videoCard}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <Video
            source={video.source}
            style={styles.videoPlayer}
            useNativeControls
            resizeMode="contain"
          />
        </View>
      ))}

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 0,
  },
  header: {
    backgroundColor: '#0057B7',
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    marginTop: 0, // Touches the top of the screen
    marginBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  videoCard: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  videoPlayer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#000',
  },
  backButton: {
    backgroundColor: '#0057B7',
    paddingVertical: 15, // Matches Begin Test button height
    borderRadius: 25, // Rounded corners like Begin Test button
    alignItems: 'center',
    width: '80%', // Same width as Begin Test button
    alignSelf: 'center', // Centered horizontally
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16, // Same font size as Begin Test button
    fontWeight: 'bold',
  },
});