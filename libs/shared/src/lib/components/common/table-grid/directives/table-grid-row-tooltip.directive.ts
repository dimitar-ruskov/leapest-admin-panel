import { Directive, ElementRef, Input, OnDestroy, OnInit, Self } from '@angular/core';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { merge, of, Subject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { delay, switchMap } from 'rxjs/operators';

@Directive({
  selector: '[leapTableGridRowTooltip]',
})
@UntilDestroy()
export class TableGridRowTooltipDirective implements OnInit, OnDestroy {
  @Input('leapTableGridRowTooltipDelay') delay = 150;

  private readonly showTooltipSubject: Subject<ElementRef<HTMLElement>> = new Subject<ElementRef<HTMLElement>>();
  private readonly hideTooltipSubject: Subject<void> = new Subject<void>();

  constructor(private readonly elementRef: ElementRef, @Self() private tooltip: NzTooltipDirective) {}

  ngOnInit(): void {
    const show$ = this.showTooltipSubject.asObservable();
    const hide$ = this.hideTooltipSubject.asObservable();

    merge(hide$, show$)
      .pipe(
        switchMap((elementRef) => {
          if (!elementRef) {
            return of(false);
          }
          return of(elementRef).pipe(delay(this.delay));
        }),
        untilDestroyed(this),
      )
      .subscribe((elementRef: ElementRef<HTMLElement>) => {
        if (this.tooltip) {
          if (elementRef) {
            this.tooltip.origin = elementRef;
            this.destroyTooltipComponent();
            this.tooltip.ngAfterViewInit();
            this.tooltip.show();
          } else {
            this.tooltip.hide();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.showTooltipSubject.complete();
    this.hideTooltipSubject.complete();
  }

  show(elementRef: ElementRef<HTMLElement>): void {
    this.showTooltipSubject.next(elementRef);
  }

  hide(): void {
    this.hideTooltipSubject.next(null);
  }

  private destroyTooltipComponent(): void {
    if (this.tooltip) {
      this.tooltip.component?.overlay?.overlayRef?.detach();
      this.tooltip.component?.ngOnDestroy();
      this.tooltip.component = null;
    }
  }
}
