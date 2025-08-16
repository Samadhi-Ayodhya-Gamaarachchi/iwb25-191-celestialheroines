import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderSectionProps {
  childName: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ childName }) => {
  return (
    <LinearGradient
      colors={['#3b82f6', '#1e40af']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderRadius: 24,
        marginTop: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-white text-2xl font-extrabold mb-1">Good Morning! 🌅</Text>
          <Text className="text-indigo-200 text-base font-semibold">
            How is {childName} today?
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default HeaderSection;