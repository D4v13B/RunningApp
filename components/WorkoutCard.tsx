import { Colors } from "@/constants/Colors"
import { Workout } from "@/services/DatabaseService"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import React from "react"
import { StyleSheet, Text, View, useColorScheme } from "react-native"

interface WorkoutCardProps {
  workout: Workout
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const colorScheme = useColorScheme() || "light"
  const isDark = colorScheme === "dark"

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  // Format time (minutes to hh:mm)
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours > 0 ? `${hours}h ` : ""}${mins}m`
  }

  // Format pace (min/km)
  const formatPace = (pace?: number) => {
    if (!pace) return "N/A"

    const minutes = Math.floor(pace)
    const seconds = Math.round((pace - minutes) * 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")} min/km`
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: Colors.card[colorScheme],
          borderColor: Colors.border[colorScheme],
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.typeBadge}>
          <Text style={[styles.typeText, { color: "#000000" }]}>
            {workout.type}
          </Text>
        </View>
        <Text
          style={[
            styles.date,
            { color: isDark ? Colors.text.darkDark : Colors.text.darkLight },
          ]}
        >
          <MaterialIcons
            name="calendar-today"
            size={14}
            color={isDark ? Colors.text.darkDark : Colors.text.darkLight}
          />{" "}
          {formatDate(workout.date)}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <MaterialIcons
            name="route"
            size={18}
            color={Colors.primary[colorScheme]}
            style={styles.statIcon}
          />
          <MaterialIcons m />
          <Text style={[styles.statValue, { color: Colors.text[colorScheme] }]}>
            {workout.distance} km
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: isDark ? Colors.text.darkDark : Colors.text.darkLight },
            ]}
          >
            Distancia
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <MaterialIcons
            name="punch-clock"
            size={18}
            color={Colors.primary[colorScheme]}
            style={styles.statIcon}
          />
          <Text style={[styles.statValue, { color: Colors.text[colorScheme] }]}>
            {formatTime(workout.time)}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: isDark ? Colors.text.darkDark : Colors.text.darkLight },
            ]}
          >
            Duracion
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.text[colorScheme] }]}>
            {formatPace(workout.pace)}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: isDark ? Colors.text.darkDark : Colors.text.darkLight },
            ]}
          >
            Paso
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  typeBadge: {
    backgroundColor: "#00FF66",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
    fontWeight: "500",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIcon: {
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E5EA",
    opacity: 0.6,
  },
})
