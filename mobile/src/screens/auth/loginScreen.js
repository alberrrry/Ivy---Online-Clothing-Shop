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

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      Alert.alert("Success", "Logged in successfully!");
      navigation.replace("Home");
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.error || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType={Platform.OS === "ios" ? "emailAddress" : undefined}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            textContentType={Platform.OS === "ios" ? "password" : undefined}
          />
          <Button
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            onPress={() => navigation.navigate("Register")}
          >
            Create Account
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: "center",
  },
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    letterSpacing: 0.3,
  },
  form: {
    width: "100%",
  },
  loginButton: {
    marginBottom: theme.spacing.lg,
  },
});

export default LoginScreen;
