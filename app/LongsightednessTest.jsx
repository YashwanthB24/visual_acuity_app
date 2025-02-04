import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

// Import images for the charts
import jaegerChartImage from "@/assets/images/jaeger-chart.png";
import mnreadChartImage from "@/assets/images/mnread-chart.png";

export default function LongsightednessTest() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your Test</Text>
        <Text style={styles.headerSubtitle}>Select the chart type that suits you best</Text>
      </View>

      {/* Select Chart Type Section */}
      <View style={styles.cardContainer}>
        {/* Jaeger Chart Option */}
        <View style={styles.card}>
          <Image source={jaegerChartImage} style={styles.chartIcon} />
          <Text style={styles.cardTitle}>Jaeger Chart</Text>
          <Text style={styles.cardSubtitle}>
            The Jaeger Chart is designed for testing near vision acuity. Text is displayed in different font sizes.
          </Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => router.push("/JaegerChartTest")} // Navigate to Jaeger Chart Test
          >
            <Text style={styles.buttonText}>Select Jaeger Chart</Text>
          </TouchableOpacity>
        </View>


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 30,
  },
  header: {
    backgroundColor: "#0057B7",
    width: "100%",
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  cardContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: "100%",
    alignSelf: "center",
    minHeight: 180,
    position: "relative",
  },
  chartIcon: {
    width: 50,
    height: 50,
    position: "absolute",
    top: 10,
    right: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0057B7",
    textAlign: "center",
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 18,
  },
  selectButton: {
    backgroundColor: "#0057B7",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
