import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

interface SearchFiltersProps {
  searchName: string;
  setSearchName: (text: string) => void;
  searchLocation: string;
  setSearchLocation: (text: string) => void;
  onFilterPress: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchName,
  setSearchName,
  searchLocation,
  setSearchLocation,
  onFilterPress
}) => {
  return (
    <View className="mb-4">
      {/* Search Inputs */}
      <View className="space-y-3">
        <View className="bg-white rounded-xl shadow-sm">
          <TextInput
            placeholder="🔍 Search by care center name..."
            value={searchName}
            onChangeText={setSearchName}
            className="p-4 text-gray-700 text-base"
            placeholderTextColor="#9ca3af"
          />
        </View>
        
        <View className="bg-white rounded-xl shadow-sm">
          <TextInput
            placeholder="📍 Search by location..."
            value={searchLocation}
            onChangeText={setSearchLocation}
            className="p-4 text-gray-700 text-base"
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {/* Filter Options */}
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity 
          onPress={onFilterPress}
          className="bg-blue-500 rounded-xl px-6 py-3 shadow-sm"
        >
          <Text className="text-white font-semibold text-center">
            🔽 Filters
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-green-500 rounded-xl px-6 py-3 shadow-sm">
          <Text className="text-white font-semibold text-center">
            📍 Near Me
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-purple-500 rounded-xl px-6 py-3 shadow-sm">
          <Text className="text-white font-semibold text-center">
            ⭐ Top Rated
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchFilters;
