// components/ChildrenSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ChildCard, Child } from './ChildCard';

interface ChildrenSectionProps {
  children: Child[];
  onAddChild: () => void;
  onChildPress: (childName: string) => void;
}

export const ChildrenSection: React.FC<ChildrenSectionProps> = ({
  children,
  onAddChild,
  onChildPress,
}) => {
  return (
    <View style={styles.childrenSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Children</Text>
        <TouchableOpacity style={styles.addChildButton} onPress={onAddChild}>
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.addChildText}>Add Child</Text>
        </TouchableOpacity>
      </View>

      {children.map((child) => (
        <ChildCard
          key={child.id}
          child={child}
          onPress={onChildPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  childrenSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
  },
  addChildButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addChildText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});