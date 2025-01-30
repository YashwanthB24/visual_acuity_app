import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import { supabase } from '../supabase';
// Import images for left and right eye icons
import leftEyeIcon from '@/assets/images/lefteye-icon.png';
import rightEyeIcon from '@/assets/images/righteye-icon.png';

// Snellen digit chart data
const snellenDigitChart = [
  { line: '2', questions: [
    { question: 'What is the number being displayed first line of the chart?', answer: '2' },
  ], score: "20/200" },
  { line: '5 0', questions: [
    { question: 'What is the first number being displayed on the second line of the chart?', answer: '5' },
    { question: 'What is the last number being displayed on the second line of the chart?',  answer: '0' },
  ], score: "20/100" },
  { line: '3 6 4', questions: [
    { question: 'What is the last number being displayed on the third line of the chart?',  answer: '4' },
    { question: 'What is the first number being displayed on the third line of the chart?', answer: '3' },
  ], score: "20/70" },
  { line: '4 9 5 2', questions: [
    { question: 'What is the number after 9 in the fourth line of the chart?', answer: '5' },
    { question: 'What is the number before 5 in the line of the chart?', answer: '9' },
  ], score: "20/50" },
  { line: '6 0 4 9 3', questions: [
    { question: 'What is the number between 0 and 9 in the fifth line of the chart?', answer: '4' },
    { question: 'What is the number between 6 and 4 in the fifth line of the chart?', answer: '0' },
  ], score: "20/40" },
  { line: '5 9 3 2 0 6', questions: [
    { question: 'What is the third number in the sixth line of the chart?', answer: '3' },
    { question: 'What is the number after 3 in the sixth line of the chart?', answer: '2' },
  ], score: "20/30" },
  { line: '0 4 6 9 5 3 6', questions: [
    { question: 'What is the number between 5 and 6 in the seventh line of the chart?', answer: '3' },
    { question: 'What is the last number in the seventh line of the chart?', answer: '6' },
  ], score: "20/25" },
  { line: '4 2 9 7 5 3 8 2', questions: [
    { question: 'What is the number between 9 and 5 in the above eighth line of the chart?', answer: '7' },
    { question: 'What is the last number in the eighth line of the chart?', answer: '2' },
  ], score: "20/20" },
];

