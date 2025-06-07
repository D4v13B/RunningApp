import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Colors } from "@/constants/Colors"
import { Storage, UserProfile } from "@/services/StorageService"
import { router } from "expo-router"
import React, { useState } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native"

export default function WelcomeScreen() {
  const colorScheme = useColorScheme() || "light"
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Validate inputs
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!age.trim()) {
      newErrors.age = "Age is required"
    } else if (isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120) {
      newErrors.age = "Please enter a valid age"
    }

    if (!height.trim()) {
      newErrors.height = "Height is required"
    } else if (
      isNaN(Number(height)) ||
      Number(height) <= 0 ||
      Number(height) > 250
    ) {
      newErrors.height = "Please enter a valid height in cm"
    }

    if (!weight.trim()) {
      newErrors.weight = "Weight is required"
    } else if (
      isNaN(Number(weight)) ||
      Number(weight) <= 0 ||
      Number(weight) > 300
    ) {
      newErrors.weight = "Please enter a valid weight in kg"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle profile submission
  const handleSubmit = async () => {
    if (!validate()) return

    setIsLoading(true)

    try {
      // Create user profile
      const userProfile: UserProfile = {
        name: name.trim(),
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
      }

      // Guardar el profile
      await Storage.saveUserProfile(userProfile)

      //Marcar para saber que ya iniciamos sesion
      await Storage.setFirstLaunch(false)

      // Navegar a la app
      router.replace("/(tabs)")
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: Colors.background[colorScheme] },
        ]}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: Colors.text[colorScheme] }]}>
              Bienvenido a RunTracker
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color:
                    colorScheme === "dark"
                      ? Colors.text.darkDark
                      : Colors.text.darkLight,
                },
              ]}
            >
              Dejanos saber tu info, para mejorar la experiencia
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Cual es tu nombre?"
              value={name}
              onChangeText={setName}
              placeholder="Escribe tu nombre"
              autoCapitalize="words"
              error={errors.name}
            />

            <Input
              label="Que edad tienes?"
              value={age}
              onChangeText={setAge}
              placeholder="Escribe tu edad"
              keyboardType="numeric"
              error={errors.age}
            />

            <Input
              label="Cual es tu altura? (cm)"
              value={height}
              onChangeText={setHeight}
              placeholder="Escribe tu altura"
              keyboardType="numeric"
              error={errors.height}
            />

            <Input
              label="Cual es tu peso? (kg)"
              value={weight}
              onChangeText={setWeight}
              placeholder="Escribe tu peso"
              keyboardType="numeric"
              error={errors.weight}
            />
          </View>

          <Button
            title="Iniciemos el maraton"
            onPress={handleSubmit}
            loading={isLoading}
            size="large"
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  headerContainer: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    maxWidth: "80%",
  },
  formContainer: {
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
})
