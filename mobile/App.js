import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./src/screens/auth/loginScreen";
import RegisterScreen from "./src/screens/auth/registerScreen";
import HomeScreen from "./src/screens/customer/homeScreen";
import CreateListingScreen from "./src/screens/seller/createListingScreen";
import ProfileScreen from "./src/screens/customer/profileScreen";
import ProductDetailScreen from "./src/screens/customer/productDetailScreen";

import theme from "./src/theme";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tab.Screen
        name="Browse"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Sell"
        component={CreateListingScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: theme.colors.primary,
                justifyContent: "center",
                alignItems: "center",
                marginTop: -20,
              }}
            >
              <Text style={{ fontSize: 28, color: theme.colors.text.inverse }}>
                +
              </Text>
            </View>
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      setIsAuthenticated(token ? true : false);
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated === true ? (
          <>
            <Stack.Screen name="MainApp" component={MainTabs} />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
            />
          </>
        ) : (
          <>
            {/* Use children prop or screenProps to pass the state setter */}
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen
                  {...props}
                  setIsAuthenticated={setIsAuthenticated}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {(props) => (
                <RegisterScreen
                  {...props}
                  setIsAuthenticated={setIsAuthenticated}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
