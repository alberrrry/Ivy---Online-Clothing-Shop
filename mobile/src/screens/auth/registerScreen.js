import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/common/button';
import Input from '../../components/common/input';
import { authAPI } from '../../services/api';
import theme from '../../theme';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
  console.log('🔵 REGISTER CLICKED');
  console.log('📧 Form data:', formData);
  
  if (!validateForm()) {
    console.log('❌ Validation failed');
    return;
  }
  
  console.log('✅ Validation passed, sending to API...');
  setLoading(true);
  
  try {
    console.log('🚀 Making API call to:', 'http://localhost:3000/api/auth/register');
    
    const response = await authAPI.register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      role: 'customer',
    });
    
    console.log('✅ API Response:', response.data);
    
    const { token, user } = response.data;
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      Alert.alert('Success', 'Account created successfully!');
      window.location.reload();
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error.response?.data?.error || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us today</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="First Name"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChangeText={(value) => updateFormData('firstName', value)}
            error={errors.firstName}
            autoCapitalize="words"
          />

          <Input
            label="Last Name"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChangeText={(value) => updateFormData('lastName', value)}
            autoCapitalize="words"
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            label="Phone (Optional)"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value)}
            keyboardType="phone-pad"
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            error={errors.password}
            secureTextEntry
            autoComplete="password-new"
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            error={errors.confirmPassword}
            secureTextEntry
            autoComplete="password-new"
          />

          <Button
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          >
            Create Account
          </Button>

          <Button
            variant="outline"
            onPress={() => navigation.goBack()}
          >
            Already have an account? Sign In
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
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
    width: '100%',
  },
  registerButton: {
    marginBottom: theme.spacing.md,
  },
});

export default RegisterScreen;