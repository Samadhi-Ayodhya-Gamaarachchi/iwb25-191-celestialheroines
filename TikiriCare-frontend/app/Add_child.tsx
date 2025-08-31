import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { childrenAPI } from '../services/api';

export default function AddChildScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dob, setDob] = useState(new Date()); // store as Date object
  const [gender, setGender] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Function to calculate age string from DOB
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }
    return `${years} years ${months} months`;
  };

  const handleSave = async () => {
    if (!name || !dob || !gender) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const ageString = calculateAge(dob);

    try {
      const result = await childrenAPI.addChild({
        name,
        gender,
        dateOfBirth: dob.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD string
        height: 0,
        weight: 0
      });

      if (result.success) {
        Alert.alert('Success', `Child added: ${result.data.name}`);
        router.back();
      } else {
        Alert.alert('Error', result.message || 'Failed to add child');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error or backend not running');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/ProfileScreen')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.header}>Add Child</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter child's name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{dob.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()} // prevent future dates
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDob(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Gender</Text>
        <TextInput
          style={styles.input}
          placeholder="Male / Female"
          value={gender}
          onChangeText={setGender}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="save" size={18} color="#fff" />
          <Text style={styles.saveButtonText}>Save Child</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: { marginRight: 10, padding: 5 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50' },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 5, color: '#495057' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});
