import React, { useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  SafeAreaView, 
  StatusBar,
  Alert,
  RefreshControl 
} from "react-native";
import { Caregiver } from "../types/Caregiver";
import { useChild } from "../context/ChildContext"; // Import the context
import caregiversData from "../assets/caregivers.json";

// Import new components
import CareCenterHeader from "../components/CareCenter/CareCenterHeader";
import SearchFilters from "../components/CareCenter/SearchFilters";
import CareCenterCard from "../components/CareCenter/CareCenterCard";
import CareCenterDetailsModal from "../components/CareCenter/CareCenterDetailsModal";

export default function CareCenterScreen() {
  // Get child context
  const { selectedChild, children } = useChild();
  
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  // Only allow one booking at a time
  const [bookedCenterId, setBookedCenterId] = useState<string | null>(null);
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter caregivers based on search criteria
  const filteredCaregivers = (caregiversData as Caregiver[]).filter(
    (c) =>
      c.name.toLowerCase().includes(searchName.toLowerCase()) &&
      c.location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  // Calculate statistics
  const totalSlots = filteredCaregivers.reduce((sum, center) => sum + center.slots, 0);
  const nearbyCount = filteredCaregivers.filter(c => c.location.toLowerCase().includes("colombo")).length;
  const averageRating = filteredCaregivers.reduce((sum, center) => sum + center.rating, 0) / filteredCaregivers.length || 0;

  // Handle booking with child validation
  const handleBooking = (id: string) => {
    // Check if a child is selected
    if (!selectedChild) {
      Alert.alert(
        "No Child Selected",
        "Please select a child from your profile to book a care center.",
        [{ text: "OK" }]
      );
      return;
    }

    if (bookedCenterId && bookedCenterId !== id) {
      Alert.alert(
        "Booking Limit",
        "You can only book one care center at a time. Please cancel your existing booking to book another.",
        [{ text: "OK" }]
      );
      return;
    }

    const center = filteredCaregivers.find(c => c.id === id);
    Alert.alert(
      "Confirm Booking",
      `Would you like to book a slot at ${center?.name} for ${selectedChild.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Book Now", 
          onPress: () => {
            setBookedCenterId(id);
            Alert.alert(
              "Success", 
              `Booking request sent for ${selectedChild.name}! You'll receive a confirmation soon.`
            );
          }
        }
      ]
    );
  };

  // Handle view details
  const handleViewDetails = (caregiver: Caregiver) => {
    setSelectedCaregiver(caregiver);
    setIsModalVisible(true);
  };

  // Handle filter press
  const handleFilterPress = () => {
    Alert.alert("Filters", "Advanced filtering options coming soon!");
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert("Refreshed", "Care center data updated!");
    }, 1000);
  };

  // Render individual care center card
  const renderCaregiver = ({ item }: { item: Caregiver }) => {
    let bookingStatus = item.status;
    if (bookedCenterId) {
      if (bookedCenterId === item.id) {
        bookingStatus = "pending";
      } 
    }
    return (
      <CareCenterCard
        caregiver={item}
        bookingStatus={bookingStatus}
        selectedChild={selectedChild}
        onBooking={handleBooking}
        onViewDetails={handleViewDetails}
      />
    );
  };

  // Empty state component
  const EmptyState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Text className="text-6xl mb-4">🏫</Text>
      <Text className="text-xl font-bold text-gray-800 mb-2">No Care Centers Found</Text>
      <Text className="text-gray-600 text-center px-8">
        Try adjusting your search criteria or check back later for new centers.
      </Text>
    </View>
  );

  // No child selected state
  const NoChildSelectedState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Text className="text-6xl mb-4">👶</Text>
      <Text className="text-xl font-bold text-gray-800 mb-2">No Child Selected</Text>
      <Text className="text-gray-600 text-center px-8">
        Please select a child from your profile to view and book care centers.
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      
      <View className="flex-1">
        {/* Header Section */}
        <View className="px-4 pt-4">
          <CareCenterHeader 
            totalCenters={filteredCaregivers.length}
            availableSlots={totalSlots}
          />
        </View>

        {/* Show selected child info */}
        {selectedChild && (
          <View className="px-4 mb-2">
            <View className="bg-blue-50 rounded-lg p-3 flex-row items-center">
              <View 
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: selectedChild.color }}
              >
                <Text className="text-white font-bold text-lg">
                  {selectedChild.avatar}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-600">Booking for:</Text>
                <Text className="font-semibold text-gray-800">
                  {selectedChild.name} ({selectedChild.age})
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Search Filters */}
        <View className="px-4">
          <SearchFilters
            searchName={searchName}
            setSearchName={setSearchName}
            searchLocation={searchLocation}
            setSearchLocation={setSearchLocation}
            onFilterPress={handleFilterPress}
          />
        </View>

        {/* Results Header */}
        <View className="px-4 mb-2">
          <Text className="text-lg font-bold text-gray-800">
            {filteredCaregivers.length > 0 
              ? `${filteredCaregivers.length} Care Center${filteredCaregivers.length > 1 ? 's' : ''} Found`
              : 'No Results'
            }
          </Text>
          {searchName || searchLocation ? (
            <Text className="text-gray-600">
              {searchName && `Name: "${searchName}"`}
              {searchName && searchLocation && ' • '}
              {searchLocation && `Location: "${searchLocation}"`}
            </Text>
          ) : null}
        </View>

        {/* Conditional Content */}
        {!selectedChild ? (
          <NoChildSelectedState />
        ) : (
          <>
            {/* Care Centers List */}
            <FlatList
              data={filteredCaregivers}
              keyExtractor={(item) => item.id}
              renderItem={renderCaregiver}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={EmptyState}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#3b82f6']}
                  tintColor="#3b82f6"
                />
              }
              showsVerticalScrollIndicator={false}
            />

            {/* Details Modal */}
            <CareCenterDetailsModal
              visible={isModalVisible}
              caregiver={selectedCaregiver}
              onClose={() => setIsModalVisible(false)}
              onBook={handleBooking}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}