import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[leapTableGridSpacer]'
})
export class TableGridSpacerDirective {
  @HostBinding('class.leap-table-grid__spacer') className = true;
}
