
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { APIGrade } from '@/lib/api-grades';
import { SubjectDetailDrawerContent } from './subject-detail-drawer-content';

export interface SubjectSummaryData {
  subjectID: string;
  subjectName: string; // Already formatted
  averageScore: number;
  grades: APIGrade[]; // Changed from allScores
}

interface SubjectSummaryCardProps {
  summary: SubjectSummaryData;
}

export function SubjectSummaryCard({ summary }: SubjectSummaryCardProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="shadow-md flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <CardHeader className="pb-2 pt-4">
            <CardTitle
              className="text-xs font-bold text-center break-words min-h-[2.5em]"
              title={summary.subjectName}
            >
              {summary.subjectName}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center py-4">
            <p className="text-3xl">{summary.averageScore}</p>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground pt-2 pb-4 flex justify-center items-center">
            <span className="whitespace-nowrap text-center w-full">
              {summary.grades.map(g => g.score).join(' ')}
            </span>
          </CardFooter>
        </Card>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg p-0">
        <SubjectDetailDrawerContent subjectName={summary.subjectName} grades={summary.grades} />
      </SheetContent>
    </Sheet>
  );
}
