// components/ChildrenSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ChildCard } from './ChildCard';
import { useChild } from '../../context/ChildContext';

interface ChildrenSectionProps {
  onAddChild: () => void;
  onChildPress?: (childName: string) => void; // Optional callback for navigation
}

export const ChildrenSection: React.FC<ChildrenSectionProps> = ({
  onAddChild,
  onChildPress,
}) => {
  const { children, setSelectedChild } = useChild();

  const handleChildPress = (childName: string) => {
    const child = children.find(c => c.name === childName);
    if (child) {
      setSelectedChild(child);
      console.log(`Selected child: ${child.name}`); // For debugging
    }
    
    // Call optional callback if provided (for navigation)
    if (onChildPress) {
      onChildPress(childName);
    }
  };

  return (
    <View style={styles.childrenSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Children</Text>
        <TouchableOpacity style={styles.addChildButton} onPress={onAddChild}>
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.addChildText}>Add Child</Text>
        </TouchableOpacity>
      </View>

      {children.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No children added yet</Text>
          <Text style={styles.emptyStateSubtext}>Tap "Add Child" to get started</Text>
        </View>
      ) : (
        children.map((child) => (
          <ChildCard
            key={child.id}
            child={child}
            onPress={handleChildPress}
          />
        ))
      )}
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
    backgroundColor: '#1e40af',
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
  emptyState: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6c757d',
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#adb5bd',
  },
});