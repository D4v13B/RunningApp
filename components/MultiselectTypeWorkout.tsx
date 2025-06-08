import { Colors } from "@/constants/Colors"
import { WorkoutGoalsType } from "@/services/DatabaseService"
import * as Haptics from "expo-haptics"
import React from "react"
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native"

interface Props {
  workoutTypes: WorkoutGoalsType[]
  setSelectedType: (type: WorkoutGoalsType) => void
  selectedType: WorkoutGoalsType
}

const MultiselectTypeWorkout = ({
  workoutTypes,
  setSelectedType,
  selectedType,
}: Props) => {
  const colorScheme = useColorScheme() || "light"
  const isDark = colorScheme === "dark"

  const selectWorkoutType = (type: WorkoutGoalsType) => {
    setSelectedType(type)
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  return (
    <>
      <Text style={[styles.typeLabel, { color: Colors.text[colorScheme] }]}>
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
      </View>
    </>
  )
}

const styles = StyleSheet.create({
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
   typeLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
})

export default MultiselectTypeWorkout
