import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../../components/common/button";
import theme from "../../theme";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Load user error:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.removeItem("user");
          // Reload app
          if (typeof window !== "undefined") {
            navigation.replace("Login");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {user && (
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>
              {user.firstName} {user.lastName}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>

          {user.phone && (
            <View style={styles.infoCard}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{user.phone}</Text>
            </View>
          )}

          <Button
            variant="outline"
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  content: {
    padding: theme.spacing.lg,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.medium,
  },
  logoutButton: {
    marginTop: theme.spacing.xl,
  },
});

export default ProfileScreen;
