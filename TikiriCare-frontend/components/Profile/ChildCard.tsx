// components/ChildCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useChild, Child } from '../../context/ChildContext';

interface ChildCardProps {
  child: Child;
  onPress: (childName: string) => void;
}

export const ChildCard: React.FC<ChildCardProps> = ({ child, onPress }) => {
  const { selectedChild } = useChild();
  const isSelected = selectedChild?.id === child.id;

  const handlePress = () => {
    onPress(child.name);
  };

  const handleInfoPress = () => {
    // Handle info button press - could show child details modal or navigate to child profile
    console.log(`Info pressed for ${child.name}`);
  };

  return (
    <TouchableOpacity
      style={[
        styles.childCard,
        isSelected && styles.selectedCard
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[styles.childAvatar, { backgroundColor: child.color }]}>
        <Text style={styles.childAvatarText}>{child.avatar}</Text>
      </View>
      
      <View style={styles.childInfo}>
        <Text style={[styles.childName, isSelected && styles.selectedText]}>
          {child.name}
        </Text>
        <Text style={[styles.childDetails, isSelected && styles.selectedSubtext]}>
          {child.age} • {child.gender}
        </Text>
        {isSelected && child.lastCheckup && (
          <Text style={styles.lastCheckup}>
            Last checkup: {child.lastCheckup}
          </Text>
        )}
      </View>
      
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.childInfoButton} 
        onPress={handleInfoPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons 
          name="information-circle-outline" 
          size={20} 
          color={isSelected ? "#10b981" : "#4A90E2"} 
        />
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
    shadowColor: '#10b981',
    shadowOpacity: 0.1,
    elevation: 5,
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
  selectedText: {
    color: '#065f46',
  },
  childDetails: {
    fontSize: 14,
    color: '#6C757D',
  },
  selectedSubtext: {
    color: '#047857',
  },
  lastCheckup: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 2,
    fontWeight: '500',
  },
  selectedIndicator: {
    marginRight: 10,
  },
  childInfoButton: {
    padding: 5,
  },
});