
"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface ClientDateProps {
  dateString: string | Date; // Accept string (ISO) or Date object
  dateFormat?: string;
  placeholder?: React.ReactNode;
}

export function ClientDate({ dateString, dateFormat = 'MMM dd, yyyy', placeholder = "---" }: ClientDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder on the server and initial client render
    // to prevent mismatch and avoid layout shift if possible.
    return <>{placeholder}</>;
  }

  try {
    // Ensure grade.date (which is a string after serialization) is parsed into a Date object
    const dateToFormat = new Date(dateString);
    // Check if date is valid after parsing
    if (isNaN(dateToFormat.getTime())) {
      console.error("Invalid date provided to ClientDate:", dateString);
      return <>Invalid date</>;
    }
    return <>{format(dateToFormat, dateFormat)}</>;
  } catch (error) {
    console.error("Error formatting date in ClientDate:", error);
    return <>Error</>;
  }
}
