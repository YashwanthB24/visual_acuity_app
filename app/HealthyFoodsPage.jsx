import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const foods = [
  {
    id: 1,
    name: 'Carrots',
    image: require('@/assets/images/carrots.png'),
    points: [
      'Rich in beta-carotene which converts to Vitamin A.',
      'Improves night vision and keeps your eyes moist.',
    ],
  },
  {
    id: 2,
    name: 'Oranges',
    image: require('@/assets/images/oranges.png'),
    points: [
      'Loaded with Vitamin C which supports healthy blood vessels in the eyes.',
      'Reduces the risk of cataracts and macular degeneration.',
    ],
  },
  {
    id: 3,
    name: 'Spinach',
    image: require('@/assets/images/spinach.png'),
    points: [
      'High in lutein and zeaxanthin, which protect the eyes from harmful light.',
      'Prevents eye diseases like macular degeneration.',
    ],
  },
  {
    id: 4,
    name: 'Fish',
    image: require('@/assets/images/fish.png'),
    points: [
      'Rich in omega-3 fatty acids which prevent dry eyes.',
      'Supports the structure of the eye’s retina.',
    ],
  },
  {
    id: 5,
    name: 'Almonds',
    image: require('@/assets/images/almonds.png'),
    points: [
      'Packed with Vitamin E that protects eyes from free-radical damage.',
      'Lowers the risk of age-related eye issues like cataracts.',
    ],
  },
  {
    id: 6,
    name: 'Blueberries',
    image: require('@/assets/images/blueberries.png'),
    points: [
      'Packed with antioxidants that improve night vision.',
      'Reduces the risk of macular degeneration and retinal damage.',
    ],
  },
];

export default function HealthyFoodsPage() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Healthy Foods for Your Eyes</Text>
        <Text style={styles.headerSubtitle}>
          Enhance your vision with nutrient-packed foods!
        </Text>
      </View>

      {/* Food Cards */}
      {foods.map((food) => (
        <View key={food.id} style={styles.foodCard}>
          <Image source={food.image} style={styles.foodImage} />
          <View style={styles.textContainer}>
            <Text style={styles.foodName}>{food.name}</Text>
            {food.points.map((point, index) => (
              <Text key={index} style={styles.foodPoint}>
                • {point}
              </Text>
            ))}
          </View>
        </View>
      ))}

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
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
    marginTop: 0, // Touches the top of the screen
    marginBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  foodCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0057B7',
    marginBottom: 5,
  },
  foodPoint: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  backButton: {
    backgroundColor: '#0057B7',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
