import { Pipe, PipeTransform } from '@angular/core';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    const date = parseISO(value); // Parse chuỗi thành đối tượng Date

    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`; // Ví dụ: "Today, 5:00 PM"
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'h:mm a')}`; // Ví dụ: "Yesterday, 5:00 PM"
    } else {
      return format(date, 'MMM d, yyyy, h:mm a'); // Ví dụ: "Jan 3, 2025, 5:00 PM"
    }
  }
}
