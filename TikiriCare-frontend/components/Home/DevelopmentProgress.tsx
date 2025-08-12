import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DevelopmentMilestone } from './HomeType';

interface DevelopmentProgressProps {
  milestones: DevelopmentMilestone[];
  developmentScore: number;
}

const DevelopmentProgress: React.FC<DevelopmentProgressProps> = ({ 
  milestones, 
  developmentScore 
}) => {
  return (
    <View className="bg-white rounded-2xl p-6 mt-5 shadow-md">
      <View className="flex-row items-center mb-6">
        <Text className="text-3xl mr-3">🎯</Text>
        <Text className="text-gray-900 text-xl font-extrabold">Development Progress</Text>
      </View>

      {milestones.map((milestone, index) => (
        <View key={index} className="mb-5">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
              <Text className="text-xl mr-3">{milestone.emoji}</Text>
              <Text className="text-gray-700 text-base font-semibold">{milestone.category}</Text>
            </View>
            <Text
              className={`text-sm font-bold px-3 py-1 rounded-full bg-${milestone.color} bg-opacity-20 text-${milestone.color}`}
            >
              {milestone.progress}%
            </Text>
          </View>

          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View
              className={`h-full rounded-full bg-${milestone.color}`}
              style={{ width: `${milestone.progress}%` }}
            />
          </View>
        </View>
      ))}

      <LinearGradient
        colors={['#dbeafe', '#bfdbfe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 12,
          padding: 20,
          alignItems: 'center',
          marginTop: 8,
          borderWidth: 1,
          borderColor: '#93c5fd'
        }}
      >
        <Text className="text-blue-900 text-lg font-semibold mb-1">Overall Development Score</Text>
        <Text className="text-blue-700 text-4xl font-extrabold mb-1">{developmentScore}/100</Text>
        <Text className="text-blue-600 text-sm font-semibold">Excellent progress! 🌟</Text>
      </LinearGradient>
    </View>
  );
};

export default DevelopmentProgress;