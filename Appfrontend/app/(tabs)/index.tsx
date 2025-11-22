import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import "../../global.css";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);

  const teacherapi = "http://192.168.43.32:8000/api/finance/teacher-pays/";
  const studentapi = "http://192.168.43.32:8000/api/finance/fees/";
  const feeapi = "http://192.168.43.32:8000/api/finance/fees/overall-student-fee-calculation/";

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [teacherRes, studentRes, feeRes] = await Promise.all([
          axios.get(teacherapi),
          axios.get(studentapi),
          axios.get(feeapi),
        ]);

        setTeachersCount(teacherRes.data.length); // Count of teachers
        setStudentsCount(studentRes.data.length); // Count of students
        setTotalAmount(feeRes.data.total_paid_fees); // Paid fees
        setPendingAmount(feeRes.data.total_pending_fees); // Pending fees
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchAllData();


    const loadUsername = async () => {
    const value = await AsyncStorage.getItem("Username");
    setUsername(value);
  };

  loadUsername();
  }, []);


  return (
    <ScrollView
      className="flex-1 bg-[#F6FFFF] pt-14 pb-14 px-5"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center mb-5">
        <Image
          source={require("../../assets/images/Logo.png")}
          style={{ width: 100, height: 100, resizeMode: "contain" }}
        />
      </View>

      <View className="bg-[#013378] px-5 pt-4 rounded-2xl mb-8 shadow items-center">
        <Text className="text-[20px] font-semibold text-white">
          Welcome {username} 👋
        </Text>
        <Text className="text-[14px] text-[#02C2CA] mb-6">
          Manage your academy finances with ease
        </Text>
      </View>

      <View className="items-center mb-8">
        <Text className="text-[28px] font-bold text-[#013378]">
          AI-Teg Academy
        </Text>
        <Text className="text-[16px] text-[#02C2CA] mt-1">
          Smart Financial Control System
        </Text>
      </View>

      <View className="flex-row justify-between">
        <View className="w-[48%] bg-white p-5 rounded-2xl shadow">
          <Text className="text-[#013378] font-medium">Paid Fees</Text>
          <Text className="text-[20px] font-bold text-[#013378] mt-2">
            Rs {totalAmount}
          </Text>
        </View>

        <View className="w-[48%] bg-white p-5 rounded-2xl shadow">
          <Text className="text-[#013378] font-medium">Pending Fees</Text>
          <Text className="text-[20px] font-bold text-[#013378] mt-2">
            Rs {pendingAmount}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-around mt-9">
        <View className="w-[30%] bg-white py-4 rounded-xl shadow items-center">
          <Text className="text-[#013378] text-[12px] font-medium">
            Students
          </Text>
          <Text className="mt-1 text-[18px] font-bold text-[#013378]">
            {studentsCount}
          </Text>
        </View>

        <View className="w-[30%] bg-white py-4 rounded-xl shadow items-center">
          <Text className="text-[#013378] text-[12px] font-medium">
            Teachers
          </Text>
          <Text className="mt-1 text-[18px] font-bold text-[#013378]">
            {teachersCount}
          </Text>
        </View>
      </View>

      <View className="mt-10 flex-row justify-between px-5 pb-10">
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-1 bg-[#013378] rounded-2xl p-4 mr-3 shadow-lg items-center"
          onPress={() => router.push("/(fee)/ViewTeacher")}
        >
          <Text className="text-white text-[16px] font-semibold">
            View Teachers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-1 bg-[#013378] rounded-2xl p-4 ml-3 shadow-lg items-center"
          onPress={() => router.push("/(fee)")}
        >
          <Text className="text-white text-[16px] font-semibold">
            View Fees
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
