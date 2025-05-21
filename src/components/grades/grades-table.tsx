"use client";

import type { APIGrade } from '@/lib/api-grades'; // Import APIGrade
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { format } from 'date-fns';

interface GradesTableProps {
  grades: APIGrade[]; // Use APIGrade
}

export function GradesTable({ grades }: GradesTableProps) {
  if (!grades || grades.length === 0) {
    return <p className="text-muted-foreground">No grades available at this time, or there was an issue fetching them.</p>;
  }

  // Sort grades by date descending (most recent first) as the API might not guarantee order
  // and the old mock API had sorting logic.
  const sortedGrades = [...grades].sort((a, b) => {
    // Ensure date objects are compared correctly
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // For descending order
  });


  return (
    <Table>
      <TableCaption>A list of your recent grades.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Subject ID</TableHead>
          <TableHead className="w-[150px] text-right">Date</TableHead>
          <TableHead className="w-[100px] text-right">Score</TableHead>
          <TableHead className="w-[150px] text-right">Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedGrades.map((grade, index) => (
          // Using index for key is okay if list is static or items have no stable IDs.
          // A better key would be a unique ID from the data if available.
          // For now, combining potentially unique fields with index for robustness.
          <TableRow key={`${grade.subjectID}-${grade.date.toISOString()}-${index}`}>
            <TableCell className="font-medium">{grade.subjectID}</TableCell>
            <TableCell className="text-right">
              {format(new Date(grade.date), 'MMM dd, yyyy')}
            </TableCell>
            <TableCell className="text-right">{grade.score}</TableCell>
            <TableCell className="text-right">
              {format(new Date(grade.lastUpdate), 'MMM dd, yyyy')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
