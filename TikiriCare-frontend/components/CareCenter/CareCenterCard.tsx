import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Caregiver } from '../../types/Caregiver';

interface CareCenterCardProps {
  caregiver: Caregiver;
  bookingStatus: string;
  onBooking: (id: string) => void;
  onViewDetails: (caregiver: Caregiver) => void;
}

const CareCenterCard: React.FC<CareCenterCardProps> = ({
  caregiver,
  bookingStatus,
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
        return 'Book Now';
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      default:
        return 'Unavailable';
    }
  };

  return (
    <View className="bg-white rounded-2xl mx-4 mb-4 overflow-hidden shadow-lg">
      {/* Care Center Image */}
      <View className="relative">
        <Image 
          source={{ uri: caregiver.photo }} 
          className="w-full h-48"
          defaultSource={require('../../assets/images/react-logo.png')}
        />
        <View className="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1">
          <Text className="text-yellow-600 font-bold">⭐ {caregiver.rating}</Text>
        </View>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          className="absolute bottom-0 left-0 right-0 h-20"
        />
        <Text className="absolute bottom-3 left-4 text-white text-xl font-bold">
          {caregiver.name}
        </Text>
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

        {/* Amenities */}
        <View className="flex-row flex-wrap mb-4">
          <View className="bg-purple-50 rounded-full px-3 py-1 mr-2 mb-2">
            <Text className="text-purple-600 text-sm">🍎 Meals</Text>
          </View>
          <View className="bg-orange-50 rounded-full px-3 py-1 mr-2 mb-2">
            <Text className="text-orange-600 text-sm">🎨 Activities</Text>
          </View>
          <View className="bg-teal-50 rounded-full px-3 py-1 mr-2 mb-2">
            <Text className="text-teal-600 text-sm">🚌 Transport</Text>
          </View>
        </View>

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
            disabled={bookingStatus !== "available"}
            onPress={() => onBooking(caregiver.id)}
            className="flex-1 rounded-xl py-3"
            style={{
              backgroundColor: bookingStatus === "available" ? "#3b82f6" : 
                             bookingStatus === "pending" ? "#f59e0b" : "#10b981"
            }}
          >
            <Text className="text-white font-semibold text-center">
              {getStatusText(bookingStatus)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CareCenterCard;
