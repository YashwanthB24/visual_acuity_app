import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../supabase'; // Supabase client import

// Importing icons
import eyeIcon from '@/assets/images/eye-icon.png';
import shieldIcon from '@/assets/images/shield-icon.png';
import calendarIcon from '@/assets/images/calendar-icon.png';
import doctorAdviceImage from '@/assets/images/doctor-advice.png';

export default function HomePage() {
  
const router = useRouter();
const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

const checkProfile = async () => {
    const user = supabase.auth.user();
    if (!user) {
      router.push('/SignInSignUp');
      return;
    }

    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id);

    if (!profiles || profiles.length === 0) {
      Alert.alert('Profile Missing', 'You need to complete your profile.');
      router.push('/ProfilePage');
    }
};

React.useEffect(() => {
    checkProfile();
}, []);


const handleDoctorAdviceOption = (option) => {
    setModalVisible(false);
    if (option === 'Eye Exercise') {
      router.push('/EyeExerciseVideos'); // Navigate to the EyeExerciseVideos page
    } else if (option === 'Healthy Foods') {
      router.push('/HealthyFoodsPage'); // Navigate to the HealthyFoodsPage
    }
};

return (
<ScrollView contentContainerStyle={styles.container}>
{/* Welcome to EyeConnect Box */}
<View style={styles.header}>
<Text style={styles.headerTitle}>
Welcome to <Text style={{ fontWeight:'bold' }}>EyeConnect</Text>
</Text>
<Text style={styles.headerSubtitle}>Your vision care companion</Text>
</View>

{/* Start Your Free Eye Test Box */}
<View style={styles.card}>
<Text style={styles.cardTitle}>Start Your Free Eye Test</Text>
<Text style={styles.cardSubtitle}>Take a quick test to assess your vision health</Text>
<TouchableOpacity style={styles.beginTestButton} onPress={() => router.push('/Introduction')}>
<Text style={styles.buttonText}>Begin Test</Text>
</TouchableOpacity>
</View>

{/* Vision Acuity Test Benefits Box */}
<View style={styles.card}>
<Text style={styles.cardTitle}>Vision Acuity Test Benefits</Text>
<View style={styles.benefitItem}>
<Image source={eyeIcon} style={styles.icon} />
<Text style={styles.benefitText}>Analyze eye symptoms</Text>
</View>
<View style={styles.benefitItem}>
<Image source={shieldIcon} style={styles.icon} />
<Text style={styles.benefitText}>Preliminary Eye acuity test score</Text>
</View>
<View style={styles.benefitItem}>
<Image source={calendarIcon} style={styles.icon} />
<Text style={styles.benefitText}>Guide when to visit a doctor</Text>
</View>
</View>

{/* Doctor's Advice Box */}
<View style={styles.card}>
<TouchableOpacity onPress={() => setModalVisible(true)}>
<Text style={styles.doctorAdviceTitle}>Doctor's Advice</Text>
<Image source={doctorAdviceImage} style={styles.adviceImage} />
<Text style={styles.adviceText}>Early detection can save your eyes. </Text>
<Text style={styles.adviceText}>CLICK TO KNOW MORE </Text>
</TouchableOpacity>
</View>

{/* Modal for Options */}
<Modal
visible={modalVisible}
transparent={true}
animationType="slide"
onRequestClose={() => setModalVisible(false)}
>
<View style={styles.modalContainer}>
<View style={styles.modalContent}>
<Text style={styles.modalTitle}>Select an Option</Text>
<TouchableOpacity
style={styles.modalButton}
onPress={() => handleDoctorAdviceOption('Eye Exercise')}
>
<Text style={styles.modalButtonText}>Eye Exercise</Text>
</TouchableOpacity>
<TouchableOpacity
style={[styles.modalButton]}
onPress={() => handleDoctorAdviceOption('Healthy Foods')}
>
<Text style={styles.modalButtonText}>Healthy Foods</Text>
</TouchableOpacity>
<TouchableOpacity
style={[styles.modalButton]}
onPress={() => setModalVisible(false)}
>
<Text style={[styles.modalButtonText]}>Cancel</Text>
</TouchableOpacity>
</View>
</View>
</Modal>

</ScrollView> 
);
}

const styles = StyleSheet.create({
container:{
flexGrow :1,
backgroundColor:'#fff',
paddingBottom :20,
},
header:{
backgroundColor:'#0057B7',
width:'100%',
height :200,
justifyContent:'center',
alignItems:'center',
paddingHorizontal :20,
paddingTop :40,
marginTop :0,
marginBottom :20,
},
headerTitle:{
color:'#fff',
fontSize :24,
fontWeight :'bold',
textAlign:'center',
},
headerSubtitle:{
color:'#fff',
fontSize :16,
textAlign:'center',
},
card:{
backgroundColor:'#fff',
padding :20,
borderRadius :15,
marginBottom :20,
elevation :2,
marginHorizontal :20,
},
cardTitle:{
fontSize :18,
fontWeight :'bold',
marginBottom :10,
},
cardSubtitle:{
fontSize :14,
color:'#555',
marginBottom :20,
},
beginTestButton:{
backgroundColor:'#0057B7',
paddingVertical :15,
borderRadius :25,
alignItems :'center',
},
buttonText:{
color:'#fff',
fontSize :16,
fontWeight :'bold',
},
benefitItem:{
flexDirection:'row',
alignItems:'center',
marginBottom :15,
},
icon:{
width :24,
height :24,
marginRight :10,
},
benefitText:{
fontSize :14,
color :'#555',
},
doctorAdviceTitle:{
fontSize :18,
fontWeight :'bold',
textAlign :'center',
marginBottom :15,
},
adviceImage:{
width :'100%',
height :200,
borderRadius :10,
marginBottom :15,
},
adviceText:{
fontSize :14,
color :'#555',
textAlign :'center',
},
modalContainer:{
flex :1,
justifyContent :'center',
alignItems :'center',
backgroundColor :'rgba(0 ,0 ,0 ,0.5)',
},
modalContent:{
width :'80%',
backgroundColor :'#fff',
borderRadius :10,
padding :20,
alignItems :'center',
},
modalTitle:{
fontSize :18,
fontWeight :'bold',
marginBottom :20,
},
modalButton:{
backgroundColor:'#0057B7',
paddingVertical :10,
paddingHorizontal :20,
borderRadius :10,
marginBottom :10,
width :'100%',
alignItems :'center',
},
modalButtonText:{
color:'#fff',
fontSize :16,
fontWeight :'bold'
},

});
