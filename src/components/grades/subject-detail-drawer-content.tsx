
"use client";

import * as React from 'react';
import type { APIGrade } from '@/lib/api-grades';
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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUp, ArrowDown } from 'lucide-react';

interface SubjectDetailDrawerContentProps {
  subjectName: string;
  grades: APIGrade[];
}

type SortableColumn = 'score' | 'date' | 'lastUpdate';

export function SubjectDetailDrawerContent({ subjectName, grades }: SubjectDetailDrawerContentProps) {
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = React.useState<SortableColumn>('date');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection(column === 'score' ? 'desc' : 'desc'); // Default desc for score, desc for dates
    }
  };

  const sortedGrades = React.useMemo(() => {
    const sortable = [...grades];
    sortable.sort((a, b) => {
      let comparison = 0;
      if (sortColumn === 'score') {
        comparison = a.score - b.score;
      } else if (sortColumn === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortColumn === 'lastUpdate') {
        comparison = new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime();
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return sortable;
  }, [grades, sortColumn, sortDirection]);

  React.useEffect(() => {
    // Reset selection and sort when grades data changes (e.g., opening for a new subject)
    setSelectedRows(new Set());
    setSortColumn('date');
    setSortDirection('desc');
  }, [grades]);

  const getRowId = (grade: APIGrade) => grade.id; // Use stable grade ID

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      const allRowIds = new Set(sortedGrades.map(grade => getRowId(grade)));
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (rowId: string, checked: boolean | 'indeterminate') => {
    const newSelectedRows = new Set(selectedRows);
    if (checked === true) {
      newSelectedRows.add(rowId);
    } else {
      newSelectedRows.delete(rowId);
    }
    setSelectedRows(newSelectedRows);
  };

  const numSelected = selectedRows.size;
  const numTotal = sortedGrades.length;
  const allSelected = numTotal > 0 && numSelected === numTotal;
  const someSelected = numSelected > 0 && numSelected < numTotal;

  const SortableHeader = ({ column, label, className }: { column: SortableColumn, label: string, className?: string }) => (
    <TableHead className={cn("cursor-pointer", className)} onClick={() => handleSort(column)}>
      <div className="flex items-center">
        {label}
        {sortColumn === column && (
          sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
        )}
      </div>
    </TableHead>
  );

  return (
    <div className="flex flex-col h-full">
      <DrawerHeader className="text-left">
        <DrawerTitle>{subjectName} - Grade Details</DrawerTitle>
        <DrawerDescription>
          A detailed list of your grades for {subjectName}. Click column headers to sort.
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-4 flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          {sortedGrades.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={allSelected ? true : (someSelected ? 'indeterminate' : false)}
                      onCheckedChange={handleSelectAll}
                      disabled={numTotal === 0}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                  <SortableHeader column="score" label="Grade" className="w-[100px]" />
                  <SortableHeader column="date" label="Date" />
                  <SortableHeader column="lastUpdate" label="Update Time" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedGrades.map((grade) => {
                  const rowId = getRowId(grade);
                  const isSelected = selectedRows.has(rowId);
                  return (
                    <TableRow
                      key={rowId}
                      data-state={isSelected ? "selected" : ""}
                      onClick={() => handleSelectRow(rowId, !isSelected)}
                      className="cursor-pointer"
                    >
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSelectRow(rowId, checked)}
                          aria-label={`Select row for grade ID ${rowId}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{grade.score}</TableCell>
                      <TableCell>
                        <ClientDate dateString={grade.date} dateFormat="MMM dd, yyyy" />
                      </TableCell>
                      <TableCell>
                        <ClientDate dateString={grade.lastUpdate} dateFormat="MMM dd, yyyy HH:mm" />
                      </TableCell>
                    </TableRow>
                  );
                })}
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
        </ScrollArea>
      </div>
      <DrawerFooter className="flex-col sm:flex-row sm:justify-between items-center pt-2 border-t">
        <p className="text-sm text-muted-foreground mb-2 sm:mb-0">
          {numSelected} of {numTotal} row(s) selected.
        </p>
        <DrawerClose asChild>
          <Button variant="outline">Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </div>
  );
}
