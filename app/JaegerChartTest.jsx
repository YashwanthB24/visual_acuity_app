import React, { useState, useEffect  } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import { supabase } from '../supabase';
// Jaeger chart data - starting from largest text (No. 11) to smallest (No. 1)
const jaegerChartData = [
  { 
    block: '11',
    size: '2.50M',
    questions: [
      { question: 'Read the first line of block No. 11', answer: 'attack they seemed to yield' },
      { question: 'What is the last word in the first line of block No. 11?', answer: 'yield' }
    ]
  },
  {
    block: '10',
    size: '2.25M',
    questions: [
      { question: 'Read the second line of block No. 10', answer: 'who despised life when it was separated' },
      { question: 'What are the first three words of block No. 10?', answer: 'filled with a' }
    ]
  },
  {
    block: '9',
    size: '2.00M',
    questions: [
      { question: 'Read the last line of block No. 9', answer: 'the forests and morasses of germany were' },
      { question: 'What is the second line of block No. 9?', answer: 'served the expense and labor of conquest' }
    ]
  },
  {
    block: '8',
    size: '1.75M',
    questions: [
      { question: 'Read the first line of block No. 8', answer: 'sand miles to the south of the tropic but the heat of' },
      { question: 'What are the last four words of block No. 8?', answer: 'of those sequestered regions' }
    ]
  },
  {
    block: '7',
    size: '1.50M',
    questions: [
      { question: 'Read the second line of block No. 7', answer: 'which had been taken in the defeat of crassus his gen' },
      { question: 'What are the first three words of block No. 7?', answer: 'able treaty the' }
    ]
  },
  {
    block: '4',
    size: '1.25M',
    questions: [
      { question: 'Read the first line of block No. 4', answer: 'his counsels it would be easy to secure every concession which' },
      { question: 'What are the last four words of block No. 4?', answer: 'arrows of the parthians' }
    ]
  },
  {
    block: '5',
    size: '1.00M',
    questions: [
      { question: 'Read the second line of block No. 5', answer: 'doubtful and the possession more precarious and less beneficial' },
      { question: 'What are the first four words of block No. 5?', answer: 'the undertaking became every' }
    ]
  },
  {
    block: '4',
    size: '0.75M',
    questions: [
      { question: 'Read the first line of block No. 4', answer: 'reserved for augustus to relinquish the ambitious design of subduing the' },
      { question: 'What are the last five words of block No. 4?', answer: 'from the chance of arms' }
    ]
  }
];

