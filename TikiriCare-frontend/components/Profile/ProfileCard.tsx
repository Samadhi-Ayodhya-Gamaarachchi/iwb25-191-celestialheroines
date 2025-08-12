// components/ProfileCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ProfileCardProps {
  name: string;
  role: string;
  phone: string;
  email: string;
  avatar?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  name, 
  role, 
  phone, 
  email, 
  avatar = 'S' 
}) => {
  return (
    <View style={styles.profileCard}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatar}</Text>
        </View>
      </View>
      
      <Text style={styles.profileName}>{name}</Text>
      <Text style={styles.profileRole}>{role}</Text>
      
      <View style={styles.contactInfo}>
        <View style={styles.contactRow}>
          <Ionicons name="call" size={16} color="#28A745" />
          <Text style={styles.contactText}>{phone}</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="mail" size={16} color="#4A90E2" />
          <Text style={styles.contactText}>{email}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 20,
  },
  contactInfo: {
    alignItems: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#495057',
  },
});