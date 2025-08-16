import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Tab, TabName } from '../Health/HealthTypes';

interface NavigationTabsProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = [
    { name: 'Growth', emoji: '📈' },
    { name: 'Vaccines', emoji: '💉' },
    { name: 'Records', emoji: '📋' }
  ];

  return (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      marginBottom: 4,
      overflow: 'hidden'
    }}>
      <View style={{ flexDirection: 'row' }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            onPress={() => onTabChange(tab.name as TabName)}
            style={{
              flex: 1,
              paddingVertical: 14,
              paddingHorizontal: 8,
              backgroundColor: activeTab === tab.name ? '#1e40af' : 'transparent',
              marginHorizontal: activeTab === tab.name ? 4 : 0,
              marginVertical: activeTab === tab.name ? 4 : 0,
              borderRadius: activeTab === tab.name ? 12 : 0,
              alignItems: 'center'
            }}
          >
            <Text style={{
              fontSize: 16,
              marginBottom: 2
            }}>
              {tab.emoji}
            </Text>
            <Text style={{
              fontWeight: '600',
              fontSize: 13,
              color: activeTab === tab.name ? 'white' : '#64748b'
            }}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default NavigationTabs;