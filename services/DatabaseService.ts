export interface Workout {
  id?: number;
  date: string;
  distance: number;
  time: number;
  type: string;
  pace?: number;
}

export interface Goal {
  id?: number;
  description: string;
  target: number; // Target in kilometers
  currentProgress: number;
  deadline: string; // ISO date string
}