import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "expo-router";

export default function ExpenseList() {
  const navigation = useNavigation();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = "http://192.168.43.32:8000/api/finance/Expense/";

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get(apiUrl);
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching assets:", error);
        Alert.alert("Error", "Failed to fetch assets.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <ActivityIndicator size="large" color="#013378" />
        <Text className="mt-3 text-[#013378]">Loading Assets...</Text>
      </View>
    );
  }

  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this asset?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${apiUrl}${id}/`);
              setExpenses((prev) => prev.filter((a) => a.id !== id));
            } catch (error) {
              console.error("Error deleting asset:", error);
              Alert.alert("Error", "Failed to delete asset.");
            }
          },
        },
      ]
    );
  };

 const handleSpecificEntry = (expense: any) => {
    Alert.alert(
      "Expense Details",
      `Category: ${expense.category}\nDescription: ${expense.description}\nDate: ${expense.expense_date}\nAmount: Rs ${expense.amount}\nStatus: ${expense.payment_status}`,
      [{ text: "OK", style: "default" }]
    );
  };

  const handleToggleStatus = async (asset: any) => {
    const newStatus =
      asset.payment_status === "Paid"
        ? "Pending"
        : asset.payment_status === "Pending"
        ? "Partial"
        : "Paid";

    // Optimistic update
    setExpenses((prev) =>
      prev.map((a) =>
        a.id === asset.id ? { ...a, payment_status: newStatus } : a
      )
    );

    try {
      await axios.patch(`${apiUrl}${asset.id}/update-status/`, {
        payment_status: newStatus,
      });
    } catch (error) {
      console.error(error);
      // rollback if error
      setExpenses((prev) =>
        prev.map((a) =>
          a.id === asset.id ? { ...a, payment_status: asset.payment_status } : a
        )
      );
      Alert.alert("Update Failed", `Could not update status for ${asset.sub_item}.`);
    }
  };

  // Animated Toggle Component
  const StatusToggle = ({ asset, onToggle }: any) => {
    const isPaid = asset.payment_status === "Paid";
    const animValue = useRef(new Animated.Value(isPaid ? 1 : 0)).current;

    React.useEffect(() => {
      Animated.timing(animValue, {
        toValue: isPaid ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }, [isPaid, animValue]);

    const translateX = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 22],
    });

    const bgColor = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgb(239, 68, 68)", "rgb(34, 197, 94)"],
    });

    const handlePress = () => {
      Alert.alert(
        "Confirm Status Change",
        `Change status for ${asset.sub_item}?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => onToggle(asset) },
        ]
      );
    };

    return (
      <TouchableOpacity
        onPress={handlePress}
        className="w-14 h-8 rounded-full border p-1"
        style={{
          borderColor: isPaid ? "green" : "red",
          backgroundColor: isPaid ? "#BBF7D0" : "#FCA5A5",
        }}
      >
        <Animated.View
          className="w-6 h-6 rounded-full shadow-md"
          style={{
            transform: [{ translateX }],
            backgroundColor: bgColor,
          }}
        />
      </TouchableOpacity>
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
          Assets List
        </Text>
      </View>

      {expenses.map((expense, index) => (
        <TouchableOpacity
          key={expense.id || index}
          onPress={() => handleSpecificEntry(expense)}
          className="flex-row justify-between items-center bg-white p-4 rounded-xl shadow mb-3"
        >
          <View className="flex mr-2">
            <Text className="text-[#013378] font-semibold">
              {expense.category}
            </Text>
            <Text className="text-[#4D6B76] font-medium">
              Decription: {expense.description}
            </Text>
            <Text className="text-[#738791] text-sm">
              Cost: Rs {expense.amount}
            </Text>
          </View>

          <StatusToggle asset={expense} onToggle={handleToggleStatus} />

          <TouchableOpacity
            onPress={() => handleDelete(expense.id)}
            className="bg-red-500 px-3 py-1 rounded ml-2"
          >
            <Text className="text-white font-semibold">Del</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
