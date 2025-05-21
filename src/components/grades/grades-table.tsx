
"use client";

import type { APIGrade } from '@/lib/api-grades';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { ClientDate } from '@/components/ui/client-date';

interface GradesTableProps {
  grades: APIGrade[];
  subjectNameMap: Map<string, string>;
}

export function GradesTable({ grades, subjectNameMap }: GradesTableProps) {
  if (!grades || grades.length === 0) {
    return <p className="text-muted-foreground">No grades available at this time, or there was an issue fetching them.</p>;
  }

  const sortedGrades = [...grades].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // Sort by date descending (most recent first)
  });

  const formatSubjectName = (name: string): string => {
    const regex = /^\d{2}\.\s*/;
    return name.replace(regex, '').trim();
  };

  return (
    <Table>
      <TableCaption>A list of your recent grades.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Subject</TableHead>
          <TableHead className="w-[150px] text-right">Date</TableHead>
          <TableHead className="w-[100px] text-right">Score</TableHead>
          <TableHead className="w-[150px] text-right">Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedGrades.map((grade, index) => (
          <TableRow key={`${grade.subjectID}-${new Date(grade.date).toISOString()}-${index}`}>
            <TableCell className="font-medium">
              {formatSubjectName(subjectNameMap.get(grade.subjectID) || grade.subjectID)}
            </TableCell>
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
