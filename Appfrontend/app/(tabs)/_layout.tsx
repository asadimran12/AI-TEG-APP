import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Animated, Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#02C2CA", 
        tabBarInactiveTintColor: "#7A7A7A",
        tabBarStyle: {
          backgroundColor: "#F6FFFF",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 12,
          paddingTop: 12,
          elevation: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.10,
          shadowRadius: 14,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          position: "absolute",
        }
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size + 1} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="investment"
        options={{
          title: "Investment",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up-outline" size={size + 1} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="assets"
        options={{
          title: "Assets",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size + 1} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="expense"
        options={{
          title: "Expense",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size + 1} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size + 1} color={color} />
          )
        }}
      />

    </Tabs>
  );
}
