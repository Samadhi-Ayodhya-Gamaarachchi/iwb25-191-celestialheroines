import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CareTip } from './HomeType';

interface CareTipsProps {
  careTips: CareTip[];
  currentTipIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

const CareTips: React.FC<CareTipsProps> = ({ 
  careTips, 
  currentTipIndex, 
  onNext, 
  onPrevious 
}) => {
  const currentTip = careTips[currentTipIndex];

  return (
    <View className="bg-white rounded-2xl p-6 mt-5 shadow-md">
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <Text className="text-3xl mr-3">💡</Text>
          <Text className="text-gray-900 text-xl font-extrabold">Daily Care Tips</Text>
        </View>
        <View className="bg-blue-100 px-3 py-1 rounded-xl border border-blue-300">
          <Text className="text-blue-700 text-xs font-bold">
            {currentTipIndex + 1}/{careTips.length}
          </Text>
        </View>
      </View>

      <LinearGradient
        colors={['#fed7aa', '#fdba74']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 12,
          padding: 20,
          borderLeftWidth: 4,
          borderLeftColor: '#ea580c'
        }}
      >
        <View className="flex-row items-center mb-4">
          <Text className="text-4xl mr-4">{currentTip.emoji}</Text>
          <View>
            <Text className="text-orange-900 font-bold text-lg mb-1">{currentTip.title}</Text>
            <Text className="text-orange-700 font-semibold text-xs">{currentTip.category}</Text>
          </View>
        </View>
        <Text className="text-orange-900 text-sm font-medium mb-4 leading-5">
          {currentTip.tip}
        </Text>

        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={onPrevious}
            className="bg-orange-600 px-4 py-2 rounded-xl shadow-md"
          >
            <Text className="text-white font-bold text-sm">← Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onNext}
            className="bg-orange-600 px-4 py-2 rounded-xl shadow-md"
          >
            <Text className="text-white font-bold text-sm">Next →</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default CareTips;
