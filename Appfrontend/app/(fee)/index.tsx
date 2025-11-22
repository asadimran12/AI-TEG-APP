import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons"; // For back arrow icon
import { router } from "expo-router";

export default function FeePage() {
  const navigation = useNavigation();
const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = "http://192.168.43.32:8000/api/finance/fees/";

  useEffect(() => {
    const fetchFee = async () => {
      try {
        const response = await axios.get(apiUrl);
        setFees(response.data);
      } catch (error) {
        console.error("Error fetching fees:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFee();
  }, []);

  if (loading) {
    return <Text className="text-center mt-10">Loading...</Text>;
  }

  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this fee record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${apiUrl}${id}/`);
              setFees((prevFee) => prevFee.filter((fee) => fee.id !== id));
            } catch (error) {
              console.error("Error deleting fee:", error);
            }
          },
        },
      ]
    );
  };

  const handleSpecificEntry = (fee:any) => {
    Alert.alert(
      "Student Details",
      `Student: ${fee.student_name}\nFather: ${fee.father_name}\nCourse: ${fee.course}\nDue Date: ${fee.due_date}\nAmount: Rs ${fee.amount}\nStatus: ${fee.status}`,
      [{ text: "OK", style: "default" }]
    );
  };

  const handleToggleStatus = async (fee:any) => {
    const newStatus = fee.status === "Paid" ? "Pending" : "Paid";

    setFees((prevFees) =>
      prevFees.map((f) => (f.id === fee.id ? { ...f, status: newStatus } : f))
    );

    try {
      await axios.patch(`${apiUrl}${fee.id}/`, { status: newStatus });
    } catch (error) {
      console.error(error);
      setFees((prevFees) =>
        prevFees.map((f) =>
          f.id === fee.id ? { ...f, status: fee.status } : f
        )
      );
      Alert.alert(
        "Update Failed",
        `Could not update status for ${fee.student_name}.`
      );
    }
  };

  // --- Animated Toggle Component with Confirmation ---
  const StatusToggle = ({ fee, onToggle }: { fee: any, onToggle?: any }) => {
    const isPaid = fee.status === "Paid";
    const animValue = useRef(new Animated.Value(isPaid ? 1 : 0)).current;

    useEffect(() => {
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
        `Are you sure you want to mark this fee as ${isPaid ? "Pending" : "Paid"} for ${fee.student_name}?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => onToggle(fee) },
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
  // --- End Animated Toggle ---

  return (
    <ScrollView className="flex-1 bg-[#F6FFFF] px-5 pt-10">
      <View className="flex-row items-center  gap-5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
          <Ionicons name="arrow-back" size={28} color="#013378" />
        </TouchableOpacity>

        <Text className="text-[24px] font-bold text-[#013378] mb-5">
          Fee List
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => router.push("/(fee)/AddStudent")}
        className="bg-[#013378] px-5 py-3 rounded-full shadow-md mb-4"
        activeOpacity={0.8}
      >
        <Text className="text-white text-center font-bold text-lg">
          + Add Student
        </Text>
      </TouchableOpacity>

      {fees.map((fee, index) => (
        <TouchableOpacity
          onPress={() => handleSpecificEntry(fee)}
          key={fee.id || index}
          className="flex-row justify-between items-center bg-white p-4 rounded-xl shadow mb-3"
        >
          <View className="flex mr-2">
            <Text className="text-[#013378] font-semibold">
              {fee.student_name}
            </Text>
            <Text className="text-[#4D6B76] font-semibold">
              Rs {fee.amount}
            </Text>
          </View>

          <Text
            className={`font-semibold text-center w-16 ${fee.status === "Paid" ? "text-green-500" : "text-red-500"}`}
          >
            {fee.status}
          </Text>

          <StatusToggle fee={fee} onToggle={handleToggleStatus} />

          <TouchableOpacity
            onPress={() => handleDelete(fee.id)}
            className="bg-red-500 px-3 py-1 rounded ml-2"
          >
            <Text className="text-white font-semibold">Del</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
