import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

export default function Expense() {
  const [categories, setCategories] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalTypes, setTotalTypes] = useState(0);

  const apiUrlSummary = "http://192.168.43.32:8000/api/finance/Expense/summary/";
  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrlSummary);
      const data = response.data;

      setCategories(data.categories);
      setTotalValue(data.overall_total || 0);
      setTotalTypes(data.total_categories || 0);
    } catch (error) {
      console.error("Error fetching assets summary:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-[#F6FFFF] px-5 pt-10"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Page Header */}
      <Text className="text-[28px] font-bold text-[#013378] mb-1">
        Expense Module
      </Text>
      <Text className="text-[14px] font-medium text-[#02C2CA] mb-6">
        Manage all academy physical resources
      </Text>

      {/* Top Summary */}
      <View className="flex-row justify-between mb-6">
        <View className=" bg-white p-5 rounded-2xl shadow-lg">
          <Text className="text-[#013378] font-medium text-[14px]">
            Total Expense Value
          </Text>
          <Text className="text-[#013378] font-bold text-[20px] mt-2">
            Rs {totalValue.toFixed(2)}
          </Text>
        </View>

        <View className="w-[48%] bg-white p-5 rounded-2xl shadow-lg">
          <Text className="text-[#013378] font-medium text-[14px]">
            Expense Types
          </Text>
          <Text className="text-[#013378] font-bold text-[20px] mt-2">
            {totalTypes}
          </Text>
        </View>
      </View>

      {/* Asset Categories */}
      <View className="mt-8">
        <Text className="text-[#013378] font-bold text-[18px] mb-4">
          Expense Categories
        </Text>

        {categories.map((item) => (
          <View key={item.category}>
            <View className="flex-row justify-between bg-white p-4 rounded-2xl mb-3 shadow-lg">
              <Text className="text-[#013378] font-medium text-[16px]">
                {item.category} ({item.sub_item_count} items)
              </Text>
              <Text className="text-[#013378] font-bold text-[16px]">
                Rs {item.total_value?.toFixed(2) || 0}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between mt-8">
        <TouchableOpacity
          onPress={() => router.push("/(Expense)")}
          className="w-[48%] bg-[#013378] py-4 rounded-2xl items-center shadow-lg"
        >
          <Text className="text-white font-bold text-[16px]">
            + Add New Expense
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(Expense)/Expenselist")}
          className="w-[48%] bg-[#02C2CA] py-4 rounded-2xl items-center shadow-lg"
        >
          <Text className="text-[#013378] font-semibold text-[15px]">
            View Full Assets List
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
