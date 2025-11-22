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

const AddAsset = () => {
  const navigation = useNavigation();
  const apiUrl = "http://192.168.43.32:8000/api/finance/assests/";

  const [mainCategory, setMainCategory] = useState("Furniture");
  const [subItem, setSubItem] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [cost, setCost] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    void event;
    if (selectedDate) setPurchaseDate(selectedDate);
  };

  const handleSubmit = async () => {
    if (!subItem.trim() || !cost.trim()) {
      Alert.alert("Missing Information", "Please fill all fields.");
      return;
    }

    const data = {
      main_category: mainCategory,
      sub_item: subItem.trim(),
      purchase_date: purchaseDate.toISOString().split("T")[0],
      cost: parseFloat(cost),
      payment_status: paymentStatus,
    };

    setIsLoading(true);

    try {
      const response = await axios.post(apiUrl, data);
      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success 🎉", `Asset "${subItem}" added successfully!`);
        setMainCategory("Furniture");
        setSubItem("");
        setPurchaseDate(new Date());
        setCost("");
        setPaymentStatus("Paid");
        navigation.goBack();
      } else {
        Alert.alert("Error", `Server returned status ${response.status}`);
      }
    } catch (error) {
      const err=error as any
      let errorMessage = "An unknown error occurred.";
      if (err.response && err.response.data) {
        errorMessage = JSON.stringify(err.response.data);
      } else if (err.message.includes("Network Error")) {
        errorMessage =
          "Network Error: Could not connect to server. Check your IP/device.";
      }
      Alert.alert("Error Adding Asset", errorMessage);
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
          Add Asset
        </Text>
      </View>

      {/* Form */}
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
        {/* Main Category */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Main Category</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            marginBottom: 15,
          }}
        >
          <Picker
            selectedValue={mainCategory}
            onValueChange={(item) => setMainCategory(item)}
          >
            <Picker.Item label="Furniture" value="Furniture" />
            <Picker.Item label="Lab Equipment" value="Lab Equipment" />
            <Picker.Item label="Electronics" value="Electronics" />
            <Picker.Item label="Stationery" value="Stationery" />
          </Picker>
        </View>

        {/* Sub Item */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Sub Item</Text>
        <TextInput
          placeholder="Enter sub item"
          value={subItem}
          onChangeText={setSubItem}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 8,
            marginBottom: 15,
          }}
        />

        {/* Purchase Date */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Purchase Date</Text>
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
          <Text>{purchaseDate.toISOString().split("T")[0]}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={purchaseDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Cost */}
        <Text style={{ fontWeight: "600", color: "#013378", marginBottom: 5 }}>Cost</Text>
        <TextInput
          placeholder="Enter cost"
          value={cost}
          onChangeText={setCost}
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 8,
            marginBottom: 15,
          }}
        />

        {/* Payment Status */}
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
          {isLoading ? "Adding Asset..." : "Add Asset"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddAsset;
