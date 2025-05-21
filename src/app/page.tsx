
import { GradeAPI } from '@/lib/api-grades';
import type { APIGrade } from '@/lib/api-grades';
import { SubjectAPI } from '@/lib/api-subjects';
import type { APISubject } from '@/lib/api-subjects';
import { AbsentAPI } from '@/lib/api-absents';
import type { APIAbsent } from '@/lib/api-absents';
import { SubjectSummaryCard, type SubjectSummaryData as CardSubjectSummaryData } from '@/components/grades/subject-summary-card';
import { BookOpenCheck } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { PageRefreshControl } from '@/components/page-refresh-control'; // Added import

// Local interface for page data aggregation, distinct from the one in SubjectSummaryCard
interface PageSubjectSummaryData extends CardSubjectSummaryData {
  unmotivatedAbsencesCount: number;
  hasCurrentMonthUnmotivatedAbsences: boolean;
}

const formatSubjectName = (name: string): string => {
  const regex = /^\d{2}\.\s*/;
  return name.replace(regex, '').trim();
};

export default async function HomePage() {
  const grades: APIGrade[] = await GradeAPI.fetchGrades();
  const subjects: APISubject[] = await SubjectAPI.fetchSubjects();
  const absences: APIAbsent[] = await AbsentAPI.fetchAbsents();

  const subjectNameMap = new Map<string, string>();
  subjects.forEach(subject => {
    subjectNameMap.set(subject.subjectID, subject.name);
  });

  const gradesBySubject = new Map<string, APIGrade[]>();
  grades.forEach(grade => {
    const existing = gradesBySubject.get(grade.subjectID);
    if (existing) {
      existing.push(grade);
    } else {
      gradesBySubject.set(grade.subjectID, [grade]);
    }
  });

  const absencesBySubject = new Map<string, APIAbsent[]>();
  absences.forEach(absence => {
    const existing = absencesBySubject.get(absence.subjectID);
    if (existing) {
      existing.push(absence);
    } else {
      absencesBySubject.set(absence.subjectID, [absence]);
    }
  });

  const subjectSummaries: PageSubjectSummaryData[] = [];
  const allSubjectIDs = new Set([...gradesBySubject.keys(), ...absencesBySubject.keys()]);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  for (const subjectID of allSubjectIDs) {
    const rawSubjectName = subjectNameMap.get(subjectID) || `ID: ${subjectID}`;
    const formattedSubName = formatSubjectName(rawSubjectName);
    
    const subjectGrades = gradesBySubject.get(subjectID) || [];
    const subjectAbsences = absencesBySubject.get(subjectID) || [];

    if (subjectGrades.length === 0 && subjectAbsences.length === 0) continue;

    subjectGrades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let averageScore = 0;
    if (subjectGrades.length > 0) {
        const sumOfScores = subjectGrades.reduce((sum, grade) => sum + grade.score, 0);
        averageScore = Math.round(sumOfScores / subjectGrades.length); // Changed to Math.round
    }

    const unmotivatedAbsences = subjectAbsences.filter(absence => !absence.motivated);
    const unmotivatedAbsencesCount = unmotivatedAbsences.length;
    
    let hasCurrentMonthUnmotivatedAbsences = false;
    if (unmotivatedAbsencesCount > 0) {
      for (const absence of unmotivatedAbsences) {
        const absenceDate = new Date(absence.date);
        if (absenceDate.getFullYear() === currentYear && absenceDate.getMonth() === currentMonth) {
          hasCurrentMonthUnmotivatedAbsences = true;
          break;
        }
      }
    }
    
    subjectSummaries.push({
      subjectID,
      subjectName: formattedSubName,
      averageScore: subjectGrades.length > 0 ? averageScore : 0,
      grades: subjectGrades,
      absences: subjectAbsences,
      unmotivatedAbsencesCount: unmotivatedAbsencesCount,
      hasCurrentMonthUnmotivatedAbsences: hasCurrentMonthUnmotivatedAbsences,
    });
  }

  subjectSummaries.sort((a, b) => a.subjectName.localeCompare(b.subjectName));

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-end items-center mb-4 space-x-2"> {/* Wrapper for top-right controls */}
        <ModeToggle />
        <PageRefreshControl /> {/* Added PageRefreshControl */}
      </div>
      <header className="mb-10 text-center">
        <div className="inline-flex items-center space-x-3 mb-3">
          <BookOpenCheck className="h-10 w-10 text-primary sm:h-12 sm:w-12" />
          <h1 className="text-3xl sm:text-4xl font-bold">CatalogViewer</h1>
        </div>
        <p className="text-md sm:text-lg text-muted-foreground">
          Welcome! View your academic performance summary by subject. Click on a card for details.
        </p>
      </header>

      {subjectSummaries && subjectSummaries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjectSummaries.map((summary) => (
            <SubjectSummaryCard
              key={summary.subjectID}
              summary={summary}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
           <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-list text-muted-foreground/50"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
          <p className="text-xl text-muted-foreground text-center">
            No grade or absence summaries available at this time.
          </p>
          <p className="text-sm text-muted-foreground text-center">Please check back later or contact support if the issue persists.</p>
        </div>
      )}
    </div>
  );
}
