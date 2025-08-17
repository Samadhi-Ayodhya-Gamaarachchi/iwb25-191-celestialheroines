import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telephone, setTelephone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!parentName || !email || !password || !confirmPassword || !telephone) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (telephone.length < 10) {
      Alert.alert('Error', 'Please enter a valid telephone number');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const success = await register({
        name: parentName,
        email,
        telephone,
      });
      
      if (success) {
        Alert.alert(
          'Success',
          'Account created successfully! Please sign in.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/LoginScreen' as any),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/LoginScreen' as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            className="h-48 rounded-b-3xl"
          >
            <View className="flex-1 justify-center items-center">
              <View className="bg-white/20 rounded-full p-6 mb-4">
                <Text className="text-white text-4xl font-bold">👶</Text>
              </View>
              <Text className="text-white text-2xl font-bold mb-2">
                Join TikiriCare
              </Text>
              <Text className="text-white/80 text-base text-center px-4">
                Create your account to start caring for your little ones
              </Text>
            </View>
          </LinearGradient>

          <View className="flex-1 px-6 -mt-6">
            <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
              <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Create Account
              </Text>

              {/* Parent Name Input */}
              <View className="mb-4">
                <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                  <User size={20} color="#6b7280" className="mr-3" />
                  <TextInput
                    placeholder="Parent Name"
                    value={parentName}
                    onChangeText={setParentName}
                    autoCapitalize="words"
                    className="flex-1 text-gray-800 text-base"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              {/* Email Input */}
              <View className="mb-4">
                <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                  <Mail size={20} color="#6b7280" className="mr-3" />
                  <TextInput
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="flex-1 text-gray-800 text-base"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              {/* Telephone Input */}
              <View className="mb-4">
                <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                  <Phone size={20} color="#6b7280" className="mr-3" />
                  <TextInput
                    placeholder="Telephone Number"
                    value={telephone}
                    onChangeText={setTelephone}
                    keyboardType="phone-pad"
                    className="flex-1 text-gray-800 text-base"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-4">
                <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                  <Lock size={20} color="#6b7280" className="mr-3" />
                  <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    className="flex-1 text-gray-800 text-base"
                    placeholderTextColor="#9ca3af"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="ml-2"
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#6b7280" />
                    ) : (
                      <Eye size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View className="mb-6">
                <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                  <Lock size={20} color="#6b7280" className="mr-3" />
                  <TextInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    className="flex-1 text-gray-800 text-base"
                    placeholderTextColor="#9ca3af"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#6b7280" />
                    ) : (
                      <Eye size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={isLoading}
                className="mb-4"
              >
                <LinearGradient
                  colors={['#3b82f6', '#8b5cf6']}
                  className="rounded-xl py-4 items-center"
                >
                  <Text className="text-white text-lg font-semibold">
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Terms and Conditions */}
              <Text className="text-gray-500 text-xs text-center mb-4">
                By creating an account, you agree to our{' '}
                <Text className="text-blue-600">Terms of Service</Text> and{' '}
                <Text className="text-blue-600">Privacy Policy</Text>
              </Text>

              {/* Divider */}
              <View className="flex-row items-center mb-4">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="mx-4 text-gray-500 text-sm">or</Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {/* Login Link */}
              <View className="flex-row justify-center">
                <Text className="text-gray-600 text-base">
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text className="text-blue-600 font-semibold text-base">
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