const JaegerChartTest = () => {
  // Test state
  const [currentBlock, setCurrentBlock] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [consecutiveMistakes, setConsecutiveMistakes] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [result, setResult] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  // Speech recognition state
  const [recording, setRecording] = useState(null);
  const [transcribedText, setTranscribedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [profileId, setProfileId] = useState(null);

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
        if (result === null) {
          console.error('Incomplete test results', result);
          Alert.alert('Error', 'Test is incomplete. Please ensure both eyes have been tested.');
          return;
        }
      
        try {
          const testDate = new Date().toISOString().split('T')[0];
          const testTime = new Date().toLocaleTimeString();
    
          const { data, error } = await supabase.from('long_sightedness_tests').insert([
            {
              profile_id: profileId,
              test_date: testDate,
              test_time: testTime,
              test_name: 'Jaeger Chart Test',
              score: result,
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
  
    // Convert to lowercase
    let processedText = text.toLowerCase();
  
    // Remove all punctuation (periods, commas, exclamation marks, question marks, etc.)
    processedText = processedText.replace(/[.,!?;:'"()\-]/g, '');
  
    // Replace multiple spaces with a single space
    processedText = processedText.replace(/\s+/g, ' ');
  
    // Remove any special characters and numbers
    processedText = processedText.replace(/[^a-z\s]/g, '');
  
    // Trim whitespace from beginning and end
    processedText = processedText.trim();
  
    // Handle common transcription errors and variations
    const wordMappings = {
      'period': '',
      'fullstop': '',
      'exclamation': '',
      'mark': '',
      'comma': '',
      'question': '',
      'quotation': '',
      'quote': '',
      'full stop': '',
      // Add more word mappings as needed based on common transcription errors
    };
  
    // Replace words that represent punctuation
    processedText = processedText.split(' ')
      .filter(word => !wordMappings[word])
      .join(' ');
  
    return processedText;
  };

  const startRecording = async () => {
    setTranscribedText("");
    setIsProcessing(false);
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
    } catch (error) {
      console.error('Error uploading audio:', error);
      setTranscribedText('');
    }
  };

  const handleAnswer = (answer) => {
    const currentQuestion = jaegerChartData[currentBlock].questions[currentQuestionIndex];
    const processedAnswer = processTranscribedText(answer);
    const correctAnswer = currentQuestion.answer;
    
    if (processedAnswer === correctAnswer) {
      setConsecutiveMistakes(0);
      
      if (currentBlock === jaegerChartData.length - 1) {
        setResult(jaegerChartData[currentBlock].size);
        setTestComplete(true);
      } else {
        setCurrentBlock(currentBlock + 1);
        setCurrentQuestionIndex(0);
      }
    } else {
      setConsecutiveMistakes(prev => prev + 1);
      
      if (consecutiveMistakes + 1 >= 2) {
        const currentSize = jaegerChartData[Math.max(0, currentBlock - 1)].size;
        setResult(currentSize);
        setTestComplete(true);
      } else {
        if (currentQuestionIndex + 1 < jaegerChartData[currentBlock].questions.length) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setCurrentQuestionIndex(0);
        }
      }
    }
  };
    useEffect(() => {
      if (testComplete && result) {
        saveTestResults();
      }
    }, [testComplete, result]);

    
  const handleSubmitAnswer = () => {
    setShowConfirmation(false);
    handleAnswer(transcribedText);
    setTranscribedText('');
  };

  const handleRecordAgain = () => {
    setShowConfirmation(false);
    setTranscribedText('');
  };

  const renderInstructions = () => {
    return (
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsHeader}>Instructions for Jaeger Chart Test</Text>
        <Text style={styles.instructionsText}>
          1. Hold your physical Jaeger chart at exactly 14 inches (35 cm) from your eyes
        </Text>
        <Text style={styles.instructionsText}>
          2. Ensure you are in a well-lit room
        </Text>
        <Text style={styles.instructionsText}>
          3. If you wear reading glasses, please put them on
        </Text>
        <Text style={styles.instructionsText}>
          4. You will be asked to read text from different blocks on the chart
        </Text>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => setShowInstructions(false)}
        >
          <Text style={styles.buttonText}>Start Test</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCurrentBlock = () => {
    const currentQuestion = jaegerChartData[currentBlock].questions[currentQuestionIndex];

    return (
      <View style={styles.contentContainer}>
        <Text style={styles.blockText}>Block No. {jaegerChartData[currentBlock].block}</Text>
        <Text style={styles.sizeText}>Size: {jaegerChartData[currentBlock].size}</Text>
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

  const getResultDescription = (size) => {
    const sizeValue = parseFloat(size);
    if (sizeValue <= 1.00) return "Normal near vision";
    if (sizeValue <= 1.50) return "Mild near vision difficulty";
    if (sizeValue <= 2.00) return "Moderate near vision difficulty";
    return "Significant near vision difficulty";
  };

  const renderResults = () => {
    return (
      <ScrollView contentContainerStyle={styles.resultsContainer}>
        <Text style={styles.resultHeader}>Jaeger Chart Test Results</Text>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Smallest readable text size: {result}
          </Text>
          <Text style={styles.resultDescription}>
            {getResultDescription(result)}
          </Text>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {showInstructions ? renderInstructions() : 
       testComplete ? renderResults() : renderCurrentBlock()}
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
  startButton: {
    backgroundColor: '#0057B7',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 30,
    alignSelf: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  blockText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0057B7',
    marginBottom: 10,
    marginTop: 150,
  },
  sizeText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
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
  resultContainer: {
    marginBottom: 20,
    alignItems: 'center',
    padding: 20,
  },
  resultText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  resultDescription: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  waitMessage: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default JaegerChartTest;