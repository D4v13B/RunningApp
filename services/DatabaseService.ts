import * as SQLite from 'expo-sqlite';

export type WorkoutGoalsType = "Run" | "Jog" | "Sprint" | "Trail" | "Interval" | "Race";

export interface Workout {
  id?: number;
  date: string;
  distance: number;
  time: number;
  type: WorkoutGoalsType;
  pace?: number;
}

export interface Goal {
  id?: number;
  description: string;
  target: number;
  currentProgress: number;
  type?: WorkoutGoalsType;
  deadline: string;
}

export class DatabaseService {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync('runningApp.db');
    this.initDatabase();
  }

  private initDatabase() {
    // Crear tabla de workouts
    this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        distance REAL NOT NULL,
        time INTEGER NOT NULL,
        type TEXT NOT NULL,
        pace REAL
      );
    `);

    // Crear tabla de goals
    this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        target REAL NOT NULL,
        currentProgress REAL DEFAULT 0,
        type TEXT,
        deadline TEXT NOT NULL,
        isActive INTEGER DEFAULT 1
      );
    `);
  }

  // Agregar un nuevo workout
  addWorkout(workout: Omit<Workout, 'id'>): number {
    try {
      const result = this.db.runSync(
        `INSERT INTO workouts (date, distance, time, type, pace) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          workout.date,
          workout.distance,
          workout.time,
          workout.type,
          workout.pace || null
        ]
      );

      this.updateGoalsType(workout.type, workout.distance);

      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error adding workout:', error);
      throw error;
    }
  }

  // Obtener historial de workouts
  getWorkouts(): Workout[] {
    try {
      const result = this.db.getAllSync(
        `SELECT *
         FROM workouts 
         ORDER BY date DESC`
      ) as Workout[];
      
      return result;
    } catch (error) {
      console.error('Error getting workouts:', error);
      throw error;
    }
  }

  // Calcular distancia total del historial
  getTotalDistance(): number {
    try {
      const result = this.db.getFirstSync(
        `SELECT COALESCE(SUM(distance), 0) as totalDistance FROM workouts`
      ) as { totalDistance: number };
      
      return result.totalDistance;
    } catch (error) {
      console.error('Error getting total distance:', error);
      throw error;
    }
  }

  // Agregar una nueva meta
  addGoal(goal: Omit<Goal, 'id'>): number {
    try {
      const result = this.db.runSync(
        `INSERT INTO goals (description, target, currentProgress, type, deadline, isActive) 
         VALUES (?, ?, ?, ?, ?, 1)`,
        [
          goal.description,
          goal.target,
          goal.currentProgress,
          goal.type || null,
          goal.deadline
        ]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  }

  // Actualizar progreso de una meta específica
  updateGoalsProgress(goalId: number, progressToAdd: number): boolean {
    try {
      const result = this.db.runSync(
        `UPDATE goals 
         SET currentProgress = currentProgress + ? 
         WHERE id = ?`,
        [progressToAdd, goalId]
      );
      
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  }

  updateGoalsType(type: string, progressToAdd: number): boolean {
    try {
      const result = this.db.runSync(
        `UPDATE goals 
         SET currentProgress = currentProgress + ? 
         WHERE type = ? AND deadline >= date('now')`,
        [progressToAdd, type]
      );
      
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  }

  // Obtener todas las metas
  getGoals(): Goal[] {
    try {
      const result = this.db.getAllSync(
        `SELECT id, description, target, currentProgress, type, deadline 
         FROM goals 
         ORDER BY deadline ASC`
      ) as Goal[];
      
      return result;
    } catch (error) {
      console.error('Error getting goals:', error);
      throw error;
    }
  }

  // Obtener meta activa (asumiendo que solo hay una activa a la vez)
  getActiveGoal(): Goal | null {
    try {
      const result = this.db.getFirstSync(
        `SELECT id, description, target, currentProgress, type, deadline 
         FROM goals 
         WHERE isActive = 1 
         ORDER BY deadline ASC 
         LIMIT 1`
      ) as Goal | null;
      
      return result;
    } catch (error) {
      console.error('Error getting active goal:', error);
      throw error;
    }
  }

  // Funciones auxiliares adicionales que pueden ser útiles

  // Marcar una meta como completada/inactiva
  markGoalAsCompleted(goalId: number): boolean {
    try {
      const result = this.db.runSync(
        `UPDATE goals SET isActive = 0 WHERE id = ?`,
        [goalId]
      );
      return result.changes > 0;
    } catch (error) {
      console.error('Error marking goal as completed:', error);
      throw error;
    }
  }

  // Obtener workouts por tipo
  getWorkoutsByType(type: WorkoutGoalsType): Workout[] {
    try {
      const result = this.db.getAllSync(
        `SELECT id, date, distance, time, type, pace 
         FROM workouts 
         WHERE type = ? 
         ORDER BY date DESC`,
        [type]
      ) as Workout[];
      
      return result;
    } catch (error) {
      console.error('Error getting workouts by type:', error);
      throw error;
    }
  }

  // Obtener distancia total por tipo de workout
  getTotalDistanceByType(type: WorkoutGoalsType): number {
    try {
      const result = this.db.getFirstSync(
        `SELECT COALESCE(SUM(distance), 0) as totalDistance 
         FROM workouts 
         WHERE type = ?`,
        [type]
      ) as { totalDistance: number };
      
      return result.totalDistance;
    } catch (error) {
      console.error('Error getting total distance by type:', error);
      throw error;
    }
  }

  // Obtener estadísticas del mes actual
  getCurrentMonthStats(): {
    totalDistance: number;
    totalWorkouts: number;
    averagePace: number;
  } {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      
      const result = this.db.getFirstSync(
        `SELECT 
           COALESCE(SUM(distance), 0) as totalDistance,
           COUNT(*) as totalWorkouts,
           COALESCE(AVG(pace), 0) as averagePace
         FROM workouts 
         WHERE date LIKE ?`,
        [`${currentMonth}%`]
      ) as {
        totalDistance: number;
        totalWorkouts: number;
        averagePace: number;
      };
      
      return result;
    } catch (error) {
      console.error('Error getting current month stats:', error);
      throw error;
    }
  }
}
