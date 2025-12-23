
export interface Trait {
  id: string;
  text: string;
  x: number; // Horizontal position (%)
  delay: number; // Animation delay (s)
  duration: number; // Animation duration (s)
}

export interface RelationshipDuration {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}
