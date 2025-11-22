import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Signup = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const apiUrl = "http://192.168.43.32:8000/api/users/"; // Django users endpoint

  const onSignup = async () => {
    // --- Validation ---
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: fullName.replace(/\s+/g, "_"),
          email: email,
          password: password,
          role: "user" // default role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success 🎉", "Account created successfully!", [
          { text: "Login Now", onPress: () => router.replace("/login") },
        ]);
      } else {
        Alert.alert("Error", data.error || "Failed to create account");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong! Please try again.");
    }
  };

  const onLogin = () => {
    router.push("/login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#F6FFFF]"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 40 }}
        className="px-6"
      >
        {/* Header */}
        <View className="items-center mb-8 mt-10">
          <View className="w-20 h-20 bg-[#E0F7FA] rounded-full justify-center items-center mb-4 border border-[#B2EBF2]">
            <Ionicons name="person-add" size={35} color="#013378" />
          </View>
          <Text className="text-[28px] font-bold text-[#013378]">Create Account</Text>
          <Text className="text-[16px] text-[#02C2CA] mt-1 font-medium">
            Join AI-TEG Academy today
          </Text>
        </View>

        {/* Form */}
        <View className="bg-white p-6 rounded-[20px] shadow-lg shadow-black/10">
          {/* Full Name */}
          <Text className="text-[14px] font-semibold text-[#013378] mb-2">Full Name</Text>
          <View className="flex-row items-center bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 h-[50px] mb-4">
            <Ionicons name="person-outline" size={20} color="#666" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-[16px] text-gray-800"
              placeholder="John Doe"
              placeholderTextColor="#aaa"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Email */}
          <Text className="text-[14px] font-semibold text-[#013378] mb-2">Email Address</Text>
          <View className="flex-row items-center bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 h-[50px] mb-4">
            <Ionicons name="mail-outline" size={20} color="#666" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-[16px] text-gray-800"
              placeholder="admin@aiteg.com"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <Text className="text-[14px] font-semibold text-[#013378] mb-2">Password</Text>
          <View className="flex-row items-center bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 h-[50px] mb-4">
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-[16px] text-gray-800"
              placeholder="••••••••"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text className="text-[14px] font-semibold text-[#013378] mb-2">Confirm Password</Text>
          <View className="flex-row items-center bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 h-[50px] mb-6">
            <Ionicons name="shield-checkmark-outline" size={20} color="#666" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-[16px] text-gray-800"
              placeholder="••••••••"
              placeholderTextColor="#aaa"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons
                name={showConfirm ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onSignup}
            className="bg-[#013378] h-[55px] rounded-2xl justify-center items-center shadow-md shadow-blue-900/30"
          >
            <Text className="text-white text-[18px] font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-500 text-[15px]">Already have an account? </Text>
          <TouchableOpacity onPress={onLogin}>
            <Text className="text-[#013378] font-bold text-[15px]">Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;
