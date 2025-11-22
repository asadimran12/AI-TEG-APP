import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useNavigation } from "expo-router";

const TeacherPay = () => {
  const navigation = useNavigation();
  const apiUrl = "http://192.168.43.32:8000/api/finance/teacher-pays/";

  const [teacherName, setTeacherName] = useState("");
  const [course, setCourse] = useState("Robotics");
  const [contactNumber, setContactNumber] = useState("");
  const [payDate, setPayDate] = useState(new Date());
  const [payStatus, setPayStatus] = useState("Pending");
  const [amount, setAmount] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    void event
    if (selectedDate) setPayDate(selectedDate);
  };

  const handleSubmit = async () => {
    if (!teacherName.trim() || !amount.trim()) {
      Alert.alert("Missing Information", "Teacher Name and Amount required");
      return;
    }

    const data = {
      teacher_name: teacherName.trim(),
      course,
      Contactnumber: contactNumber.trim(),
      pay_date: payDate.toISOString().split("T")[0],
      pay_status: payStatus,
      amount: parseFloat(amount),
    };

    setIsLoading(true);

    try {
      const response = await axios.post(apiUrl, data);
      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success 🎉", "Teacher record added successfully.");
        setTeacherName("");
        setCourse("Robotics");
        setContactNumber("");
        setPayDate(new Date());
        setAmount("");
        setPayStatus("Pending");
      }
    } catch (error) {
      const err = error as any
      Alert.alert("Error", err.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F6FFFF", paddingHorizontal: 20, paddingTop: 40 }}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#013378" />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#013378", marginLeft: 15 }}>
          Teacher Pay
        </Text>
      </View>

      {/* Form Card */}
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
          marginBottom: 20,
        }}
      >
        {/* Teacher Name */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Teacher Name *</Text>
        <TextInput
          placeholder="Enter teacher name"
          value={teacherName}
          onChangeText={setTeacherName}
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 15 }}
        />

        {/* Course */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Course</Text>
        <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 15 }}>
          <Picker selectedValue={course} onValueChange={setCourse}>
            <Picker.Item label="Robotics" value="Robotics" />
            <Picker.Item label="Programming" value="Programming" />
            <Picker.Item label="AI" value="AI" />
            <Picker.Item label="Training" value="Training" />
          </Picker>
        </View>

        {/* Contact Number */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Contact Number</Text>
        <TextInput
          placeholder="Enter contact number"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 15 }}
        />

        {/* Pay Date */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Pay Date</Text>
        <TouchableOpacity
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 15 }}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{payDate.toISOString().split("T")[0]}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker value={payDate} mode="date" display="default" onChange={handleDateChange} />
        )}

        {/* Amount */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Amount *</Text>
        <TextInput
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 15 }}
        />

        {/* Pay Status */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Pay Status</Text>
        <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 0 }}>
          <Picker selectedValue={payStatus} onValueChange={setPayStatus}>
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="Paid" value="Paid" />
          </Picker>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={{
          backgroundColor: isLoading ? "#ccc" : "#013378",
          padding: 15,
          borderRadius: 20,
          alignItems: "center",
        }}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          {isLoading ? "Saving..." : "Add Teacher Pay"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TeacherPay;
