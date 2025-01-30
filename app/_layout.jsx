import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';

// Importing the Stack component from expo-router
import { Stack } from 'expo-router';

import { useColorScheme } from '@/hooks/useColorScheme';
import healthykids from '../assets/images/Healthykidicon.png';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 2000);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.splashContainer}>
        <ImageBackground source={healthykids} style={styles.splashImage} resizeMode="contain" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="HomePage" options={{ headerShown: false }} />
        <Stack.Screen name="Introduction" options={{ headerShown: false }} /> {/* New Introduction Route */}
        <Stack.Screen name="TestSelection" options={{ headerShown: false }} />
        <Stack.Screen name="ShortsightednessTest" options={{ headerShown: false }} />
        <Stack.Screen name="LongsightednessTest" options={{ headerShown: false }} />

        <Stack.Screen name="SnellenChartTest" options={{ headerShown: false }} />
        <Stack.Screen name="SnellenDigitChartTest" options={{ headerShown: false }} />
        <Stack.Screen name="TumblingEChartTest" options={{ headerShown: false }} />
        <Stack.Screen name="PattiPicsChartTest" options={{ headerShown: false }} />
        <Stack.Screen name="AnimalsChartTest" options={{ headerShown: false }} />
        <Stack.Screen name="JaegerChartTest" options={{ headerShown: false }} />
        <Stack.Screen name="MNReadChartTest" options={{ headerShown: false }} />
        <Stack.Screen name="TestHistory" options={{ headerShown: false }} />

        <Stack.Screen name="EyeExerciseVideos" options={{ headerShown: false, title: 'Eye Exercises' }} />
        <Stack.Screen name="HealthyFoodsPage" options={{ headerShown: false, title: 'Eye Exercises' }} />

      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
});
