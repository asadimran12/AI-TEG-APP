import { useRouter } from "expo-router";
import { ReactNode, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface InvestmentType {
  user__username: ReactNode;
  item: string;
  total_amount: number;
  count: number;
}

export default function Investment() {
  const router = useRouter();
  const [investments, setInvestments] = useState<InvestmentType[]>([]);
  const [totalInvestment, setTotalInvestment] = useState(0);

  const fetchInvestments = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const role = await AsyncStorage.getItem("user_role"); // optional, if needed for role-based logic

      if (!token) {
        Alert.alert("Unauthorized", "Please login first.");
        router.push("/login");
        return;
      }

      const response = await fetch(
        "http://192.168.43.32:8000/api/finance/investments/summary/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // send token
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setInvestments(data.items || []);
        setTotalInvestment(data.overall_total || 0);
      } else {
        Alert.alert("Error", data.error || "Failed to fetch investment data.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while fetching investments.");
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-[#F6FFFF] px-5 pt-10"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Page Header */}
      <Text className="text-[28px] font-bold text-[#013378] mb-1">
        Investment Module
      </Text>
      <Text className="text-[14px] font-medium text-[#02C2CA] mb-6">
        Track academy investment growth
      </Text>

      {/* Top Summary */}
      <View className="flex-row justify-between mb-6">
        <View className="bg-white p-5 rounded-2xl shadow-lg w-[48%]">
          <Text className="text-[#013378] font-medium text-[14px]">
            Total Investment
          </Text>
          <Text className="text-[#013378] font-bold text-[20px] mt-2">
            Rs {totalInvestment.toLocaleString()}
          </Text>
        </View>

        <View className="bg-white p-5 rounded-2xl shadow-lg w-[48%]">
          <Text className="text-[#013378] font-medium text-[14px]">
            Investment Types
          </Text>
          <Text className="text-[#013378] font-bold text-[20px] mt-2">
            {investments.length}
          </Text>
        </View>
      </View>

      {/* Investment Entries */}
      <View className="mt-8">
        <Text className="text-[#013378] font-bold text-[18px] mb-4">
          Investment Entries
        </Text>

        {investments.map((inv, index) => (
          <View
            key={index}
            className="flex-row justify-between bg-white p-4 rounded-xl shadow mb-3"
          >
            <Text className="text-[#013378] font-semibold text-[14px]">
              {inv.user__username} {/* <-- show username */}
            </Text>
            <Text className="text-[#4D6B76] font-semibold text-[14px]">
              Rs {Number(inv.total_amount).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between mt-8">
        <TouchableOpacity
          onPress={() => router.push("/(Investment)")}
          className="w-[48%] bg-[#013378] py-4 rounded-2xl items-center shadow-lg"
        >
          <Text className="text-white font-bold text-[16px]">
            + Add Investment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(Investment)/InvestmentList")}
          className="w-[48%] bg-[#02C2CA] py-4 rounded-2xl items-center shadow-lg"
        >
          <Text className="text-[#013378] font-semibold text-[15px]">
            View Full List
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
