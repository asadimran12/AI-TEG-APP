import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

export default function FeeCard({ item, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.name}>{item.student}</Text>
      <Text style={styles.month}>{item.month}</Text>
      <Text style={styles.amount}>Amount: Rs {item.amount}</Text>
      <Text
        style={[
          styles.status,
          { color: item.status === "Paid" ? "green" : "red" }
        ]}
      >
        {item.status}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f1f1f1",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d4d4d4"
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000"
  },
  month: {
    color: "#555",
    marginVertical: 2
  },
  amount: {
    color: "#333"
  },
  status: {
    fontWeight: "600",
    marginTop: 5
  }
});
