
"use client";

import * as React from 'react';
import type { APIGrade } from '@/lib/api-grades';
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClientDate } from '@/components/ui/client-date';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SubjectDetailDrawerContentProps {
  subjectName: string;
  grades: APIGrade[];
}

export function SubjectDetailDrawerContent({ subjectName, grades }: SubjectDetailDrawerContentProps) {
  const sortedGrades = React.useMemo(() => {
    return [...grades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [grades]);

  return (
    <>
      <SheetHeader className="p-6 pb-4 border-b">
        <SheetTitle>{subjectName} - Grade Details</SheetTitle>
        <SheetDescription>
          A detailed list of your grades for {subjectName}, sorted by date (newest first).
        </SheetDescription>
      </SheetHeader>
      <ScrollArea className="h-[calc(100vh-100px)]"> {/* Adjusted height for header + padding */}
        <div className="p-6">
          {sortedGrades.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Grade</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Update Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedGrades.map((grade, index) => (
                  <TableRow key={`${grade.subjectID}-${grade.date.toString()}-${grade.score}-${index}`}>
                    <TableCell className="font-medium">{grade.score}</TableCell>
                    <TableCell>
                      <ClientDate dateString={grade.date} dateFormat="MMM dd, yyyy" />
                    </TableCell>
                    <TableCell>
                      <ClientDate dateString={grade.lastUpdate} dateFormat="MMM dd, yyyy HH:mm" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-open-dot text-muted-foreground/70 mb-4"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h16Z"/><circle cx="12" cy="13" r="1"/></svg>
              <p className="text-muted-foreground">
                No detailed grades are currently available for {subjectName}.
              </p>
              <p className="text-xs text-muted-foreground/80 mt-1">Check back later or if you believe this is an error, contact support.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
}
