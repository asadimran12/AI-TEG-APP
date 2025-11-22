import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function InvestmentList() {
  const navigation = useNavigation();
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = "http://192.168.43.32:8000/api/finance/investments/";

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          Alert.alert("Error", "User not authenticated!");
          setLoading(false);
          return;
        }

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvestments(response.data);
      } catch (error) {
        console.error("Error fetching investments:", error);
        Alert.alert("Error", "Failed to fetch investments.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvestments();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <ActivityIndicator size="large" color="#013378" />
        <Text className="mt-3 text-[#013378]">Loading Investments...</Text>
      </View>
    );
  }

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this investment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("access_token");
              if (!token) {
                Alert.alert("Error", "User not authenticated!");
                return;
              }

              await axios.delete(`${apiUrl}${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              setInvestments((prev) => prev.filter((inv) => inv.id !== id));
            } catch (error) {
              console.error("Error deleting investment:", error);
              Alert.alert("Error", "Failed to delete investment.");
            }
          },
        },
      ]
    );
  };

  const handleViewDetails = (investment: any) => {
    Alert.alert(
      "Investment Details",
      `Item: ${investment.item}\nAmount: Rs ${investment.amount}\nDate: ${investment.date}\nDescription: ${investment.description || "N/A"}`,
      [{ text: "OK", style: "default" }]
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-[#F6FFFF] px-5 pt-10"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Header */}
      <View className="flex-row items-center gap-5 mb-5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
          <Ionicons name="arrow-back" size={28} color="#013378" />
        </TouchableOpacity>
        <Text className="text-[24px] font-bold text-[#013378] mb-5">
          Investments List
        </Text>
      </View>

      {investments.map((inv, index) => (
        <TouchableOpacity
          key={inv.id || index}
          onPress={() => handleViewDetails(inv)}
          className="flex-row justify-between items-center bg-white p-4 rounded-xl shadow mb-3"
        >
          <View className="flex mr-2">
            <Text className="text-[#013378] font-semibold">
              {inv.user?.username || "Unknown"} {/* <-- show username */}
            </Text>
            <Text className="text-[#4D6B76] font-medium">Item: {inv.item}</Text>
            <Text className="text-[#4D6B76] font-medium">
              Amount: Rs {inv.amount}
            </Text>
            <Text className="text-[#738791] text-sm">Date: {inv.date}</Text>
          </View>

          <TouchableOpacity
            onPress={() => handleDelete(inv.id)}
            className="bg-red-500 px-3 py-1 rounded ml-2"
          >
            <Text className="text-white font-semibold">Del</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
