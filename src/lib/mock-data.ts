import type { Grade } from './types';

export const mockGrades: Grade[] = [
  { id: '1', subject: 'Mathematics', assignment: 'Algebra Test', date: '2023-05-15', grade: 'A-' },
  { id: '2', subject: 'History', assignment: 'WWII Essay', date: '2023-05-10', grade: 'B+' },
  { id: '3', subject: 'Science', assignment: 'Lab Report: Photosynthesis', date: '2023-05-20', grade: 'A' },
  { id: '4', subject: 'English', assignment: 'Shakespeare Analysis', date: '2023-04-28', grade: 'A+' },
  { id: '5', subject: 'Mathematics', assignment: 'Geometry Homework', date: '2023-04-25', grade: 'B' },
  { id: '6', subject: 'History', assignment: 'Civil Rights Presentation', date: '2023-06-01', grade: 'A' },
  { id: '7', subject: 'Science', assignment: 'Physics Quiz', date: '2023-03-15', grade: 'B-' },
  { id: '8', subject: 'English', assignment: 'Poetry Submission', date: '2023-05-05', grade: 'A-' },
  { id: '9', subject: 'Art', assignment: 'Still Life Painting', date: '2023-05-22', grade: 'A' },
  { id: '10', subject: 'Mathematics', assignment: 'Calculus Midterm', date: '2023-06-05', grade: 'B+' },
  { id: '11', subject: 'Physical Education', assignment: 'Fitness Test', date: '2023-04-10', grade: 'Pass' },
];

// Simulate fetching grades with a delay
export const fetchGrades = async (): Promise<Grade[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sort data: by subject (asc), then by date (desc)
      const sortedGrades = [...mockGrades].sort((a, b) => {
        if (a.subject < b.subject) return -1;
        if (a.subject > b.subject) return 1;
        // If subjects are the same, sort by date descending (most recent first)
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
      });
      resolve(sortedGrades);
    }, 500); // Simulate network delay
  });
};
