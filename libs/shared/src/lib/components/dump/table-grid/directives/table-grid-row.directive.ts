import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  Optional,
  SkipSelf,
  ViewContainerRef,
} from '@angular/core';
import { TableGridRowTooltipDirective } from './table-grid-row-tooltip.directive';
import { fromEvent, merge, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Directive({
  selector: '[leapTableGridRow]',
})
@UntilDestroy()
export class TableGridRowDirective implements AfterViewInit, OnDestroy {
  private readonly nestedTooltipOrigins = new Set<ElementRef<HTMLElement>>();

  @HostBinding('class.leap-table-grid__row')
  className = true;

  @HostBinding('class.leap-table-grid__row--clickable')
  @Input()
  leapTableGridRowClickable: boolean;

  @HostBinding('class.leap-table-grid__row--disabled')
  @Input()
  leapTableGridRowDisabled: boolean;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly viewContainerRef: ViewContainerRef,
    @Optional() @SkipSelf() private readonly tableGridRowTooltip: TableGridRowTooltipDirective,
  ) {}

  ngAfterViewInit(): void {
    if (this.tableGridRowTooltip) {
      this.registerMouseEventListeners();
    }
  }

  ngOnDestroy(): void {}

  registerNestedTooltipOrigin(elementRef: ElementRef<HTMLElement>): void {
    if (!this.nestedTooltipOrigins.has(elementRef)) {
      this.nestedTooltipOrigins.add(elementRef);
    }
  }

  unregisterNestedTooltipOrigin(elementRef: ElementRef<HTMLElement>): void {
    if (this.nestedTooltipOrigins.has(elementRef)) {
      this.nestedTooltipOrigins.delete(elementRef);
    }
  }

  private checkIfNestedTooltipOrigin(target: Node): boolean {
    for (const origin of this.nestedTooltipOrigins.values()) {
      const originEl = origin.nativeElement;

      if (originEl === target || originEl.contains(target)) {
        return true;
      }
    }

    return false;
  }

  private createMouseEnterListener(el: HTMLElement): Observable<{ event: MouseEvent; type: string }> {
    return fromEvent(el, 'mouseover').pipe(
      map((event: MouseEvent) => ({ event, type: 'mouseenter' })),
      filter(({ event }) => {
        const enteredNestedTooltipOrigin: boolean = this.checkIfNestedTooltipOrigin(event.target as Node);

        if (!enteredNestedTooltipOrigin) {
          const enteredFromNestedTooltipOrigin: boolean = this.checkIfNestedTooltipOrigin(event.relatedTarget as Node);

          return !el.contains(event.relatedTarget as Node) || enteredFromNestedTooltipOrigin;
        } else {
          return false;
        }
      }),
    );
  }

  private createMouseLeaveListener(el: HTMLElement): Observable<{ event: MouseEvent; type: string }> {
    return fromEvent(el, 'mouseout').pipe(
      map((event: MouseEvent) => ({ event, type: 'mouseleave' })),
      filter(({ event }) => {
        const enteredFromNestedTooltipOrigin: boolean = this.checkIfNestedTooltipOrigin(event.relatedTarget as Node);

        return !el.contains(event.relatedTarget as Node) || enteredFromNestedTooltipOrigin;
      }),
    );
  }

  private registerMouseEventListeners(): void {
    const el = this.elementRef.nativeElement;

    if (el) {
      const mouseEnter$ = this.createMouseEnterListener(el);
      const mouseLeave$ = this.createMouseLeaveListener(el);

      merge(mouseEnter$, mouseLeave$)
        .pipe(untilDestroyed(this))
        .subscribe(({ type }) => {
          switch (type) {
            case 'mouseenter':
              this.tableGridRowTooltip.show(this.elementRef);
              break;
            case 'mouseleave':
              this.tableGridRowTooltip.hide();
              break;
          }
        });
    }
  }
}
