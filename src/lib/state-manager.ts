import { State } from './state';
import { GradeAPI } from './api-grades';
import { SubjectAPI } from './api-subjects';
import { AbsentAPI } from './api-absents';

const LOCAL_STORAGE_KEY = 'catalog_state';

export class StateManager {
  static async getRemoteState(): Promise<State | undefined> {
    try {
      const [grades, subjects, absents] = await Promise.all([
        GradeAPI.fetchGrades(),
        SubjectAPI.fetchSubjects(),
        AbsentAPI.fetchAbsents(),
      ]);
      const state = new State(grades, subjects, absents, Date.now());
      return state;
    } catch (error) {
      return undefined;
    }
  }

  static async getState(): Promise<State> {
    try {
      const remoteState = await StateManager.getRemoteState();
      if (remoteState) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remoteState));
        }
        return remoteState;
      }
      return new State([], [], [], Date.now());
    } catch (error) {
      // Fallback to localStorage
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          return new State(parsed.grades, parsed.subjects, parsed.absents, parsed.timestamp);
        }
      }
      return new State([], [], [], Date.now());
    }
  }
}
