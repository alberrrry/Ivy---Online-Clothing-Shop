import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import theme from '../../theme';

const Button = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          minHeight: 36,
        };
      case 'medium':
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          minHeight: 48,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.lg,
          paddingHorizontal: theme.spacing.xl,
          minHeight: 56,
        };
      default:
        return {};
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.text.tertiary;
    if (variant === 'primary') return theme.colors.text.inverse;
    return theme.colors.text.primary;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;