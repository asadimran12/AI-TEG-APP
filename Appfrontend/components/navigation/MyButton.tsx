import React from "react";
import { Text, TouchableOpacity } from "react-native";

const MyButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={{
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: "orange",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 18 }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default MyButton;
