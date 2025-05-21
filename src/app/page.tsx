
import { GradeAPI } from '@/lib/api-grades';
import type { APIGrade } from '@/lib/api-grades';
import { SubjectAPI } from '@/lib/api-subjects';
import type { APISubject } from '@/lib/api-subjects';
import { GradeCard } from '@/components/grades/grade-card';
import { BookOpenCheck } from 'lucide-react';

export default async function HomePage() {
  const grades: APIGrade[] = await GradeAPI.fetchGrades();
  const subjects: APISubject[] = await SubjectAPI.fetchSubjects();

  const subjectNameMap = new Map<string, string>();
  subjects.forEach(subject => {
    subjectNameMap.set(subject.subjectID, subject.name);
  });

  // Sort grades by date descending (most recent first) for card display order
  const sortedGrades = [...grades].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center space-x-3 mb-3">
          <BookOpenCheck className="h-10 w-10 text-primary sm:h-12 sm:w-12" />
          <h1 className="text-3xl sm:text-4xl font-bold">CatalogViewer</h1>
        </div>
        <p className="text-md sm:text-lg text-muted-foreground">
          Welcome! View your academic performance below.
        </p>
      </header>

      {sortedGrades && sortedGrades.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedGrades.map((grade, index) => (
            <GradeCard
              key={`${grade.subjectID}-${grade.date.toISOString()}-${grade.score}-${index}`} // More robust key
              grade={grade}
              subjectName={subjectNameMap.get(grade.subjectID) || `ID: ${grade.subjectID}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
           <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-list text-muted-foreground/50"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
          <p className="text-xl text-muted-foreground text-center">
            No grades available at this time, or there was an issue fetching them.
          </p>
          <p className="text-sm text-muted-foreground text-center">Please check back later or contact support if the issue persists.</p>
        </div>
      )}
    </div>
  );
}
