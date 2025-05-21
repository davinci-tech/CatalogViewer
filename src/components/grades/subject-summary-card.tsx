
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export interface SubjectSummaryData {
  subjectID: string;
  subjectName: string; // Already formatted
  averageScore: number;
  allScores: number[];
}

interface SubjectSummaryCardProps {
  summary: SubjectSummaryData;
}

export function SubjectSummaryCard({ summary }: SubjectSummaryCardProps) {
  return (
    <Card className="shadow-md flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2 pt-4">
        <CardTitle 
          className="text-xs font-bold text-center break-words" 
          title={summary.subjectName}
          style={{ minHeight: '2.5em' }} // Reserve space for up to two lines, adjust as needed
        >
          {summary.subjectName}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center py-4">
        <p className="text-3xl">{summary.averageScore}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-2 pb-4 flex justify-center items-center">
        <span className="whitespace-nowrap text-center w-full">
          {summary.allScores.join(' ')}
        </span>
      </CardFooter>
    </Card>
  );
}
