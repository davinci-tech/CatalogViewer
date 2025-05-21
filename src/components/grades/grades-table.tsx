"use client";

import type { Grade } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface GradesTableProps {
  grades: Grade[];
}

export function GradesTable({ grades }: GradesTableProps) {
  if (!grades || grades.length === 0) {
    return <p className="text-muted-foreground">No grades available at this time.</p>;
  }

  const getGradeBadgeVariant = (grade: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (grade.startsWith('A') || grade.toLowerCase() === 'pass' || parseInt(grade) >= 90) return 'default';
    if (grade.startsWith('B') || parseInt(grade) >= 80) return 'secondary';
    if (grade.startsWith('C') || parseInt(grade) >= 70) return 'outline'; // Using outline for 'C' or average for neutrality
    return 'destructive'; // For D, F, Fail or low scores
  };


  return (
    <Table>
      <TableCaption>A list of your recent grades.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Subject</TableHead>
          <TableHead>Assignment</TableHead>
          <TableHead className="w-[150px] text-right">Date</TableHead>
          <TableHead className="w-[100px] text-right">Grade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {grades.map((grade) => (
          <TableRow key={grade.id}>
            <TableCell className="font-medium">{grade.subject}</TableCell>
            <TableCell>{grade.assignment}</TableCell>
            <TableCell className="text-right">
              {format(new Date(grade.date), 'MMM dd, yyyy')}
            </TableCell>
            <TableCell className="text-right">
              <Badge variant={getGradeBadgeVariant(grade.grade)}>{grade.grade}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
