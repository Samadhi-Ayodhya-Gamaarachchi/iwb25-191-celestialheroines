import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Caregiver } from '../../types/Caregiver';
import { Child } from '../../context/ChildContext';

interface CareCenterCardProps {
  caregiver: Caregiver;
  bookingStatus: string;
  selectedChild?: Child | null; // Add selected child prop
  onBooking: (id: string) => void;
  onViewDetails: (caregiver: Caregiver) => void;
}

const CareCenterCard: React.FC<CareCenterCardProps> = ({
  caregiver,
  bookingStatus,
  selectedChild,
  onBooking,
  onViewDetails
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return ['#10b981', '#059669'];
      case 'pending':
        return ['#f59e0b', '#d97706'];
      case 'approved':
        return ['#3b82f6', '#2563eb'];
      default:
        return ['#6b7280', '#4b5563'];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return selectedChild ? `Book for ${selectedChild.name.split(' ')[0]}` : 'Book Now';
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      default:
        return 'Unavailable';
    }
  };

  // Get age-appropriate care features based on child's age
  const getAgeAppropriateFeatures = () => {
    if (!selectedChild) return [];
    
    const ageInMonths = selectedChild.age.includes('y') 
      ? parseInt(selectedChild.age) * 12 + (selectedChild.age.includes('m') ? parseInt(selectedChild.age.split('y ')[1]) : 0)
      : parseInt(selectedChild.age);

    const features = [];
    
    if (ageInMonths < 12) {
      features.push({ icon: '🍼', label: 'Baby Care', color: 'bg-pink-50 text-pink-600' });
      features.push({ icon: '👶', label: 'Infant Care', color: 'bg-blue-50 text-blue-600' });
    } else if (ageInMonths < 24) {
      features.push({ icon: '🚶', label: 'Toddler Care', color: 'bg-green-50 text-green-600' });
      features.push({ icon: '🧸', label: 'Play Time', color: 'bg-yellow-50 text-yellow-600' });
    } else {
      features.push({ icon: '🎨', label: 'Activities', color: 'bg-purple-50 text-purple-600' });
      features.push({ icon: '📚', label: 'Learning', color: 'bg-indigo-50 text-indigo-600' });
    }
    
    return features;
  };

  return (
    <View className="bg-white rounded-2xl mx-4 mb-4 overflow-hidden shadow-lg">
      {/* Selected Child Banner */}
      {selectedChild && (
        <View className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2">
          <View className="flex-row items-center">
            <View 
              className="w-8 h-8 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: selectedChild.color }}
            >
              <Text className="text-white font-bold text-sm">
                {selectedChild.avatar}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-medium">
                Care for {selectedChild.name}
              </Text>
              <Text className="text-blue-100 text-xs">
                {selectedChild.age} • {selectedChild.gender}
              </Text>
            </View>
            {bookingStatus === 'pending' && (
              <View className="bg-yellow-400 rounded-full px-2 py-1">
                <Text className="text-yellow-900 text-xs font-bold">PENDING</Text>
              </View>
            )}
            {bookingStatus === 'approved' && (
              <View className="bg-green-400 rounded-full px-2 py-1">
                <Text className="text-green-900 text-xs font-bold">BOOKED</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Care Center Image */}
      <View className="relative">
        <Image 
          source={{ uri: caregiver.photo }} 
          className="w-full h-48"
          defaultSource={require('../../assets/images/react-logo.png')}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          className="absolute bottom-0 left-0 right-0 h-20"
        />
        <Text className="absolute bottom-3 left-4 text-white text-xl font-bold">
          {caregiver.name}
        </Text>
        
        {/* Rating Badge */}
        <View className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex-row items-center">
          <Text className="text-yellow-500 text-sm">⭐</Text>
          <Text className="text-gray-700 text-sm font-semibold ml-1">
            {caregiver.rating || '4.5'}
          </Text>
        </View>
      </View>

      {/* Care Center Details */}
      <View className="p-4">
        <View className="flex-row items-center mb-2">
          <Text className="text-gray-600 text-base">📍 {caregiver.location}</Text>
        </View>
        
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center space-x-4">
            <View className="bg-blue-50 rounded-lg px-3 py-1">
              <Text className="text-blue-600 font-semibold">
                👶 {caregiver.slots} Slots
              </Text>
            </View>
            <View className="bg-green-50 rounded-lg px-3 py-1">
              <Text className="text-green-600 font-semibold">
                🕐 Full Day
              </Text>
            </View>
          </View>
        </View>

        {/* Age-Appropriate Features or General Amenities */}
        <View className="flex-row flex-wrap mb-4">
          {selectedChild ? (
            // Show age-appropriate features
            getAgeAppropriateFeatures().map((feature, index) => (
              <View key={index} className={`${feature.color.split(' ')[0]} rounded-full px-3 py-1 mr-2 mb-2`}>
                <Text className={`${feature.color.split(' ').slice(1).join(' ')} text-sm`}>
                  {feature.icon} {feature.label}
                </Text>
              </View>
            ))
          ) : (
            // Show general amenities
            <>
              <View className="bg-purple-50 rounded-full px-3 py-1 mr-2 mb-2">
                <Text className="text-purple-600 text-sm">🍎 Meals</Text>
              </View>
              <View className="bg-orange-50 rounded-full px-3 py-1 mr-2 mb-2">
                <Text className="text-orange-600 text-sm">🎨 Activities</Text>
              </View>
              <View className="bg-teal-50 rounded-full px-3 py-1 mr-2 mb-2">
                <Text className="text-teal-600 text-sm">🚌 Transport</Text>
              </View>
            </>
          )}
        </View>

        {/* Child-Specific Information */}
        {selectedChild && (
          <View className="bg-gray-50 rounded-lg p-3 mb-4">
            <Text className="text-gray-700 text-sm font-medium mb-1">
              Suitable for {selectedChild.name}:
            </Text>
            <Text className="text-gray-600 text-xs">
              Age-appropriate care • Qualified staff • Safe environment
              {selectedChild.developmentScore && ` • Development support (${selectedChild.developmentScore}% progress)`}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={() => onViewDetails(caregiver)}
            className="flex-1 bg-gray-100 rounded-xl py-3"
          >
            <Text className="text-gray-700 font-semibold text-center">
              View Details
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            disabled={bookingStatus !== "available" || !selectedChild}
            onPress={() => onBooking(caregiver.id)}
            className="flex-1 rounded-xl py-3"
            style={{
              backgroundColor: !selectedChild ? "#9ca3af" :
                           bookingStatus === "available" ? "#3b82f6" : 
                           bookingStatus === "pending" ? "#f59e0b" : "#10b981",
              opacity: !selectedChild ? 0.6 : 1
            }}
          >
            <Text className="text-white font-semibold text-center">
              {!selectedChild ? 'Select Child' : getStatusText(bookingStatus)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CareCenterCard;