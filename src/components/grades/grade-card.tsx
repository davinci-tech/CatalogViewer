
"use client";

import type { APIGrade } from '@/lib/api-grades';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientDate } from '@/components/ui/client-date';

interface GradeCardProps {
  grade: APIGrade;
  subjectName: string;
}

const formatSubjectName = (name: string): string => {
  const regex = /^\d{2}\.\s*/;
  return name.replace(regex, '').trim();
};

export function GradeCard({ grade, subjectName }: GradeCardProps) {
  return (
    <Card className="shadow-md flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-xs font-bold truncate" title={formatSubjectName(subjectName)}>
          {formatSubjectName(subjectName)}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center py-4">
        <p className="text-3xl font-medium">{grade.score}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-2 pb-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-1 sm:space-y-0">
        <span className="whitespace-nowrap">
          Date: <ClientDate dateString={grade.date} dateFormat="MMM dd, yyyy" />
        </span>
        <span className="whitespace-nowrap">
          Updated: <ClientDate dateString={grade.lastUpdate} dateFormat="MMM dd, yyyy" />
        </span>
      </CardFooter>
    </Card>
  );
}
