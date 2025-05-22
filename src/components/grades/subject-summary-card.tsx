
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import React, { useEffect, useState } from 'react';
import type { APIGrade } from '@/lib/api-grades';
import type { APIAbsent } from '@/lib/api-absents';
import { SubjectDetailDrawerContent } from './subject-detail-drawer-content';
import { cn } from '@/lib/utils'; // Import cn
import { ScrollArea } from '@/components/ui/scroll-area';

export interface SubjectSummaryData {
  subjectID: string;
  subjectName: string;
  averageScore: number;
  grades: APIGrade[];
  absences: APIAbsent[];
  unmotivatedAbsencesCount: number;
  hasCurrentMonthUnmotivatedAbsences: boolean; // Added field
}

interface SubjectSummaryCardProps {
  summary: SubjectSummaryData;
}

export function SubjectSummaryCard({ summary }: SubjectSummaryCardProps) {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cardInteractiveContent = (
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
        <p className="text-3xl">{summary.grades.length > 0 ? summary.averageScore : '-'}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-2 pb-4 flex justify-between items-center">
        <span className="whitespace-nowrap">
          {summary.grades.length > 0 ? summary.grades.map(g => g.score).join(' ') : 'No grades'}
        </span>
        <span className={cn(
          "whitespace-nowrap",
          summary.hasCurrentMonthUnmotivatedAbsences && summary.unmotivatedAbsencesCount > 0 && "text-destructive"
        )}>
          {summary.unmotivatedAbsencesCount}
        </span>
      </CardFooter>
    </Card>
  );

  if (!mounted) {
    // Fallback for SSR and initial client render to avoid hydration mismatch
    return (
      <Card className="shadow-md flex flex-col justify-between h-full">
        <CardHeader className="pb-2 pt-4">
          <CardTitle
            className="text-xs font-bold text-center break-words min-h-[2.5em]"
            title={summary.subjectName}
          >
            {summary.subjectName}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center py-4">
          <p className="text-3xl">{summary.grades.length > 0 ? summary.averageScore : '-'}</p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground pt-2 pb-4 flex justify-between items-center">
           <span className="whitespace-nowrap">
            {summary.grades.length > 0 ? summary.grades.map(g => g.score).join(' ') : 'No grades'}
          </span>
          <span className={cn(
            "whitespace-nowrap",
             summary.hasCurrentMonthUnmotivatedAbsences && summary.unmotivatedAbsencesCount > 0 && "text-destructive"
          )}>
            {summary.unmotivatedAbsencesCount}
          </span>
        </CardFooter>
      </Card>
    );
  }

  // Mobile: isMobile (screen width < 768px) -> use Drawer (bottom sheet)
  // Desktop: !isMobile (screen width >= 768px) -> use Sheet (side panel, half screen)
  if (isMobile) { // Mobile
    return (
      <Drawer>
        <DrawerTrigger asChild>
          {cardInteractiveContent}
        </DrawerTrigger>
        {/** Inspired by "I fixed shadcn/ui Drawer for mobile": https://www.youtube.com/watch?v=QTtxeIJmN9o */}
        <DrawerContent className="max-h-[90%]">
          <ScrollArea className="overflow-y-auto pb-[3em]">
            <SubjectDetailDrawerContent 
              subjectName={summary.subjectName} 
              grades={summary.grades} 
              absences={summary.absences} 
              isSheet={false} 
            />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  } else { // Desktop
    return (
      <Sheet>
        <SheetTrigger asChild>
          {cardInteractiveContent}
        </SheetTrigger>
        <SheetContent side="right" className="md:w-1/2 md:max-w-none"> 
          <SubjectDetailDrawerContent 
            subjectName={summary.subjectName} 
            grades={summary.grades} 
            absences={summary.absences} 
            isSheet={true} 
          />
        </SheetContent>
      </Sheet>
    );
  }
}
