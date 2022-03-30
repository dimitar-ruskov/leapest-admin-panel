import {
  Directive,
  HostBinding,
} from '@angular/core';

@Directive({
  selector: '[leapTableGrid]'
})
export class TableGridDirective {
  @HostBinding('class.leap-table-grid') className = true;
}
