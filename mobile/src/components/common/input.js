import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../../theme';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputFocused,
        error && styles.inputError,
      ]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.tertiary}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Text style={styles.eyeText}>
              {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    ...theme.shadows.sm,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.md,
  },
  eyeIcon: {
    padding: theme.spacing.xs,
  },
  eyeText: {
    fontSize: 18,
  },
  errorText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});

export default Input;