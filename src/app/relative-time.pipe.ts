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

    const date = parseISO(value);

    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`; 
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'h:mm a')}`; 
    } else {
      return format(date, 'MMM d, yyyy, h:mm a');
    }
  }
}
