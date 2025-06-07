import { Colors } from "@/constants/Colors"
import React from "react"
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  containerStyle?: ViewStyle
}

export function Input({ label, error, containerStyle, ...props }: InputProps) {
  const colorScheme = useColorScheme() || "light"
  const isDark = colorScheme === "dark"

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: isDark ? Colors.text.dark : Colors.text.light },
          ]}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? "#2A2A2A" : "#F2F2F7",
            color: isDark ? Colors.text.dark : Colors.text.light,
            borderColor: error
              ? Colors.error[colorScheme]
              : isDark
              ? "#3A3A3A"
              : "#E5E5EA",
          },
          props.editable === false && {
            backgroundColor: isDark ? "#1A1A1A" : "#E5E5EA",
            color: isDark ? "#8E8E93" : "#8E8E93",
          },
        ]}
        placeholderTextColor={isDark ? "#8E8E93" : "#8E8E93"}
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: Colors.error[colorScheme] }]}>
          {error}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
  },
})
