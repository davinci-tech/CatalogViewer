import type { APIGrade } from './api-grades';
import type { APISubject } from './api-subjects';
import type { APIAbsent } from './api-absents';
import { assert } from 'console';

export enum StateDiffType {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  UPDATE = 'UPDATE',
}

/// Represents the difference between two states
/// If type is ADD, the data is the new object
/// If type is REMOVE, the data is the removed object
/// If type is UPDATE, the data is an array of the two objects, the first one being the old object and the second one being the new object
export interface StateDiff {
  type: StateDiffType;
  data: any;
}

export class State {
  grades: APIGrade[];
  subjects: APISubject[];
  absents: APIAbsent[];

  constructor(
    grades: APIGrade[] = [],
    subjects: APISubject[] = [],
    absents: APIAbsent[] = []
  ) {
    this.grades = grades;
    this.subjects = subjects;
    this.absents = absents;
  }

  public diffGrades(
    firstState: APIGrade[],
    secondState: APIGrade[]
  ): StateDiff[] {
    const diffs: StateDiff[] = [];
    const map: Record<string, { firstState?: APIGrade; secondState?: APIGrade }> = {};

    for (const grade of firstState) map[grade.id].firstState = grade;
    for (const grade of secondState) map[grade.id].secondState = grade;

    for (const [id, { firstState, secondState }] of Object.entries(map)) {
      if (firstState && secondState) {
        assert(typeof firstState === typeof secondState, 'Types do not match');
        for (const key of Object.keys(firstState) as (keyof APIGrade)[]) {
          if (firstState[key] !== secondState[key]) {
            diffs.push({
              type: StateDiffType.UPDATE,
              data: [firstState, secondState],
            });
            break;
          }
        }
      } else if (!firstState) {
        diffs.push({
          type: StateDiffType.ADD,
          data: secondState,
        });
      } else if (!secondState) {
        diffs.push({
          type: StateDiffType.REMOVE,
          data: firstState,
        });
      }
    }

    return diffs;
  }
}
