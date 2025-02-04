import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function Introduction() {
  const [triviaIndex, setTriviaIndex] = useState(0); // To track the current trivia fact
  const [selectedVision, setSelectedVision] = useState(null);
  const [selectedBlur, setSelectedBlur] = useState(null);
  const router = useRouter();

  // Fun facts about vision health
  // const triviaFacts = [
  //   "Carrots are rich in beta-carotene, a compound your body converts to vitamin A for healthy eyes.",
  //   "Your eyes can distinguish about 10 million different colors!",
  //   "Blinking helps keep your eyes moist and provides a brief rest from light exposure.",
  //   "The human eye blinks an average of 4.2 million times a year!",
  //   "Your retina has over 120 million rods for night vision and 6 million cones for color vision.",
  //   "Eating leafy greens like spinach helps reduce the risk of macular degeneration.",
  //   "Blue light from screens can cause digital eye strain. Remember the 20-20-20 rule!",
  //   "Your eyes process more information than the largest supercomputers!",
  //   "Your pupils dilate when you see someone you love!",
  //   "Fish like salmon and tuna are rich in omega-3 fatty acids, which are good for eye health.",
  //   "Your eyes are the second most complex organ in your body after your brain.",
  //   "The cornea is the only part of the human body with no blood supply.",
  //   "Your eyes can detect a candle flame 1.7 miles away in perfect darkness.",
  //   "Wearing sunglasses helps protect your eyes from harmful UV rays.",
  //   "Drinking plenty of water helps keep your eyes hydrated and prevents dryness.",
  // ];

  // // Function to get a new trivia fact
  // const getNextTrivia = () => {
  //   setTriviaIndex((prevIndex) => (prevIndex + 1) % triviaFacts.length);
  // };

  // Handle start test button
  const handleStartTest = () => {
    router.push('/TestSelection');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Visual Acuity Test</Text>
        <Text style={styles.headerSubtitle}>Assess your vision from home</Text>
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Welcome to the Test Box */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome to the Test</Text>
        <Text style={styles.cardText}>
          This visual acuity test will help you assess your vision health. You’ll be shown a series of letters in different sizes, similar to what you’d see at an eye doctor’s office.
        </Text>
        <Text style={styles.warningText}>
          Remember, this test is not a substitute for a professional eye exam.
        </Text>
      </View>

      {/* Before We Begin Box */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Before We Begin</Text>
        <Text style={styles.cardText}>👣 Stand 20 feet (6 meters) away from your device</Text>
        <Text style={styles.cardText}>💡 Ensure you’re in a well-lit room</Text>
        <Text style={styles.cardText}>📱 Hold your device at eye level</Text>
      </View>

      {/* Eye Trivia Section
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Did You Know?</Text>
        <Text style={styles.cardText}>{triviaFacts[triviaIndex]}</Text>
        <TouchableOpacity style={styles.nextTriviaButton} onPress={getNextTrivia}>
          <Text style={styles.buttonText}>Next Fact</Text>
        </TouchableOpacity>
      </View> */}



      {/* Start Test Button */}
      <TouchableOpacity style={styles.startTestButton} onPress={handleStartTest}>
        <Text style={styles.buttonText}>Start Test</Text>
      </TouchableOpacity>
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
    marginTop: 0,
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
  spacer: {
    height: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
    marginHorizontal: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: '#d9534f',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  optionButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  selectedOption: {
    backgroundColor: '#0057B7',
  },
  nextTriviaButton: {
    backgroundColor: '#0057B7',
    paddingVertical: 10,
    borderRadius: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  startTestButton: {
    backgroundColor: '#0057B7',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
