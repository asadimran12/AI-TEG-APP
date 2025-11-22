import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { router, useNavigation } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function ViewTeachers() {
  const navigation = useNavigation();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = "http://192.168.43.32:8000/api/finance/teacher-pays/";

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(apiUrl);
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teacher pays:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  if (loading) {
    return <Text className="text-center mt-10">Loading...</Text>;
  }

  const handleDelete = (id:number) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this teacher payment record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${apiUrl}${id}/`);
              setTeachers((prevTeachers)=>prevTeachers.filter((t) => t.id !== id));
            } catch (error) {
              console.error("Error deleting teacher pay:", error);
            }
          },
        },
      ]
    );
  };

  const handleSpecificEntry = (teacher:any) => {
    Alert.alert(
      "Teacher Details",
      `Teacher: ${teacher.teacher_name}\nCourse: ${teacher.course}\nPay: Rs ${teacher.amount}\nPay Status: ${teacher.pay_status}\nPay on Date: ${teacher.pay_date}`,
      [{ text: "OK", style: "default" }]
    );
  };

  const handleToggleStatus = async (teacher:any) => {
    const newStatus = teacher.pay_status === "Paid" ? "Pending" : "Paid";
    const newDate =
      newStatus === "Paid"
        ? new Date().toISOString().split("T")[0]
        : teacher.pay_date;

    // Optimistic update
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === teacher.id
          ? { ...t, pay_status: newStatus, pay_date: newDate }
          : t
      )
    );

    try {
      await axios.patch(`${apiUrl}${teacher.id}/update-status/`, {
        pay_status: newStatus, // ✅ send pay_status, not status
        pay_date: newDate,
      });
    } catch (error) {
      console.error(error);
      // rollback if error
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === teacher.id
            ? {
                ...t,
                pay_status: teacher.pay_status,
                pay_date: teacher.pay_date,
              }
            : t
        )
      );
      Alert.alert(
        "Update Failed",
        `Could not update status for ${teacher.teacher_name}.`
      );
    }
  };

  // Animated Toggle Component
  const StatusToggle = ({ teacher, onToggle }:{teacher:any,onToggle:Function}) => {
    const isPaid = teacher.pay_status === "Paid";
    const animValue = useRef(new Animated.Value(isPaid ? 1 : 0)).current;

    React.useEffect(() => {
      Animated.timing(animValue, {
        toValue: isPaid ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }, [isPaid]);

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
        `Are you sure you want to mark this teacher as ${isPaid ? "Pending" : "Paid"}?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => onToggle(teacher) },
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
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="flex-row items-center gap-5 mb-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#013378" />
        </TouchableOpacity>
        <Text className="text-[24px] font-bold text-[#013378]">
          Teacher List
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(fee)/AddTeacherPay")}
        className="bg-[#013378] px-5 py-3 rounded-full shadow-md mb-4"
        activeOpacity={0.8}
      >
        <Text className="text-white text-center font-bold text-lg">
          + Add Teacher
        </Text>
      </TouchableOpacity>

      {teachers.map((teacher, index) => (
        <TouchableOpacity
          key={teacher.id || index}
          onPress={() => handleSpecificEntry(teacher)}
          className="flex-row justify-between items-center bg-white p-4 rounded-xl shadow mb-3"
        >
          <View className="flex mr-2">
            <Text className="text-[#013378] font-semibold">
              {teacher.teacher_name}
            </Text>
            <Text className="text-[#4D6B76] font-medium">{teacher.course}</Text>
            <Text className="text-[#738791] text-sm">
              Pay: Rs {teacher.amount}
            </Text>
          </View>

          <Text className="font-semibold text-blue-500">
            {teacher.pay_date}
          </Text>

          <StatusToggle teacher={teacher} onToggle={handleToggleStatus} />

          <TouchableOpacity
            onPress={() => handleDelete(teacher.id)}
            className="bg-red-500 px-3 py-1 rounded ml-2"
          >
            <Text className="text-white font-semibold">Del</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
