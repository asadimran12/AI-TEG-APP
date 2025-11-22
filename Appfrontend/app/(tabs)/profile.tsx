import { View, Text, Alert, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserProfile {
  name: string;
  role: string;
  email: string;
  phone: string;
  institute: string;
  launched: string;
  active_modules: number;
  location: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          Alert.alert("Error", "User not authenticated!");
          setLoading(false);
          return;
        }

        const response = await fetch("http://192.168.43.32:8000/api/users/profile/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUser({
            name: data.name || data.username,
            role: data.role,
            email: data.email,
            phone: data.phone || "N/A",
            institute: data.institute || "Ai-Teg Academy",
            launched: data.launched || "2025",
            active_modules: data.active_modules || 4,
            location: data.location || "Karachi, Pakistan",
          });
        } else {
          Alert.alert("Error", data.error || "Failed to fetch profile");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Something went wrong while fetching profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F6F7FB]">
        <ActivityIndicator size="large" color="#013378" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F6F7FB]">
        <Text className="text-gray-500">No profile data available.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F6F7FB] p-5">
      {/* Avatar Section */}
      <View className="items-center mb-8">
        <View className="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-[#013378] to-[#02C2CA] justify-center items-center shadow-lg mb-3">
          <Text className="text-white font-extrabold text-[40px]">{user.name[0]}</Text>
        </View>
        <Text className="text-[#013378] text-[20px] font-bold">{user.name}</Text>
        <Text className="text-gray-500 text-[14px] mt-1">{user.role}</Text>
      </View>

      {/* Personal Info Card */}
      <View className="bg-white rounded-2xl p-5 mb-5 shadow-lg">
        <Text className="text-[#013378] font-bold text-[18px] mb-3 border-b border-gray-200 pb-2">
          Personal Information
        </Text>
        <View className="space-y-2">
          <Text className="text-gray-700 text-[14px]">Name: {user.name}</Text>
          <Text className="text-gray-700 text-[14px]">Role: {user.role}</Text>
          <Text className="text-gray-700 text-[14px]">Email: {user.email}</Text>
        </View>
      </View>

      {/* Academy Info Card */}
      <View className="bg-white rounded-2xl p-5 shadow-lg">
        <Text className="text-[#013378] font-bold text-[18px] mb-3 border-b border-gray-200 pb-2">
          Academy Information
        </Text>
        <View className="space-y-2">
          <Text className="text-gray-700 text-[14px]">Institute: {user.institute}</Text>
          <Text className="text-gray-700 text-[14px]">Launched: {user.launched}</Text>
          <Text className="text-gray-700 text-[14px]">Active Modules: {user.active_modules}</Text>
          <Text className="text-gray-700 text-[14px]">Location: {user.location}</Text>
        </View>
      </View>
    </View>
  );
}

