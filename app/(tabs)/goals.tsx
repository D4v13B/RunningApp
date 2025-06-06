import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Colors } from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { CircularProgress } from '@/components/CircularProgress';
import { Goal } from '@/services/DatabaseService';
import * as Haptics from 'expo-haptics';

export default function GoalsScreen() {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';
  
  const [goals, setGoals] = useState<Goal[]>([]);
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load goals
  const loadGoals = async () => {
    try {
      setRefreshing(true);
      // const data = await DB.getGoals();
      // setGoals(data);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Load on mount
  useEffect(() => {
    loadGoals();
  }, []);

  // Validar formulario
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!target) {
      newErrors.target = 'Target is required';
    } else if (isNaN(Number(target)) || Number(target) <= 0) {
      newErrors.target = 'Please enter a valid target distance';
    }
    
    if (!deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      // Validar date format (YYYY-MM-DD)
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(deadline)) {
        newErrors.deadline = 'Please enter a valid date (YYYY-MM-DD)';
      } else {
        const date = new Date(deadline);
        if (isNaN(date.getTime())) {
          newErrors.deadline = 'Please enter a valid date';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save goal
  const saveGoal = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      const newGoal: Goal = {
        description: description.trim(),
        target: Number(target),
        currentProgress: 0,
        deadline,
      };
      
      // await DB.addGoal(newGoal);
      
      // Haptics para dar feedback de que se guardo
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Reiniciar form
      setDescription('');
      setTarget('');
      
      // Recargar metas
      await loadGoals();
      
      // Mostrar objetivo
      setSuccessMessage('Objetivo agregado correctamente!');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors.background[colorScheme] },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadGoals}
              tintColor={Colors.primary[colorScheme]}
            />
          }
        >
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: Colors.text[colorScheme] },
              ]}
            >
              Tus Metas!
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? Colors.text.darkDark : Colors.text.darkLight },
              ]}
            >
              Ingresa objetivos para mantenerte motivado
            </Text>
          </View>

          <Card style={styles.formCard}>
            <Text
              style={[
                styles.formTitle,
                { color: Colors.text[colorScheme] },
              ]}
            >
              Crear nuevo objetivo
            </Text>
            
            <Input
              label="Descripcion de la meta"
              value={description}
              onChangeText={setDescription}
              placeholder="e.j., Correr 50 km este mes"
              error={errors.description}
            />
            
            <Input
              label="Objetivo (km)"
              value={target}
              onChangeText={setTarget}
              placeholder="Introducir la distancia objetivo"
              keyboardType="numeric"
              error={errors.target}
            />
            
            <Input
              label="Fecha final (YYYY-MM-DD)"
              value={deadline}
              onChangeText={setDeadline}
              placeholder="Ingresar la fecha final"
              error={errors.deadline}
            />
            
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
                title="Guardar meta"
                onPress={saveGoal}
                loading={isLoading}
                style={styles.saveButton}
              />
            )}
          </Card>

          <View style={styles.goalsSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: Colors.text[colorScheme] },
              ]}
            >
              Metas Actuales
            </Text>
            
            {goals.length === 0 ? (
              <Text
                style={[
                  styles.emptyText,
                  { color: isDark ? Colors.text.darkDark : Colors.text.darkLight },
                ]}
              >
                No hay metas aun. Ingresa uno nuevo y corre!
              </Text>
            ) : (
              goals.map((goal) => (
                <Card key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalHeader}>
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
                        styles.goalDeadline,
                        { color: isDark ? Colors.text.darkDark : Colors.text.darkLight },
                      ]}
                    >
                      Hasta: {formatDate(goal.deadline)}
                    </Text>
                  </View>
                  
                  <View style={styles.goalProgressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            backgroundColor: Colors.primary[colorScheme],
                            width: `${Math.min(
                              (goal.currentProgress / goal.target) * 100,
                              100
                            )}%`,
                          },
                        ]}
                      />
                      <View
                        style={[
                          styles.progressBackground,
                          { backgroundColor: Colors.progress.background[colorScheme] },
                        ]}
                      />
                    </View>
                    
                    <Text
                      style={[
                        styles.progressText,
                        { color: isDark ? Colors.text.darkDark : Colors.text.darkLight },
                      ]}
                    >
                      {goal.currentProgress.toFixed(1)} / {goal.target} km
                    </Text>
                  </View>
                </Card>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  formCard: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
  },
  goalsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  goalCard: {
    marginBottom: 12,
  },
  goalHeader: {
    marginBottom: 12,
  },
  goalDescription: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  goalDeadline: {
    fontSize: 14,
  },
  goalProgressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  progressBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 2,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'right',
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  successMessage: {
    fontSize: 16,
    fontWeight: '500',
  },
});