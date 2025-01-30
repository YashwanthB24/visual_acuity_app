import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import { supabase } from '../supabase';
// MNRead chart data - sentences with decreasing text sizes
const mnreadChartData = [
  {
    size: '1.3 logMAR',
    visualAcuity: '20/400',
    sentence: 'Small dogs can bark and play in the yard all day long',
    wordCount: 12,
  },
  {
    size: '1.2 logMAR',
    visualAcuity: '20/320',
    sentence: 'The young girl picked fresh flowers from her garden',
    wordCount: 9,
  },
  {
    size: '1.1 logMAR',
    visualAcuity: '20/250',
    sentence: 'Children love to play with their toys after school',
    wordCount: 10,
  },
  {
    size: '1.0 logMAR',
    visualAcuity: '20/200',
    sentence: 'The old cat sleeps in the warm sunshine',
    wordCount: 9,
  },
  {
    size: '0.9 logMAR',
    visualAcuity: '20/160',
    sentence: 'Fresh bread tastes best when it is warm',
    wordCount: 9,
  },
  {
    size: '0.8 logMAR',
    visualAcuity: '20/125',
    sentence: 'The train was late arriving at the station',
    wordCount: 9,
  },
  {
    size: '0.7 logMAR',
    visualAcuity: '20/100',
    sentence: 'The moon shines brightly in the night sky',
    wordCount: 9,
  },
  {
    size: '0.6 logMAR',
    visualAcuity: '20/80',
    sentence: 'Fresh snow covered the ground last night',
    wordCount: 8,
  },
  {
    size: '0.5 logMAR',
    visualAcuity: '20/63',
    sentence: 'The children played games in the park',
    wordCount: 8,
  },
  {
    size: '0.4 logMAR',
    visualAcuity: '20/50',
    sentence: 'Birds fly south when winter comes',
    wordCount: 7,
  },
];

