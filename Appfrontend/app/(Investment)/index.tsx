import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddInvestment = () => {
  const navigation = useNavigation();
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const apiUrl = "http://192.168.43.32:8000/api/finance/investments/";

  const handleSubmit = async () => {
    if (!item || !amount || !date) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          Alert.alert("Error", "User not authenticated!")
          return;
        }
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          
        },
        body: JSON.stringify({
          item,
          amount: parseFloat(amount),
          date,
          description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success 🎉", "Investment added successfully!");
        setItem("");
        setAmount("");
        setDate("");
        setDescription("");
      } else {
        Alert.alert("Error", data.error || "Failed to add investment");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#F6FFFF" }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
            <Ionicons name="arrow-back" size={28} color="#013378" />
          </TouchableOpacity>

          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#013378" }}>
            Add Investment
          </Text>
        </View>

        {/* Form Card */}
        <View
          style={{
            backgroundColor: "#fff",
            padding: 25,
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 6,
            marginTop: 10,
            marginBottom: 30,
          }}
        >
          {/* Item */}
          <Text style={{ marginBottom: 5, fontWeight: "600" }}>Item</Text>
          <TextInput
            value={item}
            onChangeText={setItem}
            placeholder="Investment item"
            style={{
              borderWidth: 1,
              borderColor: "#d4d4d4",
              padding: 12,
              borderRadius: 10,
              marginBottom: 18,
              backgroundColor: "#fff",
            }}
          />

          {/* Amount */}
          <Text style={{ marginBottom: 5, fontWeight: "600" }}>Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Amount"
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: "#d4d4d4",
              padding: 12,
              borderRadius: 10,
              marginBottom: 18,
              backgroundColor: "#fff",
            }}
          />

          {/* Date */}
          <Text style={{ marginBottom: 5, fontWeight: "600" }}>Date</Text>
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            style={{
              borderWidth: 1,
              borderColor: "#d4d4d4",
              padding: 12,
              borderRadius: 10,
              marginBottom: 18,
              backgroundColor: "#fff",
            }}
          />

          {/* Description */}
          <Text style={{ marginBottom: 5, fontWeight: "600" }}>
            Description (optional)
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Notes..."
            multiline
            style={{
              borderWidth: 1,
              borderColor: "#d4d4d4",
              padding: 12,
              borderRadius: 10,
              minHeight: 90,
              backgroundColor: "#fff",
              textAlignVertical: "top",
              marginBottom: 10,
            }}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: "#013378",
            padding: 15,
            borderRadius: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>
            Add Investment
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddInvestment;
