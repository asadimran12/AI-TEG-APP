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
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const logo: any = require("../assets/images/Logo.png");

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const apiUrl = "http://192.168.43.32:8000/api/users/login/";

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log(data)
      if (response.ok) {
        await AsyncStorage.setItem("Username",data.username)
        await AsyncStorage.setItem("access_token", data.access);
        await AsyncStorage.setItem("refresh_token", data.refresh);
        await AsyncStorage.setItem("user_role", data.role || "user");

        if (Platform.OS === "web") {
          alert(`Welcome ${data.username}`);
          router.push("/(tabs)");
        } else {
          Alert.alert("Success", `Welcome ${data.username}`, [
            { text: "OK", onPress: () => router.push("/(tabs)") },
          ]);
        }
      } else {
        Alert.alert("Error", data.error || "Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong! Please try again.");
    }
  };

  const onSignup = () => {
    router.push("/Signup");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#F6FFFF]"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingBottom: 40,
        }}
        className="px-6"
      >
        {/* --- Header Section --- */}
        <View className="items-center mb-10 mt-10">
          <View className="w-24 h-24 bg-[#E0F7FA] rounded-full justify-center items-center mb-5 border border-[#B2EBF2] overflow-hidden">
            <Image source={logo} style={{ width: 80, height: 80 }} resizeMode="contain" />
          </View>
          <Text className="text-[28px] font-bold text-[#013378]">AI-TEG Academy</Text>
          <Text className="text-[16px] text-[#02C2CA] mt-1 font-medium">
            Sign in to manage your academy
          </Text>
        </View>

        {/* --- Form Section --- */}
        <View className="bg-white p-6 rounded-[20px] shadow-lg shadow-black/10">
          {/* Email */}
          <Text className="text-[14px] font-semibold text-[#013378] mb-2 mt-2">
            Email Address
          </Text>
          <View className="flex-row items-center bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 h-[50px]">
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
          <Text className="text-[14px] font-semibold text-[#013378] mb-2 mt-4">Password</Text>
          <View className="flex-row items-center bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 h-[50px]">
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
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity className="items-end mt-3 mb-6">
            <Text className="text-[#02C2CA] font-semibold">Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onLogin}
            className="bg-[#013378] h-[55px] rounded-2xl justify-center items-center shadow-md shadow-blue-900/30"
          >
            <Text className="text-white text-[18px] font-bold">Login</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-500 text-[15px]">Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={onSignup}>
            <Text className="text-[#013378] font-bold text-[15px]">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
