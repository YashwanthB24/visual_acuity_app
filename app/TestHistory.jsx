import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { supabase } from '../supabase';
import { Alert } from 'react-native';

const TestHistory = () => {
  // State to store test results
  const [shortSightednessTests, setShortSightednessTests] = useState([]);
  const [longSightednessTests, setLongSightednessTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);

  // Fetch user profile and tests on component mount
  useEffect(() => {
    const fetchTestHistory = async () => {
      try {
        // Fetch user
        const { data: userResponse } = await supabase.auth.getUser();
        const user = userResponse?.user;

        if (!user) {
          Alert.alert('Error', 'User not logged in.');
          setLoading(false);
          return;
        }

        // Fetch profile ID
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profileError) throw profileError;

        setProfileId(profile?.id);

        // Fetch Short Sightedness Tests
        const { data: shortTests, error: shortError } = await supabase
          .from('short_sightedness_tests')
          .select('*')
          .eq('profile_id', profile.id)
          .order('test_date', { ascending: false });

        if (shortError) throw shortError;

        // Fetch Long Sightedness Tests
        const { data: longTests, error: longError } = await supabase
          .from('long_sightedness_tests')
          .select('*')
          .eq('profile_id', profile.id)
          .order('test_date', { ascending: false });

        if (longError) throw longError;

        setShortSightednessTests(shortTests);
        setLongSightednessTests(longTests);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching test history:', error);
        Alert.alert('Error', 'Failed to fetch test history.');
        setLoading(false);
      }
    };

    fetchTestHistory();
  }, []);

  // Render individual test card for short sightedness
  const renderShortSightednessTestCard = (test) => {
    return (
      <View key={test.id} style={styles.testCard}>
        <View style={styles.testCardRow}>
          <Text style={styles.testCardLabel}>Test Name:</Text>
          <Text style={styles.testCardValue}>{test.test_name}</Text>
        </View>
        <View style={styles.testCardRow}>
          <Text style={styles.testCardLabel}>Date:</Text>
          <Text style={styles.testCardValue}>
            {new Date(test.test_date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.testCardRow}>
          <Text style={styles.testCardLabel}>Time:</Text>
          <Text style={styles.testCardValue}>{test.test_time}</Text>
        </View>
        <View style={styles.testCardRow}>
          <Text style={styles.testCardLabel}>Left Eye Score:</Text>
          <Text style={styles.testCardValue}>{test.score_left_eye}</Text>
        </View>
        <View style={styles.testCardRow}>
          <Text style={styles.testCardLabel}>Right Eye Score:</Text>
          <Text style={styles.testCardValue}>{test.score_right_eye}</Text>
        </View>
      </View>
    );
  };

  // Render individual test card for long sightedness
  const renderLongSightednessTestCard = (test) => {
    return (
      <View key={test.id} style={styles.testCard}>
        <View style={styles.testCardRow}>
          <Text style={styles.testCardLabel}>Test Name:</Text>
          <Text style={styles.testCardValue}>{test.test_name}</Text>
        </View>
        <View style={styles.testCardRow}>
          <Text style={styles.testCardLabel}>Date:</Text>
          <Text style={styles.testCardValue}>
            {new Date(test.test_date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.testCardRow}>
          <Text style={styles.testCardLabel}>Time:</Text>
          <Text style={styles.testCardValue}>{test.test_time}</Text>
        </View>
        <View style={styles.testCardRow}>
          <Text style={styles.testCardLabel}>Score:</Text>
          <Text style={styles.testCardValue}>{test.score}</Text>
        </View>
      </View>
    );
  };

  // Render test section
  const renderTestSection = (tests, type) => {
    const title = type === 'short' 
      ? 'Short Sightedness Tests' 
      : 'Long Sightedness Tests';

    return (
      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>{title}</Text>
        
        {tests.length === 0 ? (
          <View style={styles.noTestContainer}>
            <Text style={styles.noTestText}>
              You have not taken any {title.toLowerCase()} yet.
            </Text>
          </View>
        ) : (
          <>
            {type === 'short' 
              ? tests.map(renderShortSightednessTestCard)
              : tests.map(renderLongSightednessTestCard)
            }
          </>
        )}
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0057B7" />
        <Text>Loading Test History...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Test History</Text>
      
      {renderTestSection(shortSightednessTests, 'short')}
      {renderTestSection(longSightednessTests, 'long')}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0057B7',
    textAlign: 'center',
    marginVertical: 40,
  },
  testSection: {
    marginBottom: 20,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0057B7',
    marginBottom: 10,
    textAlign: 'center',
  },
  testCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testCardRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  testCardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0057B7',
    width: '40%',
  },
  testCardValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  noTestContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  noTestText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TestHistory;