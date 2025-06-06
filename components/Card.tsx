import { Colors } from '@/constants/Colors';
import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, useColorScheme } from 'react-native';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  shadow?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({ children, style, shadow = 'medium' }: CardProps) {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';

  // Shadow styles based on intensity
  const shadowStyles: Record<string, ViewStyle> = {
    none: {},
    small: isDark
      ? { shadowOpacity: 0.2, shadowRadius: 3, elevation: 2 }
      : { shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
    medium: isDark
      ? { shadowOpacity: 0.25, shadowRadius: 5, elevation: 4 }
      : { shadowOpacity: 0.15, shadowRadius: 5, elevation: 4 },
    large: isDark
      ? { shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }
      : { shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 },
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: Colors.card[colorScheme],
          borderColor: Colors.border[colorScheme],
        },
        shadowStyles[shadow],
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
});