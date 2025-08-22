import { RootStackParamList } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CenterProfile {
  // Basic Details
  centerName: string;
  registrationNumber: string;
  centerType: string;
  
  // Location Details
  address: string;
  city: string;
  postalCode: string;
  
  // Contact Information
  mobileNumber: string;
  landlineNumber: string;
  email: string;
  website: string;
  socialMediaLinks: string;
  
  // Operational Details
  weekdayHours: string;
  weekendHours: string;
  ageGroups: string;
  maxCapacity: string;
  staffCount: string;
  
  // Facilities & Services
  hasIndoorPlayArea: boolean;
  hasOutdoorPlayArea: boolean;
  providesMeals: boolean;
  specialPrograms: string;
  hasMedicalAid: boolean;
  hasCCTV: boolean;
  
  // Additional Features
  certifications: string;
  paymentMethods: string;
  feeStructure: string;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Sample profile data - in a real app, this would come from your state management or API
  const [profile] = useState<CenterProfile>({
    centerName: 'Little Stars Care Center',
    registrationNumber: 'CC-2024-001',
    centerType: 'Daycare & Preschool',
    address: '123 Sunshine Avenue, Flower Garden Estate',
    city: 'Colombo',
    postalCode: '00700',
    mobileNumber: '+94 77 123 4567',
    landlineNumber: '+94 11 234 5678',
    email: 'info@littlestars.lk',
    website: 'www.littlestars.lk',
    socialMediaLinks: '@littlestarscare',
    weekdayHours: '7:00 AM - 6:00 PM',
    weekendHours: '8:00 AM - 4:00 PM',
    ageGroups: '6 months - 5 years',
    maxCapacity: '30',
    staffCount: '8',
    hasIndoorPlayArea: true,
    hasOutdoorPlayArea: true,
    providesMeals: true,
    specialPrograms: 'Music, Art, English, Montessori Activities',
    hasMedicalAid: true,
    hasCCTV: true,
    certifications: 'Health Ministry Approved, Fire Safety Certified',
    paymentMethods: 'Cash, Bank Transfer, Card',
    feeStructure: 'Monthly: Rs. 15,000 | Weekly: Rs. 4,500'
  });

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Navigate to edit profile screen', 
      [{ text: 'OK', style: 'default' }]);
  };

  const renderInfoCard = (title: string, icon: string, children: React.ReactNode) => (
    <View style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const renderInfoRow = (label: string, value: string, emoji?: string) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {emoji && `${emoji} `}{label}:
      </Text>
      <Text style={styles.infoValue}>{value || 'Not specified'}</Text>
    </View>
  );

  const renderFacilityBadge = (label: string, hasFeature: boolean, emoji: string) => (
    <View style={[styles.facilityBadge, hasFeature ? styles.activeFacility : styles.inactiveFacility]}>
      <Text style={styles.facilityEmoji}>{emoji}</Text>
      <Text style={[styles.facilityText, hasFeature ? styles.activeFacilityText : styles.inactiveFacilityText]}>
        {label}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🌸 Profile</Text>
          <Text style={styles.centerName}>{profile.centerName}</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Basic Details */}
        {renderInfoCard('Basic Information', '🏠', (
          <>
            {renderInfoRow('Center Name', profile.centerName, '🏢')}
            {renderInfoRow('Registration Number', profile.registrationNumber, '📋')}
            {renderInfoRow('Type', profile.centerType, '🎯')}
          </>
        ))}

        {/* Location Details */}
        {renderInfoCard('Location', '📍', (
          <>
            {renderInfoRow('Address', profile.address, '🏠')}
            {renderInfoRow('City', profile.city, '🏙️')}
            {renderInfoRow('Postal Code', profile.postalCode, '📮')}
          </>
        ))}

        {/* Contact Information */}
        {renderInfoCard('Contact Information', '📞', (
          <>
            {renderInfoRow('Mobile', profile.mobileNumber, '📱')}
            {renderInfoRow('Landline', profile.landlineNumber, '☎️')}
            {renderInfoRow('Email', profile.email, '📧')}
            {renderInfoRow('Website', profile.website, '🌐')}
            {renderInfoRow('Social Media', profile.socialMediaLinks, '📱')}
          </>
        ))}

        {/* Operational Details */}
        {renderInfoCard('Operating Hours', '⏰', (
          <>
            {renderInfoRow('Weekdays', profile.weekdayHours, '📅')}
            {renderInfoRow('Weekends', profile.weekendHours, '🎡')}
            {renderInfoRow('Age Groups', profile.ageGroups, '👶')}
            {renderInfoRow('Max Capacity', `${profile.maxCapacity} children`, '👥')}
            {renderInfoRow('Staff Count', `${profile.staffCount} members`, '👨‍🏫')}
          </>
        ))}

        {/* Facilities */}
        {renderInfoCard('Facilities & Services', '🎨', (
          <>
            <View style={styles.facilitiesGrid}>
              {renderFacilityBadge('Indoor Play', profile.hasIndoorPlayArea, '🏠')}
              {renderFacilityBadge('Outdoor Play', profile.hasOutdoorPlayArea, '🌳')}
              {renderFacilityBadge('Meals', profile.providesMeals, '🍽️')}
              {renderFacilityBadge('Medical Aid', profile.hasMedicalAid, '🏥')}
              {renderFacilityBadge('CCTV', profile.hasCCTV, '📹')}
            </View>
            {renderInfoRow('Special Programs', profile.specialPrograms, '🎭')}
          </>
        ))}

        {/* Additional Features */}
        {renderInfoCard('Additional Information', '✨', (
          <>
            {renderInfoRow('Certifications', profile.certifications, '🏆')}
            {renderInfoRow('Payment Methods', profile.paymentMethods, '💳')}
            {renderInfoRow('Fee Structure', profile.feeStructure, '💰')}
          </>
        ))}

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.goBack()}>
            <Text style={styles.actionButtonText}>← Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDDDE6', // Blush Pink background
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF', // Cloud White
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 10,
  },
  centerName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#B8E0F4', // Baby Blue
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  editButtonText: {
    color: '#2196F3',
    fontWeight: '600',
    fontSize: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF', // Cloud White
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E6DC',
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  facilityBadge: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  activeFacility: {
    backgroundColor: '#CFF4D2', // Pastel Green
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  inactiveFacility: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  facilityEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  facilityText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  activeFacilityText: {
    color: '#2E7D32',
  },
  inactiveFacilityText: {
    color: '#999',
  },
  actionContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 40,
  },
  actionButton: {
    backgroundColor: '#F5E6DC', // Warm Beige
    borderWidth: 2,
    borderColor: '#D4C4B0',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ProfileScreen;