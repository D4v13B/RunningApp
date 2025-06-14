import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Input } from "@/components/Input"
import MultiselectTypeWorkout from "@/components/MultiselectTypeWorkout"
import { Colors } from "@/constants/Colors"
import {
  DB,
  Workout,
  WorkoutGoalsType
} from "@/services/DatabaseService"
import * as Haptics from "expo-haptics"
import React, { useState } from "react"
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export const workoutTypes: WorkoutGoalsType[] = [
  "Run",
  "Jog",
  "Sprint",
  "Trail",
  "Interval",
  "Race",
]

export default function LogScreen() {
  const colorScheme = useColorScheme() || "light"
  const isDark = colorScheme === "dark"

  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [distance, setDistance] = useState("")
  const [time, setTime] = useState("")
  const [selectedType, setSelectedType] = useState<WorkoutGoalsType>("Run")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!date) {
      newErrors.date = "La fecha es requerida"
    }

    if (!distance) {
      newErrors.distance = "Distancia requerida"
    } else if (isNaN(Number(distance)) || Number(distance) <= 0) {
      newErrors.distance = "Por favor, introduce una fecha valida"
    }

    if (!time) {
      newErrors.time = "Tiempo es requerido"
    } else if (isNaN(Number(time)) || Number(time) <= 0) {
      newErrors.time = "Por favor inserta un tiempo en minutos requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Save workout
  const saveWorkout = async () => {
    if (!validate()) return

    setIsLoading(true)
    setSuccessMessage("")

    try {
      const workout: Workout = {
        date,
        distance: Number(distance),
        time: Number(time),
        type: selectedType,
        pace: Number(distance) / Number(time)
      }

      await DB.addWorkout(workout)
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      }

      // Reset form
      setDistance("")
      setTime("")
      setDate(new Date().toISOString().split("T")[0])

      //Mostrar mensaje de guardado
      setSuccessMessage("Entrenamiento guardado de manera correcta")

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error("Error al guardar el entrenamiento", error)
      Alert.alert("Error", "Fallo al guardar el entrenamiento")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors.background[colorScheme] },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: Colors.text[colorScheme] }]}>
              Guarda tu recorrido
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: isDark ? Colors.text.darkDark : Colors.text.darkLight,
                },
              ]}
            >
              Checkea tu progreso y mira tus avances
            </Text>
          </View>

          <Card>
            <Text
              style={[styles.sectionTitle, { color: Colors.text[colorScheme] }]}
            >
              Detalles de entrenamiento
            </Text>

            <Input
              label="Date"
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              error={errors.date}
            />

            <Input
              label="Distance (km)"
              value={distance}
              onChangeText={setDistance}
              placeholder="Enter distance in kilometers"
              keyboardType="numeric"
              error={errors.distance}
            />

            <Input
              label="Time (minutes)"
              value={time}
              onChangeText={setTime}
              placeholder="Enter time in minutes"
              keyboardType="numeric"
              error={errors.time}
            />

            {/* <Text
              style={[styles.typeLabel, { color: Colors.text[colorScheme] }]}
            >
              Tipo de Entrenamiento
            </Text>

            <View style={styles.typeContainer}>
              {workoutTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        type === selectedType
                          ? Colors.primary[colorScheme]
                          : isDark
                          ? "#2A2A2A"
                          : "#F2F2F7",
                    },
                  ]}
                  onPress={() => selectWorkoutType(type)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      {
                        color:
                          type === selectedType
                            ? "#000000"
                            : Colors.text[colorScheme],
                      },
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View> */}
            <MultiselectTypeWorkout selectedType={selectedType} setSelectedType={setSelectedType} workoutTypes={workoutTypes}/>

            {successMessage ? (
              <View style={styles.successContainer}>
                <Text
                  style={[
                    styles.successMessage,
                    { color: Colors.success[colorScheme] },
                  ]}
                >
                  {successMessage}
                </Text>
              </View>
            ) : (
              <Button
                title="Guardar entrenamiento"
                onPress={saveWorkout}
                loading={isLoading}
                style={styles.saveButton}
              />
            )}
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  saveButton: {
    marginTop: 8,
  },
  successContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  successMessage: {
    fontSize: 16,
    fontWeight: "500",
  },
})
