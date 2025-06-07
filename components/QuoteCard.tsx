import { Colors } from "@/constants/Colors"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import React, { useEffect, useRef } from "react"
import { Animated, StyleSheet, Text, View, useColorScheme } from "react-native"
// import { Quote } from 'lucide-react-native';

interface QuoteCardProps {
  quote: string
}

export function QuoteCard({ quote }: QuoteCardProps) {
  const colorScheme = useColorScheme() || "light"
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()

    return () => {
      fadeAnim.setValue(0)
    }
  }, [quote])

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: Colors.card[colorScheme],
          borderColor: Colors.border[colorScheme],
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons
          name="note"
          color={Colors.primary[colorScheme]}
          style={styles.icon}
          size={24}
        />
      </View>
      <Text
        style={[
          styles.quoteText,
          {
            color:
              colorScheme === "dark" ? Colors.text.dark : Colors.text.light,
          },
        ]}
      >
        {quote}
      </Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    opacity: 0.9,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    fontStyle: "italic",
  },
})
