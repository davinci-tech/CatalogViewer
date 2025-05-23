import { State } from './state';
import { GradeAPI } from './api-grades';
import { SubjectAPI } from './api-subjects';
import { AbsentAPI } from './api-absents';

const LOCAL_STORAGE_KEY = 'catalog_state';

export class StateManager {
  static async getState(): Promise<State> {
    try {
      const [grades, subjects, absents] = await Promise.all([
        GradeAPI.fetchGrades(),
        SubjectAPI.fetchSubjects(),
        AbsentAPI.fetchAbsents(),
      ]);
      const state = new State(grades, subjects, absents);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      }
      return state;
    } catch (error) {
      // Fallback to localStorage
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          return new State(parsed.grades, parsed.subjects, parsed.absents);
        }
      }
      return new State([], [], []);
    }
  }
}
