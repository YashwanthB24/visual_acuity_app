import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';

// Importing images
import letterIcon from '@/assets/images/letter-icon.png';
import numberIcon from '@/assets/images/number-icon.png';
import eIcon from '@/assets/images/e-icon.png';
import pattiIcon from '@/assets/images/patti-pics.png';
import AnimalsIcon from '@/assets/images/AnimalsChartIcon.png';

export default function ShortsightednessTestOptions() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your Test</Text>
        <Text style={styles.headerSubtitle}>Select the chart type that suits you best</Text>
      </View>

      {/* Snellen Chart */}
      <View style={styles.card}>
        <Image source={letterIcon} style={styles.chartIcon} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Snellen Chart</Text>
          <Text style={styles.cardSubtitle}>
            The Snellen chart uses letters of the Latin alphabet in decreasing size.
          </Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => router.push('/SnellenChartTestOptions')} // Navigate to SnellenChartTest page
          >
            <Text style={styles.buttonText}>Select Snellen Chart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Snellen Digit Chart */}
      <View style={styles.card}>
        <Image source={numberIcon} style={styles.chartIcon} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Snellen Digit Chart</Text>
          <Text style={styles.cardSubtitle}>
            The Snellen Digit chart uses English numeric digits in decreasing size.
          </Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => router.push('/SnellenDigitChartTestOptions')} // Navigate to SnellenDigitChartTest page
          >
            <Text style={styles.buttonText}>Select Snellen Digit Chart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tumbling E Chart */}
      <View style={styles.card}>
        <Image source={eIcon} style={styles.chartIcon} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Tumbling E Chart</Text>
          <Text style={styles.cardSubtitle}>
            The Tumbling E chart uses the letter E in different orientations, suitable for all users.
          </Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => router.push('/TumblingEChartTestOptions')} // Navigate to SnellenDigitChartTest page
          >
            <Text style={styles.buttonText}>Select Tumbling E Chart</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Patti Pics Chart */}
      <View style={styles.card}>
        <Image source={pattiIcon} style={styles.chartIcon} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Patti Pics Chart</Text>
          <Text style={styles.cardSubtitle}>
            The Patti Pics chart uses the images of apple, square, circle, star, house in decreasing size.
          </Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => router.push('/PattiPicsChartTestOptions')} // Navigate to PattiPicsChartTest page
          >
            <Text style={styles.buttonText}>Select Patti Pics Chart</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Animals Chart */}
      <View style={styles.card}>
        <Image source={AnimalsIcon} style={styles.chartIcon} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Animals Chart</Text>
          <Text style={styles.cardSubtitle}>
            The Animals chart uses the images of various animals like horse, giraffe, rabbit, cat, sea horse, bird, elephant, goat, dog in decreasing size.
          </Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => router.push('/AnimalsChartTestOptions')} // Navigate to AnimalsChartTest page
          >
            <Text style={styles.buttonText}>Select Animals Chart</Text>
          </TouchableOpacity>
        </View>
      </View>       
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    paddingTop: 40,
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
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 20,
    position: 'relative',
  },
  chartIcon: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  selectButton: {
    backgroundColor: '#0057B7',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