const SnellenDigitChartTest = () => {
  // Test state
   const [currentLine, setCurrentLine] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [consecutiveMistakes, setConsecutiveMistakes] = useState(0);
    const [coveringLeftEye, setCoveringLeftEye] = useState(true);
    const [firstWrongPower, setFirstWrongPower] = useState(null);
    const [testComplete, setTestComplete] = useState(false);
    const [results, setResults] = useState({ leftEye: null, rightEye: null });
  
    // Speech recognition state
    const [recording, setRecording] = useState(null);
    const [transcribedText, setTranscribedText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); // New state to track processing status
  
    const [profileId, setProfileId] = useState(null);
  
    const [lastSuccessfulPower, setLastSuccessfulPower] = useState(snellenDigitChart[0].power);
  
    useEffect(() => {
      const fetchProfileId = async () => {
        try {
          const { data: userResponse } = await supabase.auth.getUser();
          const user = userResponse?.user;
  
          if (!user) {
            Alert.alert('Error', 'User not logged in.');
            return;
          }
  
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();
  
          if (error) throw error;
          setProfileId(profile?.id);
        } catch (error) {
          Alert.alert('Error', 'Failed to fetch profile. Please try again.');
          console.error(error);
        }
      };
  
      fetchProfileId();
    }, []);
  
    const saveTestResults = async () => {
      if (!profileId) {
        console.error('Error: Profile ID is null or undefined.');
        Alert.alert('Error', 'Profile ID not found. Cannot save test results.');
        return;
      }
    
      // Check if both eye scores are present
      if (results.leftEye === null || results.rightEye === null) {
        console.error('Incomplete test results', results);
        Alert.alert('Error', 'Test is incomplete. Please ensure both eyes have been tested.');
        return;
      }
    
      try {
        const testDate = new Date().toISOString().split('T')[0];
        const testTime = new Date().toLocaleTimeString();
    
        const { data, error } = await supabase.from('short_sightedness_tests').insert([
          {
            profile_id: profileId,
            test_date: testDate,
            test_time: testTime,
            test_name: 'Snellen Digit Chart Test',
            score_left_eye: results.leftEye,
            score_right_eye: results.rightEye,
          },
        ]).select();
    
        if (error) {
          console.error('Detailed Error Inserting Test Results:', error);
          Alert.alert('Error', 'Failed to save test results. Please try again.');
        } else {
          console.log('Successfully Saved Test Results:', data);
          Alert.alert('Success', 'Test results saved successfully.');
        }
      } catch (error) {
        console.error('Unexpected Error Saving Test Results:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    };

  const processTranscribedText = (text) => {
    if (!text) return '';
  
    // If the text is already a number, return it as is
    if (/^\d+$/.test(text)) {
      return text;
    }
    // Remove non-alphanumeric characters
    const cleanedText = text.replace(/[^a-zA-Z0-9]/g, '').trim();
  
    // Map common misrecognized words to numbers
    const numberMappings = {
      'do': '2', 'doo': '2', 'too': '2', 'to': '2', 'two': '2', 'boo': '2',
      'zero': '0', 'oh': '0',
      'one': '1', 'won': '1',
      'three': '3', 'tree': '3','we': '3','be': '3',
      'four': '4', 'for': '4','or':'4',
      'five': '5','fave':'5','fine': '5','bye': '5',  
      'six': '6', 'Six': '6',
      'seven': '7',
      'eight': '8','ate':'8','it':'8','eat':'8',
      'nine': '9',
    };
  
    // Convert cleaned text to lowercase and check for mappings
    const processedText = cleanedText.toLowerCase();
    return numberMappings[processedText] || cleanedText;
  };
  

  const startRecording = async () => {
    // Reset previous transcriptions and hide the wait message on new recording
    setTranscribedText("");
    setIsProcessing(false); // Reset processing state for a new recording
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
      setIsProcessing(true); // Set processing to true when recording stops
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
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
      
      const rawTranscribedText = response.data?.text || response.data || '';
      const processedText = processTranscribedText(rawTranscribedText);
      
      setTranscribedText(processedText);
      setShowConfirmation(true);
      
      console.log('Raw transcribed text:', rawTranscribedText);
      console.log('Processed text:', processedText);
    } catch (error) {
      console.error('Error uploading audio:', error);
      setTranscribedText('');
    }
  };

  const handleSubmitAnswer = () => {
    setShowConfirmation(false);
    handleAnswer(transcribedText);
    setTranscribedText('');
  };

  const handleRecordAgain = () => {
    setShowConfirmation(false);
    setTranscribedText('');
  };

  const handleAnswer = (answer) => {
      const currentQuestion = snellenDigitChart[currentLine].questions[currentQuestionIndex];
      const processedAnswer = processTranscribedText(answer);
      const correctAnswer = currentQuestion.answer;
    
    
      if (processedAnswer === correctAnswer) {
        // Correct answer
        setConsecutiveMistakes(0);
        
        setLastSuccessfulPower(snellenDigitChart[currentLine].score);
    
        if (currentLine === snellenDigitChart.length - 1) {
          if (coveringLeftEye) {
            setResults(prev => ({
              ...prev,
              leftEye: snellenDigitChart[currentLine].score,
            }));
            
            // Reset for right eye
            setCoveringLeftEye(false);
            setCurrentLine(0);
            setCurrentQuestionIndex(0);
            setConsecutiveMistakes(0);
            setLastSuccessfulPower(snellenDigitChart[0].score);
          } else {
            // End of test for both eyes
            setResults(prev => ({
              ...prev,
              rightEye: snellenDigitChart[currentLine].score,
            }));
            
            setTestComplete(true);
          }
        } else {
          // Move to next line's first question
          setCurrentLine(currentLine + 1);
          setCurrentQuestionIndex(0);
        }
      } else {
        // Wrong answer
        setConsecutiveMistakes(prev => prev + 1);
    
        if (consecutiveMistakes + 1 >= 2) {
          // Two consecutive wrong answers - end test for current eye
          const lastSuccessfulLineScore = snellenDigitChart[Math.max(0, currentLine - 1)].score;
          
          if (coveringLeftEye) {
            setResults(prev => ({
              ...prev,
              leftEye: lastSuccessfulLineScore,
            }));
           
            // Reset for right eye
            setCoveringLeftEye(false);
            setCurrentLine(0);
            setCurrentQuestionIndex(0);
            setConsecutiveMistakes(0);
            setLastSuccessfulPower(snellenDigitChart[0].score);
          } else {
            setResults(prev => ({
              ...prev,
              rightEye: lastSuccessfulLineScore,
            }));       
            setTestComplete(true);
          }
        } else {
          // First wrong answer - show alternate question from same line
          if (currentQuestionIndex + 1 < snellenDigitChart[currentLine].questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          } else {
            setCurrentQuestionIndex(0);
          }
        }
      }
    };
    
    // Add an effect to trigger saveTestResults when test is complete
    useEffect(() => {
      if (testComplete && results.leftEye && results.rightEye) {
        saveTestResults();
      }
    }, [testComplete, results]);

  const renderCurrentLine = () => {
    const currentQuestion = snellenDigitChart[currentLine].questions[currentQuestionIndex];

    return (
      <View style={styles.contentContainer}>
        <Image
          source={coveringLeftEye ? rightEyeIcon : leftEyeIcon}
          style={styles.eyeIcon}
          resizeMode="contain"
        />
        <Text style={styles.lineText}>Line {currentLine + 1}</Text>
        <Text style={[styles.snellenLine, { fontSize: snellenDigitChart[currentLine].size }]}>
        </Text>
        <Text style={styles.question}>{currentQuestion.question}</Text>
        
        {showConfirmation ? (
          <View style={styles.confirmationContainer}>
            <Text style={styles.transcribedText}>Your answer: {transcribedText}</Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleSubmitAnswer}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleRecordAgain}>
                <Text style={styles.buttonText}>Record Again</Text>
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

        {isProcessing && !showConfirmation && (
          <Text style={styles.waitMessage}>Please wait a few seconds for the transcription...</Text>
        )}
      </View>
    );
  };
  

  const renderResults = () => {
    return (
      <ScrollView contentContainerStyle={styles.resultsContainer}>
        <Text style={styles.resultHeader}>Visual Acuity Test Results for Snellen Digit Chart</Text>
        <View style={styles.eyeResultContainer}>
          <Text style={styles.eyeTitle}>Left Eye</Text>
          <Text style={styles.resultText}>
            Score: {results.leftEye}
          </Text>
          <Text style={styles.resultDescription}>
            {getResultDescription(results.leftEye)}
          </Text>
        </View>
        <View style={styles.eyeResultContainer}>
          <Text style={styles.eyeTitle}>Right Eye</Text>
          <Text style={styles.resultText}>
            Score: {results.rightEye}
          </Text>
          <Text style={styles.resultDescription}>
            {getResultDescription(results.rightEye)}
          </Text>
        </View>
      </ScrollView>
    );
  };
  const getResultDescription = (score) => {
    if (!score) return '';
  
    // Parse the fraction (e.g., "20/200" -> ratio of 20/200 = 0.1)
    const [numerator, denominator] = score.split('/').map(Number);
    const ratio = numerator / denominator;
  
    // Define vision categories based on Snellen score ratios
    if (ratio <= 0.1) { // 20/200 or worse
      return 'Significant correction needed - Legally blind without correction';
    } else if (ratio <= 0.2) { // 20/100
      return 'Significant correction needed';
    } else if (ratio <= 0.33) { // 20/60
      return 'Moderate correction needed';
    } else if (ratio <= 0.5) { // 20/40
      return 'Mild correction needed';
    } else if (ratio <= 0.67) { // 20/30
      return 'Minor correction may be needed';
    } else if (ratio >= 1.0) { // 20/20 or better
      return 'Normal vision range';
    } else {
      return 'Vision slightly below normal';
    }
  };

  return (
    <View style={styles.container}>
      {testComplete ? renderResults() : renderCurrentLine()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  eyeIcon: {
    width: 150,
    height: 150,
    marginTop: 50,
    marginVertical: 20,
  },
  snellenLine: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 30,
  },
  question: {
    fontSize: 20,
    color: '#0057B7',
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  recordButton: {
    backgroundColor: '#0057B7',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 25,
    marginBottom: 50,
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
  transcribedText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#0057B7',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    width: '45%',
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
    marginTop: 40,
    textAlign: 'center',
  },
  eyeResultContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  eyeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0057B7',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  resultDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default SnellenDigitChartTest;