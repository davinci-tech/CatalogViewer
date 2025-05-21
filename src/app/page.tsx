
import { GradeAPI } from '@/lib/api-grades';
import type { APIGrade } from '@/lib/api-grades';
import { SubjectAPI } from '@/lib/api-subjects';
import type { APISubject } from '@/lib/api-subjects';
import { SubjectSummaryCard, type SubjectSummaryData } from '@/components/grades/subject-summary-card';
import { BookOpenCheck } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

const formatSubjectName = (name: string): string => {
  const regex = /^\d{2}\.\s*/;
  return name.replace(regex, '').trim();
};

export default async function HomePage() {
  const grades: APIGrade[] = await GradeAPI.fetchGrades();
  const subjects: APISubject[] = await SubjectAPI.fetchSubjects();

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

  const subjectSummaries: SubjectSummaryData[] = [];
  for (const [subjectID, subjectGrades] of gradesBySubject.entries()) {
    const rawSubjectName = subjectNameMap.get(subjectID) || `ID: ${subjectID}`;
    const formattedSubName = formatSubjectName(rawSubjectName);

    if (subjectGrades.length === 0) continue;

    // Sort grades by date descending for consistent processing
    subjectGrades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const sumOfScores = subjectGrades.reduce((sum, grade) => sum + grade.score, 0);
    const averageScore = Math.ceil(sumOfScores / subjectGrades.length);
    
    subjectSummaries.push({
      subjectID,
      subjectName: formattedSubName,
      averageScore,
      grades: subjectGrades, 
    });
  }

  // Sort summaries alphabetically by subject name
  subjectSummaries.sort((a, b) => a.subjectName.localeCompare(b.subjectName));

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-end mb-4">
        <ModeToggle />
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
            No grade summaries available at this time.
          </p>
          <p className="text-sm text-muted-foreground text-center">Please check back later or contact support if the issue persists.</p>
        </div>
      )}
    </div>
  );
}
