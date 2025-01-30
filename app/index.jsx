import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Pressable, Text, Animated } from 'react-native';
import { Link } from 'expo-router';
import healthykidsimgs from '@/assets/images/Healthykidicon.png'; // Ensure the path is correct

export default function Index() {
  const imageScale = useRef(new Animated.Value(0.6)).current; // Initial scale for zoom effect
  const imageOpacity = useRef(new Animated.Value(0)).current; // Initial opacity for fade-in
  const buttonOpacity = useRef(new Animated.Value(0)).current; // Button opacity for fade-in

  useEffect(() => {
    // Start the image animation: zoom-in and fade-in
    Animated.parallel([
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 3000, // 3-second zoom-in
        useNativeDriver: true,
      }),
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 3000, // 3-second fade-in
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After image animation completes, fade in the button
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 1000, // Simple 1-second fade-in
        useNativeDriver: true,
      }).start();
    });
  }, [imageScale, imageOpacity, buttonOpacity]);

  return (
    <View style={styles.splashContainer}>
      <Animated.Image
        source={healthykidsimgs}
        style={[
          styles.splashImage,
          { transform: [{ scale: imageScale }], opacity: imageOpacity },
        ]}
        resizeMode="contain"
      />

      <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
        <Link href="/signup" asChild>
          <Pressable style={styles.getStartedButton}>
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </Link>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // White background
  },
  splashImage: {
    width: 180,
    height: 180,
    marginBottom: 40, // Space between the image and button
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: '#0057B7', // Same blue color as Sign In button
    paddingVertical: 15,
    borderRadius: 25, // Curved border radius to match Sign In button
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // For Android shadow
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
