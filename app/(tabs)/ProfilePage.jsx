import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "../../supabase";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

export default function ProfilePage() {
  const navigation = useNavigation();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    mobile: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const calculateAge = (dob) => {
    if (!dob) return "Not Provided";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fetchProfiles = async () => {
    try {
      const { data: userResponse } = await supabase.auth.getUser();
      const user = userResponse?.user;

      if (!user) {
        Alert.alert("Error", "User not logged in.");
        navigation.navigate("SignInSignUp");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        const fetchedProfile = data[0];
        setProfile({
          id: fetchedProfile.id,
          firstName: fetchedProfile.first_name,
          lastName: fetchedProfile.last_name,
          dob: fetchedProfile.dob,
          gender: fetchedProfile.gender,
          mobile: fetchedProfile.mobile,
        });
        setEditMode(false);
      } else {
        setProfile(null);
        setEditMode(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch profiles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (editMode && !profile) {
          Alert.alert(
            "Incomplete Profile",
            "You must complete your profile before leaving this page.",
            [{ text: "OK", onPress: () => {} }]
          );
          return true; // Prevent default back navigation
        }
        return false; // Allow navigation for existing profiles or non-edit mode
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [editMode, profile])
  );

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        dob: selectedDate.toISOString().split("T")[0],
      }));
    }
  };

  const enterEditMode = () => {
    setFormData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      dob: profile?.dob || "",
      gender: profile?.gender || "",
      mobile: profile?.mobile || "",
    });
    setEditMode(true);
  };

  const handleSave = async () => {
    const { data: userResponse } = await supabase.auth.getUser();
    const user = userResponse?.user;

    if (!user) {
      Alert.alert("Error", "User not logged in.");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.mobile) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      if (profile?.id) {
        const { error } = await supabase
          .from("profiles")
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            dob: formData.dob,
            gender: formData.gender,
            mobile: formData.mobile,
          })
          .eq("id", profile.id);

        if (error) throw error;

        Alert.alert("Success", "Profile updated successfully.");
      } else {
        const { error } = await supabase.from("profiles").insert([
          {
            user_id: user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            dob: formData.dob,
            gender: formData.gender,
            mobile: formData.mobile,
          },
        ]);

        if (error) throw error;

        Alert.alert("Success", "Profile created successfully.");
      }

      setEditMode(false);
      fetchProfiles();
    } catch (error) {
      Alert.alert("Error", "Failed to save profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const initials =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
      : "";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (!profile && editMode) {
              Alert.alert(
                "Incomplete Profile",
                "You must complete your profile before leaving this page."
              );
            } else {
              navigation.navigate("HomePage");
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.separator} />

        {!editMode && profile && (
        <>
          <View style={styles.healthCardHeader}>
            <Text style={styles.healthCardTitle}>Health Card</Text>
            <TouchableOpacity onPress={enterEditMode}>
              <Text style={styles.editText}>EDIT</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.healthCard}>
            <Text style={styles.eyeConnectText}>EyeConnect</Text>
            <View style={styles.contentRow}>
              {initials && (
                <View style={styles.initialBox}>
                  <Text style={styles.initialText}>{initials}</Text>
                </View>
              )}
              <View style={styles.details}>
                <Text style={styles.detailName}>
                  {profile.firstName} {profile.lastName}
                </Text>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Date of Birth: </Text>
                  <Text style={styles.value}>{profile.dob || "Not Provided"}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Age: </Text>
                  <Text style={styles.value}>{calculateAge(profile.dob)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Gender: </Text>
                  <Text style={styles.value}>{profile.gender || "Not Provided"}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Mobile: </Text>
                  <Text style={styles.value}>{profile.mobile || "Not Provided"}</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.sectionButton}
            onPress={() => navigation.navigate("TestHistory", { profileId: profile?.id })}
          >
            <Text style={styles.sectionButtonText}>View Test History</Text>
            <Ionicons name="chevron-forward" size={24} color="#333" />
          </TouchableOpacity>
        </>
        )}


      {editMode && (
        <ScrollView>
          <Text style={styles.sectionTitle}>Edit Health Card</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name *"
            value={formData.firstName}
            onChangeText={(value) => handleInputChange("firstName", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name *"
            value={formData.lastName}
            onChangeText={(value) => handleInputChange("lastName", value)}
          />
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{formData.dob || "Select Date of Birth"}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderOption,
                formData.gender === "Male" && styles.genderSelected,
              ]}
              onPress={() => handleInputChange("gender", "Male")}
            >
              <Ionicons name="male" size={20} color="#333" />
              <Text style={styles.genderText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderOption,
                formData.gender === "Female" && styles.genderSelected,
              ]}
              onPress={() => handleInputChange("gender", "Female")}
            >
              <Ionicons name="female" size={20} color="#333" />
              <Text style={styles.genderText}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderOption,
                formData.gender === "Other" && styles.genderSelected,
              ]}
              onPress={() => handleInputChange("gender", "Other")}
            >
              <Ionicons name="transgender" size={20} color="#333" />
              <Text style={styles.genderText}>Other</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Mobile *"
            value={formData.mobile}
            onChangeText={(value) => handleInputChange("mobile", value)}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  /* Header Section */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },

  /* Horizontal Separator */
  separator: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginBottom: 20,
  },

  /* Health Card Header */
  healthCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  healthCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  editText: {
    fontSize: 16,
    color: "#0057B7",
    fontWeight: "bold",
  },

  /* Health Card */
  healthCard: {
    backgroundColor: "#EAF3FF",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
  },
  eyeConnectText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0057B7",
    marginBottom: 10,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  initialBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#D8C2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  initialText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  details: {
    flex: 1,
  },
  detailName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },

  /* Personal Details & Check Reports Section */
  sectionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  /* Scrollable Form Container */
  scrollContainer: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#F5F5F5",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  genderSelected: {
    backgroundColor: "#EAF3FF",
    borderColor: "#0057B7",
  },
  genderText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    marginRight: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#555",
  },
  saveButton: {
    backgroundColor: "#0057B7",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 18, color: "#333" },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "center",
  },
  genderSelected: {
    backgroundColor: "#EAF3FF",
    borderColor: "#0057B7",
  },
  genderText: {
    marginLeft: 5,
    fontSize: 16,
  },
});