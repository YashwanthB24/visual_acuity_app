//Animals Chart Test
import React, { useState, useEffect  } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { supabase } from '../supabase';
// Import images for left and right eye icons
import leftEyeIcon from '@/assets/images/lefteye-icon.png';
import rightEyeIcon from '@/assets/images/righteye-icon.png';

// Snellen digit chart data
const snellenDigitChart = [
  { line: '1', questions: [
      { question: 'What is the first animal on the chart?', answer: 'horse' },
    ], score: "6/60" },
  { line: '2', questions: [
      { question: 'What is the last animal on the second line of the chart?', answer: 'rabbit' },
      { question: 'What is the first animal on the second line of the chart?', answer: 'giraffe' },
    ], score: "6/30" },
  { line: '3', questions: [
      { question: 'What is the animal at the center of third line of the chart?', answer: 'dog' },
      { question: 'What is the last animal on the third line of the chart?', answer: 'goat' },
    ], score: "6/20" },
  { line: '4', questions: [
      { question: 'What is the second animal on the fourth line of the chart?',  answer: 'rabbit' },
      { question: 'What is the first animal on the fourth line of the chart?',  answer: 'cat' },
    ], score: "6/15" },
  { line: '5', questions: [
      { question: 'What is present at the center of fifth line of the chart?',  answer: 'bird' },
      { question: 'What is the last animal on the fifth line of the chart?',  answer: 'seahorse' },
    ], score: "6/12" },
  { line: '6', questions: [
      { question: 'Which animal is present between the bird and the rabbit on the sixth line of the chart?', answer: 'goat' },
      { question: 'What is the first animal on the sixth line of the chart?', answer: 'horse' },
    ], score: "6/9" },
  { line: '7', questions: [
      { question: 'Which animal is present to the right of the cat on the seventh line of the chart?', answer: 'dog' },
      { question: 'Which animal is present between the rabbit and the seahorse on the seventh line of the chart?', answer: 'goat' },
    ], score: "6/8" },
  { line: '8', questions: [
      { question: 'Which animal is present between the dog and the horse on the eighth line of the chart?', answer: 'elephant' },
      { question: 'Which animal is present to the left of the giraffe on the eighth line of the chart?', answer: 'horse' },
    ], score: "6/6" },
];

const AnimalsChartTestOptions = () => { 
  // Test state
  const [currentLine, setCurrentLine] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [consecutiveMistakes, setConsecutiveMistakes] = useState(0);
  const [coveringLeftEye, setCoveringLeftEye] = useState(true);
  const [firstWrongPower, setFirstWrongPower] = useState(null);
  const [testComplete, setTestComplete] = useState(false);
  const [results, setResults] = useState({ leftEye: null, rightEye: null });

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
          test_name: 'Snellen Chart Test',
          score_left_eye: results.leftEye,
          score_right_eye: results.rightEye,
          mode: 'without speech',
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

  // Returns an array of answer options (one correct answer and two other options).
  const getOptions = (correctAnswer) => {
    const optionsPool = ['horse', 'giraffe', 'rabbit', 'dog', 'cat', 'bird', 'seahorse', 'goat', 'elephant'];
    // Filter out the correct answer from the pool.
    const filteredPool = optionsPool.filter(animal => animal !== correctAnswer);
    // Shuffle the filtered pool.
    const shuffledPool = filteredPool.sort(() => 0.5 - Math.random());
    // Select two random options.
    const randomOptions = shuffledPool.slice(0, 3);
    // Combine with the correct answer.
    const options = [correctAnswer, ...randomOptions];
    // Shuffle the options array before returning.
    return options.sort(() => 0.5 - Math.random());
  };

  const handleAnswer = (selectedAnswer) => {
    const currentQuestion = snellenDigitChart[currentLine].questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer;
  
    if (selectedAnswer === correctAnswer) {
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
    const options = getOptions(currentQuestion.answer);

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
        
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.optionButtonText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
    
  const getResultDescription = (score) => {
    if (!score) return '';
  
    const [numerator, denominator] = score.split('/').map(Number);
    const ratio = numerator / denominator;
  
    let description = '';
    let color = '#000'; // Default color
  
    if (ratio <= 0.1) { // 6/60 or worse
      description = 'Significant correction needed - Legally blind without correction';
      color = 'red';
    } else if (ratio <= 0.2) { // 6/30
      description = 'Significant correction needed';
      color = 'orange';
    } else if (ratio <= 0.33) { // 6/20
      description = 'Moderate correction needed';
      color = 'yellow';
    } else if (ratio <= 0.5) { // 6/15
      description = 'Mild correction needed';
      color = 'lightgreen';
    } else if (ratio <= 0.66) { // 6/12
      description = 'Near perfect vision';
      color = 'green';
    } else if (ratio <= 1) { // 6/9, 6/8, 6/6
      description = 'Excellent vision';
      color = 'darkgreen';
    }
  
    return { description, color };
  };
    
  const renderResults = () => {
    return (
      <ScrollView contentContainerStyle={styles.resultsContainer}>
        <Text style={styles.resultHeader}>Visual Acuity Test Results for Snellen Chart</Text>
        <View style={styles.eyeResultContainer}>
          <Text style={styles.eyeTitle}>Left Eye</Text>
          <Text style={styles.resultText}>
            Score: {results.leftEye}
          </Text>
          <Text style={[styles.resultDescription, { color: getResultDescription(results.leftEye).color }]}>
            {getResultDescription(results.leftEye).description}
          </Text>
        </View>
        <View style={styles.eyeResultContainer}>
          <Text style={styles.eyeTitle}>Right Eye</Text>
          <Text style={styles.resultText}>
            Score: {results.rightEye}
          </Text>
          <Text style={[styles.resultDescription, { color: getResultDescription(results.rightEye).color }]}>
            {getResultDescription(results.rightEye).description}
          </Text>
        </View>
      </ScrollView>
    );
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
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#0057B7',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 15,
    width: '60%',
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
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

export default AnimalsChartTestOptions;
