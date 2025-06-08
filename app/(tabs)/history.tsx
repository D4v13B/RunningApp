import { Colors } from "@/constants/Colors"
import React, { useEffect, useState } from "react"
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
// import { WorkoutCard } from '@/components/WorkoutCard';
import { WorkoutCard } from "@/components/WorkoutCard"
import { DB, Workout } from "@/services/DatabaseService"

export default function HistoryScreen() {
  const colorScheme = useColorScheme() || "light"
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [totalWorkouts, setTotalWorkouts] = useState(0)
  const [totalDistance, setTotalDistance] = useState(0)

  // Load workouts
  const loadWorkouts = async () => {
    try {
      setRefreshing(true)
      const data = await DB.getWorkouts()
      // const data: Workout[] = [
      //   {
      //     id: 1,
      //     pace: 2,
      //     time: 140,
      //     type: "Run",
      //     date: "2025-12-25",
      //     distance: 10,
      //   },
      //   {
      //     id: 2,
      //     pace: 2,
      //     time: 140,
      //     type: "Run",
      //     date: "2025-12-25",
      //     distance: 10,
      //   },
      // ]
      setWorkouts(data)

      setTotalWorkouts(data.length)
      const distance = data.reduce((sum, workout) => sum + workout.distance, 0)
      setTotalDistance(distance)
    } catch (error) {
      console.error("Error loading workouts:", error)
    } finally {
      setRefreshing(false)
    }
  }

  // Load on mount
  useEffect(() => {
    loadWorkouts()
  }, [])

  // ListComponent cuando esta vacio
  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text
        style={[
          styles.emptyText,
          {
            color:
              colorScheme === "dark"
                ? Colors.text.darkDark
                : Colors.text.darkLight,
          },
        ]}
      >
        No se han encontrado entrenamientos. Empieza a guardar tus carreras para
        verlas aqui
      </Text>
    </View>
  )

  // List header component
  const ListHeader = () => (
    <View style={styles.headerStats}>
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: Colors.text[colorScheme] }]}>
          {totalWorkouts}
        </Text>
        <Text
          style={[
            styles.statLabel,
            {
              color:
                colorScheme === "dark"
                  ? Colors.text.darkDark
                  : Colors.text.darkLight,
            },
          ]}
        >
          Entrenamientos
        </Text>
      </View>

      <View style={styles.statDivider} />

      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: Colors.text[colorScheme] }]}>
          {totalDistance.toFixed(1)} km
        </Text>
        <Text
          style={[
            styles.statLabel,
            {
              color:
                colorScheme === "dark"
                  ? Colors.text.darkDark
                  : Colors.text.darkLight,
            },
          ]}
        >
          Distancia total
        </Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors.background[colorScheme] },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors.text[colorScheme] }]}>
          Historial de carreras
        </Text>
      </View>

      <FlatList
        data={workouts}
        renderItem={({ item }) => <WorkoutCard workout={item} />}
        keyExtractor={(item) =>
          item.id?.toString() || `${item.date}-${item.type}`
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadWorkouts}
            tintColor={Colors.primary[colorScheme]}
          />
        }
        ListEmptyComponent={EmptyList}
        ListHeaderComponent={ListHeader}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  headerStats: {
    flexDirection: "row",
    marginBottom: 16,
    paddingVertical: 16,
    justifyContent: "space-evenly",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E5EA",
    opacity: 0.6,
  },
})
