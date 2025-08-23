import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [centerName, setCenterName] = useState('Little Stars Care Center');
  const [email, setEmail] = useState('info@littlestars.lk');
  const [mobile, setMobile] = useState('+94 77 123 4567');

  const handleSave = () => {
    // TODO: call API / dispatch action
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Center Name</Text>
        <TextInput value={centerName} onChangeText={setCenterName} style={styles.input} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Mobile</Text>
        <TextInput value={mobile} onChangeText={setMobile} keyboardType="phone-pad" style={styles.input} />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 25 },
  field: { marginBottom: 18 },
  label: { fontSize: 12, fontWeight: '600', color: '#555', marginBottom: 6, textTransform: 'uppercase' },
  input: {
    backgroundColor: '#f3f5f9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e5ea',
  },
  saveBtn: {
    backgroundColor: '#667eea',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelText: { color: '#667eea', fontWeight: '600' },
});

export default EditProfileScreen;