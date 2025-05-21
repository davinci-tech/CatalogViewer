
import { GradeAPI } from '@/lib/api-grades';
import type { APIGrade } from '@/lib/api-grades';
import { GradesTable } from '@/components/grades/grades-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpenCheck } from 'lucide-react'; // Changed icon to be more specific to grades/catalog

export default async function HomePage() {
  const grades: APIGrade[] = await GradeAPI.fetchGrades();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <BookOpenCheck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">CatalogViewer</h1>
        </div>
        <p className="text-muted-foreground">Welcome! View your academic performance below.</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">My Grades</CardTitle>
          <CardDescription>
            A comprehensive list of your grades, reflecting the latest updates from the school.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GradesTable grades={grades} />
        </CardContent>
      </Card>
    </div>
  );
}
