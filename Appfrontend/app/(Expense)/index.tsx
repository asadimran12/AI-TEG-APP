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

const AddExpense = () => {
  const navigation = useNavigation();

  const apiUrl = "http://192.168.43.32:8000/api/finance/Expense/";

  // --- State Variables (Matched to Expense Model) ---
  const [category, setCategory] = useState("Utilities"); 
  const [description, setDescription] = useState("");  
  const [expenseDate, setExpenseDate] = useState(new Date()); 
  const [amount, setAmount] = useState("");      
  const [paymentStatus, setPaymentStatus] = useState("Paid");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setExpenseDate(selectedDate);
  };

  const handleSubmit = async () => {
    if (!description.trim() || !amount.trim()) {
      Alert.alert("Missing Information", "Please fill in Description and Amount.");
      return;
    }

    // 2. Prepare Data (Matched to Django Model Fields)
    const data = {
      category: category,
      description: description.trim(),
      expense_date: expenseDate.toISOString().split("T")[0], // YYYY-MM-DD
      amount: parseFloat(amount),
      payment_status: paymentStatus,
    };

    setIsLoading(true);

    try {
      const response = await axios.post(apiUrl, data);
      
      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success 🎉", "Expense added successfully!");
        // Reset Form
        setCategory("Utilities");
        setDescription("");
        setExpenseDate(new Date());
        setAmount("");
        setPaymentStatus("Paid");
        navigation.goBack();
      } else {
        Alert.alert("Error", `Server returned status ${response.status}`);
      }
    } catch (error) {
      const err = error as any;
      let errorMessage = "An unknown error occurred.";

      if (err.response && err.response.data) {
        errorMessage = JSON.stringify(err.response.data);
      } else if (err.message && err.message.includes("Network Error")) {
        errorMessage = "Network Error: Could not connect to server. Check your IP/device.";
      }
      Alert.alert("Error Adding Expense", errorMessage);
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
          Add Daily Expense
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
        {/* Category Picker - Matched to your Django 'EXPENSE_CATEGORIES' */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Category</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            marginBottom: 15,
          }}
        >
          <Picker
            selectedValue={category}
            onValueChange={(item) => setCategory(item)}
          >
            <Picker.Item label="Electricity / Utilities" value="Utilities" />
            <Picker.Item label="Snacks / Tea" value="Refreshments" />
            <Picker.Item label="Notes / Printing" value="Stationery" />
            <Picker.Item label="Repairs / Maintenance" value="Maintenance" />
            <Picker.Item label="Miscellaneous" value="Miscellaneous" />
          </Picker>
        </View>

        {/* Description Input */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Description / Details</Text>
        <TextInput
          placeholder="e.g. October Bill, Guest Tea"
          value={description}
          onChangeText={setDescription}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 8,
            marginBottom: 15,
          }}
        />

        {/* Expense Date Picker */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Expense Date</Text>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 8,
            marginBottom: 15,
          }}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{expenseDate.toISOString().split("T")[0]}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={expenseDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Amount Input */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Amount (Rs)</Text>
        <TextInput
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 8,
            marginBottom: 15,
          }}
        />

        {/* Payment Status Picker */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Payment Status</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            marginBottom: 0,
          }}
        >
          <Picker
            selectedValue={paymentStatus}
            onValueChange={(item) => setPaymentStatus(item)}
          >
            <Picker.Item label="Paid" value="Paid" />
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="Partial" value="Partial" />
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
          {isLoading ? "Saving..." : "Add Expense"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddExpense;