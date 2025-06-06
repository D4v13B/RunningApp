import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  useColorScheme,
  ViewStyle
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';

  // Handle button press with optional haptic feedback
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  // Get button styles based on variant, size, and disabled state
  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...sizeStyles[size],
      opacity: disabled ? 0.6 : 1,
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: Colors.primary[colorScheme],
      },
      secondary: {
        backgroundColor: isDark ? '#2A2A2A' : '#E5E5EA',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.primary[colorScheme],
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  // Get text styles based on variant
  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.text,
      ...textSizeStyles[size],
    };

    const variantTextStyles: Record<string, TextStyle> = {
      primary: {
        color: isDark ? '#000000' : '#000000',
      },
      secondary: {
        color: isDark ? Colors.text.dark : Colors.text.light,
      },
      outline: {
        color: Colors.primary[colorScheme],
      },
    };

    return {
      ...baseStyle,
      ...variantTextStyles[variant],
    };
  };

  const buttonStyles = getButtonStyles();
  const buttonTextStyles = getTextStyles();

  return (
    <TouchableOpacity
      style={[buttonStyles, style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? '#000000' : Colors.primary[colorScheme]} 
          size="small" 
        />
      ) : (
        <Text style={[buttonTextStyles, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

// Button size styles
const sizeStyles: Record<string, ViewStyle> = {
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
};

// Text size styles
const textSizeStyles: Record<string, TextStyle> = {
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 16,
  },
  large: {
    fontSize: 18,
  },
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});