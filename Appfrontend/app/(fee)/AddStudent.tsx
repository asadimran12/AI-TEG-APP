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

const AddStudent = () => {
  const navigation = useNavigation();

  const [studentName, setStudentName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [course, setCourse] = useState("Robotics");
  const [dueDate, setDueDate] = useState(new Date());
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Pending");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = "http://192.168.43.32:8000/api/finance/fees/";

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    void event
    if (selectedDate) setDueDate(selectedDate);
  };

  const handleSubmit = async () => {
    if (!studentName.trim() || !amount.trim()) {
      Alert.alert("Missing Information", "Please enter the Student Name and Amount.");
      return;
    }

    const data = {
      student_name: studentName.trim(),
      father_name: fatherName.trim(),
      course: course,
      due_date: dueDate.toISOString().split("T")[0],
      amount: parseFloat(amount),
      status: status,
    };

    setIsLoading(true);

    try {
      const response = await axios.post(apiUrl, data);
      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success! 🎉", `Fee record for ${studentName} created successfully.`);
        setStudentName("");
        setFatherName("");
        setCourse("Robotics");
        setDueDate(new Date());
        setAmount("");
        setStatus("Pending");
      } else {
        Alert.alert("Submission Error", `Received status code ${response.status}`);
      }
    } catch (error) {
      
      const err=error as any
      let errorMessage = "An unknown error occurred.";
      if (err.response && err.response.data) errorMessage = JSON.stringify(err.response.data);
      else if (err.message.includes("Network Error")) errorMessage = "Network Error: Check server connection.";
      Alert.alert("Error 🛑", errorMessage);
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
          Add Student
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
        {/* Student Name */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Student Name *</Text>
        <TextInput
          placeholder="Enter student name"
          value={studentName}
          onChangeText={setStudentName}
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 15 }}
        />

        {/* Father Name */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Father Name</Text>
        <TextInput
          placeholder="Enter father name"
          value={fatherName}
          onChangeText={setFatherName}
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

        {/* Due Date */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Due Date</Text>
        <TouchableOpacity
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 15 }}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{dueDate.toISOString().split("T")[0]}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker value={dueDate} mode="date" display="default" onChange={handleDateChange} />
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

        {/* Status */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Status</Text>
        <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 0 }}>
          <Picker selectedValue={status} onValueChange={setStatus}>
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
          {isLoading ? "Adding Student..." : "Add Student"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddStudent;
