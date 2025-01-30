import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Alert, 
  Linking 
} from 'react-native';
import * as Speech from 'expo-speech'; 
import Voice from '@react-native-voice/voice';
import * as AV from 'expo-av'; // Import from expo-av

// Import assets
import leftEyeIcon from '@/assets/images/lefteye-icon.png';
import rightEyeIcon from '@/assets/images/righteye-icon.png';
import micIcon from '@/assets/images/e-icon.png';

// Questions based on the physical chart
const physicalChartQuestions = [
  { question: "What is the first number on the chart?", correctAnswer: "85" },
  { question: "What is the number after 2 in the second line?", correctAnswer: "9" },
  { question: "What is the last number in the third line?", correctAnswer: "4" },
  { question: "What is the second number in the fourth line?", correctAnswer: "3" },
  { question: "What is the third number in the fifth line?", correctAnswer: "8" },
  { question: "What is the first number in the sixth line?", correctAnswer: "3" },
  { question: "What is the number before 5 in the seventh line?", correctAnswer: "7" },
  { question: "What is the fourth number in the eighth line?", correctAnswer: "7" },
];

const PhysicalChartTest = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [coveringLeftEye, setCoveringLeftEye] = useState(true); // Toggle between eyes
  const [attemptCount, setAttemptCount] = useState(0); // Tracks number of attempts for a question
  const [recognizedSpeech, setRecognizedSpeech] = useState(''); 
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);

  useEffect(() => {
    const getMicrophonePermission = async () => {
      const { status } = await AV.Audio.requestPermissionsAsync(); // Request microphone permission
      setHasMicrophonePermission(status === 'granted'); 
    };

    getMicrophonePermission(); 
  }, []);

  // Function to play the current question aloud
  const playQuestion = (text) => {
    Speech.speak(text, { language: "en", rate: 1.0 });
  };

  // Handle Speech Input
  const handleSpeechInput = async () => {
    try {
      if (Voice && hasMicrophonePermission) { 
        await Voice.start('en-US'); 

        Voice.onSpeechResults = (results) => {
          const recognizedText = results[0]; 
          setRecognizedSpeech(recognizedText); 

          setTimeout(() => {
            const currentQuestion = physicalChartQuestions[currentQuestionIndex];

            if (recognizedText === currentQuestion.correctAnswer) {
              Alert.alert("Correct!", "Great job! Moving to the next question.");
              setAttemptCount(0); 
              setRecognizedSpeech(''); // Clear recognized speech

              if (currentQuestionIndex === physicalChartQuestions.length - 1) {
                // If the last question is answered correctly
                if (coveringLeftEye) {
                  setCoveringLeftEye(false);
                  setCurrentQuestionIndex(0);
                } else {
                  setTestComplete(true);
                }
              } else {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              }
            } else {
              if (attemptCount === 1) {
                Alert.alert("Incorrect", "Moving to the next question.");
                setAttemptCount(0); // Reset attempts for the next question
                setRecognizedSpeech(''); // Clear recognized speech

                if (currentQuestionIndex === physicalChartQuestions.length - 1) {
                  if (coveringLeftEye) {
                    setCoveringLeftEye(false);
                    setCurrentQuestionIndex(0);
                  } else {
                    setTestComplete(true);
                  }
                } else {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                }
              } else {
                setAttemptCount(attemptCount + 1);
                Alert.alert("Incorrect", "Please try again.");
                setRecognizedSpeech(''); // Clear recognized speech
              }
            }
          }, 1000); // Delay before validating answer
        };

        Voice.onSpeechEnd = (result) => {
          Voice.stop(); 
          setRecognizedSpeech(''); // Clear recognized speech after each attempt
        };

      } else {
        if (!hasMicrophonePermission) {
          Alert.alert(
            "Microphone Permission Denied",
            "Please grant microphone permission in your device settings.",
            [
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(), 
              },
              { text: "Cancel" },
            ]
          );
        } else {
          Alert.alert("Error", "Voice module is not available. Please check your library setup."); 
        }
      }
    } catch (error) {
      console.error("Speech recognition error:", error);
      setRecognizedSpeech(''); 
      Alert.alert('Speech Recognition Error', 'Please check microphone permissions and try again.'); 
    }
  };

  // Render the current question
  const renderCurrentQuestion = () => {
    const currentQuestion = physicalChartQuestions[currentQuestionIndex];
    const lineNumber = currentQuestionIndex + 1; // Calculate the line number (1-based index)
  
    return (
      <View style={styles.contentContainer}>
        <Image 
          source={coveringLeftEye ? leftEyeIcon : rightEyeIcon} 
          style={styles.eyeIcon} 
          resizeMode="contain" 
        />
        <View style={styles.textContainer}>
          <Text style={styles.lineText}>Line {lineNumber}</Text> {/* Display line number */}
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>
        <TouchableOpacity style={styles.speakButton} onPress={() => playQuestion(currentQuestion.question)}>
          <Text style={styles.speakButtonText}>Hear Question</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSpeechInput} style={styles.micButton}>
          <Image source={micIcon} style={styles.micIcon} />
        </TouchableOpacity>
        <Text style={styles.speakPrompt}>Speak Your Answer</Text>
        <Text style={styles.recognizedSpeechText}>{recognizedSpeech}</Text> 
      </View>
    );
  };
  
  

  // Render the results
  const renderResults = () => {
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>Test Complete!</Text>
        <Text style={styles.resultsText}>
          Great job! You successfully completed the test for both eyes.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {testComplete ? renderResults() : renderCurrentQuestion()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  eyeIcon: {
    width: 150,
    height: 150,
    marginBottom: 20,
    position: "absolute",
    top: 40,
  },
  questionText: {
    fontSize: 20,
    color: "#0057B7",
    textAlign: "center",
    marginTop: 160,
    marginBottom: 10,
  },
  speakButton: {
    backgroundColor: "#0057B7",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  speakButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  micButton: {
    backgroundColor: "#0057B7",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  lineText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0057B7",
    marginBottom: 5,
  },
  questionText: {
    fontSize: 20,
    color: "#0057B7",
    textAlign: "center",
  },
  
  
  micIcon: {
    width: 40,
    height: 40,
    tintColor: "#fff",
  },
  speakPrompt: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
  },
  recognizedSpeechText: { 
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  resultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  resultsText: {
    fontSize: 24,
    color: "#0057B7",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PhysicalChartTest;
