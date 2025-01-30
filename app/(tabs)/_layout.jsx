import { Tabs } from 'expo-router';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import homeIcon from '@/assets/images/home-icon.png';
import eyeIcon from '@/assets/images/eye.png';
import profileIcon from '@/assets/images/profile.png';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // This hides the header for all tabs
        tabBarStyle: {
          backgroundColor: 'white',
          height: 70,
          borderTopWidth: 1,
          borderTopColor: '#dcdcdc',
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarActiveTintColor: '#0057B7',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="HomePage"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image
              source={homeIcon}
              style={[
                styles.icon,
                { tintColor: focused ? '#0057B7' : 'gray' },
              ]}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* Test Tab */}
      <Tabs.Screen
        name="TestSelection"
        options={{
          title: 'Test',
          tabBarIcon: ({ focused }) => (
            <Image
              source={eyeIcon}
              style={[
                styles.icon,
                { tintColor: focused ? '#0057B7' : 'gray' },
              ]}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="ProfilePage"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Image
              source={profileIcon}
              style={[
                styles.icon,
                { tintColor: focused ? '#0057B7' : 'gray' },
              ]}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
  },
});