const MNReadChartTest = () => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [readingTimes, setReadingTimes] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  const calculateResults = () => {
    // Calculate Reading Acuity (RA)
    const smallestReadable = mnreadChartData[currentSentence - 1].size;
    const readingAcuity = parseFloat(smallestReadable.split(' ')[0]);

    // Calculate Maximum Reading Speed (MRS)
    const readingSpeeds = readingTimes.map((time, index) => {
      const sentence = mnreadChartData[index];
      return (sentence.wordCount / time) * 60; // words per minute
    });
    const maxReadingSpeed = Math.max(...readingSpeeds);

    // Calculate Critical Print Size (CPS)
    // The smallest print size at which reading speed is still within 80% of maximum
    const criticalPrintSize = mnreadChartData.find((data, index) => {
      const speed = readingSpeeds[index];
      return speed >= (maxReadingSpeed * 0.8);
    });

    return {
      readingAcuity: readingAcuity.toFixed(1),
      maxReadingSpeed: Math.round(maxReadingSpeed),
      criticalPrintSize: criticalPrintSize ? criticalPrintSize.size : 'Not determined',
      readingSpeeds
    };
  };

  const startRecording = async () => {
    setTranscribedText("");
    setIsProcessing(false);
    setStartTime(Date.now());
    try {
      await Audio.requestPermissionsAsync();
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      setIsProcessing(true);
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const endTime = Date.now();
      const readingTime = (endTime - startTime) / 1000; // Convert to seconds
      
      setReadingTimes(prev => [...prev, readingTime]);
      
      if (uri) {
        uploadAudio(uri);
      }
      setRecording(null);
    }
  };

  const uploadAudio = async (uri) => {
    const formData = new FormData();
    formData.append('audio_data', {
      uri,
      type: 'audio/wav',
      name: 'recording.wav',
    });

    try {
      const response = await axios.post('https://gazelle-distinct-jay.ngrok-free.app/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const processedText = processTranscribedText(response.data?.text || '');
      setTranscribedText(processedText);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error uploading audio:', error);
      setTranscribedText('');
    } finally {
      setIsProcessing(false);
    }
  };

  const processTranscribedText = (text) => {
    if (!text) return '';
    return text.toLowerCase().replace(/[.,!?;:'"()\-]/g, '').trim();
  };

  const handleConfirmation = (isCorrect) => {
    setShowConfirmation(false);
    
    if (isCorrect) {
      if (currentSentence === mnreadChartData.length - 1) {
        setResults(calculateResults());
        setTestComplete(true);
      } else {
        setCurrentSentence(prev => prev + 1);
      }
    } else {
      setResults(calculateResults());
      setTestComplete(true);
    }
  };

  const renderInstructions = () => (
    <View style={styles.instructionsContainer}>
      <Text style={styles.instructionsHeader}>MNRead Chart Test Instructions</Text>
      <Text style={styles.instructionsText}>
        1. Hold your MNRead chart at exactly 16 inches (40 cm) from your eyes
      </Text>
      <Text style={styles.instructionsText}>
        2. Ensure you are in a well-lit room
      </Text>
      <Text style={styles.instructionsText}>
        3. If you wear reading glasses, please put them on
      </Text>
      <Text style={styles.instructionsText}>
        4. Read each sentence as quickly and accurately as possible
      </Text>
      <TouchableOpacity 
        style={styles.startButton}
        onPress={() => setShowInstructions(false)}
      >
        <Text style={styles.buttonText}>Start Test</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCurrentSentence = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.sizeText}>
        Size: {mnreadChartData[currentSentence].size} ({mnreadChartData[currentSentence].visualAcuity})
      </Text>
      <Text style={styles.instructions}>
        Read the following sentence aloud:
      </Text>
      <Text style={styles.sentence}>
        {mnreadChartData[currentSentence].sentence}
      </Text>
      
      {showConfirmation ? (
        <View style={styles.confirmationContainer}>
          <Text style={styles.transcribedText}>You read: {transcribedText}</Text>
          <View style={styles.confirmationButtons}>
            <TouchableOpacity 
              style={[styles.confirmButton, styles.correctButton]}
              onPress={() => handleConfirmation(true)}
            >
              <Text style={styles.buttonText}>Correct</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.confirmButton, styles.incorrectButton]}
              onPress={() => handleConfirmation(false)}
            >
              <Text style={styles.buttonText}>Incorrect</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordingButton]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.buttonText}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Text>
        </TouchableOpacity>
      )}

      {isProcessing && (
        <Text style={styles.waitMessage}>Processing your reading...</Text>
      )}
    </View>
  );

  const renderResults = () => (
    <ScrollView contentContainerStyle={styles.resultsContainer}>
      <Text style={styles.resultHeader}>MNRead Test Results</Text>
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Reading Acuity: {results.readingAcuity} logMAR
        </Text>
        <Text style={styles.resultText}>
          Maximum Reading Speed: {results.maxReadingSpeed} words/minute
        </Text>
        <Text style={styles.resultText}>
          Critical Print Size: {results.criticalPrintSize}
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {showInstructions ? renderInstructions() :
       testComplete ? renderResults() : renderCurrentSentence()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  instructionsContainer: {
    width: '100%',
    padding: 20,
  },
  instructionsHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0057B7',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
    paddingTop: 40,
  },
  sizeText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  sentence: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    marginVertical: 30,
    lineHeight: 28,
  },
  recordButton: {
    backgroundColor: '#0057B7',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
  },
  recordingButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  confirmationContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    width: '45%',
  },
  correctButton: {
    backgroundColor: '#4CAF50',
  },
  incorrectButton: {
    backgroundColor: '#f44336',
  },
  resultsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  resultHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0057B7',
    marginBottom: 20,
  },
  resultContainer: {
    width: '100%',
    padding: 20,
  },
  resultText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
  },
  waitMessage: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  transcribedText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: '#0057B7',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 30,
    alignSelf: 'center',
  },
});

export default MNReadChartTest;