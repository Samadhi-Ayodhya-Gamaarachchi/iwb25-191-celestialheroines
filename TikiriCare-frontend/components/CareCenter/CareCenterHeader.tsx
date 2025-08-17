import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CareCenterHeaderProps {
  totalCenters: number;
  availableSlots: number;
}

const CareCenterHeader: React.FC<CareCenterHeaderProps> = ({ 
  totalCenters, 
  availableSlots 
}) => {
  return (
    <LinearGradient
      colors={['#3b82f6', '#1e40af']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderRadius: 24,
        marginTop: 20,
        marginBottom: 20,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-white text-2xl font-extrabold mb-1">
            Care Centers 🏫
          </Text>
          <Text className="text-blue-200 text-base font-semibold">
            Find the perfect care for your child
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-white text-lg font-bold">
            {availableSlots}
          </Text>
          <Text className="text-blue-200 text-xs">
            Available Slots
          </Text>
        </View>
      </View>
      
      <View className="flex-row justify-between mt-4">
        <View className="bg-white/20 rounded-lg px-3 py-2">
          <Text className="text-white text-sm font-semibold">
            {totalCenters} Centers
          </Text>
        </View>
        <View className="bg-white/20 rounded-lg px-3 py-2">
          <Text className="text-white text-sm font-semibold">
            Book Now
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default CareCenterHeader;
