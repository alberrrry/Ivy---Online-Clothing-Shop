import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../../components/common/button";
import Input from "../../components/common/input";
import { authAPI } from "../../services/api";
import theme from "../../theme";

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Helper to update state and clear errors for that field simultaneously
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (formData.password.length < 6) newErrors.password = "Min 6 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 1. Call your API
      const response = await authAPI.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: "customer",
      });

      // 2. Destructure token and user from your API response structure
      const { token, user } = response.data;

      // 3. Persist session data
      await AsyncStorage.multiSet([
        ["authToken", token],
        ["user", JSON.stringify(user)],
      ]);

      Alert.alert("Success", "Account created!");

      // 4. Navigate to Home and reset the stack so they can't go back to Register
      // Replace navigation.reset with this:
      navigation.navigate("Home");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Registration failed. Try again.";
      Alert.alert("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Fill in your details below</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="First Name"
            value={formData.firstName}
            onChangeText={(val) => updateField("firstName", val)}
            error={errors.firstName}
            autoCapitalize="words"
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(val) => updateField("email", val)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={(val) => updateField("password", val)}
            error={errors.password}
            secureTextEntry
          />

          <Input
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(val) => updateField("confirmPassword", val)}
            error={errors.confirmPassword}
            secureTextEntry
          />

          <Button
            onPress={handleRegister}
            loading={loading}
            style={styles.mainButton}
          >
            Sign Up
          </Button>

          <Button
            variant="outline"
            onPress={() => navigation.navigate("Login")}
          >
            Already have an account? Login
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingTop: Platform.OS === "ios" ? 80 : 40,
    flexGrow: 1,
  },
  header: { marginBottom: 30, alignItems: "center" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text.primary,
  },
  subtitle: { color: theme.colors.text.secondary, marginTop: 5 },
  form: { width: "100%" },
  mainButton: { marginVertical: 20 },
});

export default RegisterScreen;
