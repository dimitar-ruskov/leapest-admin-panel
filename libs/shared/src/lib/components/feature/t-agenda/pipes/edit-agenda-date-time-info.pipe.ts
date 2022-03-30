import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'editAgendaDateTimeInfo'
})
export class EditAgendaDateTimeInfoPipe implements PipeTransform {
  transform(dayIndex: number | null): string {
    const day = dayIndex === null ? 'each day' : 'Day ' + (dayIndex + 1);

    return `Please assign a date and time for ${day} of your course. You can always edit this information.`;
  }
}
