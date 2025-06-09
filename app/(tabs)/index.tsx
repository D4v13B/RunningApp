import { Card } from "@/components/Card"
import { CircularProgress } from "@/components/CircularProgress"
import { Dialog } from "@/components/Dialog"
import { QuoteCard } from "@/components/QuoteCard"
import { Colors } from "@/constants/Colors"
import { DB } from "@/services/DatabaseService"
// import { getRandomQuote } from '@/constants/Quotes';
// import { DatabaseService } from '@/services/DatabaseService';
import { Storage } from "@/services/StorageService"
import { getRandomQuote } from "@/utils/getRandomQuote"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import React, { useEffect, useState } from "react"
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function HomeScreen() {
  const colorScheme = useColorScheme() || "light"
  const isDark = colorScheme === "dark"

  const [userName, setUserName] = useState("")
  const [totalDistance, setTotalDistance] = useState(0)
  const [goal, setGoal] = useState<{
    description: string
    target: number
    currentProgress: number
  } | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [quoteDialogVisible, setQuoteDialogVisible] = useState(false)
  const [currentQuote, setCurrentQuote] = useState("")

  const clearTables = () => {
    DB.truncateTables()
  }

  // Load user data
  const loadUserData = async () => {
    try {
      setRefreshing(true)

      // Get user profile
      const userProfile = await Storage.getUserProfile()
      if (userProfile) {
        setUserName(userProfile.name)
      }

      const distance = await DB.getTotalDistance()
      setTotalDistance(distance)
      // setTotalDistance(10)

      const activeGoal = await DB.getActiveGoal()
      if (activeGoal) {
        setGoal({
          description: activeGoal.description,
          target: activeGoal.target,
          currentProgress: activeGoal.currentProgress,
        })
      }
      // setGoal({
      //   description: "Comer Sano",
      //   target: 34,
      //   currentProgress: 100,
      // })
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  // Show quote dialog
  const showQuoteDialog = () => {
    const quote = getRandomQuote()
    setCurrentQuote(quote)
    // setCurrentQuote("Tu puedes papito")
    setQuoteDialogVisible(true)
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors.background[colorScheme] },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadUserData} />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: Colors.text[colorScheme] }]}>
            Hola, {userName}! 👋
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: isDark ? Colors.text.darkDark : Colors.text.darkLight },
            ]}
          >
            Listo para tu siguiente arrancon?
          </Text>
        </View>

        {goal && (
          <Card style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text
                style={[styles.goalTitle, { color: Colors.text[colorScheme] }]}
              >
                Progreso del objetivo mensual
              </Text>
              {/* <Lightning color={Colors.primary[colorScheme]} size={20} /> */}
              <MaterialIcons
                name="light"
                color={Colors.primary[colorScheme]}
                size={20}
              />
              <TouchableOpacity onPress={clearTables}>
                <MaterialIcons name="track-changes" />
              </TouchableOpacity>
            </View>

            <View style={styles.goalContent}>
              <View style={styles.progressContainer}>
                <CircularProgress
                  size={100}
                  strokeWidth={10}
                  progress={goal.currentProgress / goal.target}
                />
              </View>

              <View style={styles.goalDetails}>
                <Text
                  style={[
                    styles.goalDescription,
                    { color: Colors.text[colorScheme] },
                  ]}
                >
                  {goal.description}
                </Text>
                <Text
                  style={[
                    styles.goalProgress,
                    {
                      color: isDark
                        ? Colors.text.darkDark
                        : Colors.text.darkLight,
                    },
                  ]}
                >
                  {goal.currentProgress.toFixed(1)} km of {goal.target} km
                </Text>
              </View>
            </View>
          </Card>
        )}

        <Card style={styles.statsCard}>
          <Text
            style={[styles.statsTitle, { color: Colors.text[colorScheme] }]}
          >
            Tus estadisticas
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text
                style={[styles.statValue, { color: Colors.text[colorScheme] }]}
              >
                {totalDistance.toFixed(1)} km
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  {
                    color: isDark
                      ? Colors.text.darkDark
                      : Colors.text.darkLight,
                  },
                ]}
              >
                Total Distance
              </Text>
            </View>

            <View style={styles.stat}>
              <Text
                style={[styles.statValue, { color: Colors.text[colorScheme] }]}
              >
                {goal
                  ? ((goal.currentProgress / goal.target) * 100).toFixed(0)
                  : "0"}
                %
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  {
                    color: isDark
                      ? Colors.text.darkDark
                      : Colors.text.darkLight,
                  },
                ]}
              >
                Progreso de Objetivo
              </Text>
            </View>
          </View>
        </Card>

        <TouchableOpacity
          style={styles.quoteButton}
          onPress={showQuoteDialog}
          activeOpacity={0.8}
        >
          <Card style={styles.quoteButtonCard}>
            <View style={styles.quoteButtonContent}>
              {/* <MessageSquareQuote
                size={24}
                color={Colors.primary[colorScheme]}
              /> */}
              <MaterialIcons
                name="message"
                color={Colors.primary[colorScheme]}
                size={24}
              />
              <Text
                style={[
                  styles.quoteButtonText,
                  { color: Colors.text[colorScheme] },
                ]}
              >
                Dame animos para seguir
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
      </ScrollView>

      <Dialog
        visible={quoteDialogVisible}
        title="Dale duro papito"
        onClose={() => setQuoteDialogVisible(false)}
      >
        <QuoteCard quote={currentQuote} />
      </Dialog>
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
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  goalCard: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  goalContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressContainer: {
    marginRight: 16,
  },
  goalDetails: {
    flex: 1,
  },
  goalDescription: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  goalProgress: {
    fontSize: 14,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  quoteButton: {
    marginBottom: 16,
  },
  quoteButtonCard: {
    padding: 0,
  },
  quoteButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  quoteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
})
