import React from 'react';
import { View, Text } from 'react-native';
import { ChildData } from './HomeType';

interface ChildInfoCardProps {
  childData: ChildData;
}

const ChildInfoCard: React.FC<ChildInfoCardProps> = ({ childData }) => {
  return (
    <View className="bg-white rounded-2xl p-6 mt-5 shadow-md">
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-gray-900 text-xl font-extrabold mb-1">
            👶 {childData.name} ({childData.age})
          </Text>
          <Text className="text-gray-500 font-semibold text-sm">
            Last check-up: {childData.lastCheckup}
          </Text>
        </View>
        <View className="bg-green-100 px-4 py-2 rounded-full border border-green-300">
          <Text className="text-green-800 font-bold text-xs">✨ Healthy</Text>
        </View>
      </View>

      <View className="bg-gray-50 rounded-xl p-5 flex-row justify-between">
        <View className="flex-1 items-center">
          <Text className="text-3xl mb-2">📏</Text>
          <Text className="text-gray-900 text-lg font-extrabold mb-1">{childData.height} cm</Text>
          <Text className="text-gray-500 font-semibold text-xs">Height</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-3xl mb-2">⚖️</Text>
          <Text className="text-gray-900 text-lg font-extrabold mb-1">{childData.weight} kg</Text>
          <Text className="text-gray-500 font-semibold text-xs">Weight</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-3xl mb-2">📈</Text>
          <Text className="text-gray-900 text-lg font-extrabold mb-1">{childData.bmi}</Text>
          <Text className="text-gray-500 font-semibold text-xs">BMI</Text>
        </View>
      </View>
    </View>
  );
};

export default ChildInfoCard;