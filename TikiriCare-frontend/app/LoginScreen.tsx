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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        router.replace('/(tabs)/' as any);
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/RegisterScreen' as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          className="h-64 rounded-b-3xl"
        >
          <View className="items-center justify-center flex-1">
            <View className="p-6 mb-4 rounded-full bg-white/20">
              <Text className="text-4xl font-bold text-white">👶</Text>
            </View>
            <Text className="mb-2 text-2xl font-bold text-white">
              Welcome Back
            </Text>
            <Text className="text-base text-white/80">
              Sign in to continue with TikiriCare
            </Text>
          </View>
        </LinearGradient>

        <View className="flex-1 px-6 -mt-8">
          <View className="p-6 bg-white shadow-lg rounded-3xl">
            <Text className="mb-6 text-2xl font-bold text-center text-gray-800">
              Sign In
            </Text>

            {/* Email Input */}
            <View className="mb-4">
              <View className="flex-row items-center px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
                <Mail size={20} color="#6b7280" className="mr-3" />
                <TextInput
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 text-base text-gray-800"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <View className="flex-row items-center px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
                <Lock size={20} color="#6b7280" className="mr-3" />
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  className="flex-1 text-base text-gray-800"
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

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className="py-4 mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"
            >
              <LinearGradient
                colors={['#3b82f6', '#8b5cf6']}
                className="items-center py-4 rounded-xl"
              >
                <Text className="text-lg font-semibold text-white">
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity className="mb-6">
              <Text className="text-base text-center text-blue-600">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="mx-4 text-sm text-gray-500">or</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            {/* Register Link */}
            <View className="flex-row justify-center">
              <Text className="text-base text-gray-600">
                Don&apos;t have an account?{' '}
              </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text className="text-base font-semibold text-blue-600">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
