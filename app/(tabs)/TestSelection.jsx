import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';

// Importing images
import shortsightednessImage from '@/assets/images/shortsightedness.png';
import longsightednessImage from '@/assets/images/longsightedness.png';

const TestSelection = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const navigateToTest = (testType, mode) => {
    let path = '';

    if (testType === 'shortsightedness') {
      path =
        mode === 'speech'
          ? '/ShortsightednessTest'
          : '/ShortsightednessTestOptions';
    } else {
      path =
        mode === 'speech' ? '/JaegerChartTest' : '/JaegerChartTestOptions';
    }

    router.push(path);
  };

  const handleTestSelection = (testType) => {
    setSelectedTest(testType);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTest(null);
  };

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
              onPress={() => handleTestSelection('shortsightedness')}
            >
              <Text style={styles.buttonText}>
                Select Shortsightedness Test
              </Text>
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
              onPress={() => handleTestSelection('longsightedness')}
            >
              <Text style={styles.buttonText}>
                Select Longsightedness Test
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Custom Modal for Test Mode Selection */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Choose Test Mode</Text>
            <Text style={styles.modalText}>
              Would you like to take the test with or without speech
              recognition?
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                closeModal();
                navigateToTest(selectedTest, 'text');
              }}
            >
              <Text style={styles.modalButtonText}>Without Speech</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                closeModal();
                navigateToTest(selectedTest, 'speech');
              }}
            >
              <Text style={styles.modalButtonText}>With Speech</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={closeModal}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#0057B7',
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  cardContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    width: '95%',
    alignSelf: 'center',
    minHeight: 140,
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
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  testImage: {
    width: 90,
    height: 90,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 25,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0057B7',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButton: {
    backgroundColor: '#0057B7',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  modalCancelButton: {
    backgroundColor: '#888',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TestSelection;
