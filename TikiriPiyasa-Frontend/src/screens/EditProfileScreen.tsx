import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import type { CenterProfile, RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'EditProfile'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EditProfile'>>();

  const defaults: CenterProfile = {
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
    specialPrograms: 'Music, Art, English, Montessori Activities',
    certifications: 'Health Ministry Approved, Fire Safety Certified',
    paymentMethods: 'Cash, Bank Transfer, Card',
    feeStructure: 'Monthly: Rs. 15,000 | Weekly: Rs. 4,500'
  };

  const profileData = { ...defaults, ...(route.params || {}) };

  const [centerName, setCenterName] = useState(profileData.centerName);
  const [registrationNumber, setRegistrationNumber] = useState(profileData.registrationNumber);
  const [centerType, setCenterType] = useState(profileData.centerType);
  const [address, setAddress] = useState(profileData.address);
  const [city, setCity] = useState(profileData.city);
  const [postalCode, setPostalCode] = useState(profileData.postalCode);
  const [mobileNumber, setMobileNumber] = useState(profileData.mobileNumber);
  const [landlineNumber, setLandlineNumber] = useState(profileData.landlineNumber || '');
  const [email, setEmail] = useState(profileData.email);
  const [website, setWebsite] = useState(profileData.website || '');
  const [socialMediaLinks, setSocialMediaLinks] = useState(profileData.socialMediaLinks || '');
  const [weekdayHours, setWeekdayHours] = useState(profileData.weekdayHours || '');
  const [weekendHours, setWeekendHours] = useState(profileData.weekendHours || '');
  const [ageGroups, setAgeGroups] = useState(profileData.ageGroups || '');
  const [maxCapacity, setMaxCapacity] = useState(profileData.maxCapacity || '');
  const [staffCount, setStaffCount] = useState(profileData.staffCount || '');
  const [specialPrograms, setSpecialPrograms] = useState(profileData.specialPrograms || '');
  const [certifications, setCertifications] = useState(profileData.certifications || '');
  const [paymentMethods, setPaymentMethods] = useState(profileData.paymentMethods || '');
  const [feeStructure, setFeeStructure] = useState(profileData.feeStructure || '');

  const handleSave = () => {
    const updated: CenterProfile = {
      centerName,
      registrationNumber,
      centerType,
      address,
      city,
      postalCode,
      mobileNumber,
      landlineNumber,
      email,
      website,
      socialMediaLinks,
      weekdayHours,
      weekendHours,
      ageGroups,
      maxCapacity,
      staffCount,
      specialPrograms,
      certifications,
      paymentMethods,
      feeStructure
    };
    // TODO persist (API / context)
    navigation.navigate('Profile', updated as any); // or use goBack + event
    Alert.alert('Profile Updated', 'Your profile has been successfully updated!');
  };

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <Text style={styles.headerSubtitle}>Update your center information</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏢 Basic Information</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Center Name</Text>
            <TextInput 
              value={centerName} 
              onChangeText={setCenterName} 
              style={styles.input}
              placeholder="Enter center name"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Registration Number</Text>
            <TextInput 
              value={registrationNumber} 
              onChangeText={setRegistrationNumber} 
              style={styles.input}
              placeholder="Enter registration number"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Center Type</Text>
            <TextInput 
              value={centerType} 
              onChangeText={setCenterType} 
              style={styles.input}
              placeholder="e.g., Daycare & Preschool"
            />
          </View>
        </View>

        {/* Location Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Location Details</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Address</Text>
            <TextInput 
              value={address} 
              onChangeText={setAddress} 
              style={[styles.input, styles.textArea]}
              placeholder="Enter full address"
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>City</Text>
              <TextInput 
                value={city} 
                onChangeText={setCity} 
                style={styles.input}
                placeholder="City"
              />
            </View>

            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>Postal Code</Text>
              <TextInput 
                value={postalCode} 
                onChangeText={setPostalCode} 
                style={styles.input}
                placeholder="Postal Code"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Contact Information</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput 
              value={mobileNumber} 
              onChangeText={setMobileNumber} 
              style={styles.input}
              placeholder="Mobile number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Landline Number</Text>
            <TextInput 
              value={landlineNumber} 
              onChangeText={setLandlineNumber} 
              style={styles.input}
              placeholder="Landline number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput 
              value={email} 
              onChangeText={setEmail} 
              style={styles.input}
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Website</Text>
            <TextInput 
              value={website} 
              onChangeText={setWebsite} 
              style={styles.input}
              placeholder="Website URL"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Social Media</Text>
            <TextInput 
              value={socialMediaLinks} 
              onChangeText={setSocialMediaLinks} 
              style={styles.input}
              placeholder="Social media handles"
            />
          </View>
        </View>

        {/* Operational Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ Operational Details</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Weekday Hours</Text>
            <TextInput 
              value={weekdayHours} 
              onChangeText={setWeekdayHours} 
              style={styles.input}
              placeholder="e.g., 7:00 AM - 6:00 PM"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Weekend Hours</Text>
            <TextInput 
              value={weekendHours} 
              onChangeText={setWeekendHours} 
              style={styles.input}
              placeholder="e.g., 8:00 AM - 4:00 PM"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Age Groups</Text>
            <TextInput 
              value={ageGroups} 
              onChangeText={setAgeGroups} 
              style={styles.input}
              placeholder="e.g., 6 months - 5 years"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>Max Capacity</Text>
              <TextInput 
                value={maxCapacity} 
                onChangeText={setMaxCapacity} 
                style={styles.input}
                placeholder="30"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>Staff Count</Text>
              <TextInput 
                value={staffCount} 
                onChangeText={setStaffCount} 
                style={styles.input}
                placeholder="8"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Services & Programs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎭 Services & Programs</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Special Programs</Text>
            <TextInput 
              value={specialPrograms} 
              onChangeText={setSpecialPrograms} 
              style={[styles.input, styles.textArea]}
              placeholder="List your special programs"
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Certifications</Text>
            <TextInput 
              value={certifications} 
              onChangeText={setCertifications} 
              style={[styles.input, styles.textArea]}
              placeholder="List your certifications"
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        {/* Financial Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Financial Information</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Fee Structure</Text>
            <TextInput 
              value={feeStructure} 
              onChangeText={setFeeStructure} 
              style={[styles.input, styles.textArea]}
              placeholder="Monthly: Rs. 15,000 | Weekly: Rs. 4,500"
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Payment Methods</Text>
            <TextInput 
              value={paymentMethods} 
              onChangeText={setPaymentMethods} 
              style={styles.input}
              placeholder="Cash, Bank Transfer, Card"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>💾 Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
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
  },
  backIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  field: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    width: '48%',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E1E5EA',
    color: '#2c3e50',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  actionSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  saveBtn: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelBtnText: {
    color: '#667eea',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default EditProfileScreen;