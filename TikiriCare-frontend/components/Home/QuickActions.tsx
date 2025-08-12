import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface QuickActionsProps {
  onLogGrowth?: () => void;
  onAddMedicine?: () => void;
  onBookCheckup?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  onLogGrowth, 
  onAddMedicine, 
  onBookCheckup 
}) => {
  return (
    <View className="bg-white rounded-2xl p-6 mt-5 shadow-md">
      <View className="flex-row items-center mb-6">
        <Text className="text-3xl mr-3">⚡</Text>
        <Text className="text-gray-900 text-xl font-extrabold">Quick Actions</Text>
      </View>

      <View className="flex-row justify-between space-x-3">
        <TouchableOpacity 
          onPress={onLogGrowth}
          className="bg-blue-100 rounded-xl p-5 flex-1 items-center border-2 border-blue-300 shadow-md shadow-blue-400"
        >
          <Text className="text-3xl mb-2">📏</Text>
          <Text className="text-blue-900 font-bold text-xs">Log Growth</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onAddMedicine}
          className="bg-green-100 rounded-xl p-5 flex-1 items-center border-2 border-green-300 shadow-md shadow-green-400"
        >
          <Text className="text-3xl mb-2">💊</Text>
          <Text className="text-green-900 font-bold text-xs">Add Medicine</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onBookCheckup}
          className="bg-red-100 rounded-xl p-5 flex-1 items-center border-2 border-red-300 shadow-md shadow-red-400"
        >
          <Text className="text-3xl mb-2">🩺</Text>
          <Text className="text-red-900 font-bold text-xs">Book Checkup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QuickActions;