import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'hasDayPassed'
})
export class HasDayPassedPipe implements PipeTransform {
  transform(dateStr: string): boolean {
    return moment(dateStr).isBefore(moment());
  }
}
