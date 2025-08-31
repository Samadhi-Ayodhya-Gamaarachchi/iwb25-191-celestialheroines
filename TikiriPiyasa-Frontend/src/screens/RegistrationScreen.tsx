import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface RegistrationScreenProps {
  onNavigateToLogin: () => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;
        
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const success = await register(
        formData.email.trim(),
        formData.password,
        formData.name.trim(),
        formData.telephone.trim() || undefined
      );
            
      if (!success) {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with gradient background */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Image 
                source={require('../asset/Tikiri_piyasa.png')}
                style={styles.logo}
               
              />
            </View>
            <Text style={styles.appTitle}>TikiriPiyasa</Text>
            <Text style={styles.subtitle}>Join as a Childcare Provider</Text>
           
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
        

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#B794C7"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#B794C7"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#B794C7"
                value={formData.telephone}
                onChangeText={(value) => handleInputChange('telephone', value)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Create a password (min 6 characters)"
                placeholderTextColor="#B794C7"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#B794C7"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.registerButton, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom decorative elements */}
        <View style={styles.bottomDecorations}>
          <Text style={styles.bottomEmoji}>🦋</Text>
          <Text style={styles.bottomEmoji}>✨</Text>
          <Text style={styles.bottomEmoji}>🌺</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ca9dbc', // Soft purple background matching logo
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    
  },
  logoContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  logoBackground: {
    width: 120,
    height: 120,
   
    justifyContent: 'center',
    alignItems: 'center',
   
    shadowColor: '#9B59B6',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    
  },
  logo: {
    width: 100,
    height: 100,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#7B2D7B', // Deep purple from logo

    letterSpacing: 1.2,
    textShadowColor: 'rgba(123, 45, 123, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#A569BD', // Medium purple
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 20,
  },
  decorativeElements: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  heart1: {
    position: 'absolute',
    top: -10,
    right: 20,
    fontSize: 20,
    transform: [{ rotate: '15deg' }],
  },
  flower1: {
    position: 'absolute',
    top: 20,
    left: 10,
    fontSize: 18,
    transform: [{ rotate: '-10deg' }],
  },
  heart2: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    fontSize: 16,
    transform: [{ rotate: '25deg' }],
  },
  formContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    padding: 30,
    marginHorizontal: 5,
    shadowColor: '#9B59B6',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#F4E4F4',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#7B2D7B',
    textAlign: 'center',
    marginBottom: 8,
  },
  registerText: {
    fontSize: 15,
    color: '#A569BD',
    textAlign: 'center',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7B2D7B',
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 2,
    borderColor: '#E8D5E8',
    borderRadius: 18,
    backgroundColor: '#FDFBFD',
    shadowColor: '#9B59B6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#7B2D7B',
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#9B59B6', // Purple from logo
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
    shadowColor: '#9B59B6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#D5BFD5',
    shadowOpacity: 0.1,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  loginText: {
    fontSize: 15,
    color: '#A569BD',
    fontWeight: '500',
  },
  loginLink: {
    fontSize: 15,
    color: '#7B2D7B',
    fontWeight: '700',
  },
  bottomDecorations: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 15,
  },
  bottomEmoji: {
    fontSize: 18,
    opacity: 0.7,
  },
});

export default RegistrationScreen;