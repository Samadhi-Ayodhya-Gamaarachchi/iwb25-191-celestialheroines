import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const { width, height } = Dimensions.get("window");

export default function RegisterScreen() {
  const { register } = useAuth();
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!parentName || !email || !password || !confirmPassword || !telephone) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    if (telephone.length < 10) {
      Alert.alert("Error", "Please enter a valid telephone number");
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
      }, password);

      if (success) {
        Alert.alert(
          "Success",
          "Account created successfully! Welcome to TikiriCare!",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(tabs)"),
            },
          ]
        );
      } else {
        Alert.alert("Error", "Registration failed. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/LoginScreen");
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Colorful Header with Illustration - Reduced height */}
        <LinearGradient
          colors={["#E0F2FE", "#3B82F6"]}
          className="rounded-b-3xl"
          style={{ height: height * 0.25 }}
        >
          <View className="flex-1 items-center justify-center px-8 relative overflow-hidden">
            {/* Decorative Elements */}
            <View className="absolute top-6 left-6 w-5 h-5 rounded-full bg-red-400" />
            <View className="absolute top-8 right-8 w-4 h-4 rounded-full bg-yellow-400" />
            <View className="absolute top-16 left-12 w-4 h-4 rounded-full bg-green-400" />
            <View className="absolute top-20 right-16 w-6 h-6 rounded-full bg-pink-400" />
            <View className="absolute bottom-12 left-4 w-4 h-4 rounded-full bg-purple-400" />
            <View className="absolute bottom-8 right-6 w-5 h-5 rounded-full bg-cyan-400" />

            {/* Cloud decorations */}
            <View className="absolute top-8 right-20 bg-white/30 rounded-full px-2 py-1">
              <Text className="text-white text-xs">☁️</Text>
            </View>
            <View className="absolute top-12 left-20 bg-white/30 rounded-full px-2 py-1">
              <Text className="text-white text-xs">☁️</Text>
            </View>

            {/* Logo Image - Smaller */}
            <View className="items-center mt-1">
              <Image
                source={require("@/assets/images/logo.png")}
                style={{
                  width: 150,
                  height: 150,
                  resizeMode: "contain",
                }}
              />
            </View>

            {/* Ground */}
            <View className="absolute bottom-0 left-0 right-0 h-3 bg-green-400 rounded-t-full" />
            <View className="absolute bottom-1 left-8 w-3 h-3 bg-green-500 rounded-full" />
            <View className="absolute bottom-0 right-12 w-3 h-3 bg-green-500 rounded-full" />
          </View>
        </LinearGradient>

        {/* Registration Form */}
        <View className="flex-1 px-6 -mt-4">
          <View className="bg-white rounded-3xl shadow-xl p-4 flex-1">
            {/* Welcome Text Section - Reduced spacing */}
            <View className="items-center mb-3 mt-2">
              <Text className="text-2xl font-bold text-blue-600 mb-1 text-center">
                Join TikiriCare!
              </Text>
              <Text className="text-sm text-blue-600 text-center px-4">
                Create your account to start your baby care journey
              </Text>
            </View>

            {/* Parent Name Input */}
            <View className="mb-3">
              <View className="flex-row items-center px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="#6b7280"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  placeholder="Parent/Guardian Name"
                  value={parentName}
                  onChangeText={setParentName}
                  className="flex-1 text-sm text-gray-800"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Email Input */}
            <View className="mb-3">
              <View className="flex-row items-center px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color="#6b7280"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 text-sm text-gray-800"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Telephone Input */}
            <View className="mb-3">
              <View className="flex-row items-center px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                <Ionicons
                  name="call-outline"
                  size={18}
                  color="#6b7280"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  placeholder="Telephone Number"
                  value={telephone}
                  onChangeText={setTelephone}
                  keyboardType="phone-pad"
                  className="flex-1 text-sm text-gray-800"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-3">
              <View className="flex-row items-center px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#6b7280"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  className="flex-1 text-sm text-gray-800"
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-2"
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View className="mb-4">
              <View className="flex-row items-center px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#6b7280"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  className="flex-1 text-sm text-gray-800"
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2"
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              className="mb-3 rounded-2xl overflow-hidden shadow-md"
            >
              <LinearGradient
                colors={["#1E90FF", "#1E90FF"]}
                className="py-3 items-center"
              >
                <Text className="text-white text-base font-semibold">
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Terms and Conditions */}
            <Text className="text-gray-400 text-xs text-center mb-2">
              By creating an account, you agree to our{" "}
              <Text style={{ color: "#2563EB" }}>Terms of Service</Text> and{" "}
              <Text style={{ color: "#2563EB" }}>Privacy Policy</Text>
            </Text>

            {/* Login Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600 text-sm">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: "#2563EB" }}
                >
                  Sign In 
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}