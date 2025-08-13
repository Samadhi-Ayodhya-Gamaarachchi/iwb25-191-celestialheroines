import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface QuickStatsProps {
  totalCenters: number;
  availableSlots: number;
  nearbyCount: number;
  averageRating: number;
}

const QuickStats: React.FC<QuickStatsProps> = ({
  totalCenters,
  availableSlots,
  nearbyCount,
  averageRating
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      className="mb-4"
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      <View className="flex-row space-x-4">
        {/* Total Centers */}
        <View className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 min-w-[120px] shadow-lg">
          <Text className="text-white text-2xl font-bold">{totalCenters}</Text>
          <Text className="text-blue-100 text-sm font-medium">Care Centers</Text>
        </View>

        {/* Available Slots */}
        <View className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 min-w-[120px] shadow-lg">
          <Text className="text-white text-2xl font-bold">{availableSlots}</Text>
          <Text className="text-green-100 text-sm font-medium">Available Slots</Text>
        </View>

        {/* Nearby Centers */}
        <View className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 min-w-[120px] shadow-lg">
          <Text className="text-white text-2xl font-bold">{nearbyCount}</Text>
          <Text className="text-purple-100 text-sm font-medium">Nearby</Text>
        </View>

        {/* Average Rating */}
        <View className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-4 min-w-[120px] shadow-lg">
          <Text className="text-white text-2xl font-bold">⭐ {averageRating.toFixed(1)}</Text>
          <Text className="text-yellow-100 text-sm font-medium">Avg Rating</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default QuickStats;
