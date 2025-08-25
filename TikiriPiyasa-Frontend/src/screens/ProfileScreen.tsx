import { RootStackParamList } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

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
    navigation.navigate('EditProfile');
  };

  const handleContactAction = (type: 'call' | 'email' | 'website') => {
    const actions = {
      call: () => Alert.alert('Call', `Calling ${profile.mobileNumber}`),
      email: () => Alert.alert('Email', `Opening ${profile.email}`),
      website: () => Alert.alert('Website', `Opening ${profile.website}`)
    };
    actions[type]();
  };

  // Quick stats similar to HomeScreen
  const profileStats = [
    { label: 'Max Capacity', value: profile.maxCapacity, icon: '👶', color: '#FF6B6B' },
    { label: 'Staff Members', value: profile.staffCount, icon: '👨‍🏫', color: '#4ECDC4' },
    { label: 'Rating', value: '4.8★', icon: '⭐', color: '#45B7D1' },
  ];

  // Contact actions similar to HomeScreen quick actions
  const contactActions = [
    { title: 'Call Center', icon: '📞', color: '#4CAF50', action: () => handleContactAction('call') },
    { title: 'Send Email', icon: '✉️', color: '#FF9800', action: () => handleContactAction('email') },
    { title: 'Visit Website', icon: '🌐', color: '#2196F3', action: () => handleContactAction('website') },
  ];

  // Facilities with HomeScreen style
  const facilitiesData = [
    { name: 'Indoor Play Area', available: profile.hasIndoorPlayArea, icon: '🏠' },
    { name: 'Outdoor Play Area', available: profile.hasOutdoorPlayArea, icon: '🌳' },
    { name: 'Meals Provided', available: profile.providesMeals, icon: '🍽️' },
    { name: 'Medical Aid', available: profile.hasMedicalAid, icon: '🏥' },
    { name: 'CCTV Security', available: profile.hasCCTV, icon: '📹' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Gradient - similar to HomeScreen */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          {/* Avatar similar to logo in HomeScreen */}
          <View style={styles.logoContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>LS</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedIcon}>✓</Text>
            </View>
          </View>
          <Text style={styles.centerName}>{profile.centerName}</Text>
          <Text style={styles.greeting}>Profile Overview 👤</Text>
        </View>
      </LinearGradient>

      {/* Quick Statistics - same style as HomeScreen */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Profile Statistics</Text>
        <View style={styles.statsRow}>
          {profileStats.map(stat => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: stat.color }]}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Contact Actions - similar to HomeScreen quick actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitleMain}>Quick Contact</Text>
        <View style={styles.actionsGrid}>
          {contactActions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.actionCard, { backgroundColor: action.color }]}
              onPress={action.action}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Basic Information - similar to HomeScreen center info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitleMain}>Basic Information</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📋</Text>
            <View>
              <Text style={styles.infoLabel}>Registration ID</Text>
              <Text style={styles.infoValue}>{profile.registrationNumber}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🎯</Text>
            <View>
              <Text style={styles.infoLabel}>Center Type</Text>
              <Text style={styles.infoValue}>{profile.centerType}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📍</Text>
            <View>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{profile.city}, {profile.postalCode}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitleMain}>Contact Information</Text>
        <View style={styles.infoGrid}>
          <TouchableOpacity style={styles.infoItem} onPress={() => handleContactAction('call')}>
            <Text style={styles.infoIcon}>📱</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Mobile</Text>
              <Text style={styles.infoValue}>{profile.mobileNumber}</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoItem} onPress={() => handleContactAction('email')}>
            <Text style={styles.infoIcon}>✉️</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profile.email}</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🕒</Text>
            <View>
              <Text style={styles.infoLabel}>Operating Hours</Text>
              <Text style={styles.infoValue}>{profile.weekdayHours}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Facilities Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleMain}>Facilities & Services</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{facilitiesData.filter(f => f.available).length}</Text>
          </View>
        </View>
        
        {facilitiesData.map((facility, index) => (
          <View key={index} style={[styles.facilityCard, 
            facility.available ? styles.availableFacility : styles.unavailableFacility
          ]}>
            <View style={styles.facilityInfo}>
              <Text style={styles.facilityIcon}>{facility.icon}</Text>
              <Text style={styles.facilityName}>{facility.name}</Text>
            </View>
            <View style={[styles.statusBadge, 
              facility.available ? styles.availableBadge : styles.unavailableBadge
            ]}>
              <Text style={[styles.statusText,
                facility.available ? styles.availableText : styles.unavailableText
              ]}>
                {facility.available ? 'Available' : 'Not Available'}
              </Text>
            </View>
          </View>
        ))}
        
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>🎭</Text>
          <View>
            <Text style={styles.infoLabel}>Special Programs</Text>
            <Text style={styles.infoValue}>{profile.specialPrograms}</Text>
          </View>
        </View>
      </View>

      {/* Financial Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitleMain}>Pricing & Payments</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>💰</Text>
            <View>
              <Text style={styles.infoLabel}>Fee Structure</Text>
              <Text style={styles.infoValue}>{profile.feeStructure}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>💳</Text>
            <View>
              <Text style={styles.infoLabel}>Payment Methods</Text>
              <Text style={styles.infoValue}>{profile.paymentMethods}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🏆</Text>
            <View>
              <Text style={styles.infoLabel}>Certifications</Text>
              <Text style={styles.infoValue}>{profile.certifications}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Edit Profile Button - similar to HomeScreen */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.editBtn} onPress={handleEditProfile}>
          <Text style={styles.editBtnText}>✏️ Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  header: { 
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderRadius: 50,
    backgroundColor: '#fff',
    padding: 5,
    position: 'relative',
  },
  avatar: { 
    width: 90, 
    height: 90, 
    borderRadius: 45,
    backgroundColor: '#667EEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  verifiedIcon: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  centerName: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#fff',
    marginTop: 15,
    textAlign: 'center',
  },
  greeting: { 
    fontSize: 16, 
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 15,
  },
  statCard: { 
    alignItems: 'center', 
    padding: 20, 
    borderRadius: 20, 
    width: (width - 60) / 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: { 
    fontSize: 30,
    marginBottom: 8,
  },
  statValue: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: { 
    fontSize: 11, 
    color: 'rgba(255,255,255,0.9)', 
    textAlign: 'center',
    fontWeight: '600',
  },
  section: { 
    marginHorizontal: 20, 
    marginTop: 25, 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitleMain: { 
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  badge: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionsGrid: {
    gap: 15,
  },
  actionCard: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  actionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  infoGrid: {
    gap: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  actionArrow: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: 'bold',
  },
  facilityCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  availableFacility: {
    backgroundColor: '#f0fff4',
    borderLeftColor: '#4CAF50',
  },
  unavailableFacility: {
    backgroundColor: '#fff5f5',
    borderLeftColor: '#ff6b6b',
  },
  facilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  facilityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  facilityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  availableBadge: {
    backgroundColor: '#4CAF50',
  },
  unavailableBadge: {
    backgroundColor: '#ff6b6b',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  availableText: {
    color: '#fff',
  },
  unavailableText: {
    color: '#fff',
  },
  editBtn: { 
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  editBtnText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default ProfileScreen;