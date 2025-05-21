export interface Grade {
  id: string;
  subject: string;
  assignment: string;
  date: string; // ISO date string for sortability e.g. "2023-10-26"
  grade: string; // e.g., "A+", "92%", "Satisfactory"
}
