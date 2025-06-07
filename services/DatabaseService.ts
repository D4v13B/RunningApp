export type WorkoutGoalsType =
  | "Run"
  | "Jog"
  | "Sprint"
  | "Trail"
  | "Interval"
  | "Race"

export interface Workout {
  id?: number
  date: string
  distance: number
  time: number
  type: WorkoutGoalsType
  pace?: number
}

export interface Goal {
  id?: number
  description: string
  target: number
  currentProgress: number
  type?: WorkoutGoalsType
  deadline: string
}
