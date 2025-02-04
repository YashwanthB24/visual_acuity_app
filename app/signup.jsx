import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../supabase'; // Supabase client import
import healthykids from '@/assets/images/Healthykidicon.png';
import googleIcon from '@/assets/images/google.png';
import appleIcon from '@/assets/images/apple-icon.png';

export default function SignInSignUp() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuthAction = async () => {
    setLoading(true);
    try {
      if (isSignIn) {
        const { data: session, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Check if the user has completed a profile
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id);

        if (profilesError) throw profilesError;

        if (profiles.length === 0) {
          Alert.alert('Profile Incomplete', 'Please complete your profile.');
          router.push('/ProfilePage'); // Redirect to profile page
        } else {
          Alert.alert('Success', 'You have signed in successfully!');
          router.push('/HomePage'); // Redirect to home page
        }
      } else {
        if (password !== confirmPassword) {
          Alert.alert('Error', 'Passwords do not match!');
          return;
        }

        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        Alert.alert('Success', 'Account created! Check your email for confirmation.');
        setIsSignIn(true);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
    } catch (error) {
      Alert.alert('OAuth Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={healthykids} style={styles.logoImage} resizeMode="contain" />
        <Text style={styles.visionText}>
          Vision <Text style={styles.gradientText}>Acuity Test</Text>
        </Text>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => setIsSignIn(true)}>
          <Text style={[styles.toggleText, isSignIn && styles.activeTab]}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsSignIn(false)}>
          <Text style={[styles.toggleText, !isSignIn && styles.activeTab]}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        {!isSignIn && (
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleAuthAction} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Loading...' : isSignIn ? 'Sign In' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or sign in with</Text>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={() => handleOAuthSignIn('google')}>
            <Image source={googleIcon} style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => handleOAuthSignIn('apple')}>
            <Image source={appleIcon} style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 20, marginTop: 30 },
  logoImage: { width: 100, height: 100 },
  visionText: { fontSize: 27, fontWeight: 'bold', color: '#0057B7' },
  gradientText: { color: '#0057B7' },
  toggleContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  toggleText: { fontSize: 20, marginHorizontal: 10, color: 'gray' },
  activeTab: { color: '#0057B7', textDecorationLine: 'underline' },
  formContainer: { padding: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, marginBottom: 15, padding: 10 },
  button: { backgroundColor: '#0057B7', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18 },
  orText: { textAlign: 'center', marginVertical: 15, color: '#555' },
  socialButtonsContainer: { marginTop: 10 },
  socialButton: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', marginBottom: 10 },
  socialIcon: { width: 24, height: 24, marginRight: 10 },
  socialButtonText: { fontSize: 16, color: '#555' },
});
