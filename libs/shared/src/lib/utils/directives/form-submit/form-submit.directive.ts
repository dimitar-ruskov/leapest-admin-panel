import { Directive, ElementRef } from '@angular/core';
import { shareReplay, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

@Directive({
  // tslint:disable-next-line
  selector: 'form[leapForm]'
})
export class FormSubmitDirective {
  submit$ = fromEvent(this.element, 'submit').pipe(
    tap(() => {
      if (this.element.classList.contains('submitted') === false) {
        this.element.classList.add('submitted');
      }
    }),
    shareReplay(1)
  );

  constructor(private host: ElementRef<HTMLFormElement>) {}

  get element() {
    return this.host.nativeElement;
  }
}
