import { RootStackParamList } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';


interface RegistationProps {
  title: string;
  path: string;
  onComplete: () => void; // Add this prop
}

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

const Registation: React.FC<RegistationProps> = ({ title, path, onComplete }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [profile, setProfile] = useState<CenterProfile>({
    centerName: '',
    registrationNumber: '',
    centerType: '',
    address: '',
    city: '',
    postalCode: '',
    mobileNumber: '',
    landlineNumber: '',
    email: '',
    website: '',
    socialMediaLinks: '',
    weekdayHours: '',
    weekendHours: '',
    ageGroups: '',
    maxCapacity: '',
    staffCount: '',
    hasIndoorPlayArea: false,
    hasOutdoorPlayArea: false,
    providesMeals: false,
    specialPrograms: '',
    hasMedicalAid: false,
    hasCCTV: false,
    certifications: '',
    paymentMethods: '',
    feeStructure: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const updateProfile = (field: keyof CenterProfile, value: string | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!profile.centerName || !profile.email || !profile.mobileNumber) {
      Alert.alert('Oops! 🌸', 'Please fill in all required fields (Center Name, Email, Mobile Number)', 
        [{ text: 'OK', style: 'default' }]);
      return;
    }
    
    Alert.alert('Success! 🎉', 'Care Center Profile Created Successfully!', 
      [{ text: 'Great!', style: 'default' }]);
    console.log('Profile Data:', profile);
  };

  const getStepIcon = (step: number) => {
    const icons = ['🏠', '📍', '📞', '⏰', '🎨', '✨'];
    return icons[step - 1] || '📝';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepIcon}>{getStepIcon(1)}</Text>
              <Text style={styles.stepTitle}>Basic Details</Text>
              <Text style={styles.stepSubtitle}>Tell us about your care center</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Care Center Name *</Text>
              <TextInput
                style={styles.input}
                value={profile.centerName}
                onChangeText={(text) => updateProfile('centerName', text)}
                placeholder="Enter your care center name"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Registration Number</Text>
              <TextInput
                style={styles.input}
                value={profile.registrationNumber}
                onChangeText={(text) => updateProfile('registrationNumber', text)}
                placeholder="Enter registration number (if available)"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Type of Care Center</Text>
              <TextInput
                style={styles.input}
                value={profile.centerType}
                onChangeText={(text) => updateProfile('centerType', text)}
                placeholder="e.g., Daycare, Preschool, After-school care"
                placeholderTextColor="#A0A0A0"
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepIcon}>{getStepIcon(2)}</Text>
              <Text style={styles.stepTitle}>Location Details</Text>
              <Text style={styles.stepSubtitle}>Where can families find you?</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profile.address}
                onChangeText={(text) => updateProfile('address', text)}
                placeholder="Enter your full address"
                placeholderTextColor="#A0A0A0"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>City/Region</Text>
              <TextInput
                style={styles.input}
                value={profile.city}
                onChangeText={(text) => updateProfile('city', text)}
                placeholder="Enter city or region"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Pin/Postal Code</Text>
              <TextInput
                style={styles.input}
                value={profile.postalCode}
                onChangeText={(text) => updateProfile('postalCode', text)}
                placeholder="Enter postal code"
                placeholderTextColor="#A0A0A0"
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepIcon}>{getStepIcon(3)}</Text>
              <Text style={styles.stepTitle}>Contact Information</Text>
              <Text style={styles.stepSubtitle}>How can parents reach you?</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile Number *</Text>
              <TextInput
                style={styles.input}
                value={profile.mobileNumber}
                onChangeText={(text) => updateProfile('mobileNumber', text)}
                placeholder="Enter mobile number"
                placeholderTextColor="#A0A0A0"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Landline Number</Text>
              <TextInput
                style={styles.input}
                value={profile.landlineNumber}
                onChangeText={(text) => updateProfile('landlineNumber', text)}
                placeholder="Enter landline number"
                placeholderTextColor="#A0A0A0"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={profile.email}
                onChangeText={(text) => updateProfile('email', text)}
                placeholder="Enter email address"
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Website</Text>
              <TextInput
                style={styles.input}
                value={profile.website}
                onChangeText={(text) => updateProfile('website', text)}
                placeholder="Enter website URL (optional)"
                placeholderTextColor="#A0A0A0"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Social Media Links</Text>
              <TextInput
                style={styles.input}
                value={profile.socialMediaLinks}
                onChangeText={(text) => updateProfile('socialMediaLinks', text)}
                placeholder="Facebook, Instagram links (optional)"
                placeholderTextColor="#A0A0A0"
              />
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepIcon}>{getStepIcon(4)}</Text>
              <Text style={styles.stepTitle}>Operational Details</Text>
              <Text style={styles.stepSubtitle}>When are you open for care?</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Weekday Hours</Text>
              <TextInput
                style={styles.input}
                value={profile.weekdayHours}
                onChangeText={(text) => updateProfile('weekdayHours', text)}
                placeholder="e.g., 8:00 AM - 6:00 PM"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Weekend Hours</Text>
              <TextInput
                style={styles.input}
                value={profile.weekendHours}
                onChangeText={(text) => updateProfile('weekendHours', text)}
                placeholder="e.g., 9:00 AM - 4:00 PM or Closed"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age Groups Accepted</Text>
              <TextInput
                style={styles.input}
                value={profile.ageGroups}
                onChangeText={(text) => updateProfile('ageGroups', text)}
                placeholder="e.g., 6 months - 5 years"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Maximum Child Capacity</Text>
              <TextInput
                style={styles.input}
                value={profile.maxCapacity}
                onChangeText={(text) => updateProfile('maxCapacity', text)}
                placeholder="Enter maximum number of children"
                placeholderTextColor="#A0A0A0"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Number of Staff Members</Text>
              <TextInput
                style={styles.input}
                value={profile.staffCount}
                onChangeText={(text) => updateProfile('staffCount', text)}
                placeholder="Enter number of staff/teachers"
                placeholderTextColor="#A0A0A0"
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepIcon}>{getStepIcon(5)}</Text>
              <Text style={styles.stepTitle}>Facilities & Services</Text>
              <Text style={styles.stepSubtitle}>What makes your center special?</Text>
            </View>
            
            <View style={styles.facilitiesGrid}>
              <View style={styles.facilityCard}>
                <Text style={styles.facilityIcon}>🏠</Text>
                <Text style={styles.facilityLabel}>Indoor Play Area</Text>
                <Switch
                  value={profile.hasIndoorPlayArea}
                  onValueChange={(value) => updateProfile('hasIndoorPlayArea', value)}
                  trackColor={{ false: '#E8E8E8', true: '#CFF4D2' }}
                  thumbColor={profile.hasIndoorPlayArea ? '#4CAF50' : '#f4f3f4'}
                />
              </View>

              <View style={styles.facilityCard}>
                <Text style={styles.facilityIcon}>🌳</Text>
                <Text style={styles.facilityLabel}>Outdoor Play Area</Text>
                <Switch
                  value={profile.hasOutdoorPlayArea}
                  onValueChange={(value) => updateProfile('hasOutdoorPlayArea', value)}
                  trackColor={{ false: '#E8E8E8', true: '#CFF4D2' }}
                  thumbColor={profile.hasOutdoorPlayArea ? '#4CAF50' : '#f4f3f4'}
                />
              </View>

              <View style={styles.facilityCard}>
                <Text style={styles.facilityIcon}>🍽️</Text>
                <Text style={styles.facilityLabel}>Meals Provided</Text>
                <Switch
                  value={profile.providesMeals}
                  onValueChange={(value) => updateProfile('providesMeals', value)}
                  trackColor={{ false: '#E8E8E8', true: '#CFF4D2' }}
                  thumbColor={profile.providesMeals ? '#4CAF50' : '#f4f3f4'}
                />
              </View>

              <View style={styles.facilityCard}>
                <Text style={styles.facilityIcon}>🏥</Text>
                <Text style={styles.facilityLabel}>Medical/First-Aid</Text>
                <Switch
                  value={profile.hasMedicalAid}
                  onValueChange={(value) => updateProfile('hasMedicalAid', value)}
                  trackColor={{ false: '#E8E8E8', true: '#CFF4D2' }}
                  thumbColor={profile.hasMedicalAid ? '#4CAF50' : '#f4f3f4'}
                />
              </View>

              <View style={styles.facilityCard}>
                <Text style={styles.facilityIcon}>📹</Text>
                <Text style={styles.facilityLabel}>CCTV Monitoring</Text>
                <Switch
                  value={profile.hasCCTV}
                  onValueChange={(value) => updateProfile('hasCCTV', value)}
                  trackColor={{ false: '#E8E8E8', true: '#CFF4D2' }}
                  thumbColor={profile.hasCCTV ? '#4CAF50' : '#f4f3f4'}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Special Programs</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profile.specialPrograms}
                onChangeText={(text) => updateProfile('specialPrograms', text)}
                placeholder="e.g., Music, Art, Language, Sports, STEM activities"
                placeholderTextColor="#A0A0A0"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepIcon}>{getStepIcon(6)}</Text>
              <Text style={styles.stepTitle}>Additional Features</Text>
              <Text style={styles.stepSubtitle}>Final touches for your profile</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Safety & Certifications</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profile.certifications}
                onChangeText={(text) => updateProfile('certifications', text)}
                placeholder="Health inspections, licenses, safety certifications"
                placeholderTextColor="#A0A0A0"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Payment Methods Accepted</Text>
              <TextInput
                style={styles.input}
                value={profile.paymentMethods}
                onChangeText={(text) => updateProfile('paymentMethods', text)}
                placeholder="Cash, Bank Transfer, Card, Digital Wallets"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fee Structure</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profile.feeStructure}
                onChangeText={(text) => updateProfile('feeStructure', text)}
                placeholder="Monthly/Weekly/Daily rates (optional)"
                placeholderTextColor="#A0A0A0"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.uploadSection}>
              <Text style={styles.label}>📷 Visual Media</Text>
              <TouchableOpacity style={styles.uploadButton}>
                <Text style={styles.uploadIcon}>🏢</Text>
                <Text style={styles.uploadButtonText}>Upload Center Logo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton}>
                <Text style={styles.uploadIcon}>📸</Text>
                <Text style={styles.uploadButtonText}>Upload Photos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton}>
                <Text style={styles.uploadIcon}>🎬</Text>
                <Text style={styles.uploadButtonText}>Upload Video (Optional)</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>🌸 Tikiri Care Center</Text>
          <Text style={styles.titleSubtext}>Profile Setup</Text>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step {currentStep} of {totalSteps}</Text>
          </View>
          {/* Add this button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#CFF4D2', marginTop: 12 }]}
            onPress={() => {
              onComplete?.();
              navigation.navigate('Home');
            }}
          >
            <Text style={{ color: '#333', fontWeight: 'bold' }}>Go to Home</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${(currentStep / totalSteps) * 100}%` }]} />
          </View>
          <View style={styles.progressDots}>
            {Array.from({ length: totalSteps }, (_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index + 1 <= currentStep ? styles.activeDot : styles.inactiveDot
                ]}
              />
            ))}
          </View>
        </View>

        {renderStepContent()}

        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <TouchableOpacity style={[styles.button, styles.previousButton]} onPress={handlePrevious}>
              <Text style={styles.buttonText}>← Previous</Text>
            </TouchableOpacity>
          )}
          
          {currentStep < totalSteps ? (
            <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={handleNext}>
              <Text style={styles.buttonText}>Next →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
              <Text style={styles.buttonText}>🎉 Complete Profile</Text>
            </TouchableOpacity>
          )}
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
    marginBottom: 5,
  },
  titleSubtext: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  stepIndicator: {
    backgroundColor: '#B8E0F4', // Baby Blue
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F5E6DC', // Warm Beige
    borderRadius: 3,
    marginBottom: 15,
  },
  progress: {
    height: '100%',
    backgroundColor: '#CFF4D2', // Pastel Green
    borderRadius: 3,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4CAF50',
  },
  inactiveDot: {
    backgroundColor: '#E8E8E8',
  },
  stepContainer: {
    backgroundColor: '#FFFFFF', // Cloud White
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  stepIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#F5E6DC', // Warm Beige
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  facilityCard: {
    width: '48%',
    backgroundColor: '#F5E6DC', // Warm Beige
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  facilityIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  facilityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  uploadSection: {
    marginTop: 20,
  },
  uploadButton: {
    backgroundColor: '#B8E0F4', // Baby Blue
    borderColor: '#2196F3',
    borderWidth: 2,
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  uploadIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  uploadButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  previousButton: {
    backgroundColor: '#F5E6DC', // Warm Beige
    borderWidth: 2,
    borderColor: '#D4C4B0',
  },
  nextButton: {
    backgroundColor: '#B8E0F4', // Baby Blue
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  submitButton: {
    backgroundColor: '#CFF4D2', // Pastel Green
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Registation;