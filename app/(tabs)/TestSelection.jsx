import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

// Importing images
import shortsightednessImage from '@/assets/images/shortsightedness.png';
import longsightednessImage from '@/assets/images/longsightedness.png';

export default function TestSelection() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose Your Test</Text>
          <Text style={styles.headerSubtitle}>
            Select the test you would like to take
          </Text>
        </View>

        {/* Select Test Section */}
        <View style={styles.cardContainer}>
          {/* Shortsightedness Test Box */}
          <View style={styles.card}>
            <Image source={shortsightednessImage} style={styles.testImage} />
            <Text style={styles.cardTitle}>Shortsightedness Test</Text>
            <Text style={styles.cardSubtitle}>
              Check your ability to see distant objects clearly.
            </Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => router.push('/ShortsightednessTest')}
            >
              <Text style={styles.buttonText}>Select Shortsightedness Test</Text>
            </TouchableOpacity>
          </View>

          {/* Longsightedness Test Box */}
          <View style={styles.card}>
            <Image source={longsightednessImage} style={styles.testImage} />
            <Text style={styles.cardTitle}>Longsightedness Test</Text>
            <Text style={styles.cardSubtitle}>
              Check your ability to see nearby objects clearly.
            </Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => router.push('/JaegerChartTest')}
            >
              <Text style={styles.buttonText}>Select Longsightedness Test</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#0057B7',
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  cardContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '95%',
    alignSelf: 'center',
    minHeight: 120,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0057B7',
    textAlign: 'center',
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  testImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
    alignSelf: 'center',
  },
  selectButton: {
    backgroundColor: '#0057B7',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});