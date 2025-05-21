
"use client";

import * as React from 'react';
import type { APIGrade } from '@/lib/api-grades';
import type { APIAbsent } from '@/lib/api-absents'; // Added
import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ClientDate } from '@/components/ui/client-date';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator'; // Added
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from "@/lib/utils";

interface SubjectDetailDrawerContentProps {
  subjectName: string;
  grades: APIGrade[];
  absences: APIAbsent[]; // Added
}

type SortableGradeColumn = 'score' | 'date' | 'lastUpdate';
type SortableAbsenceColumn = 'date' | 'motivated' | 'lastUpdate'; // Added

export function SubjectDetailDrawerContent({ subjectName, grades, absences }: SubjectDetailDrawerContentProps) {
  const [gradeSortColumn, setGradeSortColumn] = React.useState<SortableGradeColumn>('date');
  const [gradeSortDirection, setGradeSortDirection] = React.useState<'asc' | 'desc'>('desc');
  
  const [absenceSortColumn, setAbsenceSortColumn] = React.useState<SortableAbsenceColumn>('date'); // Added
  const [absenceSortDirection, setAbsenceSortDirection] = React.useState<'asc' | 'desc'>('desc'); // Added
  
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleGradeSort = (column: SortableGradeColumn) => {
    if (gradeSortColumn === column) {
      setGradeSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setGradeSortColumn(column);
      setGradeSortDirection(column === 'score' ? 'desc' : 'desc');
    }
  };

  const handleAbsenceSort = (column: SortableAbsenceColumn) => { // Added
    if (absenceSortColumn === column) {
      setAbsenceSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setAbsenceSortColumn(column);
      setAbsenceSortDirection('desc'); // Default desc for all absence columns initially
    }
  };

  const sortedGrades = React.useMemo(() => {
    const sortable = [...grades];
    sortable.sort((a, b) => {
      let comparison = 0;
      if (gradeSortColumn === 'score') {
        comparison = a.score - b.score;
      } else if (gradeSortColumn === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (gradeSortColumn === 'lastUpdate') {
        comparison = new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime();
      }
      return gradeSortDirection === 'asc' ? comparison : -comparison;
    });
    return sortable;
  }, [grades, gradeSortColumn, gradeSortDirection]);

  const sortedAbsences = React.useMemo(() => { // Added
    const sortable = [...absences];
    sortable.sort((a, b) => {
      let comparison = 0;
      if (absenceSortColumn === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (absenceSortColumn === 'motivated') {
        // true (motivated) comes before false (unmotivated) when 'asc'
        // false (unmotivated) comes before true (motivated) when 'desc'
        if (a.motivated === b.motivated) comparison = 0;
        else if (a.motivated) comparison = -1; // true is "smaller"
        else comparison = 1; // false is "larger"
      } else if (absenceSortColumn === 'lastUpdate') {
        comparison = new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime();
      }
      return absenceSortDirection === 'asc' ? comparison : -comparison;
    });
    return sortable;
  }, [absences, absenceSortColumn, absenceSortDirection]);

  React.useEffect(() => {
    setGradeSortColumn('date');
    setGradeSortDirection('desc');
    setAbsenceSortColumn('date'); 
    setAbsenceSortDirection('desc'); 

    const timer = setTimeout(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    }, 150);

    return () => clearTimeout(timer);
  }, [grades, absences]);

  const SortableHeader = <T extends string>({ column, label, currentSortColumn, currentSortDirection, handleSort, className }: { column: T, label: string, currentSortColumn: T, currentSortDirection: 'asc' | 'desc', handleSort: (col: T) => void, className?: string }) => (
    <TableHead className={cn("cursor-pointer", className)} onClick={() => handleSort(column)}>
      <div className="flex items-center">
        {label}
        {currentSortColumn === column && (
          currentSortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
        )}
      </div>
    </TableHead>
  );
  
  const SortableAbsenceHeader = ({ column, label, className }: { column: SortableAbsenceColumn, label: string, className?: string }) => (
    <TableHead className={cn("cursor-pointer", className)} onClick={() => handleAbsenceSort(column)}>
      <div className="flex items-center">
        {label}
        {absenceSortColumn === column && (
          absenceSortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
        )}
      </div>
    </TableHead>
  );


  return (
    <div className="flex flex-col h-full">
      <DrawerHeader className="text-left">
        <DrawerTitle>{subjectName} - Details</DrawerTitle>
        <DrawerDescription>
          Grade and absence information for {subjectName}.
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-4 flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          {/* Grade Details Section */}
          <h3 className="text-lg font-semibold mb-1 mt-0">Grade Details</h3>
          <p className="text-sm text-muted-foreground mb-3">
            A detailed list of your grades ({grades.length} in total). Click column headers to sort.
          </p>
          {sortedGrades.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader column="score" label="Grade" currentSortColumn={gradeSortColumn} currentSortDirection={gradeSortDirection} handleSort={handleGradeSort} className="w-[100px]" />
                  <SortableHeader column="date" label="Date" currentSortColumn={gradeSortColumn} currentSortDirection={gradeSortDirection} handleSort={handleGradeSort} />
                  <SortableHeader column="lastUpdate" label="Update Time" currentSortColumn={gradeSortColumn} currentSortDirection={gradeSortDirection} handleSort={handleGradeSort} />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedGrades.map((grade) => (
                    <TableRow key={grade.id}>
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
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-open-dot text-muted-foreground/70 mb-3"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h16Z"/><circle cx="12" cy="13" r="1"/></svg>
              <p className="text-sm text-muted-foreground">
                No detailed grades are currently available for {subjectName}.
              </p>
            </div>
          )}

          <Separator className="my-6" />

          {/* Absence Details Section */}
          <h3 className="text-lg font-semibold mb-1">Absence Details</h3>
           <p className="text-sm text-muted-foreground mb-3">
            A detailed list of your absences ({absences.length} in total). Click column headers to sort.
          </p>
          {sortedAbsences.length > 0 ? ( 
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableAbsenceHeader column="date" label="Date" className="w-[120px]" />
                  <SortableAbsenceHeader column="motivated" label="Motivated" className="w-[120px]" />
                  <SortableAbsenceHeader column="lastUpdate" label="Update Time" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAbsences.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell>
                        <ClientDate dateString={absence.date} dateFormat="MMM dd, yyyy" />
                      </TableCell>
                      <TableCell className="text-center">
                        {absence.motivated ? '✅' : '❌'}
                      </TableCell>
                      <TableCell>
                        <ClientDate dateString={absence.lastUpdate} dateFormat="MMM dd, yyyy HH:mm" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-x-2 text-muted-foreground/70 mb-3"><path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="m17 18-5-5"/><path d="m12 18 5-5"/></svg>
              <p className="text-sm text-muted-foreground">
                No absences recorded for {subjectName}.
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
      <DrawerFooter className="pt-2 border-t flex-shrink-0">
        <DrawerClose asChild>
          <Button variant="outline" ref={closeButtonRef}>Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </div>
  );
}
