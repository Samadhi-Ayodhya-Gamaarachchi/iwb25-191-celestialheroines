// components/ChildCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface Child {
  id: number;
  name: string;
  age: string;
  gender: string;
  avatar: string;
  color: string;
}

interface ChildCardProps {
  child: Child;
  onPress: (childName: string) => void;
}

export const ChildCard: React.FC<ChildCardProps> = ({ child, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.childCard}
      onPress={() => onPress(child.name)}
    >
      <View style={[styles.childAvatar, { backgroundColor: child.color }]}>
        <Text style={styles.childAvatarText}>{child.avatar}</Text>
      </View>
      <View style={styles.childInfo}>
        <Text style={styles.childName}>{child.name}</Text>
        <Text style={styles.childDetails}>
          {child.age} • {child.gender}
        </Text>
      </View>
      <TouchableOpacity style={styles.childInfoButton}>
        <Ionicons name="information-circle-outline" size={20} color="#4A90E2" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  childAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  childAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  childDetails: {
    fontSize: 14,
    color: '#6C757D',
  },
  childInfoButton: {
    padding: 5,
  },
});