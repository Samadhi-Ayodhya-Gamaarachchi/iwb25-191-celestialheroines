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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", "Invalid email or password");
      }
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push("/RegisterScreen" as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Colorful Header with Illustration */}
        <LinearGradient
          colors={["#E0F2FE", "#3B82F6"]}
          className="rounded-b-3xl"
          style={{ height: height * 0.42 }}
        >
          <View className="flex-1 items-center justify-center px-8 relative overflow-hidden">
            {/* Decorative Elements */}
            <View className="absolute top-10 left-6 w-8 h-8 rounded-full bg-red-400" />
            <View className="absolute top-16 right-8 w-6 h-6 rounded-full bg-blue-400" />
            <View className="absolute top-24 left-12 w-4 h-4 rounded-full bg-green-400" />
            <View className="absolute top-32 right-16 w-10 h-10 rounded-full bg-pink-400" />
            <View className="absolute bottom-20 left-4 w-6 h-6 rounded-full bg-purple-400" />
            <View className="absolute bottom-16 right-6 w-8 h-8 rounded-full bg-cyan-400" />

            {/* Cloud decorations */}
            <View className="absolute top-12 right-20 bg-white/30 rounded-full px-4 py-2">
              <Text className="text-white text-xs">☁️</Text>
            </View>
            <View className="absolute top-20 left-20 bg-white/30 rounded-full px-3 py-1">
              <Text className="text-white text-xs">☁️</Text>
            </View>

            {/* Main Illustration Area */}
            <View className="items-center mt-8">
              {/* Giraffe Image */}
              <Image
                source={require("@/assets/images/logo.png")} // Replace with your image path
                style={{
                  width: 200,
                  height: 250,
                  resizeMode: "contain",
                }}
              />

              {/* Characters around giraffe */}
              <View className="absolute -left-8 top-8 w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
                <Text className="text-white text-lg font-bold">B</Text>
              </View>

              <View className="absolute -right-8 top-16 w-10 h-10 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-sm font-bold">R</Text>
              </View>

              <View className="absolute left-20 bottom-4 w-8 h-8 bg-green-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">G</Text>
              </View>
            </View>

            {/* Ground */}
            <View className="absolute bottom-0 left-0 right-0 h-4 bg-green-400 rounded-t-full" />
            <View className="absolute bottom-2 left-8 w-6 h-6 bg-green-500 rounded-full" />
            <View className="absolute bottom-1 right-12 w-4 h-4 bg-green-500 rounded-full" />
          </View>
        </LinearGradient>

        {/* Login Form */}
        <View className="flex-1 px-6 -mt-8">
          <View
            className="bg-white rounded-3xl shadow-xl p-6"
            style={{ minHeight: height * 0.1 }}
          >
            {/* Welcome Text Section */}
            <View className="items-center mb-6 mt-4">
              <Text className="text-3xl font-bold text-blue-600 mb-2 text-center">
                Welcome Back!
              </Text>
              <Text className="text-base text-blue-600/90 text-center px-4">
                Continue your little one's care journey with TikiriCare
              </Text>
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <View className="flex-row items-center px-4 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#6b7280"
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  placeholder="toppickdesign@gmail"
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
              <View className="flex-row items-center px-4 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6b7280"
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  placeholder="••••••••••"
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
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className="mb-4 rounded-2xl overflow-hidden shadow-md"
            >
              <LinearGradient
                colors={["#1E90FF", "#1E90FF"]}
                className="py-4 items-center"
              >
                <Text className="text-white text-lg font-semibold">
                  {isLoading ? "Signing In..." : "Sign In"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity className="mb-6">
              <Text className="text-center text-gray-500 text-sm">
                Forgot password?
              </Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600 text-sm">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: "#2563EB" }}
                >
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
