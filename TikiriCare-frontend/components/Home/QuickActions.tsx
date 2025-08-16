import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AddGrowthModal from './AddGrowth'; // Import the modal

interface QuickActionsProps {
  // You can still keep this prop for external handling if needed
  onLogGrowth?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onLogGrowth }) => {
  const [showGrowthModal, setShowGrowthModal] = useState(false);

  const handleAddGrowthPress = () => {
    // You can either use the modal (recommended) or external handler
    if (onLogGrowth) {
      onLogGrowth(); // Use external handler if provided
    } else {
      setShowGrowthModal(true); // Show modal by default
    }
  };

  return (
    <>
      <View className="bg-white rounded-2xl p-6 mt-5 shadow-md">
        <View className="flex-row justify-between space-x-3">
          <TouchableOpacity
            onPress={handleAddGrowthPress}
            className="bg-blue-100 rounded-xl p-5 flex-1 items-center border-2 border-blue-300 shadow-md shadow-blue-400"
          >
            <Text className="text-3xl mb-2">📏</Text>
            <Text className="text-blue-900 font-bold text-xs">Add Growth</Text>
          </TouchableOpacity>
          
          
        </View>
      </View>

      {/* Add Growth Modal */}
      <AddGrowthModal
        visible={showGrowthModal}
        onClose={() => setShowGrowthModal(false)}
      />
    </>
  );
};

export default QuickActions;