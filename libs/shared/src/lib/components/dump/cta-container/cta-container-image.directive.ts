import { Directive, HostBinding, Input } from '@angular/core';


@Directive({
  selector: '[leapCtaContainerImage]'
})
export class CtaContainerImageDirective {

  @HostBinding('style.height.px')
  @Input() height = 120;

  @HostBinding('style.width.px')
  @Input() width = 158;

  @HostBinding('style.border-radius.px')
  borderRadius = 6;
}
