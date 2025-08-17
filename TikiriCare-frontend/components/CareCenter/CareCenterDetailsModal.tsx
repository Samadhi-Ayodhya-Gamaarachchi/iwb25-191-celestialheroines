import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Caregiver } from '../../types/Caregiver';

interface CareCenterDetailsModalProps {
  visible: boolean;
  caregiver: Caregiver | null;
  onClose: () => void;
  onBook: (id: string) => void;
}

const CareCenterDetailsModal: React.FC<CareCenterDetailsModalProps> = ({
  visible,
  caregiver,
  onClose,
  onBook
}) => {
  if (!caregiver) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <LinearGradient
          colors={['#3b82f6', '#1e40af']}
          className="pt-12 pb-6 px-6"
        >
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={onClose} className="p-2">
              <Text className="text-white text-lg">✕</Text>
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">Care Center Details</Text>
            <View className="w-8" />
          </View>
        </LinearGradient>

        <ScrollView className="flex-1">
          {/* Hero Image */}
          <View className="relative">
            <Image 
              source={{ uri: caregiver.photo }} 
              className="w-full h-64"
              defaultSource={require('../../assets/images/react-logo.png')}
            />
          </View>

          {/* Main Info */}
          <View className="bg-white p-6 -mt-8 rounded-t-3xl relative z-10">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              {caregiver.name}
            </Text>
            <Text className="text-gray-600 text-base mb-4">
              📍 {caregiver.location}
            </Text>

            {/* Quick Info */}
            <View className="flex-row justify-between mb-6">
              <View className="bg-blue-50 rounded-xl p-4 flex-1 mr-2">
                <Text className="text-blue-600 font-bold text-lg">{caregiver.slots}</Text>
                <Text className="text-blue-600 text-sm">Available Slots</Text>
              </View>
              <View className="bg-green-50 rounded-xl p-4 flex-1 ml-2">
                <Text className="text-green-600 font-bold text-lg">{caregiver.rating}</Text>
                <Text className="text-green-600 text-sm">Star Rating</Text>
              </View>
            </View>

            {/* Features */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                🌟 Features & Amenities
              </Text>
              <View className="space-y-2">
                <View className="flex-row items-center p-3 bg-purple-50 rounded-lg">
                  <Text className="text-purple-600 mr-3">🍎</Text>
                  <Text className="text-purple-600 font-medium">Nutritious Meals Provided</Text>
                </View>
                <View className="flex-row items-center p-3 bg-orange-50 rounded-lg">
                  <Text className="text-orange-600 mr-3">🎨</Text>
                  <Text className="text-orange-600 font-medium">Creative Learning Activities</Text>
                </View>
                <View className="flex-row items-center p-3 bg-teal-50 rounded-lg">
                  <Text className="text-teal-600 mr-3">🚌</Text>
                  <Text className="text-teal-600 font-medium">Safe Transportation</Text>
                </View>
                <View className="flex-row items-center p-3 bg-blue-50 rounded-lg">
                  <Text className="text-blue-600 mr-3">👨‍⚕️</Text>
                  <Text className="text-blue-600 font-medium">Medical Care Available</Text>
                </View>
              </View>
            </View>

            {/* Schedule */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                🕐 Operating Hours
              </Text>
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-gray-700 mb-1">Monday - Friday: 7:00 AM - 6:00 PM</Text>
                <Text className="text-gray-700 mb-1">Saturday: 8:00 AM - 4:00 PM</Text>
                <Text className="text-gray-700">Sunday: Closed</Text>
              </View>
            </View>

            {/* Contact Info */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                📞 Contact Information
              </Text>
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-gray-700 mb-1">📱 Phone: +94 123 456 789</Text>
                <Text className="text-gray-700 mb-1">✉️ Email: contact@{caregiver.name.toLowerCase().replace(/\s+/g, '')}.lk</Text>
                <Text className="text-gray-700">🌐 Website: www.{caregiver.name.toLowerCase().replace(/\s+/g, '')}.lk</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Button */}
        <View className="bg-white p-6 border-t border-gray-200">
          <TouchableOpacity
            onPress={() => {
              onBook(caregiver.id);
              onClose();
            }}
            disabled={caregiver.status !== "available"}
            className={`rounded-xl py-4 ${
              caregiver.status === "available" 
                ? "bg-blue-500" 
                : "bg-gray-400"
            }`}
          >
            <Text className="text-white font-bold text-lg text-center">
              {caregiver.status === "available" ? "Book This Center" : "Not Available"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CareCenterDetailsModal;
