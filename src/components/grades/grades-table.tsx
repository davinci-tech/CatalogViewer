
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
import { ClientDate } from '@/components/ui/client-date'; // Import ClientDate

interface GradesTableProps {
  grades: APIGrade[]; // Use APIGrade
}

export function GradesTable({ grades }: GradesTableProps) {
  if (!grades || grades.length === 0) {
    return <p className="text-muted-foreground">No grades available at this time, or there was an issue fetching them.</p>;
  }

  // Sort grades by date descending (most recent first).
  // props.grades will have date fields as strings (serialized from server).
  // new Date(string) is used for comparison.
  const sortedGrades = [...grades].sort((a, b) => {
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
          // Key uses new Date().toISOString() which is fine as ISOString is consistent.
          <TableRow key={`${grade.subjectID}-${new Date(grade.date).toISOString()}-${index}`}>
            <TableCell className="font-medium">{grade.subjectID}</TableCell>
            <TableCell className="text-right">
              <ClientDate dateString={grade.date} />
            </TableCell>
            <TableCell className="text-right">{grade.score}</TableCell>
            <TableCell className="text-right">
              <ClientDate dateString={grade.lastUpdate} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
