// components/NavigationTabs.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TabItem {
  id: string;
  label: string;
  onPress?: () => void;
}

interface NavigationTabsProps {
  tabs: TabItem[];
  activeTabId?: string;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ 
  tabs, 
  activeTabId = 'children' 
}) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity 
          key={tab.id}
          style={[styles.tab, activeTabId === tab.id && styles.activeTab]}
          onPress={tab.onPress}
        >
          <Text style={[
            styles.tabText, 
            activeTabId === tab.id && styles.activeTabText
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#1e40af',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C757D',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
});