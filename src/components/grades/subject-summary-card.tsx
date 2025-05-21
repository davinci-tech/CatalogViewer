
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import React, { useEffect, useState } from 'react';
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
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile(); // Will be undefined on SSR and initial client render

  useEffect(() => {
    setMounted(true);
  }, []);

  // This is the visual content of the card, used as a trigger
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
        <p className="text-3xl">{summary.averageScore}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-2 pb-4 flex justify-center items-center">
        <span className="whitespace-nowrap text-center w-full">
          {summary.grades.map(g => g.score).join(' ')}
        </span>
      </CardFooter>
    </Card>
  );

  if (!mounted) {
    // Render a non-interactive version of the card during SSR and initial client render
    // to ensure server and client markup match before dynamic changes.
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
          <p className="text-3xl">{summary.averageScore}</p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground pt-2 pb-4 flex justify-center items-center">
          <span className="whitespace-nowrap text-center w-full">
            {summary.grades.map(g => g.score).join(' ')}
          </span>
        </CardFooter>
      </Card>
    );
  }

  // At this point, 'mounted' is true, and 'isMobile' is determined (true or false).
  // isMobile is true if screen width < 768px.
  // Desktop: !isMobile (screen width >= 768px) -> use Drawer
  // Mobile: isMobile (screen width < 768px) -> use Sheet
  if (!isMobile) { // Desktop
    return (
      <Drawer>
        <DrawerTrigger asChild>
          {cardInteractiveContent}
        </DrawerTrigger>
        <DrawerContent>
          <SubjectDetailDrawerContent subjectName={summary.subjectName} grades={summary.grades} />
        </DrawerContent>
      </Drawer>
    );
  } else { // Mobile
    return (
      <Sheet>
        <SheetTrigger asChild>
          {cardInteractiveContent}
        </SheetTrigger>
        <SheetContent side="right"> 
          <SubjectDetailDrawerContent subjectName={summary.subjectName} grades={summary.grades} />
        </SheetContent>
      </Sheet>
    );
  }
}
