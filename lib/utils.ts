import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatDate(inputDateString: string): string {
  const inputDate = new Date(inputDateString);
  const today = new Date();

  if (
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  ) {
    // If the date is today, show only hours and minutes
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Intl.DateTimeFormat('en-US', options).format(inputDate);
  } else {
    // If the date is not today, show the full date
    const options: Intl.DateTimeFormatOptions = {

      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
     
    };
    return new Intl.DateTimeFormat('en-US', options).format(inputDate);
  }
}