import { Directive, HostBinding, Input } from '@angular/core';


@Directive({
  selector: '[leapTableGridRowCtaButton]'
})
export class TableGridRowCtaButtonDirective {
  @HostBinding('class.leap-table-grid__row-cta-button') className = true;

  @HostBinding('class.leap-table-grid__row-cta-button--danger')
  @Input('leapTableGridRowCtaButtonDanger') danger: boolean;

  @HostBinding('class.leap-table-grid__row-cta-button--disabled')
  @Input('leapTableGridRowCtaButtonDisabled') disabled: boolean;
}
